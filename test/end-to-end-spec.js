'use strict';

var assert = require('assert');

var SpeechToText = require('../speech-to-text');

var concat = require('concat-stream');

if (typeof fetch == 'undefined') {
  require('whatwg-fetch');
}

// this is mainly for fetching the token, but it also determines what server to connect to during an offline test
function getConfig() {
  // console.log('getting config');
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
var chrome = navigator.userAgent.indexOf('Chrome') >= 0;
var travis = !!process.env.TRAVIS;

describe('WatsonSpeech.SpeechToText end-to-end', function() {
  this.timeout(30 * 1000); // eslint-disable-line no-invalid-this

  // firefox can automatically approve getUserMedia, but not playback audio, so offline only
  // ...except on travis ci, where it gets NO_DEVICES_FOUND
  // chrome can do both, so it gets tested on and offline
  (offline && !travis || chrome ? it : xit)('should transcribe mic input', function(done) {
    getConfig().then(function(cfg) {
      var stt = SpeechToText.recognizeMicrophone(cfg);
      // stt.on('send-json', console.log.bind(console, 'sending'));
      // stt.on('message', console.log.bind(console, 'received'));
      // stt.on('send-data', function(d) {
      //  console.log('sending ' + d.length + ' bytes');
      // })
      stt.on('error', done)
        .setEncoding('utf8')
        .pipe(concat(function(transcript) {
          assert.equal(transcript, 'Thunderstorms could produce large hail isolated tornadoes and heavy rain. ');
          done();
        }));
      setTimeout(stt.stop.bind(stt), 8 * 1000);

      // ['end', 'close', 'data', /*'results',*/ 'result', 'error', 'stopping', 'finish', 'listening'].forEach(function (eventName) {
      //  stt.on(eventName, console.log.bind(console, eventName + ' event: '));
      // });
    })
      .catch(done);
  });

  it('should transcribe files', function(done) {
    Promise.all([getConfig(), getAudio()]).then(function(results) {
      var cfg = results[0];
      cfg.file = results[1];
      return SpeechToText.recognizeFile(cfg).promise()
        .then(function(transcript) {
          assert.equal(transcript, 'Thunderstorms could produce large hail isolated tornadoes and heavy rain. ');
          done();
        });
    })
      .catch(done);
  });

  it('should transcribe files via URL', function(done) {
    getConfig().then(function(cfg) {
      cfg.file = 'http://localhost:9877/audio.wav';
      return SpeechToText.recognizeFile(cfg).promise()
        .then(function(transcript) {
          assert.equal(transcript, 'Thunderstorms could produce large hail isolated tornadoes and heavy rain. ');
          done();
        });
    })
      .catch(done);
  });

  it('should transcribe files with dom output', function(done) {
    Promise.all([getConfig(), getAudio()]).then(function(results) {
      var cfg = results[0];
      cfg.file = results[1];
      var el = document.createElement('div');
      cfg.outputElement = el;
      return SpeechToText.recognizeFile(cfg).promise()
        .then(function() {
          assert.equal(el.textContent, 'Thunderstorms could produce large hail isolated tornadoes and heavy rain. ');
          done();
        });
    }).catch(done);

  });

});
