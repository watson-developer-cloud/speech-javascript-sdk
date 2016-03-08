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
var getUserMedia = require('get-user-media-promise');
var MicrophoneStream = require('microphone-stream');
var RecognizeStream = require('./recognize-stream.js');
var L16 = require('./webaudio-l16-stream.js');
var FormatStream = require('./format-stream.js');
var assign = require('object.assign/polyfill')();
var WritableElementStream = require('./writable-element-stream');
var Readable = require('stream').Readable;

var preservedMicStream;
var bitBucket = new Readable;

/**
 * @module watson-speech/speech-to-text/recognize-microphone
 */

/**
 * Create and return a RecognizeStream from the user's microphone
 * If the options.file is set, it is used instead of the microphone
 *
 * @param {Object} options - Also passed to {MediaElementAudioStream} and to {RecognizeStream}
 * @param {String} options.token - Auth Token - see https://github.com/watson-developer-cloud/node-sdk#authorization
 * @param {Boolean} [options.format=true] - pipe the text through a {FormatStream} which performs light formatting
 * @param {Boolean} [options.keepMicrophone=false] - keeps an internal reference to the microphone stream to reuse in subsequent calls (prevents multiple permissions dialogs in firefox)
 * @param {String|DOMElement} [options.outputElement] pipe the text to a WriteableElementStream targeting the specified element. Also defaults objectMode to true to enable interim results.
 *
 * @returns {RecognizeStream}
 */
module.exports = function recognizeMicrophone(options) {
  if (!options || !options.token) {
    throw new Error("WatsonSpeechToText: missing required parameter: opts.token");
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

  var keepMic = options.keepMicrophone;
  var getMicStream;
  if (keepMic && preservedMicStream) {
    preservedMicStream.unpipe(bitBucket);
    getMicStream = Promise.resolve(preservedMicStream);
  } else {
    getMicStream = getUserMedia({video: false, audio: true}).then(function (mic) {
      var micStream = new MicrophoneStream(mic, {
        objectMode: true,
        bufferSize: options.bufferSize
      });
      if (keepMic) {
        preservedMicStream = micStream;
      }
      return Promise.resolve(micStream);
    });
  }

  getMicStream.catch(function(err) {
    console.log(err);
  });

  getMicStream.then(function(micStream) {
    var l16Stream = new L16({writableObjectMode: true});

    micStream
      .pipe(l16Stream)
      .pipe(recognizeStream);

    function end() {
      micStream.unpipe(l16Stream);
      micStream.pipe(bitBucket); // otherwise it will buffer the audio from in between calls and prepend it to the next one
      l16Stream.end();
    }
    // trigger on both stop and end events:
    // stop will not fire when a stream ends due to a timeout or having continuous: false
    // but when stop does fire, we want to honor it immediately
    // end will always fire, but it may take a few moments after stop
    if (keepMic) {
      recognizeStream.on('end', end);
      recognizeStream.on('stop', end);
    } else {
      recognizeStream.on('end', micStream.stop.bind(micStream));
      recognizeStream.on('stop', micStream.stop.bind(micStream));
    }

  }).catch(recognizeStream.emit.bind(recognizeStream, 'error'));


  var stream = recognizeStream;
  if (options.format !== false) {
    stream = stream.pipe(new FormatStream(options));
    stream.stop = recognizeStream.stop.bind(recognizeStream);
  }

  if (options.outputElement) {
    stream.pipe(new WritableElementStream(options))
  }

  return stream;
};


