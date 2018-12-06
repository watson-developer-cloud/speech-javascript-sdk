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
var BlobStream = require('readable-blob-stream');
var RecognizeStream = require('watson-developer-cloud/lib/recognize-stream');
var FilePlayer = require('./file-player.js');
var FormatStream = require('./format-stream.js');
var TimingStream = require('./timing-stream.js');
var assign = require('object.assign/polyfill')();
var WritableElementStream = require('./writable-element-stream');
var ResultStream = require('./result-stream');
var SpeakerStream = require('./speaker-stream');
var contentType = require('./content-type');
var fetch = require('nodeify-fetch'); // like regular fetch, but with an extra method on the response to get a node-style ReadableStream

/**
 * @module watson-speech/speech-to-text/recognize-file
 */

/**
 * Create and return a RecognizeStream from a File or Blob
 * (e.g. from a file <input>, a dragdrop target, or an ajax request)
 *
 * @param {Object} options - Also passed to {MediaElementAudioStream} and to {RecognizeStream}
 * @param {String} [options.url='wss://stream.watsonplatform.net/speech-to-text/api'] - Base URL for a service instance
 * @param {String} options.token - Auth Token for CF services - see https://github.com/watson-developer-cloud/node-sdk#authorization
 * @param {String} options.access_token - IAM Access Token for RC services - see https://github.com/watson-developer-cloud/node-sdk#authorization
 * @param {Blob|FileString} options.file - String url or the raw audio data as a Blob or File instance to be transcribed (and optionally played). Playback may not with with Blob or File on mobile Safari.
 * @param {Boolean} [options.play=false] - If a file is set, play it locally as it's being uploaded
 * @param {Boolena} [options.format=true] - pipe the text through a {FormatStream} which performs light formatting. Also controls smart_formatting option unless explicitly set.
 * @param {Boolena} [options.realtime=options.play] - pipe the text through a {TimingStream} which slows the output down to real-time to match the audio playback.
 * @param {String|DOMElement} [options.outputElement] pipe the text to a WriteableElementStream targeting the specified element. Also defaults objectMode to true to enable interim results.
 * @param {Boolean} [options.extractResults=false] pipe results through a ResultExtractor stream to simplify the objects. (Default behavior before v0.22) Automatically enables objectMode.
 * @param {Boolean} [options.resultsBySpeaker=false] pipe results through a SpeakerStream. Causes each data event to include multiple results, each with a speaker field. Automatically enables objectMode and speaker_labels.  Adds some delay to processing.
 *
 * @return {RecognizeStream|SpeakerStream|FormatStream|ResultStream|TimingStream}
 */
