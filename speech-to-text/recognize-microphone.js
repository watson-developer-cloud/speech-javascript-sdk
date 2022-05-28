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
var WritableElementStream = require('./writable-element-stream');
var { Writable } = require('readable-stream');
var ResultStream = require('./result-stream');
var SpeakerStream = require('./speaker-stream');

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
 * @param {String} options.token - Auth Token for CF services - see https://github.com/watson-developer-cloud/node-sdk#authorization
 * @param {String} options.accessToken - IAM Access Token for RC services - see https://github.com/watson-developer-cloud/node-sdk#authorization
 * @param {String} [options.url='wss://api.us-south.speech-to-text.watson.cloud.ibm.com'] - Base URL for a service instance
 * @param {Boolean} [options.format=true] - pipe the text through a FormatStream which performs light formatting. Also controls smart_formatting option unless explicitly set.
 * @param {Boolean} [options.keepMicrophone=false] - keeps an internal reference to the microphone stream to reuse in subsequent calls (prevents multiple permissions dialogs in firefox)
 * @param {String|DOMElement} [options.outputElement] pipe the text to a [WriteableElementStream](WritableElementStream.html) targeting the specified element. Also defaults objectMode to true to enable interim results.
 * @param {Boolean} [options.extractResults=false] pipe results through a ResultStream stream to simplify the objects. (Default behavior before v0.22) Requires objectMode.
 * @param {Boolean} [options.resultsBySpeaker=false] Pipe results through a SpeakerStream. Forces speaker_labels and objectMode to be true.
 * @param {MediaStream} [options.mediaStream] Optionally pass in an existing MediaStream
 *
 * @return {RecognizeStream|SpeakerStream|FormatStream|ResultStream}
 */
module.exports = function recognizeMicrophone(options) {
  if (!options || (!options.token && !options.accessToken)) {
    throw new Error('WatsonSpeechToText: missing required parameter: opts.token (CF) or opts.accessToken (RC)');
  }

  // the WritableElementStream works best in objectMode
  if (options.outputElement && options.objectMode !== false) {
    options.objectMode = true;
  }
  // the ResultExtractor only works in objectMode
  if (options.extractResults) {
    options.objectMode = true;
  }
  // SpeakerStream requires objectMode and speakerLabels
  if (options.resultsBySpeaker) {
    options.objectMode = true;
    options.speakerLabels = true;
  }

  // default format to true (capitals and periods)
  // default smartFormatting to options.format value (dates, currency, etc.)
  options.format = options.format !== false;
  if (typeof options.smartFormatting === 'undefined') {
    options.smartFormatting = options.format;
  }

  var rsOpts = Object.assign(
    {
      contentType: 'audio/l16;rate=16000',
      interimResults: true
    },
    options
  );

  var recognizeStream = new RecognizeStream(rsOpts);
  var streams = [recognizeStream]; // collect all of the streams so that we can bundle up errors and send them to the last one

  // set up the output first so that we have a place to emit errors
  // if there's trouble with the input stream
  var stream = recognizeStream;

  var keepMic = options.keepMicrophone;
  var micStream;
  if (keepMic && preservedMicStream) {
    preservedMicStream.unpipe(bitBucket);
    micStream = preservedMicStream;
  } else {
    // create the MicrophoneStream synchronously to allow it to resume the context in Safari on iOS 11
    micStream = new MicrophoneStream({
      objectMode: true,
      bufferSize: options.bufferSize
    });
    var pm = options.mediaStream ? Promise.resolve(options.mediaStream) : getUserMedia({ video: false, audio: true });
    pm.then(function(mediaStream) {
      micStream.setStream(mediaStream);
      if (keepMic) {
        preservedMicStream = micStream;
      }
    }).catch(function(err) {
      stream.emit('error', err);
      if (err.name === 'NotSupportedError') {
        stream.end(); // end the stream
      }
    });
  }

  var l16Stream = new L16({ writableObjectMode: true });

  micStream.pipe(l16Stream).pipe(recognizeStream);

  streams.push(micStream, l16Stream);

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
  // stop will not fire when a stream ends due to a timeout
  // but when stop does fire, we want to honor it immediately
  // end will always fire, but it may take a few moments after stop
  if (keepMic) {
    recognizeStream.on('end', end);
    recognizeStream.on('stop', end);
  } else {
    recognizeStream.on('end', micStream.stop.bind(micStream));
    recognizeStream.on('stop', micStream.stop.bind(micStream));
  }

  if (options.resultsBySpeaker) {
    stream = stream.pipe(new SpeakerStream(options));
    streams.push(stream);
  }

  if (options.format) {
    stream = stream.pipe(new FormatStream(options));
    streams.push(stream);
  }

  if (options.outputElement) {
    // we don't want to return the WES, just send data to it
    streams.push(stream.pipe(new WritableElementStream(options)));
  }

  if (options.extractResults) {
    stream = stream.pipe(new ResultStream());
    streams.push(stream);
  }

  // Capture errors from any stream except the last one and emit them on the last one
  streams.forEach(function(prevStream) {
    if (prevStream !== stream) {
      prevStream.on('error', stream.emit.bind(stream, 'error'));
    }
  });

  if (stream !== recognizeStream) {
    // add a stop button to whatever the final stream ends up being
    stream.stop = recognizeStream.stop.bind(recognizeStream);
  }

  // expose the original stream to for debugging (and to support the JSON tab on the STT demo)
  stream.recognizeStream = recognizeStream;

  return stream;
};

module.exports.isSupported = getUserMedia.isSupported;
