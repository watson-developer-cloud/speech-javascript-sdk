// Webpack bundling example

'use strict';

// global window.fetch pollyfill for IE/Edge & Older Chrome/FireFox
require('whatwg-fetch');

// keep the bundle slim by only requiring the necessary modules
var recognizeMicrophone = require('watson-speech/speech-to-text/recognize-microphone');

document.querySelector('#button').onclick = function() {
  fetch('/api/speech-to-text/token')
    .then(function(response) {
      return response.text();
    })
    .then(function(token) {
      var stream = recognizeMicrophone({
        token: token,
        outputElement: '#output' // CSS selector or DOM Element
      });

      stream.on('error', function(err) {
        console.log(err);
      });
    })
    .catch(function(error) {
      console.log(error);
    });
};
