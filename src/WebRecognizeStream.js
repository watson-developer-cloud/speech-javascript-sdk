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
var Stream = require('stream');
var util = require('util');
var defaults = require('lodash/defaults');
var pick = require('lodash/pick');
var Microphone = require('./microphone');
var qs = require('querystring');


var OPENING_MESSAGE_PARAMS_ALLOWED = ['continuous', 'max_alternatives', 'timestamps', 'word_confidence', 'inactivity_timeout',
    'content-type', 'interim_results', 'keywords', 'keywords_threshold', 'word_alternatives_threshold' ];

var QS_PARAMS_ALLOWED = ['model', 'X-Watson-Learning-Opt-Out', 'watson-token'];



/**
 * IBM Watson Speech to Text client
 *
 * @param {Object} opts options
 * @param {String} opts.token Auth Token for STT service. Must be generated server-side.
 * @param {DOMElement} [opts.file] Optional File Input DOM Element - qill cause #start() to upload the file instead of request microphone permission
 * @param {Boolean} [opts.playFile=true] If a file is being uploaded, should we also play it through the speakers?
 * @constructor
 */
function WebRecognizeStream(opts) {
    Stream.Duplex.call(this);

    opts = defaults(opts, {
        model: 'en-US_BroadbandModel',
        url: "wss://stream.watsonplatform.net/speech-to-text/api",
        'content-type': 'audio/l16;rate=16000',
        interim_results: true,
        continuous: true,
        word_confidence: true,
        timestamps: true,
        max_alternatives: 3,
        inactivity_timeout: 600
    });
    if (!opts.token) {
        throw new Error("Watson Speech to Text missing required parameter: opts.token");
    }

    var self = this;

    var openingMessage = {
        'action': 'start',
    };
    defaults(openingMessage, pick(opts, OPENING_MESSAGE_PARAMS_ALLOWED));


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

    var socket;
    function initSocket(options, onopen, onlistening, onmessage, onerror, onclose) {
        var listening;

        var token = options.token;
        var model = options.model;
        var message = options.message || {'action': 'start'};

        var queryParams = pick(options, QS_PARAMS_ALLOWED);
        defaults(queryParams, {
            'watson-token': token,
            model: 'en-US_BroadbandModel'
        });

        //var sessionPermissionsQueryParam = sessionPermissions ? '0' : '1';
        // TODO: add '&X-Watson-Learning-Opt-Out=' + sessionPermissionsQueryParam once
        // we find why it's not accepted as query parameter
        var url = opts.url.replace(/^http/, 'ws') + '/v1/recognize?' + qs.stringify(queryParams);

        console.log('URL', url.substring(0, 130) + '...');
        try {
            socket = new WebSocket(url);
        } catch(err) {
            console.error('WS connection error: ', err);
        }
        socket.onopen = function() {
            console.log('socket open');
            listening = false;
            self.on('hardsocketstop', function() {
                console.log('socket: close.');
                socket.send(JSON.stringify({action: 'stop'}));
                socket.close();
            });
            self.on('socketstop', function() {
                console.log('socket: close.');
                socket.close();
            });
            console.log('sending opening message', message);
            socket.send(JSON.stringify(message));
            onopen(socket);
        };
        socket.onmessage = function(evt) {
            console.log(evt);
            var msg = JSON.parse(evt.data);
            console.log(msg);
            if (msg.error) {
                emitError(msg.error);
            } else if(msg.state === 'listening') {
                // this is emitted both when the server is ready for audio, and after we send the close message to indicate that it's done processing
                if (!self.listening) {
                    self.listening = true;
                    self.emit('listening');
                    onlistening(socket);
                } else {
                    socket.close();
                }
            } else if (msg.results) {
                /**
                 * Object with interim or final results, including possible alternatives. May have no results at all for empty audio files.
                 * @event RecognizeStream#results
                 * @param {Object} results
                 */
                self.emit('results', msg);
                // note: currently there is always either no entries or exactly 1 entry in the results array. However, this may change in the future.
                if (msg.results[0] && msg.results[0].final && msg.results[0].alternatives) {
                    /**
                     * Finalized text
                     * @event RecognizeStream#data
                     * @param {String} transcript
                     */
                    self.push(msg.results[0].alternatives[0].transcript, 'utf8'); // this is the "data" event in a node.js stream
                }
            }
            onmessage(msg, socket);
        };

        socket.onerror = function(evt) {
            console.log('WS onerror: ', evt);
            onerror(evt);
        };

        socket.onclose = function(evt) {
            console.log('WS onclose: ', evt, evt.code);

            //if (evt.code === 1011) {
            //    console.error('Server error ' + evt.code + ': please refresh your browser and try again');
            //}
            if (evt.code > 1000) {
                var err;
                if (evt.code === 1006) { // Authentication error - you should try again with a new token
                    err = new Error('Error 1006: Invalid Authentication');
                } else {
                    err = new Error('Server Error ' + e.code)
                }
                err.code = err.raw = evt.code;
                console.error('Server error ' + evt.code + ': please refresh your browser and try again');
                emitError(err);
            }
            self.emit('connection-close', evt.code);
            self.push(null);
            onclose(evt);
        };
    }


}
util.inherits(WebRecognizeStream, Stream.Duplex);

WebRecognizeStream.prototype._read = function() {}; // flow control is not implemented, at least not at this level


module.exports = WebRecognizeStream;
