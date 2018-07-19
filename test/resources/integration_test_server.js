'use strict';
var fs = require('fs');
var AuthorizationV1 = require('watson-developer-cloud/authorization/v1');

var AUTH_FILE = __dirname + '/stt-auth.json';

if (!fs.existsSync(AUTH_FILE)) {
  console.error(
    'Missing required test/resources/stt-auth.json for integration test - see https://github.com/watson-developer-cloud/node-sdk#getting-the-service-credentials'
  );
  process.exit(1);
}

var auth = require(AUTH_FILE);
var iamCreds = {};
// create a new object with iam credentials and
// remove them from the auth object to use the objects
// for two instantiations of the auth service
if (auth.iam_apikey) {
  iamCreds.iam_apikey = auth.iam_apikey;
  delete auth.iam_apikey;
}
if (auth.iam_access_token) {
  iamCreds.iam_access_token = auth.iam_access_token;
  delete auth.iam_access_token;
}

// if the RC service needs a URL other than https://stream.watsonplatform.net/speech-to-text/api
// it must be defined in the auth config file with the key `rc_service_url`
var rcUrl = '';
if (auth.rc_service_url) {
  rcUrl = auth.rc_service_url;
  delete auth.rc_service_url;
}

var authorization = new AuthorizationV1(auth);
var iamAuthorization = new AuthorizationV1(iamCreds);

var serveStatic = require('serve-static');

module.exports = function(app, log) {
  log.info('setting up token server for integration test');

  app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*'); // do *NOT* do this on a /token endpoint that's accessible to the internet
    next();
  });

  app.use(serveStatic(__dirname));

  app.get('/token', function(req, res) {
    res.header('Access-Control-Allow-Origin', '*'); // do *NOT* do this on a /token endpoint that's accessible to the internet
    authorization.getToken({ url: 'https://stream.watsonplatform.net/speech-to-text/api' }, function(err, token) {
      if (err) {
        log.error('error retrieving auth token:', err);
        res.status(500).send('Error: unable to retrieve access token');
      } else {
        res.send({ token: token });
      }
    });
  });

  app.get('/iam-token', function(req, res) {
    res.header('Access-Control-Allow-Origin', '*'); // do *NOT* do this on a /token endpoint that's accessible to the internet

    iamAuthorization.getToken(function(err, token) {
      if (err) {
        log.error('error retrieving iam token:', err);
        res.status(500).send('Error: unable to retrieve iam access token');
      } else {
        res.send({ access_token: token, url: rcUrl });
      }
    });
  });
};
