/**
 * Copyright 2014 IBM Corp. All Rights Reserved.
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

var { Duplex } = require('readable-stream');
var util = require('util');
var W3CWebSocket = require('websocket').w3cwebsocket;
var contentType = require('./content-type');
var processUserParameters = require('../util/process-user-parameters.js');
var qs = require('../util/querystring.js');

/**
 * pipe()-able Node.js Duplex stream - accepts binary audio and emits text/objects in it's `data` events.
 *
 * Uses WebSockets under the hood. For audio with no recognizable speech, no `data` events are emitted.
 *
 * By default, only finalized text is emitted in the data events, however when `objectMode`/`readableObjectMode` and `interim_results` are enabled, both interim and final results objects are emitted.
 * WriteableElementStream uses this, for example, to live-update the DOM with word-by-word transcriptions.
 *
 * Note that the WebSocket connection is not established until the first chunk of data is recieved. This allows for auto-detection of content type (for wav/flac/opus audio).
 *
 * @param {Options} options
 * @param {string} [options.url] - Base url for service (default='wss://api.us-south.speech-to-text.watson.cloud.ibm.com')
 * @param {OutgoingHttpHeaders} [options.headers] - Only works in Node.js, not in browsers. Allows for custom headers to be set, including an Authorization header (preventing the need for auth tokens)
 * @param {boolean} [options.readableObjectMode] - Emit `result` objects instead of string Buffers for the `data` events. Does not affect input (which must be binary)
 * @param {boolean} [options.objectMode] - Alias for readableObjectMode
 * @param {string} [options.accessToken] - Bearer token to put in query string
 * @param {string} [options.model] - The identifier of the model that is to be used for all recognition requests sent over the connection
 * @param {string} [options.languageCustomizationId] - The customization ID (GUID) of a custom language model that is to be used for all requests sent over the connection
 * @param {string} [options.acousticCustomizationId] - The customization ID (GUID) of a custom acoustic model that is to be used for the request
 * @param {string} [options.baseModelVersion] - The version of the specified base model that is to be used for all requests sent over the connection
 * @param {boolean} [options.xWatsonLearningOptOut] - Indicates whether IBM can use data that is sent over the connection to improve the service for future users (default=false)
 * @param {string} [options.xWatsonMetadata] - Associates a customer ID with all data that is passed over the connection. The parameter accepts the argument customer_id={id}, where {id} is a random or generic string that is to be associated with the data
 * @param {string} [options.contentType] - The format (MIME type) of the audio
 * @param {number} [options.customizationWeight] - Tell the service how much weight to give to words from the custom language model compared to those from the base model for the current request
 * @param {number} [options.inactivityTimeout] - The time in seconds after which, if only silence (no speech) is detected in the audio, the connection is closed (default=30)
 * @param {boolean} [options.interimResults] - If true, the service returns interim results as a stream of JSON SpeechRecognitionResults objects (default=false)
 * @param {string[]} [options.keywords] - An array of keyword strings to spot in the audio
 * @param {number} [options.keywordsThreshold] - A confidence value that is the lower bound for spotting a keyword
 * @param {number} [options.maxAlternatives] - The maximum number of alternative transcripts that the service is to return (default=1)
 * @param {number} [options.wordAlternativesThreshold] - A confidence value that is the lower bound for identifying a hypothesis as a possible word alternative
 * @param {boolean} [options.wordConfidence] - If true, the service returns a confidence measure in the range of 0.0 to 1.0 for each word (default=false)
 * @param {boolean} [options.timestamps] - If true, the service returns time alignment for each word (default=false)
 * @param {boolean} [options.profanityFilter] - If true, the service filters profanity from all output except for keyword results by replacing inappropriate words with a series of asterisks (default=true)
 * @param {boolean} [options.smartFormatting] - If true, the service converts dates, times, series of digits and numbers, phone numbers, currency values, and internet addresses into more readable, conventional representations (default=false)
 * @param {boolean} [options.speakerLabels] - If true, the response includes labels that identify which words were spoken by which participants in a multi-person exchange (default=false)
 * @param {string} [options.grammarName] - The name of a grammar that is to be used with the recognition request
 * @param {boolean} [options.redaction] - If true, the service redacts, or masks, numeric data from final transcripts (default=false)
 * @param {boolean} [options.processingMetrics] - If true, requests processing metrics about the service's transcription of the input audio (default=false)
 * @param {number} [options.processingMetricsInterval] - Specifies the interval in seconds at which the service is to return processing metrics
 * @param {boolean} [options.audioMetrics] - If true, requests detailed information about the signal characteristics of the input audio (detailed=false)
 * @param {number} [options.endOfPhraseSilenceTime] -  If true, specifies the duration of the pause interval at which the service splits a transcript into multiple final results. Specify a value for the pause interval in the range of 0.0 to 120.0 (default=0.8)
 * @param {boolean} [options.splitTranscriptAtPhraseEnd] - If true, directs the service to split the transcript into multiple final results based on semantic features of the input, for example, at the conclusion of meaningful phrases such as sentences (default=false)
 * @param {number} [options.speechDetectorSensitivity] - The sensitivity of speech activity detection that the service is to perform. Specify a value between 0.0 and 1.0 (default=0.5)
 * @param {number} [options.backgroundAudioSuppression] - The level to which the service is to suppress background audio based on its volume to prevent it from being transcribed as speech. Specify a value between 0.0 and 1.0 (default=0.0)
 * @param {boolean} [options.lowLatency] - If `true` for next-generation `Multimedia` and `Telephony` models that support low latency, directs the service to produce results even more quickly than it usually does.
 * @param {number} [options.characterInsertionBias] - Indicate that the service is to favor shorter or longer strings as it considers subsequent characters for its hypotheses. Specify a value between -1.0 and 1.0 (default=0.0)
*
 * @constructor
 */
