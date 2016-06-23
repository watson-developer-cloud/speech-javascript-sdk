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
var Writable = require('stream').Writable;

var preservedMicStream;
var bitBucket = new Writable({
  write: function(chunk, encoding, callback) {
    // when the keepMicrophone option is enabled, unused audio data is sent here so that it isn't buffered by other streams.
    callback();
  },
  objectMode: true, // can still accept strings/buffers
  decodeStrings: false
});

/**
 * @module watson-speech/speech-to-text/recognize-microphone
 */

/**
 * Create and return a RecognizeStream sourcing audio from the user's microphone
 *
 * @param {Object} options - Also passed to {RecognizeStream}, and {FormatStream} when applicable
 * @param {String} options.token - Auth Token - see https://github.com/watson-developer-cloud/node-sdk#authorization
 * @param {Boolean} [options.format=true] - pipe the text through a {FormatStream} which performs light formatting
 * @param {Boolean} [options.keepMicrophone=false] - keeps an internal reference to the microphone stream to reuse in subsequent calls (prevents multiple permissions dialogs in firefox)
 * @param {String|DOMElement} [options.outputElement] pipe the text to a WriteableElementStream targeting the specified element. Also defaults objectMode to true to enable interim results.
 *
 * @returns {RecognizeStream|FormatStream}
 */
module.exports = function recognizeMicrophone(options) {
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

  var keepMic = options.keepMicrophone;
  var getMicStream;
  if (keepMic && preservedMicStream) {
    preservedMicStream.unpipe(bitBucket);
    getMicStream = Promise.resolve(preservedMicStream);
  } else {
    getMicStream = getUserMedia({video: false, audio: true}).then(function(mic) {
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

  // set up the output first so that we have a place to emit errors
  // if there's trouble with the input stream
  var stream = recognizeStream;
  if (options.format !== false) {
    stream = stream.pipe(new FormatStream(options));
    stream.stop = recognizeStream.stop.bind(recognizeStream);
  }

  if (options.outputElement) {
    stream.pipe(new WritableElementStream(options));
  }

  getMicStream.catch(function(err) {
    stream.emit('error', err);
  });

  getMicStream.then(function(micStream) {
    var l16Stream = new L16({writableObjectMode: true});

    micStream
      .pipe(l16Stream)
      .pipe(recognizeStream);

    /**
     * unpipes the mic stream to prevent any more audio from being sent over the wire
     * temporarily re-pipes it to the bitBucket (basically /dev/null)  becuse
     * otherwise it will buffer the audio from in between calls and prepend it to the next one
     *
     * @private
     */
    function end() {
      micStream.unpipe(l16Stream);
      micStream.pipe(bitBucket);
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


  return stream;
};


