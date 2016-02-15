var fs = require('fs');
var watson = require('watson-developer-cloud');

var AUTH_FILE = __dirname + '/stt-auth.json';

if (!fs.existsSync(AUTH_FILE)) {
  console.error('Missing required test/resources/auth.json for integration test - see https://github.com/watson-developer-cloud/node-sdk#getting-the-service-credentials');
  process.exit(1);
}

var auth = require(AUTH_FILE);
var authorization = watson.authorization(auth);

var serveStatic = require('serve-static');

module.exports = function (app, log) {
  log.info('setting up token server for integration test');

  app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*'); // do *NOT* do this on a /token endpoint that's accessible to the internet
    next();
  });

  app.use(serveStatic(__dirname));

  app.get('/token', function (req, res) {
    res.header('Access-Control-Allow-Origin', '*'); // do *NOT* do this on a /token endpoint that's accessible to the internet

    authorization.getToken({url: "https://stream.watsonplatform.net/speech-to-text/api"}, function (err, token) {
      if (err) {
        log.error('error retrieving auth token:', err);
        res.status(500).send('Error: unable to retrieve access token')
      } else {
        res.send({token: token});
      }
    });
  });
};
