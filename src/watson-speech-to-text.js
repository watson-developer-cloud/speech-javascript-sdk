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


var PARAMS_ALLOWED = ['continuous', 'max_alternatives', 'timestamps', 'word_confidence', 'inactivity_timeout',
    /*'model',*/ 'content-type', 'interim_results', 'keywords', 'keywords_threshold', 'word_alternatives_threshold' ];

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
    Stream.Readable.call(this);

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

    var socket;
    function initSocket(options, onopen, onlistening, onmessage, onerror, onclose) {
        var listening;

        var token = options.token;
        var model = options.model || localStorage.getItem('currentModel');
        var message = options.message || {'action': 'start'};

        //var sessionPermissionsQueryParam = sessionPermissions ? '0' : '1';
        // TODO: add '&X-Watson-Learning-Opt-Out=' + sessionPermissionsQueryParam once
        // we find why it's not accepted as query parameter
        var url = options.serviceURI || 'wss://stream.watsonplatform.net/speech-to-text/api/v1/recognize?watson-token=';
        url+= token + '&model=' + model;
        console.log('URL', url);
        try {
            socket = new WebSocket(url);
        } catch(err) {
            console.error('WS connection error: ', err);
        }
        socket.onopen = function() {
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


    var micOptions = {
        bufferSize: opts.bufferSize
    };
    var mic = new Microphone(micOptions);

    function handleMicrophone(callback) {
        if (opts.model.indexOf('Narrowband') > -1) {
            var err = new Error('Microphone transcription cannot accomodate narrowband models, '+
                'please select another');
            callback(err, null);
            return false;
        }


        var options = {
            token: opts.token,
            model: opts.model
        };
        options.message = defaults(pick(opts, PARAMS_ALLOWED), {
            'action': 'start',
            'content-type': 'audio/l16;rate=16000',
            'interim_results': true,
            'continuous': true,
            'word_confidence': true,
            'timestamps': true,
            'max_alternatives': 3,
            'inactivity_timeout': 600
        });

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

        }

        function onError() {
            console.log('Mic socket err: ', err);
            mic.stop();
        }

        function onClose(evt) {
            console.log('Mic socket close: ', evt);
            mic.stop();
        }

        initSocket(options, onOpen, onListening, onMessage, onError, onClose);
    }

    var running = false;
    function handleFileUpload(file) {
        running = true;
        self.on('hardsocketstop', function() {
            running = false;
        });

        // Read first 4 bytes to determine header
        var blobToText = new Blob([file]).slice(0, 4);
        var r = new FileReader();
        r.readAsText(blobToText);
        r.onload = function() {
            var contentType, audio;
            if (r.result === 'fLaC') {
                contentType = 'audio/flac';
                console.log('Notice: browsers do not support playing FLAC audio, so no audio will accompany the transcription');
            } else if (r.result === 'RIFF') {
                contentType = 'audio/wav';
                audio = new Audio();
                audio.src = URL.createObjectURL(new Blob([file], {type: 'audio/wav'}));
                audio.play();
                self.on('hardsocketstop', function() {
                    audio.pause();
                    audio.currentTime = 0;
                });
            } else if (r.result === 'OggS') {
                contentType = 'audio/ogg; codecs=opus';
                audio = new Audio();
                audio.src = URL.createObjectURL(new Blob([file], {type: 'audio/ogg; codecs=opus'}));
                audio.play();
                self.on('hardsocketstop', function() {
                    audio.pause();
                    audio.currentTime = 0;
                });
            } else {
                console.log('header', r.result.toString());
                emitError('Only WAV or FLAC or Opus files can be transcribed, please try another file format');
                return;
            }

            function fileBlock(_offset, length, _file, readChunk) {
                var r = new FileReader();
                var blob = _file.slice(_offset, length + _offset);
                r.onload = readChunk;
                r.readAsArrayBuffer(blob);
            }

            function onFileProgress(options, ondata, running, onerror, onend, samplingRate) {
                var file       = options.file;
                var fileSize   = file.size;
                var chunkSize  = options.bufferSize || 16000;  // in bytes
                var offset     = 0;
                var readChunk = function(evt) {
                    if (offset >= fileSize) {
                        console.log('Done reading file');
                        onend();
                        return;
                    }
                    if(!running()) {
                        return;
                    }
                    if (evt.target.error == null) {
                        var buffer = evt.target.result;
                        offset += buffer.byteLength;
                        //console.log('sending: ' + len);
                        ondata(buffer); // callback for handling read chunk
                    } else {
                        var errorMessage = evt.target.error;
                        console.log('Read error: ' + errorMessage);
                        onerror(errorMessage);
                        return;
                    }
                    // use this timeout to pace the data upload for the playSample case,
                    // the idea is that the hyps do not arrive before the audio is played back
                    // todo: upload the file at full-speed and instead use the word timings to control when they appear
                    if (samplingRate) {
                        // console.log('samplingRate: ' +
                        //  samplingRate + ' timeout: ' + (chunkSize * 1000) / (samplingRate * 2));
                        setTimeout(function() {
                            fileBlock(offset, chunkSize, file, readChunk);
                        }, (chunkSize * 1000) / (samplingRate * 2));
                    } else {
                        fileBlock(offset, chunkSize, file, readChunk);
                    }
                };
                fileBlock(offset, chunkSize, file, readChunk);
            }

            function callback(socket) {
                var blob = new Blob([file]);
                var parseOptions = {
                    file: blob
                };
                onFileProgress(parseOptions,
                    // On data chunk
                    function onData(chunk) {
                        socket.send(chunk);
                    },
                    function isRunning() {
                        if(running)
                            return true;
                        else
                            return false;
                    },
                    // On file read error
                    function(evt) {
                        console.log('Error reading file: ', evt.message);
                        emitError(evt.message);
                    },
                    // On load end
                    function() {
                        running = false;
                        socket.send(JSON.stringify({'action': 'stop'}));
                    });
            }
            function onend() {

            }

            self.on('progress', function(evt, data) {
                console.log('progress: ', data);
            });

            console.log('contentType', contentType);

            var options = {
                token: opts.token,
                model: opts.model
            };
            options.message = defaults(pick(opts, PARAMS_ALLOWED), {
                'action': 'start',
                'content-type': contentType,
                'interim_results': true,
                'continuous': true,
                'word_confidence': true,
                'timestamps': true,
                'max_alternatives': 3,
                'inactivity_timeout': 600
            });

            function onOpen() {
                console.log('Socket opened');
            }

            function onListening(socket) {
                console.log('Socket listening');
                callback(socket);
            }

            function onMessage(msg) {

            }

            function onError(evt) {
                localStorage.setItem('currentlyDisplaying', 'false');
                onend(evt);
                console.log('Socket err: ', evt.code);
            }

            function onClose(evt) {
                localStorage.setItem('currentlyDisplaying', 'false');
                onend(evt);
                console.log('Socket closing: ', evt);
            }

            initSocket(options, onOpen, onListening, onMessage, onError, onClose);
        };
    }



    this.start = function start() {
        if (opts.file) {
            handleFileUpload(opts.file);
        } else {
            handleMicrophone(function(err) {
                if (err) {
                    self.emit('error', err);
                } else {
                    mic.record();
                }
            });
        }

        return this;
    };

    this.stop = function stop() {
        console.log('stopping');
        mic.stop();
        if (socket) {
            socket.send(JSON.stringify({action:'stop'}));
        }
    };
}
util.inherits(WatsonSpeechToText, Stream.Readable);

WatsonSpeechToText.prototype._read = function() {}; // flow control is not implemented, at least not at this level


module.exports = WatsonSpeechToText;
