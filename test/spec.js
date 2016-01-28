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

describe("WatsonSpeechToText", function() {

  this.timeout(30*1000);


  it('should transcribe <audio> elements', function(done) {
    getConfig().then(function(cfg) {
      var audioElement = new Audio();
      audioElement.src = "http://localhost:9877/audio.wav";
      cfg.element = audioElement;
      return WatsonSpeechToText.recognizeElement(cfg).promise();
    }).then(function(transcription) {
        assert.equal(transcription.trim(), 'thunderstorms could produce large hail isolated tornadoes and heavy rain');
        done();
      })
      .catch(done);
  });

  it("should transcribe mic input", function(done) {
    getConfig().then(function(cfg) {
      var stt = WatsonSpeechToText.recognizeMicrophone(cfg);
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


// recognizeElement
// recognizeElement