function RecognizeStream(options) {
  // this stream only supports objectMode on the output side.
  // It must receive binary data input.
  if (options.objectMode) {
    options.readableObjectMode = true;
    delete options.objectMode;
  }
  Duplex.call(this, options);
  this.options = options;
  this.listening = false;
  this.initialized = false;
  this.finished = false;

  this.on('newListener', function(event) {
    if (!options.silent) {
      if (event === 'results' || event === 'result' || event === 'speaker_labels') {
        // eslint-disable-next-line no-console
        console.log(
          new Error(
            'Watson Speech to Text RecognizeStream: the ' +
              event +
              ' event was deprecated. ' +
              "Please set {objectMode: true} and listen for the 'data' event instead. " +
              'Pass {silent: true} to disable this message.'
          )
        );
      } else if (event === 'connection-close') {
        // eslint-disable-next-line no-console
        console.log(
          new Error(
            'Watson Speech to Text RecognizeStream: the ' +
              event +
              ' event was deprecated. ' +
              "Please listen for the 'close' event instead. " +
              'Pass {silent: true} to disable this message.'
          )
        );
      } else if (event === 'connect') {
        // eslint-disable-next-line no-console
        console.log(
          new Error(
            'Watson Speech to Text RecognizeStream: the ' +
              event +
              ' event was deprecated. ' +
              "Please listen for the 'open' event instead. " +
              'Pass {silent: true} to disable this message.'
          )
        );
      }
    }
  });
}
util.inherits(RecognizeStream, Duplex);

RecognizeStream.WEBSOCKET_CONNECTION_ERROR = 'WebSocket connection error';

