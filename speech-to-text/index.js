'use strict';

/**
 * IBM Watson Speech to Text JavaScript SDK
 *
 * The primary methods for interacting with the Speech to Text JS SDK are:
 *  * `recognizeMicrophone()` for live microphone input
 *  * `recognizeElement()` for transcribing `<audio>` and `<video>` elements
 *  * `recognizeFile()` for file `<input>`'s and other data sources
 *
 * However, the underlying streams and utils that they use are also provided for advanced usage.
 *
 * @module watson-speech/speech-to-text
 */

module.exports = {

  // "easy-mode" API
  /**
   * @see module:watson-speech/speech-to-text/recognize-microphone
   */
  recognizeMicrophone: require('./recognize-microphone'),

  /**
   * @see module:watson-speech/speech-to-text/recognize-blob
   */
  recognizeFile: require('./recognize-file'),

  /**
   * @see module:watson-speech/speech-to-text/get-models
   */
  getModels: require('./get-models'),


  // individual components to build more customized solutions
  /**
   * @see WebAudioL16Stream
   */
  WebAudioL16Stream: require('./webaudio-l16-stream'),

  /**
   * @see RecognizeStream
   */
  RecognizeStream: require('./recognize-stream'),

  /**
   * @see FilePlayer
   */
  FilePlayer: require('./file-player'),

  /**
   * @see FormatStream
   */
  FormatStream: require('./format-stream'),

  /**
   * @see TimingStream
   */
  TimingStream: require('./timing-stream'),

  /**
   * @see WritableElementStream
   */
  WritableElementStream: require('./writable-element-stream'),

  // external components exposed for convenience

  /**
   * @see https://www.npmjs.com/package/get-user-media-promise
   */
  getUserMedia: require('get-user-media-promise'),

  /**
   * @see https://www.npmjs.com/package/microphone-stream
   */
  MicrophoneStream: require('microphone-stream'),

  /**
   * @see https://nodejs.org/api/buffer.html
   */
  Buffer: Buffer
};
