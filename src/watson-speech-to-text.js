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
var defaults = require('lodash/defaults');
var pick = require('lodash/pick');
var qs = require('querystring');
var RecognizeStream = require('watson-developer-cloud/services/speech_to_text/recognize_stream');
var getUserMedia = require('getusermedia');
var MicrophoneStream = require('./microphone-stream');
var WebAudioTo16leStream = require('./webaudio-to-16le-stream.js');
var fileReaderStream = require('filereader-stream');


var PARAMS_ALLOWED = ['continuous', 'max_alternatives', 'timestamps', 'word_confidence', 'inactivity_timeout',
    'model', 'content-type', 'interim_results', 'keywords', 'keywords_threshold', 'word_alternatives_threshold' ];

var DEFAULTS = {
    model: 'en-US_BroadbandModel',
    url: "https://stream.watsonplatform.net/speech-to-text/api"
};

/**
 * IBM Watson Speech to Text client
 *
 * @param {Object} options - default options applied to .stream() and .promise()
 * @param {String} options.token Auth Token for STT service. Must be generated server-side.
 * @constructor
 */
function WatsonSpeechToText(options) {

    this.options = options;

    if (!options.token) {
        throw new Error("WatsonSpeechToText: missing required parameter: opts.token");
    }
}

/**
 * Create and return a RecognizeStream from the user's microphone
 * If the options.file is set, it is used instead of the microphone
 *
 * @param [options]
 * @param {DOMElement} [options.file] - Optional File Input DOM Element - if set, this is used as the audio source instead of the microphone
 * @param {Boolean} [options.playFile=true] - If a file is set, play it locally as it's being uploaded
 * @param {String} [options.model='en-US_BroadbandModel'] - voice model to use. Microphone streaming only supports broadband models.
 * @param {String} [options.url='wss://stream.watsonplatform.net/speech-to-text/api'] base URL for service
 * @param {String} [options.content-type='audio/l16;rate=16000'] - content type of audio; should be automatically determined in most cases
 * @param {Boolean} [options.interim_results=true] - Send back non-final previews of each "sentence" as it is being processed
 * @param {Boolean} [options.continuous=true] - set to false to automatically stop the transcription after the first "sentence"
 * @param {Boolean} [options.word_confidence=false] - include confidence scores with results
 * @param {Boolean} [options.timestamps=false] - include timestamps with results
 * @param {Number} [options.max_alternatives=1] - maximum number of alternative transcriptions to include
 * @param {Number} [options.inactivity_timeout=30] - how many seconds of silence before automatically closing the stream (even if continuous is true). use -1 for infinity
 * @param {Number} [options.bufferSize=] - size of buffer for microphone audio, leave unset to let browser determine it automatically
 *
 * //todo: investigate other options at http://www.ibm.com/smarterplanet/us/en/ibmwatson/developercloud/apis/#!/speech-to-text/recognizeSessionless
 *
 * @returns {RecognizeStream}
 */
WatsonSpeechToText.prototype.stream = function stream(options) {
    options = defaults(options, this.options, {
        'content-type': (options && options.file)? null : 'audio/l16;rate=16000',
        'interim_results': true,
        'continuous': true
    });


    var recognizeStream = this.recognizeStream = new RecognizeStream(options);

    //['results', 'end', 'close', 'finish'].forEach(function(key){
    //    recognizeStream.on(key, console.log.bind(console, key))
    //});

    recognizeStream.on('stop', this.stop.bind(this));

    var source, self = this;
    if (options.file) {
        if (!options.file.files || !options.file.files.length) {
            throw new Error('Unable to read file');
        }
        if (options.playFile) {
            this.playFile(options.file.files[0]);
        }
        source = this.source = fileReaderStream(options.file.files[0]);
        source.pipe(recognizeStream);
    } else {
        getUserMedia({ video: false, audio: true }, function(err, stream) {
            if (err) {
                return recognizeStream.emit('error', err);
            }
            source = self.source = new MicrophoneStream(stream, {bufferSize: options.bufferSize});
            source
                .pipe(new WebAudioTo16leStream())
                .pipe(recognizeStream);
        });
    }

    return recognizeStream;
};


WatsonSpeechToText.prototype.playFile = function playFile(file) {
    var self = this;
    this.getContentType(file).then(function(contentType) {
        var output = self.audioOutput = new Audio();
        if (output.canPlayType(contentType)) {
            output.src = URL.createObjectURL(new Blob([file], {type: contentType}));
            output.play();
        } else {
            // if we emit an error, it prevents the promise from returning the actual result
            // however, most browsers do not support flac, so this is a reasonably scenario
            self.recognizeStream.emit('play-error', new Error('Current browser is unable to play back ' + contentType + ', transcription will continue without playback'));
        }
    }).catch(self.recognizeStream.emit.bind(self.recognizeStream,'play-error'));
};


WatsonSpeechToText.prototype.getContentType = function getContentType(file) {
    return new Promise(function(resolve, reject) {
        var blobToText = new Blob([file]).slice(0, 4);
        var r = new FileReader();
        r.readAsText(blobToText);
        r.onload = function() {
            if (r.result === 'fLaC') {
                resolve('audio/flac');
            } else if (r.result === 'RIFF') {
                resolve('audio/wav');
            } else if (r.result === 'OggS') {
                resolve('audio/ogg; codecs=opus');
            } else {
                reject(new Error('Unable to determine content type from file header; only wav, flac, and ogg/opus are supported.'))
            }
        };
    });
};


WatsonSpeechToText.prototype.promise = function promise(options) {
    var self = this;
    return new Promise(function(resolve, reject) {
        options = defaults(options, {
            'interim_results': false,
        });
        var stream = self.stream(options);
        var results = [];
        stream.on('data', function(){}) // put stream into flowing mode so that end event will be emitted
            .on('result', function(result) {
                results.push(result);
            }).on('end', function() {
                resolve(results);
            }).on('error', function(err) {
                reject('error');
            })
    })
};

WatsonSpeechToText.prototype.stop = function stop() {
    if (this.audioOutput) {
        this.audioOutput.pause();
        this.audioOutput.currentTime = 0;
    }
    if (this.source && this.source.stop) {
        this.source.stop();
    }

};


WatsonSpeechToText.resultsToText = function resultsToText(results) {
    return results.map(function(result) {
        return (result && result.final && result.alternatives && result.alternatives.length) ? result.alternatives[0].transcript : ''
    }).join(' ');
};

module.exports = WatsonSpeechToText;
