'use strict';

var assert = require('assert');

var WatsonSpeechToText = require('../src/watson-speech-to-text');

var expect = require('expect.js');
var concat = require('concat-stream');

function getToken() {
    return fetch('http://localhost:9877/token').then(function(response) {
        return response.text();
    }).then(function(token) {
        return token;
    })
}

function getInstance() {
    return getToken().then(function(token) {
        return new WatsonSpeechToText({token: token});
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

