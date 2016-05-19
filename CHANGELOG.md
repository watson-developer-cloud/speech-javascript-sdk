# Changelog

### v0.17
* Enabled interim_results by default for text mode because the service now buffers final results until the end otherwise. 
  (They are not emitted in text mode, just used for the side effect of faster final results.)
* Added examples to log data to console in text and object modes
* Fixed a couple of bugs in .stop() behavior

### v0.16
* Added STT.getModels() method to fetch the list of available voice models
* Added support for STT profanity_filter &  documented keywords and words_alternatives options

### v0.15
* Removed `SpeechToText.recognizeElement()` due to quality issues
* Added `options.element` to TextToSpeech.synthesize() to support playing through exiting elements
* Fixed a couple of bugs in the TimingStream

### v0.14
* Moved getUserMedia shim to a [standalone library](https://www.npmjs.com/package/get-user-media-promise)
* added a python token server example

### v0.13
* Fixed bug where `continuous: false` didn't close the microphone at end of recognition
* Added `keepMic` option to `recognizeMicrophone()` to prevent multiple permission popups in firefox

### v0.12
* Added `autoPlay` option to `synthesize()`
* Added proper parameter filtering to `synthesize()`

### v0.11
* renamed `recognizeBlob` to `recognizeFile` to make the primary usage more apparent
* Added support for `<input>` and `<textarea>` elements when using the `targetElement` option (or a `WritableElementStream`)
* For objectMode, changed defaults for `word_confidence` to `false`, `alternatives` to `1`, and `timing` to off unless required for `realtime` option. 
* Fixed bug with calling `.promise()` on `objectMode` streams
* Fixed bug with calling `.promise()` on `recognizeFile({play: true})`

### v0.10
* Added ability to write text directly to targetElement, updated examples to use this
* converted examples from jQuery to vanilla JS (w/ fetch pollyfill when necessary)
* significantly improved JSDoc

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
