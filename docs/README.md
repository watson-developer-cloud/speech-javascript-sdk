## API & Examples

The basic API is outlined below, see complete API docs at http://watson-developer-cloud.github.io/speech-javascript-sdk/master/

See several basic examples at http://watson-speech.mybluemix.net/ ([source](https://github.com/watson-developer-cloud/speech-javascript-sdk/tree/master/examples/))

See a more advanced example at https://speech-to-text-demo.mybluemix.net/

All API methods require an auth token that must be [generated server-side](https://github.com/watson-developer-cloud/node-sdk#authorization).
(See https://github.com/watson-developer-cloud/speech-javascript-sdk/tree/master/examples/ for a couple of basic examples in Node.js and Python.)

_NOTE_: The `token` parameter only works for CF instances of services. For RC services using IAM for authentication, the `accessToken` parameter must be used.
