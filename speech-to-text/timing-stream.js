'use strict';

var Duplex = require('stream').Duplex;
var util = require('util');
var clone = require('clone');
var defaults = require('defaults');

/**
 * Slows results down to no faster than real time.
 *
 * Useful when running recognizeFile because the text can otherwise appear before the words are spoken
 *
 * @param {Object} [opts]
 * @param {*} [opts.emitAtt=TimingStream.START] - set to TimingStream.END to only emit text that has been completely spoken.
 * @param {Number} [opts.delay=0] - Additional delay (in seconds) to apply before emitting words, useful for precise syncing to audio tracks. May be negative
 * @constructor
 */
function TimingStream(opts) {
  this.options = defaults(opts, {
    emitAt: TimingStream.START,
    delay: 0,
    allowHalfOpen: true, // keep the readable side open after the source closes
    writableObjectMode: true
  });
  Duplex.call(this, opts);

  this.startTime = Date.now();
  // buffer to store future results
  this.final = [];
  this.interim = [];
  this.speakerLabels = [];
  this.nextTick = null;
  this.nextSpeakerLabelsTick = null;
  this.sourceEnded = false;

  var self = this;
  this.on('pipe', function(source) {
    source.on('end', function() {
      self.sourceEnded = true; // todo: see if there's anything built-in that does this for us
      self.checkForEnd();
    });
  });
}
util.inherits(TimingStream, Duplex);

TimingStream.START = 1;
TimingStream.END = 2;

TimingStream.prototype._write = function(data, encoding, next) {
  if (data instanceof Buffer) {
    return this.emit('error', new Error('TimingStream requires the source to be in objectMode'));
  }
  if (Array.isArray(data.results) && data.results.length) {
    this.handleResult(data);
  }
  if (Array.isArray(data.speaker_labels) && data.speaker_labels.length) {
    this.handleSpeakerLabels(data);
  }
  next();
};

TimingStream.prototype._read = function(/* size*/) {
  // ignore - we'll emit results once the time has come
};

TimingStream.prototype.cutoff = function cutoff() {
  return (Date.now() - this.startTime) / 1000 - this.options.delay;
};

TimingStream.prototype.withinRange = function(result, cutoff) {
  return result.results[0].alternatives.some(function(alt) {
    // timestamp structure is ["word", startTime, endTime]
    // if the first timestamp ends before the cutoff, then it's at least partially within range
    var timestamp = alt.timestamps[0];
    return !!timestamp && timestamp[this.options.emitAt] <= cutoff;
  }, this);
};

TimingStream.prototype.completelyWithinRange = function(result, cutoff) {
  return result.results[0].alternatives.every(function(alt) {
    // timestamp structure is ["word", startTime, endTime]
    // if the last timestamp ends before the cutoff, then it's completely within range
    var timestamp = alt.timestamps[alt.timestamps.length - 1];
    return timestamp[this.options.emitAt] <= cutoff;
  }, this);
};

/**
 * Clones the given result and then crops out any words that occur later than the current cutoff
 * @param {Object} data
 * @param {Number} cutoff timestamp (in seconds)
 * @returns {Object}
 */
Duplex.prototype.crop = function crop(data, cutoff) {
  data = clone(data);
  var result = data.results[0];
  result.alternatives = result.alternatives.map(function(alt) {
    var timestamps = [];
    for (var i = 0, timestamp; i < alt.timestamps.length; i++) {
      timestamp = alt.timestamps[i];
      if (timestamp[this.options.emitAt] <= cutoff) {
        timestamps.push(timestamp);
      } else {
        break;
      }
    }
    alt.timestamps = timestamps;
    alt.transcript = timestamps.map(function(ts) {
      return ts[0];
    }).join(' ');
    return alt;
  }, this);
  // "final" signifies both that the text won't change, and that we're at the end of a sentence. Only one of those is true here.
  result.final = false;
  return data;
};

/**
 * Returns one of:
 *  - undefined if the next result is completely later than the current cutoff
 *  - a cropped clone of the next result if it's later than the current cutoff && in objectMode
 *  - the original next result object (removing it from the array) if it's completely earlier than the current cutoff (or we're in string mode with emitAt set to start)
 *
 * @param {Object} results
 * @param {Number} cutoff
 * @returns {Object|undefined}
 */
TimingStream.prototype.getCurrentResult = function getCurrentResult(results, cutoff) {
  if (results.length && this.withinRange(results[0], cutoff)) {
    var completeResult = this.completelyWithinRange(results[0], cutoff);
    if (this.options.objectMode || this.options.readableObjectMode) {
      // object mode: emit either a complete result or a cropped result
      return completeResult ? results.shift() : this.crop(results[0], cutoff);
    } else if (completeResult || this.options.emitAt === TimingStream.START) {
      // string mode: emit either a complete result or nothing
      return results.shift();
    }
  }
};


/**
 * Tick emits any buffered words that have a timestamp before the current time, then calls scheduleNextTick()
 */
