// Karma configuration
// Generated on Fri Jan 15 2016 13:36:31 GMT-0500 (EST)
'use strict';

var testServer;
if (process.env.TEST_MODE === 'integration') {
  testServer = require('./test/resources/integration_test_server.js');
} else {
  testServer = require('./test/resources/offline_test_server.js');
}


module.exports = function(config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',


    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['mocha', 'browserify', 'express-http-server'],


    // list of files / patterns to load in the browser
    files: [
      'test/*-spec.js'
    ],


    // list of files to exclude
    exclude: [
    ],


    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
      'test/*-spec.js': ['browserify']
    },

    browserify: {
      debug: true,
      // 'brfs' makes fs.read* work
      // 'browserify-shim' wraps non-browserify modules
      // 'envify' makes process.env work
      transform: ['envify']
    },


    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['progress'],


    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,


    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['ChromeWithPrerecordedMic', 'FirefoxAutoGUM'],

    // you can define custom flags
    // there's a handy list of chrome flags at
    customLaunchers: {
      ChromeWithPrerecordedMic: {
        base: 'Chrome',
        // --no-sandbox is required for travis-ci
        flags: [
          '--use-fake-device-for-media-stream',
          '--use-fake-ui-for-media-stream',
          '--use-file-for-fake-audio-capture=test/resources/audio.wav',
          '--no-sandbox'
        ]
      },
      // automatically approve getUserMedia calls
      FirefoxAutoGUM: {
        base: 'Firefox',
        prefs: {
          'media.navigator.permission.disabled': true
        }
      }
    },


    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false,

    // Concurrency level
    // how many browser should be started simultaneous
    concurrency: Infinity,

    expressHttpServer: {
      port: 9877,
      // this function takes express app object and allows you to modify it
      // to your liking. For more see http://expressjs.com/4x/api.html
      appVisitor: testServer
    },

    browserDisconnectTimeout: 15000,
    browserDisconnectTolerance: 2,
    browserNoActivityTimeout: 30000

  });
};
