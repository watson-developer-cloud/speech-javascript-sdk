# Speech to Text

## [`WatsonSpeech.SpeechToText`](http://watson-developer-cloud.github.io/speech-javascript-sdk/master/module-watson-speech_speech-to-text.html)

The `recognizeMicrophone()` and `recognizeFile()` helper methods are recommended for most use-cases. They set up the streams in the appropriate order and enable common options. These two methods are documented below.

The core of the library is the [RecognizeStream] that performs the actual transcription, and a collection of other Node.js-style streams that manipulate the data in various ways. For less common use-cases, the core components may be used directly with the helper methods serving as optional templates to follow. The full library is documented at http://watson-developer-cloud.github.io/speech-javascript-sdk/master/module-watson-speech_speech-to-text.html

_NOTE_ The RecognizeStream class lives in the Watson Node SDK. Any option available on this class can be passed into the following methods. These parameters are documented at http://watson-developer-cloud.github.io/node-sdk/master/classes/recognizestream.html

### [`.recognizeMicrophone({token||access_token})`](http://watson-developer-cloud.github.io/speech-javascript-sdk/master/module-watson-speech_speech-to-text_recognize-microphone.html) -> Stream

Options: 
* `keepMicrophone`: if true, preserves the MicrophoneStream for subsequent calls, preventing additional permissions requests in Firefox
* `mediaStream`: Optionally pass in an existing media stream rather than prompting the user for microphone access.
* Other options passed to [RecognizeStream]
* Other options passed to [SpeakerStream] if `options.resultsbySpeaker` is set to true
* Other options passed to [FormatStream] if `options.format` is not set to false
* Other options passed to [WritableElementStream] if `options.outputElement` is set

Requires the `getUserMedia` API, so limited browser compatibility (see http://caniuse.com/#search=getusermedia) 
Also note that Chrome requires https (with a few exceptions for localhost and such) - see https://www.chromium.org/Home/chromium-security/prefer-secure-origins-for-powerful-new-features

No more data will be set after `.stop()` is called on the returned stream, but additional results may be recieved for already-sent data.


### [`.recognizeFile({data, token||access_token})`](http://watson-developer-cloud.github.io/speech-javascript-sdk/master/module-watson-speech_speech-to-text_recognize-file.html) -> Stream

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

`play` requires that the browser support the format; most browsers support wav and ogg/opus, but not flac.) 
Will emit an `UNSUPPORTED_FORMAT` error on the RecognizeStream if playback fails. This error is special in that it does not stop the streaming of results.

Playback will automatically stop when `.stop()` is called on the returned stream. 

For Mobile Safari compatibility, a URL must be provided, and `recognizeFile()` must be called in direct response to a user interaction (so the token must be pre-loaded).

[RecognizeStream]: http://watson-developer-cloud.github.io/node-sdk/master/classes/recognizestream.html
[TimingStream]: http://watson-developer-cloud.github.io/speech-javascript-sdk/master/TimingStream.html
[FormatStream]: http://watson-developer-cloud.github.io/speech-javascript-sdk/master/FormatStream.html
[WritableElementStream]: http://watson-developer-cloud.github.io/speech-javascript-sdk/master/WritableElementStream.html
[SpeakerStream]: http://watson-developer-cloud.github.io/speech-javascript-sdk/master/SpeakerStream.html
[CORS]: https://developer.mozilla.org/en-US/docs/Web/HTTP/Access_control_CORS

