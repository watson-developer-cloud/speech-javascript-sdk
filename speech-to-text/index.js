'use strict';

module.exports = {
  // "easy-mode" API
  recognizeMicrophone: require('./recognize-microphone'),
  recognizeBlob: require('./recognize-blob'),
  recognizeElement: require('./recognize-element'),

  // individual components to build more customized solutions
  WebAudioL16Stream: require('./webaudio-l16-stream'),
  MediaElementAudioStream: require('./media-element-audio-stream'),
  RecognizeStream: require('./recognize-stream'),
  FilePlayer: require('./file-player'),
  getUserMedia: require('./getusermedia'),
  FormatStream: require('./format-stream'),
  TimingStream: require('./timing-stream'),

  // external components provided here to allow the lib to be used standalone (w/out browserify)
  MicrophoneStream: require('microphone-stream'),
  Buffer: Buffer
};
