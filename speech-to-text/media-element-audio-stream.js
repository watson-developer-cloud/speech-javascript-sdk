'use strict';
var Readable = require('stream').Readable;
var util = require('util');
var defaults = require('defaults');

/**
 * Turns a MediaStream object (from getUserMedia) into a Node.js Readable stream and converts the audio to Buffers
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/Navigator/getUserMedia
 *
 * @param {MediaStream|HTMLMediaElement} source - either https://developer.mozilla.org/en-US/docs/Web/API/MediaStream or https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement
 * @param {Object} [opts] options
 * @param {Number|null} [opts.bufferSize=null] https://developer.mozilla.org/en-US/docs/Web/API/AudioContext/createScriptProcessor
 * @param {Boolean} [opts.muteSource=false] - If true, the audio will not be sent back to the source
 *
 * // todo: add option for whether to keep or destroy the context
 *
 * @constructor
 */
function MediaElementAudioStream(source, opts) {

  opts = defaults(opts, {
    // "It is recommended for authors to not specify this buffer size and allow the implementation to pick a good
    // buffer size to balance between latency and audio quality."
    // https://developer.mozilla.org/en-US/docs/Web/API/AudioContext/createScriptProcessor
    // Possible values: null, 256, 512, 1024, 2048, 4096, 8192, 16384
    // however, webkitAudioContext (safari) requires it to be set
    bufferSize: (typeof AudioContext != "undefined" ? null : 4096),
    muteSource: false,
    autoPlay: true,
    crossOrigin: "anonymous", // required for cross-domain audio playback
    objectMode: true // true = emit AudioBuffers w/ audio + some metadata, false = emite node.js Buffers (with binary data only
  });

  // We can only emit one channel's worth of audio, so only one input. (Who has multiple microphones anyways?)
  var inputChannels = 1;

  // we shouldn't need any output channels (going back to the browser - that's what the gain node is for), but chrome is buggy and won't give us any audio without one
  var outputChannels = 1;

  Readable.call(this, opts);

  var self = this;
  var recording = true;

  // I can't find much documentation for this for <audio> elements, but it seems to be required for cross-domain usage (in addition to CORS headers)
  source.crossOrigin = opts.crossOrigin;

  /**
   * Convert and emit the raw audio data
   * @see https://developer.mozilla.org/en-US/docs/Web/API/ScriptProcessorNode/onaudioprocess
   * @param {AudioProcessingEvent} e https://developer.mozilla.org/en-US/docs/Web/API/AudioProcessingEvent
   */
  function processAudio(e) {
    // onaudioprocess can be called at least once after we've stopped
    if (recording) {
      // todo: interleave channels in binary mode
      self.push( opts.objectMode ? e.inputBuffer : new Buffer(e.inputBuffer.getChannelData(0)) );
    }
  }

  var AudioContext = window.AudioContext || window.webkitAudioContext;
  // cache the source node & context since it's not possible to recreate it later
  var context = source.context = source.context || new AudioContext();
  var audioInput = source.node  = source.node || context.createMediaElementSource(source);
  var scriptProcessor = context.createScriptProcessor(opts.bufferSize, inputChannels, outputChannels);

  scriptProcessor.onaudioprocess = processAudio;

  if (!opts.muteSource) {
    var gain = context.createGain();
    audioInput.connect(gain);
    gain.connect(context.destination);
  }

  /**
   * Setup script processor to extract audio and also re-connect it via a no-op gain node if desired
   *
   * Delayed to avoid processing the stream of silence received before the file begins playing
   *
   */
  function connect() {
    audioInput.connect(scriptProcessor);
    // other half of workaround for chrome bugs
    scriptProcessor.connect(context.destination);
    source.removeEventListener("playing", connect);
  }
  source.addEventListener("playing", connect);

  // https://developer.mozilla.org/en-US/docs/Web/Guide/Events/Media_events
  // https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/readyState
  function start() {
    source.play();
    source.removeEventListener("canplaythrough", start);
  }
  if (opts.autoPlay) {
    // play immediately if we have enough data, otherwise wait for the canplaythrough event
    if(source.readyState === source.HAVE_ENOUGH_DATA) {
      source.play();
    } else {
      source.addEventListener("canplaythrough", start);
    }
  }

  function end() {
    recording = false;
    scriptProcessor.disconnect();
    audioInput.disconnect();
    //context.close(); // this prevents us from re-using the same audio element until the page is refreshed
    self.push(null);
    self.emit('close');
  }
  source.addEventListener("ended", end);

  this.stop = function() {
    source.pause();
    end();
  };

  source.addEventListener("error", this.emit.bind(this, 'error'));

  process.nextTick(function() {
    // this is more useful for binary mode than object mode, but it won't hurt either way
    self.emit('format', {
      channels: 1,
      bitDepth: 32,
      sampleRate: context.sampleRate,
      signed: true,
      float: true
    });
  });

}
util.inherits(MediaElementAudioStream, Readable);

MediaElementAudioStream.prototype._read = function(/* bytes */) {
  // no-op, (back-pressure flow-control doesn't really work on sound)
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
