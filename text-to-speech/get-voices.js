"use strict";
require('whatwg-fetch'); // pollyfill - most supported browsers have this built-in

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
