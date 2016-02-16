IBM Watson Speech Services for Web Browsers
===========================================

[![Build Status](https://travis-ci.org/watson-developer-cloud/speech-javascript-sdk.svg?branch=master)](https://travis-ci.org/watson-developer-cloud/speech-javascript-sdk)

Allows you to easily add voice recognition and synthesis to any web app with minimal code. 

**Warning** This library is still early-stage and may see significant breaking changes.

**For Web Browsers Only** This library is primarily intended for use in browsers. 
Check out [watson-developer-cloud](https://www.npmjs.com/package/watson-developer-cloud) to use Watson services (speech and others) from Node.js.

However, a server-side component is required to generate auth tokens. 
The examples/ folder includes a node.js one, and SDKs are available for [Node.js](https://github.com/watson-developer-cloud/node-sdk#authorization), 
[Java](https://github.com/watson-developer-cloud/java-sdk), 
[Python](https://github.com/watson-developer-cloud/python-sdk/blob/master/examples/authorization_v1.py), 
and there is also a [REST API](http://www.ibm.com/smarterplanet/us/en/ibmwatson/developercloud/doc/getting_started/gs-tokens.shtml).

See several examples at https://github.com/watson-developer-cloud/speech-javascript-sdk/tree/master/examples

This library is built with [browserify](http://browserify.org/) and easy to use in browserify-based projects (`npm install --save watson-speech`), but you can also grab the compiled bundle from the 
`dist/` folder and use it as a standalone library.

Basic API
---------

Complete API docs should be published at http://watson-developer-cloud.github.io/speech-javascript-sdk/

All API methods require an auth token that must be [generated server-side](https://github.com/watson-developer-cloud/node-sdk#authorization). 
(Snp teee examples/token-server.js for a basic example.)

## `Watson.TextToSpeech`

### '.synthesize({text, token})`

Speaks the supplied text through an automatically-created `<audio>` element. 
Currently limited to text that can fit within a GET URL (this is particularly an issue on [Internet Explorer before Windows 10](http://stackoverflow.com/questions/32267442/url-length-limitation-of-microsoft-edge)
where the max length is around 1000 characters after the token is accounted for.)

Options: 
* voice

## `WatsonSpeech.SpeechToText` 


### `.recognizeMicrophone({token})` -> `RecognizeStream`

Options: No direct options, all provided options are passed to MicrophoneStream and RecognizeStream

Requires the `getUserMedia` API, so limited browser compatibility (see http://caniuse.com/#search=getusermedia) 
Also note that Chrome requires https (with a few exceptions for localhost and such) - see https://www.chromium.org/Home/chromium-security/prefer-secure-origins-for-powerful-new-features

Pipes results through a `{FormatStream}` by default, set `options.format=false` to disable.

Known issue: Firefox continues to display a microphone icon in the address bar even after recording has ceased. This is a browser bug.

### `.recognizeElement({element, token})` -> `RecognizeStream`

Extract audio from an `<audio>` or `<video>` element and transcribe speech. 

This method has some limitations: 
 * the audio is run through two lossy conversions: first from the source format to WebAudio, and second to l16 (raw wav) for Watson
 * the WebAudio API does not guarantee the same exact output for the same file played twice, so it's possible to receive slight different transcriptions for the same file played repeatedly
 * it transcribes the audio as it is heard, so pausing or skipping will affect the transcription
 * audio that is paused for too long will cause the socket to time out and disconnect, preventing further transcription (without setting things up again)
 
Because of these limitations, it may be preferable to instead fetch the audio via ajax and then pass it the `recognizeBlob()` API in some situations.

Options: 
* `element`: an `<audio>` or `<video>` element (could be generated pragmatically, e.g. `new Audio()`)
* Other options passed to MediaElementAudioStream and RecognizeStream

Requires that the browser support MediaElement and whatever audio codec is used in your media file.

Will automatically call `.play()` the `element`, set `options.autoPlay=false` to  disable. Calling `.stop()` on the returned stream will automatically call `.stop()` on the `element`.

Pipes results through a `{FormatStream}` by default, set `options.format=false` to disable.

### `.recognizeBlob({data, token})` -> `RecognizeStream`

Options: 
* `data`: a `Blob` (or `File`) instance. 
* `play`: (optional, default=`false`) Attempt to also play the file locally while uploading it for transcription 
* Other options passed to RecognizeStream

`play`requires that the browser support the format; most browsers support wav and ogg/opus, but not flac.) 
Will emit a `playback-error` on the RecognizeStream if playback fails. 
Playback will automatically stop when `.stop()` is called on the RecognizeStream.

Pipes results through a `{TimingStream}` by if `options.play=true`, set `options.realtime=false` to disable.

Pipes results through a `{FormatStream}` by default, set `options.format=false` to disable.

### Class `RecognizeStream()`

A [Node.js-style stream](https://nodejs.org/api/stream.html) of the final text, with some helpers and extra events built in.

RecognizeStream is generally not instantiated directly but rather returned as the result of calling one of the recognize* methods.

The RecognizeStream waits until after receiving data to open a connection. 
If no `content-type` option is set, it will attempt to parse the first chunk of data to determine type.

See speech-to-text/recognize-stream.js for other options.
 
#### Methods

* `.promise()`: returns a promise that will resolve to the final text. 
  Note that you must either set `continuous: false` or call `.stop()` on the stream to make the promise resolve in a timely manner.
  
* `.stop()`: stops the stream. No more data will be sent, but the stream may still recieve additional results with the transcription of already-sent audio.
  Standard `close` event will fire once the underlying websocket is closed and `end` once all of the data is consumed.

#### Events
Follows standard [Node.js stream events](https://nodejs.org/api/stream.html), in particular: 

* `data`: emits either final Strings or final/interim result objects depending on if the stream is in objectMode
* `end`: emitted once all data has been consumed.

(Note: there are several custom events, but they are deprecated or intended for internal usage)

### Class `FormatStream()`

Pipe a `RecognizeStream` to a format stream, and the resulting text and `results` events will have basic formatting applied:
 *  Capitalize the first word of each sentence
 *  Add a period to the end
 *  Fix any "cruft" in the transcription
 *  A few other tweaks for asian languages and such.

Inherits `.promise()` from the `RecognizeStream`.


### Class `TimingStream()`

For use with `.recognizeBlob({play: true})` - slows the results down to match the audio. Pipe in the `RecognizeStream` (or `FormatStream`) and listen for results as usual.


## Changelog

### v0.9
* Added basic text to speech support

### v0.8
* deprecated `result` events in favor of `objectMode`.
* renamed the `autoplay` option to `autoPlay` on `recognizeElement()` (capital P)

### v0.7
* Changed `playFile` option of `recognizeBlob()` to just `play`, corrected default
* Added `options.format=true` to `recognize*()` to pipe text through a FormatStream
* Added `options.realtime=options.play` to `recognizeBlob()` to automatically pipe results through a TimingStream when playing locally
* Added `close` and `end` events to TimingStream
* Added `delay` option to `TimingStream`
* Moved compiled binary to GitHub Releases (in addition to uncompiled source on npm).
* Misc. doc and internal improvements

## todo

* Solidify API
* support objectMode instead of having random events
* add an example that includes alternatives and word confidence scores
* enable eslint - https://github.ibm.com/fed/javascript-style-guides
* break components into standalone npm modules where it makes sense
* record which shim/pollyfills would be useful to extend partial support to older browsers (Promise, etc.)
* run integration tests on travis (fall back to offline server for pull requests)
* more tests in general
* update node-sdk to use current version of this lib's RecognizeStream (and also provide the FormatStream + anything else that might be handy)
* move `result` and `results` events to node wrapper (along with the deprecation notice)
* improve docs
* consider a wrapper to match https://dvcs.w3.org/hg/speech-api/raw-file/tip/speechapi.html
* consider renaming recognizeBlob to recognizeFile to make the usage more obvious
* consider an `interim` event for recognize/format/timing streams to avoid objectMode (in most cases)
* ajax / playFile demo 
* fix documentation generation
