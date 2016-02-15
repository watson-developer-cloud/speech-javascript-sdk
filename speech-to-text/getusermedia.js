'use strict';

module.exports = function getUserMedia(constraints) {
  //https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia
  if(navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    return navigator.mediaDevices.getUserMedia(constraints);
  }
  // todo: return a fake promise if window.Promise is undefined
  return new Promise(function(resolve, reject) {
    var gum = navigator.getUserMedia || navigator.webkitGetUserMedia ||  navigator.mozGetUserMedia || navigator.msGetUserMedia;
    if (!gum) {
      var err = error = new Error('MediaStreamError');
      error.name = 'NotSupportedError';
      return reject(err)
    }
    gum.call(navigator, constraints, resolve, reject);
  });
};
