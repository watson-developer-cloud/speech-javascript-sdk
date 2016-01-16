// Karma configuration
// Generated on Fri Jan 15 2016 13:36:31 GMT-0500 (EST)

var fs = require('fs');
var watson = require('watson-developer-cloud');

var AUTH_FILE = './test/resources/auth.json';

if (!fs.existsSync(AUTH_FILE)) {
  console.error('Please create a test/resources/auth.json file with STT service credentials. See https://github.com/watson-developer-cloud/node-sdk#getting-the-service-credentials');
  process.exit(1);
}

var auth = require(AUTH_FILE);
var authorization = watson.authorization(auth);


module.exports = function(config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',


    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['mocha', 'browserify', 'express-http-server'],


    // list of files / patterns to load in the browser
    files: [
      'test/spec.js'
    ],


    // list of files to exclude
    exclude: [
    ],


    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
      'test/spec.js': [ 'browserify' ]
    },

    browserify: {
      debug: true,
      transform: [ ] // 'brfs', 'browserify-shim'
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
    browsers: ['Chrome_without_prerecorded_mic'],

    // you can define custom flags
    customLaunchers: {
      Chrome_without_prerecorded_mic: {
        base: 'Chrome',
        flags: ['--use-fake-device-for-media-stream','--use-fake-ui-for-media-stream', '--use-file-for-fake-audio-capture=test/resources/audio.wav']
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
      appVisitor: function (app, log) {
        console.log('setting up express server')
        app.get('/token', function (req, res) {
          console.log('generating token')
          res.header('Access-Control-Allow-Origin', '*'); // do *NOT* do this on a /token endpoint that's accessible to the internet

          authorization.getToken({url: "https://stream.watsonplatform.net/speech-to-text/api"}, function (err, token) {
            if (err) {
              log.error('error retrieving auth token:', err);
              res.status(500).send('Error: unable to retrieve access token')
            } else {
              log.info('auth token retrieved: ', token);
              res.send(token);
            }
          });
        });
      }
    }
  })
};
