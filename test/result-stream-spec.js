'use strict';

var assert = require('assert');
var clone = require('clone');
var ResultStream = require('../speech-to-text/result-stream.js');

describe('ResultStream', function() {
  it('should extract results', function(done) {
    var stream = new ResultStream();
    var source = { results: [{ alternatives: [{ transcript: 'foo' }] }], result_index: 1 };
    var expected = { alternatives: [{ transcript: 'foo' }], index: 1 };
    stream.on('data', function(actual) {
      assert.deepEqual(actual, expected);
      done();
    });
    stream.on('error', done);
    stream.write(source);
  });

  it('should pass through speaker_labels messages', function(done) {
    var stream = new ResultStream();
    var source = {
      speaker_labels: [
        {
          from: 28.92,
          to: 29.17,
          speaker: 1,
          confidence: 0.641,
          final: false
        }
      ]
    };
    var expected = clone(source);
    stream.on('data', function(actual) {
      assert.deepEqual(actual, expected);
      done();
    });
    stream.on('error', done);
    stream.write(source);
  });
});
