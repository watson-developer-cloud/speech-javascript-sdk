'use strict';

var contentType = require('./content-type');
var bufferFrom = require('buffer-from');

/**
 * Plays audio from a URL
 * Compatible with Mobile Safari if triggered in direct response to a user interaction (e.g. click)
 * @param {String} url
 * @constructor
 */
function UrlPlayer(url) {
  var audio = (this.audio = new Audio());
  audio.src = url;
  audio.play();
  /**
   * Stops the audio
   */
  this.stop = function stop() {
    audio.pause();
    audio.currentTime = 0;
  };
}

/**
 * Plays audio from File/Blob instances
 * @param {File|Blob} file
 * @param {String} contentType
 * @constructor
 */
function FilePlayer(file, contentType) {
  var audio = (this.audio = new Audio());
  if (audio.canPlayType(contentType)) {
    audio.src = URL.createObjectURL(new Blob([file], { type: contentType }));
    audio.play();
  } else {
    // if we emit an error, it prevents the promise from returning the actual result
    // however, most browsers do not support flac, so this is a reasonably scenario
    var err = new Error('Current browser is unable to play back ' + contentType);
    err.name = FilePlayer.ERROR_UNSUPPORTED_FORMAT;
    err.contentType = contentType;
    throw err;
  }
  /**
   * Stops the audio
   */
  this.stop = function stop() {
    audio.pause();
    audio.currentTime = 0;
  };
}
FilePlayer.ERROR_UNSUPPORTED_FORMAT = 'UNSUPPORTED_FORMAT';

/**
 * Reads the first few bytes of a binary file and resolves to the content-type if recognized & supported
 * @param {File|Blob} file
 * @return {Promise}
 */
function getContentTypeFromFile(file) {
  return new Promise(function(resolve, reject) {
    var blobToText = new Blob([file]).slice(0, 4);
    var r = new FileReader();
    r.readAsText(blobToText);
    r.onload = function() {
      var ct = contentType.fromHeader(bufferFrom(r.result));
      if (ct) {
        resolve(ct);
      } else {
        var err = new Error('Unable to determine content type from file header; only wav, flac, and ogg/opus are supported.');
        err.name = FilePlayer.ERROR_UNSUPPORTED_FORMAT;
        reject(err);
      }
    };
  });
}

/**
 * Determines the file's content-type and then resolves to a FilePlayer instance
 * @param {File|Blob|String} file - binary data or URL of audio file (binary data playback may not work on mobile Safari)
 * @param {String} [contentType] - optional content-type, will be sniffed from file header if unspecified
 * @return {Promise.<FilePlayer>}
 */
function playFile(file, contentType) {
  if (typeof file === 'string') {
    return Promise.resolve(new UrlPlayer(file));
  }
  if (contentType) {
    return Promise.resolve(new FilePlayer(file, contentType));
  }
  return getContentTypeFromFile(file).then(function(sniffedContentType) {
    return new FilePlayer(file, sniffedContentType);
  });
}

module.exports = FilePlayer;
module.exports.getContentType = getContentTypeFromFile;
module.exports.playFile = playFile;