module.exports = function recognizeFile(options) {
  // eslint-disable-line complexity
  if (!options || (!options.token && !options.access_token)) {
    throw new Error('WatsonSpeechToText: missing required parameter: opts.token (CF) or opts.access_token (RC)');
  }

  if (options.data && !options.file) {
    options.file = options.data;
    delete options.data;
    if (!options.silent) {
      // eslint-disable-next-line no-console
      console.log(new Error('WatsonSpeechToText recognizeFile(): Warning data option was renamed to file. Set silent: true to hide this warning.'));
    }
  }

  // the WritableElementStream works best in objectMode
  if (options.outputElement && options.objectMode !== false) {
    options.objectMode = true;
  }
  // the ResultExtractor only works in objectMode
  if (options.extractResults) {
    options.objectMode = true;
  }
  // SpeakerStream requires objectMode and speaker_labels
  if (options.resultsBySpeaker) {
    options.objectMode = true;
    options.speaker_labels = true;
  }

  // default format to true (capitals and periods)
  // default smart_formatting to options.format value (dates, currency, etc.)
  options.format = options.format !== false;
  if (typeof options.smart_formatting === 'undefined') {
    options.smart_formatting = options.format;
  }

  var realtime = options.realtime || (typeof options.realtime === 'undefined' && options.play);

  // the timing stream requires timestamps to work, so enable them automatically
  if (realtime) {
    options.timestamps = true;
  }

  // Attempt to guess content-type based on filename
  // If this fails, recognizeStream will make a second attempt based on the file header
  if (!options['content-type']) {
    options['content-type'] = contentType.fromFilename(options.file);
  }

  var rsOpts = assign(
    {
      interim_results: true
    },
    options
  );

  var recognizeStream = new RecognizeStream(rsOpts);
  var streams = [recognizeStream]; // collect all of the streams so that we can bundle up errors and send them to the last one
  var stream = recognizeStream;
  if (typeof options.file === 'string') {
    fetch(options.file)
      .then(function(response) {
        return response.readable();
      })
      .then(function(source) {
        source.pipe(recognizeStream);
        streams.unshift(source);
      })
      .catch(function(er) {
        recognizeStream.emit('error', er);
      });
  } else {
    var source = new BlobStream(options.file);
    source.pipe(recognizeStream);
    streams.unshift(source);
  }

  // note: the TimingStream cannot currently handle results as regrouped by the SpeakerStream
  // so it must come first
  var timingStream;
  if (realtime) {
    timingStream = new TimingStream(options);
    stream = stream.pipe(timingStream);
    streams.push(stream);
    stream.on('stop', recognizeStream.stop.bind(recognizeStream));
  } else {
    stream.stop = recognizeStream.stop.bind(recognizeStream);
  }

  if (options.resultsBySpeaker) {
    stream = stream.pipe(new SpeakerStream(options));
    streams.push(stream);
  }

  // note: the format stream should come after the speaker stream to format sentences correctly
  if (options.format) {
    stream = stream.pipe(new FormatStream(options));
    streams.push(stream);
  }

  if (options.play) {
    // when file playback actually begins
    // (mostly important for downloaded files)
    FilePlayer.playFile(options.file, options['content-type'])
      .then(function(player) {
        recognizeStream.on('stop', player.stop.bind(player));
        recognizeStream.on('error', player.stop.bind(player));

        // for files loaded via URL, restet the start time of the timing stream to when it begins playing
        if (timingStream && typeof options.file === 'string') {
          // eslint-disable-next-line func-style
          var fn = function() {
            timingStream.setStartTime(); // defaults to Date.now()
            player.audio.removeEventListener('playing', fn);
          };
          player.audio.addEventListener('playing', fn);
        }
      })
      .catch(function(err) {
        // Node.js automatically unpipes any source stream(s) when an error is emitted (on the assumption that the previous stream's output caused the error.)
        // In this case, we don't want that behavior - a playback error should not stop the transcription
        // So, we have to:
        //   1. find the source streams
        //   2. emit the error (causing the automatic unpipe)
        //   3. re-pipe the source streams

        var sources = streams.filter(function(s) {
          return (
            s._readableState &&
            s._readableState.pipes &&
            (s._readableState.pipes === stream || (Array.isArray(s._readableState.pipes) && s._readableState.pipes.indexOf(stream) !== -1))
          );
        });

        stream.emit('error', err);

        sources.forEach(function(s) {
          s.pipe(stream);
        });
      });
  }

  if (options.outputElement) {
    // we don't want to return the WES, just send data to it
    streams.push(stream.pipe(new WritableElementStream(options)));
  }

  if (options.extractResults) {
    var stop = stream.stop ? stream.stop.bind(stream) : recognizeStream.stop.bind(recognizeStream);
    stream = stream.pipe(new ResultStream());
    stream.stop = stop;
    streams.push(stream);
  }

  // Capture errors from any stream except the last one and emit them on the last one
  streams.forEach(function(prevStream) {
    if (prevStream !== stream) {
      prevStream.on('error', stream.emit.bind(stream, 'error'));
    }
  });

  if (!stream.stop) {
    if (timingStream) {
      stream.stop = timingStream.stop.bind(timingStream);
    } else {
      stream.stop = recognizeStream.stop.bind(recognizeStream);
    }
  }

  // expose the original stream to for debugging (and to support the JSON tab on the STT demo)
  stream.recognizeStream = recognizeStream;

  return stream;
};
