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
 * @module watson-speech/speech-to-text/get-models
 */

/**
 Returns a promise that resolves to an array of objects representing the available voice models.  Example:

 ```js
 [{
    "url": "https://stream.watsonplatform.net/speech-to-text/api/v1/models/en-UK_BroadbandModel",
    "rate": 16000,
    "name": "en-UK_BroadbandModel",
    "language": "en-UK",
    "description": "UK English broadband model."
 },
 //...
 ]
 ```
 Requires fetch, pollyfill available at https://github.com/github/fetch

 * @todo define format in @returns statement
 * @param {Object} options
 * @param {String} options.token auth token
 * @returns {Promise.<T>}
 */
module.exports = function getModels(options) {
  if (!options || !options.token) {
    throw new Error('Watson SpeechToText: missing required parameter: options.token');
  }
  var reqOpts = {
    credentials: 'omit',
    headers: {
      accept: 'application/json'
    }
  };
  return fetch('https://stream.watsonplatform.net/speech-to-text/api/v1/models?watson-token=' + options.token, reqOpts)
    .then(function(response){
      return response.json();
    }).then(function(obj) {
      return obj.models;
    });
};
