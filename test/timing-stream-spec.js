'use strict';

var assert = require('assert');
var sinon = require('sinon');
var PassThrough = require('stream').PassThrough;

var TimingStream = require('../speech-to-text/timing-stream.js');

var results = require('./resources/results.json').results;

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

    stream.write(results[0]);
    nextTick(function() { // write is always async (?)

      assert.equal(actual.length, 0);
      assert(stream.nextTick !== null, 'nextTick should be set');

      clock.tick(2320); // 2.32 seconds - just before the end of the first word

      assert.equal(actual.length, 1);
      assert.equal(actual[0].alternatives[0].transcript, 'thunderstorms');
      assert.equal(actual[0].final, false, 'split up results should be interim');

      clock.tick(6140 - 2320); // 6.141 seconds (total) - end of the last word

      var lastResult = actual[actual.length - 1];

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

    source.end(results[0]);
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

    source.write(results[0]);
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


});