TimingStream.prototype.tick = function tick() {
  var cutoff = this.cutoff();

  clearTimeout(this.nextTick);
  var result = this.getCurrentResult(this.final, cutoff);

  if (!result) {
    result = this.getCurrentResult(this.interim, cutoff);
  }

  if (result) {
    if (this.options.objectMode || this.options.readableObjectMode) {
      this.push(result);
    } else {
      this.push(result.results[0].alternatives[0].transcript);
    }
    if (result.results[0].final) {
      this.nextTick = setTimeout(this.tick.bind(this), 0); // in case we are multiple results behind - don't schedule until we are out of final results that are due now
      return;
    }
  }

  this.scheduleNextTick(cutoff);
};

/**
 * Given a speaker labels message, returns the final to time
 * @param {Object} msg
 * @returns {Number}
 */
function getEnd(msg) {
  return msg.speaker_labels[msg.speaker_labels.length - 1].to;
}

TimingStream.prototype.tickSpeakerLables = function tickSpeakerLabels() {
  clearTimeout(this.nextSpeakerLabelsTick);
  if (getEnd(this.speakerLabels[0]) <= this.cutoff()) {
    this.push(this.speakerLabels.shift());
  }
  if (this.speakerLabels.length) {
    var nextMsg = this.speakerLabels[0];
    var nextTime = this.startTime + (getEnd(nextMsg) * 1000);
    this.nextSpeakerLabelsTick = setTimeout(this.tickSpeakerLables.bind(this, nextTime - Date.now()));
  } else {
    this.nextSpeakerLabelsTick = null;
    this.checkForEnd();
  }
};

/**
 * Schedules next tick if possible. Requires previous stream to emit recognize objects (objectMode or readableObjectMode)
 *
 * triggers the 'close' and 'end' events if the buffer is empty and no further results are expected
 *
 * @param {Number} cutoff
 *
 */
TimingStream.prototype.scheduleNextTick = function scheduleNextTick(cutoff) {

  // prefer final results over interim - when final results are added, any older interim ones are automatically deleted.
  var nextResult = this.final[0] || this.interim[0];
  if (nextResult) {
    // loop through the timestamps until we find one that comes after the current cutoff (there should always be one)
    var timestamps = nextResult.results[0].alternatives[0].timestamps;
    for (var i = 0; i < timestamps.length; i++) {
      var wordOffset = timestamps[i][this.options.emitAt];
      if (wordOffset > cutoff) {
        var nextTime = this.startTime + (wordOffset * 1000);
        this.nextTick = setTimeout(this.tick.bind(this), nextTime - Date.now());
        return;
      }
    }
    throw new Error('No future words found'); // this shouldn't happen ever - getCurrentResult should automatically delete the result from the buffer if all of it's words are consumed
  } else {
    // clear the next tick
    this.nextTick = null;
    this.checkForEnd();
  }
};

/**
 * Triggers the 'close' and 'end' events if both pre-conditions are true:
 *  - the previous stream must have already emitted it's 'end' event
 *  - there must be no next tick scheduled, indicating that there are no results buffered for later delivery
 */
TimingStream.prototype.checkForEnd = function() {
  if (this.sourceEnded && !this.nextTick && !this.nextSpeakerLabelsTick) {
    this.emit('close');
    this.push(null);
  }
};

/**
 * Returns true if the result is missing it's timestamps
 * @param {Object} data
 * @returns {Boolean}
 */
function noTimestamps(data) {
  return data.results.some(function(result) {
    var alt = result.alternatives && result.alternatives[0];
    return !!(alt && (alt.transcript.trim() && !alt.timestamps || !alt.timestamps.length));
  });
}

/**
 * Creates a new result with all transcriptions formatted
 *
 * @param {Object} data
 */
TimingStream.prototype.handleResult = function handleResult(data) {
  if (noTimestamps(data)) {
    this.emit('error', new Error('TimingStream requires timestamps'));
    return;
  }

  // http://www.ibm.com/watson/developercloud/speech-to-text/api/v1/#SpeechRecognitionEvent
  var index = data.results[0].result_index;

  // process each result individually
  data.results.forEach(function(result) {
    // additional alternatives do not include timestamps, so we can't process and emit them correctly
    if (result.alternatives.length > 1) {
      result.alternatives.length = 1;
    }

    // loop through the buffer and delete any interim results with the same or lower index
    while (this.interim.length && this.interim[0].result_index <= index) {
      this.interim.shift();
    }

    // in case this data object had multiple results in it
    var newData = clone(data);
    data.results = [result];
    data.result_index = index;

    if (result.final) {
      // then add it to the final results array
      this.final.push(newData);
      // and reset the interim results array because anything there has now been superseded and should not be emitted.
      this.interim = [];
    } else {
      this.interim.push(newData);
    }

    index++;
  }, this);

  this.tick();
};

TimingStream.prototype.handleSpeakerLabels = function handleSpeakerLabels(data) {
  this.speakerLabels.push(data);
  this.tickSpeakerLables();
};

TimingStream.prototype.promise = require('./to-promise');

// when stop is called, immediately stop emitting results
TimingStream.prototype.stop = function stop() {
  this.emit('stop');
  clearTimeout(this.nextTick);
  clearTimeout(this.nextSpeakerLabelsTick);
  this.handleResult = this.handleSpeakerLabels = function noop(){}; // RecognizeStream.stop() closes the connection gracefully, so we will usually see one more result
  this.checkForEnd(); // in case the RecognizeStream already ended
};

module.exports = TimingStream;
