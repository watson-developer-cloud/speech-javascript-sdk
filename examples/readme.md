Watson Speech JavaScript SDK Examples
=====================================

This folder has a basic node.js server to host files and generate auth tokens and 
several html files with different examples of using the Speech SDJ. 

There are also a few audio files to test with in the public/ folder.


Prerequisite
------------

* IBM Watson Speech to Text service credentials - see http://www.ibm.com/smarterplanet/us/en/ibmwatson/developercloud/doc/getting_started/gs-credentials.shtml
* [Node.js](https://nodejs.org/en/) (see notes)


Setup
-----

1. Run `npm install; npm run build` in the project root to generate a `dist/watson-speech.js` file (or grab a copy from GitHub releases and drop it into `examples/public/`)
2. `cd` into the `examples/` directory and run `npm install` to grab dependencies
3. edit `token-server.js` to include your service credentials
4. run `npm start`
5. Open your browser to http://localhost:3000/ to see the examples.


Notes
-----

* The examples all use jQuery, but it is not required to use the Speech SDK.
* The examples use a node.js server to generate tokens. Node.js is not requred, but *some server-side token generator is required*. 
  The SDK will not accept your service credentials directly, and you can not use them to generate a token client-side. 
  SDKs are available for [Node.js](https://github.com/watson-developer-cloud/node-sdk#authorization), 
  [Java](https://github.com/watson-developer-cloud/java-sdk), 
  [Python](https://github.com/watson-developer-cloud/python-sdk/blob/master/examples/authorization_v1.py), 
  and there is a [REST API](http://www.ibm.com/smarterplanet/us/en/ibmwatson/developercloud/doc/getting_started/gs-tokens.shtml) 
  for use with other languages (or `curl`).
* The Speech SDK may be used in browserify or as a standalone library; all of the current examples use it as a standalone library for simplicity.
