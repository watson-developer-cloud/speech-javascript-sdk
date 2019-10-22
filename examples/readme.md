# Watson Speech JavaScript SDK Examples

This folder has example Node.js and Python servers to generate auth tokens and
several html files (in `static/`) with different examples of using the Speech SDK.

There are also a few audio files to test with in the `static/` folder.

## Prerequisite

- IBM Watson Speech to Text service credentials - see [Service credentials for Watson services](https://cloud.ibm.com/docs/services/watson?topic=watson-creating-credentials)
- Node.js OR Python

## Setup - Node.js

1. `cd` into the `examples/` directory and run `npm install` to grab dependencies (this automatically runs `postinstall` that also puts the dependencies into place)
1. Based on `test/resources/stt-auth-example.json`, create `test/resources/stt-auth.json` with credentials
1. Based on `test/resources/stt-auth-example.json`, create `test/resources/tts-auth.json` with credentials
1. run `npm start`
1. Open your browser to http://localhost:3000/ to see the examples.

## Notes

- The examples all use [fetch](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API) (a modern promise-based replacement for XMLHttpRequest) to retrieve auth tokens. Most supported browsers include a native fetch implementation, but a pollyfill is included in the top-level module for older browsers.
- The examples use a Node.js server to generate tokens. It doesn't have to be written in Node.js, but _some server-side token generator is required_. The SDK will not accept your service credentials directly, and you can not use them to generate a token client-side. SDKs are available for [Node.js](https://github.com/watson-developer-cloud/node-sdk#authorization), [Java](https://github.com/watson-developer-cloud/java-sdk), [Python](https://github.com/watson-developer-cloud/python-sdk/blob/master/examples/authorization_v1.py), and there is a [REST API](https://cloud.ibm.com/docs/services/watson?topic=watson-gs-tokens-watson-tokens) for use with other languages (or `curl`).
- The Speech SDK may be used in browserify, Webpack, or as a standalone library. Most of the examples use the standalone version either installed via NPM or symlinked to the root directory when developing locally.

## More Examples

- Speech to Text: [Demo](https://speech-to-text-demo.ng.bluemix.net/), [Code](https://github.com/watson-developer-cloud/speech-to-text-nodejs)