RecognizeStream.prototype.initialize = function() {
  var options = this.options;

  if (options.token && !options['watsonToken']) {
    options['watsonToken'] = options.token;
  }
  if (options.content_type && !options['contentType']) {
    options['contentType'] = options.content_type;
  }
  if (options['X-WDC-PL-OPT-OUT'] && !options['xWatsonLearningOptOut']) {
    options['xWatsonLearningOptOut'] = options['X-WDC-PL-OPT-OUT'];
  }

  // compatibility code for the deprecated param, customization_id
  if (options.customization_id && !options.languageCustomizationId) {
    options.languageCustomizationId = options.customization_id;
    delete options.customization_id;
  }

  // process query params
  var queryParamsAllowed = [
    'access_token',
    'watson-token',
    'model',
    'language_customization_id',
    'acoustic_customization_id',
    'base_model_version',
    'x-watson-learning-opt-out',
    'x-watson-metadata'
  ];
  var queryParams = processUserParameters(options, queryParamsAllowed);
  if (!queryParams.language_customization_id && !queryParams.model) {
    queryParams.model = 'en-US_BroadbandModel';
  }
  var queryString = qs.stringify(queryParams);

  var url = (options.url || 'wss://api.us-south.speech-to-text.watson.cloud.ibm.com').replace(/^http/, 'ws') + '/v1/recognize?' + queryString;

  // process opening payload params
  var openingMessageParamsAllowed = [
    'customization_weight',
    'processing_metrics',
    'processing_metrics_interval',
    'audio_metrics',
    'inactivity_timeout',
    'timestamps',
    'word_confidence',
    'content-type',
    'interim_results',
    'keywords',
    'keywords_threshold',
    'max_alternatives',
    'word_alternatives_threshold',
    'profanity_filter',
    'smart_formatting',
    'speaker_labels',
    'grammar_name',
    'redaction',
    'end_of_phrase_silence_time',
    'split_transcript_at_phrase_end',
    'speech_detector_sensitivity',
    'background_audio_suppression',
    'low_latency',
    'character_insertion_bias'
  ];
  var openingMessage = processUserParameters(options, openingMessageParamsAllowed);
  openingMessage.action = 'start';

  var self = this;

  // node params: requestUrl, protocols, origin, headers, extraRequestOptions
  // browser params: requestUrl, protocols (all others ignored)
  var socket = (this.socket = new W3CWebSocket(url, null, null, options.headers, null));

  // when the input stops, let the service know that we're done
  self.on('finish', self.finish.bind(self));

  /**
   * This can happen if the credentials are invalid - in that case, the response from DataPower doesn't include the
   * necessary CORS headers, so JS can't even read it :(
   *
   * @param {Event} event - event object with essentially no useful information
   */
  socket.onerror = function(event) {
    self.listening = false;
    var err = new Error('WebSocket connection error');
    err.name = RecognizeStream.WEBSOCKET_CONNECTION_ERROR;
    err.event = event;
    self.emit('error', err);
    self.push(null);
  };

  this.socket.onopen = function() {
    self.sendJSON(openingMessage);
    /**
     * emitted once the WebSocket connection has been established
     * @event RecognizeStream#open
     */
    self.emit('open');
  };

  this.socket.onclose = function(e) {
    // if (self.listening) {
    self.listening = false;
    self.push(null);
    // }
    /**
     * @event RecognizeStream#close
     * @param {Number} reasonCode
     * @param {String} description
     */
    self.emit('close', e.code, e.reason);
  };

  /**
   * @event RecognizeStream#error
   * @param {String} msg custom error message
   * @param {*} [frame] unprocessed frame (should have a .data property with either string or binary data)
   * @param {Error} [err]
   */
  function emitError(msg, frame, err) {
    if (err) {
      err.message = msg + ' ' + err.message;
    } else {
      err = new Error(msg);
    }
    err.raw = frame;
    self.emit('error', err);
  }

  socket.onmessage = function(frame) {
    if (typeof frame.data !== 'string') {
      return emitError('Unexpected binary data received from server', frame);
    }

    var data;
    try {
      data = JSON.parse(frame.data);
    } catch (jsonEx) {
      return emitError('Invalid JSON received from service:', frame, jsonEx);
    }

    /**
     * Emit any messages received over the wire, mainly used for debugging.
     *
     * @event RecognizeStream#message
     * @param {Object} message - frame object with a data attribute that's either a string or a Buffer/TypedArray
     * @param {Object} [data] - parsed JSON object (if possible);
     */
    self.emit('message', frame, data);

    if (data.error) {
      emitError(data.error, frame);
    } else if (data.state === 'listening') {
      // this is emitted both when the server is ready for audio, and after we send the close message to indicate that it's done processing
      if (self.listening) {
        self.listening = false;
        socket.close();
      } else {
        self.listening = true;
        /**
         * Emitted when the Watson Service indicates readiness to transcribe audio. Any audio sent before this point will be buffered until now.
         * @event RecognizeStream#listening
         */
        self.emit('listening');
      }
    } else {
      if (options.readableObjectMode) {
        /**
         * Object with interim or final results, possibly including confidence scores, alternatives, and word timing.
         * @event RecognizeStream#data
         * @param {Object} data
         */
        self.push(data);
      } else if (Array.isArray(data.results)) {
        data.results.forEach(function(result) {
          if (result.final && result.alternatives) {
            /**
             * Finalized text
             * @event RecognizeStream#data
             * @param {String} transcript
             */
            self.push(result.alternatives[0].transcript, 'utf8');
          }
        });
      }
    }
  };

  this.initialized = true;
};

