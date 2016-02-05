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
var L16 = require('./webaudio-l16-stream');
var RecognizeStream = require('./recognize-stream.js');

/**
 * Recognize audio from a <audio> or <video> element
 *
 * @param {Object} options - Also passed to {MediaElementAudioStream} and to {RecognizeStream}
 * @param {String} options.token - Auth Token - see https://github.com/watson-developer-cloud/node-sdk#authorization
 * @param {MediaElement} options.element - the <video> or <audio> element to play
 *
 * @returns {RecognizeStream}
 */
module.exports = function recognizeElement(options) {
  if (!options || !options.token) {
    throw new Error("WatsonSpeechToText: missing required parameter: opts.token");
  }

  options['content-type'] = 'audio/l16;rate=16000'; // raw wav audio (no header)
  var recognizeStream = new RecognizeStream(options);

  var sourceStream = new MediaElementAudioStream(options.element , options);

  sourceStream
    .pipe(new L16())
    .pipe(recognizeStream);

  recognizeStream.on('stop', sourceStream.stop.bind(sourceStream));

  return recognizeStream;
};
