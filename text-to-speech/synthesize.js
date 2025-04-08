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
var processUserParameters = require('../util/process-user-parameters.js');
var qs = require('../util/querystring.js');

/**
 * @module watson-speech/text-to-speech/synthesize
 */

/**
 * Synthesize and play the supplied text over the computers speakers.
 *
 * Creates and returns a HTML5 `<audio>` element
 *
 * @param {Object} options
 * @param {String} options.url=https://api.us-south.text-to-speech.watson.cloud.ibm.com URL for Watson Text to Speech API
 * @param {String} [options.token] - Auth token for CF services
 * @param {String} options.accessToken - IAM Access Token for RC services
 * @param {String} options.text text to speak
 * @param {String} [options.voice=en-US_MichaelVoice] what voice to use - call getVoices() for a complete list.
 * @param {String} [options.customizationId] GUID of a custom voice model. Omit to use the voice with no customization.
 * @param {String} [options.accept] - specify desired audio format. Leave unset to allow (most) browsers to automatically negotiate an ideal format.
 * @param {Number} [options.xWatsonLearningOptOut=0] set to 1 to opt-out of allowing Watson to use this request to improve it's services
 * @param {Boolean} [options.autoPlay=true] automatically play the audio
 * @param {DOMAudioElement} [options.element] <audio> element - will be used instead of creating a new one if provided
 * @return {Audio}
 * @see module:watson-speech/text-to-speech/get-voices
 */
module.exports = function synthesize(options) {
  if (!options || (!options.token && !options.accessToken)) {
    throw new Error('Watson TextToSpeech: missing required parameter: options.token (CF) or options.accessToken (RC)');
  }
  if (options.token && !options.watsonToken) {
    options.watsonToken = options.token;
    delete options.token;
  }
  var url = options.url || 'https://api.us-south.text-to-speech.watson.cloud.ibm.com';
  var audio = options.element || new Audio();
  audio.crossOrigin = 'anonymous';
  var queryParamsAllowed = ['voice', 'X-Watson-Learning-Opt-Out', 'text', 'watson-token', 'access_token', 'accept', 'customization_id', 'pitch_percentage'];
  console.log({queryParamsAllowed});
  var queryParams = processUserParameters(options, queryParamsAllowed);
  audio.src = url + '/v1/synthesize?' + qs.stringify(queryParams);
  if (options.autoPlay !== false) {
    var playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          // console.log("autoPlay promise resolved")
        })
        .catch(error => {
          throw new Error('Watson TextToSpeech: autoplay error:' + error);
        });
    }
  }
  return audio;
};
