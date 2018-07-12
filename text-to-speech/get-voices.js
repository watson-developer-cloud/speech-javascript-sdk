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

/**
 * @module watson-speech/text-to-speech/get-voices
 */

/**
 Returns a promise that resolves to an array of objects representing the available voices.  Example:

 ```js
 [{
    "name": "en-US_MichaelVoice",
    "language": "en-US",
    "customizable": true,
    "gender": "male",
    "url": "https://stream.watsonplatform.net/text-to-speech/api/v1/voices/en-US_MichaelVoice",
    "description": "Michael: American English male voice."
 },
 //...
 ]
 ```
 Requires fetch, pollyfill available at https://github.com/github/fetch

 * @todo define format in @return statement
 * @param {Object} options
 * @param {String} options.token auth token for CF services
 * @param {String} options.access_token IAM access token for RC services
 * @return {Promise.<T>}
 */
module.exports = function getVoices(options) {
  if (!options || (!options.token && !options.access_token)) {
    throw new Error('Watson TextToSpeech: missing required auth parameter: options.token (CF) or options.access_token (RC)');
  }
  var reqOpts = {
    credentials: 'omit',
    headers: {
      accept: 'application/json'
    }
  };
  var url;
  if (options.access_token) {
    url = 'https://stream.watsonplatform.net/text-to-speech/api/v1/voices?watson-token=' + options.access_token;
  } else {
    url = 'https://stream.watsonplatform.net/text-to-speech/api/v1/voices?watson-token=' + options.token;
  }
  return fetch(url, reqOpts)
    .then(function(response) {
      return response.json();
    })
    .then(function(obj) {
      return obj.voices;
    });
};
