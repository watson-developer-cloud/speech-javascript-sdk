'use strict';

var Transform = require('stream').Transform;
var util = require('util');
var clone = require('clone');

/**
 * Applies some basic formating to transcriptions:
 *  - Capitalize the first word of each sentence
 *  - Add a period to the end
 *  - Fix any "cruft" in the transcription
 *  - etc.
 *
 * @param opts
 * @param opts.model - some models / languages need special handling
 * @param [opts.hesitation='\u2026'] - what to put down for a "hesitation" event, defaults to an ellipsis (...)
 * @constructor
 */
function TimingStream(opts) {
  this.opts = util._extend({
    emitAt: TimingStream.WORD_START // WORD_START = emit the word as it's beginning to be spoken, WORD_END = once it's completely spoken
  }, opts);
  Transform.call(this, opts);

  this.startTime = Date.now();
  // buffer to store future results
  this.final = [];
  this.interim = [];
  this.nextTick = null;

  var self = this;
  this.on('pipe', function(source) {
    source.on('result', self.handleResult.bind(self));
    if(source.stop) {
      self.stop = source.stop.bind(source);
    }
  });
}
util.inherits(TimingStream, Transform);

TimingStream.WORD_START = 1;
TimingStream.WORD_END = 2;

TimingStream.prototype._transform = function(chunk, encoding, next) {
  // ignore - we'll emit our own final text based on the result events
  next();
};

TimingStream.prototype.cutoff = function cutoff() {
  return (Date.now() - this.startTime)/1000;
};

TimingStream.prototype.withinRange = function(result, cutoff) {
  return result.alternatives.some(function(alt) {
    // timestamp structure is ["word", startTime, endTime]
    // if the first timestamp ends before the cutoff, then it's at least partially within range
    var timestamp = alt.timestamps[0];
    return !!timestamp && timestamp[this.opts.emitAt] <= cutoff;
  }, this);
};

TimingStream.prototype.completelyWithinRange = function(result, cutoff) {
  return result.alternatives.every(function(alt) {
    // timestamp structure is ["word", startTime, endTime]
    // if the last timestamp ends before the cutoff, then it's completely within range
    var timestamp = alt.timestamps[alt.timestamps.length - 1];
    return timestamp[this.opts.emitAt] <= cutoff;
  }, this);
};

/**
 * Clones the given result and then crops out any words that occur later than the current cutoff
 * @param result
 */
Transform.prototype.crop = function crop(result, cutoff) {
  result = clone(result);
  result.alternatives = result.alternatives.map(function(alt) {
    var timestamps = [];
    for (var i=0, timestamp; i<alt.timestamps.length; i++) {
      timestamp = alt.timestamps[i];
      if (timestamp[this.opts.emitAt] <= cutoff) {
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
  return result
};

/**
 * Returns one of:
 *  - undefined if the next result is completely later than the current cutoff
 *  - a cropped clone of the next result if it's later than the current cutoff
 *  - the original next result object (removing it from the array) if it's completely earlier than the current cutoff
 *
 * @param results
 * @returns {*}
 */
TimingStream.prototype.getCurrentResult = function getCurrentResult(results, cutoff) {
  if (results.length && this.withinRange(results[0], cutoff)) {
    return this.completelyWithinRange(results[0], cutoff) ? results.shift() : this.crop(results[0], cutoff);
  }
};

/**
 * try to figure out when we'll emit the next word
 * @param lastResultWasFinal
 * @param numCurrentTimestamps
 * @returns {*}
 */
TimingStream.prototype.getNextWordOffset = function getNextWordOffset(lastResultWasFinal, numCurrentTimestamps) {
  if (lastResultWasFinal) {
    // if the current result is final, then grab the first timestamp of the next one
    var nextResult = this.final[0] || this.interim[0];
    return nextResult && nextResult.alternatives[0].timestamps[0][this.opts.emitAt];
  } else {
    // if the current result wasn't final, then we just want the next word from the current result (assuming there is one)
    var currentResultSource = this.final[0] || this.interim[0];
    var nextTimestamp = currentResultSource && currentResultSource.alternatives[0].timestamps[numCurrentTimestamps];
    return nextTimestamp && nextTimestamp[this.opts.emitAt];
  }
};


/**
 * Tick occurs every half second, or when results are received if we're behind schedule.
 */
TimingStream.prototype.tick = function tick() {
  var cutoff = this.cutoff();

  this.nextTick = null;
  var result = this.getCurrentResult(this.final, cutoff);

  if (!result) {
    result = this.getCurrentResult(this.interim, cutoff);
  }

  if(result) {
    this.emit('result', result);
    if (result.final) {
      this.push(result.alternatives[0].transcript);
    }
    var nextWordOffset = this.getNextWordOffset(result.final, result.alternatives[0].timestamps.length);
    // if we have a next word, set a timeout to emit it. Otherwise the next call to handleResult() will trigger a tick.
    if (nextWordOffset) {
      this.nextTick = setTimeout(this.tick.bind(this), this.startTime + (nextWordOffset*1000));
    }
  }

};

function noTimestamps(result) {
  var alt = result.alternatives && result.alternatives[0];
  return alt && alt.transcript.trim() && !alt.timestamps || !alt.timestamps.length;
}

/**
 * Creates a new result with all transcriptions formatted
 *
 * @param result
 */
TimingStream.prototype.handleResult = function handleResult(result) {
  if (noTimestamps(result)) {
    throw new Error('TimingStream requires timestamps');
  }

  // additional alternatives do not include timestamps, so we can't process and emit them correctly
  if (result.alternatives.length > 1) {
    result.alternatives.length = 1;
  }

  // loop through the buffer and delete any interiml results with the same or lower index
  while(this.interim.length && this.interim[0].index <= result.index) {
    this.interim.shift();
  }

  if (result.final) {
    // then add it to the final results array
    this.final.push(result);
  } else {
    this.interim.push(result);
  }

  if (!this.nextTick) {
    this.tick();
  }
};

TimingStream.prototype.promise = require('./promise');

TimingStream.prototype.stop = function(){}; // usually overwritten during the `pipe` event


module.exports = TimingStream;
