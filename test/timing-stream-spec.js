'use strict';

var assert = require('assert');
var sinon = require('sinon');
var PassThrough = require('stream').PassThrough;

var TimingStream = require('../speech-to-text/timing-stream.js');

var results = require('./resources/results.json');
var messageStream = require('./resources/car_loan_stream.json');

describe('TimingStream', function() {

  var clock;
  beforeEach(function() {
    clock = sinon.useFakeTimers();
  });

  afterEach(function() {
    clock.restore();
  });

  function nextTick(cb) {
    process.nextTick(cb); // for node
    clock.tick(1); // for browsers (where process.next tick is actually setTimeout 0)
  }

  it('should delay results', function(done) {
    var stream = new TimingStream({objectMode: true});
    var actual = [];
    stream.on('data', function(timedResult) {
      actual.push(timedResult);
    });
    stream.on('error', done);

    assert.equal(stream.nextTick, null, 'nextTick should not yet be set');

    stream.write(results);
    nextTick(function() { // write is always async (?)

      assert.equal(actual.length, 0);
      assert(stream.nextTick !== null, 'nextTick should be set');

      clock.tick(2320); // 2.32 seconds - just before the end of the first word

      assert.equal(actual.length, 1);
      assert.equal(actual[0].results[0].alternatives[0].transcript, 'thunderstorms');
      assert.equal(actual[0].results[0].final, false, 'split up results should be interim');

      clock.tick(6140 - 2320); // 6.141 seconds (total) - end of the last word

      var lastResult = actual[actual.length - 1].results[0];

      assert.equal(lastResult.alternatives[0].transcript, 'thunderstorms could produce large hail isolated tornadoes and heavy rain ');
      assert.equal(lastResult.final, true, 'the end result should still be final');

      done();
    });
  });

  it('should fire end and close events when end comes quickly', function(done) {
    var source = new PassThrough({objectMode: true});
    var stream = new TimingStream({objectMode: true});
    source.pipe(stream);
    stream.on('data', function() {}); // put it into flowing mode so that 'end' fires
    stream.on('error', done);
    var closeFired = false;
    var endFired = false;
    stream.on('close', function() {
      closeFired = true;
    });
    stream.on('end', function() {
      endFired = true;
    });

    source.end(results);
    nextTick(function() { // write is always async (?)

      clock.tick(6140); // 6.140 seconds - end of the last word

      clock.tick(1); // give it a chance to actually emit a result
      assert(stream.nextTick === null, 'nextTick should be null');

      nextTick(function() { // async again
        assert(stream.sourceEnded, 'sourceEnded should be true');
        assert(closeFired, 'close event should be fired');
        assert(endFired, 'end event should be fired');
        done();
      });

    });
  });

  it('should fire end and close events when end comes slowly', function(done) {
    var source = new PassThrough({objectMode: true});
    var stream = new TimingStream({objectMode: true});
    source.pipe(stream);
    stream.on('data', function() {}); // put it into flowing mode so that 'end' fires
    stream.on('error', done);
    var closeFired = false;
    var endFired = false;
    stream.on('close', function() {
      closeFired = true;
    });
    stream.on('end', function() {
      endFired = true;
    });

    source.write(results);
    nextTick(function() { // write is always async (?)

      clock.tick(6140); // 6.140 seconds - end of the last word

      clock.tick(100); // give it a chance to actually emit another result

      source.end();

      nextTick(function() { // node again
        assert(stream.nextTick === null, 'nextTick should be null');
        assert(stream.sourceEnded, 'sourceEnded should be true');
        assert(closeFired, 'close event should be fired');
        nextTick(function() { // and, one more async in this case
          assert(endFired, 'end event should be fired');
          done();
        });
      });
    });
  });

  it('should .stop() when told to', function(done) {
    var stream = new TimingStream({objectMode: true});
    var actual = [];
    stream.on('data', function(timedResult) {
      actual.push(timedResult);
    });
    stream.on('error', done);
    var stopFired = false;
    stream.on('stop', function() {
      stopFired = true;
    });

    assert.equal(stream.nextTick, null, 'nextTick should not yet be set');

    stream.write(results);
    nextTick(function() { // write is always async (?)

      assert.equal(actual.length, 0);
      assert(stream.nextTick !== null, 'nextTick should be set');

      clock.tick(2320); // 2.32 seconds - just before the end of the first word

      assert.equal(actual.length, 1);
      assert.equal(actual[0].results[0].alternatives[0].transcript, 'thunderstorms');

      stream.stop();

      clock.tick(6140 - 2320); // 6.141 seconds (total) - end of the last word

      assert.equal(actual.length, 1, 'no more results should be emitted after stop');
      assert(stopFired, 'stop event should have fired');

      done();
    });
  });

  it('should not emit interim results after the final result for a given index', function(done) {
    var stream = new TimingStream({objectMode: true});
    var actual = [];
    stream.on('data', function(timedResult) {
      actual.push(timedResult);
    });
    stream.on('error', done);

    messageStream.forEach(function(msg) {
      if (msg.results) {
        stream.write(msg);
      }
    });

    var numTicks = 37.26 * 1000;

    for (var i = 0; i < numTicks; i++) {
      clock.tick(1);
    }

    nextTick(function() { // write is always async (?)

      actual.reduce(function(lastIndex, msg) {
        assert.equal(msg.result_index, lastIndex);
        // index should always increment after a final message
        return (msg.results[0].final) ? lastIndex + 1 : lastIndex;
      }, 0);

      done();
    });
  });

  it('should pass through speaker_labels after the matching final results', function(done) {
    var stream = new TimingStream({objectMode: true});
    var actual = [];
    stream.on('data', function(timedResult) {
      actual.push(timedResult);
    });
    stream.on('error', done);

    messageStream.forEach(function(msg) {
      stream.write(msg);
    });

    var numTicks = 37.26 * 1000;

    for (var i = 0; i < numTicks; i++) {
      clock.tick(1);
    }

    nextTick(function() { // write is always async (?)

      var wasFinal = false;
      var endTime = 0;
      var speakerLabelsMessages = 0;
      actual.forEach(function(msg) {
        if (msg.speaker_labels) {
          speakerLabelsMessages++;
          assert(wasFinal, 'message preceding speaker_labels message was final');
          var spealerLabelsEndTime = msg.speaker_labels[msg.speaker_labels.length - 1].to;
          assert.equal(spealerLabelsEndTime, endTime);
        } else {
          wasFinal = msg.results[0].final;
          var timestamps = msg.results[0].alternatives[0].timestamps;
          endTime = timestamps[timestamps.length - 1][2];
        }
      });

      done();
    });
  });

});
