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


var Duplex = require('stream').Duplex;
var util = require('util');
var pick = require('object.pick');
var W3CWebSocket = require('websocket').w3cwebsocket;
var contentType = require('./content-type');
var defaults = require('defaults');
var qs = require('../util/querystring.js');

var OPENING_MESSAGE_PARAMS_ALLOWED = ['continuous', 'max_alternatives', 'timestamps', 'word_confidence', 'inactivity_timeout',
  'content-type', 'interim_results', 'keywords', 'keywords_threshold', 'word_alternatives_threshold', 'profanity_filter'];

var QUERY_PARAMS_ALLOWED = ['model', 'watson-token']; // , 'X-Watson-Learning-Opt-Out' - should be allowed but currently isn't due to a service bug


/**
 * pipe()-able Node.js Readable/Writeable stream - accepts binary audio and emits text/objects in it's `data` events.
 *
 * Uses WebSockets under the hood. For audio with no recognizable speech, no `data` events are emitted.
 *
 * By default, only finalized text is emitted in the data events, however in `readableObjectMode` (usually just `objectMode` when using a helper method).
 *
 *  An interim result looks like this:
 ```js
 { alternatives:
   [ { timestamps:
        [ [ 'it', 20.9, 21.04 ],
          [ 'is', 21.04, 21.17 ],
          [ 'a', 21.17, 21.25 ],
          [ 'site', 21.25, 21.56 ],
          [ 'that', 21.56, 21.7 ],
          [ 'hardly', 21.7, 22.06 ],
          [ 'anyone', 22.06, 22.49 ],
          [ 'can', 22.49, 22.67 ],
          [ 'behold', 22.67, 23.13 ],
          [ 'without', 23.13, 23.46 ],
          [ 'some', 23.46, 23.67 ],
          [ 'sort', 23.67, 23.91 ],
          [ 'of', 23.91, 24 ],
          [ 'unwanted', 24, 24.58 ],
          [ 'emotion', 24.58, 25.1 ] ],
       transcript: 'it is a site that hardly anyone can behold without some sort of unwanted emotion ' } ],
  final: false,
  result_index: 3 }
 ```

 While a final result looks like this (some features only appear in final results):
 ```js
  { alternatives:
     [ { word_confidence:
          [ [ 'it', 1 ],
            [ 'is', 0.956286624429304 ],
            [ 'a', 0.8105753725270362 ],
            [ 'site', 1 ],
            [ 'that', 1 ],
            [ 'hardly', 1 ],
            [ 'anyone', 1 ],
            [ 'can', 1 ],
            [ 'behold', 0.5273598005406737 ],
            [ 'without', 1 ],
            [ 'some', 1 ],
            [ 'sort', 1 ],
            [ 'of', 1 ],
            [ 'unwanted', 1 ],
            [ 'emotion', 0.49401837076320887 ] ],
         confidence: 0.881,
         transcript: 'it is a site that hardly anyone can behold without some sort of unwanted emotion ',
         timestamps:
          [ [ 'it', 20.9, 21.04 ],
            [ 'is', 21.04, 21.17 ],
            [ 'a', 21.17, 21.25 ],
            [ 'site', 21.25, 21.56 ],
            [ 'that', 21.56, 21.7 ],
            [ 'hardly', 21.7, 22.06 ],
            [ 'anyone', 22.06, 22.49 ],
            [ 'can', 22.49, 22.67 ],
            [ 'behold', 22.67, 23.13 ],
            [ 'without', 23.13, 23.46 ],
            [ 'some', 23.46, 23.67 ],
            [ 'sort', 23.67, 23.91 ],
            [ 'of', 23.91, 24 ],
            [ 'unwanted', 24, 24.58 ],
            [ 'emotion', 24.58, 25.1 ] ] },
       { transcript: 'it is a sight that hardly anyone can behold without some sort of unwanted emotion ' },
       { transcript: 'it is a site that hardly anyone can behold without some sort of unwanted emotions ' } ],
    final: true,
    result_index: 3 }
 ```

 *
 * @param {Object} options
 * @param {String} [options.model='en-US_BroadbandModel'] - voice model to use. Microphone streaming only supports broadband models.
 * @param {String} [options.url='wss://stream.watsonplatform.net/speech-to-text/api'] base URL for service
 * @param {String} [options.content-type='audio/wav'] - content type of audio; can be automatically determined from file header in most cases. only wav, flac, and ogg/opus are supported
 * @param {Boolean} [options.interim_results=true] - Send back non-final previews of each "sentence" as it is being processed. These results are ignored in text mode.
 * @param {Boolean} [options.continuous=true] - set to false to automatically stop the transcription after the first "sentence"
 * @param {Boolean} [options.word_confidence=false] - include confidence scores with results. Defaults to true when in objectMode.
 * @param {Boolean} [options.timestamps=false] - include timestamps with results. Defaults to true when in objectMode.
 * @param {Number} [options.max_alternatives=1] - maximum number of alternative transcriptions to include. Defaults to 3 when in objectMode.
 * @param {Array<String>} [options.keywords] - a list of keywords to search for in the audio
 * @param {Number} [options.keywords_threshold] - Number between 0 and 1 representing the minimum confidence before including a keyword in the results. Required when options.keywords is set
 * @param {Number} [options.word_alternatives_threshold] - Number between 0 and 1 representing the minimum confidence before including an alternative word in the results. Must be set to enable word alternatives,
 * @param {Boolean} [options.profanity_filter=false] - set to true to filter out profanity and replace the words with *'s
 * @param {Number} [options.inactivity_timeout=30] - how many seconds of silence before automatically closing the stream (even if continuous is true). use -1 for infinity
 * @param {Boolean} [options.readableObjectMode=false] - emit `result` objects instead of string Buffers for the `data` events. Changes several other defaults.
 * @param {Number} [options.X-WDC-PL-OPT-OUT=0] - set to 1 to opt-out of allowing Watson to use this request to improve it's services
 *
 * @constructor
 */
