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

1. `cd` into the `examples/` directory and run `npm install` to grab dependencies
2. edit `token-server.js` to include your service credentials
3. run `npm start`
4. Open your browser to http://localhost:3000/ to see the examples.


Notes
-----

* The examples all use [fetch](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API) (a modern promise-based replacement for XMLHttpRequest) to retrieve auth tokens. 
  Most supported browsers include a native fetch implementation, but a pollyfill is included in the top-level module for older browsers.
* The examples use a Node.js server to generate tokens. It doesn't have to be written in Node.js, but *some server-side token generator is required*. 
  The SDK will not accept your service credentials directly, and you can not use them to generate a token client-side. 
  SDKs are available for [Node.js](https://github.com/watson-developer-cloud/node-sdk#authorization), 
  [Java](https://github.com/watson-developer-cloud/java-sdk), 
  [Python](https://github.com/watson-developer-cloud/python-sdk/blob/master/examples/authorization_v1.py), 
  and there is a [REST API](http://www.ibm.com/smarterplanet/us/en/ibmwatson/developercloud/doc/getting_started/gs-tokens.shtml) 
  for use with other languages (or `curl`).
* The Speech SDK may be used in browserify or as a standalone library; all of the current examples use it as a standalone library for simplicity.
