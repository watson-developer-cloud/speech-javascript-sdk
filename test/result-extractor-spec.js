'use strict';

var assert = require('assert');
var ResultExtractor = require('../speech-to-text/result-extractor.js');

describe('ResultExtractor', function() {

  it('should extract results', function(done) {
    var stream = new ResultExtractor();
    var source = {results: [{alternatives: [{transcript: 'foo'}]}], result_index: 1};
    var expected = {alternatives: [{transcript: 'foo'}], index: 1}
    stream.on('data', function(actual) {
      assert.deepEqual(actual, expected);
      done();
    });
    stream.on('error', done);
    stream.write(source);
  });

});