function RecognizeStream(options) {
  Duplex.call(this, options);
  this.options = options;
  this.listening = false;
  this.initialized = false;
  this.finished = false;
  var self = this;

  /**
   * listening for `results` events should put the stream in flowing mode just like `data` events
   *
   * @param {String} event
   */
  function flowForResults(event) {
    if (event === 'results' || event === 'result') {
      self.removeListener('newListener', flowForResults);
      process.nextTick(function() {
        self.on('data', function() {
        }); // todo: is there a better way to put a stream in flowing mode?
      });
      if (!options.silent) {
        // todo: move this to the node.js wrapper
        // eslint-disable-next-line no-console
        console.log(new Error('Watson Speech to Text RecognizeStream: the ' + event + ' event is deprecated and will be removed from a future release. ' +
          'Please set {objectMode: true} and listen for the data event instead. ' +
          'Pass {silent: true} to disable this message.'));
      }
    }
  }
  this.on('newListener', flowForResults);
}
util.inherits(RecognizeStream, Duplex);


RecognizeStream.prototype.initialize = function() {
  var options = this.options;

  // todo: apply these corrections to other methods (?)
  if (options.token && !options['watson-token']) {
    options['watson-token'] = options.token;
  }
  if (options.content_type && !options['content-type']) {
    options['content-type'] = options.content_type;
  }
  if (options['X-WDC-PL-OPT-OUT'] && !options['X-Watson-Learning-Opt-Out']) {
    options['X-Watson-Learning-Opt-Out'] = options['X-WDC-PL-OPT-OUT'];
  }

  var queryParams = util._extend({model: 'en-US_BroadbandModel'}, pick(options, QUERY_PARAMS_ALLOWED));
  var queryString = qs.stringify(queryParams);
  var url = (options.url || 'wss://stream.watsonplatform.net/speech-to-text/api').replace(/^http/, 'ws') + '/v1/recognize?' + queryString;

  // turn off all the extras if we're just outputting text
  var textModeDefaults = {
    action: 'start',
    'content-type': 'audio/wav',
    continuous: true,
    inactivity_timeout: 30,
    interim_results: true,
    word_confidence: false,
    timestamps: false,
    max_alternatives: 1
  };

  // but turn everything on if we're in objectMode and the end user can consume it
  var objectModeDefaults = {
    action: 'start',
    'content-type': 'audio/wav',
    continuous: true,
    inactivity_timeout: 30,
    interim_results: true,
    word_confidence: false,
    timestamps: false,
    max_alternatives: 1
  };

  var openingMessage = defaults(
    pick(options, OPENING_MESSAGE_PARAMS_ALLOWED),
    (options.objectMode || options.readableObjectMode) ? objectModeDefaults : textModeDefaults
  );

  var self = this;

  // node params: requestUrl, protocols, origin, headers, extraRequestOptions
  // browser params: requestUrl, protocols (all others ignored)
  var socket = this.socket = new W3CWebSocket(url, null, null, options.headers, null);

  // when the input stops, let the service know that we're done
  self.on('finish', self.finish.bind(self));

  socket.onerror = function(error) {
    self.listening = false;
    self.emit('error', error);
  };


  this.socket.onopen = function() {
    self.sendJSON(openingMessage);
    self.emit('connect');
  };

  this.socket.onclose = function(e) {
    if (self.listening) {
      self.listening = false;
      self.push(null);
    }
    /**
     * @event RecognizeStream#close
     * @param {Number} reasonCode
     * @param {String} description
     */
    self.emit('close', e.code, e.reason);
    /**
     * @event RecognizeStream#connection-close
     * @param {Number} reasonCode
     * @param {String} description
     * @deprecated
     */
    self.emit('connection-close', e.code, e.reason);
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
     * @event RecognizeStream#receive-json
     * @param {Object} msg - the raw JSON received from Watson - sometimes useful for debugging
     */
    self.emit('receive-json', data);

    if (data.error) {
      emitError(data.error, frame);
    } else if (data.state === 'listening') {
      // this is emitted both when the server is ready for audio, and after we send the close message to indicate that it's done processing
      if (self.listening) {
        self.listening = false;
        self.push(null);
        socket.close();
      } else {
        self.listening = true;
        self.emit('listening');
      }
    } else if (data.results) {
      /**
       * Object with array of interim or final results, possibly including confidence scores, alternatives, and word timing. May have no results at all for empty audio files.
       * @event RecognizeStream#results
       * @param {Object} results
       * @deprecated - use objectMode and listen for the 'data' event instead
       */
      self.emit('results', data.results);

      // note: currently there is always either 0 or 1 entries in the results array. However, this may change in the future.
      data.results.forEach(function(result) {
        result.index = data.result_index;
        /**
         * Object with interim or final results, possibly including confidence scores, alternatives, and word timing.
         * @event RecognizeStream#results
         * @param {Object} results
         * @deprecated - use objectMode and listen for the 'data' event instead
         */
        self.emit('result', result);
        if (options.objectMode || options.readableObjectMode) {
          /**
           * Object with interim or final results, possibly including confidence scores, alternatives, and word timing.
           * @event RecognizeStream#data
           * @param {Object} data
           */
          self.push(result);
        } else if (result.final && result.alternatives) {
          /**
           * Finalized text
           * @event RecognizeStream#data
           * @param {String} transcript
           */
          self.push(result.alternatives[0].transcript, 'utf8');
        }
      });
    } else {
      emitError('Unrecognised message from server', frame);
    }
  };

  this.initialized = true;
};

