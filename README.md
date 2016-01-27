IBM Watson Speech To Text Browser Client Library
================================================

Allows you to easily add voice recognition to any web app with minimal code. 

**Warning** This is alpha software and will likely see major API changes. It may not even conform to the documented API at times.

See several examples at https://github.com/watson-developer-cloud/speech-javascript-sdk/tree/master/examples

This library is built with browserify [browserify](http://browserify.org/) and easy to use in browserify-based projects (`npm install --save watson-speech`), but you can also grab the bundle from the 
dist/ folder and use it as a standalone library.

Check out https://www.npmjs.com/package/watson-developer-cloud to use Watson services from Node.js.

## API

### `WatsonSpeechToText.stream({/*...*/})` -> [Stream](https://nodejs.org/api/stream.html)

Options: 
  * Token: Required, must be [generated server-side](https://github.com/watson-developer-cloud/node-sdk#authorization)
  * source: one of: 
    * `WatsonSpeechToText.SOURCE_MICROPHONE` (default) - prompts the user for permission and then streams audio from their mic
    * a `File` instance (e.g. from an `<input>`)
    * an `<audio>` or `<video>` element
  * playFile: when source is a `File`, setting this to true will automatically play it while transcribing
  * other options from RecognizeStream

Returns a Node.js-style stream of the final text and also emits `result` events with full result data 
(including pre-final results, alternatives, word timing, confidence scores, etc.)

Requires the `getUserMedia` API, so limited browser compatibility (see http://caniuse.com/#search=getusermedia) 
Also note that Chrome requires https (with a few exceptions for localhost and such) - see https://www.chromium.org/Home/chromium-security/prefer-secure-origins-for-powerful-new-features


### `WatsonSpeechToText.promise({/*...*/})` -> [Promise](https://developer.mozilla.org/en-US/docs/Mozilla/JavaScript_code_modules/Promise.jsm/Promise)

Pass in a token (must be generated server-side) and any other desired options. 

Returns a Promise that resolves to an Array of results. 
Pass that to `.resultsToText()` to get the final text as a string or do more complex processing on it yourself.

By default, `interim_results` is set to false (meaning that only final results will be included in the Array.)

Note: To use a promise with microphone input, either set `continuous: false` or call the `.stop()` method on the resulting promise (once the speech is complete). 
Otherwise the promise will not resolve in a timely manner (because it will continue to wait for more speech until the connection times out.)

### `WatsonSpeechToText.resultsToText(ArrayOfResults)` -> Final Text

Helper method to turn `.promise()` results into a single string of text.


## todo

* Finish file transcribe test
* Fix disconnection (should be 1000 or 1001, not 1006)
* Finish API
* (eventually) add text-to-speech support
