# Changelog

### v0.37.0
* BREAKING CHANGES INTRODUCED:
  * All options parameters for all methods are coverted to be lowerCamelCase
  * For example: `access_token` is now `accessToken` and `content-type` is now `contentType`
  * Response data from the service is not affected by this change

### v0.34.0
* Add support for guessing .mp3 (via file name & header) & .webm (via filename) content-types
* Re-factored content-type guessing to check filename first, and file header second
* Restore support for environments that pre-date Buffer.from()

### v0.33.1
* Remove continuous param
* Add support for vorbis, webm

### v0.33.0
* Send audio earlier - #26
* Add customization support to STT synthesize()

### v0.32.1
* Fixed bower main file to be unminified instead of minified

### v0.32.0
* Added bower support
* Switched dist/ bundler from browserify to webpack (saves sevral hundred bytes)
* Added UMD support to dist scripts
* No internal changes

### v0.31.0
* Added support for a mediaStream argument to recognizeMicrophone() for advanced usages
* Fixed error message when source ends before WebSocket connection is opened.

### v0.30.1
* added recognizeMicrophone.isSupported flag (checks for getUserMedia, assumes other features will be there if that one is)

### v0.29.1
* Added setStartTime() method to TimingStream to facilitate syncing wit when files loaded via URL actually begin playing
* Updated recognizeFile() to automatically sync timing stream to playback

### v0.29.0
* BREAKING: recognizeFile()'s data option renamed to file
* File option may be a string URL. This enables streaming transcription/playback and mobile Safari support.
* Added support for 'X-Watson-Learning-Opt-Out' and 'accept' params in TTS synthesize()

### v0.28.4
* Prevent RecognizeStream from sending a blank content-type header - now emits an error if content-type is unset and unable to be automatically determined.

### v0.28.3
* Made SpeakerStream put keywords_result and word_alternatives on the correct result

### v0.28.2
* Fix regression introduced in v0.23 with playback-error change - transcription now continues after a playback error.

### v0.28.0
* Significantly simplified TimingStream, fixing one bug in the process

### v0.27.2
* stream from recognizeMicrophone emits an `end` event when microphone access is not avaliable

### v0.27.0
* TimingStream rewrite - now emits exact results received from the service, always in the exact order recieved
  * old version created extra interim results and could emit speaker_labels before their matching final result in certain circumstances
  * emitAt now defaults to END to allow for interim results even when final is cached
* SpeakerStream now emits keywords, alternatives, etc, although sometimes on a slightly earlier result then where the word is mentioned
* SpeakerStream now gracefully handles situations where labels arrive before the matching final result

### v0.26.0
* Renamed RecognizeStream 'connect' event to 'open' to match 'close' event
* Removed deprecated connection-close event
* Corrected deprecation notices for unsupported events (results, result, speaker_labels, connect, connection-close)
* Tweaked error handling to still fire `end` event when possible
* FormatStream: Changed default %HESITATION replacement from '\u2026' (ellipse - ...) to ''
* FormatStream: add space to end of interim transcripts to match service behavior
* SpeakerStream: add speakerlessInterim option to allow faster UI updating

### v0.25.1
* Workaround for browser bug that was breaking automatic content-type detection in certain cases

### v0.25.0
* Fixed bug with recognizeStream failing to auto-detect content-type
* RecognizeStream no longer sets any default options
* recognizeMicrophone() and recognizeFile() methods now do set default options that were previously set by RecognizeStream
* added new 'message' event to RecognizeStream that emits any message received over the WebSocket (mainly for debugging and demo usage)
* exposed recognizeStream property on any stream returned from recognizeMicrophone() or recognizeFile() (for debugging)

### v0.24.0
* Renamed `ResultExtractor` to `ResultStream`, exposed it in speech-to-text/index.js
* Added new SpeakerStream class to split results by speaker
* Added new `resultsBySpeaker` option to `recognizeFile()` and `recognizeMicrophone()` to enable SpeakerStream
* Fixed a bug in TimingStream where result_indexes would be lost (introduced in v0.22.0)

### v0.23.0
* Changed file player error.name from `UNRECOGNIZED_FORMAT` to `UNSUPPORTED_FORMAT`
  (There are now two potential errors with this name: the file is recognized but the browser cannot play it, and the file type is not recognized.)
* Changed the `playback-error` event to just `error`
* Automatically stop file playback in the event of a RecognizeStream error

### v0.22.0
* Breaking: RecognizeStream now emits the original JSON message rather than the extracted results objects.
* New ResultExtractor stream that can provide the old behavior
* New `extract_results` option on recogniseFile/Microphone enables this.
* Removed deprecated `result` and `results` events from RecognizeStream.
* Removed `receive-json` event from RecognizeStream because it now duplicates the behavior of the `data` event.
* Added support for `speaker_labels` option in RecognizeStream, updated other streams to handle speaker_labels correctly
* Added a simple speaker_labels stream-to-console example
* Added support for ` X-Watson-Learning-Opt-Out` option in RecognizeStream

### v0.21.0
* Made FormatStream formatting methods available outside of streaming interface

### v0.20.4
* Fix looping error propagation when not using FormatStream in recognizeMicrophone

### v0.20.3
* Fixed broken model query param in STT RecognizeStream

### v0.20.2
* Fixed bug where errors were not propagated to final stream (#10)
* Fixed bug where RecognizeStream could attempt to send data on non-open WebSocket (#17)

### v0.20.1
* Fixed bug with ellipses at the ends of sentences

### v0.20
* Documented RecognizeStream's options.token
* Added support for customization_id in SDK (not yet supported in public STT service)

### v0.19
* Added support for STT's `smart_formatting` option

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
