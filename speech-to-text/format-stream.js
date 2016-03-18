'use strict';

var Transform = require('stream').Transform;
var util = require('util');
var clone = require('clone');
var defaults = require('defaults');

/**
 * Applies some basic formating to transcriptions:
 *  - Capitalize the first word of each sentence
 *  - Add a period to the end
 *  - Fix any "cruft" in the transcription
 *  - etc.
 *
 * @param {Object} opts
 * @param {String} opts.model - some models / languages need special handling
 * @param {String} [opts.hesitation='\u2026'] - what to put down for a "hesitation" event, defaults to an ellipsis (...)
 * @param {Boolean} [options.objectMode=false] - emit `result` objects instead of string Buffers for the `data` events.
 * @constructor
 */
function FormatStream(opts) {
  this.options = defaults(opts, {
    model: '', // some models should have all spaces removed
    hesitation: '\u2026', // ellipsis
    decodeStrings: false // false = don't convert strings to buffers before passing to _write
  });
  Transform.call(this, this.options);

  this.isJaCn = ((this.options.model.substring(0,5) === 'ja-JP') || (this.options.model.substring(0,5) === 'zh-CN'));
  this._transform = this.options.objectMode ? this.formatResult : this.formatString;
}
util.inherits(FormatStream, Transform);

var reHesitation = /%HESITATION\s/g; // when the service tetects a "hesitation" pause, it literally puts the string "%HESITATION" into the transcription
var reRepeatedCharacter = /(.)\1{2,}/g; // detect the same character repeated three or more times and remove it
var reDUnderscoreWords = /D_[^\s]+/g; // replace D_(anything)

/**
 * Formats one or more words, removing special symbols, junk, and spacing for some languages
 * @param {String} text
 * @param {Boolean} isFinal
 * @returns {String}
 */
FormatStream.prototype.clean = function clean(text) {
  // clean out "junk"
  text = text.trim().replace(reHesitation, this.options.hesitation)
    .replace(reRepeatedCharacter, '')
    .replace(reDUnderscoreWords,'');

  // short-circuit if there's no actual text (avoids getting multiple periods after a pause)
  if (!text) {
    return text;
  }

  // remove spaces for Japanese and Chinese
  if (this.isJaCn) {
    text = text.replace(/ /g,'');
  }

  return text;
};

/**
 * Capitalizes the first word of a sentence
 * @param {String} text
 * @returns {string}
 */
FormatStream.prototype.capitalize = function capitalize(text) {
  // capitalize first word, returns '' in the case of an empty word
  return text.charAt(0).toUpperCase() + text.substring(1);
};

/**
 * puts a period on the end of a sentence
 * @param {String} text
 * @returns {string}
 */
FormatStream.prototype.period = function period(text) {
  return text + (this.isJaCn ? '。' : '. ');
};

FormatStream.prototype.formatString = function(chunk, encoding, next) {
  this.push(this.period(this.capitalize(this.clean(chunk.toString()))));
  next();
};

/**
 * Creates a new result with all transcriptions formatted
 *
 * @param {Object} result
 * @param {String} encoding
 * @param {Function} next
 */
FormatStream.prototype.formatResult = function formatResult(result, encoding, next) {
  result = clone(result);
  result.alternatives = result.alternatives.map(function(alt) {
    alt.transcript = this.capitalize(this.clean(alt.transcript));
    if (result.final) {
      alt.transcript = this.period(alt.transcript);
    }
    if (alt.timestamps) {
      alt.timestamps = alt.timestamps.map(function(ts, i, arr) {
        // timestamps is an array of arrays, each sub-array is in the form ["word", startTime, endTime]'
        ts[0] = this.clean(ts[0]);
        if (i === 0) {
          ts[0] = this.capitalize(ts[0]);
        }
        if (i === arr.length - 1 && result.final) {
          ts[0] = this.period(ts[0]);
        }
        return ts;
      }, this);
      // todo: remove any timestamps without a word (due to cleaning out junk words)
    }
    return alt;
  }, this);
  this.push(result);
  next();
};

FormatStream.prototype.promise = require('./to-promise');

module.exports = FormatStream;
