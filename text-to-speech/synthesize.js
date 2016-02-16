"use strict";
var qs = require('../util/querystring.js');

/**
 * voice=en-US_AllisonVoice
 text=Conscious%20of%20its%20spiritual%20and%20moral%20heritage%2C%20the%20Union%20is%20founded%20on%20the%20indivisible%2C%20universal%20values%20of%20human%20dignity%2C%20freedom%2C%20equality%20and%20solidarity%3B%20it%20is%20based%20on%20the%20principles%20of%20democracy%20and%20the%20rule%20of%20law.%20It%20places%20the%20individual%20at%20the%20heart%20of%20its%20activities%2C%20by%20establishing%20the%20citizenship%20of%20the%20Union%20and%20by%20creating%20an%20area%20of%20freedom%2C%20security%20and%20justice.
 =0
 * @param options
 * @param options.token auth token
 * @param options.text text ty speak
 * @param [options.voice=en-US_MichaelVoice] what voice to use - call TextToSpeech.getVoices() for a complete list.
 * @param [options.X-WDC-PL-OPT-OUT=0] set to 1 to opt-out of allowing Watson to use this request to improve it's services
 * @returns {Audio}
 */
module.exports = function synthesize(options) {
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

