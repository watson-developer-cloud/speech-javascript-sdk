'use strict';
var Readable = require('stream').Readable;
var util = require('util');

/**
 * Turns a MediaStream object (from getUserMedia) into a Node.js Readable stream and converts the audio to Buffers
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/Navigator/getUserMedia
 *
 * @param {MediaStream|HTMLMediaElement} source - either https://developer.mozilla.org/en-US/docs/Web/API/MediaStream or https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement
 * @param {Object} [opts] options
 * @param {Number|null} [opts.bufferSize=null] https://developer.mozilla.org/en-US/docs/Web/API/AudioContext/createScriptProcessor
 * @param {Boolean} [opts.muteSource=false] - If true, the audio will not be sent back to the source
 * @constructor
 */
function MediaElementAudioStream(source, opts) {

  opts = util._extend({
    // "It is recommended for authors to not specify this buffer size and allow the implementation to pick a good
    // buffer size to balance between latency and audio quality."
    // https://developer.mozilla.org/en-US/docs/Web/API/AudioContext/createScriptProcessor
    // Possible values: null, 256, 512, 1024, 2048, 4096, 8192, 16384
    bufferSize:null,
    muteSource: false,
    autoplay: true
  }, opts);

  // We can only emit one channel's worth of audio, so only one input. (Who has multiple microphones anyways?)
  var inputChannels = 1;

  // we shouldn't need any output channels (going back to the browser), but chrome is buggy and won't give us any audio without one
  var outputChannels = 1;

  Readable.call(this, opts);

  var self = this;
  var recording = true;

  /**
   * Convert and emit the raw audio data
   * @see https://developer.mozilla.org/en-US/docs/Web/API/ScriptProcessorNode/onaudioprocess
   * @param {AudioProcessingEvent} e https://developer.mozilla.org/en-US/docs/Web/API/AudioProcessingEvent
   */
  function processAudio(e) {
    // onaudioprocess can be called at least once after we've stopped
    if (recording) {

      var raw = e.inputBuffer.getChannelData(0);

      /**
       * @event MicrophoneStream#raw
       * @param {Float32Array} data raw audio data from browser - each sample is a number from -1 to 1
       */
      self.emit('raw', raw);

      // Standard (non-object mode) Node.js streams only accepts Buffers or Strings
      var nodebuffer = new Buffer(raw.buffer);

      /**
       * Emit the readable/data event with a node-style buffer.
       * Note: this is essentially a new DataView on the same underlying ArrayBuffer.
       * The raw audio data is not actually coppied or changed.
       *
       * @event MicrophoneStream#data
       * @param {Buffer} chunk node-style buffer with audio data; buffers are essentially a Uint8Array
       */
      self.push(nodebuffer);
    }
  }

  var context = new AudioContext();
  var audioInput = context.createMediaElementSource(source);
  var scriptProcessor = context.createScriptProcessor(opts.bufferSize, inputChannels, outputChannels);

  scriptProcessor.onaudioprocess = processAudio;

  if (!opts.muteSource) {
    var gain = context.createGain();
    audioInput.connect(gain);
    gain.connect(context.destination);
  }

  audioInput.connect(scriptProcessor);

  // other half of workaround for chrome bugs
  scriptProcessor.connect(context.destination);

  this.stop = function() {
    recording = false;
    source.pause();
    source.currentTime = 0;
    self.push(null);
    self.emit('close');
  };

  source.addEventListener("ended", this.stop);

  process.nextTick(function() {
    self.emit('format', {
      channels: 1,
      bitDepth: 32,
      sampleRate: context.sampleRate,
      signed: true,
      float: true
    });
    if (opts.autoplay) {
      source.play();
    }
  });

}
util.inherits(MediaElementAudioStream, Readable);

MediaElementAudioStream.prototype._read = function(/* bytes */) {
  // no-op, (flow-control doesn't really work on sound)
};

/**
 * Converts a Buffer back into the raw Float32Array format that browsers use.
 * Note: this is just a new DataView for the same underlying buffer -
 * the actual audio data is not copied or changed here.
 *
 * @param {Buffer} chunk node-style buffer of audio data from a 'data' event or read() call
 * @return {Float32Array} raw 32-bit float data view of audio data
 */
MediaElementAudioStream.toRaw = function toFloat32(chunk) {
  return new Float32Array(chunk.buffer);
};

module.exports = MediaElementAudioStream;
