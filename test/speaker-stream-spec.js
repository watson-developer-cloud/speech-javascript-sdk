"use strict";

var assert = require("assert");
var clone = require("clone");
var SpeakerStream = require("../speech-to-text/speaker-stream.js");
var sinon = require("sinon");

describe("SpeakerStream", function() {
  it("should split up results by speaker", function(done) {
    var stream = new SpeakerStream();
    stream.on("error", done);
    var actual = [];
    stream.on("data", function(data) {
      actual.push(data);
    });

    var expected = [
      {
        results: [
          {
            speaker: 0,
            alternatives: [
              {
                timestamps: [["hi", 0.06, 0.28]],
                transcript: "hi "
              }
            ],
            final: true
          },
          {
            speaker: 1,
            alternatives: [
              {
                timestamps: [["hello", 0.28, 0.37]],
                transcript: "hello "
              }
            ],
            final: true
          }
        ],
        result_index: 0
      }
    ];

    stream.on("end", function() {
      assert.deepEqual(actual, expected);
      done();
    });

    stream.write({
      results: [
        {
          alternatives: [
            {
              timestamps: [
                ["hi", 0.06, 0.28],
                ["hello", 0.28, 0.37]
              ],
              transcript: "hi hello "
            }
          ],
          final: true
        }
      ],
      result_index: 0
    });
    stream.end({
      speaker_labels: [
        {
          from: 0.06,
          to: 0.28,
          speaker: 0,
          confidence: 0.512,
          final: false
        },
        {
          from: 0.28,
          to: 0.37,
          speaker: 1,
          confidence: 0.512,
          final: true
        }
      ]
    });
  });

  it("should handle speaker label changes", function(done) {
    var stream = new SpeakerStream();
    stream.on("error", done);
    var actual = [];
    stream.on("data", function(data) {
      actual.push(data);
    });

    var expected = [
      {
        results: [
          {
            speaker: 0,
            alternatives: [
              {
                timestamps: [["hi", 0.06, 0.28]],
                transcript: "hi "
              }
            ],
            final: false
          },
          {
            speaker: 1,
            alternatives: [
              {
                timestamps: [["hello", 0.28, 0.37]],
                transcript: "hello "
              }
            ],
            final: false
          }
        ],
        result_index: 0
      },
      {
        results: [
          {
            speaker: 0,
            alternatives: [
              {
                timestamps: [
                  ["hi", 0.06, 0.28],
                  ["hello", 0.28, 0.37]
                ],
                transcript: "hi hello "
              }
            ],
            final: true
          }
        ],
        result_index: 0
      }
    ];

    stream.on("end", function() {
      assert.deepEqual(actual, expected);
      done();
    });

    stream.write({
      results: [
        {
          alternatives: [
            {
              timestamps: [
                ["hi", 0.06, 0.28],
                ["hello", 0.28, 0.37]
              ],
              transcript: "hi hello "
            }
          ],
          final: true
        }
      ],
      result_index: 0
    });
    stream.write({
      speaker_labels: [
        {
          from: 0.06,
          to: 0.28,
          speaker: 0,
          confidence: 0.512,
          final: false
        },
        {
          from: 0.28,
          to: 0.37,
          speaker: 1,
          confidence: 0.512,
          final: false
        }
      ]
    });
    stream.end({
      speaker_labels: [
        {
          from: 0.06,
          to: 0.28,
          speaker: 0,
          confidence: 0.512,
          final: false
        },
        {
          from: 0.28,
          to: 0.37,
          speaker: 0,
          confidence: 0.512,
          final: true
        }
      ]
    });
  });

  it("should error if given only results and no labels", function(done) {
    assert(
      SpeakerStream.ERROR_MISMATCH,
      "SpeakerStream.ERROR_MISMATCH should be defined"
    );
    var stream = new SpeakerStream();
    var results = require("./resources/results.json");
    stream.on("data", function(data) {
      assert.fail(data, null, "data emitted");
    });
    stream.on("error", function(err) {
      assert.equal(err.name, SpeakerStream.ERROR_MISMATCH);
      done();
    });
    stream.end(results);
  });

  it("should error if given results with no timestamps", function(done) {
    var noTimestamps = require("../speech-to-text/no-timestamps");
    assert(
      noTimestamps.ERROR_NO_TIMESTAMPS,
      "noTimestamps.ERROR_NO_TIMESTAMPS should be defined"
    );
    var stream = new SpeakerStream();
    var message = clone(require("./resources/results.json"));
    delete message.results[0].alternatives[0].timestamps;
    stream.on("data", function(data) {
      assert.fail(data, null, "data emitted");
    });
    stream.on("error", function(err) {
      assert.equal(err.name, noTimestamps.ERROR_NO_TIMESTAMPS);
      done();
    });
    stream.end(message);
  });

  it("should not emit identical interim messages when nothing has changed", function(done) {
    var stream = new SpeakerStream();
    stream.on("error", done);
    var lastMsg;
    stream.on("data", function(msg) {
      assert(msg);
      assert.notDeepEqual(msg, lastMsg);
      lastMsg = msg;
    });
    stream.on("end", done);
    var messageStream = require("./resources/car_loan_stream.json");
    messageStream.forEach(function(msg) {
      stream.write(msg);
    });
    stream.end();
  });

  it("should handle early speaker_labels gracefully", function(done) {
    // there is/was a bug in the timing stream that could cause this in certain scenarios
    var stream = new SpeakerStream();
    stream.on("error", done);
    var actual = [];
    stream.on("data", function(data) {
      actual.push(data);
    });

    var expected = [
      {
        results: [
          {
            speaker: 0,
            alternatives: [
              {
                timestamps: [["hi", 0.06, 0.28]],
                transcript: "hi "
              }
            ],
            final: false
          }
        ],
        result_index: 0
      },
      {
        results: [
          {
            speaker: 0,
            alternatives: [
              {
                timestamps: [["hi", 0.06, 0.28]],
                transcript: "hi "
              }
            ],
            final: true
          },
          {
            speaker: 1,
            alternatives: [
              {
                timestamps: [["hello", 0.28, 0.37]],
                transcript: "hello "
              }
            ],
            final: true
          }
        ],
        result_index: 0
      }
    ];

    stream.on("end", function() {
      assert.deepEqual(actual, expected);
      done();
    });

    stream.write({
      results: [
        {
          alternatives: [
            {
              timestamps: [["hi", 0.06, 0.28]],
              transcript: "hi "
            }
          ],
          final: true
        }
      ],
      result_index: 0
    });
    stream.write({
      speaker_labels: [
        {
          from: 0.06,
          to: 0.28,
          speaker: 0,
          confidence: 0.512,
          final: false
        }
      ]
    });
    // this one is early
    stream.write({
      speaker_labels: [
        {
          from: 0.28,
          to: 0.37,
          speaker: 1,
          confidence: 0.512,
          final: true
        }
      ]
    });
    // or, this is late
    stream.write({
      results: [
        {
          alternatives: [
            {
              timestamps: [["hello", 0.28, 0.37]],
              transcript: "hello "
            }
          ],
          final: true
        }
      ],
      result_index: 0
    });
    stream.end();
  });

  it("should put word alternatives on the correct result", function(done) {
    /*
    {
    "results": [
      {
        "word_alternatives": [
          {
            "start_time": 0.06,
            "alternatives": [
              {
                "confidence": 1,
                "word": "thank"
              }
            ],
            "end_time": 0.28
          },
     */
    var stream = new SpeakerStream();
    stream.on("error", done);
    var msgs = [];
    stream.on("data", function(msg) {
      msgs.push(msg);
    });

    var source = require("./resources/car_loan_stream.json").filter(function(
      msg
    ) {
      return msg.speaker_labels || (msg.results && msg.results[0].final);
    });
    var expectedNumAlts = source.reduce(function(count, msg) {
      if (msg.speaker_labels) {
        return count;
      }
      return count + msg.results[0].word_alternatives.length;
    }, 0);
    assert(expectedNumAlts);

    stream.on("end", function() {
      assert(msgs.length);
      var numAlts = 0;
      msgs
        .filter(function(msg) {
          // speaker stream creates new interim results where the text is final but the speaker label is not.
          // We only want the final one
          return msg.results[0].final;
        })
        .forEach(function(msg) {
          msg.results.forEach(function(res) {
            if (res.word_alternatives) {
              numAlts += res.word_alternatives.length;
              var timestamps = res.alternatives[0].timestamps;
              var start = timestamps[0][1];
              var end = timestamps[timestamps.length - 1][2];
              res.word_alternatives.forEach(function(alt) {
                assert(alt.start_time >= start);
                assert(alt.end_time <= end);
              });
            }
          });
        });
      assert.equal(
        numAlts,
        expectedNumAlts,
        "should have the same number of word alternatives before and after speaker-izing"
      );
      done();
    });
    source.forEach(function(msg) {
      stream.write(msg);
    });
    stream.end();
  });

  it("should put spotted keywords on the correct result", function(done) {
    /*
      "keywords_result": {
          "car": [
            {
              "normalized_text": "car",
              "start_time": 22.69,
              "confidence": 1,
              "end_time": 22.88
            },
            {
              "normalized_text": "car",
              "start_time": 24.35,
              "confidence": 0.995,
              "end_time": 24.75
            }
          ],
          "vehicle": [
            {
              "normalized_text": "vehicle",
              "start_time": 14.29,
              "confidence": 0.981,
              "end_time": 14.74
            }
          ]
        },
     */
    var stream = new SpeakerStream();
    stream.on("error", done);
    var msgs = [];
    stream.on("data", function(msg) {
      msgs.push(msg);
    });

    var source = require("./resources/car_loan_stream.json").filter(function(
      msg
    ) {
      return msg.speaker_labels || (msg.results && msg.results[0].final);
    });
    var expectedNumKeywords = source.reduce(function(count, msg) {
      if (msg.speaker_labels || !msg.results[0].keywords_result) {
        return count;
      }
      var kws = msg.results[0].keywords_result;
      return (
        count +
        Object.keys(kws).reduce(function(subCount, keyword) {
          return subCount + kws[keyword].length;
        }, 0)
      );
    }, 0);
    assert(expectedNumKeywords);

    stream.on("end", function() {
      assert(msgs.length);
      var numAlts = 0;
      msgs
        .filter(function(msg) {
          // speaker stream creates new interim results where the text is final but the speaker label is not.
          // We only want the final one
          return msg.results[0].final;
        })
        .forEach(function(msg) {
          msg.results.forEach(function(res) {
            if (res.keywords_result) {
              var timestamps = res.alternatives[0].timestamps;
              var start = timestamps[0][1];
              var end = timestamps[timestamps.length - 1][2];
              Object.keys(res.keywords_result).forEach(function(keyword) {
                var spottings = res.keywords_result[keyword];
                numAlts += spottings.length;
                spottings.forEach(function(spotting) {
                  assert(spotting.start_time >= start);
                  assert(spotting.end_time <= end);
                });
              });
            }
          });
        });
      assert.equal(
        numAlts,
        expectedNumKeywords,
        "should have the same number of word alternatives before and after speaker-izing"
      );
      done();
    });
    source.forEach(function(msg) {
      stream.write(msg);
    });
    stream.end();
  });

  describe("with TimingStream", function() {
    var TimingStream = require("../speech-to-text/timing-stream.js");
    var clock;
    beforeEach(function() {
      clock = sinon.useFakeTimers();
    });

    afterEach(function() {
      clock.restore();
    });

    it("should produce the same output with and without a TimingStream", function(done) {
      var inputMessages = require("./resources/car_loan_stream.json");
      var actualSpeakerStream = new SpeakerStream();
      var expectedSpeakerStream = new SpeakerStream();
      var timingStream = new TimingStream({ objectMode: true });
      timingStream.pipe(actualSpeakerStream);

      timingStream.on("error", done);

      var actual = [];
      actualSpeakerStream.on("data", function(timedResult) {
        actual.push(timedResult);
      });
      actualSpeakerStream.on("error", done);

      var expected = [];
      expectedSpeakerStream.on("data", function(timedResult) {
        expected.push(timedResult);
      });
      expectedSpeakerStream.on("error", done);

      inputMessages.forEach(function(msg) {
        timingStream.write(msg);
        expectedSpeakerStream.write(msg);
      });
      timingStream.end();
      expectedSpeakerStream.end();

      clock.tick(37.26 * 1000);

      clock.tick(2);
      assert.deepEqual(actual, expected);
      done();
    });
  });

  it("should provide early results when options.speakerlessInterim=true", function(done) {
    var stream = new SpeakerStream({ speakerlessInterim: true });
    stream.on("error", done);
    var actual = [];
    stream.on("data", function(data) {
      actual.push(data);
    });

    var expected = [
      {
        results: [
          {
            alternatives: [
              {
                timestamps: [["hi", 0.06, 0.28]],
                transcript: "hi "
              }
            ],
            final: false
          }
        ],
        result_index: 0
      },
      {
        results: [
          {
            speaker: 0,
            alternatives: [
              {
                timestamps: [["hi", 0.06, 0.28]],
                transcript: "hi "
              }
            ],
            final: true
          },
          {
            speaker: 1,
            alternatives: [
              {
                timestamps: [["hello", 0.28, 0.37]],
                transcript: "hello "
              }
            ],
            final: true
          }
        ],
        result_index: 0
      }
    ];

    stream.on("end", function() {
      assert.deepEqual(actual, expected);
      done();
    });

    stream.write({
      results: [
        {
          alternatives: [
            {
              timestamps: [["hi", 0.06, 0.28]],
              transcript: "hi "
            }
          ],
          final: false
        }
      ],
      result_index: 0
    });
    stream.write({
      results: [
        {
          alternatives: [
            {
              timestamps: [
                ["hi", 0.06, 0.28],
                ["hello", 0.28, 0.37]
              ],
              transcript: "hi hello "
            }
          ],
          final: true
        }
      ],
      result_index: 0
    });
    stream.end({
      speaker_labels: [
        {
          from: 0.06,
          to: 0.28,
          speaker: 0,
          confidence: 0.512,
          final: false
        },
        {
          from: 0.28,
          to: 0.37,
          speaker: 1,
          confidence: 0.512,
          final: true
        }
      ]
    });
  });

  describe("speakerLabelsSorter", function() {
    it("should correctly sort speaker labels by start time and then by end time", function() {
      var input = [
        {
          from: 30.04,
          to: 30.34,
          speaker: 0,
          confidence: 0.631,
          final: false
        },
        {
          from: 29.17,
          to: 29.37,
          speaker: 1,
          confidence: 0.641,
          final: false
        },
        {
          from: 28.92,
          to: 29.18,
          speaker: 1,
          confidence: 0.641,
          final: false
        },
        {
          from: 28.92,
          to: 29.17,
          speaker: 1,
          confidence: 0.641,
          final: false
        },
        {
          from: 29.37,
          to: 29.64,
          speaker: 1,
          confidence: 0.641,
          final: false
        }
      ];

      var expected = [
        {
          from: 28.92,
          to: 29.17,
          speaker: 1,
          confidence: 0.641,
          final: false
        },
        {
          from: 28.92,
          to: 29.18,
          speaker: 1,
          confidence: 0.641,
          final: false
        },
        {
          from: 29.17,
          to: 29.37,
          speaker: 1,
          confidence: 0.641,
          final: false
        },
        {
          from: 29.37,
          to: 29.64,
          speaker: 1,
          confidence: 0.641,
          final: false
        },
        {
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
