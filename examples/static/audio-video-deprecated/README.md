# Audio/Video element transcription example (UNSUPPORTED)

This example shows transcription using a HTML5 `<audio>` element as the audio source. 
It should work identically with a `<video>` element.

## Deprecated/Unsupported

The `recognizeElement()` was deprecated and removed from the SDK due to issues with quality and consistency. 
The code was moved here to allow individuals to continue using it without being pinned to an older version of the SDK.

You are welcome to use this code, but it is not officially supported, and you are on your own if you run into issues.

## Setup

To try out the example, run `npm start` in the [examples](../../) directory, 
then visit http://localhost:3000/audio-video-deprecated/

The example uses the Node.js server to host the content, bundle the JavaScript files, and generate access tokens.

## Recommended alternative

The recommended alternative to using the code in this example is to extract and/or convert the audio server-side using a took such as [FFmpeg](http://ffmpeg.org/). 

For `<video>` elements in particular, the [WebVVT](https://developer.mozilla.org/en-US/docs/Web/API/WebVTT_API) subtitles format is recommended. The service/SDK does not currently support outputting in this format, but it is fairly easy to generate.
