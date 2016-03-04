'use strict';

var express      = require('express'),
  router          = express.Router(),
  vcapServices = require('vcap_services'),
  extend       = require('util')._extend,
  watson       = require('watson-developer-cloud');

// another endpoint for the text to speech service

// For local development, replace username and password or set env properties
var ttsConfig = extend({
  version: 'v1',
  url: 'https://stream.watsonplatform.net/text-to-speech/api',
  username: process.env.TTS_USERNAME || '<username>',
  password: process.env.TTS_PASSWORD || '<password>'
}, vcapServices.getCredentials('text_to_speech'));

// quick hack to make development easier
try { extend(ttsConfig, require('../test/resources/tts-auth.json')) } catch (ex) {}

var ttsAuthService = watson.authorization(ttsConfig);

router.get('/token', function(req, res) {
  ttsAuthService.getToken({url: ttsConfig.url}, function(err, token) {
    if (err) {
      console.log('Error retrieving token: ', err);
      return res.status(500).send('Error retrieving token')
    }
    res.send(token);
  });
});

module.exports = router;
