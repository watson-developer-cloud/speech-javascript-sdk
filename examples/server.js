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

var express = require('express');
var app = express();
var expressBrowserify = require('express-browserify');

// allows environment properties to be set in a file named .env
require('dotenv').load({silent: true});

app.use(express.static(__dirname + '/static'));

// set up express-browserify to serve bundles for examples
var isDev = app.get('env') === 'development';
app.get('/bundle.js', expressBrowserify('static/browserify-app.js', {
  watch: isDev,
  debug: isDev
}));
app.get('/audio-video-deprecated/bundle.js', expressBrowserify('static/audio-video-deprecated/audio-video-app.js', {
  watch: isDev,
  debug: isDev
}));


// token endpoints
// **Warning**: these endpoints should be guarded with additional authentication & authorization for production use
app.use('/api/speech-to-text/', require('./stt-token.js'));
app.use('/api/text-to-speech/', require('./tts-token.js'));

var port = process.env.VCAP_APP_PORT || 3000;
app.listen(port, function() {
  console.log('Example IBM Watson Speech JS SDK client app & token server live at http://localhost:%s/', port);
});

// chrome requires https to access the user's microphone unless it's a localhost url so
// this sets up a basic server at https://localhost3001/ using an included self-signed certificate
// note: this is not suitable for production use
// however bluemix automatically adds https support at http://<myapp>.mybluemix.net
if (!process.env.VCAP_APP_PORT) {
  var fs = require('fs'),
    https = require('https'),
    HTTPS_PORT = 3001;

  var options = {
    key: fs.readFileSync(__dirname + '/keys/localhost.pem'),
    cert: fs.readFileSync(__dirname + '/keys/localhost.cert')
  };
  https.createServer(options, app).listen(HTTPS_PORT, function() {
    console.log('Secure server live at https://localhost:%s/', HTTPS_PORT);
  });
}