RecognizeStream.prototype.sendJSON = function sendJSON(msg) {
  /**
   * @event RecognizeStream#send-json
   * @param {Object} msg - the raw JSON sent to Watson - sometimes useful for debugging
   */
  this.emit('send-json', msg);
  return this.socket.send(JSON.stringify(msg));
};

RecognizeStream.prototype.sendData = function sendData(data) {
  this.emit('send-data', data);
  return this.socket.send(data);
};

RecognizeStream.prototype._read = function(/* size*/) {
  // there's no easy way to control reads from the underlying library
  // so, the best we can do here is a no-op
};

RecognizeStream.prototype._write = function(chunk, encoding, callback) {
  var self = this;
  if (self.finished) {
    // can't send any more data after the stop message (although this shouldn't happen normally...)
    return;
  }
  if (self.listening) {
    self.sendData(chunk);
    this.afterSend(callback);
  } else {
    if (!this.initialized) {
      if (!this.options['content-type']) {
        this.options['content-type'] = RecognizeStream.getContentType(chunk);
      }
      this.initialize();
    }
    this.once('listening', function() {
      self.sendData(chunk);
      self.afterSend(callback);
    });
  }
};

// flow control - don't ask for more data until we've finished what we have
// todo: see if this can be improved
RecognizeStream.prototype.afterSend = function afterSend(next) {
  if (this.socket.bufferedAmount <= this._writableState.highWaterMark || 0) {
    next(); // eslint-disable-line callback-return
  } else {
    setTimeout(this.afterSend.bind(this, next), 10);
  }
};

RecognizeStream.prototype.stop = function() {
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
  var closingMessage = {action: 'stop'};
  if (self.socket && self.socket.readyState !== self.socket.CLOSED && self.socket.readyState !== self.socket.CLOSING) {
    self.sendJSON(closingMessage);
  } else {
    this.once('connect', function() {
      self.sendJSON(closingMessage);
    });
  }
};

RecognizeStream.prototype.promise = require('./to-promise');


RecognizeStream.getContentType = function(buffer) {
  return contentType(buffer.slice(0, 4).toString());
};


module.exports = RecognizeStream;
