'use strict';

var WatsonSpeechToText = require('../src/watson-speech-to-text');

var expect = require('expect.js');

function getToken() {
    console.log('fetching token');
    return fetch('http://localhost:9877/token').then(function(response) {
        console.log('status', response.status)
        return response.text();
    }).then(function(token) {
        console.log('token: ', token);
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

    it("should process audio and emit a text event with final results", function(done) {
        this.timeout(8*1000)
        getInstance().then(function(stt) {
            var allText = [];
            stt.on('error', done);
            stt.on('text', function(text) {
                //console.log('text:', text);
                allText.push(text)
            });
            //stt.on('results', function(data) {
            //    console.log('results:', JSON.stringify(data, null, 2));
            //});
            setTimeout(function() {
                expect(allText.join(' ').trim()).to.be('thunderstorms could produce large hail isolated tornadoes and heavy rain');
                done();
            }, 7500);
            stt.start();
        });
    });
});

