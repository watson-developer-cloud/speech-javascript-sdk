'use strict';

var Writable = require('stream').Writable;
var util = require('util');
var defaults = require('defaults');

/**
 * Writable stream that accepts results in either object or string mode and outputs the text to a supplied html element
 *
 * Can show interim results when in objectMode
 *
 * @todo: consider automatically setting the value attribute on <input> elements
 *
 * @param options
 * @param {String|DOMElement} options.outputElement
 * @param {Boolean} [options.clear=true] delete any previous text
 * @constructor
 */
function WritableElementStream(options) {
  this.options = options = defaults(options, {
    decodeStrings: false,  // false = don't convert strings to buffers before passing to _write (only applies in string mode)
    clear: true
  });

  this.el = typeof options.outputElement === 'string' ?  document.querySelector(options.outputElement) : options.outputElement;

  if (!this.el) {
    throw new Error('Watson Speech to Text WriteableElementStream: missing outputElement');
  }

  Writable.call(this, options);

  if (options.clear) {
    this.el.textContent = '';
  }

  if (options.objectMode) {
    this.finalizedText = this.el.textContent;
    this._write = this.writeObject;
  } else {
    this._write = this.writeString;
  }
}
util.inherits(WritableElementStream, Writable);


WritableElementStream.prototype.writeString = function writeString(text, encoding, next) {
  this.el.textContent += text;
  next();
};

WritableElementStream.prototype.writeObject = function writeObject(result, encoding, next) {
  if (result.final) {
    this.finalizedText += result.alternatives[0].transcript;
    this.el.textContent = this.finalizedText;
  } else {
    this.el.textContent = this.finalizedText + result.alternatives[0].transcript
  }
  next();
};

module.exports = WritableElementStream;
