IBM Watson Speech To Text Browser Client Library
================================================

Allows you to easily add voice recognition to any web app with minimal code. 

**Warning** This is alpha software and will likely see major API changes. It doesn't even correspond to the proposed API currently.

May be used via browserify, or as a standalone library

See several examples at https://github.com/watson-developer-cloud/speech-javascript-sdk/tree/master/examples

This library is designed for use with [browserify](http://browserify.org/) (`npm install --save watson-speech`), but you can also grab the bundle from the 
dist/ folder and use it as-is.

Check out https://www.npmjs.com/package/watson-developer-cloud to use Watson services from Node.js.

## API

### `WatsonSpeechToText.stream({/*...*/})` -> [Stream](https://nodejs.org/api/stream.html)

Pass in a token (must be generated server-side) and any other desired options. 

Returns a Node.js-style stream of the final text and also emits `result` events with full result data 
(including pre-final results, alternatives, word timing, confidence scores, etc.)


### `WatsonSpeechToText.promise({/*...*/})` -> [Promise](https://developer.mozilla.org/en-US/docs/Mozilla/JavaScript_code_modules/Promise.jsm/Promise)

Pass in a token (must be generated server-side) and any other desired options. 

Returns a Promise that resolves to an Array of results. 
Pass that to `.resultsToText()` to get the final text as a string or do more complex processing on it yourself.

By default, `interim_results` is set to false (meaning that only final results will be included in the Array.)

Note: To use a promise with microphone input, either set `continuous: false` or call `.stop()` on the resulting steam once the speech is done. 
Otherwise the promise will not resolve in a timely manner (because it will continue to wait for more speech until the connection times out.)

### `WatsonSpeechToText.resultsToText(ArrayOfResults)` -> Final Text

Helper method to turn `.promise()` results into a single string of text.
