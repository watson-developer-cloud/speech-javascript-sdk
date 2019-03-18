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
var pick = require('object.pick');

var QUERY_PARAMS_ALLOWED = ['voice', 'X-WDC-PL-OPT-OUT', 'X-Watson-Learning-Opt-Out', 'text', 'watson-token', 'access_token', 'accept', 'customization_id'];

/**
 * @module watson-speech/text-to-speech/synthesize
 */

/**
 * Synthesize and play the supplied text over the computers speakers.
 *
 * Creates and returns a HTML5 `<audio>` element
 *
 * @param {Object} options
 * @param {String} options.url=https://stream.watsonplatform.net/text-to-speech/api URL for Watson Text to Speech API
 * @param {String} [options.token] - Auth token for CF services
 * @param {String} options.access_token - IAM Access Token for RC services
 * @param {String} options.text text to speak
 * @param {String} [options.voice=en-US_MichaelVoice] what voice to use - call getVoices() for a complete list.
 * @param {String} [options.customization_id] GUID of a custom voice model. Omit to use the voice with no customization.
 * @param {String} [options.accept] - specify desired audio format. Leave unset to allow (most) browsers to automatically negotiate an ideal format.
 * @param {Number} [options.X-Watson-Learning-Opt-Out=0] set to 1 to opt-out of allowing Watson to use this request to improve it's services
 * @param {Boolean} [options.autoPlay=true] automatically play the audio
 * @param {DOMAudioElement} [options.element] <audio> element - will be used instead of creating a new one if provided
 * @return {Audio}
 * @see module:watson-speech/text-to-speech/get-voices
 */
module.exports = function synthesize(options) {
  if (!options || (!options.token && !options.access_token)) {
    throw new Error('Watson TextToSpeech: missing required parameter: options.token (CF) or options.access_token (RC)');
  }
  if (options.token && !options['watson-token']) {
    options['watson-token'] = options.token;
    delete options.token;
  }
  var url = options.url || 'https://stream.watsonplatform.net/text-to-speech/api';
  var audio = options.element || new Audio();
  audio.crossOrigin = 'anonymous';
  audio.src = url + '/v1/synthesize?' + stringify(pick(options, QUERY_PARAMS_ALLOWED));
  if (options.autoPlay !== false) {
    audio.play();
  }
  return audio;
};

/**
 * Stringify query params, Watson-style
 *
 * Why? The server that processes auth tokens currently only accepts the *exact* string, even if it's invalid for a URL.
 * Properly url-encoding percent characters causes it to reject the token
 * So, this is a custom qs.stringify function that properly encodes everything except watson-token, passing it along verbatim
 *
 * @param {Object} queryParams
 * @return {String}
 */
function stringify(queryParams) {
  // the server chokes if the token is correctly url-encoded
  return Object.keys(queryParams)
    .map(function(key) {
      return key + '=' + (key === 'watson-token' ? queryParams[key] : encodeURIComponent(queryParams[key]));
    })
    .join('&');
}
