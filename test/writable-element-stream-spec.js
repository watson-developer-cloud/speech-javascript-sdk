'use strict';

var assert = require('assert');

var WritableElementStream = require('../speech-to-text/writable-element-stream.js');

describe('WritableElementStream', function() {

  it ('should accept strings/buffers and write out contents when in string mode', function() {
    var el = document.createElement('div');
    var s = new WritableElementStream({outputElement: el});
    s.write('abc');
    s.write(new Buffer('123'));
    assert.equal(el.textContent, 'abc123');
  });

  it ('should accept objects and write out contents when in object mode', function() {
    var el = document.createElement('div');
    var s = new WritableElementStream({outputElement: el, objectMode: true});
    s.write({final: true, alternatives: [{
      transcript: 'abc'
    }]});
    s.write({final: true, alternatives: [{
      transcript: '123'
    }]});
    assert.equal(el.textContent, 'abc123');
  });

  it ('should write interim results', function() {
    var el = document.createElement('div');
    var s = new WritableElementStream({outputElement: el, objectMode: true});
    s.write({final: true, alternatives: [{
      transcript: 'abc'
    }]});
    s.write({final: false, alternatives: [{
      transcript: '123'
    }]});
    assert.equal(el.textContent, 'abc123');
  });

  it ('should overwrite interim results', function() {
    var el = document.createElement('div');
    var s = new WritableElementStream({outputElement: el, objectMode: true});
    s.write({final: true, alternatives: [{
      transcript: 'abc'
    }]});
    s.write({final: false, alternatives: [{
      transcript: '123'
    }]});
    s.write({final: false, alternatives: [{
      transcript: 'def'
    }]});
    assert.equal(el.textContent, 'abcdef');
  });
});
