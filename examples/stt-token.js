'use strict';

var express      = require('express'),
  router          = express.Router(),
  vcapServices = require('vcap_services'),
  extend       = require('util')._extend,
  watson       = require('watson-developer-cloud');

// set up an endpoint to serve speech-to-text auth tokens

// For local development, replace username and password or set env properties
var sttConfig = extend({
  version: 'v1',
  url: 'https://stream.watsonplatform.net/speech-to-text/api',
  username: process.env.STT_USERNAME || '<username>',
  password: process.env.STT_PASSWORD || '<password>'
}, vcapServices.getCredentials('speech_to_text'));

// quick hack to make development easier
try { extend(sttConfig, require('../test/resources/stt-auth.json')) } catch (ex) { console.log(ex) }

var sttAuthService = watson.authorization(sttConfig);

router.get('/token', function(req, res) {
  sttAuthService.getToken({url: sttConfig.url}, function(err, token) {
    if (err) {
      console.log('Error retrieving token: ', err);
      return res.status(500).send('Error retrieving token')
    }
    res.send(token);
  });
});

module.exports = router;
