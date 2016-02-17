"use strict";

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
 Requires fetch (loading the top-level module automatically includes a pollyfill, but loading this sub-module directly doesn't.)

 * @todo define format in @returns statement
 * @param options
 * @param {String} options.token auth token
 * @returns {Promise.<T>}
 */
module.exports = function getVoices(options) {
  if (!options || !options.token) {
    throw new Error("Watson TextToSpeech: missing required parameter: options.token");
  }
  var reqOpts = {
    credentials: 'omit',
    headers: {
      'accept': 'application/json'
    }
  };
  return fetch('https://stream.watsonplatform.net/text-to-speech/api/v1/voices?watson-token=' + options.token, reqOpts)
    .then(function(response){
      return response.json();
    }).then(function(obj) {
      return obj.voices;
    });
};