RecognizeStream.prototype.sendJSON = function sendJSON(msg) {
  /**
   * Emits any JSON object sent to the service from the client. Mainly used for debugging.
   * @event RecognizeStream#send-json
   * @param {Object} msg
   */
  this.emit('send-json', msg);
  return this.socket.send(JSON.stringify(msg));
};

RecognizeStream.prototype.sendData = function sendData(data) {
  /**
   * Emits any Binary object sent to the service from the client. Mainly used for debugging.
   * @event RecognizeStream#send-data
   * @param {Object} msg
   */
  this.emit('send-data', data);
  return this.socket.send(data);
};

RecognizeStream.prototype._read = function() /* size*/ {
  // there's no easy way to control reads from the underlying library
  // so, the best we can do here is a no-op
};

RecognizeStream.ERROR_UNRECOGNIZED_FORMAT = 'UNRECOGNIZED_FORMAT';

RecognizeStream.prototype._write = function(chunk, encoding, callback) {
  var self = this;
  if (self.finished) {
    // can't send any more data after the stop message (although this shouldn't happen normally...)
    return;
  }
  if (!this.initialized) {
    if (!this.options.contentType) {
      var ct = RecognizeStream.getContentType(chunk);
      if (ct) {
        this.options.contentType = ct;
      } else {
        var err = new Error('Unable to determine content-type from file header, please specify manually.');
        err.name = RecognizeStream.ERROR_UNRECOGNIZED_FORMAT;
        this.emit('error', err);
        this.push(null);
        return;
      }
    }
    this.initialize();

    this.once('open', function() {
      self.sendData(chunk);
      self.afterSend(callback);
    });
  } else {
    self.sendData(chunk);
    this.afterSend(callback);
  }
};

/**
 * Flow control - don't ask for more data until we've finished what we have
 *
 * Notes:
 *
 * This limits upload speed to 100 * options.highWaterMark / second.
 *
 * The default highWaterMark is 16kB, so the default max upload speed is ~1.6MB/s.
 *
 * Microphone input provides audio at a (downsampled) rate of:
 *   16000 samples/s * 16-bits * 1 channel = 32kB/s
 * (note the bits to Bytes conversion there)
 *
 * @private
 * @param {Function} next
 */
RecognizeStream.prototype.afterSend = function afterSend(next) {
  if (this.socket.bufferedAmount <= (this._writableState.highWaterMark || 0)) {
    process.nextTick(next);
  } else {
    setTimeout(this.afterSend.bind(this, next), 10);
  }
};

/**
 * Prevents any more audio from being sent over the WebSocket and gracefully closes the connection.
 * Additional data may still be emitted up until the `end` event is triggered.
 */
RecognizeStream.prototype.stop = function() {
  /**
   * Event emitted when the stop method is called. Mainly for synchronising with file reading and playback.
   * @event RecognizeStream#stop
   */
  this.emit('stop');
  this.finish();
};

RecognizeStream.prototype.finish = function finish() {
  // this is called both when the source stream finishes, and when .stop() is fired, but we only want to send the stop message once.
  if (this.finished) {
    return;
  }
  this.finished = true;
  var self = this;
  var closingMessage = { action: 'stop' };
  if (self.socket && self.socket.readyState === self.socket.OPEN) {
    self.sendJSON(closingMessage);
  } else {
    this.once('open', function() {
      self.sendJSON(closingMessage);
    });
  }
};

RecognizeStream.prototype.promise = require('./to-promise');

RecognizeStream.getContentType = function(buffer) {
  // the substr really shouldn't be necessary, but there's a bug somewhere that can cause buffer.slice(0,4) to return
  // the entire contents of the buffer, so it's a failsafe to catch that
  return contentType.fromHeader(buffer);
};

module.exports = RecognizeStream;
