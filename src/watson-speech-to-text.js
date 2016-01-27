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
var defaults = require('lodash/defaults');
var getUserMedia = require('getusermedia');
var MicrophoneStream = require('microphone-stream');
var MediaElementAStream = require('./media-element-audio-stream');
var fileReaderStream = require('filereader-stream');
var RecognizeStream = require('./recognize-stream.js');
var WebAudioTo16leStream = require('./webaudio-to-16le-stream.js');
var FilePlayer = require('./file-player.js');

var SOURCE_MICROPHONE = exports.SOURCE_MICROPHONE = 'microphone';

/**
 * Create and return a RecognizeStream from the user's microphone
 * If the options.file is set, it is used instead of the microphone
 *
 * @param [options]
 * @param {DOMElement} [options.file] - Optional File Input DOM Element - if set, this is used as the audio source instead of the microphone
 * @param {Boolean} [options.playFile=true] - If a file is set, play it locally as it's being uploaded
 * @param {String} [options.model='en-US_BroadbandModel'] - voice model to use. Microphone streaming only supports broadband models.
 * @param {String} [options.url='wss://stream.watsonplatform.net/speech-to-text/api'] base URL for service
 * @param {String} [options.content-type='audio/l16;rate=16000'] - content type of audio; should be automatically determined in most cases
 * @param {Boolean} [options.interim_results=true] - Send back non-final previews of each "sentence" as it is being processed
 * @param {Boolean} [options.continuous=true] - set to false to automatically stop the transcription after the first "sentence"
 * @param {Boolean} [options.word_confidence=true] - include confidence scores with results
 * @param {Boolean} [options.timestamps=true] - include timestamps with results
 * @param {Number} [options.max_alternatives=3] - maximum number of alternative transcriptions to include
 * @param {Number} [options.inactivity_timeout=30] - how many seconds of silence before automatically closing the stream (even if continuous is true). use -1 for infinity
 * @param {Number} [options.bufferSize=] - size of buffer for microphone audio, leave unset to let browser determine it automatically
 *
 * //todo: investigate other options at http://www.ibm.com/smarterplanet/us/en/ibmwatson/developercloud/apis/#!/speech-to-text/recognizeSessionless
 *
 * @returns {RecognizeStream}
 */
function stream(options) {
  options = defaults(options, {
    'interim_results': true,
    'continuous': true,
    source: SOURCE_MICROPHONE
  });

  if (!options.token) {
    throw new Error("WatsonSpeechToText: missing required parameter: opts.token");
  }

  var recognizeStream;

  var sourceStream;
  if (options.source === SOURCE_MICROPHONE) {
    options['content-type'] = 'audio/l16;rate=16000';
    recognizeStream = new RecognizeStream(options);
    getUserMedia({video: false, audio: true}, function (err, mic) {
      if (err) {
        return recognizeStream.emit('error', err);
      }
      sourceStream = new MicrophoneStream(mic, {bufferSize: options.bufferSize});
      sourceStream
        .pipe(new WebAudioTo16leStream())
        .pipe(recognizeStream);
      recognizeStream.on('stop', sourceStream.stop.bind(sourceStream));
    });
  } else if (options.source instanceof File) {
    recognizeStream = new RecognizeStream(options);
    if (options.playFile) {
      FilePlayer.playFile(options.source).then(function (player) {
        recognizeStream.on('stop', player.stop.bind(player));
      }).catch(function (err) {
        recognizeStream.emit('playback-error', err);
      });

    }
    sourceStream = fileReaderStream(options.source);
    sourceStream.pipe(recognizeStream);
    // note: there's no way to stop the file reader, but stopping the recognizeStream should be good enough.
  } else if (options.source instanceof HTMLMediaElement) {
    sourceStream = new MediaElementAStream(options.source , {bufferSize: options.bufferSize});
    options['content-type'] = 'audio/l16;rate=16000';
    recognizeStream = new RecognizeStream(options);
    sourceStream
      .pipe(new WebAudioTo16leStream())
      .pipe(recognizeStream);
    recognizeStream.on('stop', sourceStream.stop.bind(sourceStream));
  } else {
    throw new Error("Unrecognized source");
  }

  return recognizeStream;
}

exports.stream = stream;

exports.promise = function promise(options) {
  options = defaults(options, {
    'interim_results': false
  });
  var s = stream(options);
  var p = new Promise(function (resolve, reject) {
    var results = [];
    s.on('result', function (result) {
      results.push(result);
    }).on('end', function () {
      resolve(results);
    }).on('error', reject);
  });
  p.stop = s.stop.bind(s);
  return p;
};

exports.resultsToText = function resultsToText(results) {
  return results.map(function (result) {
    return (result && result.final && result.alternatives && result.alternatives.length) ? result.alternatives[0].transcript : ''
  }).join(' ');
};
