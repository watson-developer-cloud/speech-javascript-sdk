'use strict';

var MemoryFS = require('memory-fs');
var webpack = require('webpack');
var path = require('path');

describe('Webpack', function() {
  it('should generate a webpack bundle without errors', function(done) {
    // based on https://webpack.github.io/docs/node.js-api.html#compile-to-memory

    var fs = new MemoryFS();

    var compiler = webpack({
      entry: path.join(__dirname, '../index.js'),
      output: {
        filename: 'test-bundle.js'
      }
    });
    compiler.outputFileSystem = fs;
    compiler.run(function(err, stats) {
      if (err) {
        // fatal error
        return done(err);
      }
      if (stats.compilation.errors && stats.compilation.errors.length) {
        // non-fatal errors that nonetheless still probably bork things
        return done(stats.compilation.errors);
      }
      // console.log(stats.compilation);
      done();
    });
  });
});
