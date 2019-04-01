IBM Watson Speech Services for Web Browsers
===========================================

[![Build Status](https://travis-ci.org/watson-developer-cloud/speech-javascript-sdk.svg?branch=master)](https://travis-ci.org/watson-developer-cloud/speech-javascript-sdk)
[![npm-version](https://img.shields.io/npm/v/watson-speech.svg)](https://www.npmjs.com/package/watson-speech)

Allows you to easily add voice recognition and synthesis to any web app with minimal code.

### Built for Browsers
This library is primarily intended for use in web browsers. Check out [watson-developer-cloud](https://www.npmjs.com/package/watson-developer-cloud) to use Watson services (speech and others) from Node.js.

However, a **server-side component is required to generate auth tokens**. The `examples/` folder includes example Node.js and Python servers, and SDKs are available for [Node.js](https://github.com/watson-developer-cloud/node-sdk#authorization), [Java](https://github.com/watson-developer-cloud/java-sdk), [Python](https://github.com/watson-developer-cloud/python-sdk/blob/master/examples/authorization_v1.py), and there is also a [REST API](https://www.ibm.com/watson/developercloud/doc/common/getting-started-tokens.html).


### Installation - standalone

Pre-compiled bundles are available from on GitHub Releases - just download the file and drop it into your website: https://github.com/watson-developer-cloud/speech-javascript-sdk/releases

### Installation - bower

```sh
bower install --save watson-speech
```

### Installation - npm with Browserify or Webpack

This library can be bundled with [browserify](http://browserify.org/) or [Webpack](http://webpack.github.io/)
and easy included in larger projects:

    npm install --save watson-speech

This method enables a smaller bundle by only including the desired components, for example:

```js
var recognizeMic = require('watson-speech/speech-to-text/recognize-microphone');
```

## Using with IAM

This SDK _CAN_ be used in the browser with services that use IAM for authentication. This does require a server-side component - an endpoint used to retrieve the token. An example can be found [here](https://github.com/watson-developer-cloud/speech-javascript-sdk/blob/master/examples/server.js#L92).

In a local environment you should set only the `TEXT_TO_SPEECH_IAM_APIKEY` and `SPEECH_TO_TEXT_IAM_APIKEY` in your `.env` file, see example file [here](https://github.com/watson-developer-cloud/speech-javascript-sdk/blob/master/examples/.env.example).

Once that is set up, the token can be used in your SDK request with the parameter `access_token`. See [this example](https://github.com/watson-developer-cloud/speech-javascript-sdk/blob/master/examples/static/microphone-streaming.html#L36).

## Changes

See [CHANGELOG.md](CHANGELOG.md) for a complete list of changes.

## Development

### Use examples for development
The provided examples can be used to test developmental code in action:
* `cd examples/`
* `npm run dev`

This will build the local code, move the new bundle into the `examples/` directory, and start a new server at `localhost:3000` where the examples will be running.

Note: This requires valid service credentials.

### Testing
The test suite is broken up into offline unit tests and integration tests that test against actual service instances.
* `npm test` will run the linter and the offline tests
* `npm run test-offline` will run the offline tests
* `npm run test-integration` will run the integration tests

To run the integration tests, a file with service credentials is required. This file must be called `stt-auth.json` and must be located in `/test/resources/`. There are tests for usage of both CF and RC service instances. For testing CF, the required keys in this configuration file are `username` and `password`. For testing RC, a key of either `iam_acess_token` or `iam_apikey` is required. Optionally, a service URL for an RC instance can be provided under the key `rc_service_url` if the service is available under a URL other than `https://stream.watsonplatform.net/speech-to-text/api`.

For an example, see `test/resources/stt-auth-example.json`.
