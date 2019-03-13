/**
 * Copyright 2015 IBM Corp. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use strict';
var MediaElementAudioStream = require('./media-element-audio-stream');
var L16 = require('watson-speech/speech-to-text/webaudio-l16-stream');
var RecognizeStream = require('watson-developer-cloud/lib/recognize-stream');
var FormatStream = require('watson-speech/speech-to-text/format-stream.js');
var assign = require('object.assign/polyfill')();
var WritableElementStream = require('watson-speech/speech-to-text/writable-element-stream');

/**
 * Recognize audio from a <audio> or <video> element
 *
 * @deprecated - This method has several quality issues, and so is no longer supported.
 *
 * @param {Object} options - Also passed to {MediaElementAudioStream} and to {RecognizeStream}
 * @param {String} options.token - Auth Token - see https://github.com/watson-developer-cloud/node-sdk#authorization
 * @param {MediaElement} options.element - the <video> or <audio> element to play
 * @param {Boolena} [options.format=true] - pipe the text through a {FormatStream} which performs light formatting
 * @param {String|DOMElement} [options.outputElement] pipe the text to a WriteableElementStream targeting the specified element. Also defaults objectMode to true to enable interim results.
 *
 * @return {RecognizeStream|FormatStream}
 */
module.exports = function recognizeElement(options) {
  if (!options || !options.token) {
    throw new Error('WatsonSpeechToText: missing required parameter: opts.token');
  }

  // the WritableElementStream works best in objectMode
  if (options.outputElement && options.objectMode !== false) {
    options.objectMode = true;
  }

  // we don't want the readable stream to have objectMode on the input even if we're setting it for the output
  var rsOpts = assign({}, options);
  rsOpts.readableObjectMode = options.objectMode;
  rsOpts['content-type'] = 'audio/l16;rate=16000';
  delete rsOpts.objectMode;

  var recognizeStream = new RecognizeStream(rsOpts);

  var sourceStream = new MediaElementAudioStream(options.element, {
    objectMode: true,
    bufferSize: options.bufferSize,
    muteSource: options.muteSource,
    autoPlay: options.autoPlay !== false // default to true if it's undefined
  });

  var stream = sourceStream.pipe(new L16({ writableObjectMode: true })).pipe(recognizeStream);

  if (options.format !== false) {
    stream = stream.pipe(new FormatStream(options));
    stream.stop = recognizeStream.stop.bind(recognizeStream);
  }

  recognizeStream.on('stop', sourceStream.stop.bind(sourceStream));

  if (options.outputElement) {
    stream.pipe(new WritableElementStream(options));
  }

  return stream;
};
