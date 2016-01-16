/**
 * Copyright 2015 IBM Corp. All Rights Reserved.
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
var EventEmitter = require('events');
var util = require('util');
var defaults = require('lodash/defaults');
var Microphone = require('./microphone');


/**
 * IBM Watson Speech to Text client
 *
 * @param {Object} opts options
 * @param {String} opts.token Auth Token for STT service. Must be generated server-side.
 * @param {DOMElement} [opts.file] Optional File Input DOM Element - qill cause #start() to upload the file instead of request microphone permission
 * @param {Boolean} [opts.playFile=true] If a file is being uploaded, should we also play it through the speakers?
 * @constructor
 */
function WatsonSpeechToText(opts) {
    EventEmitter.call(this);
    opts = defaults(opts, {
        bufferSize: 8192,
        model: 'en-US_BroadbandModel',
        file: null,
        url: "https://stream.watsonplatform.net/speech-to-text/api"
    });
    if (!opts.token) {
        throw new Error("WatsonSpeechToText: missing required parameter: opts.token");
    }

    var self = this;

    /**
     * @event RecognizeStream#error
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


    function initSocket(options, onopen, onlistening, onmessage, onerror, onclose) {
        var listening;
        function withDefault(val, defaultVal) {
            return typeof val === 'undefined' ? defaultVal : val;
        }
        var socket;
        var token = options.token;
        var model = options.model || localStorage.getItem('currentModel');
        var message = options.message || {'action': 'start'};

        //var sessionPermissionsQueryParam = sessionPermissions ? '0' : '1';
        // TODO: add '&X-Watson-Learning-Opt-Out=' + sessionPermissionsQueryParam once
        // we find why it's not accepted as query parameter
        var url = options.serviceURI || 'wss://stream.watsonplatform.net/speech-to-text/api/v1/recognize?watson-token=';
        url+= token + '&model=' + model;
        console.log('URL model', model);
        try {
            socket = new WebSocket(url);
        } catch(err) {
            console.error('WS connection error: ', err);
        }
        socket.onopen = function() {
            listening = false;
            self.on('hardsocketstop', function() {
                console.log('MICROPHONE: close.');
                socket.send(JSON.stringify({action:'stop'}));
                socket.close();
            });
            self.on('socketstop', function() {
                console.log('MICROPHONE: close.');
                socket.close();
            });
            socket.send(JSON.stringify(message));
            onopen(socket);
        };
        socket.onmessage = function(evt) {
            var msg = JSON.parse(evt.data);
            if (msg.error) {
                showError(msg.error);
                self.emit('hardsocketstop');
                return;
            }
            if (msg.state === 'listening') {
                // Early cut off, without notification
                if (!listening) {
                    onlistening(socket);
                    listening = true;
                } else {
                    console.log('MICROPHONE: Closing socket.');
                    socket.close();
                }
            }
            onmessage(msg, socket);
        };

        socket.onerror = function(evt) {
            console.log('WS onerror: ', evt);
            onerror(evt);
        };

        socket.onclose = function(evt) {
            console.log('WS onclose: ', evt);
            if (evt.code === 1006) { // Authentication error - you should try again with a new token
                return false;
            }
            if (evt.code === 1011) {
                console.error('Server error ' + evt.code + ': please refresh your browser and try again');
                return false;
            }
            if (evt.code > 1000) {
                console.error('Server error ' + evt.code + ': please refresh your browser and try again');
                return false;
            }
            // Made it through, normal close
            self.removeAllEventListeners('hardsocketstop');
            self.removeAllEventListeners('socketstop');
            onclose(evt);
        };
    }


    var micOptions = {
        bufferSize: opts.bufferSize
    };
    var mic = new Microphone(micOptions);

    function handleMicrophone(callback) {
        var token = opts.token;
        var model = opts.model;
        if (model.indexOf('Narrowband') > -1) {
            var err = new Error('Microphone transcription cannot accomodate narrowband models, '+
                'please select another');
            callback(err, null);
            return false;
        }


        var options = {};
        options.token = token;
        options.message = {
            'action': 'start',
            'content-type': 'audio/l16;rate=16000',
            'interim_results': true,
            'continuous': true,
            'word_confidence': true,
            'timestamps': true,
            'max_alternatives': 3,
            'inactivity_timeout': 600
        };
        options.model = model;

        function onOpen(socket) {
            console.log('Mic socket: opened');
            callback(null, socket);
        }

        function onListening(socket) {

            mic.onAudio = function(blob) {
                if (socket.readyState < 2) {
                    socket.send(blob);
                }
            };
        }

        function onMessage(data) {
            if (data.error) {
                emitError(data.error, e);
            } else if(data.state === 'listening') {
                // this is emitted both when the server is ready for audio, and after we send the close message to indicate that it's done processing
                if (!self.listening) {
                    self.listening = true;
                    self.emit('listening');
                } else {
                    connection.close();
                }
            } else if (data.results) {
                /**
                 * Object with interim or final results, including possible alternatives. May have no results at all for empty audio files.
                 * @event RecognizeStream#results
                 * @param {Object} results
                 */
                self.emit('results', data);
                // note: currently there is always either no entries or exactly 1 entry in the results array. However, this may change in the future.
                if (data.results[0] && data.results[0].final && data.results[0].alternatives) {
                    /**
                     * Finalized text
                     * @event RecognizeStream#data
                     * @param {String} transcript
                     */
                    self.emit('text', data.results[0].alternatives[0].transcript); // this is equivalent to the the "data" event in a node.js stream
                }
            }
        }

        function onError() {
            console.log('Mic socket err: ', err);
        }

        function onClose(evt) {
            console.log('Mic socket close: ', evt);
        }

        initSocket(options, onOpen, onListening, onMessage, onError, onClose);
    }


    this.start = function start() {
        handleMicrophone(function(err) {
            if (err) {
                self.emit('error', err);
            } else {
                mic.record();
            }
        });
        return this;
    };

    this.stop = function stop() {
        mic.stop();
    };
}
util.inherits(WatsonSpeechToText, EventEmitter);


module.exports = WatsonSpeechToText;
