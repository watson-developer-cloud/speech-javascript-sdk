IBM Watson Speech To Text Browser Client Library
================================================

Allows you to easily add voice recognition to any web app with minimal code. 

**For Web Browsers Only** This library is primarily intended for use in browsers. 
Check out [watson-developer-cloud](https://www.npmjs.com/package/watson-developer-cloud) to use Watson services (speech and others) from Node.js.

**Warning** This library is still early-stage and may see significant breaking changes. We'll try to stick to Semver and node.js standards, but no guarentees

See several examples at https://github.com/watson-developer-cloud/speech-javascript-sdk/tree/master/examples

This library is built with [browserify](http://browserify.org/) and easy to use in browserify-based projects (`npm install --save watson-speech`), but you can also grab the compiled bundle from the 
`dist/` folder and use it as a standalone library.


## Basic API

### `WatsonSpeech.SpeechToText.recognizeMicrophone({token)` -> RecognizeStream

Options: No direct options, all provided options are passed to MicrophoneStream and RecognizeStream


Requires the `getUserMedia` API, so limited browser compatibility (see http://caniuse.com/#search=getusermedia) 
Also note that Chrome requires https (with a few exceptions for localhost and such) - see https://www.chromium.org/Home/chromium-security/prefer-secure-origins-for-powerful-new-features

### `WatsonSpeech.SpeechToText.recognizeElement({element, token})` -> RecognizeStream

Options: 
* `element`: an `<audio>` or `<video>` element (could be generated pragmatically, e.g. `new Audio()`)
* Other options passed to MediaElementAudioStream and RecognizeStream

Requires that the browser support MediaElement and whatever audio codec is used in your media file.

Will automatically call `.play()` the `element`. Calling `.stop()` on the returned RecognizeStream will automatically call `.stop()` on the `element`.

### `WatsonSpeech.SpeechToText.recognizeBlob({data, token})` -> RecognizeStream

Options: 
* `data`: a `Blob` (or `File`) instance. 
* `playFile`: (optional, default=`false`) Attempt to also play the file locally while uploading it for transcription 
* Other options passed to RecognizeStream

`playFile`requires that the browser support the format; most browsers support wav and ogg/opus, but not flac.) 
Will emit a `playback-error` on the RecognizeStream if playback fails. 
Playback will automatically stop when `.stop()` is called on the RecognizeStream.


### `WatsonSpeech.SpeechToText.RecognizeStream`

A [Node.js-style stream](https://nodejs.org/api/stream.html) of the final text, with some helpers and extra events built in.

RecognizeStream is generally not instantiated directly but rather returned as the result of calling one of the recognize* methods.

The RecognizeStream waits until after receiving data to open a connection. 
If no `content-type` option is set, it will attempt to parse the first chunk of data to determine type.

`options.token` is required for client-side usage, and it must be 
[generated server-side](https://github.com/watson-developer-cloud/node-sdk#authorization) (see examples/token-server.js for a basic example.)

See speech-to-text/recognize-stream.js for other options.
 
#### Methods

* `.promise()`: returns a promise that will resolve to the final text. 
  Note that you must either set `continuous: false` or call `.stop()` on the stream to make the promise resolve in a timely manner.
  
* `.stop()`: stops the stream. No more data will be sent, but the stream may still recieve additional results with the transcription of already-sent audio.
  Standard `close` event will fire once the underlying websocket is closed and `end` once all of the data is consumed.

#### Events
In addition to the standard [Node.js stream events](https://nodejs.org/api/stream.html), the following events are fired:

* `result`: an individual result object from the results array. 
  May include final or interim transcription, alternatives, word timing, confidence scores, etc. depending on passed in options.
  Note: Listening for `result` will automatically put the stream into flowing mode.

(Note: there are several other events, but they are intended for internal usage)


## todo

* Solidify API
* Full (automatic) API Docs
* (eventually) add text-to-speech support
* Add punctuation stream
* add a WordTimingStream (that slows down output to not go fater than word timings)
* add an example that includes alternatives and word confidence scores
* automate dist/ generation (and possibly move it)
* enable eslint
* check if object.pick and Object.assign result in significantly smaller output than lodash
