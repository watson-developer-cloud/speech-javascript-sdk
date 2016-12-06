'use strict';

var assert = require('assert');
var WritableElementStream = require('../speech-to-text/writable-element-stream.js');
var $ = require('jquery');
var clone = require('clone');

describe('WritableElementStream', function() {

  var RESULT_ABC;
  var RESULT_123;
  var RESULT_123_INTERIM;

  before(function() {
    RESULT_ABC = {
      results: [
        {final: true, alternatives: [{
          transcript: 'abc'
        }]}
      ],
      result_index: 1
    };

    RESULT_123 = {
      results: [
        {final: true, alternatives: [{
          transcript: '123'
        }]}
      ],
      result_index: 2
    };


    RESULT_123_INTERIM = {
      results: [
        {final: false, alternatives: [{
          transcript: '123'
        }]}
      ],
      result_index: 2
    };
  });

  it('should accept strings/buffers and write out contents when in string mode', function() {
    var el = document.createElement('div');
    var s = new WritableElementStream({outputElement: el});
    s.write('abc');
    s.write(new Buffer('123'));
    assert.equal(el.textContent, 'abc123');
  });

  it('should accept objects and write out contents when in object mode', function() {
    var el = document.createElement('div');
    var s = new WritableElementStream({outputElement: el, objectMode: true});
    s.write(RESULT_ABC);
    s.write(RESULT_123);
    assert.equal(el.textContent, 'abc123');
  });

  it('should write interim results', function() {
    var el = document.createElement('div');
    var s = new WritableElementStream({outputElement: el, objectMode: true});
    s.write(RESULT_ABC);
    s.write(RESULT_123_INTERIM);
    assert.equal(el.textContent, 'abc123');
  });

  it('should overwrite interim results', function() {
    var el = document.createElement('div');
    var s = new WritableElementStream({outputElement: el, objectMode: true});
    s.write(RESULT_ABC);
    s.write(RESULT_123_INTERIM);
    var RESULT_DEF = clone(RESULT_123_INTERIM);
    RESULT_DEF.results[0].alternatives[0].transcript = 'def';
    s.write(RESULT_DEF);
    assert.equal(el.textContent, 'abcdef');
  });

  ['<textarea/>','<input type="text"/>'].forEach(function(tag) {
    it('should set the correct value for ' + tag, function() {
      var $el = $(tag),
        el = $el[0];
      var s = new WritableElementStream({outputElement: el, objectMode: true});
      s.write(RESULT_ABC);
      s.write(RESULT_123);
      assert.equal($el.val(), 'abc123'); // trust jQuery to know what the correct attribute *should* be
    });
  });


});
