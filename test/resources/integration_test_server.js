'use strict';

const { IamTokenManager } = require('ibm-watson/auth');

if (!process.env.SPEECH_TO_TEXT_IAM_APIKEY) {
  console.error('Missing required credentials - see https://github.com/watson-developer-cloud/node-sdk#getting-the-service-credentials');
  process.exit(1);
}

const sttAuthenticator = new IamTokenManager({
  apikey: process.env.SPEECH_TO_TEXT_IAM_APIKEY
});

var serveStatic = require('serve-static');

module.exports = function(app, log) {
  log.info('setting up token server for integration test');

  app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*'); // do *NOT* do this on a /token endpoint that's accessible to the internet
    next();
  });

  app.use(serveStatic(__dirname));

  app.get('/iam-token', function(req, res) {
    return sttAuthenticator
      .requestToken()
      .then(({ result }) => {
        res.send({ access_token: result.access_token, url: process.env.SPEECH_TO_TEXT_URL });
      })
      .catch(error => {
        log.error('error retrieving iam token:', error);
        res.status(500).send('Error: unable to retrieve iam access token');
      });
  });
};
