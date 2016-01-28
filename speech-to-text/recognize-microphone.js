'use strict';

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
var getUserMedia = require('getusermedia');
var MicrophoneStream = require('microphone-stream');
var RecognizeStream = require('./recognize-stream.js');
var WebAudioTo16leStream = require('./webaudio-wav-stream.js');


/**
 * Create and return a RecognizeStream from the user's microphone
 * If the options.file is set, it is used instead of the microphone
 *
 * @param {Object} options - Also passed to {MediaElementAudioStream} and to {RecognizeStream}
 * @param {String} options.token - Auth Token - see https://github.com/watson-developer-cloud/node-sdk#authorization
 *
 * @returns {RecognizeStream}
 */
module.exports = function recognizeMicrophone(options) {
  if (!options || !options.token) {
    throw new Error("WatsonSpeechToText: missing required parameter: opts.token");
  }

  //options['content-type'] = 'audio/l16;rate=16000';
  var recognizeStream = new RecognizeStream(options);

    getUserMedia({video: false, audio: true}, function (err, mic) {
      if (err) {
        return recognizeStream.emit('error', err);
      }

      var micStream = new MicrophoneStream(mic, options);
      micStream
        .pipe(new WebAudioTo16leStream())
        .pipe(recognizeStream);

      recognizeStream.on('stop', micStream.stop.bind(micStream));
    });

  return recognizeStream;
};


