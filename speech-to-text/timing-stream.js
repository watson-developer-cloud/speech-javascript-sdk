'use strict';

var Duplex = require('stream').Duplex;
var util = require('util');
var defaults = require('defaults');
var noTimestamps = require('./no-timestamps');

/**
 * Slows results down to no faster than real time.
 *
 * Useful when running recognizeFile because the text can otherwise appear before the words are spoken
 *
 * Note: when combined with a SpeakerStream, the TimingStream must come first
 * @todo: fix TimingStream to work with the output of the SpeakerStream
 *
 * @param {Object} [opts]
 * @param {*} [opts.emitAt=TimingStream.START] - set to TimingStream.END to only emit text that has been completely spoken.
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

  // queue to store future messages
  this.messages = [];

  // setTimeout handle. if null, next tick will occur whenever new data arrives
  this.nextTick = null;

  // this stream cannot end until both the messages queue is empty and the source stream has ended
  this.sourceEnded = false;

  var self = this;
  this.on('finish', function() {
    self.sourceEnded = true; // todo: see if there's anything built-in that does this for us
    self.checkForEnd();
  });
}
util.inherits(TimingStream, Duplex);

TimingStream.START = 1;
TimingStream.END = 2;

TimingStream.prototype._write = function(msg, encoding, next) {
  if (msg instanceof Buffer) {
    return this.emit('error', new Error('TimingStream requires the source to be in objectMode'));
  }
  if (Array.isArray(msg.results) && msg.results.length && noTimestamps(msg)) {
    var err = new Error('TimingStream requires timestamps');
    err.name = noTimestamps.ERROR_NO_TIMESTAMPS;
    this.emit('error', err);
    return;
  }

  this.messages.push(msg);

  if (!this.nextTick) {
    this.scheduleNextTick();
  }
  next();
};

TimingStream.prototype._read = function(/* size*/) {
  // ignore - we'll emit results once the time has come
};

TimingStream.prototype.cutoff = function cutoff() {
  return (Date.now() - this.startTime) / 1000 - this.options.delay;
};

/**
 * Grabs the appropriate timestamp from the given message, depending on options.emitAt and the type of message
 *
 * @private
 * @param {Object} msg
 * @returns {Number} timestamp
 */
TimingStream.prototype.getMessageTime = function(msg) {
  if (this.options.emitAt === TimingStream.START) {
    if (Array.isArray(msg.results) && msg.results.length) {
      return msg.results[0].alternatives[0].timestamps[0][TimingStream.START];
    } else if (Array.isArray(msg.speaker_labels) && msg.speaker_labels.length) {
      return msg.speaker_labels[0].from;
    }
  } else {
    if (Array.isArray(msg.results) && msg.results.length) {
      var timestamps = msg.results[msg.results.length - 1].alternatives[0].timestamps;
      return timestamps[timestamps.length - 1][TimingStream.END];
    } else if (Array.isArray(msg.speaker_labels) && msg.speaker_labels.length) {
      return msg.speaker_labels[msg.speaker_labels.length - 1].to;
    }
  }
  return 0; // failsafe for unknown message types
};

/**
 * Returns one of:
 *  - null if the next result is completely later than the current cutoff
 *  - the original next result object (removing it from the array) if it's completely earlier than the current cutoff
 *  (or it's partially within range and emitAt is set to start)
 *
 * @private
 * @returns {Object|null}
 */
TimingStream.prototype.getCurrentResult = function getCurrentResult() {
  if (!this.messages.length) {
    return null;
  }
  if (this.getMessageTime(this.messages[0]) <= this.cutoff()) {
    return this.messages.shift();
  }
};


/**
 * Tick emits any buffered words that have a timestamp before the current time, then calls scheduleNextTick()
 *
 * @private
 */
TimingStream.prototype.tick = function tick() {
  var msg;
  // eslint-disable-next-line no-cond-assign
  while (msg = this.getCurrentResult()) {
    if (this.options.objectMode || this.options.readableObjectMode) {
      this.push(msg);
    } else if (Array.isArray(msg.results && msg.results.length)) {
      this.push(msg.results[0].alternatives[0].transcript);
    }
  }

  this.scheduleNextTick();
};

/**
 * Given a speaker labels message, returns the final to time
 *
 * @private
 * @param {Object} msg
 * @returns {Number}
 */
function getEnd(msg) {
  return msg.speaker_labels[msg.speaker_labels.length - 1].to;
}

TimingStream.prototype.tickSpeakerLables = function tickSpeakerLabels() {
  clearTimeout(this.nextSpeakerLabelsTick);
  if (this.speakerLabels.length && getEnd(this.speakerLabels[0]) <= this.cutoff()) {
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
 * Schedules next tick or checks for the end of the results
 *
 * @private
 */
TimingStream.prototype.scheduleNextTick = function scheduleNextTick() {
  clearTimeout(this.nextTick); // just in case
  if (this.messages.length) {
    var messageTime = this.getMessageTime(this.messages[0]);
    var nextTickTime = this.startTime + (messageTime * 1000); // ms since epoch
    var nextTickOffset = Math.min(0, nextTickTime - Date.now()); // ms from right now
    this.nextTick = setTimeout(this.tick.bind(this), nextTickOffset);
  } else {
    this.nextTick = null;
    this.checkForEnd();
  }
};

/**
 * Triggers the 'close' and 'end' events if both pre-conditions are true:
 *  - the previous stream must have already emitted it's 'end' event
 *  - there must be no next tick scheduled, indicating that there are no results buffered for later delivery
 *
 * @private
 */
TimingStream.prototype.checkForEnd = function() {
  if (this.sourceEnded && !this.nextTick) {
    this.emit('close');
    this.push(null);
  }
};


TimingStream.prototype.promise = require('./to-promise');

// when stop is called, immediately stop emitting results
TimingStream.prototype.stop = function stop() {
  this.emit('stop');
  this.checkForEnd(); // in case the RecognizeStream already ended
  clearTimeout(this.nextTick);
  this.nextTick = -1; // fake timer to prevent _write from scheduling new ticks
};

module.exports = TimingStream;
