IBM Watson Speech To Text Browser Client Library
================================================

Allows you to easily add voice recognition to any web app with minimal code. 


**Warning** This is alpha software and will likely see major API changes. It doesn't even correspond to the proposed API currently.


Proposed API:
------------

I'd like to support both promise and streaming results. 
Promise because it's much easier/simpler to use (especially for short bits of text) and streaming to get access to the API's full power. 
I'd also like to support every feature on display in the demo, so it will need streaming support for that.
 
**Promise** is fairly straightforward, and native promises are available in every browser that supports the required `getUserMedia` API. 
(See http://caniuse.com/#search=getusermedia vs http://caniuse.com/#search=promise ) 

I'm considering a couple of different options, including having the object that `new WatsonSpeechToText({...})` returns 
be an actual `Promise` instance that we just extend with other methods.
The downside of this is that the norma flow of `getPromise().then(...).then(...)` means that all the other methods are completely lost on the first `.then()` call. 
So the other idea is to have a method like `.start()` or `.promise()` that returns the promise.

**Streaming** is a bit less straightforward because there isn't really a standard browser streaming interface, at least not that I'm aware of. 
So we can either make one up or hijack the node.js streaming model and basically mirror our streaming API from the node.js sdk. 
I'm inclined towards the later but a bit concerned that it will add some unnecessary complexity for users who don't know/want node.js-style code.
(I tried to make it use the same code, but the browser websockets API doesn't allow for headers to be set so it's not nearly as straightforward as you might expect.)

The node api is, basically, `data` events that send final text only (this is the node.js stream standard), 
and `results` events that send the full JSON object with the results (I added this one).

I'm also planning to see if I can combine these two approaches into a single object that is both a promise & implements the full node.js stream API. Not sure that will work.

**Ending Recording**
We also need a `.stop()` or similar method for when it's in continuous mode from a microphone.

**Auth Token** currently the library requires an auth token at creation time. 
The idea is that you'll create a new instance for each audio stream and presumably give it a new token.
I think this is a reasonable approach but have also considered the idea of accepting a URL and fetching a new one any time it's needed.

**File Upload**
I'd like to support both microphone input and file uploads, although I'm focusing on microphone input first.  
My thought for file upload, though, is to just accept an extra `file` parameter in the initial `options` argument, and 
if it's pointed to a `<input type="file"/> then we'll grab the content of the selected files and use that instead of the microphone.

Alternatively we could put a pair of methods on the resulting object, one that grabs the mic and one that accepts a file input.

**Errors**
Any errors that can be detected at creation time currently result in a `throw`, but we also need an async way of emitting errors, either an event, or a callback, or both. 
Promises have an implicit `catch` callback.


Testing
-------

I have Karma set up to run chrome with a couple of flags so that it automatically grants microphone permission and then plays a pre-recorded .wav file as if it cam in through the system mic.
I'm planning on making it work on travis ci, and I'm going to look into testing on other browsers, but I'm not sure how feasible that is. 

It definitely needs some code linting and non-integration tests, and then we should separate that from the integration tests so that pull-requests at least get basic testing.

I think that `npm install; npm test` is enough to set things up and run the tests once (assuming you already have chrome installed) but I haven't verified that.

The tests run against the source files, not the generated ones in dst/


Misc.
-----

We need to clean up the logging so that it's not dumping tons of stuff to the console by default.

I plan to have this lib published in both bower and npm. I'd like to provide minified and unminified js + sourcemaps in the dist/ folder. 
I'm not sure if I should have the npm side point browserify to the pre-compiled dist/ lib or to the source. 
Probably the former, but the latter might result in a smaller bundle size for end-users. I'll do a bit of research here.

I'd like to have several examples for streaming, promises, alternative text, browserify, etc. The one example there currently shows streaming and more or less works. 
I might try and separate the token server from the client code, and then provide the token server in several languages.. but not sure, because that will probably make the examples more complex.
