'use strict';

var assert = require('assert');

var WatsonSpeechToText = require('../src/watson-speech-to-text');

var expect = require('expect.js');
var concat = require('concat-stream');

if (typeof fetch == "undefined") {
  require('whatwg-fetch');
}

// this is mainly for fetching the token, but it also determines what server to connect to during an offline test
function getConfig() {
  //console.log('getting config');
  return fetch('http://localhost:9877/token').then(function(response) {
    return response.text();
  }).then(function(config) {
    //console.log('got config:', config);
    return JSON.parse(config);
  })
}

describe("WatsonSpeechToText", function() {

  this.timeout(30*1000);


  it('should transcribe <audio> elements', function(done) {
    getConfig().then(function(cfg) {
      var audioElement = new Audio();
      audioElement.src = "http://localhost:9877/audio.wav";
      cfg.source = audioElement;
      return WatsonSpeechToText.promise(cfg)
    })
      .then(WatsonSpeechToText.resultsToText) // turn the collection of results into a string of text
      .then(function(transcription) {
        assert.equal(transcription.trim(), 'thunderstorms could produce large hail isolated tornadoes and heavy rain');
        done();
      })
      .catch(done);
  });

  it("should transcribe mic input", function(done) {
    getConfig().then(function(cfg) {
      var stt = WatsonSpeechToText.stream(cfg);
      stt.on('error', done)
      .setEncoding('utf8')
      .pipe(concat(function (transcription) {
        console.log('final transcription', transcription);
        assert.equal(transcription.trim(), 'thunderstorms could produce large hail isolated tornadoes and heavy rain');
        done();
      }));
      setTimeout(stt.stop.bind(stt), 8 * 1000);

      //['end', 'close', 'data', /*'results',*/ 'result', 'error', 'stopping', 'finish', 'listening'].forEach(function (eventName) {
      //  stt.on(eventName, console.log.bind(console, eventName + ' event: '));
      //});
    }).catch(done);
  });

  xit('should transcribe files', function(done) {
    getConfig().then(function(cfg) {
      // todo: use brfs (or fetch?) to include audio.flac here and convert it to a File to send as the source
      return WatsonSpeechToText.promise(cfg)
        .then(WatsonSpeechToText.resultsToText) // turn the collection of results into a string of text
        .then(function(transcription) {
          assert.equal(transcription.trim(), 'several tornadoes touch down as a line of severe thunderstorms swept through Colorado on Sunday');
          done();
        });
    }).catch(done);
  });

});
