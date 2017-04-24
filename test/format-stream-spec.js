'use strict';

var assert = require('assert');
var clone = require('clone');
var FormatStream = require('../speech-to-text/format-stream.js');

describe('FormatStream', function() {
  it('should format strings', function(done) {
    var stream = new FormatStream();
    stream.setEncoding('utf8');
    var source = 'foo bar ';
    var expected = 'Foo bar. ';
    stream.on('data', function(actual) {
      assert.equal(actual, expected);
      done();
    });
    stream.on('error', done);
    stream.write(source);
  });

  it('should format objects', function(done) {
    var stream = new FormatStream({ objectMode: true });
    //stream.setEncoding('utf8');
    var source = {
      results: [
        {
          alternatives: [
            {
              confidence: 0.881,
              transcript: 'foo bar '
            }
          ],
          result_index: 0,
          final: true
        }
      ]
    };
    var expected = {
      results: [
        {
          alternatives: [
            {
              confidence: 0.881,
              transcript: 'Foo bar. '
            }
          ],
          result_index: 0,
          final: true
        }
      ]
    };
    stream.on('data', function(actual) {
      console.log(JSON.stringify(actual, null, 2))
      console.log(JSON.stringify(expected, null, 2))
      assert.deepEqual(actual, expected);
      done();
    });
    stream.on('error', done);
    stream.write(source);
  });

  it('should drop repeated characters', function(done) {
    var stream = new FormatStream();
    stream.setEncoding('utf8');
    var source = 'I, uh mmmmmmmmm ';
    var expected = 'I, uh. ';
    stream.on('data', function(actual) {
      assert.equal(actual, expected);
      done();
    });
    stream.on('error', done);
    stream.write(source);
  });

  it('should not add a period to empty text', function(done) {
    var stream = new FormatStream();
    stream.setEncoding('utf8');
    var source = 'mmmmmmmmm '; // this will be stripped by the repeated character check
    var expected = ' ';
    stream.on('data', function(actual) {
      assert.equal(actual, expected);
      done();
    });
    stream.on('error', done);
    stream.write(source);
  });

  it('should not drop portions of numbers when smart formatting is enabled', function(done) {
    var stream = new FormatStream();
    stream.setEncoding('utf8');
    var source = '1000101 ';
    var expected = '1000101. ';
    stream.on('data', function(actual) {
      assert.equal(actual, expected);
      done();
    });
    stream.on('error', done);
    stream.write(source);
  });

  it('should handle %HESITATIONs at the beginning, middle, and end of a sentence', function(done) {
    var stream = new FormatStream();
    stream.setEncoding('utf8');
    var source = '%HESITATION asdf %HESITATION bsdf %HESITATION ';
    var expected = 'Asdf bsdf. ';
    stream.on('data', function(actual) {
      assert.equal(actual, expected);
      done();
    });
    stream.on('error', done);
    stream.write(source);
  });

  // https://github.com/watson-developer-cloud/speech-javascript-sdk/issues/13
  it('should handle %HESITATIONs at the end of a sentence (and not add a period) when set to ellipsis', function(done) {
    var stream = new FormatStream({ hesitation: '\u2026' });
    stream.setEncoding('utf8');
    var source = '%HESITATION asdf %HESITATION ';
    var expected = '… asdf … ';
    stream.on('data', function(actual) {
      assert.equal(actual, expected);
      done();
    });
    stream.on('error', done);
    stream.write(source);
  });

  it('should pass through speaker_labels messages', function(done) {
    var stream = new FormatStream({ objectMode: true });
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
  /*
  { results:
    [ { alternatives:
         [ { word_confidence:
              [ [ 'it', 1 ],
                [ 'is', 0.956286624429304 ],
                [ 'a', 0.8105753725270362 ],
                [ 'site', 1 ],
                [ 'that', 1 ],
                [ 'hardly', 1 ],
                [ 'anyone', 1 ],
                [ 'can', 1 ],
                [ 'behold', 0.5273598005406737 ],
                [ 'without', 1 ],
                [ 'some', 1 ],
                [ 'sort', 1 ],
                [ 'of', 1 ],
                [ 'unwanted', 1 ],
                [ 'emotion', 0.49401837076320887 ] ],
             confidence: 0.881,
             transcript: 'it is a site that hardly anyone can behold without some sort of unwanted emotion ',
             timestamps:
              [ [ 'it', 20.9, 21.04 ],
                [ 'is', 21.04, 21.17 ],
                [ 'a', 21.17, 21.25 ],
                [ 'site', 21.25, 21.56 ],
                [ 'that', 21.56, 21.7 ],
                [ 'hardly', 21.7, 22.06 ],
                [ 'anyone', 22.06, 22.49 ],
                [ 'can', 22.49, 22.67 ],
                [ 'behold', 22.67, 23.13 ],
                [ 'without', 23.13, 23.46 ],
                [ 'some', 23.46, 23.67 ],
                [ 'sort', 23.67, 23.91 ],
                [ 'of', 23.91, 24 ],
                [ 'unwanted', 24, 24.58 ],
                [ 'emotion', 24.58, 25.1 ] ] },
           { transcript: 'it is a sight that hardly anyone can behold without some sort of unwanted emotion ' },
           { transcript: 'it is a site that hardly anyone can behold without some sort of unwanted emotions ' } ],
        final: true } ],
   result_index: 3 }
   */
});
