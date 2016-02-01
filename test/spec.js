'use strict';

var assert = require('assert');

var WatsonSpeechToText = require('../speech-to-text');

var expect = require('expect.js');
var concat = require('concat-stream');

if (typeof fetch == "undefined") {
  require('whatwg-fetch');
}

// this is mainly for fetching the token, but it also determines what server to connect to during an offline test
function getConfig() {
  //console.log('getting config');
  return fetch('http://localhost:9877/token').then(function(response) {
    return response.json();
  });
}

function getAudio() {
  return fetch('http://localhost:9877/audio.wav').then(function(response) {
    return response.blob();
  });
}

// offline = mock server that ignores actual audio data
// integration = testing against actual watson servers
var offline = process.env.TEST_MODE !== 'integration';
var chrome = navigator.userAgent.indexOf('Chrome') >=0;
var travis = !!process.env.TRAVIS;

describe("WatsonSpeechToText", function() {

  this.timeout(30*1000);

  // not sure why, but I can't convince firefox or chrome to actually play <audio> elements during tests
  // also, on travis, the element never appears to stop playing (or, more likely, it nevers starts in the first place)
  it('should transcribe <audio> elements', function(done) {
    getConfig().then(function(cfg) {
      var audioElement = new Audio();
      audioElement.crossOrigin = true;
      audioElement.src = "http://localhost:9877/audio.wav";
      cfg.element = audioElement;
      cfg.muteSource = true;
      var stream = WatsonSpeechToText.recognizeElement(cfg);
      //stream.on('send-json', console.log.bind(console, 'sending'));
      //stream.on('message', console.log.bind(console, 'received'));
      //stream.on('send-data', function(d) {
      //  console.log('sending ' + d.length + ' bytes');
      //});
      return stream.promise();
    }).then(function(transcription) {
      assert.equal(transcription.trim(), 'thunderstorms could produce large hail isolated tornadoes and heavy rain');
      done();
    })
    .catch(done);
  });

  // firefox can automatically approve getUserMedia, but not playback audio, so offline only
  // ...except on travis ci, where it gets NO_DEVICES_FOUND
  // chrome can do both, so it gets tested on and offline
  (offline && !travis || chrome ? it : xit)("should transcribe mic input", function(done) {
    getConfig().then(function(cfg) {
      var stt = WatsonSpeechToText.recognizeMicrophone(cfg);
      //stt.on('send-json', console.log.bind(console, 'sending'));
      //stt.on('message', console.log.bind(console, 'received'));
      //stt.on('send-data', function(d) {
      //  console.log('sending ' + d.length + ' bytes');
      //})
      stt.on('error', done)
      .setEncoding('utf8')
      .pipe(concat(function (transcription) {
        assert.equal(transcription.trim(), 'thunderstorms could produce large hail isolated tornadoes and heavy rain');
        done();
      }));
      setTimeout(stt.stop.bind(stt), 8 * 1000);

      //['end', 'close', 'data', /*'results',*/ 'result', 'error', 'stopping', 'finish', 'listening'].forEach(function (eventName) {
      //  stt.on(eventName, console.log.bind(console, eventName + ' event: '));
      //});
    }).catch(done);
  });

  it('should transcribe files', function(done) {
    Promise.all([getConfig(), getAudio()]).then(function(results) {
      var cfg = results[0];
      cfg.data = results[1];
      return WatsonSpeechToText.recognizeBlob(cfg).promise()
        .then(function(transcription) {
          assert.equal(transcription.trim(), 'thunderstorms could produce large hail isolated tornadoes and heavy rain');
          done();
        });
    }).catch(done);
  });

});
