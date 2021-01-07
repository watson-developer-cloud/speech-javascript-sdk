# Text to Speech

## [`WatsonSpeech.TextToSpeech`](http://watson-developer-cloud.github.io/speech-javascript-sdk/master/module-watson-speech_text-to-speech.html)

### [`.synthesize({text, token||accessToken})`](http://watson-developer-cloud.github.io/speech-javascript-sdk/master/module-watson-speech_text-to-speech_synthesize.html) -> `<audio>`

Speaks the supplied text through an automatically-created `<audio>` element.
Currently limited to text that can fit within a GET URL (this is particularly an issue on [Internet Explorer before Windows 10](http://stackoverflow.com/questions/32267442/url-length-limitation-of-microsoft-edge)
where the max length is around 1000 characters after the token is accounted for.)

Options:

- text - the text to speak
- url - the Watson Text to Speech API URL (defaults to https://api.us-south.text-to-speech.watson.cloud.ibm.com)
- voice - the desired playback voice's name - see .getVoices(). Note that the voices are language-specific.
- customization_id - GUID of a custom voice model - omit to use the voice with no customization.
- autoPlay - set to false to prevent the audio from automatically playing

Relies on browser audio support: should work reliably in Chrome and Firefox on desktop and Android. Edge works with a little help. Safari and all iOS browsers do not seem to work yet.
