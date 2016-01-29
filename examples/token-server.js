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


// For local development, replace username and password
var config = extend({
    version: 'v1',
    url: 'https://stream.watsonplatform.net/speech-to-text/api',
    username: '<username>',
    password: '<password>'
}, vcapServices.getCredentials('speech_to_text'));

// quick hack to make development easier
try { extend(config, require('../test/resources/auth.json')) } catch (ex) {}

var authService = watson.authorization(config);


// Get token using your credentials
// **Warning**: this endpoint should be guarded with additional authentication & authorization for production use
app.get('/token', function(req, res, next) {
    authService.getToken({url: config.url}, function(err, token) {
        if (err) {
            console.log('Error retrieving token: ', err);
            return res.status(500).send('Error retrieving token')
        }
        res.send(token);
    });
});

var port = process.env.VCAP_APP_PORT || 3000;
app.listen(port, function() {
   console.log('Example IBM Watson STT client app & server live at http://localhost:%s/', port);
});

// chrome requires https to access the user's mic
if (!process.env.VCAP_APP_PORT) {
    var fs = require("fs"),
        https = require("https"),
        HTTPS_PORT = 3001;

    var options = {
        key: fs.readFileSync(__dirname + '/keys/localhost.pem'),
        cert: fs.readFileSync(__dirname + '/keys/localhost.cert')
    };
    https.createServer(options, app).listen(HTTPS_PORT, function () {
        console.log('Secure example IBM Watson STT client app & server live at https://localhost:%s/', port)
    });
}
