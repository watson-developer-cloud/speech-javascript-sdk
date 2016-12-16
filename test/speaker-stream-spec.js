'use strict';

var assert = require('assert');
var clone = require('clone');
var SpeakerStream = require('../speech-to-text/speaker-stream.js');
var sinon = require('sinon');

describe('SpeakerStream', function() {

  it('should split up results by speaker', function(done) {
    var stream = new SpeakerStream();
    stream.on('error', done);
    var actual = [];
    stream.on('data', function(data) {
      actual.push(data);
    });

    var expected = [{
      results: [{
        speaker: 0,
        alternatives: [{
          timestamps: [
            ['hi', 0.06, 0.28],
          ],
          transcript: 'hi '
        }],
        final: true
      },
        {
          speaker: 1,
          alternatives: [{
            timestamps: [
              ['hello', 0.28, 0.37],
            ],
            transcript: 'hello '
          }],
          final: true
        }],
      result_index: 0
    }];

    stream.on('end', function() {
      assert.deepEqual(actual, expected);
      done();
    });

    stream.write({
      results: [{
        alternatives: [{
          timestamps: [
            ['hi', 0.06, 0.28],
            ['hello', 0.28, 0.37],
          ],
          transcript: 'hi hello '
        }],
        final: true
      }],
      result_index: 0
    });
    stream.end({
      speaker_labels: [{
        from: 0.06,
        to: 0.28,
        speaker: 0,
        confidence: 0.512,
        final: false
      }, {
        from: 0.28,
        to: 0.37,
        speaker: 1,
        confidence: 0.512,
        final: true
      }]
    });
  });

  it('should handle speaker label changes', function(done) {
    var stream = new SpeakerStream();
    stream.on('error', done);
    var actual = [];
    stream.on('data', function(data) {
      actual.push(data);
    });

    var expected = [{
      results: [{
        speaker: 0,
        alternatives: [{
          timestamps: [
            ['hi', 0.06, 0.28],
          ],
          transcript: 'hi '
        }],
        final: false
      }, {
        speaker: 1,
        alternatives: [{
          timestamps: [
            ['hello', 0.28, 0.37],
          ],
          transcript: 'hello '
        }],
        final: false
      }],
      result_index: 0
    }, {
      results: [{
        speaker: 0,
        alternatives: [{
          timestamps: [
            ['hi', 0.06, 0.28],
            ['hello', 0.28, 0.37],
          ],
          transcript: 'hi hello '
        }],
        final: true
      }],
      result_index: 0
    }];


    stream.on('end', function() {
      assert.deepEqual(actual, expected);
      done();
    });

    stream.write({
      results: [{
        alternatives: [{
          timestamps: [
            ['hi', 0.06, 0.28],
            ['hello', 0.28, 0.37],
          ],
          transcript: 'hi hello '
        }],
        final: true
      }],
      result_index: 0
    });
    stream.write({
      speaker_labels: [{
        from: 0.06,
        to: 0.28,
        speaker: 0,
        confidence: 0.512,
        final: false
      }, {
        from: 0.28,
        to: 0.37,
        speaker: 1,
        confidence: 0.512,
        final: false
      }]
    });
    stream.end({
      speaker_labels: [{
        from: 0.06,
        to: 0.28,
        speaker: 0,
        confidence: 0.512,
        final: false
      }, {
        from: 0.28,
        to: 0.37,
        speaker: 0,
        confidence: 0.512,
        final: true
      }]
    });
  });

  it('should error if given only results and no labels', function(done) {
    assert(SpeakerStream.ERROR_MISMATCH, 'SpeakerStream.ERROR_MISMATCH should be defined');
    var stream = new SpeakerStream();
    var results = require('./resources/results.json');
    stream.on('data', function(data) {
      assert.fail(data, null, 'data emitted');
    });
    stream.on('error', function(err) {
      assert.equal(err.name, SpeakerStream.ERROR_MISMATCH);
      done();
    });
    stream.end(results);
  });

  it('should error if given results with no timestamps', function(done) {
    var noTimestamps = require('../speech-to-text/no-timestamps');
    assert(noTimestamps.ERROR_NO_TIMESTAMPS, 'noTimestamps.ERROR_NO_TIMESTAMPS should be defined');
    var stream = new SpeakerStream();
    var message = clone(require('./resources/results.json'));
    delete message.results[0].alternatives[0].timestamps;
    stream.on('data', function(data) {
      assert.fail(data, null, 'data emitted');
    });
    stream.on('error', function(err) {
      assert.equal(err.name, noTimestamps.ERROR_NO_TIMESTAMPS);
      done();
    });
    stream.end(message);
  });

  it('should not produce two results in a row from the same speaker', function(done) {
    var stream = new SpeakerStream();
    stream.on('error', done);
    var called = false;
    stream.on('data', function assertNoRepeats(data) {
      called = true;
      var lastSpeaker = -1;
      assert(Array.isArray(data.results), 'data should have a results array');
      assert(data.results.length, 'results array should be non-empty');
      data.results.forEach(function(result) {
        var speaker = result.speaker;
        assert.notEqual(speaker, lastSpeaker, 'each subsequent result should have a different speaker id. Current speaker id: ' + speaker + ', previous speaker id: ' + lastSpeaker + '.');
        lastSpeaker = speaker;
      });
    });
    stream.on('end', function() {
      assert(called);
      done();
    });
    var messageStream = require('./resources/car_loan_stream.json');
    messageStream.forEach(function(msg) {
      stream.write(msg);
    });
    stream.end();
  });

  it('should not emit identical interim messages when nothing has changed', function(done) {
    var stream = new SpeakerStream();
    stream.on('error', done);
    var lastMsg;
    stream.on('data', function(msg) {
      assert(msg);
      assert.notDeepEqual(msg, lastMsg);
      lastMsg = msg;
    });
    stream.on('end', done);
    var messageStream = require('./resources/car_loan_stream.json');
    messageStream.forEach(function(msg) {
      stream.write(msg);
    });
    stream.end();
  });

  describe('with TimingStream', function() {
    var clock;
    beforeEach(function() {
      clock = sinon.useFakeTimers();
    });

    afterEach(function() {
      clock.restore();
    });

    it('should produce the same output with results from a TimingStream', function(done) {
      var inputMessages = require('./resources/car_loan_stream.json');
      var TimingStream = require('../speech-to-text/timing-stream.js');
      var actualSpeakerStream = new SpeakerStream();
      var expectedSpeakerStream = new SpeakerStream();
      var timingStream = new TimingStream({objectMode: true});
      timingStream.pipe(actualSpeakerStream);

      timingStream.on('error', done);

      var actual = [];
      actualSpeakerStream.on('data', function(timedResult) {
        actual.push(timedResult);
      });
      actualSpeakerStream.on('error', done);

      var expected = [];
      expectedSpeakerStream.on('data', function(timedResult) {
        expected.push(timedResult);
      });
      expectedSpeakerStream.on('error', done);

      inputMessages.forEach(function(msg) {
        timingStream.write(msg);
        expectedSpeakerStream.write(msg);
      });
      timingStream.end();
      expectedSpeakerStream.end();

      clock.tick(37.26 * 1000);

      process.nextTick(function() { // write is always async (?)
        assert.deepEqual(actual, expected);
        done();
      });
    });
  });


  it('should provide early results when options.speakerlessInterim=true', function(done) {
    var stream = new SpeakerStream({speakerlessInterim: true});
    stream.on('error', done);
    var actual = [];
    stream.on('data', function(data) {
      actual.push(data);
    });

    var expected = [{
      results: [{
        alternatives: [{
          timestamps: [
            ['hi', 0.06, 0.28],
          ],
          transcript: 'hi '
        }],
        final: false
      }],
      result_index: 0
    }, {
      results: [{
        speaker: 0,
        alternatives: [{
          timestamps: [
            ['hi', 0.06, 0.28],
          ],
          transcript: 'hi '
        }],
        final: true
      },
        {
          speaker: 1,
          alternatives: [{
            timestamps: [
              ['hello', 0.28, 0.37],
            ],
            transcript: 'hello '
          }],
          final: true
        }],
      result_index: 0
    }];

    stream.on('end', function() {
      assert.deepEqual(actual, expected);
      done();
    });

    stream.write({
      results: [{
        alternatives: [{
          timestamps: [
            ['hi', 0.06, 0.28],
          ],
          transcript: 'hi '
        }],
        final: false
      }],
      result_index: 0
    });
    stream.write({
      results: [{
        alternatives: [{
          timestamps: [
            ['hi', 0.06, 0.28],
            ['hello', 0.28, 0.37],
          ],
          transcript: 'hi hello '
        }],
        final: true
      }],
      result_index: 0
    });
    stream.end({
      speaker_labels: [{
        from: 0.06,
        to: 0.28,
        speaker: 0,
        confidence: 0.512,
        final: false
      }, {
        from: 0.28,
        to: 0.37,
        speaker: 1,
        confidence: 0.512,
        final: true
      }]
    });
  });

  describe('speakerLabelsSorter', function() {
    it('should correctly sort speaker labels by start time and then by end time', function() {
      var input = [
        {
          from: 30.04,
          to: 30.34,
          speaker: 0,
          confidence: 0.631,
          final: false
        }, {
          from: 29.17,
          to: 29.37,
          speaker: 1,
          confidence: 0.641,
          final: false
        }, {
          from: 28.92,
          to: 29.18,
          speaker: 1,
          confidence: 0.641,
          final: false
        }, {
          from: 28.92,
          to: 29.17,
          speaker: 1,
          confidence: 0.641,
          final: false
        }, {
          from: 29.37,
          to: 29.64,
          speaker: 1,
          confidence: 0.641,
          final: false
        },
      ];

      var expected = [
        {
          from: 28.92,
          to: 29.17,
          speaker: 1,
          confidence: 0.641,
          final: false
        }, {
          from: 28.92,
          to: 29.18,
          speaker: 1,
          confidence: 0.641,
          final: false
        }, {
          from: 29.17,
          to: 29.37,
          speaker: 1,
          confidence: 0.641,
          final: false
        }, {
          from: 29.37,
          to: 29.64,
          speaker: 1,
          confidence: 0.641,
          final: false
        }, {
          from: 30.04,
          to: 30.34,
          speaker: 0,
          confidence: 0.631,
          final: false
        }
      ];

      assert.deepEqual(input.sort(SpeakerStream.speakerLabelsSorter), expected);
    });
  });
});
