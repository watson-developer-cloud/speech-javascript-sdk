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

var express      = require('express'),
    app          = express(),
    vcapServices = require('vcap_services'),
    extend       = require('util')._extend,
    watson       = require('watson-developer-cloud');

app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/../dist')); // normally these files would also go into public/ but this way the example always has the latest code


// set up an endpoint to serve speech-to-text auth tokens

// For local development, replace username and password
var sttConfig = extend({
    version: 'v1',
    url: 'https://stream.watsonplatform.net/speech-to-text/api',
    username: '<username>',
    password: '<password>'
}, vcapServices.getCredentials('speech_to_text'));

// quick hack to make development easier
try { extend(sttConfig, require('../test/resources/stt-auth.json')) } catch (ex) {}

var sttAuthService = watson.authorization(sttConfig);

// Get token using your credentials
// **Warning**: these endpoints should be guarded with additional authentication & authorization for production use
app.get('/api/speech-to-text/token', function(req, res) {
    sttAuthService.getToken({url: sttConfig.url}, function(err, token) {
        if (err) {
            console.log('Error retrieving token: ', err);
            return res.status(500).send('Error retrieving token')
        }
        res.send(token);
    });
});

// and, do it all again for the text to speech service
var ttsConfig = extend({
  version: 'v1',
  url: 'https://stream.watsonplatform.net/text-to-speech/api',
  username: '<username>',
  password: '<password>'
}, vcapServices.getCredentials('text_to_speech'));

// quick hack to make development easier
try { extend(ttsConfig, require('../test/resources/tts-auth.json')) } catch (ex) {}

var ttsAuthService = watson.authorization(ttsConfig);

app.get('/api/text-to-speech/token', function(req, res) {
  ttsAuthService.getToken({url: ttsConfig.url}, function(err, token) {
    if (err) {
      console.log('Error retrieving token: ', err);
      return res.status(500).send('Error retrieving token')
    }
    res.send(token);
  });
});

var port = process.env.VCAP_APP_PORT || 3000;
app.listen(port, function() {
   console.log('Example IBM Watson Speech JS SDK client app & token server live at http://localhost:%s/', port);
});

// chrome requires https to access the user's mic unless it's a localhost url
if (!process.env.VCAP_APP_PORT) {
    var fs = require("fs"),
        https = require("https"),
        HTTPS_PORT = 3001;

    var options = {
        key: fs.readFileSync(__dirname + '/keys/localhost.pem'),
        cert: fs.readFileSync(__dirname + '/keys/localhost.cert')
    };
    https.createServer(options, app).listen(HTTPS_PORT, function () {
        console.log('Secure server live at https://localhost:%s/', port)
    });
}
