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
var BlobStream = require('readable-blob-stream');
var RecognizeStream = require('./recognize-stream.js');
var FilePlayer = require('./file-player.js');
var FormatStream = require('./format-stream.js');
var TimingStream = require('./timing-stream.js');
var assign = require('object.assign/polyfill')();
var WritableElementStream = require('./writable-element-stream');

/**
 * @module watson-speech/speech-to-text/recognize-file
 */

/**
 * Create and return a RecognizeStream from a File or Blob
 * (e.g. from a file <input>, a dtagdrop targe, or an ajax request)
 *
 * @param {Object} options - Also passed to {MediaElementAudioStream} and to {RecognizeStream}
 * @param {String} options.token - Auth Token - see https://github.com/watson-developer-cloud/node-sdk#authorization
 * @param {Blob|File} options.data - the raw audio data as a Blob or File instance
 * @param {Boolean} [options.play=false] - If a file is set, play it locally as it's being uploaded
 * @param {Boolena} [options.format=true] - pipe the text through a {FormatStream} which performs light formatting
 * @param {Boolena} [options.realtime=options.play] - pipe the text through a {TimingStream} which slows the output down to real-time to match the audio playback.
 * @param {String|DOMElement} [options.outputElement] pipe the text to a WriteableElementStream targeting the specified element. Also defaults objectMode to true to enable interim results.
 *
 * @returns {RecognizeStream|FormatStream|TimingStream}
 */
module.exports = function recognizeFile(options) {
  if (!options || !options.token) {
    throw new Error('WatsonSpeechToText: missing required parameter: opts.token');
  }

  // the WritableElementStream works best in objectMode
  if (options.outputElement && options.objectMode !== false) {
    options.objectMode = true;
  }

  var realtime = options.realtime || typeof options.realtime === 'undefined' && options.play;

  // the timing stream requires timestamps to work, so enable them automatically
  if (realtime) {
    options.timestamps = true;
  }

  // we don't want the readable stream to have objectMode on the input even if we're setting it for the output
  // unless were in realtime mode - in which case the timing stream requires objectMode input.
  var rsOpts = assign({}, options);
  rsOpts.readableObjectMode = options.objectMode || realtime;
  delete rsOpts.objectMode;


  var recognizeStream = new RecognizeStream(rsOpts);
  var stream = new BlobStream(options.data).pipe(recognizeStream);

  if (options.format !== false) {
    stream = stream.pipe(new FormatStream(options));
  }
  if (realtime) {
    stream = stream.pipe(new TimingStream(options));
    stream.on('stop', recognizeStream.stop.bind(recognizeStream));
  } else {
    stream.stop = recognizeStream.stop.bind(recognizeStream);
  }

  if (options.play) {
    FilePlayer.playFile(options.data).then(function(player) {
      recognizeStream.on('stop', player.stop.bind(player));
    }).catch(function(err) {
      stream.emit('playback-error', err);
    });
  }

  if (options.outputElement) {
    stream.pipe(new WritableElementStream(options));
  }

  return stream;
};


