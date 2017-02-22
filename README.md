IBM Watson Speech Services for Web Browsers
===========================================

[![Build Status](https://travis-ci.org/watson-developer-cloud/speech-javascript-sdk.svg?branch=master)](https://travis-ci.org/watson-developer-cloud/speech-javascript-sdk)
[![npm-version](https://img.shields.io/npm/v/watson-speech.svg)](https://www.npmjs.com/package/watson-speech)

Allows you to easily add voice recognition and synthesis to any web app with minimal code.

### Built for Browsers
This library is primarily intended for use in web browsers.
Check out [watson-developer-cloud](https://www.npmjs.com/package/watson-developer-cloud) to use Watson services (speech and others) from Node.js.

However, a **server-side component is required to generate auth tokens**. 
The examples/ folder includes example Node.js and Python servers, and SDKs are available for [Node.js](https://github.com/watson-developer-cloud/node-sdk#authorization), 
[Java](https://github.com/watson-developer-cloud/java-sdk), 
[Python](https://github.com/watson-developer-cloud/python-sdk/blob/master/examples/authorization_v1.py), 
and there is also a [REST API](http://www.ibm.com/smarterplanet/us/en/ibmwatson/developercloud/doc/getting_started/gs-tokens.shtml).


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


Breaking change for v0.22.0
----------------------------

The format of objects emitted in objectMode has changed from `{alternatives: [...], index: 1}` to `{results: [{alternatives: [...]}], result_index: 1}`.

There is a new `ResultExtractor` class that restores the old behavior; `recognizeMicrophone()` and `recognizeFile()` both accept a new `extract_results` option to enable it.

This was done to enable the new `speaker_labels` feature. The format now exactly matches what the Watson Speech to Text service returns and shouldn't change again unless the Watson service changes.


API & Examples
--------------

The basic API is outlined below, see complete API docs at http://watson-developer-cloud.github.io/speech-javascript-sdk/master/

See several basic examples at http://watson-speech.mybluemix.net/ ([source](https://github.com/watson-developer-cloud/speech-javascript-sdk/tree/master/examples/))

See a more advanced example at https://speech-to-text-demo.mybluemix.net/

All API methods require an auth token that must be [generated server-side](https://github.com/watson-developer-cloud/node-sdk#authorization). 
(See https://github.com/watson-developer-cloud/speech-javascript-sdk/tree/master/examples/ for a couple of basic examples in Node.js and Python.)

## [`WatsonSpeech.TextToSpeech`](http://watson-developer-cloud.github.io/speech-javascript-sdk/master/module-watson-speech_text-to-speech.html)

### [`.synthesize({text, token})`](http://watson-developer-cloud.github.io/speech-javascript-sdk/master/module-watson-speech_text-to-speech_synthesize.html) -> `<audio>`

Speaks the supplied text through an automatically-created `<audio>` element. 
Currently limited to text that can fit within a GET URL (this is particularly an issue on [Internet Explorer before Windows 10](http://stackoverflow.com/questions/32267442/url-length-limitation-of-microsoft-edge)
where the max length is around 1000 characters after the token is accounted for.)

Options: 
* text - the text to speak
* voice - the desired playback voice's name - see .getVoices(). Note that the voices are language-specific.
* autoPlay - set to false to prevent the audio from automatically playing

Relies on browser audio support: should work reliably in Chrome and Firefox on desktop and Android. Edge works with a little help. Safari and all iOS browsers do not seem to work yet.

## [`WatsonSpeech.SpeechToText`](http://watson-developer-cloud.github.io/speech-javascript-sdk/master/module-watson-speech_speech-to-text.html)

The `recognizeMicrophone()` and `recognizeFile()` helper methods are recommended for most use-cases. They set up the streams in the appropriate order and enable common options. These two methods are documented below.

The core of the library is the [RecognizeStream] that performs the actual transcription, and a collection of other Node.js-style streams that manipulate the data in various ways. For less common use-cases, the core components may be used directly with the helper methods serving as optional templates to follow. The full library is documented at http://watson-developer-cloud.github.io/speech-javascript-sdk/master/module-watson-speech_speech-to-text.html

### [`.recognizeMicrophone({token})`](http://watson-developer-cloud.github.io/speech-javascript-sdk/master/module-watson-speech_speech-to-text_recognize-microphone.html) -> Stream

Options: 
* `keepMic`: if true, preserves the MicrophoneStream for subsequent calls, preventing additional permissions requests in Firefox
* `mediaStream`: Optionally pass in an existing media stream rather than prompting the user for microphone access.
* Other options passed to [RecognizeStream]
* Other options passed to [SpeakerStream] if `options.resultsbySpeaker` is set to true
* Other options passed to [FormatStream] if `options.format` is not set to false
* Other options passed to [WritableElementStream] if `options.outputElement` is set

Requires the `getUserMedia` API, so limited browser compatibility (see http://caniuse.com/#search=getusermedia) 
Also note that Chrome requires https (with a few exceptions for localhost and such) - see https://www.chromium.org/Home/chromium-security/prefer-secure-origins-for-powerful-new-features

No more data will be set after `.stop()` is called on the returned stream, but additional results may be recieved for already-sent data.


### [`.recognizeFile({data, token})`](http://watson-developer-cloud.github.io/speech-javascript-sdk/master/module-watson-speech_speech-to-text_recognize-file.html) -> Stream

Can recognize and optionally attempt to play a URL, [File](https://developer.mozilla.org/en-US/docs/Web/API/File) or [Blob](https://developer.mozilla.org/en-US/docs/Web/API/Blob)
(such as from an `<input type="file"/>` or from an ajax request.)

Options: 
* `file`: a String URL or a `Blob` or `File` instance. Note that [CORS] restrictions apply to URLs.
* `play`: (optional, default=`false`) Attempt to also play the file locally while uploading it for transcription 
* Other options passed to [RecognizeStream]
* Other options passed to [TimingStream] if `options.realtime` is true, or unset and `options.play` is true
* Other options passed to [SpeakerStream] if `options.resultsbySpeaker` is set to true
* Other options passed to [FormatStream] if `options.format` is not set to false
* Other options passed to [WritableElementStream] if `options.outputElement` is set

`play`requires that the browser support the format; most browsers support wav and ogg/opus, but not flac.) 
Will emit an `UNSUPPORTED_FORMAT` error on the RecognizeStream if playback fails. This error is special in that it does not stop the streaming of results.

Playback will automatically stop when `.stop()` is called on the returned stream. 

For Mobile Safari compatibility, a URL must be provided, and `recognizeFile()` must be called in direct response to a user interaction (so the token must be pre-loaded).


## Changes

There have been a few breaking changes in recent releases:

* Removed `SpeechToText.recognizeElement()` due to quality issues. The code is [avaliable in an (unsupported) example](https://github.com/watson-developer-cloud/speech-javascript-sdk/tree/master/examples/static/audio-video-deprecated) if you wish to use it with current releases of the SDK.
* renamed `recognizeBlob` to `recognizeFile` to make the primary usage more apparent
* Changed `playFile` option of `recognizeBlob()` to just `play`, corrected default
* Changed format of objects emitted in objectMode to exactly match what service sends. Added `ResultStrean` class and `extract_results` option to enable older behavior.
* Changed `playback-error` event to just `error` when recognizing and playing a file. Check for `error.name == 'UNSUPPORTED_FORMAT'` to identify playback errors. This error is special in that it does not stop the streaming of results.
* Renamed `recognizeFile()`'s `data` option to `file` because it now may be a URL. Using a URL enables faster playback and mobile Safari support

See [CHANGELOG.md](CHANGELOG.md) for a complete list of changes.

## todo

* Further solidify API
* break components into standalone npm modules where it makes sense
* run integration tests on travis (fall back to offline server for pull requests)
* add even more tests
* better cross-browser testing (IE, Safari, mobile browsers - maybe saucelabs?)
* update node-sdk to use current version of this lib's RecognizeStream (and also provide the FormatStream + anything else that might be handy)
* move `result` and `results` events to node wrapper (along with the deprecation notice)
* improve docs
* consider a wrapper to match https://dvcs.w3.org/hg/speech-api/raw-file/tip/speechapi.html
* support a "hard" stop that prevents any further data events, even for already uploaded audio, ensure timing stream also implements this.
* look for bug where single-word final results may omit word confidence (possibly due to FormatStream?)
* fix bug where TimingStream shows words slightly before they're spoken

[RecognizeStream]: http://watson-developer-cloud.github.io/speech-javascript-sdk/master/RecognizeStream.html
[TimingStream]: http://watson-developer-cloud.github.io/speech-javascript-sdk/master/TimingStream.html
[FormatStream]: http://watson-developer-cloud.github.io/speech-javascript-sdk/master/FormatStream.html
[WritableElementStream]: http://watson-developer-cloud.github.io/speech-javascript-sdk/master/WritableElementStream.html
[SpeakerStream]: http://watson-developer-cloud.github.io/speech-javascript-sdk/master/SpeakerStream.html
[CORS]: https://developer.mozilla.org/en-US/docs/Web/HTTP/Access_control_CORS
