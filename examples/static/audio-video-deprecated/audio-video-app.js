// recognizeElement example, now deprecated
// requires browserify

'use strict';

// global window.fetch pollyfill for IE/Edge & Older Chrome/FireFox
require('whatwg-fetch');

// keep the bundle slim by only requiring the necessary modules
var recognizeElement = require('./recognize-element');

document.querySelector('#button').onclick = function() {
  fetch('/api/speech-to-text/token')
    .then(function(response) {
      return response.text();
    })
    .then(function(token) {
      var stream = recognizeElement({
        // muteSource: true, // prevents sound from also playing locally
        token: token,
        element: '#audio-element', // may be a CSS selector or a DOM Element
        outputElement: '#output' // ditto
      });
      stream.on('error', function(err) {
        console.log(err);
      });
    })
    .catch(function(error) {
      console.log(error);
    });
};
// note: you may also create audio/video elements pragmatically via new Audio() or
// document.createElement('video'); and then set the .src
