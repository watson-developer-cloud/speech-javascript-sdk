"use strict";
var qs = require('../util/querystring.js');

module.exports.synthesize = function(options) {
  if (!options || !options.token) {
    throw new Error("Watson TextToSpeech: missing required parameter: options.token");
  }
  options['watson-token'] = options.token;
  delete options.token;
  var audio = new Audio();
  audio.crossOrigin = true;
  audio.src = 'https://stream.watsonplatform.net/text-to-speech/api/v1/synthesize?' + qs.stringify(options);
  audio.play();
  return audio;
};
