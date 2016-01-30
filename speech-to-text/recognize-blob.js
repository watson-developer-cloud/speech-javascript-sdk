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
var ReadableBlobStream = require('readable-blob-stream');
var RecognizeStream = require('./recognize-stream.js');
var FilePlayer = require('./file-player.js');


/**
 * Create and return a RecognizeStream from a File or Blob
 * (e.g. from a file <input>, a dtagdrop targe, or an ajax request)
 *
 * @param {Object} options - Also passed to {MediaElementAudioStream} and to {RecognizeStream}
 * @param {String} options.token - Auth Token - see https://github.com/watson-developer-cloud/node-sdk#authorization
 * @param {Blob|File} options.data - the raw audio data as a Blob or File instance
 * @param {Boolean} [options.play=true] - If a file is set, play it locally as it's being uploaded
 *
 * @returns {RecognizeStream}
 */
module.exports = function recognizeBlob(options) {
  if (!options || !options.token) {
    throw new Error("WatsonSpeechToText: missing required parameter: opts.token");
  }

  var recognizeStream  = new RecognizeStream(options);

  if (options.playFile) {
    FilePlayer.playFile(options.data).then(function (player) {
      recognizeStream.on('stop', player.stop.bind(player));
    }).catch(function (err) {
      recognizeStream.emit('playback-error', err);
    });
  }

  return new ReadableBlobStream(options.data).pipe(recognizeStream);
};


