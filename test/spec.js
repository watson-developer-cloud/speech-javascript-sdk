'use strict';

var assert = require('assert');

var WatsonSpeechToText = require('../src/watson-speech-to-text');

var expect = require('expect.js');
var concat = require('concat-stream');

// this is mainly for fetching the token, but it also determines what server to connect to during an offline test
function getConfig() {
    console.log('getting config');
    return fetch('http://localhost:9877/token').then(function(response) {
        return response.text();
    }).then(function(config) {
        console.log('got config:', config)
        return JSON.parse(config);
    })
}

function getInstance() {
    return getConfig().then(function(config) {
        return new WatsonSpeechToText(config);
    });
}

describe("WatsonSpeechToText", function() {

    it("should exist", function() {
        expect(WatsonSpeechToText).to.be.ok();
    });

    it("should be instantiable", function() {
        expect(new WatsonSpeechToText({token: 'foo'})).to.be.ok();
    });

    it("should behave like a node.js stream", function(done) {
        this.timeout(30*1000);
        getInstance().then(function(stt) {
            stt.on('error', done)
                .on('results', function(data) {
                    console.log(data.results);
                })
                .setEncoding('utf8')
                .pipe(concat(function (transcription) {
                        console.log('final transcription', transcription);
                    assert.equal(transcription.trim(), 'thunderstorms could produce large hail isolated tornadoes and heavy rain');
                    done();
                }));
            stt.start();
            setTimeout(stt.stop.bind('stt'), 8*1000);

            ['end', 'close', 'data', 'results', 'error', 'connection-close'].forEach(function(eventName) {
                stt.on(eventName, console.log.bind(console, eventName + ' event: '));
            });
        });
    });
});

