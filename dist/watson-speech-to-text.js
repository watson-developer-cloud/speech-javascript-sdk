(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.WatsonSpeechToText = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var hasOwn = Object.prototype.hasOwnProperty;
var toStr = Object.prototype.toString;

var isArray = function isArray(arr) {
	if (typeof Array.isArray === 'function') {
		return Array.isArray(arr);
	}

	return toStr.call(arr) === '[object Array]';
};

var isPlainObject = function isPlainObject(obj) {
	if (!obj || toStr.call(obj) !== '[object Object]') {
		return false;
	}

	var hasOwnConstructor = hasOwn.call(obj, 'constructor');
	var hasIsPrototypeOf = obj.constructor && obj.constructor.prototype && hasOwn.call(obj.constructor.prototype, 'isPrototypeOf');
	// Not own constructor property must be Object
	if (obj.constructor && !hasOwnConstructor && !hasIsPrototypeOf) {
		return false;
	}

	// Own properties are enumerated firstly, so to speed up,
	// if last one is own, then all properties are own.
	var key;
	for (key in obj) {/**/}

	return typeof key === 'undefined' || hasOwn.call(obj, key);
};

module.exports = function extend() {
	var options, name, src, copy, copyIsArray, clone,
		target = arguments[0],
		i = 1,
		length = arguments.length,
		deep = false;

	// Handle a deep copy situation
	if (typeof target === 'boolean') {
		deep = target;
		target = arguments[1] || {};
		// skip the boolean and the target
		i = 2;
	} else if ((typeof target !== 'object' && typeof target !== 'function') || target == null) {
		target = {};
	}

	for (; i < length; ++i) {
		options = arguments[i];
		// Only deal with non-null/undefined values
		if (options != null) {
			// Extend the base object
			for (name in options) {
				src = target[name];
				copy = options[name];

				// Prevent never-ending loop
				if (target !== copy) {
					// Recurse if we're merging plain objects or arrays
					if (deep && copy && (isPlainObject(copy) || (copyIsArray = isArray(copy)))) {
						if (copyIsArray) {
							copyIsArray = false;
							clone = src && isArray(src) ? src : [];
						} else {
							clone = src && isPlainObject(src) ? src : {};
						}

						// Never move original objects, clone them
						target[name] = extend(deep, clone, copy);

					// Don't bring in undefined values
					} else if (typeof copy !== 'undefined') {
						target[name] = copy;
					}
				}
			}
		}
	}

	// Return the modified object
	return target;
};


},{}],2:[function(require,module,exports){
/*!
 * object.pick <https://github.com/jonschlinkert/object.pick>
 *
 * Copyright (c) 2014-2015 Jon Schlinkert, contributors.
 * Licensed under the MIT License
 */

'use strict';

module.exports = function pick(obj, keys) {
  var res = {};
  var i = 0;

  if (typeof obj !== 'object') {
    return res;
  }

  if (typeof keys === 'string') {
    if (keys in obj) {
      res[keys] = obj[keys];
    }
    return res;
  }

  var len = keys.length;

  while (len--) {
    var key = keys[i++];
    if (key in obj) {
      res[key] = obj[key];
    }
  }
  return res;
};

},{}],3:[function(require,module,exports){
var _global = (function() { return this; })();
var nativeWebSocket = _global.WebSocket || _global.MozWebSocket;
var websocket_version = require('./version');


/**
 * Expose a W3C WebSocket class with just one or two arguments.
 */
function W3CWebSocket(uri, protocols) {
	var native_instance;

	if (protocols) {
		native_instance = new nativeWebSocket(uri, protocols);
	}
	else {
		native_instance = new nativeWebSocket(uri);
	}

	/**
	 * 'native_instance' is an instance of nativeWebSocket (the browser's WebSocket
	 * class). Since it is an Object it will be returned as it is when creating an
	 * instance of W3CWebSocket via 'new W3CWebSocket()'.
	 *
	 * ECMAScript 5: http://bclary.com/2004/11/07/#a-13.2.2
	 */
	return native_instance;
}


/**
 * Module exports.
 */
module.exports = {
    'w3cwebsocket' : nativeWebSocket ? W3CWebSocket : null,
    'version'      : websocket_version
};

},{"./version":4}],4:[function(require,module,exports){
module.exports = require('../package.json').version;

},{"../package.json":5}],5:[function(require,module,exports){
module.exports={
  "name": "websocket",
  "description": "Websocket Client & Server Library implementing the WebSocket protocol as specified in RFC 6455.",
  "keywords": [
    "websocket",
    "websockets",
    "socket",
    "networking",
    "comet",
    "push",
    "RFC-6455",
    "realtime",
    "server",
    "client"
  ],
  "author": {
    "name": "Brian McKelvey",
    "email": "brian@worlize.com",
    "url": "https://www.worlize.com/"
  },
  "contributors": [
    {
      "name": "Iñaki Baz Castillo",
      "email": "ibc@aliax.net",
      "url": "http://dev.sipdoc.net"
    }
  ],
  "version": "1.0.22",
  "repository": {
    "type": "git",
    "url": "git+https://github.com/theturtle32/WebSocket-Node.git"
  },
  "homepage": "https://github.com/theturtle32/WebSocket-Node",
  "engines": {
    "node": ">=0.8.0"
  },
  "dependencies": {
    "debug": "~2.2.0",
    "nan": "~2.0.5",
    "typedarray-to-buffer": "~3.0.3",
    "yaeti": "~0.0.4"
  },
  "devDependencies": {
    "buffer-equal": "^0.0.1",
    "faucet": "^0.0.1",
    "gulp": "git+https://github.com/gulpjs/gulp.git#4.0",
    "gulp-jshint": "^1.11.2",
    "jshint-stylish": "^1.0.2",
    "tape": "^4.0.1"
  },
  "config": {
    "verbose": false
  },
  "scripts": {
    "install": "(node-gyp rebuild 2> builderror.log) || (exit 0)",
    "test": "faucet test/unit",
    "gulp": "gulp"
  },
  "main": "index",
  "directories": {
    "lib": "./lib"
  },
  "browser": "lib/browser.js",
  "license": "Apache-2.0",
  "gitHead": "19108bbfd7d94a5cd02dbff3495eafee9e901ca4",
  "bugs": {
    "url": "https://github.com/theturtle32/WebSocket-Node/issues"
  },
  "_id": "websocket@1.0.22",
  "_shasum": "8c33e3449f879aaf518297c9744cebf812b9e3d8",
  "_from": "websocket@*",
  "_npmVersion": "2.14.3",
  "_nodeVersion": "3.3.1",
  "_npmUser": {
    "name": "theturtle32",
    "email": "brian@worlize.com"
  },
  "maintainers": [
    {
      "name": "theturtle32",
      "email": "brian@worlize.com"
    }
  ],
  "dist": {
    "shasum": "8c33e3449f879aaf518297c9744cebf812b9e3d8",
    "tarball": "http://registry.npmjs.org/websocket/-/websocket-1.0.22.tgz"
  },
  "_resolved": "https://registry.npmjs.org/websocket/-/websocket-1.0.22.tgz"
}

},{}],6:[function(require,module,exports){
/**
 * Copyright 2014 IBM Corp. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use strict';


var Duplex         = require('stream').Duplex;
var util           = require('util');
var extend         = require('extend');
var pick           = require('object.pick');
var W3CWebSocket = require('websocket').w3cwebsocket;


var OPENING_MESSAGE_PARAMS_ALLOWED = ['continuous', 'max_alternatives', 'timestamps', 'word_confidence', 'inactivity_timeout',
  'content-type', 'interim_results', 'keywords', 'keywords_threshold', 'word_alternatives_threshold' ];

var QUERY_PARAMS_ALLOWED = ['model', 'X-Watson-Learning-Opt-Out', 'watson-token'];

/**
 * pipe()-able Node.js Readable/Writeable stream - accepts binary audio and emits text in it's `data` events.
 * Also emits `results` events with interim results and other data.
 *
 * Cannot be instantiated directly, instead reated by calling #createRecognizeStream()
 *
 * Uses WebSockets under the hood. For audio with no recognizable speech, no `data` events are emitted.
 * @param options
 * @constructor
 */
function RecognizeStream(options){
  Duplex.call(this, options);

  // todo: apply these corrections to other methods (?)
  if (options.token && !options['watson-token']) {
    options['watson-token'] = options.token;
  }
  if (options.content_type && !options['content-type']) {
    options['content-type'] = options.content_type;
  }
  if (options['X-WDC-PL-OPT-OUT'] && !options['X-Watson-Learning-Opt-Out']) {
    options['X-Watson-Learning-Opt-Out'] = options['X-WDC-PL-OPT-OUT'];
  }

  var queryParams = extend({model: 'en-US_BroadbandModel'}, pick(options, QUERY_PARAMS_ALLOWED));
  var queryString = Object.keys(queryParams).map(function(key) {
    return key + '=' + (key == 'watson-token' ? queryParams[key] : encodeURIComponent(queryParams[key])); // our server chokes if the token is correctly url-encoded
  }).join('&');

  var url = (options.url || "wss://stream.watsonplatform.net/speech-to-text/api").replace(/^http/, 'ws') + '/v1/recognize?' + queryString;

  var openingMessage = extend({
    action: 'start',
    'content-type': 'audio/wav', // todo: try to determine content-type from the file extension if available
    continuous: true,
    interim_results: true,
  }, pick(options, OPENING_MESSAGE_PARAMS_ALLOWED));

  console.log(url, openingMessage);

  var closingMessage = {action: 'stop'};


  var self = this;

  //node params: requestUrl, protocols, origin, headers, extraRequestOptions
  // browser params: requestUrl, protocols (all others ignored)
  var socket = this.socket = new W3CWebSocket(url, null, null, options.headers, null);

  // when the input stops, let the service know that we're done
  self.on('finish', function() {
    if (self.socket) {
      self.socket.send(JSON.stringify(closingMessage));
    } else {
      this.once('connect', function () {
        self.socket.send(JSON.stringify(closingMessage));
      });
    }
  });

  socket.onerror = function(error) {
    self.listening = false;
    self.emit('error', error);
  };


  this.socket.onopen = function() {
    socket.send(JSON.stringify(openingMessage));
    self.emit('connect');
  };

  this.socket.onclose = function(e) {
    self.listening = false;
    self.push(null);
    /**
     * @event RecognizeStream#connection-close
     * @param {Number} reasonCode
     * @param {String} description
     */
    self.emit('connection-close', e.code, e.reason);
  };

  /**
   * @event RecognizeStream#error
   */
  function emitError(msg, frame, err) {
    if (err) {
      err.message = msg + ' ' + err.message;
    } else {
      err = new Error(msg);
    }
    err.raw = frame;
    self.emit('error', err);
  }

  socket.onmessage = function(frame) {
    if (typeof frame.data !== 'string') {
      return emitError('Unexpected binary data received from server', frame);
    }

    var data;
    try {
      data = JSON.parse(frame.data);
    } catch (jsonEx) {
      return emitError('Invalid JSON received from service:', frame, jsonEx);
    }

    if (data.error) {
      emitError(data.error, frame);
    } else if (data.state === 'listening') {
      // this is emitted both when the server is ready for audio, and after we send the close message to indicate that it's done processing
      if (!self.listening) {
        self.listening = true;
        self.emit('listening');
      } else {
        self.listening = false;
        socket.close();
      }
    } else if (data.results) {
      /**
       * Object with interim or final results, including possible alternatives. May have no results at all for empty audio files.
       * @event RecognizeStream#results
       * @param {Object} results
       */
      self.emit('results', data);
      // note: currently there is always either no entries or exactly 1 entry in the results array. However, this may change in the future.
      if (data.results[0] && data.results[0].final && data.results[0].alternatives) {
        /**
         * Finalized text
         * @event RecognizeStream#data
         * @param {String} transcript
         */
        self.push(data.results[0].alternatives[0].transcript, 'utf8'); // this is the "data" event that can be easily piped to other streams
      }
    } else {
      emitError('Unrecognised message from server', frame);
    }
  }

}
util.inherits(RecognizeStream, Duplex);


RecognizeStream.prototype._read = function(size) {
  // there's no easy way to control reads from the underlying library
  // so, the best we can do here is a no-op
};

RecognizeStream.prototype._write = function(chunk, encoding, callback) {
  var self = this;
  if (self.listening) {
    self.socket.send(chunk);
    // todo: consider watching self.socket.bufferedAmount and only fireing the callback once it reaches 0
    callback();
  } else {
    this.once('listening', function() {
      self.socket.send(chunk);
      callback();
    });
  }
};


module.exports = RecognizeStream;

},{"extend":1,"object.pick":2,"stream":33,"util":36,"websocket":3}],7:[function(require,module,exports){

},{}],8:[function(require,module,exports){
(function (global){
/*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <feross@feross.org> <http://feross.org>
 * @license  MIT
 */
/* eslint-disable no-proto */

'use strict'

var base64 = require('base64-js')
var ieee754 = require('ieee754')
var isArray = require('isarray')

exports.Buffer = Buffer
exports.SlowBuffer = SlowBuffer
exports.INSPECT_MAX_BYTES = 50
Buffer.poolSize = 8192 // not used by this implementation

var rootParent = {}

/**
 * If `Buffer.TYPED_ARRAY_SUPPORT`:
 *   === true    Use Uint8Array implementation (fastest)
 *   === false   Use Object implementation (most compatible, even IE6)
 *
 * Browsers that support typed arrays are IE 10+, Firefox 4+, Chrome 7+, Safari 5.1+,
 * Opera 11.6+, iOS 4.2+.
 *
 * Due to various browser bugs, sometimes the Object implementation will be used even
 * when the browser supports typed arrays.
 *
 * Note:
 *
 *   - Firefox 4-29 lacks support for adding new properties to `Uint8Array` instances,
 *     See: https://bugzilla.mozilla.org/show_bug.cgi?id=695438.
 *
 *   - Chrome 9-10 is missing the `TypedArray.prototype.subarray` function.
 *
 *   - IE10 has a broken `TypedArray.prototype.subarray` function which returns arrays of
 *     incorrect length in some situations.

 * We detect these buggy browsers and set `Buffer.TYPED_ARRAY_SUPPORT` to `false` so they
 * get the Object implementation, which is slower but behaves correctly.
 */
Buffer.TYPED_ARRAY_SUPPORT = global.TYPED_ARRAY_SUPPORT !== undefined
  ? global.TYPED_ARRAY_SUPPORT
  : typedArraySupport()

function typedArraySupport () {
  try {
    var arr = new Uint8Array(1)
    arr.foo = function () { return 42 }
    return arr.foo() === 42 && // typed array instances can be augmented
        typeof arr.subarray === 'function' && // chrome 9-10 lack `subarray`
        arr.subarray(1, 1).byteLength === 0 // ie10 has broken `subarray`
  } catch (e) {
    return false
  }
}

function kMaxLength () {
  return Buffer.TYPED_ARRAY_SUPPORT
    ? 0x7fffffff
    : 0x3fffffff
}

/**
 * Class: Buffer
 * =============
 *
 * The Buffer constructor returns instances of `Uint8Array` that are augmented
 * with function properties for all the node `Buffer` API functions. We use
 * `Uint8Array` so that square bracket notation works as expected -- it returns
 * a single octet.
 *
 * By augmenting the instances, we can avoid modifying the `Uint8Array`
 * prototype.
 */
function Buffer (arg) {
  if (!(this instanceof Buffer)) {
    // Avoid going through an ArgumentsAdaptorTrampoline in the common case.
    if (arguments.length > 1) return new Buffer(arg, arguments[1])
    return new Buffer(arg)
  }

  if (!Buffer.TYPED_ARRAY_SUPPORT) {
    this.length = 0
    this.parent = undefined
  }

  // Common case.
  if (typeof arg === 'number') {
    return fromNumber(this, arg)
  }

  // Slightly less common case.
  if (typeof arg === 'string') {
    return fromString(this, arg, arguments.length > 1 ? arguments[1] : 'utf8')
  }

  // Unusual.
  return fromObject(this, arg)
}

function fromNumber (that, length) {
  that = allocate(that, length < 0 ? 0 : checked(length) | 0)
  if (!Buffer.TYPED_ARRAY_SUPPORT) {
    for (var i = 0; i < length; i++) {
      that[i] = 0
    }
  }
  return that
}

function fromString (that, string, encoding) {
  if (typeof encoding !== 'string' || encoding === '') encoding = 'utf8'

  // Assumption: byteLength() return value is always < kMaxLength.
  var length = byteLength(string, encoding) | 0
  that = allocate(that, length)

  that.write(string, encoding)
  return that
}

function fromObject (that, object) {
  if (Buffer.isBuffer(object)) return fromBuffer(that, object)

  if (isArray(object)) return fromArray(that, object)

  if (object == null) {
    throw new TypeError('must start with number, buffer, array or string')
  }

  if (typeof ArrayBuffer !== 'undefined') {
    if (object.buffer instanceof ArrayBuffer) {
      return fromTypedArray(that, object)
    }
    if (object instanceof ArrayBuffer) {
      return fromArrayBuffer(that, object)
    }
  }

  if (object.length) return fromArrayLike(that, object)

  return fromJsonObject(that, object)
}

function fromBuffer (that, buffer) {
  var length = checked(buffer.length) | 0
  that = allocate(that, length)
  buffer.copy(that, 0, 0, length)
  return that
}

function fromArray (that, array) {
  var length = checked(array.length) | 0
  that = allocate(that, length)
  for (var i = 0; i < length; i += 1) {
    that[i] = array[i] & 255
  }
  return that
}

// Duplicate of fromArray() to keep fromArray() monomorphic.
function fromTypedArray (that, array) {
  var length = checked(array.length) | 0
  that = allocate(that, length)
  // Truncating the elements is probably not what people expect from typed
  // arrays with BYTES_PER_ELEMENT > 1 but it's compatible with the behavior
  // of the old Buffer constructor.
  for (var i = 0; i < length; i += 1) {
    that[i] = array[i] & 255
  }
  return that
}

function fromArrayBuffer (that, array) {
  array.byteLength // this throws if `array` is not a valid ArrayBuffer

  if (Buffer.TYPED_ARRAY_SUPPORT) {
    // Return an augmented `Uint8Array` instance, for best performance
    that = new Uint8Array(array)
    that.__proto__ = Buffer.prototype
  } else {
    // Fallback: Return an object instance of the Buffer class
    that = fromTypedArray(that, new Uint8Array(array))
  }
  return that
}

function fromArrayLike (that, array) {
  var length = checked(array.length) | 0
  that = allocate(that, length)
  for (var i = 0; i < length; i += 1) {
    that[i] = array[i] & 255
  }
  return that
}

// Deserialize { type: 'Buffer', data: [1,2,3,...] } into a Buffer object.
// Returns a zero-length buffer for inputs that don't conform to the spec.
function fromJsonObject (that, object) {
  var array
  var length = 0

  if (object.type === 'Buffer' && isArray(object.data)) {
    array = object.data
    length = checked(array.length) | 0
  }
  that = allocate(that, length)

  for (var i = 0; i < length; i += 1) {
    that[i] = array[i] & 255
  }
  return that
}

if (Buffer.TYPED_ARRAY_SUPPORT) {
  Buffer.prototype.__proto__ = Uint8Array.prototype
  Buffer.__proto__ = Uint8Array
} else {
  // pre-set for values that may exist in the future
  Buffer.prototype.length = undefined
  Buffer.prototype.parent = undefined
}

function allocate (that, length) {
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    // Return an augmented `Uint8Array` instance, for best performance
    that = new Uint8Array(length)
    that.__proto__ = Buffer.prototype
  } else {
    // Fallback: Return an object instance of the Buffer class
    that.length = length
  }

  var fromPool = length !== 0 && length <= Buffer.poolSize >>> 1
  if (fromPool) that.parent = rootParent

  return that
}

function checked (length) {
  // Note: cannot use `length < kMaxLength` here because that fails when
  // length is NaN (which is otherwise coerced to zero.)
  if (length >= kMaxLength()) {
    throw new RangeError('Attempt to allocate Buffer larger than maximum ' +
                         'size: 0x' + kMaxLength().toString(16) + ' bytes')
  }
  return length | 0
}

function SlowBuffer (subject, encoding) {
  if (!(this instanceof SlowBuffer)) return new SlowBuffer(subject, encoding)

  var buf = new Buffer(subject, encoding)
  delete buf.parent
  return buf
}

Buffer.isBuffer = function isBuffer (b) {
  return !!(b != null && b._isBuffer)
}

Buffer.compare = function compare (a, b) {
  if (!Buffer.isBuffer(a) || !Buffer.isBuffer(b)) {
    throw new TypeError('Arguments must be Buffers')
  }

  if (a === b) return 0

  var x = a.length
  var y = b.length

  var i = 0
  var len = Math.min(x, y)
  while (i < len) {
    if (a[i] !== b[i]) break

    ++i
  }

  if (i !== len) {
    x = a[i]
    y = b[i]
  }

  if (x < y) return -1
  if (y < x) return 1
  return 0
}

Buffer.isEncoding = function isEncoding (encoding) {
  switch (String(encoding).toLowerCase()) {
    case 'hex':
    case 'utf8':
    case 'utf-8':
    case 'ascii':
    case 'binary':
    case 'base64':
    case 'raw':
    case 'ucs2':
    case 'ucs-2':
    case 'utf16le':
    case 'utf-16le':
      return true
    default:
      return false
  }
}

Buffer.concat = function concat (list, length) {
  if (!isArray(list)) throw new TypeError('list argument must be an Array of Buffers.')

  if (list.length === 0) {
    return new Buffer(0)
  }

  var i
  if (length === undefined) {
    length = 0
    for (i = 0; i < list.length; i++) {
      length += list[i].length
    }
  }

  var buf = new Buffer(length)
  var pos = 0
  for (i = 0; i < list.length; i++) {
    var item = list[i]
    item.copy(buf, pos)
    pos += item.length
  }
  return buf
}

function byteLength (string, encoding) {
  if (typeof string !== 'string') string = '' + string

  var len = string.length
  if (len === 0) return 0

  // Use a for loop to avoid recursion
  var loweredCase = false
  for (;;) {
    switch (encoding) {
      case 'ascii':
      case 'binary':
      // Deprecated
      case 'raw':
      case 'raws':
        return len
      case 'utf8':
      case 'utf-8':
        return utf8ToBytes(string).length
      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return len * 2
      case 'hex':
        return len >>> 1
      case 'base64':
        return base64ToBytes(string).length
      default:
        if (loweredCase) return utf8ToBytes(string).length // assume utf8
        encoding = ('' + encoding).toLowerCase()
        loweredCase = true
    }
  }
}
Buffer.byteLength = byteLength

function slowToString (encoding, start, end) {
  var loweredCase = false

  start = start | 0
  end = end === undefined || end === Infinity ? this.length : end | 0

  if (!encoding) encoding = 'utf8'
  if (start < 0) start = 0
  if (end > this.length) end = this.length
  if (end <= start) return ''

  while (true) {
    switch (encoding) {
      case 'hex':
        return hexSlice(this, start, end)

      case 'utf8':
      case 'utf-8':
        return utf8Slice(this, start, end)

      case 'ascii':
        return asciiSlice(this, start, end)

      case 'binary':
        return binarySlice(this, start, end)

      case 'base64':
        return base64Slice(this, start, end)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return utf16leSlice(this, start, end)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = (encoding + '').toLowerCase()
        loweredCase = true
    }
  }
}

// Even though this property is private, it shouldn't be removed because it is
// used by `is-buffer` to detect buffer instances in Safari 5-7.
Buffer.prototype._isBuffer = true

Buffer.prototype.toString = function toString () {
  var length = this.length | 0
  if (length === 0) return ''
  if (arguments.length === 0) return utf8Slice(this, 0, length)
  return slowToString.apply(this, arguments)
}

Buffer.prototype.equals = function equals (b) {
  if (!Buffer.isBuffer(b)) throw new TypeError('Argument must be a Buffer')
  if (this === b) return true
  return Buffer.compare(this, b) === 0
}

Buffer.prototype.inspect = function inspect () {
  var str = ''
  var max = exports.INSPECT_MAX_BYTES
  if (this.length > 0) {
    str = this.toString('hex', 0, max).match(/.{2}/g).join(' ')
    if (this.length > max) str += ' ... '
  }
  return '<Buffer ' + str + '>'
}

Buffer.prototype.compare = function compare (b) {
  if (!Buffer.isBuffer(b)) throw new TypeError('Argument must be a Buffer')
  if (this === b) return 0
  return Buffer.compare(this, b)
}

Buffer.prototype.indexOf = function indexOf (val, byteOffset) {
  if (byteOffset > 0x7fffffff) byteOffset = 0x7fffffff
  else if (byteOffset < -0x80000000) byteOffset = -0x80000000
  byteOffset >>= 0

  if (this.length === 0) return -1
  if (byteOffset >= this.length) return -1

  // Negative offsets start from the end of the buffer
  if (byteOffset < 0) byteOffset = Math.max(this.length + byteOffset, 0)

  if (typeof val === 'string') {
    if (val.length === 0) return -1 // special case: looking for empty string always fails
    return String.prototype.indexOf.call(this, val, byteOffset)
  }
  if (Buffer.isBuffer(val)) {
    return arrayIndexOf(this, val, byteOffset)
  }
  if (typeof val === 'number') {
    if (Buffer.TYPED_ARRAY_SUPPORT && Uint8Array.prototype.indexOf === 'function') {
      return Uint8Array.prototype.indexOf.call(this, val, byteOffset)
    }
    return arrayIndexOf(this, [ val ], byteOffset)
  }

  function arrayIndexOf (arr, val, byteOffset) {
    var foundIndex = -1
    for (var i = 0; byteOffset + i < arr.length; i++) {
      if (arr[byteOffset + i] === val[foundIndex === -1 ? 0 : i - foundIndex]) {
        if (foundIndex === -1) foundIndex = i
        if (i - foundIndex + 1 === val.length) return byteOffset + foundIndex
      } else {
        foundIndex = -1
      }
    }
    return -1
  }

  throw new TypeError('val must be string, number or Buffer')
}

function hexWrite (buf, string, offset, length) {
  offset = Number(offset) || 0
  var remaining = buf.length - offset
  if (!length) {
    length = remaining
  } else {
    length = Number(length)
    if (length > remaining) {
      length = remaining
    }
  }

  // must be an even number of digits
  var strLen = string.length
  if (strLen % 2 !== 0) throw new Error('Invalid hex string')

  if (length > strLen / 2) {
    length = strLen / 2
  }
  for (var i = 0; i < length; i++) {
    var parsed = parseInt(string.substr(i * 2, 2), 16)
    if (isNaN(parsed)) throw new Error('Invalid hex string')
    buf[offset + i] = parsed
  }
  return i
}

function utf8Write (buf, string, offset, length) {
  return blitBuffer(utf8ToBytes(string, buf.length - offset), buf, offset, length)
}

function asciiWrite (buf, string, offset, length) {
  return blitBuffer(asciiToBytes(string), buf, offset, length)
}

function binaryWrite (buf, string, offset, length) {
  return asciiWrite(buf, string, offset, length)
}

function base64Write (buf, string, offset, length) {
  return blitBuffer(base64ToBytes(string), buf, offset, length)
}

function ucs2Write (buf, string, offset, length) {
  return blitBuffer(utf16leToBytes(string, buf.length - offset), buf, offset, length)
}

Buffer.prototype.write = function write (string, offset, length, encoding) {
  // Buffer#write(string)
  if (offset === undefined) {
    encoding = 'utf8'
    length = this.length
    offset = 0
  // Buffer#write(string, encoding)
  } else if (length === undefined && typeof offset === 'string') {
    encoding = offset
    length = this.length
    offset = 0
  // Buffer#write(string, offset[, length][, encoding])
  } else if (isFinite(offset)) {
    offset = offset | 0
    if (isFinite(length)) {
      length = length | 0
      if (encoding === undefined) encoding = 'utf8'
    } else {
      encoding = length
      length = undefined
    }
  // legacy write(string, encoding, offset, length) - remove in v0.13
  } else {
    var swap = encoding
    encoding = offset
    offset = length | 0
    length = swap
  }

  var remaining = this.length - offset
  if (length === undefined || length > remaining) length = remaining

  if ((string.length > 0 && (length < 0 || offset < 0)) || offset > this.length) {
    throw new RangeError('attempt to write outside buffer bounds')
  }

  if (!encoding) encoding = 'utf8'

  var loweredCase = false
  for (;;) {
    switch (encoding) {
      case 'hex':
        return hexWrite(this, string, offset, length)

      case 'utf8':
      case 'utf-8':
        return utf8Write(this, string, offset, length)

      case 'ascii':
        return asciiWrite(this, string, offset, length)

      case 'binary':
        return binaryWrite(this, string, offset, length)

      case 'base64':
        // Warning: maxLength not taken into account in base64Write
        return base64Write(this, string, offset, length)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return ucs2Write(this, string, offset, length)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = ('' + encoding).toLowerCase()
        loweredCase = true
    }
  }
}

Buffer.prototype.toJSON = function toJSON () {
  return {
    type: 'Buffer',
    data: Array.prototype.slice.call(this._arr || this, 0)
  }
}

function base64Slice (buf, start, end) {
  if (start === 0 && end === buf.length) {
    return base64.fromByteArray(buf)
  } else {
    return base64.fromByteArray(buf.slice(start, end))
  }
}

function utf8Slice (buf, start, end) {
  end = Math.min(buf.length, end)
  var res = []

  var i = start
  while (i < end) {
    var firstByte = buf[i]
    var codePoint = null
    var bytesPerSequence = (firstByte > 0xEF) ? 4
      : (firstByte > 0xDF) ? 3
      : (firstByte > 0xBF) ? 2
      : 1

    if (i + bytesPerSequence <= end) {
      var secondByte, thirdByte, fourthByte, tempCodePoint

      switch (bytesPerSequence) {
        case 1:
          if (firstByte < 0x80) {
            codePoint = firstByte
          }
          break
        case 2:
          secondByte = buf[i + 1]
          if ((secondByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0x1F) << 0x6 | (secondByte & 0x3F)
            if (tempCodePoint > 0x7F) {
              codePoint = tempCodePoint
            }
          }
          break
        case 3:
          secondByte = buf[i + 1]
          thirdByte = buf[i + 2]
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0xC | (secondByte & 0x3F) << 0x6 | (thirdByte & 0x3F)
            if (tempCodePoint > 0x7FF && (tempCodePoint < 0xD800 || tempCodePoint > 0xDFFF)) {
              codePoint = tempCodePoint
            }
          }
          break
        case 4:
          secondByte = buf[i + 1]
          thirdByte = buf[i + 2]
          fourthByte = buf[i + 3]
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80 && (fourthByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0x12 | (secondByte & 0x3F) << 0xC | (thirdByte & 0x3F) << 0x6 | (fourthByte & 0x3F)
            if (tempCodePoint > 0xFFFF && tempCodePoint < 0x110000) {
              codePoint = tempCodePoint
            }
          }
      }
    }

    if (codePoint === null) {
      // we did not generate a valid codePoint so insert a
      // replacement char (U+FFFD) and advance only 1 byte
      codePoint = 0xFFFD
      bytesPerSequence = 1
    } else if (codePoint > 0xFFFF) {
      // encode to utf16 (surrogate pair dance)
      codePoint -= 0x10000
      res.push(codePoint >>> 10 & 0x3FF | 0xD800)
      codePoint = 0xDC00 | codePoint & 0x3FF
    }

    res.push(codePoint)
    i += bytesPerSequence
  }

  return decodeCodePointsArray(res)
}

// Based on http://stackoverflow.com/a/22747272/680742, the browser with
// the lowest limit is Chrome, with 0x10000 args.
// We go 1 magnitude less, for safety
var MAX_ARGUMENTS_LENGTH = 0x1000

function decodeCodePointsArray (codePoints) {
  var len = codePoints.length
  if (len <= MAX_ARGUMENTS_LENGTH) {
    return String.fromCharCode.apply(String, codePoints) // avoid extra slice()
  }

  // Decode in chunks to avoid "call stack size exceeded".
  var res = ''
  var i = 0
  while (i < len) {
    res += String.fromCharCode.apply(
      String,
      codePoints.slice(i, i += MAX_ARGUMENTS_LENGTH)
    )
  }
  return res
}

function asciiSlice (buf, start, end) {
  var ret = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; i++) {
    ret += String.fromCharCode(buf[i] & 0x7F)
  }
  return ret
}

function binarySlice (buf, start, end) {
  var ret = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; i++) {
    ret += String.fromCharCode(buf[i])
  }
  return ret
}

function hexSlice (buf, start, end) {
  var len = buf.length

  if (!start || start < 0) start = 0
  if (!end || end < 0 || end > len) end = len

  var out = ''
  for (var i = start; i < end; i++) {
    out += toHex(buf[i])
  }
  return out
}

function utf16leSlice (buf, start, end) {
  var bytes = buf.slice(start, end)
  var res = ''
  for (var i = 0; i < bytes.length; i += 2) {
    res += String.fromCharCode(bytes[i] + bytes[i + 1] * 256)
  }
  return res
}

Buffer.prototype.slice = function slice (start, end) {
  var len = this.length
  start = ~~start
  end = end === undefined ? len : ~~end

  if (start < 0) {
    start += len
    if (start < 0) start = 0
  } else if (start > len) {
    start = len
  }

  if (end < 0) {
    end += len
    if (end < 0) end = 0
  } else if (end > len) {
    end = len
  }

  if (end < start) end = start

  var newBuf
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    newBuf = this.subarray(start, end)
    newBuf.__proto__ = Buffer.prototype
  } else {
    var sliceLen = end - start
    newBuf = new Buffer(sliceLen, undefined)
    for (var i = 0; i < sliceLen; i++) {
      newBuf[i] = this[i + start]
    }
  }

  if (newBuf.length) newBuf.parent = this.parent || this

  return newBuf
}

/*
 * Need to make sure that buffer isn't trying to write out of bounds.
 */
function checkOffset (offset, ext, length) {
  if ((offset % 1) !== 0 || offset < 0) throw new RangeError('offset is not uint')
  if (offset + ext > length) throw new RangeError('Trying to access beyond buffer length')
}

Buffer.prototype.readUIntLE = function readUIntLE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var val = this[offset]
  var mul = 1
  var i = 0
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul
  }

  return val
}

Buffer.prototype.readUIntBE = function readUIntBE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) {
    checkOffset(offset, byteLength, this.length)
  }

  var val = this[offset + --byteLength]
  var mul = 1
  while (byteLength > 0 && (mul *= 0x100)) {
    val += this[offset + --byteLength] * mul
  }

  return val
}

Buffer.prototype.readUInt8 = function readUInt8 (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 1, this.length)
  return this[offset]
}

Buffer.prototype.readUInt16LE = function readUInt16LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  return this[offset] | (this[offset + 1] << 8)
}

Buffer.prototype.readUInt16BE = function readUInt16BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  return (this[offset] << 8) | this[offset + 1]
}

Buffer.prototype.readUInt32LE = function readUInt32LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return ((this[offset]) |
      (this[offset + 1] << 8) |
      (this[offset + 2] << 16)) +
      (this[offset + 3] * 0x1000000)
}

Buffer.prototype.readUInt32BE = function readUInt32BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset] * 0x1000000) +
    ((this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    this[offset + 3])
}

Buffer.prototype.readIntLE = function readIntLE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var val = this[offset]
  var mul = 1
  var i = 0
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul
  }
  mul *= 0x80

  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

  return val
}

Buffer.prototype.readIntBE = function readIntBE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var i = byteLength
  var mul = 1
  var val = this[offset + --i]
  while (i > 0 && (mul *= 0x100)) {
    val += this[offset + --i] * mul
  }
  mul *= 0x80

  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

  return val
}

Buffer.prototype.readInt8 = function readInt8 (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 1, this.length)
  if (!(this[offset] & 0x80)) return (this[offset])
  return ((0xff - this[offset] + 1) * -1)
}

Buffer.prototype.readInt16LE = function readInt16LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  var val = this[offset] | (this[offset + 1] << 8)
  return (val & 0x8000) ? val | 0xFFFF0000 : val
}

Buffer.prototype.readInt16BE = function readInt16BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  var val = this[offset + 1] | (this[offset] << 8)
  return (val & 0x8000) ? val | 0xFFFF0000 : val
}

Buffer.prototype.readInt32LE = function readInt32LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset]) |
    (this[offset + 1] << 8) |
    (this[offset + 2] << 16) |
    (this[offset + 3] << 24)
}

Buffer.prototype.readInt32BE = function readInt32BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset] << 24) |
    (this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    (this[offset + 3])
}

Buffer.prototype.readFloatLE = function readFloatLE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)
  return ieee754.read(this, offset, true, 23, 4)
}

Buffer.prototype.readFloatBE = function readFloatBE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)
  return ieee754.read(this, offset, false, 23, 4)
}

Buffer.prototype.readDoubleLE = function readDoubleLE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 8, this.length)
  return ieee754.read(this, offset, true, 52, 8)
}

Buffer.prototype.readDoubleBE = function readDoubleBE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 8, this.length)
  return ieee754.read(this, offset, false, 52, 8)
}

function checkInt (buf, value, offset, ext, max, min) {
  if (!Buffer.isBuffer(buf)) throw new TypeError('buffer must be a Buffer instance')
  if (value > max || value < min) throw new RangeError('value is out of bounds')
  if (offset + ext > buf.length) throw new RangeError('index out of range')
}

Buffer.prototype.writeUIntLE = function writeUIntLE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) checkInt(this, value, offset, byteLength, Math.pow(2, 8 * byteLength), 0)

  var mul = 1
  var i = 0
  this[offset] = value & 0xFF
  while (++i < byteLength && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeUIntBE = function writeUIntBE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) checkInt(this, value, offset, byteLength, Math.pow(2, 8 * byteLength), 0)

  var i = byteLength - 1
  var mul = 1
  this[offset + i] = value & 0xFF
  while (--i >= 0 && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeUInt8 = function writeUInt8 (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 1, 0xff, 0)
  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value)
  this[offset] = (value & 0xff)
  return offset + 1
}

function objectWriteUInt16 (buf, value, offset, littleEndian) {
  if (value < 0) value = 0xffff + value + 1
  for (var i = 0, j = Math.min(buf.length - offset, 2); i < j; i++) {
    buf[offset + i] = (value & (0xff << (8 * (littleEndian ? i : 1 - i)))) >>>
      (littleEndian ? i : 1 - i) * 8
  }
}

Buffer.prototype.writeUInt16LE = function writeUInt16LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value & 0xff)
    this[offset + 1] = (value >>> 8)
  } else {
    objectWriteUInt16(this, value, offset, true)
  }
  return offset + 2
}

Buffer.prototype.writeUInt16BE = function writeUInt16BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 8)
    this[offset + 1] = (value & 0xff)
  } else {
    objectWriteUInt16(this, value, offset, false)
  }
  return offset + 2
}

function objectWriteUInt32 (buf, value, offset, littleEndian) {
  if (value < 0) value = 0xffffffff + value + 1
  for (var i = 0, j = Math.min(buf.length - offset, 4); i < j; i++) {
    buf[offset + i] = (value >>> (littleEndian ? i : 3 - i) * 8) & 0xff
  }
}

Buffer.prototype.writeUInt32LE = function writeUInt32LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset + 3] = (value >>> 24)
    this[offset + 2] = (value >>> 16)
    this[offset + 1] = (value >>> 8)
    this[offset] = (value & 0xff)
  } else {
    objectWriteUInt32(this, value, offset, true)
  }
  return offset + 4
}

Buffer.prototype.writeUInt32BE = function writeUInt32BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 24)
    this[offset + 1] = (value >>> 16)
    this[offset + 2] = (value >>> 8)
    this[offset + 3] = (value & 0xff)
  } else {
    objectWriteUInt32(this, value, offset, false)
  }
  return offset + 4
}

Buffer.prototype.writeIntLE = function writeIntLE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) {
    var limit = Math.pow(2, 8 * byteLength - 1)

    checkInt(this, value, offset, byteLength, limit - 1, -limit)
  }

  var i = 0
  var mul = 1
  var sub = value < 0 ? 1 : 0
  this[offset] = value & 0xFF
  while (++i < byteLength && (mul *= 0x100)) {
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeIntBE = function writeIntBE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) {
    var limit = Math.pow(2, 8 * byteLength - 1)

    checkInt(this, value, offset, byteLength, limit - 1, -limit)
  }

  var i = byteLength - 1
  var mul = 1
  var sub = value < 0 ? 1 : 0
  this[offset + i] = value & 0xFF
  while (--i >= 0 && (mul *= 0x100)) {
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeInt8 = function writeInt8 (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 1, 0x7f, -0x80)
  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value)
  if (value < 0) value = 0xff + value + 1
  this[offset] = (value & 0xff)
  return offset + 1
}

Buffer.prototype.writeInt16LE = function writeInt16LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value & 0xff)
    this[offset + 1] = (value >>> 8)
  } else {
    objectWriteUInt16(this, value, offset, true)
  }
  return offset + 2
}

Buffer.prototype.writeInt16BE = function writeInt16BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 8)
    this[offset + 1] = (value & 0xff)
  } else {
    objectWriteUInt16(this, value, offset, false)
  }
  return offset + 2
}

Buffer.prototype.writeInt32LE = function writeInt32LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value & 0xff)
    this[offset + 1] = (value >>> 8)
    this[offset + 2] = (value >>> 16)
    this[offset + 3] = (value >>> 24)
  } else {
    objectWriteUInt32(this, value, offset, true)
  }
  return offset + 4
}

Buffer.prototype.writeInt32BE = function writeInt32BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
  if (value < 0) value = 0xffffffff + value + 1
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 24)
    this[offset + 1] = (value >>> 16)
    this[offset + 2] = (value >>> 8)
    this[offset + 3] = (value & 0xff)
  } else {
    objectWriteUInt32(this, value, offset, false)
  }
  return offset + 4
}

function checkIEEE754 (buf, value, offset, ext, max, min) {
  if (value > max || value < min) throw new RangeError('value is out of bounds')
  if (offset + ext > buf.length) throw new RangeError('index out of range')
  if (offset < 0) throw new RangeError('index out of range')
}

function writeFloat (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 4, 3.4028234663852886e+38, -3.4028234663852886e+38)
  }
  ieee754.write(buf, value, offset, littleEndian, 23, 4)
  return offset + 4
}

Buffer.prototype.writeFloatLE = function writeFloatLE (value, offset, noAssert) {
  return writeFloat(this, value, offset, true, noAssert)
}

Buffer.prototype.writeFloatBE = function writeFloatBE (value, offset, noAssert) {
  return writeFloat(this, value, offset, false, noAssert)
}

function writeDouble (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 8, 1.7976931348623157E+308, -1.7976931348623157E+308)
  }
  ieee754.write(buf, value, offset, littleEndian, 52, 8)
  return offset + 8
}

Buffer.prototype.writeDoubleLE = function writeDoubleLE (value, offset, noAssert) {
  return writeDouble(this, value, offset, true, noAssert)
}

Buffer.prototype.writeDoubleBE = function writeDoubleBE (value, offset, noAssert) {
  return writeDouble(this, value, offset, false, noAssert)
}

// copy(targetBuffer, targetStart=0, sourceStart=0, sourceEnd=buffer.length)
Buffer.prototype.copy = function copy (target, targetStart, start, end) {
  if (!start) start = 0
  if (!end && end !== 0) end = this.length
  if (targetStart >= target.length) targetStart = target.length
  if (!targetStart) targetStart = 0
  if (end > 0 && end < start) end = start

  // Copy 0 bytes; we're done
  if (end === start) return 0
  if (target.length === 0 || this.length === 0) return 0

  // Fatal error conditions
  if (targetStart < 0) {
    throw new RangeError('targetStart out of bounds')
  }
  if (start < 0 || start >= this.length) throw new RangeError('sourceStart out of bounds')
  if (end < 0) throw new RangeError('sourceEnd out of bounds')

  // Are we oob?
  if (end > this.length) end = this.length
  if (target.length - targetStart < end - start) {
    end = target.length - targetStart + start
  }

  var len = end - start
  var i

  if (this === target && start < targetStart && targetStart < end) {
    // descending copy from end
    for (i = len - 1; i >= 0; i--) {
      target[i + targetStart] = this[i + start]
    }
  } else if (len < 1000 || !Buffer.TYPED_ARRAY_SUPPORT) {
    // ascending copy from start
    for (i = 0; i < len; i++) {
      target[i + targetStart] = this[i + start]
    }
  } else {
    Uint8Array.prototype.set.call(
      target,
      this.subarray(start, start + len),
      targetStart
    )
  }

  return len
}

// fill(value, start=0, end=buffer.length)
Buffer.prototype.fill = function fill (value, start, end) {
  if (!value) value = 0
  if (!start) start = 0
  if (!end) end = this.length

  if (end < start) throw new RangeError('end < start')

  // Fill 0 bytes; we're done
  if (end === start) return
  if (this.length === 0) return

  if (start < 0 || start >= this.length) throw new RangeError('start out of bounds')
  if (end < 0 || end > this.length) throw new RangeError('end out of bounds')

  var i
  if (typeof value === 'number') {
    for (i = start; i < end; i++) {
      this[i] = value
    }
  } else {
    var bytes = utf8ToBytes(value.toString())
    var len = bytes.length
    for (i = start; i < end; i++) {
      this[i] = bytes[i % len]
    }
  }

  return this
}

// HELPER FUNCTIONS
// ================

var INVALID_BASE64_RE = /[^+\/0-9A-Za-z-_]/g

function base64clean (str) {
  // Node strips out invalid characters like \n and \t from the string, base64-js does not
  str = stringtrim(str).replace(INVALID_BASE64_RE, '')
  // Node converts strings with length < 2 to ''
  if (str.length < 2) return ''
  // Node allows for non-padded base64 strings (missing trailing ===), base64-js does not
  while (str.length % 4 !== 0) {
    str = str + '='
  }
  return str
}

function stringtrim (str) {
  if (str.trim) return str.trim()
  return str.replace(/^\s+|\s+$/g, '')
}

function toHex (n) {
  if (n < 16) return '0' + n.toString(16)
  return n.toString(16)
}

function utf8ToBytes (string, units) {
  units = units || Infinity
  var codePoint
  var length = string.length
  var leadSurrogate = null
  var bytes = []

  for (var i = 0; i < length; i++) {
    codePoint = string.charCodeAt(i)

    // is surrogate component
    if (codePoint > 0xD7FF && codePoint < 0xE000) {
      // last char was a lead
      if (!leadSurrogate) {
        // no lead yet
        if (codePoint > 0xDBFF) {
          // unexpected trail
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
          continue
        } else if (i + 1 === length) {
          // unpaired lead
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
          continue
        }

        // valid lead
        leadSurrogate = codePoint

        continue
      }

      // 2 leads in a row
      if (codePoint < 0xDC00) {
        if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
        leadSurrogate = codePoint
        continue
      }

      // valid surrogate pair
      codePoint = (leadSurrogate - 0xD800 << 10 | codePoint - 0xDC00) + 0x10000
    } else if (leadSurrogate) {
      // valid bmp char, but last char was a lead
      if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
    }

    leadSurrogate = null

    // encode utf8
    if (codePoint < 0x80) {
      if ((units -= 1) < 0) break
      bytes.push(codePoint)
    } else if (codePoint < 0x800) {
      if ((units -= 2) < 0) break
      bytes.push(
        codePoint >> 0x6 | 0xC0,
        codePoint & 0x3F | 0x80
      )
    } else if (codePoint < 0x10000) {
      if ((units -= 3) < 0) break
      bytes.push(
        codePoint >> 0xC | 0xE0,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      )
    } else if (codePoint < 0x110000) {
      if ((units -= 4) < 0) break
      bytes.push(
        codePoint >> 0x12 | 0xF0,
        codePoint >> 0xC & 0x3F | 0x80,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      )
    } else {
      throw new Error('Invalid code point')
    }
  }

  return bytes
}

function asciiToBytes (str) {
  var byteArray = []
  for (var i = 0; i < str.length; i++) {
    // Node's code seems to be doing this and not & 0x7F..
    byteArray.push(str.charCodeAt(i) & 0xFF)
  }
  return byteArray
}

function utf16leToBytes (str, units) {
  var c, hi, lo
  var byteArray = []
  for (var i = 0; i < str.length; i++) {
    if ((units -= 2) < 0) break

    c = str.charCodeAt(i)
    hi = c >> 8
    lo = c % 256
    byteArray.push(lo)
    byteArray.push(hi)
  }

  return byteArray
}

function base64ToBytes (str) {
  return base64.toByteArray(base64clean(str))
}

function blitBuffer (src, dst, offset, length) {
  for (var i = 0; i < length; i++) {
    if ((i + offset >= dst.length) || (i >= src.length)) break
    dst[i + offset] = src[i]
  }
  return i
}

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"base64-js":9,"ieee754":10,"isarray":11}],9:[function(require,module,exports){
;(function (exports) {
  'use strict'

  var lookup = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'

  var Arr = (typeof Uint8Array !== 'undefined')
    ? Uint8Array
    : Array

  var PLUS = '+'.charCodeAt(0)
  var SLASH = '/'.charCodeAt(0)
  var NUMBER = '0'.charCodeAt(0)
  var LOWER = 'a'.charCodeAt(0)
  var UPPER = 'A'.charCodeAt(0)
  var PLUS_URL_SAFE = '-'.charCodeAt(0)
  var SLASH_URL_SAFE = '_'.charCodeAt(0)

  function decode (elt) {
    var code = elt.charCodeAt(0)
    if (code === PLUS || code === PLUS_URL_SAFE) return 62 // '+'
    if (code === SLASH || code === SLASH_URL_SAFE) return 63 // '/'
    if (code < NUMBER) return -1 // no match
    if (code < NUMBER + 10) return code - NUMBER + 26 + 26
    if (code < UPPER + 26) return code - UPPER
    if (code < LOWER + 26) return code - LOWER + 26
  }

  function b64ToByteArray (b64) {
    var i, j, l, tmp, placeHolders, arr

    if (b64.length % 4 > 0) {
      throw new Error('Invalid string. Length must be a multiple of 4')
    }

    // the number of equal signs (place holders)
    // if there are two placeholders, than the two characters before it
    // represent one byte
    // if there is only one, then the three characters before it represent 2 bytes
    // this is just a cheap hack to not do indexOf twice
    var len = b64.length
    placeHolders = b64.charAt(len - 2) === '=' ? 2 : b64.charAt(len - 1) === '=' ? 1 : 0

    // base64 is 4/3 + up to two characters of the original data
    arr = new Arr(b64.length * 3 / 4 - placeHolders)

    // if there are placeholders, only get up to the last complete 4 chars
    l = placeHolders > 0 ? b64.length - 4 : b64.length

    var L = 0

    function push (v) {
      arr[L++] = v
    }

    for (i = 0, j = 0; i < l; i += 4, j += 3) {
      tmp = (decode(b64.charAt(i)) << 18) | (decode(b64.charAt(i + 1)) << 12) | (decode(b64.charAt(i + 2)) << 6) | decode(b64.charAt(i + 3))
      push((tmp & 0xFF0000) >> 16)
      push((tmp & 0xFF00) >> 8)
      push(tmp & 0xFF)
    }

    if (placeHolders === 2) {
      tmp = (decode(b64.charAt(i)) << 2) | (decode(b64.charAt(i + 1)) >> 4)
      push(tmp & 0xFF)
    } else if (placeHolders === 1) {
      tmp = (decode(b64.charAt(i)) << 10) | (decode(b64.charAt(i + 1)) << 4) | (decode(b64.charAt(i + 2)) >> 2)
      push((tmp >> 8) & 0xFF)
      push(tmp & 0xFF)
    }

    return arr
  }

  function uint8ToBase64 (uint8) {
    var i
    var extraBytes = uint8.length % 3 // if we have 1 byte left, pad 2 bytes
    var output = ''
    var temp, length

    function encode (num) {
      return lookup.charAt(num)
    }

    function tripletToBase64 (num) {
      return encode(num >> 18 & 0x3F) + encode(num >> 12 & 0x3F) + encode(num >> 6 & 0x3F) + encode(num & 0x3F)
    }

    // go through the array every three bytes, we'll deal with trailing stuff later
    for (i = 0, length = uint8.length - extraBytes; i < length; i += 3) {
      temp = (uint8[i] << 16) + (uint8[i + 1] << 8) + (uint8[i + 2])
      output += tripletToBase64(temp)
    }

    // pad the end with zeros, but make sure to not forget the extra bytes
    switch (extraBytes) {
      case 1:
        temp = uint8[uint8.length - 1]
        output += encode(temp >> 2)
        output += encode((temp << 4) & 0x3F)
        output += '=='
        break
      case 2:
        temp = (uint8[uint8.length - 2] << 8) + (uint8[uint8.length - 1])
        output += encode(temp >> 10)
        output += encode((temp >> 4) & 0x3F)
        output += encode((temp << 2) & 0x3F)
        output += '='
        break
      default:
        break
    }

    return output
  }

  exports.toByteArray = b64ToByteArray
  exports.fromByteArray = uint8ToBase64
}(typeof exports === 'undefined' ? (this.base64js = {}) : exports))

},{}],10:[function(require,module,exports){
exports.read = function (buffer, offset, isLE, mLen, nBytes) {
  var e, m
  var eLen = nBytes * 8 - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var nBits = -7
  var i = isLE ? (nBytes - 1) : 0
  var d = isLE ? -1 : 1
  var s = buffer[offset + i]

  i += d

  e = s & ((1 << (-nBits)) - 1)
  s >>= (-nBits)
  nBits += eLen
  for (; nBits > 0; e = e * 256 + buffer[offset + i], i += d, nBits -= 8) {}

  m = e & ((1 << (-nBits)) - 1)
  e >>= (-nBits)
  nBits += mLen
  for (; nBits > 0; m = m * 256 + buffer[offset + i], i += d, nBits -= 8) {}

  if (e === 0) {
    e = 1 - eBias
  } else if (e === eMax) {
    return m ? NaN : ((s ? -1 : 1) * Infinity)
  } else {
    m = m + Math.pow(2, mLen)
    e = e - eBias
  }
  return (s ? -1 : 1) * m * Math.pow(2, e - mLen)
}

exports.write = function (buffer, value, offset, isLE, mLen, nBytes) {
  var e, m, c
  var eLen = nBytes * 8 - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var rt = (mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0)
  var i = isLE ? 0 : (nBytes - 1)
  var d = isLE ? 1 : -1
  var s = value < 0 || (value === 0 && 1 / value < 0) ? 1 : 0

  value = Math.abs(value)

  if (isNaN(value) || value === Infinity) {
    m = isNaN(value) ? 1 : 0
    e = eMax
  } else {
    e = Math.floor(Math.log(value) / Math.LN2)
    if (value * (c = Math.pow(2, -e)) < 1) {
      e--
      c *= 2
    }
    if (e + eBias >= 1) {
      value += rt / c
    } else {
      value += rt * Math.pow(2, 1 - eBias)
    }
    if (value * c >= 2) {
      e++
      c /= 2
    }

    if (e + eBias >= eMax) {
      m = 0
      e = eMax
    } else if (e + eBias >= 1) {
      m = (value * c - 1) * Math.pow(2, mLen)
      e = e + eBias
    } else {
      m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen)
      e = 0
    }
  }

  for (; mLen >= 8; buffer[offset + i] = m & 0xff, i += d, m /= 256, mLen -= 8) {}

  e = (e << mLen) | m
  eLen += mLen
  for (; eLen > 0; buffer[offset + i] = e & 0xff, i += d, e /= 256, eLen -= 8) {}

  buffer[offset + i - d] |= s * 128
}

},{}],11:[function(require,module,exports){
var toString = {}.toString;

module.exports = Array.isArray || function (arr) {
  return toString.call(arr) == '[object Array]';
};

},{}],12:[function(require,module,exports){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

function EventEmitter() {
  this._events = this._events || {};
  this._maxListeners = this._maxListeners || undefined;
}
module.exports = EventEmitter;

// Backwards-compat with node 0.10.x
EventEmitter.EventEmitter = EventEmitter;

EventEmitter.prototype._events = undefined;
EventEmitter.prototype._maxListeners = undefined;

// By default EventEmitters will print a warning if more than 10 listeners are
// added to it. This is a useful default which helps finding memory leaks.
EventEmitter.defaultMaxListeners = 10;

// Obviously not all Emitters should be limited to 10. This function allows
// that to be increased. Set to zero for unlimited.
EventEmitter.prototype.setMaxListeners = function(n) {
  if (!isNumber(n) || n < 0 || isNaN(n))
    throw TypeError('n must be a positive number');
  this._maxListeners = n;
  return this;
};

EventEmitter.prototype.emit = function(type) {
  var er, handler, len, args, i, listeners;

  if (!this._events)
    this._events = {};

  // If there is no 'error' event listener then throw.
  if (type === 'error') {
    if (!this._events.error ||
        (isObject(this._events.error) && !this._events.error.length)) {
      er = arguments[1];
      if (er instanceof Error) {
        throw er; // Unhandled 'error' event
      }
      throw TypeError('Uncaught, unspecified "error" event.');
    }
  }

  handler = this._events[type];

  if (isUndefined(handler))
    return false;

  if (isFunction(handler)) {
    switch (arguments.length) {
      // fast cases
      case 1:
        handler.call(this);
        break;
      case 2:
        handler.call(this, arguments[1]);
        break;
      case 3:
        handler.call(this, arguments[1], arguments[2]);
        break;
      // slower
      default:
        args = Array.prototype.slice.call(arguments, 1);
        handler.apply(this, args);
    }
  } else if (isObject(handler)) {
    args = Array.prototype.slice.call(arguments, 1);
    listeners = handler.slice();
    len = listeners.length;
    for (i = 0; i < len; i++)
      listeners[i].apply(this, args);
  }

  return true;
};

EventEmitter.prototype.addListener = function(type, listener) {
  var m;

  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  if (!this._events)
    this._events = {};

  // To avoid recursion in the case that type === "newListener"! Before
  // adding it to the listeners, first emit "newListener".
  if (this._events.newListener)
    this.emit('newListener', type,
              isFunction(listener.listener) ?
              listener.listener : listener);

  if (!this._events[type])
    // Optimize the case of one listener. Don't need the extra array object.
    this._events[type] = listener;
  else if (isObject(this._events[type]))
    // If we've already got an array, just append.
    this._events[type].push(listener);
  else
    // Adding the second element, need to change to array.
    this._events[type] = [this._events[type], listener];

  // Check for listener leak
  if (isObject(this._events[type]) && !this._events[type].warned) {
    if (!isUndefined(this._maxListeners)) {
      m = this._maxListeners;
    } else {
      m = EventEmitter.defaultMaxListeners;
    }

    if (m && m > 0 && this._events[type].length > m) {
      this._events[type].warned = true;
      console.error('(node) warning: possible EventEmitter memory ' +
                    'leak detected. %d listeners added. ' +
                    'Use emitter.setMaxListeners() to increase limit.',
                    this._events[type].length);
      if (typeof console.trace === 'function') {
        // not supported in IE 10
        console.trace();
      }
    }
  }

  return this;
};

EventEmitter.prototype.on = EventEmitter.prototype.addListener;

EventEmitter.prototype.once = function(type, listener) {
  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  var fired = false;

  function g() {
    this.removeListener(type, g);

    if (!fired) {
      fired = true;
      listener.apply(this, arguments);
    }
  }

  g.listener = listener;
  this.on(type, g);

  return this;
};

// emits a 'removeListener' event iff the listener was removed
EventEmitter.prototype.removeListener = function(type, listener) {
  var list, position, length, i;

  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  if (!this._events || !this._events[type])
    return this;

  list = this._events[type];
  length = list.length;
  position = -1;

  if (list === listener ||
      (isFunction(list.listener) && list.listener === listener)) {
    delete this._events[type];
    if (this._events.removeListener)
      this.emit('removeListener', type, listener);

  } else if (isObject(list)) {
    for (i = length; i-- > 0;) {
      if (list[i] === listener ||
          (list[i].listener && list[i].listener === listener)) {
        position = i;
        break;
      }
    }

    if (position < 0)
      return this;

    if (list.length === 1) {
      list.length = 0;
      delete this._events[type];
    } else {
      list.splice(position, 1);
    }

    if (this._events.removeListener)
      this.emit('removeListener', type, listener);
  }

  return this;
};

EventEmitter.prototype.removeAllListeners = function(type) {
  var key, listeners;

  if (!this._events)
    return this;

  // not listening for removeListener, no need to emit
  if (!this._events.removeListener) {
    if (arguments.length === 0)
      this._events = {};
    else if (this._events[type])
      delete this._events[type];
    return this;
  }

  // emit removeListener for all listeners on all events
  if (arguments.length === 0) {
    for (key in this._events) {
      if (key === 'removeListener') continue;
      this.removeAllListeners(key);
    }
    this.removeAllListeners('removeListener');
    this._events = {};
    return this;
  }

  listeners = this._events[type];

  if (isFunction(listeners)) {
    this.removeListener(type, listeners);
  } else if (listeners) {
    // LIFO order
    while (listeners.length)
      this.removeListener(type, listeners[listeners.length - 1]);
  }
  delete this._events[type];

  return this;
};

EventEmitter.prototype.listeners = function(type) {
  var ret;
  if (!this._events || !this._events[type])
    ret = [];
  else if (isFunction(this._events[type]))
    ret = [this._events[type]];
  else
    ret = this._events[type].slice();
  return ret;
};

EventEmitter.prototype.listenerCount = function(type) {
  if (this._events) {
    var evlistener = this._events[type];

    if (isFunction(evlistener))
      return 1;
    else if (evlistener)
      return evlistener.length;
  }
  return 0;
};

EventEmitter.listenerCount = function(emitter, type) {
  return emitter.listenerCount(type);
};

function isFunction(arg) {
  return typeof arg === 'function';
}

function isNumber(arg) {
  return typeof arg === 'number';
}

function isObject(arg) {
  return typeof arg === 'object' && arg !== null;
}

function isUndefined(arg) {
  return arg === void 0;
}

},{}],13:[function(require,module,exports){
if (typeof Object.create === 'function') {
  // implementation from standard node.js 'util' module
  module.exports = function inherits(ctor, superCtor) {
    ctor.super_ = superCtor
    ctor.prototype = Object.create(superCtor.prototype, {
      constructor: {
        value: ctor,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
  };
} else {
  // old school shim for old browsers
  module.exports = function inherits(ctor, superCtor) {
    ctor.super_ = superCtor
    var TempCtor = function () {}
    TempCtor.prototype = superCtor.prototype
    ctor.prototype = new TempCtor()
    ctor.prototype.constructor = ctor
  }
}

},{}],14:[function(require,module,exports){
/**
 * Determine if an object is Buffer
 *
 * Author:   Feross Aboukhadijeh <feross@feross.org> <http://feross.org>
 * License:  MIT
 *
 * `npm install is-buffer`
 */

module.exports = function (obj) {
  return !!(obj != null &&
    (obj._isBuffer || // For Safari 5-7 (missing Object.prototype.constructor)
      (obj.constructor &&
      typeof obj.constructor.isBuffer === 'function' &&
      obj.constructor.isBuffer(obj))
    ))
}

},{}],15:[function(require,module,exports){
module.exports = Array.isArray || function (arr) {
  return Object.prototype.toString.call(arr) == '[object Array]';
};

},{}],16:[function(require,module,exports){
// shim for using process in browser

var process = module.exports = {};
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = setTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    clearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        setTimeout(drainQueue, 0);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}],17:[function(require,module,exports){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

'use strict';

// If obj.hasOwnProperty has been overridden, then calling
// obj.hasOwnProperty(prop) will break.
// See: https://github.com/joyent/node/issues/1707
function hasOwnProperty(obj, prop) {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}

module.exports = function(qs, sep, eq, options) {
  sep = sep || '&';
  eq = eq || '=';
  var obj = {};

  if (typeof qs !== 'string' || qs.length === 0) {
    return obj;
  }

  var regexp = /\+/g;
  qs = qs.split(sep);

  var maxKeys = 1000;
  if (options && typeof options.maxKeys === 'number') {
    maxKeys = options.maxKeys;
  }

  var len = qs.length;
  // maxKeys <= 0 means that we should not limit keys count
  if (maxKeys > 0 && len > maxKeys) {
    len = maxKeys;
  }

  for (var i = 0; i < len; ++i) {
    var x = qs[i].replace(regexp, '%20'),
        idx = x.indexOf(eq),
        kstr, vstr, k, v;

    if (idx >= 0) {
      kstr = x.substr(0, idx);
      vstr = x.substr(idx + 1);
    } else {
      kstr = x;
      vstr = '';
    }

    k = decodeURIComponent(kstr);
    v = decodeURIComponent(vstr);

    if (!hasOwnProperty(obj, k)) {
      obj[k] = v;
    } else if (isArray(obj[k])) {
      obj[k].push(v);
    } else {
      obj[k] = [obj[k], v];
    }
  }

  return obj;
};

var isArray = Array.isArray || function (xs) {
  return Object.prototype.toString.call(xs) === '[object Array]';
};

},{}],18:[function(require,module,exports){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

'use strict';

var stringifyPrimitive = function(v) {
  switch (typeof v) {
    case 'string':
      return v;

    case 'boolean':
      return v ? 'true' : 'false';

    case 'number':
      return isFinite(v) ? v : '';

    default:
      return '';
  }
};

module.exports = function(obj, sep, eq, name) {
  sep = sep || '&';
  eq = eq || '=';
  if (obj === null) {
    obj = undefined;
  }

  if (typeof obj === 'object') {
    return map(objectKeys(obj), function(k) {
      var ks = encodeURIComponent(stringifyPrimitive(k)) + eq;
      if (isArray(obj[k])) {
        return map(obj[k], function(v) {
          return ks + encodeURIComponent(stringifyPrimitive(v));
        }).join(sep);
      } else {
        return ks + encodeURIComponent(stringifyPrimitive(obj[k]));
      }
    }).join(sep);

  }

  if (!name) return '';
  return encodeURIComponent(stringifyPrimitive(name)) + eq +
         encodeURIComponent(stringifyPrimitive(obj));
};

var isArray = Array.isArray || function (xs) {
  return Object.prototype.toString.call(xs) === '[object Array]';
};

function map (xs, f) {
  if (xs.map) return xs.map(f);
  var res = [];
  for (var i = 0; i < xs.length; i++) {
    res.push(f(xs[i], i));
  }
  return res;
}

var objectKeys = Object.keys || function (obj) {
  var res = [];
  for (var key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) res.push(key);
  }
  return res;
};

},{}],19:[function(require,module,exports){
'use strict';

exports.decode = exports.parse = require('./decode');
exports.encode = exports.stringify = require('./encode');

},{"./decode":17,"./encode":18}],20:[function(require,module,exports){
module.exports = require("./lib/_stream_duplex.js")

},{"./lib/_stream_duplex.js":21}],21:[function(require,module,exports){
// a duplex stream is just a stream that is both readable and writable.
// Since JS doesn't have multiple prototypal inheritance, this class
// prototypally inherits from Readable, and then parasitically from
// Writable.

'use strict';

/*<replacement>*/
var objectKeys = Object.keys || function (obj) {
  var keys = [];
  for (var key in obj) keys.push(key);
  return keys;
}
/*</replacement>*/


module.exports = Duplex;

/*<replacement>*/
var processNextTick = require('process-nextick-args');
/*</replacement>*/



/*<replacement>*/
var util = require('core-util-is');
util.inherits = require('inherits');
/*</replacement>*/

var Readable = require('./_stream_readable');
var Writable = require('./_stream_writable');

util.inherits(Duplex, Readable);

var keys = objectKeys(Writable.prototype);
for (var v = 0; v < keys.length; v++) {
  var method = keys[v];
  if (!Duplex.prototype[method])
    Duplex.prototype[method] = Writable.prototype[method];
}

function Duplex(options) {
  if (!(this instanceof Duplex))
    return new Duplex(options);

  Readable.call(this, options);
  Writable.call(this, options);

  if (options && options.readable === false)
    this.readable = false;

  if (options && options.writable === false)
    this.writable = false;

  this.allowHalfOpen = true;
  if (options && options.allowHalfOpen === false)
    this.allowHalfOpen = false;

  this.once('end', onend);
}

// the no-half-open enforcer
function onend() {
  // if we allow half-open state, or if the writable side ended,
  // then we're ok.
  if (this.allowHalfOpen || this._writableState.ended)
    return;

  // no more data can be written.
  // But allow more writes to happen in this tick.
  processNextTick(onEndNT, this);
}

function onEndNT(self) {
  self.end();
}

function forEach (xs, f) {
  for (var i = 0, l = xs.length; i < l; i++) {
    f(xs[i], i);
  }
}

},{"./_stream_readable":23,"./_stream_writable":25,"core-util-is":26,"inherits":13,"process-nextick-args":27}],22:[function(require,module,exports){
// a passthrough stream.
// basically just the most minimal sort of Transform stream.
// Every written chunk gets output as-is.

'use strict';

module.exports = PassThrough;

var Transform = require('./_stream_transform');

/*<replacement>*/
var util = require('core-util-is');
util.inherits = require('inherits');
/*</replacement>*/

util.inherits(PassThrough, Transform);

function PassThrough(options) {
  if (!(this instanceof PassThrough))
    return new PassThrough(options);

  Transform.call(this, options);
}

PassThrough.prototype._transform = function(chunk, encoding, cb) {
  cb(null, chunk);
};

},{"./_stream_transform":24,"core-util-is":26,"inherits":13}],23:[function(require,module,exports){
(function (process){
'use strict';

module.exports = Readable;

/*<replacement>*/
var processNextTick = require('process-nextick-args');
/*</replacement>*/


/*<replacement>*/
var isArray = require('isarray');
/*</replacement>*/


/*<replacement>*/
var Buffer = require('buffer').Buffer;
/*</replacement>*/

Readable.ReadableState = ReadableState;

var EE = require('events');

/*<replacement>*/
var EElistenerCount = function(emitter, type) {
  return emitter.listeners(type).length;
};
/*</replacement>*/



/*<replacement>*/
var Stream;
(function (){try{
  Stream = require('st' + 'ream');
}catch(_){}finally{
  if (!Stream)
    Stream = require('events').EventEmitter;
}}())
/*</replacement>*/

var Buffer = require('buffer').Buffer;

/*<replacement>*/
var util = require('core-util-is');
util.inherits = require('inherits');
/*</replacement>*/



/*<replacement>*/
var debugUtil = require('util');
var debug;
if (debugUtil && debugUtil.debuglog) {
  debug = debugUtil.debuglog('stream');
} else {
  debug = function () {};
}
/*</replacement>*/

var StringDecoder;

util.inherits(Readable, Stream);

var Duplex;
function ReadableState(options, stream) {
  Duplex = Duplex || require('./_stream_duplex');

  options = options || {};

  // object stream flag. Used to make read(n) ignore n and to
  // make all the buffer merging and length checks go away
  this.objectMode = !!options.objectMode;

  if (stream instanceof Duplex)
    this.objectMode = this.objectMode || !!options.readableObjectMode;

  // the point at which it stops calling _read() to fill the buffer
  // Note: 0 is a valid value, means "don't call _read preemptively ever"
  var hwm = options.highWaterMark;
  var defaultHwm = this.objectMode ? 16 : 16 * 1024;
  this.highWaterMark = (hwm || hwm === 0) ? hwm : defaultHwm;

  // cast to ints.
  this.highWaterMark = ~~this.highWaterMark;

  this.buffer = [];
  this.length = 0;
  this.pipes = null;
  this.pipesCount = 0;
  this.flowing = null;
  this.ended = false;
  this.endEmitted = false;
  this.reading = false;

  // a flag to be able to tell if the onwrite cb is called immediately,
  // or on a later tick.  We set this to true at first, because any
  // actions that shouldn't happen until "later" should generally also
  // not happen before the first write call.
  this.sync = true;

  // whenever we return null, then we set a flag to say
  // that we're awaiting a 'readable' event emission.
  this.needReadable = false;
  this.emittedReadable = false;
  this.readableListening = false;

  // Crypto is kind of old and crusty.  Historically, its default string
  // encoding is 'binary' so we have to make this configurable.
  // Everything else in the universe uses 'utf8', though.
  this.defaultEncoding = options.defaultEncoding || 'utf8';

  // when piping, we only care about 'readable' events that happen
  // after read()ing all the bytes and not getting any pushback.
  this.ranOut = false;

  // the number of writers that are awaiting a drain event in .pipe()s
  this.awaitDrain = 0;

  // if true, a maybeReadMore has been scheduled
  this.readingMore = false;

  this.decoder = null;
  this.encoding = null;
  if (options.encoding) {
    if (!StringDecoder)
      StringDecoder = require('string_decoder/').StringDecoder;
    this.decoder = new StringDecoder(options.encoding);
    this.encoding = options.encoding;
  }
}

var Duplex;
function Readable(options) {
  Duplex = Duplex || require('./_stream_duplex');

  if (!(this instanceof Readable))
    return new Readable(options);

  this._readableState = new ReadableState(options, this);

  // legacy
  this.readable = true;

  if (options && typeof options.read === 'function')
    this._read = options.read;

  Stream.call(this);
}

// Manually shove something into the read() buffer.
// This returns true if the highWaterMark has not been hit yet,
// similar to how Writable.write() returns true if you should
// write() some more.
Readable.prototype.push = function(chunk, encoding) {
  var state = this._readableState;

  if (!state.objectMode && typeof chunk === 'string') {
    encoding = encoding || state.defaultEncoding;
    if (encoding !== state.encoding) {
      chunk = new Buffer(chunk, encoding);
      encoding = '';
    }
  }

  return readableAddChunk(this, state, chunk, encoding, false);
};

// Unshift should *always* be something directly out of read()
Readable.prototype.unshift = function(chunk) {
  var state = this._readableState;
  return readableAddChunk(this, state, chunk, '', true);
};

Readable.prototype.isPaused = function() {
  return this._readableState.flowing === false;
};

function readableAddChunk(stream, state, chunk, encoding, addToFront) {
  var er = chunkInvalid(state, chunk);
  if (er) {
    stream.emit('error', er);
  } else if (chunk === null) {
    state.reading = false;
    onEofChunk(stream, state);
  } else if (state.objectMode || chunk && chunk.length > 0) {
    if (state.ended && !addToFront) {
      var e = new Error('stream.push() after EOF');
      stream.emit('error', e);
    } else if (state.endEmitted && addToFront) {
      var e = new Error('stream.unshift() after end event');
      stream.emit('error', e);
    } else {
      if (state.decoder && !addToFront && !encoding)
        chunk = state.decoder.write(chunk);

      if (!addToFront)
        state.reading = false;

      // if we want the data now, just emit it.
      if (state.flowing && state.length === 0 && !state.sync) {
        stream.emit('data', chunk);
        stream.read(0);
      } else {
        // update the buffer info.
        state.length += state.objectMode ? 1 : chunk.length;
        if (addToFront)
          state.buffer.unshift(chunk);
        else
          state.buffer.push(chunk);

        if (state.needReadable)
          emitReadable(stream);
      }

      maybeReadMore(stream, state);
    }
  } else if (!addToFront) {
    state.reading = false;
  }

  return needMoreData(state);
}


// if it's past the high water mark, we can push in some more.
// Also, if we have no data yet, we can stand some
// more bytes.  This is to work around cases where hwm=0,
// such as the repl.  Also, if the push() triggered a
// readable event, and the user called read(largeNumber) such that
// needReadable was set, then we ought to push more, so that another
// 'readable' event will be triggered.
function needMoreData(state) {
  return !state.ended &&
         (state.needReadable ||
          state.length < state.highWaterMark ||
          state.length === 0);
}

// backwards compatibility.
Readable.prototype.setEncoding = function(enc) {
  if (!StringDecoder)
    StringDecoder = require('string_decoder/').StringDecoder;
  this._readableState.decoder = new StringDecoder(enc);
  this._readableState.encoding = enc;
  return this;
};

// Don't raise the hwm > 8MB
var MAX_HWM = 0x800000;
function computeNewHighWaterMark(n) {
  if (n >= MAX_HWM) {
    n = MAX_HWM;
  } else {
    // Get the next highest power of 2
    n--;
    n |= n >>> 1;
    n |= n >>> 2;
    n |= n >>> 4;
    n |= n >>> 8;
    n |= n >>> 16;
    n++;
  }
  return n;
}

function howMuchToRead(n, state) {
  if (state.length === 0 && state.ended)
    return 0;

  if (state.objectMode)
    return n === 0 ? 0 : 1;

  if (n === null || isNaN(n)) {
    // only flow one buffer at a time
    if (state.flowing && state.buffer.length)
      return state.buffer[0].length;
    else
      return state.length;
  }

  if (n <= 0)
    return 0;

  // If we're asking for more than the target buffer level,
  // then raise the water mark.  Bump up to the next highest
  // power of 2, to prevent increasing it excessively in tiny
  // amounts.
  if (n > state.highWaterMark)
    state.highWaterMark = computeNewHighWaterMark(n);

  // don't have that much.  return null, unless we've ended.
  if (n > state.length) {
    if (!state.ended) {
      state.needReadable = true;
      return 0;
    } else {
      return state.length;
    }
  }

  return n;
}

// you can override either this method, or the async _read(n) below.
Readable.prototype.read = function(n) {
  debug('read', n);
  var state = this._readableState;
  var nOrig = n;

  if (typeof n !== 'number' || n > 0)
    state.emittedReadable = false;

  // if we're doing read(0) to trigger a readable event, but we
  // already have a bunch of data in the buffer, then just trigger
  // the 'readable' event and move on.
  if (n === 0 &&
      state.needReadable &&
      (state.length >= state.highWaterMark || state.ended)) {
    debug('read: emitReadable', state.length, state.ended);
    if (state.length === 0 && state.ended)
      endReadable(this);
    else
      emitReadable(this);
    return null;
  }

  n = howMuchToRead(n, state);

  // if we've ended, and we're now clear, then finish it up.
  if (n === 0 && state.ended) {
    if (state.length === 0)
      endReadable(this);
    return null;
  }

  // All the actual chunk generation logic needs to be
  // *below* the call to _read.  The reason is that in certain
  // synthetic stream cases, such as passthrough streams, _read
  // may be a completely synchronous operation which may change
  // the state of the read buffer, providing enough data when
  // before there was *not* enough.
  //
  // So, the steps are:
  // 1. Figure out what the state of things will be after we do
  // a read from the buffer.
  //
  // 2. If that resulting state will trigger a _read, then call _read.
  // Note that this may be asynchronous, or synchronous.  Yes, it is
  // deeply ugly to write APIs this way, but that still doesn't mean
  // that the Readable class should behave improperly, as streams are
  // designed to be sync/async agnostic.
  // Take note if the _read call is sync or async (ie, if the read call
  // has returned yet), so that we know whether or not it's safe to emit
  // 'readable' etc.
  //
  // 3. Actually pull the requested chunks out of the buffer and return.

  // if we need a readable event, then we need to do some reading.
  var doRead = state.needReadable;
  debug('need readable', doRead);

  // if we currently have less than the highWaterMark, then also read some
  if (state.length === 0 || state.length - n < state.highWaterMark) {
    doRead = true;
    debug('length less than watermark', doRead);
  }

  // however, if we've ended, then there's no point, and if we're already
  // reading, then it's unnecessary.
  if (state.ended || state.reading) {
    doRead = false;
    debug('reading or ended', doRead);
  }

  if (doRead) {
    debug('do read');
    state.reading = true;
    state.sync = true;
    // if the length is currently zero, then we *need* a readable event.
    if (state.length === 0)
      state.needReadable = true;
    // call internal read method
    this._read(state.highWaterMark);
    state.sync = false;
  }

  // If _read pushed data synchronously, then `reading` will be false,
  // and we need to re-evaluate how much data we can return to the user.
  if (doRead && !state.reading)
    n = howMuchToRead(nOrig, state);

  var ret;
  if (n > 0)
    ret = fromList(n, state);
  else
    ret = null;

  if (ret === null) {
    state.needReadable = true;
    n = 0;
  }

  state.length -= n;

  // If we have nothing in the buffer, then we want to know
  // as soon as we *do* get something into the buffer.
  if (state.length === 0 && !state.ended)
    state.needReadable = true;

  // If we tried to read() past the EOF, then emit end on the next tick.
  if (nOrig !== n && state.ended && state.length === 0)
    endReadable(this);

  if (ret !== null)
    this.emit('data', ret);

  return ret;
};

function chunkInvalid(state, chunk) {
  var er = null;
  if (!(Buffer.isBuffer(chunk)) &&
      typeof chunk !== 'string' &&
      chunk !== null &&
      chunk !== undefined &&
      !state.objectMode) {
    er = new TypeError('Invalid non-string/buffer chunk');
  }
  return er;
}


function onEofChunk(stream, state) {
  if (state.ended) return;
  if (state.decoder) {
    var chunk = state.decoder.end();
    if (chunk && chunk.length) {
      state.buffer.push(chunk);
      state.length += state.objectMode ? 1 : chunk.length;
    }
  }
  state.ended = true;

  // emit 'readable' now to make sure it gets picked up.
  emitReadable(stream);
}

// Don't emit readable right away in sync mode, because this can trigger
// another read() call => stack overflow.  This way, it might trigger
// a nextTick recursion warning, but that's not so bad.
function emitReadable(stream) {
  var state = stream._readableState;
  state.needReadable = false;
  if (!state.emittedReadable) {
    debug('emitReadable', state.flowing);
    state.emittedReadable = true;
    if (state.sync)
      processNextTick(emitReadable_, stream);
    else
      emitReadable_(stream);
  }
}

function emitReadable_(stream) {
  debug('emit readable');
  stream.emit('readable');
  flow(stream);
}


// at this point, the user has presumably seen the 'readable' event,
// and called read() to consume some data.  that may have triggered
// in turn another _read(n) call, in which case reading = true if
// it's in progress.
// However, if we're not ended, or reading, and the length < hwm,
// then go ahead and try to read some more preemptively.
function maybeReadMore(stream, state) {
  if (!state.readingMore) {
    state.readingMore = true;
    processNextTick(maybeReadMore_, stream, state);
  }
}

function maybeReadMore_(stream, state) {
  var len = state.length;
  while (!state.reading && !state.flowing && !state.ended &&
         state.length < state.highWaterMark) {
    debug('maybeReadMore read 0');
    stream.read(0);
    if (len === state.length)
      // didn't get any data, stop spinning.
      break;
    else
      len = state.length;
  }
  state.readingMore = false;
}

// abstract method.  to be overridden in specific implementation classes.
// call cb(er, data) where data is <= n in length.
// for virtual (non-string, non-buffer) streams, "length" is somewhat
// arbitrary, and perhaps not very meaningful.
Readable.prototype._read = function(n) {
  this.emit('error', new Error('not implemented'));
};

Readable.prototype.pipe = function(dest, pipeOpts) {
  var src = this;
  var state = this._readableState;

  switch (state.pipesCount) {
    case 0:
      state.pipes = dest;
      break;
    case 1:
      state.pipes = [state.pipes, dest];
      break;
    default:
      state.pipes.push(dest);
      break;
  }
  state.pipesCount += 1;
  debug('pipe count=%d opts=%j', state.pipesCount, pipeOpts);

  var doEnd = (!pipeOpts || pipeOpts.end !== false) &&
              dest !== process.stdout &&
              dest !== process.stderr;

  var endFn = doEnd ? onend : cleanup;
  if (state.endEmitted)
    processNextTick(endFn);
  else
    src.once('end', endFn);

  dest.on('unpipe', onunpipe);
  function onunpipe(readable) {
    debug('onunpipe');
    if (readable === src) {
      cleanup();
    }
  }

  function onend() {
    debug('onend');
    dest.end();
  }

  // when the dest drains, it reduces the awaitDrain counter
  // on the source.  This would be more elegant with a .once()
  // handler in flow(), but adding and removing repeatedly is
  // too slow.
  var ondrain = pipeOnDrain(src);
  dest.on('drain', ondrain);

  var cleanedUp = false;
  function cleanup() {
    debug('cleanup');
    // cleanup event handlers once the pipe is broken
    dest.removeListener('close', onclose);
    dest.removeListener('finish', onfinish);
    dest.removeListener('drain', ondrain);
    dest.removeListener('error', onerror);
    dest.removeListener('unpipe', onunpipe);
    src.removeListener('end', onend);
    src.removeListener('end', cleanup);
    src.removeListener('data', ondata);

    cleanedUp = true;

    // if the reader is waiting for a drain event from this
    // specific writer, then it would cause it to never start
    // flowing again.
    // So, if this is awaiting a drain, then we just call it now.
    // If we don't know, then assume that we are waiting for one.
    if (state.awaitDrain &&
        (!dest._writableState || dest._writableState.needDrain))
      ondrain();
  }

  src.on('data', ondata);
  function ondata(chunk) {
    debug('ondata');
    var ret = dest.write(chunk);
    if (false === ret) {
      // If the user unpiped during `dest.write()`, it is possible
      // to get stuck in a permanently paused state if that write
      // also returned false.
      if (state.pipesCount === 1 &&
          state.pipes[0] === dest &&
          src.listenerCount('data') === 1 &&
          !cleanedUp) {
        debug('false write response, pause', src._readableState.awaitDrain);
        src._readableState.awaitDrain++;
      }
      src.pause();
    }
  }

  // if the dest has an error, then stop piping into it.
  // however, don't suppress the throwing behavior for this.
  function onerror(er) {
    debug('onerror', er);
    unpipe();
    dest.removeListener('error', onerror);
    if (EElistenerCount(dest, 'error') === 0)
      dest.emit('error', er);
  }
  // This is a brutally ugly hack to make sure that our error handler
  // is attached before any userland ones.  NEVER DO THIS.
  if (!dest._events || !dest._events.error)
    dest.on('error', onerror);
  else if (isArray(dest._events.error))
    dest._events.error.unshift(onerror);
  else
    dest._events.error = [onerror, dest._events.error];


  // Both close and finish should trigger unpipe, but only once.
  function onclose() {
    dest.removeListener('finish', onfinish);
    unpipe();
  }
  dest.once('close', onclose);
  function onfinish() {
    debug('onfinish');
    dest.removeListener('close', onclose);
    unpipe();
  }
  dest.once('finish', onfinish);

  function unpipe() {
    debug('unpipe');
    src.unpipe(dest);
  }

  // tell the dest that it's being piped to
  dest.emit('pipe', src);

  // start the flow if it hasn't been started already.
  if (!state.flowing) {
    debug('pipe resume');
    src.resume();
  }

  return dest;
};

function pipeOnDrain(src) {
  return function() {
    var state = src._readableState;
    debug('pipeOnDrain', state.awaitDrain);
    if (state.awaitDrain)
      state.awaitDrain--;
    if (state.awaitDrain === 0 && EElistenerCount(src, 'data')) {
      state.flowing = true;
      flow(src);
    }
  };
}


Readable.prototype.unpipe = function(dest) {
  var state = this._readableState;

  // if we're not piping anywhere, then do nothing.
  if (state.pipesCount === 0)
    return this;

  // just one destination.  most common case.
  if (state.pipesCount === 1) {
    // passed in one, but it's not the right one.
    if (dest && dest !== state.pipes)
      return this;

    if (!dest)
      dest = state.pipes;

    // got a match.
    state.pipes = null;
    state.pipesCount = 0;
    state.flowing = false;
    if (dest)
      dest.emit('unpipe', this);
    return this;
  }

  // slow case. multiple pipe destinations.

  if (!dest) {
    // remove all.
    var dests = state.pipes;
    var len = state.pipesCount;
    state.pipes = null;
    state.pipesCount = 0;
    state.flowing = false;

    for (var i = 0; i < len; i++)
      dests[i].emit('unpipe', this);
    return this;
  }

  // try to find the right one.
  var i = indexOf(state.pipes, dest);
  if (i === -1)
    return this;

  state.pipes.splice(i, 1);
  state.pipesCount -= 1;
  if (state.pipesCount === 1)
    state.pipes = state.pipes[0];

  dest.emit('unpipe', this);

  return this;
};

// set up data events if they are asked for
// Ensure readable listeners eventually get something
Readable.prototype.on = function(ev, fn) {
  var res = Stream.prototype.on.call(this, ev, fn);

  // If listening to data, and it has not explicitly been paused,
  // then call resume to start the flow of data on the next tick.
  if (ev === 'data' && false !== this._readableState.flowing) {
    this.resume();
  }

  if (ev === 'readable' && this.readable) {
    var state = this._readableState;
    if (!state.readableListening) {
      state.readableListening = true;
      state.emittedReadable = false;
      state.needReadable = true;
      if (!state.reading) {
        processNextTick(nReadingNextTick, this);
      } else if (state.length) {
        emitReadable(this, state);
      }
    }
  }

  return res;
};
Readable.prototype.addListener = Readable.prototype.on;

function nReadingNextTick(self) {
  debug('readable nexttick read 0');
  self.read(0);
}

// pause() and resume() are remnants of the legacy readable stream API
// If the user uses them, then switch into old mode.
Readable.prototype.resume = function() {
  var state = this._readableState;
  if (!state.flowing) {
    debug('resume');
    state.flowing = true;
    resume(this, state);
  }
  return this;
};

function resume(stream, state) {
  if (!state.resumeScheduled) {
    state.resumeScheduled = true;
    processNextTick(resume_, stream, state);
  }
}

function resume_(stream, state) {
  if (!state.reading) {
    debug('resume read 0');
    stream.read(0);
  }

  state.resumeScheduled = false;
  stream.emit('resume');
  flow(stream);
  if (state.flowing && !state.reading)
    stream.read(0);
}

Readable.prototype.pause = function() {
  debug('call pause flowing=%j', this._readableState.flowing);
  if (false !== this._readableState.flowing) {
    debug('pause');
    this._readableState.flowing = false;
    this.emit('pause');
  }
  return this;
};

function flow(stream) {
  var state = stream._readableState;
  debug('flow', state.flowing);
  if (state.flowing) {
    do {
      var chunk = stream.read();
    } while (null !== chunk && state.flowing);
  }
}

// wrap an old-style stream as the async data source.
// This is *not* part of the readable stream interface.
// It is an ugly unfortunate mess of history.
Readable.prototype.wrap = function(stream) {
  var state = this._readableState;
  var paused = false;

  var self = this;
  stream.on('end', function() {
    debug('wrapped end');
    if (state.decoder && !state.ended) {
      var chunk = state.decoder.end();
      if (chunk && chunk.length)
        self.push(chunk);
    }

    self.push(null);
  });

  stream.on('data', function(chunk) {
    debug('wrapped data');
    if (state.decoder)
      chunk = state.decoder.write(chunk);

    // don't skip over falsy values in objectMode
    if (state.objectMode && (chunk === null || chunk === undefined))
      return;
    else if (!state.objectMode && (!chunk || !chunk.length))
      return;

    var ret = self.push(chunk);
    if (!ret) {
      paused = true;
      stream.pause();
    }
  });

  // proxy all the other methods.
  // important when wrapping filters and duplexes.
  for (var i in stream) {
    if (this[i] === undefined && typeof stream[i] === 'function') {
      this[i] = function(method) { return function() {
        return stream[method].apply(stream, arguments);
      }; }(i);
    }
  }

  // proxy certain important events.
  var events = ['error', 'close', 'destroy', 'pause', 'resume'];
  forEach(events, function(ev) {
    stream.on(ev, self.emit.bind(self, ev));
  });

  // when we try to consume some more bytes, simply unpause the
  // underlying stream.
  self._read = function(n) {
    debug('wrapped _read', n);
    if (paused) {
      paused = false;
      stream.resume();
    }
  };

  return self;
};


// exposed for testing purposes only.
Readable._fromList = fromList;

// Pluck off n bytes from an array of buffers.
// Length is the combined lengths of all the buffers in the list.
function fromList(n, state) {
  var list = state.buffer;
  var length = state.length;
  var stringMode = !!state.decoder;
  var objectMode = !!state.objectMode;
  var ret;

  // nothing in the list, definitely empty.
  if (list.length === 0)
    return null;

  if (length === 0)
    ret = null;
  else if (objectMode)
    ret = list.shift();
  else if (!n || n >= length) {
    // read it all, truncate the array.
    if (stringMode)
      ret = list.join('');
    else if (list.length === 1)
      ret = list[0];
    else
      ret = Buffer.concat(list, length);
    list.length = 0;
  } else {
    // read just some of it.
    if (n < list[0].length) {
      // just take a part of the first list item.
      // slice is the same for buffers and strings.
      var buf = list[0];
      ret = buf.slice(0, n);
      list[0] = buf.slice(n);
    } else if (n === list[0].length) {
      // first list is a perfect match
      ret = list.shift();
    } else {
      // complex case.
      // we have enough to cover it, but it spans past the first buffer.
      if (stringMode)
        ret = '';
      else
        ret = new Buffer(n);

      var c = 0;
      for (var i = 0, l = list.length; i < l && c < n; i++) {
        var buf = list[0];
        var cpy = Math.min(n - c, buf.length);

        if (stringMode)
          ret += buf.slice(0, cpy);
        else
          buf.copy(ret, c, 0, cpy);

        if (cpy < buf.length)
          list[0] = buf.slice(cpy);
        else
          list.shift();

        c += cpy;
      }
    }
  }

  return ret;
}

function endReadable(stream) {
  var state = stream._readableState;

  // If we get here before consuming all the bytes, then that is a
  // bug in node.  Should never happen.
  if (state.length > 0)
    throw new Error('endReadable called on non-empty stream');

  if (!state.endEmitted) {
    state.ended = true;
    processNextTick(endReadableNT, state, stream);
  }
}

function endReadableNT(state, stream) {
  // Check that we didn't get one last unshift.
  if (!state.endEmitted && state.length === 0) {
    state.endEmitted = true;
    stream.readable = false;
    stream.emit('end');
  }
}

function forEach (xs, f) {
  for (var i = 0, l = xs.length; i < l; i++) {
    f(xs[i], i);
  }
}

function indexOf (xs, x) {
  for (var i = 0, l = xs.length; i < l; i++) {
    if (xs[i] === x) return i;
  }
  return -1;
}

}).call(this,require('_process'))

},{"./_stream_duplex":21,"_process":16,"buffer":8,"core-util-is":26,"events":12,"inherits":13,"isarray":15,"process-nextick-args":27,"string_decoder/":34,"util":7}],24:[function(require,module,exports){
// a transform stream is a readable/writable stream where you do
// something with the data.  Sometimes it's called a "filter",
// but that's not a great name for it, since that implies a thing where
// some bits pass through, and others are simply ignored.  (That would
// be a valid example of a transform, of course.)
//
// While the output is causally related to the input, it's not a
// necessarily symmetric or synchronous transformation.  For example,
// a zlib stream might take multiple plain-text writes(), and then
// emit a single compressed chunk some time in the future.
//
// Here's how this works:
//
// The Transform stream has all the aspects of the readable and writable
// stream classes.  When you write(chunk), that calls _write(chunk,cb)
// internally, and returns false if there's a lot of pending writes
// buffered up.  When you call read(), that calls _read(n) until
// there's enough pending readable data buffered up.
//
// In a transform stream, the written data is placed in a buffer.  When
// _read(n) is called, it transforms the queued up data, calling the
// buffered _write cb's as it consumes chunks.  If consuming a single
// written chunk would result in multiple output chunks, then the first
// outputted bit calls the readcb, and subsequent chunks just go into
// the read buffer, and will cause it to emit 'readable' if necessary.
//
// This way, back-pressure is actually determined by the reading side,
// since _read has to be called to start processing a new chunk.  However,
// a pathological inflate type of transform can cause excessive buffering
// here.  For example, imagine a stream where every byte of input is
// interpreted as an integer from 0-255, and then results in that many
// bytes of output.  Writing the 4 bytes {ff,ff,ff,ff} would result in
// 1kb of data being output.  In this case, you could write a very small
// amount of input, and end up with a very large amount of output.  In
// such a pathological inflating mechanism, there'd be no way to tell
// the system to stop doing the transform.  A single 4MB write could
// cause the system to run out of memory.
//
// However, even in such a pathological case, only a single written chunk
// would be consumed, and then the rest would wait (un-transformed) until
// the results of the previous transformed chunk were consumed.

'use strict';

module.exports = Transform;

var Duplex = require('./_stream_duplex');

/*<replacement>*/
var util = require('core-util-is');
util.inherits = require('inherits');
/*</replacement>*/

util.inherits(Transform, Duplex);


function TransformState(stream) {
  this.afterTransform = function(er, data) {
    return afterTransform(stream, er, data);
  };

  this.needTransform = false;
  this.transforming = false;
  this.writecb = null;
  this.writechunk = null;
}

function afterTransform(stream, er, data) {
  var ts = stream._transformState;
  ts.transforming = false;

  var cb = ts.writecb;

  if (!cb)
    return stream.emit('error', new Error('no writecb in Transform class'));

  ts.writechunk = null;
  ts.writecb = null;

  if (data !== null && data !== undefined)
    stream.push(data);

  if (cb)
    cb(er);

  var rs = stream._readableState;
  rs.reading = false;
  if (rs.needReadable || rs.length < rs.highWaterMark) {
    stream._read(rs.highWaterMark);
  }
}


function Transform(options) {
  if (!(this instanceof Transform))
    return new Transform(options);

  Duplex.call(this, options);

  this._transformState = new TransformState(this);

  // when the writable side finishes, then flush out anything remaining.
  var stream = this;

  // start out asking for a readable event once data is transformed.
  this._readableState.needReadable = true;

  // we have implemented the _read method, and done the other things
  // that Readable wants before the first _read call, so unset the
  // sync guard flag.
  this._readableState.sync = false;

  if (options) {
    if (typeof options.transform === 'function')
      this._transform = options.transform;

    if (typeof options.flush === 'function')
      this._flush = options.flush;
  }

  this.once('prefinish', function() {
    if (typeof this._flush === 'function')
      this._flush(function(er) {
        done(stream, er);
      });
    else
      done(stream);
  });
}

Transform.prototype.push = function(chunk, encoding) {
  this._transformState.needTransform = false;
  return Duplex.prototype.push.call(this, chunk, encoding);
};

// This is the part where you do stuff!
// override this function in implementation classes.
// 'chunk' is an input chunk.
//
// Call `push(newChunk)` to pass along transformed output
// to the readable side.  You may call 'push' zero or more times.
//
// Call `cb(err)` when you are done with this chunk.  If you pass
// an error, then that'll put the hurt on the whole operation.  If you
// never call cb(), then you'll never get another chunk.
Transform.prototype._transform = function(chunk, encoding, cb) {
  throw new Error('not implemented');
};

Transform.prototype._write = function(chunk, encoding, cb) {
  var ts = this._transformState;
  ts.writecb = cb;
  ts.writechunk = chunk;
  ts.writeencoding = encoding;
  if (!ts.transforming) {
    var rs = this._readableState;
    if (ts.needTransform ||
        rs.needReadable ||
        rs.length < rs.highWaterMark)
      this._read(rs.highWaterMark);
  }
};

// Doesn't matter what the args are here.
// _transform does all the work.
// That we got here means that the readable side wants more data.
Transform.prototype._read = function(n) {
  var ts = this._transformState;

  if (ts.writechunk !== null && ts.writecb && !ts.transforming) {
    ts.transforming = true;
    this._transform(ts.writechunk, ts.writeencoding, ts.afterTransform);
  } else {
    // mark that we need a transform, so that any data that comes in
    // will get processed, now that we've asked for it.
    ts.needTransform = true;
  }
};


function done(stream, er) {
  if (er)
    return stream.emit('error', er);

  // if there's nothing in the write buffer, then that means
  // that nothing more will ever be provided
  var ws = stream._writableState;
  var ts = stream._transformState;

  if (ws.length)
    throw new Error('calling transform done when ws.length != 0');

  if (ts.transforming)
    throw new Error('calling transform done when still transforming');

  return stream.push(null);
}

},{"./_stream_duplex":21,"core-util-is":26,"inherits":13}],25:[function(require,module,exports){
// A bit simpler than readable streams.
// Implement an async ._write(chunk, encoding, cb), and it'll handle all
// the drain event emission and buffering.

'use strict';

module.exports = Writable;

/*<replacement>*/
var processNextTick = require('process-nextick-args');
/*</replacement>*/


/*<replacement>*/
var Buffer = require('buffer').Buffer;
/*</replacement>*/

Writable.WritableState = WritableState;


/*<replacement>*/
var util = require('core-util-is');
util.inherits = require('inherits');
/*</replacement>*/


/*<replacement>*/
var internalUtil = {
  deprecate: require('util-deprecate')
};
/*</replacement>*/



/*<replacement>*/
var Stream;
(function (){try{
  Stream = require('st' + 'ream');
}catch(_){}finally{
  if (!Stream)
    Stream = require('events').EventEmitter;
}}())
/*</replacement>*/

var Buffer = require('buffer').Buffer;

util.inherits(Writable, Stream);

function nop() {}

function WriteReq(chunk, encoding, cb) {
  this.chunk = chunk;
  this.encoding = encoding;
  this.callback = cb;
  this.next = null;
}

var Duplex;
function WritableState(options, stream) {
  Duplex = Duplex || require('./_stream_duplex');

  options = options || {};

  // object stream flag to indicate whether or not this stream
  // contains buffers or objects.
  this.objectMode = !!options.objectMode;

  if (stream instanceof Duplex)
    this.objectMode = this.objectMode || !!options.writableObjectMode;

  // the point at which write() starts returning false
  // Note: 0 is a valid value, means that we always return false if
  // the entire buffer is not flushed immediately on write()
  var hwm = options.highWaterMark;
  var defaultHwm = this.objectMode ? 16 : 16 * 1024;
  this.highWaterMark = (hwm || hwm === 0) ? hwm : defaultHwm;

  // cast to ints.
  this.highWaterMark = ~~this.highWaterMark;

  this.needDrain = false;
  // at the start of calling end()
  this.ending = false;
  // when end() has been called, and returned
  this.ended = false;
  // when 'finish' is emitted
  this.finished = false;

  // should we decode strings into buffers before passing to _write?
  // this is here so that some node-core streams can optimize string
  // handling at a lower level.
  var noDecode = options.decodeStrings === false;
  this.decodeStrings = !noDecode;

  // Crypto is kind of old and crusty.  Historically, its default string
  // encoding is 'binary' so we have to make this configurable.
  // Everything else in the universe uses 'utf8', though.
  this.defaultEncoding = options.defaultEncoding || 'utf8';

  // not an actual buffer we keep track of, but a measurement
  // of how much we're waiting to get pushed to some underlying
  // socket or file.
  this.length = 0;

  // a flag to see when we're in the middle of a write.
  this.writing = false;

  // when true all writes will be buffered until .uncork() call
  this.corked = 0;

  // a flag to be able to tell if the onwrite cb is called immediately,
  // or on a later tick.  We set this to true at first, because any
  // actions that shouldn't happen until "later" should generally also
  // not happen before the first write call.
  this.sync = true;

  // a flag to know if we're processing previously buffered items, which
  // may call the _write() callback in the same tick, so that we don't
  // end up in an overlapped onwrite situation.
  this.bufferProcessing = false;

  // the callback that's passed to _write(chunk,cb)
  this.onwrite = function(er) {
    onwrite(stream, er);
  };

  // the callback that the user supplies to write(chunk,encoding,cb)
  this.writecb = null;

  // the amount that is being written when _write is called.
  this.writelen = 0;

  this.bufferedRequest = null;
  this.lastBufferedRequest = null;

  // number of pending user-supplied write callbacks
  // this must be 0 before 'finish' can be emitted
  this.pendingcb = 0;

  // emit prefinish if the only thing we're waiting for is _write cbs
  // This is relevant for synchronous Transform streams
  this.prefinished = false;

  // True if the error was already emitted and should not be thrown again
  this.errorEmitted = false;
}

WritableState.prototype.getBuffer = function writableStateGetBuffer() {
  var current = this.bufferedRequest;
  var out = [];
  while (current) {
    out.push(current);
    current = current.next;
  }
  return out;
};

(function (){try {
Object.defineProperty(WritableState.prototype, 'buffer', {
  get: internalUtil.deprecate(function() {
    return this.getBuffer();
  }, '_writableState.buffer is deprecated. Use _writableState.getBuffer ' +
     'instead.')
});
}catch(_){}}());


var Duplex;
function Writable(options) {
  Duplex = Duplex || require('./_stream_duplex');

  // Writable ctor is applied to Duplexes, though they're not
  // instanceof Writable, they're instanceof Readable.
  if (!(this instanceof Writable) && !(this instanceof Duplex))
    return new Writable(options);

  this._writableState = new WritableState(options, this);

  // legacy.
  this.writable = true;

  if (options) {
    if (typeof options.write === 'function')
      this._write = options.write;

    if (typeof options.writev === 'function')
      this._writev = options.writev;
  }

  Stream.call(this);
}

// Otherwise people can pipe Writable streams, which is just wrong.
Writable.prototype.pipe = function() {
  this.emit('error', new Error('Cannot pipe. Not readable.'));
};


function writeAfterEnd(stream, cb) {
  var er = new Error('write after end');
  // TODO: defer error events consistently everywhere, not just the cb
  stream.emit('error', er);
  processNextTick(cb, er);
}

// If we get something that is not a buffer, string, null, or undefined,
// and we're not in objectMode, then that's an error.
// Otherwise stream chunks are all considered to be of length=1, and the
// watermarks determine how many objects to keep in the buffer, rather than
// how many bytes or characters.
function validChunk(stream, state, chunk, cb) {
  var valid = true;

  if (!(Buffer.isBuffer(chunk)) &&
      typeof chunk !== 'string' &&
      chunk !== null &&
      chunk !== undefined &&
      !state.objectMode) {
    var er = new TypeError('Invalid non-string/buffer chunk');
    stream.emit('error', er);
    processNextTick(cb, er);
    valid = false;
  }
  return valid;
}

Writable.prototype.write = function(chunk, encoding, cb) {
  var state = this._writableState;
  var ret = false;

  if (typeof encoding === 'function') {
    cb = encoding;
    encoding = null;
  }

  if (Buffer.isBuffer(chunk))
    encoding = 'buffer';
  else if (!encoding)
    encoding = state.defaultEncoding;

  if (typeof cb !== 'function')
    cb = nop;

  if (state.ended)
    writeAfterEnd(this, cb);
  else if (validChunk(this, state, chunk, cb)) {
    state.pendingcb++;
    ret = writeOrBuffer(this, state, chunk, encoding, cb);
  }

  return ret;
};

Writable.prototype.cork = function() {
  var state = this._writableState;

  state.corked++;
};

Writable.prototype.uncork = function() {
  var state = this._writableState;

  if (state.corked) {
    state.corked--;

    if (!state.writing &&
        !state.corked &&
        !state.finished &&
        !state.bufferProcessing &&
        state.bufferedRequest)
      clearBuffer(this, state);
  }
};

Writable.prototype.setDefaultEncoding = function setDefaultEncoding(encoding) {
  // node::ParseEncoding() requires lower case.
  if (typeof encoding === 'string')
    encoding = encoding.toLowerCase();
  if (!(['hex', 'utf8', 'utf-8', 'ascii', 'binary', 'base64',
'ucs2', 'ucs-2','utf16le', 'utf-16le', 'raw']
.indexOf((encoding + '').toLowerCase()) > -1))
    throw new TypeError('Unknown encoding: ' + encoding);
  this._writableState.defaultEncoding = encoding;
};

function decodeChunk(state, chunk, encoding) {
  if (!state.objectMode &&
      state.decodeStrings !== false &&
      typeof chunk === 'string') {
    chunk = new Buffer(chunk, encoding);
  }
  return chunk;
}

// if we're already writing something, then just put this
// in the queue, and wait our turn.  Otherwise, call _write
// If we return false, then we need a drain event, so set that flag.
function writeOrBuffer(stream, state, chunk, encoding, cb) {
  chunk = decodeChunk(state, chunk, encoding);

  if (Buffer.isBuffer(chunk))
    encoding = 'buffer';
  var len = state.objectMode ? 1 : chunk.length;

  state.length += len;

  var ret = state.length < state.highWaterMark;
  // we must ensure that previous needDrain will not be reset to false.
  if (!ret)
    state.needDrain = true;

  if (state.writing || state.corked) {
    var last = state.lastBufferedRequest;
    state.lastBufferedRequest = new WriteReq(chunk, encoding, cb);
    if (last) {
      last.next = state.lastBufferedRequest;
    } else {
      state.bufferedRequest = state.lastBufferedRequest;
    }
  } else {
    doWrite(stream, state, false, len, chunk, encoding, cb);
  }

  return ret;
}

function doWrite(stream, state, writev, len, chunk, encoding, cb) {
  state.writelen = len;
  state.writecb = cb;
  state.writing = true;
  state.sync = true;
  if (writev)
    stream._writev(chunk, state.onwrite);
  else
    stream._write(chunk, encoding, state.onwrite);
  state.sync = false;
}

function onwriteError(stream, state, sync, er, cb) {
  --state.pendingcb;
  if (sync)
    processNextTick(cb, er);
  else
    cb(er);

  stream._writableState.errorEmitted = true;
  stream.emit('error', er);
}

function onwriteStateUpdate(state) {
  state.writing = false;
  state.writecb = null;
  state.length -= state.writelen;
  state.writelen = 0;
}

function onwrite(stream, er) {
  var state = stream._writableState;
  var sync = state.sync;
  var cb = state.writecb;

  onwriteStateUpdate(state);

  if (er)
    onwriteError(stream, state, sync, er, cb);
  else {
    // Check if we're actually ready to finish, but don't emit yet
    var finished = needFinish(state);

    if (!finished &&
        !state.corked &&
        !state.bufferProcessing &&
        state.bufferedRequest) {
      clearBuffer(stream, state);
    }

    if (sync) {
      processNextTick(afterWrite, stream, state, finished, cb);
    } else {
      afterWrite(stream, state, finished, cb);
    }
  }
}

function afterWrite(stream, state, finished, cb) {
  if (!finished)
    onwriteDrain(stream, state);
  state.pendingcb--;
  cb();
  finishMaybe(stream, state);
}

// Must force callback to be called on nextTick, so that we don't
// emit 'drain' before the write() consumer gets the 'false' return
// value, and has a chance to attach a 'drain' listener.
function onwriteDrain(stream, state) {
  if (state.length === 0 && state.needDrain) {
    state.needDrain = false;
    stream.emit('drain');
  }
}


// if there's something in the buffer waiting, then process it
function clearBuffer(stream, state) {
  state.bufferProcessing = true;
  var entry = state.bufferedRequest;

  if (stream._writev && entry && entry.next) {
    // Fast case, write everything using _writev()
    var buffer = [];
    var cbs = [];
    while (entry) {
      cbs.push(entry.callback);
      buffer.push(entry);
      entry = entry.next;
    }

    // count the one we are adding, as well.
    // TODO(isaacs) clean this up
    state.pendingcb++;
    state.lastBufferedRequest = null;
    doWrite(stream, state, true, state.length, buffer, '', function(err) {
      for (var i = 0; i < cbs.length; i++) {
        state.pendingcb--;
        cbs[i](err);
      }
    });

    // Clear buffer
  } else {
    // Slow case, write chunks one-by-one
    while (entry) {
      var chunk = entry.chunk;
      var encoding = entry.encoding;
      var cb = entry.callback;
      var len = state.objectMode ? 1 : chunk.length;

      doWrite(stream, state, false, len, chunk, encoding, cb);
      entry = entry.next;
      // if we didn't call the onwrite immediately, then
      // it means that we need to wait until it does.
      // also, that means that the chunk and cb are currently
      // being processed, so move the buffer counter past them.
      if (state.writing) {
        break;
      }
    }

    if (entry === null)
      state.lastBufferedRequest = null;
  }
  state.bufferedRequest = entry;
  state.bufferProcessing = false;
}

Writable.prototype._write = function(chunk, encoding, cb) {
  cb(new Error('not implemented'));
};

Writable.prototype._writev = null;

Writable.prototype.end = function(chunk, encoding, cb) {
  var state = this._writableState;

  if (typeof chunk === 'function') {
    cb = chunk;
    chunk = null;
    encoding = null;
  } else if (typeof encoding === 'function') {
    cb = encoding;
    encoding = null;
  }

  if (chunk !== null && chunk !== undefined)
    this.write(chunk, encoding);

  // .end() fully uncorks
  if (state.corked) {
    state.corked = 1;
    this.uncork();
  }

  // ignore unnecessary end() calls.
  if (!state.ending && !state.finished)
    endWritable(this, state, cb);
};


function needFinish(state) {
  return (state.ending &&
          state.length === 0 &&
          state.bufferedRequest === null &&
          !state.finished &&
          !state.writing);
}

function prefinish(stream, state) {
  if (!state.prefinished) {
    state.prefinished = true;
    stream.emit('prefinish');
  }
}

function finishMaybe(stream, state) {
  var need = needFinish(state);
  if (need) {
    if (state.pendingcb === 0) {
      prefinish(stream, state);
      state.finished = true;
      stream.emit('finish');
    } else {
      prefinish(stream, state);
    }
  }
  return need;
}

function endWritable(stream, state, cb) {
  state.ending = true;
  finishMaybe(stream, state);
  if (cb) {
    if (state.finished)
      processNextTick(cb);
    else
      stream.once('finish', cb);
  }
  state.ended = true;
}

},{"./_stream_duplex":21,"buffer":8,"core-util-is":26,"events":12,"inherits":13,"process-nextick-args":27,"util-deprecate":28}],26:[function(require,module,exports){
(function (Buffer){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

// NOTE: These type checking functions intentionally don't use `instanceof`
// because it is fragile and can be easily faked with `Object.create()`.

function isArray(arg) {
  if (Array.isArray) {
    return Array.isArray(arg);
  }
  return objectToString(arg) === '[object Array]';
}
exports.isArray = isArray;

function isBoolean(arg) {
  return typeof arg === 'boolean';
}
exports.isBoolean = isBoolean;

function isNull(arg) {
  return arg === null;
}
exports.isNull = isNull;

function isNullOrUndefined(arg) {
  return arg == null;
}
exports.isNullOrUndefined = isNullOrUndefined;

function isNumber(arg) {
  return typeof arg === 'number';
}
exports.isNumber = isNumber;

function isString(arg) {
  return typeof arg === 'string';
}
exports.isString = isString;

function isSymbol(arg) {
  return typeof arg === 'symbol';
}
exports.isSymbol = isSymbol;

function isUndefined(arg) {
  return arg === void 0;
}
exports.isUndefined = isUndefined;

function isRegExp(re) {
  return objectToString(re) === '[object RegExp]';
}
exports.isRegExp = isRegExp;

function isObject(arg) {
  return typeof arg === 'object' && arg !== null;
}
exports.isObject = isObject;

function isDate(d) {
  return objectToString(d) === '[object Date]';
}
exports.isDate = isDate;

function isError(e) {
  return (objectToString(e) === '[object Error]' || e instanceof Error);
}
exports.isError = isError;

function isFunction(arg) {
  return typeof arg === 'function';
}
exports.isFunction = isFunction;

function isPrimitive(arg) {
  return arg === null ||
         typeof arg === 'boolean' ||
         typeof arg === 'number' ||
         typeof arg === 'string' ||
         typeof arg === 'symbol' ||  // ES6 symbol
         typeof arg === 'undefined';
}
exports.isPrimitive = isPrimitive;

exports.isBuffer = Buffer.isBuffer;

function objectToString(o) {
  return Object.prototype.toString.call(o);
}

}).call(this,{"isBuffer":require("../../../../insert-module-globals/node_modules/is-buffer/index.js")})

},{"../../../../insert-module-globals/node_modules/is-buffer/index.js":14}],27:[function(require,module,exports){
(function (process){
'use strict';

if (!process.version ||
    process.version.indexOf('v0.') === 0 ||
    process.version.indexOf('v1.') === 0 && process.version.indexOf('v1.8.') !== 0) {
  module.exports = nextTick;
} else {
  module.exports = process.nextTick;
}

function nextTick(fn) {
  var args = new Array(arguments.length - 1);
  var i = 0;
  while (i < args.length) {
    args[i++] = arguments[i];
  }
  process.nextTick(function afterTick() {
    fn.apply(null, args);
  });
}

}).call(this,require('_process'))

},{"_process":16}],28:[function(require,module,exports){
(function (global){

/**
 * Module exports.
 */

module.exports = deprecate;

/**
 * Mark that a method should not be used.
 * Returns a modified function which warns once by default.
 *
 * If `localStorage.noDeprecation = true` is set, then it is a no-op.
 *
 * If `localStorage.throwDeprecation = true` is set, then deprecated functions
 * will throw an Error when invoked.
 *
 * If `localStorage.traceDeprecation = true` is set, then deprecated functions
 * will invoke `console.trace()` instead of `console.error()`.
 *
 * @param {Function} fn - the function to deprecate
 * @param {String} msg - the string to print to the console when `fn` is invoked
 * @returns {Function} a new "deprecated" version of `fn`
 * @api public
 */

function deprecate (fn, msg) {
  if (config('noDeprecation')) {
    return fn;
  }

  var warned = false;
  function deprecated() {
    if (!warned) {
      if (config('throwDeprecation')) {
        throw new Error(msg);
      } else if (config('traceDeprecation')) {
        console.trace(msg);
      } else {
        console.warn(msg);
      }
      warned = true;
    }
    return fn.apply(this, arguments);
  }

  return deprecated;
}

/**
 * Checks `localStorage` for boolean values for the given `name`.
 *
 * @param {String} name
 * @returns {Boolean}
 * @api private
 */

function config (name) {
  // accessing global.localStorage can trigger a DOMException in sandboxed iframes
  try {
    if (!global.localStorage) return false;
  } catch (_) {
    return false;
  }
  var val = global.localStorage[name];
  if (null == val) return false;
  return String(val).toLowerCase() === 'true';
}

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],29:[function(require,module,exports){
module.exports = require("./lib/_stream_passthrough.js")

},{"./lib/_stream_passthrough.js":22}],30:[function(require,module,exports){
var Stream = (function (){
  try {
    return require('st' + 'ream'); // hack to fix a circular dependency issue when used with browserify
  } catch(_){}
}());
exports = module.exports = require('./lib/_stream_readable.js');
exports.Stream = Stream || exports;
exports.Readable = exports;
exports.Writable = require('./lib/_stream_writable.js');
exports.Duplex = require('./lib/_stream_duplex.js');
exports.Transform = require('./lib/_stream_transform.js');
exports.PassThrough = require('./lib/_stream_passthrough.js');

},{"./lib/_stream_duplex.js":21,"./lib/_stream_passthrough.js":22,"./lib/_stream_readable.js":23,"./lib/_stream_transform.js":24,"./lib/_stream_writable.js":25}],31:[function(require,module,exports){
module.exports = require("./lib/_stream_transform.js")

},{"./lib/_stream_transform.js":24}],32:[function(require,module,exports){
module.exports = require("./lib/_stream_writable.js")

},{"./lib/_stream_writable.js":25}],33:[function(require,module,exports){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

module.exports = Stream;

var EE = require('events').EventEmitter;
var inherits = require('inherits');

inherits(Stream, EE);
Stream.Readable = require('readable-stream/readable.js');
Stream.Writable = require('readable-stream/writable.js');
Stream.Duplex = require('readable-stream/duplex.js');
Stream.Transform = require('readable-stream/transform.js');
Stream.PassThrough = require('readable-stream/passthrough.js');

// Backwards-compat with node 0.4.x
Stream.Stream = Stream;



// old-style streams.  Note that the pipe method (the only relevant
// part of this class) is overridden in the Readable class.

function Stream() {
  EE.call(this);
}

Stream.prototype.pipe = function(dest, options) {
  var source = this;

  function ondata(chunk) {
    if (dest.writable) {
      if (false === dest.write(chunk) && source.pause) {
        source.pause();
      }
    }
  }

  source.on('data', ondata);

  function ondrain() {
    if (source.readable && source.resume) {
      source.resume();
    }
  }

  dest.on('drain', ondrain);

  // If the 'end' option is not supplied, dest.end() will be called when
  // source gets the 'end' or 'close' events.  Only dest.end() once.
  if (!dest._isStdio && (!options || options.end !== false)) {
    source.on('end', onend);
    source.on('close', onclose);
  }

  var didOnEnd = false;
  function onend() {
    if (didOnEnd) return;
    didOnEnd = true;

    dest.end();
  }


  function onclose() {
    if (didOnEnd) return;
    didOnEnd = true;

    if (typeof dest.destroy === 'function') dest.destroy();
  }

  // don't leave dangling pipes when there are errors.
  function onerror(er) {
    cleanup();
    if (EE.listenerCount(this, 'error') === 0) {
      throw er; // Unhandled stream error in pipe.
    }
  }

  source.on('error', onerror);
  dest.on('error', onerror);

  // remove all the event listeners that were added.
  function cleanup() {
    source.removeListener('data', ondata);
    dest.removeListener('drain', ondrain);

    source.removeListener('end', onend);
    source.removeListener('close', onclose);

    source.removeListener('error', onerror);
    dest.removeListener('error', onerror);

    source.removeListener('end', cleanup);
    source.removeListener('close', cleanup);

    dest.removeListener('close', cleanup);
  }

  source.on('end', cleanup);
  source.on('close', cleanup);

  dest.on('close', cleanup);

  dest.emit('pipe', source);

  // Allow for unix-like usage: A.pipe(B).pipe(C)
  return dest;
};

},{"events":12,"inherits":13,"readable-stream/duplex.js":20,"readable-stream/passthrough.js":29,"readable-stream/readable.js":30,"readable-stream/transform.js":31,"readable-stream/writable.js":32}],34:[function(require,module,exports){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

var Buffer = require('buffer').Buffer;

var isBufferEncoding = Buffer.isEncoding
  || function(encoding) {
       switch (encoding && encoding.toLowerCase()) {
         case 'hex': case 'utf8': case 'utf-8': case 'ascii': case 'binary': case 'base64': case 'ucs2': case 'ucs-2': case 'utf16le': case 'utf-16le': case 'raw': return true;
         default: return false;
       }
     }


function assertEncoding(encoding) {
  if (encoding && !isBufferEncoding(encoding)) {
    throw new Error('Unknown encoding: ' + encoding);
  }
}

// StringDecoder provides an interface for efficiently splitting a series of
// buffers into a series of JS strings without breaking apart multi-byte
// characters. CESU-8 is handled as part of the UTF-8 encoding.
//
// @TODO Handling all encodings inside a single object makes it very difficult
// to reason about this code, so it should be split up in the future.
// @TODO There should be a utf8-strict encoding that rejects invalid UTF-8 code
// points as used by CESU-8.
var StringDecoder = exports.StringDecoder = function(encoding) {
  this.encoding = (encoding || 'utf8').toLowerCase().replace(/[-_]/, '');
  assertEncoding(encoding);
  switch (this.encoding) {
    case 'utf8':
      // CESU-8 represents each of Surrogate Pair by 3-bytes
      this.surrogateSize = 3;
      break;
    case 'ucs2':
    case 'utf16le':
      // UTF-16 represents each of Surrogate Pair by 2-bytes
      this.surrogateSize = 2;
      this.detectIncompleteChar = utf16DetectIncompleteChar;
      break;
    case 'base64':
      // Base-64 stores 3 bytes in 4 chars, and pads the remainder.
      this.surrogateSize = 3;
      this.detectIncompleteChar = base64DetectIncompleteChar;
      break;
    default:
      this.write = passThroughWrite;
      return;
  }

  // Enough space to store all bytes of a single character. UTF-8 needs 4
  // bytes, but CESU-8 may require up to 6 (3 bytes per surrogate).
  this.charBuffer = new Buffer(6);
  // Number of bytes received for the current incomplete multi-byte character.
  this.charReceived = 0;
  // Number of bytes expected for the current incomplete multi-byte character.
  this.charLength = 0;
};


// write decodes the given buffer and returns it as JS string that is
// guaranteed to not contain any partial multi-byte characters. Any partial
// character found at the end of the buffer is buffered up, and will be
// returned when calling write again with the remaining bytes.
//
// Note: Converting a Buffer containing an orphan surrogate to a String
// currently works, but converting a String to a Buffer (via `new Buffer`, or
// Buffer#write) will replace incomplete surrogates with the unicode
// replacement character. See https://codereview.chromium.org/121173009/ .
StringDecoder.prototype.write = function(buffer) {
  var charStr = '';
  // if our last write ended with an incomplete multibyte character
  while (this.charLength) {
    // determine how many remaining bytes this buffer has to offer for this char
    var available = (buffer.length >= this.charLength - this.charReceived) ?
        this.charLength - this.charReceived :
        buffer.length;

    // add the new bytes to the char buffer
    buffer.copy(this.charBuffer, this.charReceived, 0, available);
    this.charReceived += available;

    if (this.charReceived < this.charLength) {
      // still not enough chars in this buffer? wait for more ...
      return '';
    }

    // remove bytes belonging to the current character from the buffer
    buffer = buffer.slice(available, buffer.length);

    // get the character that was split
    charStr = this.charBuffer.slice(0, this.charLength).toString(this.encoding);

    // CESU-8: lead surrogate (D800-DBFF) is also the incomplete character
    var charCode = charStr.charCodeAt(charStr.length - 1);
    if (charCode >= 0xD800 && charCode <= 0xDBFF) {
      this.charLength += this.surrogateSize;
      charStr = '';
      continue;
    }
    this.charReceived = this.charLength = 0;

    // if there are no more bytes in this buffer, just emit our char
    if (buffer.length === 0) {
      return charStr;
    }
    break;
  }

  // determine and set charLength / charReceived
  this.detectIncompleteChar(buffer);

  var end = buffer.length;
  if (this.charLength) {
    // buffer the incomplete character bytes we got
    buffer.copy(this.charBuffer, 0, buffer.length - this.charReceived, end);
    end -= this.charReceived;
  }

  charStr += buffer.toString(this.encoding, 0, end);

  var end = charStr.length - 1;
  var charCode = charStr.charCodeAt(end);
  // CESU-8: lead surrogate (D800-DBFF) is also the incomplete character
  if (charCode >= 0xD800 && charCode <= 0xDBFF) {
    var size = this.surrogateSize;
    this.charLength += size;
    this.charReceived += size;
    this.charBuffer.copy(this.charBuffer, size, 0, size);
    buffer.copy(this.charBuffer, 0, 0, size);
    return charStr.substring(0, end);
  }

  // or just emit the charStr
  return charStr;
};

// detectIncompleteChar determines if there is an incomplete UTF-8 character at
// the end of the given buffer. If so, it sets this.charLength to the byte
// length that character, and sets this.charReceived to the number of bytes
// that are available for this character.
StringDecoder.prototype.detectIncompleteChar = function(buffer) {
  // determine how many bytes we have to check at the end of this buffer
  var i = (buffer.length >= 3) ? 3 : buffer.length;

  // Figure out if one of the last i bytes of our buffer announces an
  // incomplete char.
  for (; i > 0; i--) {
    var c = buffer[buffer.length - i];

    // See http://en.wikipedia.org/wiki/UTF-8#Description

    // 110XXXXX
    if (i == 1 && c >> 5 == 0x06) {
      this.charLength = 2;
      break;
    }

    // 1110XXXX
    if (i <= 2 && c >> 4 == 0x0E) {
      this.charLength = 3;
      break;
    }

    // 11110XXX
    if (i <= 3 && c >> 3 == 0x1E) {
      this.charLength = 4;
      break;
    }
  }
  this.charReceived = i;
};

StringDecoder.prototype.end = function(buffer) {
  var res = '';
  if (buffer && buffer.length)
    res = this.write(buffer);

  if (this.charReceived) {
    var cr = this.charReceived;
    var buf = this.charBuffer;
    var enc = this.encoding;
    res += buf.slice(0, cr).toString(enc);
  }

  return res;
};

function passThroughWrite(buffer) {
  return buffer.toString(this.encoding);
}

function utf16DetectIncompleteChar(buffer) {
  this.charReceived = buffer.length % 2;
  this.charLength = this.charReceived ? 2 : 0;
}

function base64DetectIncompleteChar(buffer) {
  this.charReceived = buffer.length % 3;
  this.charLength = this.charReceived ? 3 : 0;
}

},{"buffer":8}],35:[function(require,module,exports){
module.exports = function isBuffer(arg) {
  return arg && typeof arg === 'object'
    && typeof arg.copy === 'function'
    && typeof arg.fill === 'function'
    && typeof arg.readUInt8 === 'function';
}
},{}],36:[function(require,module,exports){
(function (process,global){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

var formatRegExp = /%[sdj%]/g;
exports.format = function(f) {
  if (!isString(f)) {
    var objects = [];
    for (var i = 0; i < arguments.length; i++) {
      objects.push(inspect(arguments[i]));
    }
    return objects.join(' ');
  }

  var i = 1;
  var args = arguments;
  var len = args.length;
  var str = String(f).replace(formatRegExp, function(x) {
    if (x === '%%') return '%';
    if (i >= len) return x;
    switch (x) {
      case '%s': return String(args[i++]);
      case '%d': return Number(args[i++]);
      case '%j':
        try {
          return JSON.stringify(args[i++]);
        } catch (_) {
          return '[Circular]';
        }
      default:
        return x;
    }
  });
  for (var x = args[i]; i < len; x = args[++i]) {
    if (isNull(x) || !isObject(x)) {
      str += ' ' + x;
    } else {
      str += ' ' + inspect(x);
    }
  }
  return str;
};


// Mark that a method should not be used.
// Returns a modified function which warns once by default.
// If --no-deprecation is set, then it is a no-op.
exports.deprecate = function(fn, msg) {
  // Allow for deprecating things in the process of starting up.
  if (isUndefined(global.process)) {
    return function() {
      return exports.deprecate(fn, msg).apply(this, arguments);
    };
  }

  if (process.noDeprecation === true) {
    return fn;
  }

  var warned = false;
  function deprecated() {
    if (!warned) {
      if (process.throwDeprecation) {
        throw new Error(msg);
      } else if (process.traceDeprecation) {
        console.trace(msg);
      } else {
        console.error(msg);
      }
      warned = true;
    }
    return fn.apply(this, arguments);
  }

  return deprecated;
};


var debugs = {};
var debugEnviron;
exports.debuglog = function(set) {
  if (isUndefined(debugEnviron))
    debugEnviron = process.env.NODE_DEBUG || '';
  set = set.toUpperCase();
  if (!debugs[set]) {
    if (new RegExp('\\b' + set + '\\b', 'i').test(debugEnviron)) {
      var pid = process.pid;
      debugs[set] = function() {
        var msg = exports.format.apply(exports, arguments);
        console.error('%s %d: %s', set, pid, msg);
      };
    } else {
      debugs[set] = function() {};
    }
  }
  return debugs[set];
};


/**
 * Echos the value of a value. Trys to print the value out
 * in the best way possible given the different types.
 *
 * @param {Object} obj The object to print out.
 * @param {Object} opts Optional options object that alters the output.
 */
/* legacy: obj, showHidden, depth, colors*/
function inspect(obj, opts) {
  // default options
  var ctx = {
    seen: [],
    stylize: stylizeNoColor
  };
  // legacy...
  if (arguments.length >= 3) ctx.depth = arguments[2];
  if (arguments.length >= 4) ctx.colors = arguments[3];
  if (isBoolean(opts)) {
    // legacy...
    ctx.showHidden = opts;
  } else if (opts) {
    // got an "options" object
    exports._extend(ctx, opts);
  }
  // set default options
  if (isUndefined(ctx.showHidden)) ctx.showHidden = false;
  if (isUndefined(ctx.depth)) ctx.depth = 2;
  if (isUndefined(ctx.colors)) ctx.colors = false;
  if (isUndefined(ctx.customInspect)) ctx.customInspect = true;
  if (ctx.colors) ctx.stylize = stylizeWithColor;
  return formatValue(ctx, obj, ctx.depth);
}
exports.inspect = inspect;


// http://en.wikipedia.org/wiki/ANSI_escape_code#graphics
inspect.colors = {
  'bold' : [1, 22],
  'italic' : [3, 23],
  'underline' : [4, 24],
  'inverse' : [7, 27],
  'white' : [37, 39],
  'grey' : [90, 39],
  'black' : [30, 39],
  'blue' : [34, 39],
  'cyan' : [36, 39],
  'green' : [32, 39],
  'magenta' : [35, 39],
  'red' : [31, 39],
  'yellow' : [33, 39]
};

// Don't use 'blue' not visible on cmd.exe
inspect.styles = {
  'special': 'cyan',
  'number': 'yellow',
  'boolean': 'yellow',
  'undefined': 'grey',
  'null': 'bold',
  'string': 'green',
  'date': 'magenta',
  // "name": intentionally not styling
  'regexp': 'red'
};


function stylizeWithColor(str, styleType) {
  var style = inspect.styles[styleType];

  if (style) {
    return '\u001b[' + inspect.colors[style][0] + 'm' + str +
           '\u001b[' + inspect.colors[style][1] + 'm';
  } else {
    return str;
  }
}


function stylizeNoColor(str, styleType) {
  return str;
}


function arrayToHash(array) {
  var hash = {};

  array.forEach(function(val, idx) {
    hash[val] = true;
  });

  return hash;
}


function formatValue(ctx, value, recurseTimes) {
  // Provide a hook for user-specified inspect functions.
  // Check that value is an object with an inspect function on it
  if (ctx.customInspect &&
      value &&
      isFunction(value.inspect) &&
      // Filter out the util module, it's inspect function is special
      value.inspect !== exports.inspect &&
      // Also filter out any prototype objects using the circular check.
      !(value.constructor && value.constructor.prototype === value)) {
    var ret = value.inspect(recurseTimes, ctx);
    if (!isString(ret)) {
      ret = formatValue(ctx, ret, recurseTimes);
    }
    return ret;
  }

  // Primitive types cannot have properties
  var primitive = formatPrimitive(ctx, value);
  if (primitive) {
    return primitive;
  }

  // Look up the keys of the object.
  var keys = Object.keys(value);
  var visibleKeys = arrayToHash(keys);

  if (ctx.showHidden) {
    keys = Object.getOwnPropertyNames(value);
  }

  // IE doesn't make error fields non-enumerable
  // http://msdn.microsoft.com/en-us/library/ie/dww52sbt(v=vs.94).aspx
  if (isError(value)
      && (keys.indexOf('message') >= 0 || keys.indexOf('description') >= 0)) {
    return formatError(value);
  }

  // Some type of object without properties can be shortcutted.
  if (keys.length === 0) {
    if (isFunction(value)) {
      var name = value.name ? ': ' + value.name : '';
      return ctx.stylize('[Function' + name + ']', 'special');
    }
    if (isRegExp(value)) {
      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
    }
    if (isDate(value)) {
      return ctx.stylize(Date.prototype.toString.call(value), 'date');
    }
    if (isError(value)) {
      return formatError(value);
    }
  }

  var base = '', array = false, braces = ['{', '}'];

  // Make Array say that they are Array
  if (isArray(value)) {
    array = true;
    braces = ['[', ']'];
  }

  // Make functions say that they are functions
  if (isFunction(value)) {
    var n = value.name ? ': ' + value.name : '';
    base = ' [Function' + n + ']';
  }

  // Make RegExps say that they are RegExps
  if (isRegExp(value)) {
    base = ' ' + RegExp.prototype.toString.call(value);
  }

  // Make dates with properties first say the date
  if (isDate(value)) {
    base = ' ' + Date.prototype.toUTCString.call(value);
  }

  // Make error with message first say the error
  if (isError(value)) {
    base = ' ' + formatError(value);
  }

  if (keys.length === 0 && (!array || value.length == 0)) {
    return braces[0] + base + braces[1];
  }

  if (recurseTimes < 0) {
    if (isRegExp(value)) {
      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
    } else {
      return ctx.stylize('[Object]', 'special');
    }
  }

  ctx.seen.push(value);

  var output;
  if (array) {
    output = formatArray(ctx, value, recurseTimes, visibleKeys, keys);
  } else {
    output = keys.map(function(key) {
      return formatProperty(ctx, value, recurseTimes, visibleKeys, key, array);
    });
  }

  ctx.seen.pop();

  return reduceToSingleString(output, base, braces);
}


function formatPrimitive(ctx, value) {
  if (isUndefined(value))
    return ctx.stylize('undefined', 'undefined');
  if (isString(value)) {
    var simple = '\'' + JSON.stringify(value).replace(/^"|"$/g, '')
                                             .replace(/'/g, "\\'")
                                             .replace(/\\"/g, '"') + '\'';
    return ctx.stylize(simple, 'string');
  }
  if (isNumber(value))
    return ctx.stylize('' + value, 'number');
  if (isBoolean(value))
    return ctx.stylize('' + value, 'boolean');
  // For some reason typeof null is "object", so special case here.
  if (isNull(value))
    return ctx.stylize('null', 'null');
}


function formatError(value) {
  return '[' + Error.prototype.toString.call(value) + ']';
}


function formatArray(ctx, value, recurseTimes, visibleKeys, keys) {
  var output = [];
  for (var i = 0, l = value.length; i < l; ++i) {
    if (hasOwnProperty(value, String(i))) {
      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
          String(i), true));
    } else {
      output.push('');
    }
  }
  keys.forEach(function(key) {
    if (!key.match(/^\d+$/)) {
      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
          key, true));
    }
  });
  return output;
}


function formatProperty(ctx, value, recurseTimes, visibleKeys, key, array) {
  var name, str, desc;
  desc = Object.getOwnPropertyDescriptor(value, key) || { value: value[key] };
  if (desc.get) {
    if (desc.set) {
      str = ctx.stylize('[Getter/Setter]', 'special');
    } else {
      str = ctx.stylize('[Getter]', 'special');
    }
  } else {
    if (desc.set) {
      str = ctx.stylize('[Setter]', 'special');
    }
  }
  if (!hasOwnProperty(visibleKeys, key)) {
    name = '[' + key + ']';
  }
  if (!str) {
    if (ctx.seen.indexOf(desc.value) < 0) {
      if (isNull(recurseTimes)) {
        str = formatValue(ctx, desc.value, null);
      } else {
        str = formatValue(ctx, desc.value, recurseTimes - 1);
      }
      if (str.indexOf('\n') > -1) {
        if (array) {
          str = str.split('\n').map(function(line) {
            return '  ' + line;
          }).join('\n').substr(2);
        } else {
          str = '\n' + str.split('\n').map(function(line) {
            return '   ' + line;
          }).join('\n');
        }
      }
    } else {
      str = ctx.stylize('[Circular]', 'special');
    }
  }
  if (isUndefined(name)) {
    if (array && key.match(/^\d+$/)) {
      return str;
    }
    name = JSON.stringify('' + key);
    if (name.match(/^"([a-zA-Z_][a-zA-Z_0-9]*)"$/)) {
      name = name.substr(1, name.length - 2);
      name = ctx.stylize(name, 'name');
    } else {
      name = name.replace(/'/g, "\\'")
                 .replace(/\\"/g, '"')
                 .replace(/(^"|"$)/g, "'");
      name = ctx.stylize(name, 'string');
    }
  }

  return name + ': ' + str;
}


function reduceToSingleString(output, base, braces) {
  var numLinesEst = 0;
  var length = output.reduce(function(prev, cur) {
    numLinesEst++;
    if (cur.indexOf('\n') >= 0) numLinesEst++;
    return prev + cur.replace(/\u001b\[\d\d?m/g, '').length + 1;
  }, 0);

  if (length > 60) {
    return braces[0] +
           (base === '' ? '' : base + '\n ') +
           ' ' +
           output.join(',\n  ') +
           ' ' +
           braces[1];
  }

  return braces[0] + base + ' ' + output.join(', ') + ' ' + braces[1];
}


// NOTE: These type checking functions intentionally don't use `instanceof`
// because it is fragile and can be easily faked with `Object.create()`.
function isArray(ar) {
  return Array.isArray(ar);
}
exports.isArray = isArray;

function isBoolean(arg) {
  return typeof arg === 'boolean';
}
exports.isBoolean = isBoolean;

function isNull(arg) {
  return arg === null;
}
exports.isNull = isNull;

function isNullOrUndefined(arg) {
  return arg == null;
}
exports.isNullOrUndefined = isNullOrUndefined;

function isNumber(arg) {
  return typeof arg === 'number';
}
exports.isNumber = isNumber;

function isString(arg) {
  return typeof arg === 'string';
}
exports.isString = isString;

function isSymbol(arg) {
  return typeof arg === 'symbol';
}
exports.isSymbol = isSymbol;

function isUndefined(arg) {
  return arg === void 0;
}
exports.isUndefined = isUndefined;

function isRegExp(re) {
  return isObject(re) && objectToString(re) === '[object RegExp]';
}
exports.isRegExp = isRegExp;

function isObject(arg) {
  return typeof arg === 'object' && arg !== null;
}
exports.isObject = isObject;

function isDate(d) {
  return isObject(d) && objectToString(d) === '[object Date]';
}
exports.isDate = isDate;

function isError(e) {
  return isObject(e) &&
      (objectToString(e) === '[object Error]' || e instanceof Error);
}
exports.isError = isError;

function isFunction(arg) {
  return typeof arg === 'function';
}
exports.isFunction = isFunction;

function isPrimitive(arg) {
  return arg === null ||
         typeof arg === 'boolean' ||
         typeof arg === 'number' ||
         typeof arg === 'string' ||
         typeof arg === 'symbol' ||  // ES6 symbol
         typeof arg === 'undefined';
}
exports.isPrimitive = isPrimitive;

exports.isBuffer = require('./support/isBuffer');

function objectToString(o) {
  return Object.prototype.toString.call(o);
}


function pad(n) {
  return n < 10 ? '0' + n.toString(10) : n.toString(10);
}


var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep',
              'Oct', 'Nov', 'Dec'];

// 26 Feb 16:19:34
function timestamp() {
  var d = new Date();
  var time = [pad(d.getHours()),
              pad(d.getMinutes()),
              pad(d.getSeconds())].join(':');
  return [d.getDate(), months[d.getMonth()], time].join(' ');
}


// log is just a thin wrapper to console.log that prepends a timestamp
exports.log = function() {
  console.log('%s - %s', timestamp(), exports.format.apply(exports, arguments));
};


/**
 * Inherit the prototype methods from one constructor into another.
 *
 * The Function.prototype.inherits from lang.js rewritten as a standalone
 * function (not on Function.prototype). NOTE: If this file is to be loaded
 * during bootstrapping this function needs to be rewritten using some native
 * functions as prototype setup using normal JavaScript does not work as
 * expected during bootstrapping (see mirror.js in r114903).
 *
 * @param {function} ctor Constructor function which needs to inherit the
 *     prototype.
 * @param {function} superCtor Constructor function to inherit prototype from.
 */
exports.inherits = require('inherits');

exports._extend = function(origin, add) {
  // Don't do anything if add isn't an object
  if (!add || !isObject(add)) return origin;

  var keys = Object.keys(add);
  var i = keys.length;
  while (i--) {
    origin[keys[i]] = add[keys[i]];
  }
  return origin;
};

function hasOwnProperty(obj, prop) {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}

}).call(this,require('_process'),typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"./support/isBuffer":35,"_process":16,"inherits":13}],37:[function(require,module,exports){
// getUserMedia helper by @HenrikJoreteg
var adapter = require('webrtc-adapter-test');

module.exports = function (constraints, cb) {
    var options, error;
    var haveOpts = arguments.length === 2;
    var defaultOpts = {video: true, audio: true};

    var denied = 'PermissionDeniedError';
    var altDenied = 'PERMISSION_DENIED';
    var notSatisfied = 'ConstraintNotSatisfiedError';

    // make constraints optional
    if (!haveOpts) {
        cb = constraints;
        constraints = defaultOpts;
    }

    // treat lack of browser support like an error
    if (!navigator.getUserMedia) {
        // throw proper error per spec
        error = new Error('MediaStreamError');
        error.name = 'NotSupportedError';

        // keep all callbacks async
        return window.setTimeout(function () {
            cb(error);
        }, 0);
    }

    // normalize error handling when no media types are requested
    if (!constraints.audio && !constraints.video) {
        error = new Error('MediaStreamError');
        error.name = 'NoMediaRequestedError';

        // keep all callbacks async
        return window.setTimeout(function () {
            cb(error);
        }, 0);
    }

    // testing support
    if (localStorage && localStorage.useFirefoxFakeDevice === "true") {
        constraints.fake = true;
    }

    navigator.getUserMedia(constraints, function (stream) {
        cb(null, stream);
    }, function (err) {
        var error;
        // coerce into an error object since FF gives us a string
        // there are only two valid names according to the spec
        // we coerce all non-denied to "constraint not satisfied".
        if (typeof err === 'string') {
            error = new Error('MediaStreamError');
            if (err === denied || err === altDenied) {
                error.name = denied;
            } else {
                error.name = notSatisfied;
            }
        } else {
            // if we get an error object make sure '.name' property is set
            // according to spec: http://dev.w3.org/2011/webrtc/editor/getusermedia.html#navigatorusermediaerror-and-navigatorusermediaerrorcallback
            error = err;
            if (!error.name) {
                // this is likely chrome which
                // sets a property called "ERROR_DENIED" on the error object
                // if so we make sure to set a name
                if (error[denied]) {
                    err.name = denied;
                } else {
                    err.name = notSatisfied;
                }
            }
        }

        cb(error);
    });
};

},{"webrtc-adapter-test":38}],38:[function(require,module,exports){
/*
 *  Copyright (c) 2016 The WebRTC project authors. All Rights Reserved.
 *
 *  Use of this source code is governed by a BSD-style license
 *  that can be found in the LICENSE file in the root of the source
 *  tree.
 */

/* More information about these options at jshint.com/docs/options */
/* jshint browser: true, camelcase: true, curly: true, devel: true,
   eqeqeq: true, forin: false, globalstrict: true, node: true,
   quotmark: single, undef: true, unused: strict */
/* global mozRTCIceCandidate, mozRTCPeerConnection, Promise,
mozRTCSessionDescription, webkitRTCPeerConnection, MediaStreamTrack,
MediaStream, RTCIceGatherer, RTCIceTransport, RTCDtlsTransport,
RTCRtpSender, RTCRtpReceiver*/
/* exported trace,requestUserMedia */

'use strict';

var getUserMedia = null;
var attachMediaStream = null;
var reattachMediaStream = null;
var webrtcDetectedBrowser = null;
var webrtcDetectedVersion = null;
var webrtcMinimumVersion = null;
var webrtcUtils = {
  log: function() {
    // suppress console.log output when being included as a module.
    if (typeof module !== 'undefined' ||
        typeof require === 'function' && typeof define === 'function') {
      return;
    }
    console.log.apply(console, arguments);
  },
  extractVersion: function(uastring, expr, pos) {
    var match = uastring.match(expr);
    return match && match.length >= pos && parseInt(match[pos], 10);
  }
};

function trace(text) {
  // This function is used for logging.
  if (text[text.length - 1] === '\n') {
    text = text.substring(0, text.length - 1);
  }
  if (window.performance) {
    var now = (window.performance.now() / 1000).toFixed(3);
    webrtcUtils.log(now + ': ' + text);
  } else {
    webrtcUtils.log(text);
  }
}

if (typeof window === 'object') {
  if (window.HTMLMediaElement &&
    !('srcObject' in window.HTMLMediaElement.prototype)) {
    // Shim the srcObject property, once, when HTMLMediaElement is found.
    Object.defineProperty(window.HTMLMediaElement.prototype, 'srcObject', {
      get: function() {
        // If prefixed srcObject property exists, return it.
        // Otherwise use the shimmed property, _srcObject
        return 'mozSrcObject' in this ? this.mozSrcObject : this._srcObject;
      },
      set: function(stream) {
        if ('mozSrcObject' in this) {
          this.mozSrcObject = stream;
        } else {
          // Use _srcObject as a private property for this shim
          this._srcObject = stream;
          // TODO: revokeObjectUrl(this.src) when !stream to release resources?
          this.src = URL.createObjectURL(stream);
        }
      }
    });
  }
  // Proxy existing globals
  getUserMedia = window.navigator && window.navigator.getUserMedia;
}

// Attach a media stream to an element.
attachMediaStream = function(element, stream) {
  element.srcObject = stream;
};

reattachMediaStream = function(to, from) {
  to.srcObject = from.srcObject;
};

if (typeof window === 'undefined' || !window.navigator) {
  webrtcUtils.log('This does not appear to be a browser');
  webrtcDetectedBrowser = 'not a browser';
} else if (navigator.mozGetUserMedia && window.mozRTCPeerConnection) {
  webrtcUtils.log('This appears to be Firefox');

  webrtcDetectedBrowser = 'firefox';

  // the detected firefox version.
  webrtcDetectedVersion = webrtcUtils.extractVersion(navigator.userAgent,
      /Firefox\/([0-9]+)\./, 1);

  // the minimum firefox version still supported by adapter.
  webrtcMinimumVersion = 31;

  // The RTCPeerConnection object.
  window.RTCPeerConnection = function(pcConfig, pcConstraints) {
    if (webrtcDetectedVersion < 38) {
      // .urls is not supported in FF < 38.
      // create RTCIceServers with a single url.
      if (pcConfig && pcConfig.iceServers) {
        var newIceServers = [];
        for (var i = 0; i < pcConfig.iceServers.length; i++) {
          var server = pcConfig.iceServers[i];
          if (server.hasOwnProperty('urls')) {
            for (var j = 0; j < server.urls.length; j++) {
              var newServer = {
                url: server.urls[j]
              };
              if (server.urls[j].indexOf('turn') === 0) {
                newServer.username = server.username;
                newServer.credential = server.credential;
              }
              newIceServers.push(newServer);
            }
          } else {
            newIceServers.push(pcConfig.iceServers[i]);
          }
        }
        pcConfig.iceServers = newIceServers;
      }
    }
    return new mozRTCPeerConnection(pcConfig, pcConstraints); // jscs:ignore requireCapitalizedConstructors
  };

  // wrap static methods. Currently just generateCertificate.
  if (mozRTCPeerConnection.generateCertificate) {
    Object.defineProperty(window.RTCPeerConnection, 'generateCertificate', {
      get: function() {
        if (arguments.length) {
          return mozRTCPeerConnection.generateCertificate.apply(null,
              arguments);
        } else {
          return mozRTCPeerConnection.generateCertificate;
        }
      }
    });
  }

  // The RTCSessionDescription object.
  if (!window.RTCSessionDescription) {
    window.RTCSessionDescription = mozRTCSessionDescription;
  }

  // The RTCIceCandidate object.
  if (!window.RTCIceCandidate) {
    window.RTCIceCandidate = mozRTCIceCandidate;
  }

  // getUserMedia constraints shim.
  getUserMedia = function(constraints, onSuccess, onError) {
    var constraintsToFF37 = function(c) {
      if (typeof c !== 'object' || c.require) {
        return c;
      }
      var require = [];
      Object.keys(c).forEach(function(key) {
        if (key === 'require' || key === 'advanced' || key === 'mediaSource') {
          return;
        }
        var r = c[key] = (typeof c[key] === 'object') ?
            c[key] : {ideal: c[key]};
        if (r.min !== undefined ||
            r.max !== undefined || r.exact !== undefined) {
          require.push(key);
        }
        if (r.exact !== undefined) {
          if (typeof r.exact === 'number') {
            r.min = r.max = r.exact;
          } else {
            c[key] = r.exact;
          }
          delete r.exact;
        }
        if (r.ideal !== undefined) {
          c.advanced = c.advanced || [];
          var oc = {};
          if (typeof r.ideal === 'number') {
            oc[key] = {min: r.ideal, max: r.ideal};
          } else {
            oc[key] = r.ideal;
          }
          c.advanced.push(oc);
          delete r.ideal;
          if (!Object.keys(r).length) {
            delete c[key];
          }
        }
      });
      if (require.length) {
        c.require = require;
      }
      return c;
    };
    if (webrtcDetectedVersion < 38) {
      webrtcUtils.log('spec: ' + JSON.stringify(constraints));
      if (constraints.audio) {
        constraints.audio = constraintsToFF37(constraints.audio);
      }
      if (constraints.video) {
        constraints.video = constraintsToFF37(constraints.video);
      }
      webrtcUtils.log('ff37: ' + JSON.stringify(constraints));
    }
    return navigator.mozGetUserMedia(constraints, onSuccess, onError);
  };

  navigator.getUserMedia = getUserMedia;

  // Shim for mediaDevices on older versions.
  if (!navigator.mediaDevices) {
    navigator.mediaDevices = {getUserMedia: requestUserMedia,
      addEventListener: function() { },
      removeEventListener: function() { }
    };
  }
  navigator.mediaDevices.enumerateDevices =
      navigator.mediaDevices.enumerateDevices || function() {
    return new Promise(function(resolve) {
      var infos = [
        {kind: 'audioinput', deviceId: 'default', label: '', groupId: ''},
        {kind: 'videoinput', deviceId: 'default', label: '', groupId: ''}
      ];
      resolve(infos);
    });
  };

  if (webrtcDetectedVersion < 41) {
    // Work around http://bugzil.la/1169665
    var orgEnumerateDevices =
        navigator.mediaDevices.enumerateDevices.bind(navigator.mediaDevices);
    navigator.mediaDevices.enumerateDevices = function() {
      return orgEnumerateDevices().then(undefined, function(e) {
        if (e.name === 'NotFoundError') {
          return [];
        }
        throw e;
      });
    };
  }
} else if (navigator.webkitGetUserMedia && window.webkitRTCPeerConnection) {
  webrtcUtils.log('This appears to be Chrome');

  webrtcDetectedBrowser = 'chrome';

  // the detected chrome version.
  webrtcDetectedVersion = webrtcUtils.extractVersion(navigator.userAgent,
      /Chrom(e|ium)\/([0-9]+)\./, 2);

  // the minimum chrome version still supported by adapter.
  webrtcMinimumVersion = 38;

  // The RTCPeerConnection object.
  window.RTCPeerConnection = function(pcConfig, pcConstraints) {
    // Translate iceTransportPolicy to iceTransports,
    // see https://code.google.com/p/webrtc/issues/detail?id=4869
    if (pcConfig && pcConfig.iceTransportPolicy) {
      pcConfig.iceTransports = pcConfig.iceTransportPolicy;
    }

    var pc = new webkitRTCPeerConnection(pcConfig, pcConstraints); // jscs:ignore requireCapitalizedConstructors
    var origGetStats = pc.getStats.bind(pc);
    pc.getStats = function(selector, successCallback, errorCallback) { // jshint ignore: line
      var self = this;
      var args = arguments;

      // If selector is a function then we are in the old style stats so just
      // pass back the original getStats format to avoid breaking old users.
      if (arguments.length > 0 && typeof selector === 'function') {
        return origGetStats(selector, successCallback);
      }

      var fixChromeStats = function(response) {
        var standardReport = {};
        var reports = response.result();
        reports.forEach(function(report) {
          var standardStats = {
            id: report.id,
            timestamp: report.timestamp,
            type: report.type
          };
          report.names().forEach(function(name) {
            standardStats[name] = report.stat(name);
          });
          standardReport[standardStats.id] = standardStats;
        });

        return standardReport;
      };

      if (arguments.length >= 2) {
        var successCallbackWrapper = function(response) {
          args[1](fixChromeStats(response));
        };

        return origGetStats.apply(this, [successCallbackWrapper, arguments[0]]);
      }

      // promise-support
      return new Promise(function(resolve, reject) {
        if (args.length === 1 && selector === null) {
          origGetStats.apply(self, [
              function(response) {
                resolve.apply(null, [fixChromeStats(response)]);
              }, reject]);
        } else {
          origGetStats.apply(self, [resolve, reject]);
        }
      });
    };

    return pc;
  };

  // wrap static methods. Currently just generateCertificate.
  if (webkitRTCPeerConnection.generateCertificate) {
    Object.defineProperty(window.RTCPeerConnection, 'generateCertificate', {
      get: function() {
        if (arguments.length) {
          return webkitRTCPeerConnection.generateCertificate.apply(null,
              arguments);
        } else {
          return webkitRTCPeerConnection.generateCertificate;
        }
      }
    });
  }

  // add promise support
  ['createOffer', 'createAnswer'].forEach(function(method) {
    var nativeMethod = webkitRTCPeerConnection.prototype[method];
    webkitRTCPeerConnection.prototype[method] = function() {
      var self = this;
      if (arguments.length < 1 || (arguments.length === 1 &&
          typeof(arguments[0]) === 'object')) {
        var opts = arguments.length === 1 ? arguments[0] : undefined;
        return new Promise(function(resolve, reject) {
          nativeMethod.apply(self, [resolve, reject, opts]);
        });
      } else {
        return nativeMethod.apply(this, arguments);
      }
    };
  });

  ['setLocalDescription', 'setRemoteDescription',
      'addIceCandidate'].forEach(function(method) {
    var nativeMethod = webkitRTCPeerConnection.prototype[method];
    webkitRTCPeerConnection.prototype[method] = function() {
      var args = arguments;
      var self = this;
      return new Promise(function(resolve, reject) {
        nativeMethod.apply(self, [args[0],
            function() {
              resolve();
              if (args.length >= 2) {
                args[1].apply(null, []);
              }
            },
            function(err) {
              reject(err);
              if (args.length >= 3) {
                args[2].apply(null, [err]);
              }
            }]
          );
      });
    };
  });

  // getUserMedia constraints shim.
  var constraintsToChrome = function(c) {
    if (typeof c !== 'object' || c.mandatory || c.optional) {
      return c;
    }
    var cc = {};
    Object.keys(c).forEach(function(key) {
      if (key === 'require' || key === 'advanced' || key === 'mediaSource') {
        return;
      }
      var r = (typeof c[key] === 'object') ? c[key] : {ideal: c[key]};
      if (r.exact !== undefined && typeof r.exact === 'number') {
        r.min = r.max = r.exact;
      }
      var oldname = function(prefix, name) {
        if (prefix) {
          return prefix + name.charAt(0).toUpperCase() + name.slice(1);
        }
        return (name === 'deviceId') ? 'sourceId' : name;
      };
      if (r.ideal !== undefined) {
        cc.optional = cc.optional || [];
        var oc = {};
        if (typeof r.ideal === 'number') {
          oc[oldname('min', key)] = r.ideal;
          cc.optional.push(oc);
          oc = {};
          oc[oldname('max', key)] = r.ideal;
          cc.optional.push(oc);
        } else {
          oc[oldname('', key)] = r.ideal;
          cc.optional.push(oc);
        }
      }
      if (r.exact !== undefined && typeof r.exact !== 'number') {
        cc.mandatory = cc.mandatory || {};
        cc.mandatory[oldname('', key)] = r.exact;
      } else {
        ['min', 'max'].forEach(function(mix) {
          if (r[mix] !== undefined) {
            cc.mandatory = cc.mandatory || {};
            cc.mandatory[oldname(mix, key)] = r[mix];
          }
        });
      }
    });
    if (c.advanced) {
      cc.optional = (cc.optional || []).concat(c.advanced);
    }
    return cc;
  };

  getUserMedia = function(constraints, onSuccess, onError) {
    if (constraints.audio) {
      constraints.audio = constraintsToChrome(constraints.audio);
    }
    if (constraints.video) {
      constraints.video = constraintsToChrome(constraints.video);
    }
    webrtcUtils.log('chrome: ' + JSON.stringify(constraints));
    return navigator.webkitGetUserMedia(constraints, onSuccess, onError);
  };
  navigator.getUserMedia = getUserMedia;

  if (!navigator.mediaDevices) {
    navigator.mediaDevices = {getUserMedia: requestUserMedia,
                              enumerateDevices: function() {
      return new Promise(function(resolve) {
        var kinds = {audio: 'audioinput', video: 'videoinput'};
        return MediaStreamTrack.getSources(function(devices) {
          resolve(devices.map(function(device) {
            return {label: device.label,
                    kind: kinds[device.kind],
                    deviceId: device.id,
                    groupId: ''};
          }));
        });
      });
    }};
  }

  // A shim for getUserMedia method on the mediaDevices object.
  // TODO(KaptenJansson) remove once implemented in Chrome stable.
  if (!navigator.mediaDevices.getUserMedia) {
    navigator.mediaDevices.getUserMedia = function(constraints) {
      return requestUserMedia(constraints);
    };
  } else {
    // Even though Chrome 45 has navigator.mediaDevices and a getUserMedia
    // function which returns a Promise, it does not accept spec-style
    // constraints.
    var origGetUserMedia = navigator.mediaDevices.getUserMedia.
        bind(navigator.mediaDevices);
    navigator.mediaDevices.getUserMedia = function(c) {
      webrtcUtils.log('spec:   ' + JSON.stringify(c)); // whitespace for alignment
      c.audio = constraintsToChrome(c.audio);
      c.video = constraintsToChrome(c.video);
      webrtcUtils.log('chrome: ' + JSON.stringify(c));
      return origGetUserMedia(c);
    };
  }

  // Dummy devicechange event methods.
  // TODO(KaptenJansson) remove once implemented in Chrome stable.
  if (typeof navigator.mediaDevices.addEventListener === 'undefined') {
    navigator.mediaDevices.addEventListener = function() {
      webrtcUtils.log('Dummy mediaDevices.addEventListener called.');
    };
  }
  if (typeof navigator.mediaDevices.removeEventListener === 'undefined') {
    navigator.mediaDevices.removeEventListener = function() {
      webrtcUtils.log('Dummy mediaDevices.removeEventListener called.');
    };
  }

  // Attach a media stream to an element.
  attachMediaStream = function(element, stream) {
    if (webrtcDetectedVersion >= 43) {
      element.srcObject = stream;
    } else if (typeof element.src !== 'undefined') {
      element.src = URL.createObjectURL(stream);
    } else {
      webrtcUtils.log('Error attaching stream to element.');
    }
  };
  reattachMediaStream = function(to, from) {
    if (webrtcDetectedVersion >= 43) {
      to.srcObject = from.srcObject;
    } else {
      to.src = from.src;
    }
  };

} else if (navigator.mediaDevices && navigator.userAgent.match(
    /Edge\/(\d+).(\d+)$/)) {
  webrtcUtils.log('This appears to be Edge');
  webrtcDetectedBrowser = 'edge';

  webrtcDetectedVersion = webrtcUtils.extractVersion(navigator.userAgent,
      /Edge\/(\d+).(\d+)$/, 2);

  // The minimum version still supported by adapter.
  // This is the build number for Edge.
  webrtcMinimumVersion = 10547;

  if (RTCIceGatherer) {
    // Generate an alphanumeric identifier for cname or mids.
    // TODO: use UUIDs instead? https://gist.github.com/jed/982883
    var generateIdentifier = function() {
      return Math.random().toString(36).substr(2, 10);
    };

    // The RTCP CNAME used by all peerconnections from the same JS.
    var localCName = generateIdentifier();

    // SDP helpers - to be moved into separate module.
    var SDPUtils = {};

    // Splits SDP into lines, dealing with both CRLF and LF.
    SDPUtils.splitLines = function(blob) {
      return blob.trim().split('\n').map(function(line) {
        return line.trim();
      });
    };

    // Splits SDP into sessionpart and mediasections. Ensures CRLF.
    SDPUtils.splitSections = function(blob) {
      var parts = blob.split('\r\nm=');
      return parts.map(function(part, index) {
        return (index > 0 ? 'm=' + part : part).trim() + '\r\n';
      });
    };

    // Returns lines that start with a certain prefix.
    SDPUtils.matchPrefix = function(blob, prefix) {
      return SDPUtils.splitLines(blob).filter(function(line) {
        return line.indexOf(prefix) === 0;
      });
    };

    // Parses an ICE candidate line. Sample input:
    // candidate:702786350 2 udp 41819902 8.8.8.8 60769 typ relay raddr 8.8.8.8 rport 55996"
    SDPUtils.parseCandidate = function(line) {
      var parts;
      // Parse both variants.
      if (line.indexOf('a=candidate:') === 0) {
        parts = line.substring(12).split(' ');
      } else {
        parts = line.substring(10).split(' ');
      }

      var candidate = {
        foundation: parts[0],
        component: parts[1],
        protocol: parts[2].toLowerCase(),
        priority: parseInt(parts[3], 10),
        ip: parts[4],
        port: parseInt(parts[5], 10),
        // skip parts[6] == 'typ'
        type: parts[7]
      };

      for (var i = 8; i < parts.length; i += 2) {
        switch (parts[i]) {
          case 'raddr':
            candidate.relatedAddress = parts[i + 1];
            break;
          case 'rport':
            candidate.relatedPort = parseInt(parts[i + 1], 10);
            break;
          case 'tcptype':
            candidate.tcpType = parts[i + 1];
            break;
          default: // Unknown extensions are silently ignored.
            break;
        }
      }
      return candidate;
    };

    // Translates a candidate object into SDP candidate attribute.
    SDPUtils.writeCandidate = function(candidate) {
      var sdp = [];
      sdp.push(candidate.foundation);
      sdp.push(candidate.component);
      sdp.push(candidate.protocol.toUpperCase());
      sdp.push(candidate.priority);
      sdp.push(candidate.ip);
      sdp.push(candidate.port);

      var type = candidate.type;
      sdp.push('typ');
      sdp.push(type);
      if (type !== 'host' && candidate.relatedAddress &&
          candidate.relatedPort) {
        sdp.push('raddr');
        sdp.push(candidate.relatedAddress); // was: relAddr
        sdp.push('rport');
        sdp.push(candidate.relatedPort); // was: relPort
      }
      if (candidate.tcpType && candidate.protocol.toLowerCase() === 'tcp') {
        sdp.push('tcptype');
        sdp.push(candidate.tcpType);
      }
      return 'candidate:' + sdp.join(' ');
    };

    // Parses an rtpmap line, returns RTCRtpCoddecParameters. Sample input:
    // a=rtpmap:111 opus/48000/2
    SDPUtils.parseRtpMap = function(line) {
      var parts = line.substr(9).split(' ');
      var parsed = {
        payloadType: parseInt(parts.shift(), 10) // was: id
      };

      parts = parts[0].split('/');

      parsed.name = parts[0];
      parsed.clockRate = parseInt(parts[1], 10); // was: clockrate
      parsed.numChannels = parts.length === 3 ? parseInt(parts[2], 10) : 1; // was: channels
      return parsed;
    };

    // Generate an a=rtpmap line from RTCRtpCodecCapability or RTCRtpCodecParameters.
    SDPUtils.writeRtpMap = function(codec) {
      var pt = codec.payloadType;
      if (codec.preferredPayloadType !== undefined) {
        pt = codec.preferredPayloadType;
      }
      return 'a=rtpmap:' + pt + ' ' + codec.name + '/' + codec.clockRate +
          (codec.numChannels !== 1 ? '/' + codec.numChannels : '') + '\r\n';
    };

    // Parses an ftmp line, returns dictionary. Sample input:
    // a=fmtp:96 vbr=on;cng=on
    // Also deals with vbr=on; cng=on
    SDPUtils.parseFmtp = function(line) {
      var parsed = {};
      var kv;
      var parts = line.substr(line.indexOf(' ') + 1).split(';');
      for (var j = 0; j < parts.length; j++) {
        kv = parts[j].trim().split('=');
        parsed[kv[0].trim()] = kv[1];
      }
      return parsed;
    };

    // Generates an a=ftmp line from RTCRtpCodecCapability or RTCRtpCodecParameters.
    SDPUtils.writeFtmp = function(codec) {
      var line = '';
      var pt = codec.payloadType;
      if (codec.preferredPayloadType !== undefined) {
        pt = codec.preferredPayloadType;
      }
      if (codec.parameters && codec.parameters.length) {
        var params = [];
        Object.keys(codec.parameters).forEach(function(param) {
          params.push(param + '=' + codec.parameters[param]);
        });
        line += 'a=fmtp:' + pt + ' ' + params.join(';') + '\r\n';
      }
      return line;
    };

    // Parses an rtcp-fb line, returns RTCPRtcpFeedback object. Sample input:
    // a=rtcp-fb:98 nack rpsi
    SDPUtils.parseRtcpFb = function(line) {
      var parts = line.substr(line.indexOf(' ') + 1).split(' ');
      return {
        type: parts.shift(),
        parameter: parts.join(' ')
      };
    };
    // Generate a=rtcp-fb lines from RTCRtpCodecCapability or RTCRtpCodecParameters.
    SDPUtils.writeRtcpFb = function(codec) {
      var lines = '';
      var pt = codec.payloadType;
      if (codec.preferredPayloadType !== undefined) {
        pt = codec.preferredPayloadType;
      }
      if (codec.rtcpFeedback && codec.rtcpFeedback.length) {
        // FIXME: special handling for trr-int?
        codec.rtcpFeedback.forEach(function(fb) {
          lines += 'a=rtcp-fb:' + pt + ' ' + fb.type + ' ' + fb.parameter +
              '\r\n';
        });
      }
      return lines;
    };

    // Parses an RFC 5576 ssrc media attribute. Sample input:
    // a=ssrc:3735928559 cname:something
    SDPUtils.parseSsrcMedia = function(line) {
      var sp = line.indexOf(' ');
      var parts = {
        ssrc: line.substr(7, sp - 7),
      };
      var colon = line.indexOf(':', sp);
      if (colon > -1) {
        parts.attribute = line.substr(sp + 1, colon - sp - 1);
        parts.value = line.substr(colon + 1);
      } else {
        parts.attribute = line.substr(sp + 1);
      }
      return parts;
    };

    // Extracts DTLS parameters from SDP media section or sessionpart.
    // FIXME: for consistency with other functions this should only
    //   get the fingerprint line as input. See also getIceParameters.
    SDPUtils.getDtlsParameters = function(mediaSection, sessionpart) {
      var lines = SDPUtils.splitLines(mediaSection);
      lines = lines.concat(SDPUtils.splitLines(sessionpart)); // Search in session part, too.
      var fpLine = lines.filter(function(line) {
        return line.indexOf('a=fingerprint:') === 0;
      })[0].substr(14);
      // Note: a=setup line is ignored since we use the 'auto' role.
      var dtlsParameters = {
        role: 'auto',
        fingerprints: [{
          algorithm: fpLine.split(' ')[0],
          value: fpLine.split(' ')[1]
        }]
      };
      return dtlsParameters;
    };

    // Serializes DTLS parameters to SDP.
    SDPUtils.writeDtlsParameters = function(params, setupType) {
      var sdp = 'a=setup:' + setupType + '\r\n';
      params.fingerprints.forEach(function(fp) {
        sdp += 'a=fingerprint:' + fp.algorithm + ' ' + fp.value + '\r\n';
      });
      return sdp;
    };
    // Parses ICE information from SDP media section or sessionpart.
    // FIXME: for consistency with other functions this should only
    //   get the ice-ufrag and ice-pwd lines as input.
    SDPUtils.getIceParameters = function(mediaSection, sessionpart) {
      var lines = SDPUtils.splitLines(mediaSection);
      lines = lines.concat(SDPUtils.splitLines(sessionpart)); // Search in session part, too.
      var iceParameters = {
        usernameFragment: lines.filter(function(line) {
          return line.indexOf('a=ice-ufrag:') === 0;
        })[0].substr(12),
        password: lines.filter(function(line) {
          return line.indexOf('a=ice-pwd:') === 0;
        })[0].substr(10)
      };
      return iceParameters;
    };

    // Serializes ICE parameters to SDP.
    SDPUtils.writeIceParameters = function(params) {
      return 'a=ice-ufrag:' + params.usernameFragment + '\r\n' +
          'a=ice-pwd:' + params.password + '\r\n';
    };

    // Parses the SDP media section and returns RTCRtpParameters.
    SDPUtils.parseRtpParameters = function(mediaSection) {
      var description = {
        codecs: [],
        headerExtensions: [],
        fecMechanisms: [],
        rtcp: []
      };
      var lines = SDPUtils.splitLines(mediaSection);
      var mline = lines[0].split(' ');
      for (var i = 3; i < mline.length; i++) { // find all codecs from mline[3..]
        var pt = mline[i];
        var rtpmapline = SDPUtils.matchPrefix(
            mediaSection, 'a=rtpmap:' + pt + ' ')[0];
        if (rtpmapline) {
          var codec = SDPUtils.parseRtpMap(rtpmapline);
          var fmtps = SDPUtils.matchPrefix(
              mediaSection, 'a=fmtp:' + pt + ' ');
          // Only the first a=fmtp:<pt> is considered.
          codec.parameters = fmtps.length ? SDPUtils.parseFmtp(fmtps[0]) : {};
          codec.rtcpFeedback = SDPUtils.matchPrefix(
              mediaSection, 'a=rtcp-fb:' + pt + ' ')
            .map(SDPUtils.parseRtcpFb);
          description.codecs.push(codec);
        }
      }
      // FIXME: parse headerExtensions, fecMechanisms and rtcp.
      return description;
    };

    // Generates parts of the SDP media section describing the capabilities / parameters.
    SDPUtils.writeRtpDescription = function(kind, caps) {
      var sdp = '';

      // Build the mline.
      sdp += 'm=' + kind + ' ';
      sdp += caps.codecs.length > 0 ? '9' : '0'; // reject if no codecs.
      sdp += ' UDP/TLS/RTP/SAVPF ';
      sdp += caps.codecs.map(function(codec) {
        if (codec.preferredPayloadType !== undefined) {
          return codec.preferredPayloadType;
        }
        return codec.payloadType;
      }).join(' ') + '\r\n';

      sdp += 'c=IN IP4 0.0.0.0\r\n';
      sdp += 'a=rtcp:9 IN IP4 0.0.0.0\r\n';

      // Add a=rtpmap lines for each codec. Also fmtp and rtcp-fb.
      caps.codecs.forEach(function(codec) {
        sdp += SDPUtils.writeRtpMap(codec);
        sdp += SDPUtils.writeFtmp(codec);
        sdp += SDPUtils.writeRtcpFb(codec);
      });
      // FIXME: add headerExtensions, fecMechanismş and rtcp.
      sdp += 'a=rtcp-mux\r\n';
      return sdp;
    };

    SDPUtils.writeSessionBoilerplate = function() {
      // FIXME: sess-id should be an NTP timestamp.
      return 'v=0\r\n' +
          'o=thisisadapterortc 8169639915646943137 2 IN IP4 127.0.0.1\r\n' +
          's=-\r\n' +
          't=0 0\r\n';
    };

    SDPUtils.writeMediaSection = function(transceiver, caps, type, stream) {
      var sdp = SDPUtils.writeRtpDescription(transceiver.kind, caps);

      // Map ICE parameters (ufrag, pwd) to SDP.
      sdp += SDPUtils.writeIceParameters(
          transceiver.iceGatherer.getLocalParameters());

      // Map DTLS parameters to SDP.
      sdp += SDPUtils.writeDtlsParameters(
          transceiver.dtlsTransport.getLocalParameters(),
          type === 'offer' ? 'actpass' : 'active');

      sdp += 'a=mid:' + transceiver.mid + '\r\n';

      if (transceiver.rtpSender && transceiver.rtpReceiver) {
        sdp += 'a=sendrecv\r\n';
      } else if (transceiver.rtpSender) {
        sdp += 'a=sendonly\r\n';
      } else if (transceiver.rtpReceiver) {
        sdp += 'a=recvonly\r\n';
      } else {
        sdp += 'a=inactive\r\n';
      }

      // FIXME: for RTX there might be multiple SSRCs. Not implemented in Edge yet.
      if (transceiver.rtpSender) {
        var msid = 'msid:' + stream.id + ' ' +
            transceiver.rtpSender.track.id + '\r\n';
        sdp += 'a=' + msid;
        sdp += 'a=ssrc:' + transceiver.sendSsrc + ' ' + msid;
      }
      // FIXME: this should be written by writeRtpDescription.
      sdp += 'a=ssrc:' + transceiver.sendSsrc + ' cname:' +
          localCName + '\r\n';
      return sdp;
    };

    // Gets the direction from the mediaSection or the sessionpart.
    SDPUtils.getDirection = function(mediaSection, sessionpart) {
      // Look for sendrecv, sendonly, recvonly, inactive, default to sendrecv.
      var lines = SDPUtils.splitLines(mediaSection);
      for (var i = 0; i < lines.length; i++) {
        switch (lines[i]) {
          case 'a=sendrecv':
          case 'a=sendonly':
          case 'a=recvonly':
          case 'a=inactive':
            return lines[i].substr(2);
        }
      }
      if (sessionpart) {
        return SDPUtils.getDirection(sessionpart);
      }
      return 'sendrecv';
    };

    // ORTC defines an RTCIceCandidate object but no constructor.
    // Not implemented in Edge.
    if (!window.RTCIceCandidate) {
      window.RTCIceCandidate = function(args) {
        return args;
      };
    }
    // ORTC does not have a session description object but
    // other browsers (i.e. Chrome) that will support both PC and ORTC
    // in the future might have this defined already.
    if (!window.RTCSessionDescription) {
      window.RTCSessionDescription = function(args) {
        return args;
      };
    }

    window.RTCPeerConnection = function(config) {
      var self = this;

      this.onicecandidate = null;
      this.onaddstream = null;
      this.onremovestream = null;
      this.onsignalingstatechange = null;
      this.oniceconnectionstatechange = null;
      this.onnegotiationneeded = null;
      this.ondatachannel = null;

      this.localStreams = [];
      this.remoteStreams = [];
      this.getLocalStreams = function() { return self.localStreams; };
      this.getRemoteStreams = function() { return self.remoteStreams; };

      this.localDescription = new RTCSessionDescription({
        type: '',
        sdp: ''
      });
      this.remoteDescription = new RTCSessionDescription({
        type: '',
        sdp: ''
      });
      this.signalingState = 'stable';
      this.iceConnectionState = 'new';

      this.iceOptions = {
        gatherPolicy: 'all',
        iceServers: []
      };
      if (config && config.iceTransportPolicy) {
        switch (config.iceTransportPolicy) {
          case 'all':
          case 'relay':
            this.iceOptions.gatherPolicy = config.iceTransportPolicy;
            break;
          case 'none':
            // FIXME: remove once implementation and spec have added this.
            throw new TypeError('iceTransportPolicy "none" not supported');
        }
      }
      if (config && config.iceServers) {
        // Edge does not like
        // 1) stun:
        // 2) turn: that does not have all of turn:host:port?transport=udp
        // 3) an array of urls
        config.iceServers.forEach(function(server) {
          if (server.urls) {
            var url;
            if (typeof(server.urls) === 'string') {
              url = server.urls;
            } else {
              url = server.urls[0];
            }
            if (url.indexOf('transport=udp') !== -1) {
              self.iceServers.push({
                username: server.username,
                credential: server.credential,
                urls: url
              });
            }
          }
        });
      }

      // per-track iceGathers, iceTransports, dtlsTransports, rtpSenders, ...
      // everything that is needed to describe a SDP m-line.
      this.transceivers = [];

      // since the iceGatherer is currently created in createOffer but we
      // must not emit candidates until after setLocalDescription we buffer
      // them in this array.
      this._localIceCandidatesBuffer = [];
    };

    window.RTCPeerConnection.prototype._emitBufferedCandidates = function() {
      var self = this;
      // FIXME: need to apply ice candidates in a way which is async but in-order
      this._localIceCandidatesBuffer.forEach(function(event) {
        if (self.onicecandidate !== null) {
          self.onicecandidate(event);
        }
      });
      this._localIceCandidatesBuffer = [];
    };

    window.RTCPeerConnection.prototype.addStream = function(stream) {
      // Clone is necessary for local demos mostly, attaching directly
      // to two different senders does not work (build 10547).
      this.localStreams.push(stream.clone());
      this._maybeFireNegotiationNeeded();
    };

    window.RTCPeerConnection.prototype.removeStream = function(stream) {
      var idx = this.localStreams.indexOf(stream);
      if (idx > -1) {
        this.localStreams.splice(idx, 1);
        this._maybeFireNegotiationNeeded();
      }
    };

    // Determines the intersection of local and remote capabilities.
    window.RTCPeerConnection.prototype._getCommonCapabilities =
        function(localCapabilities, remoteCapabilities) {
      var commonCapabilities = {
        codecs: [],
        headerExtensions: [],
        fecMechanisms: []
      };
      localCapabilities.codecs.forEach(function(lCodec) {
        for (var i = 0; i < remoteCapabilities.codecs.length; i++) {
          var rCodec = remoteCapabilities.codecs[i];
          if (lCodec.name.toLowerCase() === rCodec.name.toLowerCase() &&
              lCodec.clockRate === rCodec.clockRate &&
              lCodec.numChannels === rCodec.numChannels) {
            // push rCodec so we reply with offerer payload type
            commonCapabilities.codecs.push(rCodec);

            // FIXME: also need to determine intersection between
            // .rtcpFeedback and .parameters
            break;
          }
        }
      });

      localCapabilities.headerExtensions.forEach(function(lHeaderExtension) {
        for (var i = 0; i < remoteCapabilities.headerExtensions.length; i++) {
          var rHeaderExtension = remoteCapabilities.headerExtensions[i];
          if (lHeaderExtension.uri === rHeaderExtension.uri) {
            commonCapabilities.headerExtensions.push(rHeaderExtension);
            break;
          }
        }
      });

      // FIXME: fecMechanisms
      return commonCapabilities;
    };

    // Create ICE gatherer, ICE transport and DTLS transport.
    window.RTCPeerConnection.prototype._createIceAndDtlsTransports =
        function(mid, sdpMLineIndex) {
      var self = this;
      var iceGatherer = new RTCIceGatherer(self.iceOptions);
      var iceTransport = new RTCIceTransport(iceGatherer);
      iceGatherer.onlocalcandidate = function(evt) {
        var event = {};
        event.candidate = {sdpMid: mid, sdpMLineIndex: sdpMLineIndex};

        var cand = evt.candidate;
        // Edge emits an empty object for RTCIceCandidateComplete‥
        if (!cand || Object.keys(cand).length === 0) {
          // polyfill since RTCIceGatherer.state is not implemented in Edge 10547 yet.
          if (iceGatherer.state === undefined) {
            iceGatherer.state = 'completed';
          }

          // Emit a candidate with type endOfCandidates to make the samples work.
          // Edge requires addIceCandidate with this empty candidate to start checking.
          // The real solution is to signal end-of-candidates to the other side when
          // getting the null candidate but some apps (like the samples) don't do that.
          event.candidate.candidate =
              'candidate:1 1 udp 1 0.0.0.0 9 typ endOfCandidates';
        } else {
          // RTCIceCandidate doesn't have a component, needs to be added
          cand.component = iceTransport.component === 'RTCP' ? 2 : 1;
          event.candidate.candidate = SDPUtils.writeCandidate(cand);
        }

        var complete = self.transceivers.every(function(transceiver) {
          return transceiver.iceGatherer &&
              transceiver.iceGatherer.state === 'completed';
        });
        // FIXME: update .localDescription with candidate and (potentially) end-of-candidates.
        //     To make this harder, the gatherer might emit candidates before localdescription
        //     is set. To make things worse, gather.getLocalCandidates still errors in
        //     Edge 10547 when no candidates have been gathered yet.

        if (self.onicecandidate !== null) {
          // Emit candidate if localDescription is set.
          // Also emits null candidate when all gatherers are complete.
          if (self.localDescription && self.localDescription.type === '') {
            self._localIceCandidatesBuffer.push(event);
            if (complete) {
              self._localIceCandidatesBuffer.push({});
            }
          } else {
            self.onicecandidate(event);
            if (complete) {
              self.onicecandidate({});
            }
          }
        }
      };
      iceTransport.onicestatechange = function() {
        self._updateConnectionState();
      };

      var dtlsTransport = new RTCDtlsTransport(iceTransport);
      dtlsTransport.ondtlsstatechange = function() {
        self._updateConnectionState();
      };
      dtlsTransport.onerror = function() {
        // onerror does not set state to failed by itself.
        dtlsTransport.state = 'failed';
        self._updateConnectionState();
      };

      return {
        iceGatherer: iceGatherer,
        iceTransport: iceTransport,
        dtlsTransport: dtlsTransport
      };
    };

    // Start the RTP Sender and Receiver for a transceiver.
    window.RTCPeerConnection.prototype._transceive = function(transceiver,
        send, recv) {
      var params = this._getCommonCapabilities(transceiver.localCapabilities,
          transceiver.remoteCapabilities);
      if (send && transceiver.rtpSender) {
        params.encodings = [{
          ssrc: transceiver.sendSsrc
        }];
        params.rtcp = {
          cname: localCName,
          ssrc: transceiver.recvSsrc
        };
        transceiver.rtpSender.send(params);
      }
      if (recv && transceiver.rtpReceiver) {
        params.encodings = [{
          ssrc: transceiver.recvSsrc
        }];
        params.rtcp = {
          cname: transceiver.cname,
          ssrc: transceiver.sendSsrc
        };
        transceiver.rtpReceiver.receive(params);
      }
    };

    window.RTCPeerConnection.prototype.setLocalDescription =
        function(description) {
      var self = this;
      if (description.type === 'offer') {
        if (!this._pendingOffer) {
        } else {
          this.transceivers = this._pendingOffer;
          delete this._pendingOffer;
        }
      } else if (description.type === 'answer') {
        var sections = SDPUtils.splitSections(self.remoteDescription.sdp);
        var sessionpart = sections.shift();
        sections.forEach(function(mediaSection, sdpMLineIndex) {
          var transceiver = self.transceivers[sdpMLineIndex];
          var iceGatherer = transceiver.iceGatherer;
          var iceTransport = transceiver.iceTransport;
          var dtlsTransport = transceiver.dtlsTransport;
          var localCapabilities = transceiver.localCapabilities;
          var remoteCapabilities = transceiver.remoteCapabilities;
          var rejected = mediaSection.split('\n', 1)[0]
              .split(' ', 2)[1] === '0';

          if (!rejected) {
            var remoteIceParameters = SDPUtils.getIceParameters(mediaSection,
                sessionpart);
            iceTransport.start(iceGatherer, remoteIceParameters, 'controlled');

            var remoteDtlsParameters = SDPUtils.getDtlsParameters(mediaSection,
              sessionpart);
            dtlsTransport.start(remoteDtlsParameters);

            // Calculate intersection of capabilities.
            var params = self._getCommonCapabilities(localCapabilities,
                remoteCapabilities);

            // Start the RTCRtpSender. The RTCRtpReceiver for this transceiver
            // has already been started in setRemoteDescription.
            self._transceive(transceiver,
                params.codecs.length > 0,
                false);
          }
        });
      }

      this.localDescription = description;
      switch (description.type) {
        case 'offer':
          this._updateSignalingState('have-local-offer');
          break;
        case 'answer':
          this._updateSignalingState('stable');
          break;
        default:
          throw new TypeError('unsupported type "' + description.type + '"');
      }

      // If a success callback was provided, emit ICE candidates after it has been
      // executed. Otherwise, emit callback after the Promise is resolved.
      var hasCallback = arguments.length > 1 &&
        typeof arguments[1] === 'function';
      if (hasCallback) {
        var cb = arguments[1];
        window.setTimeout(function() {
          cb();
          self._emitBufferedCandidates();
        }, 0);
      }
      var p = Promise.resolve();
      p.then(function() {
        if (!hasCallback) {
          window.setTimeout(self._emitBufferedCandidates.bind(self), 0);
        }
      });
      return p;
    };

    window.RTCPeerConnection.prototype.setRemoteDescription =
        function(description) {
      var self = this;
      var stream = new MediaStream();
      var sections = SDPUtils.splitSections(description.sdp);
      var sessionpart = sections.shift();
      sections.forEach(function(mediaSection, sdpMLineIndex) {
        var lines = SDPUtils.splitLines(mediaSection);
        var mline = lines[0].substr(2).split(' ');
        var kind = mline[0];
        var rejected = mline[1] === '0';
        var direction = SDPUtils.getDirection(mediaSection, sessionpart);

        var transceiver;
        var iceGatherer;
        var iceTransport;
        var dtlsTransport;
        var rtpSender;
        var rtpReceiver;
        var sendSsrc;
        var recvSsrc;
        var localCapabilities;

        // FIXME: ensure the mediaSection has rtcp-mux set.
        var remoteCapabilities = SDPUtils.parseRtpParameters(mediaSection);
        var remoteIceParameters;
        var remoteDtlsParameters;
        if (!rejected) {
          remoteIceParameters = SDPUtils.getIceParameters(mediaSection,
              sessionpart);
          remoteDtlsParameters = SDPUtils.getDtlsParameters(mediaSection,
              sessionpart);
        }
        var mid = SDPUtils.matchPrefix(mediaSection, 'a=mid:')[0].substr(6);

        var cname;
        // Gets the first SSRC. Note that with RTX there might be multiple SSRCs.
        var remoteSsrc = SDPUtils.matchPrefix(mediaSection, 'a=ssrc:')
            .map(function(line) {
              return SDPUtils.parseSsrcMedia(line);
            })
            .filter(function(obj) {
              return obj.attribute === 'cname';
            })[0];
        if (remoteSsrc) {
          recvSsrc = parseInt(remoteSsrc.ssrc, 10);
          cname = remoteSsrc.value;
        }

        if (description.type === 'offer') {
          var transports = self._createIceAndDtlsTransports(mid, sdpMLineIndex);

          localCapabilities = RTCRtpReceiver.getCapabilities(kind);
          sendSsrc = (2 * sdpMLineIndex + 2) * 1001;

          rtpReceiver = new RTCRtpReceiver(transports.dtlsTransport, kind);

          // FIXME: not correct when there are multiple streams but that is
          // not currently supported in this shim.
          stream.addTrack(rtpReceiver.track);

          // FIXME: look at direction.
          if (self.localStreams.length > 0 &&
              self.localStreams[0].getTracks().length >= sdpMLineIndex) {
            // FIXME: actually more complicated, needs to match types etc
            var localtrack = self.localStreams[0].getTracks()[sdpMLineIndex];
            rtpSender = new RTCRtpSender(localtrack, transports.dtlsTransport);
          }

          self.transceivers[sdpMLineIndex] = {
            iceGatherer: transports.iceGatherer,
            iceTransport: transports.iceTransport,
            dtlsTransport: transports.dtlsTransport,
            localCapabilities: localCapabilities,
            remoteCapabilities: remoteCapabilities,
            rtpSender: rtpSender,
            rtpReceiver: rtpReceiver,
            kind: kind,
            mid: mid,
            cname: cname,
            sendSsrc: sendSsrc,
            recvSsrc: recvSsrc
          };
          // Start the RTCRtpReceiver now. The RTPSender is started in setLocalDescription.
          self._transceive(self.transceivers[sdpMLineIndex],
              false,
              direction === 'sendrecv' || direction === 'sendonly');
        } else if (description.type === 'answer' && !rejected) {
          transceiver = self.transceivers[sdpMLineIndex];
          iceGatherer = transceiver.iceGatherer;
          iceTransport = transceiver.iceTransport;
          dtlsTransport = transceiver.dtlsTransport;
          rtpSender = transceiver.rtpSender;
          rtpReceiver = transceiver.rtpReceiver;
          sendSsrc = transceiver.sendSsrc;
          //recvSsrc = transceiver.recvSsrc;
          localCapabilities = transceiver.localCapabilities;

          self.transceivers[sdpMLineIndex].recvSsrc = recvSsrc;
          self.transceivers[sdpMLineIndex].remoteCapabilities =
              remoteCapabilities;
          self.transceivers[sdpMLineIndex].cname = cname;

          iceTransport.start(iceGatherer, remoteIceParameters, 'controlling');
          dtlsTransport.start(remoteDtlsParameters);

          self._transceive(transceiver,
              direction === 'sendrecv' || direction === 'recvonly',
              direction === 'sendrecv' || direction === 'sendonly');

          if (rtpReceiver &&
              (direction === 'sendrecv' || direction === 'sendonly')) {
            stream.addTrack(rtpReceiver.track);
          } else {
            // FIXME: actually the receiver should be created later.
            delete transceiver.rtpReceiver;
          }
        }
      });

      this.remoteDescription = description;
      switch (description.type) {
        case 'offer':
          this._updateSignalingState('have-remote-offer');
          break;
        case 'answer':
          this._updateSignalingState('stable');
          break;
        default:
          throw new TypeError('unsupported type "' + description.type + '"');
      }
      window.setTimeout(function() {
        if (self.onaddstream !== null && stream.getTracks().length) {
          self.remoteStreams.push(stream);
          window.setTimeout(function() {
            self.onaddstream({stream: stream});
          }, 0);
        }
      }, 0);
      if (arguments.length > 1 && typeof arguments[1] === 'function') {
        window.setTimeout(arguments[1], 0);
      }
      return Promise.resolve();
    };

    window.RTCPeerConnection.prototype.close = function() {
      this.transceivers.forEach(function(transceiver) {
        /* not yet
        if (transceiver.iceGatherer) {
          transceiver.iceGatherer.close();
        }
        */
        if (transceiver.iceTransport) {
          transceiver.iceTransport.stop();
        }
        if (transceiver.dtlsTransport) {
          transceiver.dtlsTransport.stop();
        }
        if (transceiver.rtpSender) {
          transceiver.rtpSender.stop();
        }
        if (transceiver.rtpReceiver) {
          transceiver.rtpReceiver.stop();
        }
      });
      // FIXME: clean up tracks, local streams, remote streams, etc
      this._updateSignalingState('closed');
    };

    // Update the signaling state.
    window.RTCPeerConnection.prototype._updateSignalingState =
        function(newState) {
      this.signalingState = newState;
      if (this.onsignalingstatechange !== null) {
        this.onsignalingstatechange();
      }
    };

    // Determine whether to fire the negotiationneeded event.
    window.RTCPeerConnection.prototype._maybeFireNegotiationNeeded =
        function() {
      // Fire away (for now).
      if (this.onnegotiationneeded !== null) {
        this.onnegotiationneeded();
      }
    };

    // Update the connection state.
    window.RTCPeerConnection.prototype._updateConnectionState =
        function() {
      var self = this;
      var newState;
      var states = {
        'new': 0,
        closed: 0,
        connecting: 0,
        checking: 0,
        connected: 0,
        completed: 0,
        failed: 0
      };
      this.transceivers.forEach(function(transceiver) {
        states[transceiver.iceTransport.state]++;
        states[transceiver.dtlsTransport.state]++;
      });
      // ICETransport.completed and connected are the same for this purpose.
      states.connected += states.completed;

      newState = 'new';
      if (states.failed > 0) {
        newState = 'failed';
      } else if (states.connecting > 0 || states.checking > 0) {
        newState = 'connecting';
      } else if (states.disconnected > 0) {
        newState = 'disconnected';
      } else if (states.new > 0) {
        newState = 'new';
      } else if (states.connecting > 0 || states.completed > 0) {
        newState = 'connected';
      }

      if (newState !== self.iceConnectionState) {
        self.iceConnectionState = newState;
        if (this.oniceconnectionstatechange !== null) {
          this.oniceconnectionstatechange();
        }
      }
    };

    window.RTCPeerConnection.prototype.createOffer = function() {
      var self = this;
      if (this._pendingOffer) {
        throw new Error('createOffer called while there is a pending offer.');
      }
      var offerOptions;
      if (arguments.length === 1 && typeof arguments[0] !== 'function') {
        offerOptions = arguments[0];
      } else if (arguments.length === 3) {
        offerOptions = arguments[2];
      }

      var tracks = [];
      var numAudioTracks = 0;
      var numVideoTracks = 0;
      // Default to sendrecv.
      if (this.localStreams.length) {
        numAudioTracks = this.localStreams[0].getAudioTracks().length;
        numVideoTracks = this.localStreams[0].getVideoTracks().length;
      }
      // Determine number of audio and video tracks we need to send/recv.
      if (offerOptions) {
        // Reject Chrome legacy constraints.
        if (offerOptions.mandatory || offerOptions.optional) {
          throw new TypeError(
              'Legacy mandatory/optional constraints not supported.');
        }
        if (offerOptions.offerToReceiveAudio !== undefined) {
          numAudioTracks = offerOptions.offerToReceiveAudio;
        }
        if (offerOptions.offerToReceiveVideo !== undefined) {
          numVideoTracks = offerOptions.offerToReceiveVideo;
        }
      }
      if (this.localStreams.length) {
        // Push local streams.
        this.localStreams[0].getTracks().forEach(function(track) {
          tracks.push({
            kind: track.kind,
            track: track,
            wantReceive: track.kind === 'audio' ?
                numAudioTracks > 0 : numVideoTracks > 0
          });
          if (track.kind === 'audio') {
            numAudioTracks--;
          } else if (track.kind === 'video') {
            numVideoTracks--;
          }
        });
      }
      // Create M-lines for recvonly streams.
      while (numAudioTracks > 0 || numVideoTracks > 0) {
        if (numAudioTracks > 0) {
          tracks.push({
            kind: 'audio',
            wantReceive: true
          });
          numAudioTracks--;
        }
        if (numVideoTracks > 0) {
          tracks.push({
            kind: 'video',
            wantReceive: true
          });
          numVideoTracks--;
        }
      }

      var sdp = SDPUtils.writeSessionBoilerplate();
      var transceivers = [];
      tracks.forEach(function(mline, sdpMLineIndex) {
        // For each track, create an ice gatherer, ice transport, dtls transport,
        // potentially rtpsender and rtpreceiver.
        var track = mline.track;
        var kind = mline.kind;
        var mid = generateIdentifier();

        var transports = self._createIceAndDtlsTransports(mid, sdpMLineIndex);

        var localCapabilities = RTCRtpSender.getCapabilities(kind);
        var rtpSender;
        var rtpReceiver;

        // generate an ssrc now, to be used later in rtpSender.send
        var sendSsrc = (2 * sdpMLineIndex + 1) * 1001;
        if (track) {
          rtpSender = new RTCRtpSender(track, transports.dtlsTransport);
        }

        if (mline.wantReceive) {
          rtpReceiver = new RTCRtpReceiver(transports.dtlsTransport, kind);
        }

        transceivers[sdpMLineIndex] = {
          iceGatherer: transports.iceGatherer,
          iceTransport: transports.iceTransport,
          dtlsTransport: transports.dtlsTransport,
          localCapabilities: localCapabilities,
          remoteCapabilities: null,
          rtpSender: rtpSender,
          rtpReceiver: rtpReceiver,
          kind: kind,
          mid: mid,
          sendSsrc: sendSsrc,
          recvSsrc: null
        };
        var transceiver = transceivers[sdpMLineIndex];
        sdp += SDPUtils.writeMediaSection(transceiver,
            transceiver.localCapabilities, 'offer', self.localStreams[0]);
      });

      this._pendingOffer = transceivers;
      var desc = new RTCSessionDescription({
        type: 'offer',
        sdp: sdp
      });
      if (arguments.length && typeof arguments[0] === 'function') {
        window.setTimeout(arguments[0], 0, desc);
      }
      return Promise.resolve(desc);
    };

    window.RTCPeerConnection.prototype.createAnswer = function() {
      var self = this;
      var answerOptions;
      if (arguments.length === 1 && typeof arguments[0] !== 'function') {
        answerOptions = arguments[0];
      } else if (arguments.length === 3) {
        answerOptions = arguments[2];
      }

      var sdp = SDPUtils.writeSessionBoilerplate();
      this.transceivers.forEach(function(transceiver) {
        // Calculate intersection of capabilities.
        var commonCapabilities = self._getCommonCapabilities(
            transceiver.localCapabilities,
            transceiver.remoteCapabilities);

        sdp += SDPUtils.writeMediaSection(transceiver, commonCapabilities,
            'answer', self.localStreams[0]);
      });

      var desc = new RTCSessionDescription({
        type: 'answer',
        sdp: sdp
      });
      if (arguments.length && typeof arguments[0] === 'function') {
        window.setTimeout(arguments[0], 0, desc);
      }
      return Promise.resolve(desc);
    };

    window.RTCPeerConnection.prototype.addIceCandidate = function(candidate) {
      var mLineIndex = candidate.sdpMLineIndex;
      if (candidate.sdpMid) {
        for (var i = 0; i < this.transceivers.length; i++) {
          if (this.transceivers[i].mid === candidate.sdpMid) {
            mLineIndex = i;
            break;
          }
        }
      }
      var transceiver = this.transceivers[mLineIndex];
      if (transceiver) {
        var cand = Object.keys(candidate.candidate).length > 0 ?
            SDPUtils.parseCandidate(candidate.candidate) : {};
        // Ignore Chrome's invalid candidates since Edge does not like them.
        if (cand.protocol === 'tcp' && cand.port === 0) {
          return;
        }
        // Ignore RTCP candidates, we assume RTCP-MUX.
        if (cand.component !== '1') {
          return;
        }
        // A dirty hack to make samples work.
        if (cand.type === 'endOfCandidates') {
          cand = {};
        }
        transceiver.iceTransport.addRemoteCandidate(cand);
      }
      if (arguments.length > 1 && typeof arguments[1] === 'function') {
        window.setTimeout(arguments[1], 0);
      }
      return Promise.resolve();
    };

    window.RTCPeerConnection.prototype.getStats = function() {
      var promises = [];
      this.transceivers.forEach(function(transceiver) {
        ['rtpSender', 'rtpReceiver', 'iceGatherer', 'iceTransport',
            'dtlsTransport'].forEach(function(method) {
          if (transceiver[method]) {
            promises.push(transceiver[method].getStats());
          }
        });
      });
      var cb = arguments.length > 1 && typeof arguments[1] === 'function' &&
          arguments[1];
      return new Promise(function(resolve) {
        var results = {};
        Promise.all(promises).then(function(res) {
          res.forEach(function(result) {
            Object.keys(result).forEach(function(id) {
              results[id] = result[id];
            });
          });
          if (cb) {
            window.setTimeout(cb, 0, results);
          }
          resolve(results);
        });
      });
    };
  }
} else {
  webrtcUtils.log('Browser does not appear to be WebRTC-capable');
}

// Returns the result of getUserMedia as a Promise.
function requestUserMedia(constraints) {
  return new Promise(function(resolve, reject) {
    getUserMedia(constraints, resolve, reject);
  });
}

var webrtcTesting = {};
try {
  Object.defineProperty(webrtcTesting, 'version', {
    set: function(version) {
      webrtcDetectedVersion = version;
    }
  });
} catch (e) {}

if (typeof module !== 'undefined') {
  var RTCPeerConnection;
  var RTCIceCandidate;
  var RTCSessionDescription;
  if (typeof window !== 'undefined') {
    RTCPeerConnection = window.RTCPeerConnection;
    RTCIceCandidate = window.RTCIceCandidate;
    RTCSessionDescription = window.RTCSessionDescription;
  }
  module.exports = {
    RTCPeerConnection: RTCPeerConnection,
    RTCIceCandidate: RTCIceCandidate,
    RTCSessionDescription: RTCSessionDescription,
    getUserMedia: getUserMedia,
    attachMediaStream: attachMediaStream,
    reattachMediaStream: reattachMediaStream,
    webrtcDetectedBrowser: webrtcDetectedBrowser,
    webrtcDetectedVersion: webrtcDetectedVersion,
    webrtcMinimumVersion: webrtcMinimumVersion,
    webrtcTesting: webrtcTesting,
    webrtcUtils: webrtcUtils
    //requestUserMedia: not exposed on purpose.
    //trace: not exposed on purpose.
  };
} else if ((typeof require === 'function') && (typeof define === 'function')) {
  // Expose objects and functions when RequireJS is doing the loading.
  define([], function() {
    return {
      RTCPeerConnection: window.RTCPeerConnection,
      RTCIceCandidate: window.RTCIceCandidate,
      RTCSessionDescription: window.RTCSessionDescription,
      getUserMedia: getUserMedia,
      attachMediaStream: attachMediaStream,
      reattachMediaStream: reattachMediaStream,
      webrtcDetectedBrowser: webrtcDetectedBrowser,
      webrtcDetectedVersion: webrtcDetectedVersion,
      webrtcMinimumVersion: webrtcMinimumVersion,
      webrtcTesting: webrtcTesting,
      webrtcUtils: webrtcUtils
      //requestUserMedia: not exposed on purpose.
      //trace: not exposed on purpose.
    };
  });
}

},{}],39:[function(require,module,exports){
var copyObjectWith = require('./internal/copyObjectWith'),
    createAssigner = require('./internal/createAssigner'),
    keysIn = require('./keysIn');

/**
 * This method is like `_.assignIn` except that it accepts `customizer` which
 * is invoked to produce the assigned values. If `customizer` returns `undefined`
 * assignment is handled by the method instead. The `customizer` is invoked
 * with five arguments: (objValue, srcValue, key, object, source).
 *
 * **Note:** This method mutates `object`.
 *
 * @static
 * @memberOf _
 * @alias extendWith
 * @category Object
 * @param {Object} object The destination object.
 * @param {...Object} sources The source objects.
 * @param {Function} [customizer] The function to customize assigned values.
 * @returns {Object} Returns `object`.
 * @example
 *
 * function customizer(objValue, srcValue) {
 *   return _.isUndefined(objValue) ? srcValue : objValue;
 * }
 *
 * var defaults = _.partialRight(_.assignInWith, customizer);
 *
 * defaults({ 'a': 1 }, { 'b': 2 }, { 'a': 3 });
 * // => { 'a': 1, 'b': 2 }
 */
var assignInWith = createAssigner(function(object, source, customizer) {
  copyObjectWith(source, keysIn(source), object, customizer);
});

module.exports = assignInWith;

},{"./internal/copyObjectWith":53,"./internal/createAssigner":54,"./keysIn":70}],40:[function(require,module,exports){
var apply = require('./internal/apply'),
    assignInDefaults = require('./internal/assignInDefaults'),
    assignInWith = require('./assignInWith'),
    rest = require('./rest');

/**
 * Assigns own and inherited enumerable properties of source objects to the
 * destination object for all destination properties that resolve to `undefined`.
 * Source objects are applied from left to right. Once a property is set,
 * additional values of the same property are ignored.
 *
 * **Note:** This method mutates `object`.
 *
 * @static
 * @memberOf _
 * @category Object
 * @param {Object} object The destination object.
 * @param {...Object} [sources] The source objects.
 * @returns {Object} Returns `object`.
 * @example
 *
 * _.defaults({ 'user': 'barney' }, { 'age': 36 }, { 'user': 'fred' });
 * // => { 'user': 'barney', 'age': 36 }
 */
var defaults = rest(function(args) {
  args.push(undefined, assignInDefaults);
  return apply(assignInWith, undefined, args);
});

module.exports = defaults;

},{"./assignInWith":39,"./internal/apply":43,"./internal/assignInDefaults":46,"./rest":72}],41:[function(require,module,exports){
/**
 * Performs a [`SameValueZero`](http://ecma-international.org/ecma-262/6.0/#sec-samevaluezero)
 * comparison between two values to determine if they are equivalent.
 *
 * @static
 * @memberOf _
 * @category Lang
 * @param {*} value The value to compare.
 * @param {*} other The other value to compare.
 * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
 * @example
 *
 * var object = { 'user': 'fred' };
 * var other = { 'user': 'fred' };
 *
 * _.eq(object, object);
 * // => true
 *
 * _.eq(object, other);
 * // => false
 *
 * _.eq('a', 'a');
 * // => true
 *
 * _.eq('a', Object('a'));
 * // => false
 *
 * _.eq(NaN, NaN);
 * // => true
 */
function eq(value, other) {
  return value === other || (value !== value && other !== other);
}

module.exports = eq;

},{}],42:[function(require,module,exports){
(function (global){
/** Built-in value references. */
var Reflect = global.Reflect;

module.exports = Reflect;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],43:[function(require,module,exports){
/**
 * A faster alternative to `Function#apply`, this function invokes `func`
 * with the `this` binding of `thisArg` and the arguments of `args`.
 *
 * @private
 * @param {Function} func The function to invoke.
 * @param {*} thisArg The `this` binding of `func`.
 * @param {...*} [args] The arguments to invoke `func` with.
 * @returns {*} Returns the result of `func`.
 */
function apply(func, thisArg, args) {
  var length = args ? args.length : 0;
  switch (length) {
    case 0: return func.call(thisArg);
    case 1: return func.call(thisArg, args[0]);
    case 2: return func.call(thisArg, args[0], args[1]);
    case 3: return func.call(thisArg, args[0], args[1], args[2]);
  }
  return func.apply(thisArg, args);
}

module.exports = apply;

},{}],44:[function(require,module,exports){
/**
 * Appends the elements of `values` to `array`.
 *
 * @private
 * @param {Array} array The array to modify.
 * @param {Array} values The values to append.
 * @returns {Array} Returns `array`.
 */
function arrayPush(array, values) {
  var index = -1,
      length = values.length,
      offset = array.length;

  while (++index < length) {
    array[offset + index] = values[index];
  }
  return array;
}

module.exports = arrayPush;

},{}],45:[function(require,module,exports){
/**
 * A specialized version of `_.reduce` for arrays without support for
 * iteratee shorthands.
 *
 * @private
 * @param {Array} array The array to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @param {*} [accumulator] The initial value.
 * @param {boolean} [initFromArray] Specify using the first element of `array` as the initial value.
 * @returns {*} Returns the accumulated value.
 */
function arrayReduce(array, iteratee, accumulator, initFromArray) {
  var index = -1,
      length = array.length;

  if (initFromArray && length) {
    accumulator = array[++index];
  }
  while (++index < length) {
    accumulator = iteratee(accumulator, array[index], index, array);
  }
  return accumulator;
}

module.exports = arrayReduce;

},{}],46:[function(require,module,exports){
(function (global){
var eq = require('../eq');

/** Used for built-in method references. */
var objectProto = global.Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Used by `_.defaults` to customize its `_.assignIn` use.
 *
 * @private
 * @param {*} objValue The destination value.
 * @param {*} srcValue The source value.
 * @param {string} key The key of the property to assign.
 * @param {Object} object The parent object of `objValue`.
 * @returns {*} Returns the value to assign.
 */
function assignInDefaults(objValue, srcValue, key, object) {
  if (objValue === undefined ||
      (eq(objValue, objectProto[key]) && !hasOwnProperty.call(object, key))) {
    return srcValue;
  }
  return objValue;
}

module.exports = assignInDefaults;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"../eq":41}],47:[function(require,module,exports){
(function (global){
var eq = require('../eq');

/** Used for built-in method references. */
var objectProto = global.Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Assigns `value` to `key` of `object` if the existing value is not equivalent
 * using [`SameValueZero`](http://ecma-international.org/ecma-262/6.0/#sec-samevaluezero)
 * for equality comparisons.
 *
 * @private
 * @param {Object} object The object to modify.
 * @param {string} key The key of the property to assign.
 * @param {*} value The value to assign.
 */
function assignValue(object, key, value) {
  var objValue = object[key];
  if ((!eq(objValue, value) ||
        (eq(objValue, objectProto[key]) && !hasOwnProperty.call(object, key))) ||
      (value === undefined && !(key in object))) {
    object[key] = value;
  }
}

module.exports = assignValue;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"../eq":41}],48:[function(require,module,exports){
var arrayPush = require('./arrayPush'),
    isArguments = require('../isArguments'),
    isArray = require('../isArray'),
    isArrayLikeObject = require('../isArrayLikeObject');

/**
 * The base implementation of `_.flatten` with support for restricting flattening.
 *
 * @private
 * @param {Array} array The array to flatten.
 * @param {boolean} [isDeep] Specify a deep flatten.
 * @param {boolean} [isStrict] Restrict flattening to arrays-like objects.
 * @param {Array} [result=[]] The initial result value.
 * @returns {Array} Returns the new flattened array.
 */
function baseFlatten(array, isDeep, isStrict, result) {
  result || (result = []);

  var index = -1,
      length = array.length;

  while (++index < length) {
    var value = array[index];
    if (isArrayLikeObject(value) &&
        (isStrict || isArray(value) || isArguments(value))) {
      if (isDeep) {
        // Recursively flatten arrays (susceptible to call stack limits).
        baseFlatten(value, isDeep, isStrict, result);
      } else {
        arrayPush(result, value);
      }
    } else if (!isStrict) {
      result[result.length] = value;
    }
  }
  return result;
}

module.exports = baseFlatten;

},{"../isArguments":61,"../isArray":62,"../isArrayLikeObject":64,"./arrayPush":44}],49:[function(require,module,exports){
(function (global){
var Reflect = require('./Reflect'),
    iteratorToArray = require('./iteratorToArray');

/** Used for built-in method references. */
var objectProto = global.Object.prototype;

/** Built-in value references. */
var enumerate = Reflect ? Reflect.enumerate : undefined,
    propertyIsEnumerable = objectProto.propertyIsEnumerable;

/**
 * The base implementation of `_.keysIn` which doesn't skip the constructor
 * property of prototypes or treat sparse arrays as dense.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 */
function baseKeysIn(object) {
  object = object == null ? object : Object(object);

  var result = [];
  for (var key in object) {
    result.push(key);
  }
  return result;
}

// Fallback for IE < 9 with es6-shim.
if (enumerate && !propertyIsEnumerable.call({ 'valueOf': 1 }, 'valueOf')) {
  baseKeysIn = function(object) {
    return iteratorToArray(enumerate(object));
  };
}

module.exports = baseKeysIn;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"./Reflect":42,"./iteratorToArray":60}],50:[function(require,module,exports){
var arrayReduce = require('./arrayReduce');

/**
 * The base implementation of `_.pick` without support for individual
 * property names.
 *
 * @private
 * @param {Object} object The source object.
 * @param {string[]} props The property names to pick.
 * @returns {Object} Returns the new object.
 */
function basePick(object, props) {
  object = Object(object);
  return arrayReduce(props, function(result, key) {
    if (key in object) {
      result[key] = object[key];
    }
    return result;
  }, {});
}

module.exports = basePick;

},{"./arrayReduce":45}],51:[function(require,module,exports){
/**
 * The base implementation of `_.property` without support for deep paths.
 *
 * @private
 * @param {string} key The key of the property to get.
 * @returns {Function} Returns the new function.
 */
function baseProperty(key) {
  return function(object) {
    return object == null ? undefined : object[key];
  };
}

module.exports = baseProperty;

},{}],52:[function(require,module,exports){
/**
 * The base implementation of `_.times` without support for iteratee shorthands
 * or max array length checks.
 *
 * @private
 * @param {number} n The number of times to invoke `iteratee`.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array} Returns the array of results.
 */
function baseTimes(n, iteratee) {
  var index = -1,
      result = Array(n);

  while (++index < n) {
    result[index] = iteratee(index);
  }
  return result;
}

module.exports = baseTimes;

},{}],53:[function(require,module,exports){
var assignValue = require('./assignValue');

/**
 * This function is like `copyObject` except that it accepts a function to
 * customize copied values.
 *
 * @private
 * @param {Object} source The object to copy properties from.
 * @param {Array} props The property names to copy.
 * @param {Object} [object={}] The object to copy properties to.
 * @param {Function} [customizer] The function to customize copied values.
 * @returns {Object} Returns `object`.
 */
function copyObjectWith(source, props, object, customizer) {
  object || (object = {});

  var index = -1,
      length = props.length;

  while (++index < length) {
    var key = props[index],
        newValue = customizer ? customizer(object[key], source[key], key, object, source) : source[key];

    assignValue(object, key, newValue);
  }
  return object;
}

module.exports = copyObjectWith;

},{"./assignValue":47}],54:[function(require,module,exports){
var isIterateeCall = require('./isIterateeCall'),
    rest = require('../rest');

/**
 * Creates a function like `_.assign`.
 *
 * @private
 * @param {Function} assigner The function to assign values.
 * @returns {Function} Returns the new assigner function.
 */
function createAssigner(assigner) {
  return rest(function(object, sources) {
    var index = -1,
        length = sources.length,
        customizer = length > 1 ? sources[length - 1] : undefined,
        guard = length > 2 ? sources[2] : undefined;

    customizer = typeof customizer == 'function' ? (length--, customizer) : undefined;
    if (guard && isIterateeCall(sources[0], sources[1], guard)) {
      customizer = length < 3 ? undefined : customizer;
      length = 1;
    }
    object = Object(object);
    while (++index < length) {
      var source = sources[index];
      if (source) {
        assigner(object, source, customizer);
      }
    }
    return object;
  });
}

module.exports = createAssigner;

},{"../rest":72,"./isIterateeCall":58}],55:[function(require,module,exports){
var baseProperty = require('./baseProperty');

/**
 * Gets the "length" property value of `object`.
 *
 * **Note:** This function is used to avoid a [JIT bug](https://bugs.webkit.org/show_bug.cgi?id=142792)
 * that affects Safari on at least iOS 8.1-8.3 ARM64.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {*} Returns the "length" value.
 */
var getLength = baseProperty('length');

module.exports = getLength;

},{"./baseProperty":51}],56:[function(require,module,exports){
var baseTimes = require('./baseTimes'),
    isArguments = require('../isArguments'),
    isArray = require('../isArray'),
    isLength = require('../isLength'),
    isString = require('../isString');

/**
 * Creates an array of index keys for `object` values of arrays,
 * `arguments` objects, and strings, otherwise `null` is returned.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array|null} Returns index keys, else `null`.
 */
function indexKeys(object) {
  var length = object ? object.length : undefined;
  return (isLength(length) && (isArray(object) || isString(object) || isArguments(object)))
    ? baseTimes(length, String)
    : null;
}

module.exports = indexKeys;

},{"../isArguments":61,"../isArray":62,"../isLength":66,"../isString":69,"./baseTimes":52}],57:[function(require,module,exports){
/** Used as references for various `Number` constants. */
var MAX_SAFE_INTEGER = 9007199254740991;

/** Used to detect unsigned integer values. */
var reIsUint = /^(?:0|[1-9]\d*)$/;

/**
 * Checks if `value` is a valid array-like index.
 *
 * @private
 * @param {*} value The value to check.
 * @param {number} [length=MAX_SAFE_INTEGER] The upper bounds of a valid index.
 * @returns {boolean} Returns `true` if `value` is a valid index, else `false`.
 */
function isIndex(value, length) {
  value = (typeof value == 'number' || reIsUint.test(value)) ? +value : -1;
  length = length == null ? MAX_SAFE_INTEGER : length;
  return value > -1 && value % 1 == 0 && value < length;
}

module.exports = isIndex;

},{}],58:[function(require,module,exports){
var eq = require('../eq'),
    isArrayLike = require('../isArrayLike'),
    isIndex = require('./isIndex'),
    isObject = require('../isObject');

/**
 * Checks if the provided arguments are from an iteratee call.
 *
 * @private
 * @param {*} value The potential iteratee value argument.
 * @param {*} index The potential iteratee index or key argument.
 * @param {*} object The potential iteratee object argument.
 * @returns {boolean} Returns `true` if the arguments are from an iteratee call, else `false`.
 */
function isIterateeCall(value, index, object) {
  if (!isObject(object)) {
    return false;
  }
  var type = typeof index;
  if (type == 'number'
      ? (isArrayLike(object) && isIndex(index, object.length))
      : (type == 'string' && index in object)) {
    return eq(object[index], value);
  }
  return false;
}

module.exports = isIterateeCall;

},{"../eq":41,"../isArrayLike":63,"../isObject":67,"./isIndex":57}],59:[function(require,module,exports){
(function (global){
/** Used for built-in method references. */
var objectProto = global.Object.prototype;

/**
 * Checks if `value` is likely a prototype object.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a prototype, else `false`.
 */
function isPrototype(value) {
  var Ctor = value && value.constructor,
      proto = (typeof Ctor == 'function' && Ctor.prototype) || objectProto;

  return value === proto;
}

module.exports = isPrototype;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],60:[function(require,module,exports){
/**
 * Converts `iterator` to an array.
 *
 * @private
 * @param {Object} iterator The iterator to convert.
 * @returns {Array} Returns the converted array.
 */
function iteratorToArray(iterator) {
  var data,
      result = [];

  while (!(data = iterator.next()).done) {
    result.push(data.value);
  }
  return result;
}

module.exports = iteratorToArray;

},{}],61:[function(require,module,exports){
(function (global){
var isArrayLikeObject = require('./isArrayLikeObject');

/** `Object#toString` result references. */
var argsTag = '[object Arguments]';

/** Used for built-in method references. */
var objectProto = global.Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Used to resolve the [`toStringTag`](http://ecma-international.org/ecma-262/6.0/#sec-object.prototype.tostring)
 * of values.
 */
var objectToString = objectProto.toString;

/** Built-in value references. */
var propertyIsEnumerable = objectProto.propertyIsEnumerable;

/**
 * Checks if `value` is likely an `arguments` object.
 *
 * @static
 * @memberOf _
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
 * @example
 *
 * _.isArguments(function() { return arguments; }());
 * // => true
 *
 * _.isArguments([1, 2, 3]);
 * // => false
 */
function isArguments(value) {
  // Safari 8.1 incorrectly makes `arguments.callee` enumerable in strict mode.
  return isArrayLikeObject(value) && hasOwnProperty.call(value, 'callee') &&
    (!propertyIsEnumerable.call(value, 'callee') || objectToString.call(value) == argsTag);
}

module.exports = isArguments;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"./isArrayLikeObject":64}],62:[function(require,module,exports){
/**
 * Checks if `value` is classified as an `Array` object.
 *
 * @static
 * @memberOf _
 * @type Function
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
 * @example
 *
 * _.isArray([1, 2, 3]);
 * // => true
 *
 * _.isArray(document.body.children);
 * // => false
 *
 * _.isArray('abc');
 * // => false
 *
 * _.isArray(_.noop);
 * // => false
 */
var isArray = Array.isArray;

module.exports = isArray;

},{}],63:[function(require,module,exports){
var getLength = require('./internal/getLength'),
    isFunction = require('./isFunction'),
    isLength = require('./isLength');

/**
 * Checks if `value` is array-like. A value is considered array-like if it's
 * not a function and has a `value.length` that's an integer greater than or
 * equal to `0` and less than or equal to `Number.MAX_SAFE_INTEGER`.
 *
 * @static
 * @memberOf _
 * @type Function
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is array-like, else `false`.
 * @example
 *
 * _.isArrayLike([1, 2, 3]);
 * // => true
 *
 * _.isArrayLike(document.body.children);
 * // => true
 *
 * _.isArrayLike('abc');
 * // => true
 *
 * _.isArrayLike(_.noop);
 * // => false
 */
function isArrayLike(value) {
  return value != null &&
    !(typeof value == 'function' && isFunction(value)) && isLength(getLength(value));
}

module.exports = isArrayLike;

},{"./internal/getLength":55,"./isFunction":65,"./isLength":66}],64:[function(require,module,exports){
var isArrayLike = require('./isArrayLike'),
    isObjectLike = require('./isObjectLike');

/**
 * This method is like `_.isArrayLike` except that it also checks if `value`
 * is an object.
 *
 * @static
 * @memberOf _
 * @type Function
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an array-like object, else `false`.
 * @example
 *
 * _.isArrayLikeObject([1, 2, 3]);
 * // => true
 *
 * _.isArrayLikeObject(document.body.children);
 * // => true
 *
 * _.isArrayLikeObject('abc');
 * // => false
 *
 * _.isArrayLikeObject(_.noop);
 * // => false
 */
function isArrayLikeObject(value) {
  return isObjectLike(value) && isArrayLike(value);
}

module.exports = isArrayLikeObject;

},{"./isArrayLike":63,"./isObjectLike":68}],65:[function(require,module,exports){
(function (global){
var isObject = require('./isObject');

/** `Object#toString` result references. */
var funcTag = '[object Function]',
    genTag = '[object GeneratorFunction]';

/** Used for built-in method references. */
var objectProto = global.Object.prototype;

/**
 * Used to resolve the [`toStringTag`](http://ecma-international.org/ecma-262/6.0/#sec-object.prototype.tostring)
 * of values.
 */
var objectToString = objectProto.toString;

/**
 * Checks if `value` is classified as a `Function` object.
 *
 * @static
 * @memberOf _
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
 * @example
 *
 * _.isFunction(_);
 * // => true
 *
 * _.isFunction(/abc/);
 * // => false
 */
function isFunction(value) {
  // The use of `Object#toString` avoids issues with the `typeof` operator
  // in Safari 8 which returns 'object' for typed array constructors, and
  // PhantomJS 1.9 which returns 'function' for `NodeList` instances.
  var tag = isObject(value) ? objectToString.call(value) : '';
  return tag == funcTag || tag == genTag;
}

module.exports = isFunction;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"./isObject":67}],66:[function(require,module,exports){
/** Used as references for various `Number` constants. */
var MAX_SAFE_INTEGER = 9007199254740991;

/**
 * Checks if `value` is a valid array-like length.
 *
 * **Note:** This function is loosely based on [`ToLength`](http://ecma-international.org/ecma-262/6.0/#sec-tolength).
 *
 * @static
 * @memberOf _
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a valid length, else `false`.
 * @example
 *
 * _.isLength(3);
 * // => true
 *
 * _.isLength(Number.MIN_VALUE);
 * // => false
 *
 * _.isLength(Infinity);
 * // => false
 *
 * _.isLength('3');
 * // => false
 */
function isLength(value) {
  return typeof value == 'number' && value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
}

module.exports = isLength;

},{}],67:[function(require,module,exports){
/**
 * Checks if `value` is the [language type](https://es5.github.io/#x8) of `Object`.
 * (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(_.noop);
 * // => true
 *
 * _.isObject(null);
 * // => false
 */
function isObject(value) {
  // Avoid a V8 JIT bug in Chrome 19-20.
  // See https://code.google.com/p/v8/issues/detail?id=2291 for more details.
  var type = typeof value;
  return !!value && (type == 'object' || type == 'function');
}

module.exports = isObject;

},{}],68:[function(require,module,exports){
/**
 * Checks if `value` is object-like. A value is object-like if it's not `null`
 * and has a `typeof` result of "object".
 *
 * @static
 * @memberOf _
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 * @example
 *
 * _.isObjectLike({});
 * // => true
 *
 * _.isObjectLike([1, 2, 3]);
 * // => true
 *
 * _.isObjectLike(_.noop);
 * // => false
 *
 * _.isObjectLike(null);
 * // => false
 */
function isObjectLike(value) {
  return !!value && typeof value == 'object';
}

module.exports = isObjectLike;

},{}],69:[function(require,module,exports){
(function (global){
var isArray = require('./isArray'),
    isObjectLike = require('./isObjectLike');

/** `Object#toString` result references. */
var stringTag = '[object String]';

/** Used for built-in method references. */
var objectProto = global.Object.prototype;

/**
 * Used to resolve the [`toStringTag`](http://ecma-international.org/ecma-262/6.0/#sec-object.prototype.tostring)
 * of values.
 */
var objectToString = objectProto.toString;

/**
 * Checks if `value` is classified as a `String` primitive or object.
 *
 * @static
 * @memberOf _
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
 * @example
 *
 * _.isString('abc');
 * // => true
 *
 * _.isString(1);
 * // => false
 */
function isString(value) {
  return typeof value == 'string' ||
    (!isArray(value) && isObjectLike(value) && objectToString.call(value) == stringTag);
}

module.exports = isString;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"./isArray":62,"./isObjectLike":68}],70:[function(require,module,exports){
(function (global){
var baseKeysIn = require('./internal/baseKeysIn'),
    indexKeys = require('./internal/indexKeys'),
    isIndex = require('./internal/isIndex'),
    isPrototype = require('./internal/isPrototype');

/** Used for built-in method references. */
var objectProto = global.Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Creates an array of the own and inherited enumerable property names of `object`.
 *
 * **Note:** Non-object values are coerced to objects.
 *
 * @static
 * @memberOf _
 * @category Object
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 * @example
 *
 * function Foo() {
 *   this.a = 1;
 *   this.b = 2;
 * }
 *
 * Foo.prototype.c = 3;
 *
 * _.keysIn(new Foo);
 * // => ['a', 'b', 'c'] (iteration order is not guaranteed)
 */
function keysIn(object) {
  var index = -1,
      isProto = isPrototype(object),
      props = baseKeysIn(object),
      propsLength = props.length,
      indexes = indexKeys(object),
      skipIndexes = !!indexes,
      result = indexes || [],
      length = result.length;

  while (++index < propsLength) {
    var key = props[index];
    if (!(skipIndexes && (key == 'length' || isIndex(key, length))) &&
        !(key == 'constructor' && (isProto || !hasOwnProperty.call(object, key)))) {
      result.push(key);
    }
  }
  return result;
}

module.exports = keysIn;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"./internal/baseKeysIn":49,"./internal/indexKeys":56,"./internal/isIndex":57,"./internal/isPrototype":59}],71:[function(require,module,exports){
var baseFlatten = require('./internal/baseFlatten'),
    basePick = require('./internal/basePick'),
    rest = require('./rest');

/**
 * Creates an object composed of the picked `object` properties.
 *
 * @static
 * @memberOf _
 * @category Object
 * @param {Object} object The source object.
 * @param {...(string|string[])} [props] The property names to pick, specified
 *  individually or in arrays.
 * @returns {Object} Returns the new object.
 * @example
 *
 * var object = { 'a': 1, 'b': '2', 'c': 3 };
 *
 * _.pick(object, ['a', 'c']);
 * // => { 'a': 1, 'c': 3 }
 */
var pick = rest(function(object, props) {
  return object == null ? {} : basePick(object, baseFlatten(props));
});

module.exports = pick;

},{"./internal/baseFlatten":48,"./internal/basePick":50,"./rest":72}],72:[function(require,module,exports){
var apply = require('./internal/apply'),
    toInteger = require('./toInteger');

/** Used as the `TypeError` message for "Functions" methods. */
var FUNC_ERROR_TEXT = 'Expected a function';

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeMax = Math.max;

/**
 * Creates a function that invokes `func` with the `this` binding of the
 * created function and arguments from `start` and beyond provided as an array.
 *
 * **Note:** This method is based on the [rest parameter](https://mdn.io/rest_parameters).
 *
 * @static
 * @memberOf _
 * @category Function
 * @param {Function} func The function to apply a rest parameter to.
 * @param {number} [start=func.length-1] The start position of the rest parameter.
 * @returns {Function} Returns the new function.
 * @example
 *
 * var say = _.rest(function(what, names) {
 *   return what + ' ' + _.initial(names).join(', ') +
 *     (_.size(names) > 1 ? ', & ' : '') + _.last(names);
 * });
 *
 * say('hello', 'fred', 'barney', 'pebbles');
 * // => 'hello fred, barney, & pebbles'
 */
function rest(func, start) {
  if (typeof func != 'function') {
    throw new TypeError(FUNC_ERROR_TEXT);
  }
  start = nativeMax(start === undefined ? (func.length - 1) : toInteger(start), 0);
  return function() {
    var args = arguments,
        index = -1,
        length = nativeMax(args.length - start, 0),
        array = Array(length);

    while (++index < length) {
      array[index] = args[start + index];
    }
    switch (start) {
      case 0: return func.call(this, array);
      case 1: return func.call(this, args[0], array);
      case 2: return func.call(this, args[0], args[1], array);
    }
    var otherArgs = Array(start + 1);
    index = -1;
    while (++index < start) {
      otherArgs[index] = args[index];
    }
    otherArgs[start] = array;
    return apply(func, this, otherArgs);
  };
}

module.exports = rest;

},{"./internal/apply":43,"./toInteger":73}],73:[function(require,module,exports){
var toNumber = require('./toNumber');

/** Used as references for various `Number` constants. */
var INFINITY = 1 / 0,
    MAX_INTEGER = 1.7976931348623157e+308;

/**
 * Converts `value` to an integer.
 *
 * **Note:** This function is loosely based on [`ToInteger`](http://www.ecma-international.org/ecma-262/6.0/#sec-tointeger).
 *
 * @static
 * @memberOf _
 * @category Lang
 * @param {*} value The value to convert.
 * @returns {number} Returns the converted integer.
 * @example
 *
 * _.toInteger(3);
 * // => 3
 *
 * _.toInteger(Number.MIN_VALUE);
 * // => 0
 *
 * _.toInteger(Infinity);
 * // => 1.7976931348623157e+308
 *
 * _.toInteger('3');
 * // => 3
 */
function toInteger(value) {
  if (!value) {
    return value === 0 ? value : 0;
  }
  value = toNumber(value);
  if (value === INFINITY || value === -INFINITY) {
    var sign = (value < 0 ? -1 : 1);
    return sign * MAX_INTEGER;
  }
  var remainder = value % 1;
  return value === value ? (remainder ? value - remainder : value) : 0;
}

module.exports = toInteger;

},{"./toNumber":74}],74:[function(require,module,exports){
var isFunction = require('./isFunction'),
    isObject = require('./isObject');

/** Used as references for various `Number` constants. */
var NAN = 0 / 0;

/** Used to match leading and trailing whitespace. */
var reTrim = /^\s+|\s+$/g;

/** Used to detect bad signed hexadecimal string values. */
var reIsBadHex = /^[-+]0x[0-9a-f]+$/i;

/** Used to detect binary string values. */
var reIsBinary = /^0b[01]+$/i;

/** Used to detect octal string values. */
var reIsOctal = /^0o[0-7]+$/i;

/** Built-in method references without a dependency on `global`. */
var freeParseInt = parseInt;

/**
 * Converts `value` to a number.
 *
 * @static
 * @memberOf _
 * @category Lang
 * @param {*} value The value to process.
 * @returns {number} Returns the number.
 * @example
 *
 * _.toNumber(3);
 * // => 3
 *
 * _.toNumber(Number.MIN_VALUE);
 * // => 5e-324
 *
 * _.toNumber(Infinity);
 * // => Infinity
 *
 * _.toNumber('3');
 * // => 3
 */
function toNumber(value) {
  if (isObject(value)) {
    var other = isFunction(value.valueOf) ? value.valueOf() : value;
    value = isObject(other) ? (other + '') : other;
  }
  if (typeof value != 'string') {
    return value === 0 ? value : +value;
  }
  value = value.replace(reTrim, '');
  var isBinary = reIsBinary.test(value);
  return (isBinary || reIsOctal.test(value))
    ? freeParseInt(value.slice(2), isBinary ? 2 : 8)
    : (reIsBadHex.test(value) ? NAN : +value);
}

module.exports = toNumber;

},{"./isFunction":65,"./isObject":67}],75:[function(require,module,exports){
(function (Buffer){
// loosely based on https://www.npmjs.com/package/microphone-stream
var defaults = require('lodash/defaults');
var Readable = require('stream').Readable;
var util = require('util');

function MicStream(stream, opts) {
    defaults(opts, {
        bufferSize: 4096
    });

    Readable.call(this, opts);


    this.bufferUnusedSamples = new Float32Array(0);
    var context = this.audioContext = new AudioContext();
    var audioInput = context.createMediaStreamSource(stream);
    var inputChannels = 1, outputChannels = 0;
    var recorder = context.createScriptProcessor(opts.bufferSize, inputChannels, outputChannels);

    var self = this;
    var recording = true; // onaudioprocess can be called at least once after we've stopped
    recorder.onaudioprocess = function(e) {
        if (recording) {
            var raw = new Float32Array(e.inputBuffer.getChannelData(0));
            self.push(self._exportDataBufferTo16Khz(raw));
        }
    };

    audioInput.connect(recorder);

    this.stop = function() {
        stream.getTracks()[0].stop();
        recorder.disconnect(0);
        recording = false;
        self.push(null);
    }
}
util.inherits(MicStream, Readable);

/**
 * Creates a Blob type: 'audio/l16' with the chunk and downsampling to 16 kHz
 * coming from the microphone.
 *
 * Explanation for the math: The raw values captured from the Web Audio API are
 * in 32-bit Floating Point, between -1 and 1 (per the specification).
 * The values for 16-bit PCM range between -32768 and +32767 (16-bit signed integer).
 * Multiply to control the volume of the output. We store in little endian.
 *
 * @param  {Object} buffer Microphone audio chunk
 * @return {Blob} 'audio/l16' chunk
 * @deprecated This method is depracated
 */
MicStream.prototype._exportDataBufferTo16Khz = function(bufferNewSamples) {
    var buffer = null,
        newSamples = bufferNewSamples.length,
        unusedSamples = this.bufferUnusedSamples.length;


    if (unusedSamples > 0) {
        buffer = new Float32Array(unusedSamples + newSamples);
        for (var i = 0; i < unusedSamples; ++i) {
            buffer[i] = this.bufferUnusedSamples[i];
        }
        for (i = 0; i < newSamples; ++i) {
            buffer[unusedSamples + i] = bufferNewSamples[i];
        }
    } else {
        buffer = bufferNewSamples;
    }

    // downsampling variables
    var filter = [
            -0.037935, -0.00089024, 0.040173, 0.019989, 0.0047792, -0.058675, -0.056487,
            -0.0040653, 0.14527, 0.26927, 0.33913, 0.26927, 0.14527, -0.0040653, -0.056487,
            -0.058675, 0.0047792, 0.019989, 0.040173, -0.00089024, -0.037935
        ],
        samplingRateRatio = this.audioContext.sampleRate / 16000,
        nOutputSamples = Math.floor((buffer.length - filter.length) / (samplingRateRatio)) + 1,
        pcmEncodedBuffer16k = new ArrayBuffer(nOutputSamples * 2),
        dataView16k = new DataView(pcmEncodedBuffer16k),
        index = 0,
        volume = 0x7FFF, //range from 0 to 0x7FFF to control the volume
        nOut = 0;

    for (i = 0; i + filter.length - 1 < buffer.length; i = Math.round(samplingRateRatio * nOut)) {
        var sample = 0;
        for (var j = 0; j < filter.length; ++j) {
            sample += buffer[i + j] * filter[j];
        }
        sample *= volume;
        dataView16k.setInt16(index, sample, true); // 'true' -> means little endian
        index += 2;
        nOut++;
    }

    var indexSampleAfterLastUsed = Math.round(samplingRateRatio * nOut);
    var remaining = buffer.length - indexSampleAfterLastUsed;
    if (remaining > 0) {
        this.bufferUnusedSamples = new Float32Array(remaining);
        for (i = 0; i < remaining; ++i) {
            this.bufferUnusedSamples[i] = buffer[indexSampleAfterLastUsed + i];
        }
    } else {
        this.bufferUnusedSamples = new Float32Array(0);
    }

    return new Buffer(dataView16k.buffer);
};

MicStream.prototype._read = function() {
    // no-op, (flow-control doesn't really work on sound)
};


module.exports = MicStream;

}).call(this,require("buffer").Buffer)

},{"buffer":8,"lodash/defaults":40,"stream":33,"util":36}],76:[function(require,module,exports){
/**
 * Copyright 2015 IBM Corp. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the 'License');
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an 'AS IS' BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/* global OfflineAudioContext */
'use strict';

/**
 * Captures microphone input from the browser.
 * Works at least on latest versions of Firefox and Chrome
 */
function Microphone(_options) {
  var options = _options || {};

  // we record in mono because the speech recognition service
  // does not support stereo.
  this.bufferSize = options.bufferSize || 8192;
  this.inputChannels = options.inputChannels || 1;
  this.outputChannels = options.outputChannels || 1;
  this.recording = false;
  this.requestedAccess = false;
  this.sampleRate = 16000;
  // auxiliar buffer to keep unused samples (used when doing downsampling)
  this.bufferUnusedSamples = new Float32Array(0);
  this.samplesAll = new Float32Array(20000000);
  this.samplesAllOffset = 0;

  // Chrome or Firefox or IE User media
  if (!navigator.getUserMedia) {
    navigator.getUserMedia = navigator.webkitGetUserMedia ||
    navigator.mozGetUserMedia || navigator.msGetUserMedia;
  }

}

/**
 * Called when the user reject the use of the michrophone
 * @param  error The error
 */
Microphone.prototype.onPermissionRejected = function() {
  console.log('Microphone.onPermissionRejected()');
  this.requestedAccess = false;
  this.onError('Permission to access the microphone rejeted.');
};

Microphone.prototype.onError = function(error) {
  console.log('Microphone.onError():', error);
};

/**
 * Called when the user authorizes the use of the microphone.
 * @param  {Object} stream The Stream to connect to
 *
 */
Microphone.prototype.onMediaStream =  function(stream) {
  var AudioCtx = window.AudioContext || window.webkitAudioContext;

  if (!AudioCtx)
    throw new Error('AudioContext not available');

  if (!this.audioContext)
    this.audioContext = new AudioCtx();

  var gain = this.audioContext.createGain();
  var audioInput = this.audioContext.createMediaStreamSource(stream);

  audioInput.connect(gain);

  if(!this.mic) {
  this.mic = this.audioContext.createScriptProcessor(this.bufferSize,
    this.inputChannels, this.outputChannels);
  }

  // uncomment the following line if you want to use your microphone sample rate
  //this.sampleRate = this.audioContext.sampleRate;
  console.log('Microphone.onMediaStream(): sampling rate is:', this.sampleRate);

  this.mic.onaudioprocess = this._onaudioprocess.bind(this);
  this.stream = stream;

  gain.connect(this.mic);
  this.mic.connect(this.audioContext.destination);
  this.recording = true;
  this.requestedAccess = false;
  this.onStartRecording();
};

/**
 * callback that is being used by the microphone
 * to send audio chunks.
 * @param  {object} data audio
 */
Microphone.prototype._onaudioprocess = function(data) {
  if (!this.recording) {
    // We speak but we are not recording
    return;
  }

  // Single channel
  var chan = data.inputBuffer.getChannelData(0);

  //resampler(this.audioContext.sampleRate,data.inputBuffer,this.onAudio);

  this.saveData(new Float32Array(chan));
  this.onAudio(this._exportDataBufferTo16Khz(new Float32Array(chan)));

  //export with microphone mhz, remember to update the this.sampleRate
  // with the sample rate from your microphone
  // this.onAudio(this._exportDataBuffer(new Float32Array(chan)));

};

/**
 * Start the audio recording
 */
Microphone.prototype.record = function() {
  if (!navigator.getUserMedia){
    this.onError('Browser doesn\'t support microphone input');
    return;
  }
  if (this.requestedAccess) {
    return;
  }

  this.requestedAccess = true;
  navigator.getUserMedia({ audio: true },
    this.onMediaStream.bind(this), // Microphone permission granted
    this.onPermissionRejected.bind(this)); // Microphone permission rejected
};

/**
 * Stop the audio recording
 */
Microphone.prototype.stop = function() {
  //if (!this.recording)
  //  return;
  this.recording = false;
  if (this.stream) {
    this.stream.getTracks()[0].stop();
    this.requestedAccess = false;
    this.mic.disconnect(0);
  }
  this.onStopRecording();
};

/**
 * Creates a Blob type: 'audio/l16' with the chunk and downsampling to 16 kHz
 * coming from the microphone.
 * Explanation for the math: The raw values captured from the Web Audio API are
 * in 32-bit Floating Point, between -1 and 1 (per the specification).
 * The values for 16-bit PCM range between -32768 and +32767 (16-bit signed integer).
 * Multiply to control the volume of the output. We store in little endian.
 * @param  {Object} buffer Microphone audio chunk
 * @return {Blob} 'audio/l16' chunk
 * @deprecated This method is depracated
 */
Microphone.prototype._exportDataBufferTo16Khz = function(bufferNewSamples) {
  var buffer = null,
    newSamples = bufferNewSamples.length,
    unusedSamples = this.bufferUnusedSamples.length;


  if (unusedSamples > 0) {
    buffer = new Float32Array(unusedSamples + newSamples);
    for (var i = 0; i < unusedSamples; ++i) {
      buffer[i] = this.bufferUnusedSamples[i];
    }
    for (i = 0; i < newSamples; ++i) {
      buffer[unusedSamples + i] = bufferNewSamples[i];
    }
  } else {
    buffer = bufferNewSamples;
  }

  // downsampling variables
  var filter = [
      -0.037935, -0.00089024, 0.040173, 0.019989, 0.0047792, -0.058675, -0.056487,
      -0.0040653, 0.14527, 0.26927, 0.33913, 0.26927, 0.14527, -0.0040653, -0.056487,
      -0.058675, 0.0047792, 0.019989, 0.040173, -0.00089024, -0.037935
    ],
    samplingRateRatio = this.audioContext.sampleRate / 16000,
    nOutputSamples = Math.floor((buffer.length - filter.length) / (samplingRateRatio)) + 1,
    pcmEncodedBuffer16k = new ArrayBuffer(nOutputSamples * 2),
    dataView16k = new DataView(pcmEncodedBuffer16k),
    index = 0,
    volume = 0x7FFF, //range from 0 to 0x7FFF to control the volume
    nOut = 0;

  for (var i = 0; i + filter.length - 1 < buffer.length; i = Math.round(samplingRateRatio * nOut)) {
    var sample = 0;
    for (var j = 0; j < filter.length; ++j) {
      sample += buffer[i + j] * filter[j];
    }
    sample *= volume;
    dataView16k.setInt16(index, sample, true); // 'true' -> means little endian
    index += 2;
    nOut++;
  }

  var indexSampleAfterLastUsed = Math.round(samplingRateRatio * nOut);
  var remaining = buffer.length - indexSampleAfterLastUsed;
  if (remaining > 0) {
    this.bufferUnusedSamples = new Float32Array(remaining);
    for (i = 0; i < remaining; ++i) {
      this.bufferUnusedSamples[i] = buffer[indexSampleAfterLastUsed + i];
    }
  } else {
    this.bufferUnusedSamples = new Float32Array(0);
  }

  return new Blob([dataView16k], {
    type: 'audio/l16'
  });
  };



// native way of resampling captured audio
var resampler = function(sampleRate, audioBuffer, callbackProcessAudio) {

  console.log('length: ' + audioBuffer.length + ' ' + sampleRate);
  var channels = 1;
  var targetSampleRate = 16000;
  var numSamplesTarget = audioBuffer.length * targetSampleRate / sampleRate;

  var offlineContext = new OfflineAudioContext(channels, numSamplesTarget, targetSampleRate);
  var bufferSource = offlineContext.createBufferSource();
  bufferSource.buffer = audioBuffer;

  // callback that is called when the resampling finishes
  offlineContext.oncomplete = function(event) {
    var samplesTarget = event.renderedBuffer.getChannelData(0);
    console.log('Done resampling: ' + samplesTarget.length + ' samples produced');

  // convert from [-1,1] range of floating point numbers to [-32767,32767] range of integers
  var index = 0;
  var volume = 0x7FFF;
    var pcmEncodedBuffer = new ArrayBuffer(samplesTarget.length*2);    // short integer to byte
    var dataView = new DataView(pcmEncodedBuffer);
    for (var i = 0; i < samplesTarget.length; i++) {
      dataView.setInt16(index, samplesTarget[i]*volume, true);
      index += 2;
    }

    // l16 is the MIME type for 16-bit PCM
    callbackProcessAudio(new Blob([dataView], { type: 'audio/l16' }));
  };

  bufferSource.connect(offlineContext.destination);
  bufferSource.start(0);
  offlineContext.startRendering();
};



/**
 * Creates a Blob type: 'audio/l16' with the
 * chunk coming from the microphone.
 */
var exportDataBuffer = function(buffer, bufferSize) {
  var pcmEncodedBuffer = null,
    dataView = null,
    index = 0,
    volume = 0x7FFF; //range from 0 to 0x7FFF to control the volume

  pcmEncodedBuffer = new ArrayBuffer(bufferSize * 2);
  dataView = new DataView(pcmEncodedBuffer);

  /* Explanation for the math: The raw values captured from the Web Audio API are
   * in 32-bit Floating Point, between -1 and 1 (per the specification).
   * The values for 16-bit PCM range between -32768 and +32767 (16-bit signed integer).
   * Multiply to control the volume of the output. We store in little endian.
   */
  for (var i = 0; i < buffer.length; i++) {
    dataView.setInt16(index, buffer[i] * volume, true);
    index += 2;
  }

  // l16 is the MIME type for 16-bit PCM
  return new Blob([dataView], { type: 'audio/l16' });
};

Microphone.prototype._exportDataBuffer = function(buffer){
  utils.exportDataBuffer(buffer, this.bufferSize);
};


// Functions used to control Microphone events listeners.
Microphone.prototype.onStartRecording =  function() {};
Microphone.prototype.onStopRecording =  function() {};
Microphone.prototype.onAudio =  function() {};

module.exports = Microphone;

// does this save it in memory forever?
Microphone.prototype.saveData = function(samples) {
  for(var i=0 ; i < samples.length ; ++i) {
    this.samplesAll[this.samplesAllOffset+i] = samples[i];
  }	
  this.samplesAllOffset += samples.length; 
  console.log("samples: " + this.samplesAllOffset, samples[samples.length-1]);
}

Microphone.prototype.playWav = function() {
  var samples = this.samplesAll.subarray(0, this.samplesAllOffset);
  var dataview = this.encodeWav(samples, 1, this.audioContext.sampleRate);	
  var audioBlob = new Blob([dataview], { type: 'audio/l16' });
  var url = window.URL.createObjectURL(audioBlob);
  var audio = new Audio();
  audio.src = url;
  audio.play();
}

Microphone.prototype.encodeWav = function (samples, numChannels, sampleRate) {	
  console.log("#samples: " + samples.length);	
  var buffer = new ArrayBuffer(44 + samples.length * 2);
  var view = new DataView(buffer);

  /* RIFF identifier */
  this.writeString(view, 0, 'RIFF');
  /* RIFF chunk length */
  view.setUint32(4, 36 + samples.length * 2, true);
  /* RIFF type */
  this.writeString(view, 8, 'WAVE');
  /* format chunk identifier */
  this.writeString(view, 12, 'fmt ');
  /* format chunk length */
  view.setUint32(16, 16, true);
  /* sample format (raw) */
  view.setUint16(20, 1, true);
  /* channel count */
  view.setUint16(22, numChannels, true);
  /* sample rate */
  view.setUint32(24, sampleRate, true);
  /* byte rate (sample rate * block align) */
  view.setUint32(28, sampleRate * 4, true);
  /* block align (channel count * bytes per sample) */
  view.setUint16(32, numChannels * 2, true);
  /* bits per sample */
  view.setUint16(34, 16, true);
  /* data chunk identifier */
  this.writeString(view, 36, 'data');
  /* data chunk length */
  view.setUint32(40, samples.length * 2, true);

  this.floatTo16BitPCM(view, 44, samples);

  return view;
}

Microphone.prototype.writeString = function(view, offset, string){
  for (var i = 0; i < string.length; i++){
    view.setUint8(offset + i, string.charCodeAt(i));
  }
}

Microphone.prototype.floatTo16BitPCM = function(output, offset, input){
  for (var i = 0; i < input.length; i++, offset+=2){
    var s = Math.max(-1, Math.min(1, input[i]));
    output.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7FFF, true);
  }
}

},{}],77:[function(require,module,exports){
/**
 * Copyright 2015 IBM Corp. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use strict';
var Stream = require('stream');
var util = require('util');
var defaults = require('lodash/defaults');
var pick = require('lodash/pick');
var Microphone = require('./microphone');
var qs = require('querystring');
var RecognizeStream = require('watson-developer-cloud/services/speech_to_text/recognize_stream');
var getUserMedia = require('getusermedia');
var MicStream = require('./microphone-stream');


var PARAMS_ALLOWED = ['continuous', 'max_alternatives', 'timestamps', 'word_confidence', 'inactivity_timeout',
    'model', 'content-type', 'interim_results', 'keywords', 'keywords_threshold', 'word_alternatives_threshold' ];

/**
 * IBM Watson Speech to Text client
 *
 * @param {Object} opts options
 * @param {String} opts.token Auth Token for STT service. Must be generated server-side.
 * @param {DOMElement} [opts.file] Optional File Input DOM Element - qill cause #start() to upload the file instead of request microphone permission
 * @param {Boolean} [opts.playFile=true] If a file is being uploaded, should we also play it through the speakers?
 * @constructor
 */
function WatsonSpeechToText(opts) {
    Stream.Readable.call(this);

    opts = defaults(opts, {
        bufferSize: 8192,
        model: 'en-US_BroadbandModel',
        file: null,
        url: "https://stream.watsonplatform.net/speech-to-text/api"
    });
    if (!opts.token) {
        throw new Error("WatsonSpeechToText: missing required parameter: opts.token");
    }

    var self = this;

    /**
     * @event RecognizeStream#error
     */
    function emitError(msg, frame, err) {
        if (err) {
            err.message = msg + ' ' + err.message;
        } else {
            err = new Error(msg);
        }
        err.raw = frame;
        self.emit('error', err);
    }

    var recognizeStream;

    var microphoneStream;

    function handleMicrophone(callback) {
        if (opts.model.indexOf('Narrowband') > -1) {
            var err = new Error('Microphone transcription cannot accomodate narrowband models, '+
                'please select another');
            callback(err, null);
            return false;
        }


        var options = {
            token: opts.token,
            model: opts.model,
            url: opts.url,
            'content-type': 'audio/l16;rate=16000',
            'interim_results': true,
            'continuous': true,
            'word_confidence': true,
            'timestamps': true,
            'max_alternatives': 3,
            'inactivity_timeout': 600
        };

        recognizeStream = new RecognizeStream(options);

        recognizeStream.setEncoding('utf8'); // to get strings instead of Buffers from `data` events

        ['data', 'results', 'connection-close'].forEach(function(eventName) {
            recognizeStream.on(eventName, console.log.bind(console, eventName + ' event: '));
        });
        recognizeStream.on('error', function(e) {
            console.log(e.message, e.stack);
        });

        getUserMedia({ video: false, audio: true }, function(err, stream) {
            microphoneStream = new MicStream(stream, {bufferSize: opts.bufferSize});
            try {
                microphoneStream.pipe(recognizeStream);
            } catch(ex) {
                console.log(ex.message, ex.stack)
            }

        });

        recognizeStream.on('results', self.emit.bind(self, 'results'))
        recognizeStream.on('data', function(chunk) {
            self.push(chunk);
        });
    }

    var running = false;
    function handleFileUpload(file) {
        running = true;
        self.on('hardsocketstop', function() {
            running = false;
        });

        // Read first 4 bytes to determine header
        var blobToText = new Blob([file]).slice(0, 4);
        var r = new FileReader();
        r.readAsText(blobToText);
        r.onload = function() {
            var contentType, audio;
            if (r.result === 'fLaC') {
                contentType = 'audio/flac';
                console.log('Notice: browsers do not support playing FLAC audio, so no audio will accompany the transcription');
            } else if (r.result === 'RIFF') {
                contentType = 'audio/wav';
                audio = new Audio();
                audio.src = URL.createObjectURL(new Blob([file], {type: 'audio/wav'}));
                audio.play();
                self.on('hardsocketstop', function() {
                    audio.pause();
                    audio.currentTime = 0;
                });
            } else if (r.result === 'OggS') {
                contentType = 'audio/ogg; codecs=opus';
                audio = new Audio();
                audio.src = URL.createObjectURL(new Blob([file], {type: 'audio/ogg; codecs=opus'}));
                audio.play();
                self.on('hardsocketstop', function() {
                    audio.pause();
                    audio.currentTime = 0;
                });
            } else {
                console.log('header', r.result.toString());
                emitError('Only WAV or FLAC or Opus files can be transcribed, please try another file format');
                return;
            }

            function fileBlock(_offset, length, _file, readChunk) {
                var r = new FileReader();
                var blob = _file.slice(_offset, length + _offset);
                r.onload = readChunk;
                r.readAsArrayBuffer(blob);
            }

            function onFileProgress(options, ondata, running, onerror, onend, samplingRate) {
                var file       = options.file;
                var fileSize   = file.size;
                var chunkSize  = options.bufferSize || 16000;  // in bytes
                var offset     = 0;
                var readChunk = function(evt) {
                    if (offset >= fileSize) {
                        console.log('Done reading file');
                        onend();
                        return;
                    }
                    if(!running()) {
                        return;
                    }
                    if (evt.target.error == null) {
                        var buffer = evt.target.result;
                        offset += buffer.byteLength;
                        //console.log('sending: ' + len);
                        ondata(buffer); // callback for handling read chunk
                    } else {
                        var errorMessage = evt.target.error;
                        console.log('Read error: ' + errorMessage);
                        onerror(errorMessage);
                        return;
                    }
                    // use this timeout to pace the data upload for the playSample case,
                    // the idea is that the hyps do not arrive before the audio is played back
                    // todo: upload the file at full-speed and instead use the word timings to control when they appear
                    if (samplingRate) {
                        // console.log('samplingRate: ' +
                        //  samplingRate + ' timeout: ' + (chunkSize * 1000) / (samplingRate * 2));
                        setTimeout(function() {
                            fileBlock(offset, chunkSize, file, readChunk);
                        }, (chunkSize * 1000) / (samplingRate * 2));
                    } else {
                        fileBlock(offset, chunkSize, file, readChunk);
                    }
                };
                fileBlock(offset, chunkSize, file, readChunk);
            }

            function callback(socket) {
                var blob = new Blob([file]);
                var parseOptions = {
                    file: blob
                };
                onFileProgress(parseOptions,
                    // On data chunk
                    function onData(chunk) {
                        socket.send(chunk);
                    },
                    function isRunning() {
                        if(running)
                            return true;
                        else
                            return false;
                    },
                    // On file read error
                    function(evt) {
                        console.log('Error reading file: ', evt.message);
                        emitError(evt.message);
                    },
                    // On load end
                    function() {
                        running = false;
                        socket.send(JSON.stringify({'action': 'stop'}));
                    });
            }
            function onend() {

            }

            self.on('progress', function(evt, data) {
                console.log('progress: ', data);
            });

            console.log('contentType', contentType);

            var options = {
                token: opts.token,
                model: opts.model
            };
            options.message = defaults(pick(opts, PARAMS_ALLOWED), {
                'action': 'start',
                'content-type': contentType,
                'interim_results': true,
                'continuous': true,
                'word_confidence': true,
                'timestamps': true,
                'max_alternatives': 3,
                'inactivity_timeout': 600
            });

            function onOpen() {
                console.log('Socket opened');
            }

            function onListening(socket) {
                console.log('Socket listening');
                callback(socket);
            }

            function onMessage(msg) {

            }

            function onError(evt) {
                localStorage.setItem('currentlyDisplaying', 'false');
                onend(evt);
                console.log('Socket err: ', evt.code);
            }

            function onClose(evt) {
                localStorage.setItem('currentlyDisplaying', 'false');
                onend(evt);
                console.log('Socket closing: ', evt);
            }

            initSocket(options, onOpen, onListening, onMessage, onError, onClose);
        };
    }


    this.start = function start() {
        if (opts.file) {
            handleFileUpload(opts.file);
        } else {
            handleMicrophone(function(err) {
                if (err) {
                    self.emit('error', err);
                } else {
                    microphoneStream.record();
                }
            });
        }

        return this;
    };

    this.stop = function stop() {
        console.log('stopping');
        microphoneStream.stop();
    };
}
util.inherits(WatsonSpeechToText, Stream.Readable);

WatsonSpeechToText.prototype._read = function() {}; // flow control is not implemented, at least not at this level


module.exports = WatsonSpeechToText;

},{"./microphone":76,"./microphone-stream":75,"getusermedia":37,"lodash/defaults":40,"lodash/pick":71,"querystring":19,"stream":33,"util":36,"watson-developer-cloud/services/speech_to_text/recognize_stream":6}]},{},[77])(77)
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIuLi9ub2RlLXNkay9ub2RlX21vZHVsZXMvZXh0ZW5kL2luZGV4LmpzIiwiLi4vbm9kZS1zZGsvbm9kZV9tb2R1bGVzL29iamVjdC5waWNrL2luZGV4LmpzIiwiLi4vbm9kZS1zZGsvbm9kZV9tb2R1bGVzL3dlYnNvY2tldC9saWIvYnJvd3Nlci5qcyIsIi4uL25vZGUtc2RrL25vZGVfbW9kdWxlcy93ZWJzb2NrZXQvbGliL3ZlcnNpb24uanMiLCIuLi9ub2RlLXNkay9ub2RlX21vZHVsZXMvd2Vic29ja2V0L3BhY2thZ2UuanNvbiIsIi4uL25vZGUtc2RrL3NlcnZpY2VzL3NwZWVjaF90b190ZXh0L3JlY29nbml6ZV9zdHJlYW0uanMiLCJub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnJvd3Nlci1yZXNvbHZlL2VtcHR5LmpzIiwibm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2J1ZmZlci9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9idWZmZXIvbm9kZV9tb2R1bGVzL2Jhc2U2NC1qcy9saWIvYjY0LmpzIiwibm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2J1ZmZlci9ub2RlX21vZHVsZXMvaWVlZTc1NC9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9idWZmZXIvbm9kZV9tb2R1bGVzL2lzYXJyYXkvaW5kZXguanMiLCJub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvZXZlbnRzL2V2ZW50cy5qcyIsIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9pbmhlcml0cy9pbmhlcml0c19icm93c2VyLmpzIiwibm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2luc2VydC1tb2R1bGUtZ2xvYmFscy9ub2RlX21vZHVsZXMvaXMtYnVmZmVyL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2lzYXJyYXkvaW5kZXguanMiLCJub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvcHJvY2Vzcy9icm93c2VyLmpzIiwibm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL3F1ZXJ5c3RyaW5nLWVzMy9kZWNvZGUuanMiLCJub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvcXVlcnlzdHJpbmctZXMzL2VuY29kZS5qcyIsIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9xdWVyeXN0cmluZy1lczMvaW5kZXguanMiLCJub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvcmVhZGFibGUtc3RyZWFtL2R1cGxleC5qcyIsIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9yZWFkYWJsZS1zdHJlYW0vbGliL19zdHJlYW1fZHVwbGV4LmpzIiwibm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL3JlYWRhYmxlLXN0cmVhbS9saWIvX3N0cmVhbV9wYXNzdGhyb3VnaC5qcyIsIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9yZWFkYWJsZS1zdHJlYW0vbGliL19zdHJlYW1fcmVhZGFibGUuanMiLCJub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvcmVhZGFibGUtc3RyZWFtL2xpYi9fc3RyZWFtX3RyYW5zZm9ybS5qcyIsIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9yZWFkYWJsZS1zdHJlYW0vbGliL19zdHJlYW1fd3JpdGFibGUuanMiLCJub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvcmVhZGFibGUtc3RyZWFtL25vZGVfbW9kdWxlcy9jb3JlLXV0aWwtaXMvbGliL3V0aWwuanMiLCJub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvcmVhZGFibGUtc3RyZWFtL25vZGVfbW9kdWxlcy9wcm9jZXNzLW5leHRpY2stYXJncy9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9yZWFkYWJsZS1zdHJlYW0vbm9kZV9tb2R1bGVzL3V0aWwtZGVwcmVjYXRlL2Jyb3dzZXIuanMiLCJub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvcmVhZGFibGUtc3RyZWFtL3Bhc3N0aHJvdWdoLmpzIiwibm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL3JlYWRhYmxlLXN0cmVhbS9yZWFkYWJsZS5qcyIsIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9yZWFkYWJsZS1zdHJlYW0vdHJhbnNmb3JtLmpzIiwibm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL3JlYWRhYmxlLXN0cmVhbS93cml0YWJsZS5qcyIsIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9zdHJlYW0tYnJvd3NlcmlmeS9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9zdHJpbmdfZGVjb2Rlci9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy91dGlsL3N1cHBvcnQvaXNCdWZmZXJCcm93c2VyLmpzIiwibm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL3V0aWwvdXRpbC5qcyIsIm5vZGVfbW9kdWxlcy9nZXR1c2VybWVkaWEvaW5kZXgtYnJvd3Nlci5qcyIsIm5vZGVfbW9kdWxlcy9nZXR1c2VybWVkaWEvbm9kZV9tb2R1bGVzL3dlYnJ0Yy1hZGFwdGVyLXRlc3QvYWRhcHRlci5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvYXNzaWduSW5XaXRoLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9kZWZhdWx0cy5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvZXEuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL2ludGVybmFsL1JlZmxlY3QuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL2ludGVybmFsL2FwcGx5LmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9pbnRlcm5hbC9hcnJheVB1c2guanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL2ludGVybmFsL2FycmF5UmVkdWNlLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9pbnRlcm5hbC9hc3NpZ25JbkRlZmF1bHRzLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9pbnRlcm5hbC9hc3NpZ25WYWx1ZS5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvaW50ZXJuYWwvYmFzZUZsYXR0ZW4uanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL2ludGVybmFsL2Jhc2VLZXlzSW4uanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL2ludGVybmFsL2Jhc2VQaWNrLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9pbnRlcm5hbC9iYXNlUHJvcGVydHkuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL2ludGVybmFsL2Jhc2VUaW1lcy5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvaW50ZXJuYWwvY29weU9iamVjdFdpdGguanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL2ludGVybmFsL2NyZWF0ZUFzc2lnbmVyLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9pbnRlcm5hbC9nZXRMZW5ndGguanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL2ludGVybmFsL2luZGV4S2V5cy5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvaW50ZXJuYWwvaXNJbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvaW50ZXJuYWwvaXNJdGVyYXRlZUNhbGwuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL2ludGVybmFsL2lzUHJvdG90eXBlLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9pbnRlcm5hbC9pdGVyYXRvclRvQXJyYXkuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL2lzQXJndW1lbnRzLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9pc0FycmF5LmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9pc0FycmF5TGlrZS5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvaXNBcnJheUxpa2VPYmplY3QuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL2lzRnVuY3Rpb24uanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL2lzTGVuZ3RoLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9pc09iamVjdC5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvaXNPYmplY3RMaWtlLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9pc1N0cmluZy5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gva2V5c0luLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9waWNrLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9yZXN0LmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC90b0ludGVnZXIuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL3RvTnVtYmVyLmpzIiwic3JjL21pY3JvcGhvbmUtc3RyZWFtLmpzIiwic3JjL21pY3JvcGhvbmUuanMiLCJzcmMvd2F0c29uLXNwZWVjaC10by10ZXh0LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwQ0E7QUFDQTs7QUNEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDekZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25NQTs7O0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7QUM1NkNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdEhBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxU0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakJBO0FBQ0E7QUFDQTtBQUNBOztBQ0hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0pBO0FBQ0E7O0FDREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQzNCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7OztBQy84QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JNQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUNqaEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7QUMzR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7OztBQ3BCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7O0FDbkVBO0FBQ0E7O0FDREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDWkE7QUFDQTs7QUNEQTtBQUNBOztBQ0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3TkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUNMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7O0FDMWtCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9FQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOXNEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FDbkNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7QUNKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQ3pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7QUMzQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7OztBQzVCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FDdkNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7O0FDcENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNkQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDZkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQzVCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7OztBQ2xCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FDbEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7QUMzQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FDaENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7QUN4Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUM1QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7QUNyQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7QUN0REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FDM0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7QUNuSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyWEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgaGFzT3duID0gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eTtcbnZhciB0b1N0ciA9IE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmc7XG5cbnZhciBpc0FycmF5ID0gZnVuY3Rpb24gaXNBcnJheShhcnIpIHtcblx0aWYgKHR5cGVvZiBBcnJheS5pc0FycmF5ID09PSAnZnVuY3Rpb24nKSB7XG5cdFx0cmV0dXJuIEFycmF5LmlzQXJyYXkoYXJyKTtcblx0fVxuXG5cdHJldHVybiB0b1N0ci5jYWxsKGFycikgPT09ICdbb2JqZWN0IEFycmF5XSc7XG59O1xuXG52YXIgaXNQbGFpbk9iamVjdCA9IGZ1bmN0aW9uIGlzUGxhaW5PYmplY3Qob2JqKSB7XG5cdGlmICghb2JqIHx8IHRvU3RyLmNhbGwob2JqKSAhPT0gJ1tvYmplY3QgT2JqZWN0XScpIHtcblx0XHRyZXR1cm4gZmFsc2U7XG5cdH1cblxuXHR2YXIgaGFzT3duQ29uc3RydWN0b3IgPSBoYXNPd24uY2FsbChvYmosICdjb25zdHJ1Y3RvcicpO1xuXHR2YXIgaGFzSXNQcm90b3R5cGVPZiA9IG9iai5jb25zdHJ1Y3RvciAmJiBvYmouY29uc3RydWN0b3IucHJvdG90eXBlICYmIGhhc093bi5jYWxsKG9iai5jb25zdHJ1Y3Rvci5wcm90b3R5cGUsICdpc1Byb3RvdHlwZU9mJyk7XG5cdC8vIE5vdCBvd24gY29uc3RydWN0b3IgcHJvcGVydHkgbXVzdCBiZSBPYmplY3Rcblx0aWYgKG9iai5jb25zdHJ1Y3RvciAmJiAhaGFzT3duQ29uc3RydWN0b3IgJiYgIWhhc0lzUHJvdG90eXBlT2YpIHtcblx0XHRyZXR1cm4gZmFsc2U7XG5cdH1cblxuXHQvLyBPd24gcHJvcGVydGllcyBhcmUgZW51bWVyYXRlZCBmaXJzdGx5LCBzbyB0byBzcGVlZCB1cCxcblx0Ly8gaWYgbGFzdCBvbmUgaXMgb3duLCB0aGVuIGFsbCBwcm9wZXJ0aWVzIGFyZSBvd24uXG5cdHZhciBrZXk7XG5cdGZvciAoa2V5IGluIG9iaikgey8qKi99XG5cblx0cmV0dXJuIHR5cGVvZiBrZXkgPT09ICd1bmRlZmluZWQnIHx8IGhhc093bi5jYWxsKG9iaiwga2V5KTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gZXh0ZW5kKCkge1xuXHR2YXIgb3B0aW9ucywgbmFtZSwgc3JjLCBjb3B5LCBjb3B5SXNBcnJheSwgY2xvbmUsXG5cdFx0dGFyZ2V0ID0gYXJndW1lbnRzWzBdLFxuXHRcdGkgPSAxLFxuXHRcdGxlbmd0aCA9IGFyZ3VtZW50cy5sZW5ndGgsXG5cdFx0ZGVlcCA9IGZhbHNlO1xuXG5cdC8vIEhhbmRsZSBhIGRlZXAgY29weSBzaXR1YXRpb25cblx0aWYgKHR5cGVvZiB0YXJnZXQgPT09ICdib29sZWFuJykge1xuXHRcdGRlZXAgPSB0YXJnZXQ7XG5cdFx0dGFyZ2V0ID0gYXJndW1lbnRzWzFdIHx8IHt9O1xuXHRcdC8vIHNraXAgdGhlIGJvb2xlYW4gYW5kIHRoZSB0YXJnZXRcblx0XHRpID0gMjtcblx0fSBlbHNlIGlmICgodHlwZW9mIHRhcmdldCAhPT0gJ29iamVjdCcgJiYgdHlwZW9mIHRhcmdldCAhPT0gJ2Z1bmN0aW9uJykgfHwgdGFyZ2V0ID09IG51bGwpIHtcblx0XHR0YXJnZXQgPSB7fTtcblx0fVxuXG5cdGZvciAoOyBpIDwgbGVuZ3RoOyArK2kpIHtcblx0XHRvcHRpb25zID0gYXJndW1lbnRzW2ldO1xuXHRcdC8vIE9ubHkgZGVhbCB3aXRoIG5vbi1udWxsL3VuZGVmaW5lZCB2YWx1ZXNcblx0XHRpZiAob3B0aW9ucyAhPSBudWxsKSB7XG5cdFx0XHQvLyBFeHRlbmQgdGhlIGJhc2Ugb2JqZWN0XG5cdFx0XHRmb3IgKG5hbWUgaW4gb3B0aW9ucykge1xuXHRcdFx0XHRzcmMgPSB0YXJnZXRbbmFtZV07XG5cdFx0XHRcdGNvcHkgPSBvcHRpb25zW25hbWVdO1xuXG5cdFx0XHRcdC8vIFByZXZlbnQgbmV2ZXItZW5kaW5nIGxvb3Bcblx0XHRcdFx0aWYgKHRhcmdldCAhPT0gY29weSkge1xuXHRcdFx0XHRcdC8vIFJlY3Vyc2UgaWYgd2UncmUgbWVyZ2luZyBwbGFpbiBvYmplY3RzIG9yIGFycmF5c1xuXHRcdFx0XHRcdGlmIChkZWVwICYmIGNvcHkgJiYgKGlzUGxhaW5PYmplY3QoY29weSkgfHwgKGNvcHlJc0FycmF5ID0gaXNBcnJheShjb3B5KSkpKSB7XG5cdFx0XHRcdFx0XHRpZiAoY29weUlzQXJyYXkpIHtcblx0XHRcdFx0XHRcdFx0Y29weUlzQXJyYXkgPSBmYWxzZTtcblx0XHRcdFx0XHRcdFx0Y2xvbmUgPSBzcmMgJiYgaXNBcnJheShzcmMpID8gc3JjIDogW107XG5cdFx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0XHRjbG9uZSA9IHNyYyAmJiBpc1BsYWluT2JqZWN0KHNyYykgPyBzcmMgOiB7fTtcblx0XHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdFx0Ly8gTmV2ZXIgbW92ZSBvcmlnaW5hbCBvYmplY3RzLCBjbG9uZSB0aGVtXG5cdFx0XHRcdFx0XHR0YXJnZXRbbmFtZV0gPSBleHRlbmQoZGVlcCwgY2xvbmUsIGNvcHkpO1xuXG5cdFx0XHRcdFx0Ly8gRG9uJ3QgYnJpbmcgaW4gdW5kZWZpbmVkIHZhbHVlc1xuXHRcdFx0XHRcdH0gZWxzZSBpZiAodHlwZW9mIGNvcHkgIT09ICd1bmRlZmluZWQnKSB7XG5cdFx0XHRcdFx0XHR0YXJnZXRbbmFtZV0gPSBjb3B5O1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblx0fVxuXG5cdC8vIFJldHVybiB0aGUgbW9kaWZpZWQgb2JqZWN0XG5cdHJldHVybiB0YXJnZXQ7XG59O1xuXG4iLCIvKiFcbiAqIG9iamVjdC5waWNrIDxodHRwczovL2dpdGh1Yi5jb20vam9uc2NobGlua2VydC9vYmplY3QucGljaz5cbiAqXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTQtMjAxNSBKb24gU2NobGlua2VydCwgY29udHJpYnV0b3JzLlxuICogTGljZW5zZWQgdW5kZXIgdGhlIE1JVCBMaWNlbnNlXG4gKi9cblxuJ3VzZSBzdHJpY3QnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIHBpY2sob2JqLCBrZXlzKSB7XG4gIHZhciByZXMgPSB7fTtcbiAgdmFyIGkgPSAwO1xuXG4gIGlmICh0eXBlb2Ygb2JqICE9PSAnb2JqZWN0Jykge1xuICAgIHJldHVybiByZXM7XG4gIH1cblxuICBpZiAodHlwZW9mIGtleXMgPT09ICdzdHJpbmcnKSB7XG4gICAgaWYgKGtleXMgaW4gb2JqKSB7XG4gICAgICByZXNba2V5c10gPSBvYmpba2V5c107XG4gICAgfVxuICAgIHJldHVybiByZXM7XG4gIH1cblxuICB2YXIgbGVuID0ga2V5cy5sZW5ndGg7XG5cbiAgd2hpbGUgKGxlbi0tKSB7XG4gICAgdmFyIGtleSA9IGtleXNbaSsrXTtcbiAgICBpZiAoa2V5IGluIG9iaikge1xuICAgICAgcmVzW2tleV0gPSBvYmpba2V5XTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHJlcztcbn07XG4iLCJ2YXIgX2dsb2JhbCA9IChmdW5jdGlvbigpIHsgcmV0dXJuIHRoaXM7IH0pKCk7XG52YXIgbmF0aXZlV2ViU29ja2V0ID0gX2dsb2JhbC5XZWJTb2NrZXQgfHwgX2dsb2JhbC5Nb3pXZWJTb2NrZXQ7XG52YXIgd2Vic29ja2V0X3ZlcnNpb24gPSByZXF1aXJlKCcuL3ZlcnNpb24nKTtcblxuXG4vKipcbiAqIEV4cG9zZSBhIFczQyBXZWJTb2NrZXQgY2xhc3Mgd2l0aCBqdXN0IG9uZSBvciB0d28gYXJndW1lbnRzLlxuICovXG5mdW5jdGlvbiBXM0NXZWJTb2NrZXQodXJpLCBwcm90b2NvbHMpIHtcblx0dmFyIG5hdGl2ZV9pbnN0YW5jZTtcblxuXHRpZiAocHJvdG9jb2xzKSB7XG5cdFx0bmF0aXZlX2luc3RhbmNlID0gbmV3IG5hdGl2ZVdlYlNvY2tldCh1cmksIHByb3RvY29scyk7XG5cdH1cblx0ZWxzZSB7XG5cdFx0bmF0aXZlX2luc3RhbmNlID0gbmV3IG5hdGl2ZVdlYlNvY2tldCh1cmkpO1xuXHR9XG5cblx0LyoqXG5cdCAqICduYXRpdmVfaW5zdGFuY2UnIGlzIGFuIGluc3RhbmNlIG9mIG5hdGl2ZVdlYlNvY2tldCAodGhlIGJyb3dzZXIncyBXZWJTb2NrZXRcblx0ICogY2xhc3MpLiBTaW5jZSBpdCBpcyBhbiBPYmplY3QgaXQgd2lsbCBiZSByZXR1cm5lZCBhcyBpdCBpcyB3aGVuIGNyZWF0aW5nIGFuXG5cdCAqIGluc3RhbmNlIG9mIFczQ1dlYlNvY2tldCB2aWEgJ25ldyBXM0NXZWJTb2NrZXQoKScuXG5cdCAqXG5cdCAqIEVDTUFTY3JpcHQgNTogaHR0cDovL2JjbGFyeS5jb20vMjAwNC8xMS8wNy8jYS0xMy4yLjJcblx0ICovXG5cdHJldHVybiBuYXRpdmVfaW5zdGFuY2U7XG59XG5cblxuLyoqXG4gKiBNb2R1bGUgZXhwb3J0cy5cbiAqL1xubW9kdWxlLmV4cG9ydHMgPSB7XG4gICAgJ3czY3dlYnNvY2tldCcgOiBuYXRpdmVXZWJTb2NrZXQgPyBXM0NXZWJTb2NrZXQgOiBudWxsLFxuICAgICd2ZXJzaW9uJyAgICAgIDogd2Vic29ja2V0X3ZlcnNpb25cbn07XG4iLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoJy4uL3BhY2thZ2UuanNvbicpLnZlcnNpb247XG4iLCJtb2R1bGUuZXhwb3J0cz17XG4gIFwibmFtZVwiOiBcIndlYnNvY2tldFwiLFxuICBcImRlc2NyaXB0aW9uXCI6IFwiV2Vic29ja2V0IENsaWVudCAmIFNlcnZlciBMaWJyYXJ5IGltcGxlbWVudGluZyB0aGUgV2ViU29ja2V0IHByb3RvY29sIGFzIHNwZWNpZmllZCBpbiBSRkMgNjQ1NS5cIixcbiAgXCJrZXl3b3Jkc1wiOiBbXG4gICAgXCJ3ZWJzb2NrZXRcIixcbiAgICBcIndlYnNvY2tldHNcIixcbiAgICBcInNvY2tldFwiLFxuICAgIFwibmV0d29ya2luZ1wiLFxuICAgIFwiY29tZXRcIixcbiAgICBcInB1c2hcIixcbiAgICBcIlJGQy02NDU1XCIsXG4gICAgXCJyZWFsdGltZVwiLFxuICAgIFwic2VydmVyXCIsXG4gICAgXCJjbGllbnRcIlxuICBdLFxuICBcImF1dGhvclwiOiB7XG4gICAgXCJuYW1lXCI6IFwiQnJpYW4gTWNLZWx2ZXlcIixcbiAgICBcImVtYWlsXCI6IFwiYnJpYW5Ad29ybGl6ZS5jb21cIixcbiAgICBcInVybFwiOiBcImh0dHBzOi8vd3d3LndvcmxpemUuY29tL1wiXG4gIH0sXG4gIFwiY29udHJpYnV0b3JzXCI6IFtcbiAgICB7XG4gICAgICBcIm5hbWVcIjogXCJJw7Fha2kgQmF6IENhc3RpbGxvXCIsXG4gICAgICBcImVtYWlsXCI6IFwiaWJjQGFsaWF4Lm5ldFwiLFxuICAgICAgXCJ1cmxcIjogXCJodHRwOi8vZGV2LnNpcGRvYy5uZXRcIlxuICAgIH1cbiAgXSxcbiAgXCJ2ZXJzaW9uXCI6IFwiMS4wLjIyXCIsXG4gIFwicmVwb3NpdG9yeVwiOiB7XG4gICAgXCJ0eXBlXCI6IFwiZ2l0XCIsXG4gICAgXCJ1cmxcIjogXCJnaXQraHR0cHM6Ly9naXRodWIuY29tL3RoZXR1cnRsZTMyL1dlYlNvY2tldC1Ob2RlLmdpdFwiXG4gIH0sXG4gIFwiaG9tZXBhZ2VcIjogXCJodHRwczovL2dpdGh1Yi5jb20vdGhldHVydGxlMzIvV2ViU29ja2V0LU5vZGVcIixcbiAgXCJlbmdpbmVzXCI6IHtcbiAgICBcIm5vZGVcIjogXCI+PTAuOC4wXCJcbiAgfSxcbiAgXCJkZXBlbmRlbmNpZXNcIjoge1xuICAgIFwiZGVidWdcIjogXCJ+Mi4yLjBcIixcbiAgICBcIm5hblwiOiBcIn4yLjAuNVwiLFxuICAgIFwidHlwZWRhcnJheS10by1idWZmZXJcIjogXCJ+My4wLjNcIixcbiAgICBcInlhZXRpXCI6IFwifjAuMC40XCJcbiAgfSxcbiAgXCJkZXZEZXBlbmRlbmNpZXNcIjoge1xuICAgIFwiYnVmZmVyLWVxdWFsXCI6IFwiXjAuMC4xXCIsXG4gICAgXCJmYXVjZXRcIjogXCJeMC4wLjFcIixcbiAgICBcImd1bHBcIjogXCJnaXQraHR0cHM6Ly9naXRodWIuY29tL2d1bHBqcy9ndWxwLmdpdCM0LjBcIixcbiAgICBcImd1bHAtanNoaW50XCI6IFwiXjEuMTEuMlwiLFxuICAgIFwianNoaW50LXN0eWxpc2hcIjogXCJeMS4wLjJcIixcbiAgICBcInRhcGVcIjogXCJeNC4wLjFcIlxuICB9LFxuICBcImNvbmZpZ1wiOiB7XG4gICAgXCJ2ZXJib3NlXCI6IGZhbHNlXG4gIH0sXG4gIFwic2NyaXB0c1wiOiB7XG4gICAgXCJpbnN0YWxsXCI6IFwiKG5vZGUtZ3lwIHJlYnVpbGQgMj4gYnVpbGRlcnJvci5sb2cpIHx8IChleGl0IDApXCIsXG4gICAgXCJ0ZXN0XCI6IFwiZmF1Y2V0IHRlc3QvdW5pdFwiLFxuICAgIFwiZ3VscFwiOiBcImd1bHBcIlxuICB9LFxuICBcIm1haW5cIjogXCJpbmRleFwiLFxuICBcImRpcmVjdG9yaWVzXCI6IHtcbiAgICBcImxpYlwiOiBcIi4vbGliXCJcbiAgfSxcbiAgXCJicm93c2VyXCI6IFwibGliL2Jyb3dzZXIuanNcIixcbiAgXCJsaWNlbnNlXCI6IFwiQXBhY2hlLTIuMFwiLFxuICBcImdpdEhlYWRcIjogXCIxOTEwOGJiZmQ3ZDk0YTVjZDAyZGJmZjM0OTVlYWZlZTllOTAxY2E0XCIsXG4gIFwiYnVnc1wiOiB7XG4gICAgXCJ1cmxcIjogXCJodHRwczovL2dpdGh1Yi5jb20vdGhldHVydGxlMzIvV2ViU29ja2V0LU5vZGUvaXNzdWVzXCJcbiAgfSxcbiAgXCJfaWRcIjogXCJ3ZWJzb2NrZXRAMS4wLjIyXCIsXG4gIFwiX3NoYXN1bVwiOiBcIjhjMzNlMzQ0OWY4NzlhYWY1MTgyOTdjOTc0NGNlYmY4MTJiOWUzZDhcIixcbiAgXCJfZnJvbVwiOiBcIndlYnNvY2tldEAqXCIsXG4gIFwiX25wbVZlcnNpb25cIjogXCIyLjE0LjNcIixcbiAgXCJfbm9kZVZlcnNpb25cIjogXCIzLjMuMVwiLFxuICBcIl9ucG1Vc2VyXCI6IHtcbiAgICBcIm5hbWVcIjogXCJ0aGV0dXJ0bGUzMlwiLFxuICAgIFwiZW1haWxcIjogXCJicmlhbkB3b3JsaXplLmNvbVwiXG4gIH0sXG4gIFwibWFpbnRhaW5lcnNcIjogW1xuICAgIHtcbiAgICAgIFwibmFtZVwiOiBcInRoZXR1cnRsZTMyXCIsXG4gICAgICBcImVtYWlsXCI6IFwiYnJpYW5Ad29ybGl6ZS5jb21cIlxuICAgIH1cbiAgXSxcbiAgXCJkaXN0XCI6IHtcbiAgICBcInNoYXN1bVwiOiBcIjhjMzNlMzQ0OWY4NzlhYWY1MTgyOTdjOTc0NGNlYmY4MTJiOWUzZDhcIixcbiAgICBcInRhcmJhbGxcIjogXCJodHRwOi8vcmVnaXN0cnkubnBtanMub3JnL3dlYnNvY2tldC8tL3dlYnNvY2tldC0xLjAuMjIudGd6XCJcbiAgfSxcbiAgXCJfcmVzb2x2ZWRcIjogXCJodHRwczovL3JlZ2lzdHJ5Lm5wbWpzLm9yZy93ZWJzb2NrZXQvLS93ZWJzb2NrZXQtMS4wLjIyLnRnelwiXG59XG4iLCIvKipcbiAqIENvcHlyaWdodCAyMDE0IElCTSBDb3JwLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiAgICAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKi9cblxuJ3VzZSBzdHJpY3QnO1xuXG5cbnZhciBEdXBsZXggICAgICAgICA9IHJlcXVpcmUoJ3N0cmVhbScpLkR1cGxleDtcbnZhciB1dGlsICAgICAgICAgICA9IHJlcXVpcmUoJ3V0aWwnKTtcbnZhciBleHRlbmQgICAgICAgICA9IHJlcXVpcmUoJ2V4dGVuZCcpO1xudmFyIHBpY2sgICAgICAgICAgID0gcmVxdWlyZSgnb2JqZWN0LnBpY2snKTtcbnZhciBXM0NXZWJTb2NrZXQgPSByZXF1aXJlKCd3ZWJzb2NrZXQnKS53M2N3ZWJzb2NrZXQ7XG5cblxudmFyIE9QRU5JTkdfTUVTU0FHRV9QQVJBTVNfQUxMT1dFRCA9IFsnY29udGludW91cycsICdtYXhfYWx0ZXJuYXRpdmVzJywgJ3RpbWVzdGFtcHMnLCAnd29yZF9jb25maWRlbmNlJywgJ2luYWN0aXZpdHlfdGltZW91dCcsXG4gICdjb250ZW50LXR5cGUnLCAnaW50ZXJpbV9yZXN1bHRzJywgJ2tleXdvcmRzJywgJ2tleXdvcmRzX3RocmVzaG9sZCcsICd3b3JkX2FsdGVybmF0aXZlc190aHJlc2hvbGQnIF07XG5cbnZhciBRVUVSWV9QQVJBTVNfQUxMT1dFRCA9IFsnbW9kZWwnLCAnWC1XYXRzb24tTGVhcm5pbmctT3B0LU91dCcsICd3YXRzb24tdG9rZW4nXTtcblxuLyoqXG4gKiBwaXBlKCktYWJsZSBOb2RlLmpzIFJlYWRhYmxlL1dyaXRlYWJsZSBzdHJlYW0gLSBhY2NlcHRzIGJpbmFyeSBhdWRpbyBhbmQgZW1pdHMgdGV4dCBpbiBpdCdzIGBkYXRhYCBldmVudHMuXG4gKiBBbHNvIGVtaXRzIGByZXN1bHRzYCBldmVudHMgd2l0aCBpbnRlcmltIHJlc3VsdHMgYW5kIG90aGVyIGRhdGEuXG4gKlxuICogQ2Fubm90IGJlIGluc3RhbnRpYXRlZCBkaXJlY3RseSwgaW5zdGVhZCByZWF0ZWQgYnkgY2FsbGluZyAjY3JlYXRlUmVjb2duaXplU3RyZWFtKClcbiAqXG4gKiBVc2VzIFdlYlNvY2tldHMgdW5kZXIgdGhlIGhvb2QuIEZvciBhdWRpbyB3aXRoIG5vIHJlY29nbml6YWJsZSBzcGVlY2gsIG5vIGBkYXRhYCBldmVudHMgYXJlIGVtaXR0ZWQuXG4gKiBAcGFyYW0gb3B0aW9uc1xuICogQGNvbnN0cnVjdG9yXG4gKi9cbmZ1bmN0aW9uIFJlY29nbml6ZVN0cmVhbShvcHRpb25zKXtcbiAgRHVwbGV4LmNhbGwodGhpcywgb3B0aW9ucyk7XG5cbiAgLy8gdG9kbzogYXBwbHkgdGhlc2UgY29ycmVjdGlvbnMgdG8gb3RoZXIgbWV0aG9kcyAoPylcbiAgaWYgKG9wdGlvbnMudG9rZW4gJiYgIW9wdGlvbnNbJ3dhdHNvbi10b2tlbiddKSB7XG4gICAgb3B0aW9uc1snd2F0c29uLXRva2VuJ10gPSBvcHRpb25zLnRva2VuO1xuICB9XG4gIGlmIChvcHRpb25zLmNvbnRlbnRfdHlwZSAmJiAhb3B0aW9uc1snY29udGVudC10eXBlJ10pIHtcbiAgICBvcHRpb25zWydjb250ZW50LXR5cGUnXSA9IG9wdGlvbnMuY29udGVudF90eXBlO1xuICB9XG4gIGlmIChvcHRpb25zWydYLVdEQy1QTC1PUFQtT1VUJ10gJiYgIW9wdGlvbnNbJ1gtV2F0c29uLUxlYXJuaW5nLU9wdC1PdXQnXSkge1xuICAgIG9wdGlvbnNbJ1gtV2F0c29uLUxlYXJuaW5nLU9wdC1PdXQnXSA9IG9wdGlvbnNbJ1gtV0RDLVBMLU9QVC1PVVQnXTtcbiAgfVxuXG4gIHZhciBxdWVyeVBhcmFtcyA9IGV4dGVuZCh7bW9kZWw6ICdlbi1VU19Ccm9hZGJhbmRNb2RlbCd9LCBwaWNrKG9wdGlvbnMsIFFVRVJZX1BBUkFNU19BTExPV0VEKSk7XG4gIHZhciBxdWVyeVN0cmluZyA9IE9iamVjdC5rZXlzKHF1ZXJ5UGFyYW1zKS5tYXAoZnVuY3Rpb24oa2V5KSB7XG4gICAgcmV0dXJuIGtleSArICc9JyArIChrZXkgPT0gJ3dhdHNvbi10b2tlbicgPyBxdWVyeVBhcmFtc1trZXldIDogZW5jb2RlVVJJQ29tcG9uZW50KHF1ZXJ5UGFyYW1zW2tleV0pKTsgLy8gb3VyIHNlcnZlciBjaG9rZXMgaWYgdGhlIHRva2VuIGlzIGNvcnJlY3RseSB1cmwtZW5jb2RlZFxuICB9KS5qb2luKCcmJyk7XG5cbiAgdmFyIHVybCA9IChvcHRpb25zLnVybCB8fCBcIndzczovL3N0cmVhbS53YXRzb25wbGF0Zm9ybS5uZXQvc3BlZWNoLXRvLXRleHQvYXBpXCIpLnJlcGxhY2UoL15odHRwLywgJ3dzJykgKyAnL3YxL3JlY29nbml6ZT8nICsgcXVlcnlTdHJpbmc7XG5cbiAgdmFyIG9wZW5pbmdNZXNzYWdlID0gZXh0ZW5kKHtcbiAgICBhY3Rpb246ICdzdGFydCcsXG4gICAgJ2NvbnRlbnQtdHlwZSc6ICdhdWRpby93YXYnLCAvLyB0b2RvOiB0cnkgdG8gZGV0ZXJtaW5lIGNvbnRlbnQtdHlwZSBmcm9tIHRoZSBmaWxlIGV4dGVuc2lvbiBpZiBhdmFpbGFibGVcbiAgICBjb250aW51b3VzOiB0cnVlLFxuICAgIGludGVyaW1fcmVzdWx0czogdHJ1ZSxcbiAgfSwgcGljayhvcHRpb25zLCBPUEVOSU5HX01FU1NBR0VfUEFSQU1TX0FMTE9XRUQpKTtcblxuICBjb25zb2xlLmxvZyh1cmwsIG9wZW5pbmdNZXNzYWdlKTtcblxuICB2YXIgY2xvc2luZ01lc3NhZ2UgPSB7YWN0aW9uOiAnc3RvcCd9O1xuXG5cbiAgdmFyIHNlbGYgPSB0aGlzO1xuXG4gIC8vbm9kZSBwYXJhbXM6IHJlcXVlc3RVcmwsIHByb3RvY29scywgb3JpZ2luLCBoZWFkZXJzLCBleHRyYVJlcXVlc3RPcHRpb25zXG4gIC8vIGJyb3dzZXIgcGFyYW1zOiByZXF1ZXN0VXJsLCBwcm90b2NvbHMgKGFsbCBvdGhlcnMgaWdub3JlZClcbiAgdmFyIHNvY2tldCA9IHRoaXMuc29ja2V0ID0gbmV3IFczQ1dlYlNvY2tldCh1cmwsIG51bGwsIG51bGwsIG9wdGlvbnMuaGVhZGVycywgbnVsbCk7XG5cbiAgLy8gd2hlbiB0aGUgaW5wdXQgc3RvcHMsIGxldCB0aGUgc2VydmljZSBrbm93IHRoYXQgd2UncmUgZG9uZVxuICBzZWxmLm9uKCdmaW5pc2gnLCBmdW5jdGlvbigpIHtcbiAgICBpZiAoc2VsZi5zb2NrZXQpIHtcbiAgICAgIHNlbGYuc29ja2V0LnNlbmQoSlNPTi5zdHJpbmdpZnkoY2xvc2luZ01lc3NhZ2UpKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5vbmNlKCdjb25uZWN0JywgZnVuY3Rpb24gKCkge1xuICAgICAgICBzZWxmLnNvY2tldC5zZW5kKEpTT04uc3RyaW5naWZ5KGNsb3NpbmdNZXNzYWdlKSk7XG4gICAgICB9KTtcbiAgICB9XG4gIH0pO1xuXG4gIHNvY2tldC5vbmVycm9yID0gZnVuY3Rpb24oZXJyb3IpIHtcbiAgICBzZWxmLmxpc3RlbmluZyA9IGZhbHNlO1xuICAgIHNlbGYuZW1pdCgnZXJyb3InLCBlcnJvcik7XG4gIH07XG5cblxuICB0aGlzLnNvY2tldC5vbm9wZW4gPSBmdW5jdGlvbigpIHtcbiAgICBzb2NrZXQuc2VuZChKU09OLnN0cmluZ2lmeShvcGVuaW5nTWVzc2FnZSkpO1xuICAgIHNlbGYuZW1pdCgnY29ubmVjdCcpO1xuICB9O1xuXG4gIHRoaXMuc29ja2V0Lm9uY2xvc2UgPSBmdW5jdGlvbihlKSB7XG4gICAgc2VsZi5saXN0ZW5pbmcgPSBmYWxzZTtcbiAgICBzZWxmLnB1c2gobnVsbCk7XG4gICAgLyoqXG4gICAgICogQGV2ZW50IFJlY29nbml6ZVN0cmVhbSNjb25uZWN0aW9uLWNsb3NlXG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IHJlYXNvbkNvZGVcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gZGVzY3JpcHRpb25cbiAgICAgKi9cbiAgICBzZWxmLmVtaXQoJ2Nvbm5lY3Rpb24tY2xvc2UnLCBlLmNvZGUsIGUucmVhc29uKTtcbiAgfTtcblxuICAvKipcbiAgICogQGV2ZW50IFJlY29nbml6ZVN0cmVhbSNlcnJvclxuICAgKi9cbiAgZnVuY3Rpb24gZW1pdEVycm9yKG1zZywgZnJhbWUsIGVycikge1xuICAgIGlmIChlcnIpIHtcbiAgICAgIGVyci5tZXNzYWdlID0gbXNnICsgJyAnICsgZXJyLm1lc3NhZ2U7XG4gICAgfSBlbHNlIHtcbiAgICAgIGVyciA9IG5ldyBFcnJvcihtc2cpO1xuICAgIH1cbiAgICBlcnIucmF3ID0gZnJhbWU7XG4gICAgc2VsZi5lbWl0KCdlcnJvcicsIGVycik7XG4gIH1cblxuICBzb2NrZXQub25tZXNzYWdlID0gZnVuY3Rpb24oZnJhbWUpIHtcbiAgICBpZiAodHlwZW9mIGZyYW1lLmRhdGEgIT09ICdzdHJpbmcnKSB7XG4gICAgICByZXR1cm4gZW1pdEVycm9yKCdVbmV4cGVjdGVkIGJpbmFyeSBkYXRhIHJlY2VpdmVkIGZyb20gc2VydmVyJywgZnJhbWUpO1xuICAgIH1cblxuICAgIHZhciBkYXRhO1xuICAgIHRyeSB7XG4gICAgICBkYXRhID0gSlNPTi5wYXJzZShmcmFtZS5kYXRhKTtcbiAgICB9IGNhdGNoIChqc29uRXgpIHtcbiAgICAgIHJldHVybiBlbWl0RXJyb3IoJ0ludmFsaWQgSlNPTiByZWNlaXZlZCBmcm9tIHNlcnZpY2U6JywgZnJhbWUsIGpzb25FeCk7XG4gICAgfVxuXG4gICAgaWYgKGRhdGEuZXJyb3IpIHtcbiAgICAgIGVtaXRFcnJvcihkYXRhLmVycm9yLCBmcmFtZSk7XG4gICAgfSBlbHNlIGlmIChkYXRhLnN0YXRlID09PSAnbGlzdGVuaW5nJykge1xuICAgICAgLy8gdGhpcyBpcyBlbWl0dGVkIGJvdGggd2hlbiB0aGUgc2VydmVyIGlzIHJlYWR5IGZvciBhdWRpbywgYW5kIGFmdGVyIHdlIHNlbmQgdGhlIGNsb3NlIG1lc3NhZ2UgdG8gaW5kaWNhdGUgdGhhdCBpdCdzIGRvbmUgcHJvY2Vzc2luZ1xuICAgICAgaWYgKCFzZWxmLmxpc3RlbmluZykge1xuICAgICAgICBzZWxmLmxpc3RlbmluZyA9IHRydWU7XG4gICAgICAgIHNlbGYuZW1pdCgnbGlzdGVuaW5nJyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBzZWxmLmxpc3RlbmluZyA9IGZhbHNlO1xuICAgICAgICBzb2NrZXQuY2xvc2UoKTtcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKGRhdGEucmVzdWx0cykge1xuICAgICAgLyoqXG4gICAgICAgKiBPYmplY3Qgd2l0aCBpbnRlcmltIG9yIGZpbmFsIHJlc3VsdHMsIGluY2x1ZGluZyBwb3NzaWJsZSBhbHRlcm5hdGl2ZXMuIE1heSBoYXZlIG5vIHJlc3VsdHMgYXQgYWxsIGZvciBlbXB0eSBhdWRpbyBmaWxlcy5cbiAgICAgICAqIEBldmVudCBSZWNvZ25pemVTdHJlYW0jcmVzdWx0c1xuICAgICAgICogQHBhcmFtIHtPYmplY3R9IHJlc3VsdHNcbiAgICAgICAqL1xuICAgICAgc2VsZi5lbWl0KCdyZXN1bHRzJywgZGF0YSk7XG4gICAgICAvLyBub3RlOiBjdXJyZW50bHkgdGhlcmUgaXMgYWx3YXlzIGVpdGhlciBubyBlbnRyaWVzIG9yIGV4YWN0bHkgMSBlbnRyeSBpbiB0aGUgcmVzdWx0cyBhcnJheS4gSG93ZXZlciwgdGhpcyBtYXkgY2hhbmdlIGluIHRoZSBmdXR1cmUuXG4gICAgICBpZiAoZGF0YS5yZXN1bHRzWzBdICYmIGRhdGEucmVzdWx0c1swXS5maW5hbCAmJiBkYXRhLnJlc3VsdHNbMF0uYWx0ZXJuYXRpdmVzKSB7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBGaW5hbGl6ZWQgdGV4dFxuICAgICAgICAgKiBAZXZlbnQgUmVjb2duaXplU3RyZWFtI2RhdGFcbiAgICAgICAgICogQHBhcmFtIHtTdHJpbmd9IHRyYW5zY3JpcHRcbiAgICAgICAgICovXG4gICAgICAgIHNlbGYucHVzaChkYXRhLnJlc3VsdHNbMF0uYWx0ZXJuYXRpdmVzWzBdLnRyYW5zY3JpcHQsICd1dGY4Jyk7IC8vIHRoaXMgaXMgdGhlIFwiZGF0YVwiIGV2ZW50IHRoYXQgY2FuIGJlIGVhc2lseSBwaXBlZCB0byBvdGhlciBzdHJlYW1zXG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGVtaXRFcnJvcignVW5yZWNvZ25pc2VkIG1lc3NhZ2UgZnJvbSBzZXJ2ZXInLCBmcmFtZSk7XG4gICAgfVxuICB9XG5cbn1cbnV0aWwuaW5oZXJpdHMoUmVjb2duaXplU3RyZWFtLCBEdXBsZXgpO1xuXG5cblJlY29nbml6ZVN0cmVhbS5wcm90b3R5cGUuX3JlYWQgPSBmdW5jdGlvbihzaXplKSB7XG4gIC8vIHRoZXJlJ3Mgbm8gZWFzeSB3YXkgdG8gY29udHJvbCByZWFkcyBmcm9tIHRoZSB1bmRlcmx5aW5nIGxpYnJhcnlcbiAgLy8gc28sIHRoZSBiZXN0IHdlIGNhbiBkbyBoZXJlIGlzIGEgbm8tb3Bcbn07XG5cblJlY29nbml6ZVN0cmVhbS5wcm90b3R5cGUuX3dyaXRlID0gZnVuY3Rpb24oY2h1bmssIGVuY29kaW5nLCBjYWxsYmFjaykge1xuICB2YXIgc2VsZiA9IHRoaXM7XG4gIGlmIChzZWxmLmxpc3RlbmluZykge1xuICAgIHNlbGYuc29ja2V0LnNlbmQoY2h1bmspO1xuICAgIC8vIHRvZG86IGNvbnNpZGVyIHdhdGNoaW5nIHNlbGYuc29ja2V0LmJ1ZmZlcmVkQW1vdW50IGFuZCBvbmx5IGZpcmVpbmcgdGhlIGNhbGxiYWNrIG9uY2UgaXQgcmVhY2hlcyAwXG4gICAgY2FsbGJhY2soKTtcbiAgfSBlbHNlIHtcbiAgICB0aGlzLm9uY2UoJ2xpc3RlbmluZycsIGZ1bmN0aW9uKCkge1xuICAgICAgc2VsZi5zb2NrZXQuc2VuZChjaHVuayk7XG4gICAgICBjYWxsYmFjaygpO1xuICAgIH0pO1xuICB9XG59O1xuXG5cbm1vZHVsZS5leHBvcnRzID0gUmVjb2duaXplU3RyZWFtO1xuIiwiIiwiLyohXG4gKiBUaGUgYnVmZmVyIG1vZHVsZSBmcm9tIG5vZGUuanMsIGZvciB0aGUgYnJvd3Nlci5cbiAqXG4gKiBAYXV0aG9yICAgRmVyb3NzIEFib3VraGFkaWplaCA8ZmVyb3NzQGZlcm9zcy5vcmc+IDxodHRwOi8vZmVyb3NzLm9yZz5cbiAqIEBsaWNlbnNlICBNSVRcbiAqL1xuLyogZXNsaW50LWRpc2FibGUgbm8tcHJvdG8gKi9cblxuJ3VzZSBzdHJpY3QnXG5cbnZhciBiYXNlNjQgPSByZXF1aXJlKCdiYXNlNjQtanMnKVxudmFyIGllZWU3NTQgPSByZXF1aXJlKCdpZWVlNzU0JylcbnZhciBpc0FycmF5ID0gcmVxdWlyZSgnaXNhcnJheScpXG5cbmV4cG9ydHMuQnVmZmVyID0gQnVmZmVyXG5leHBvcnRzLlNsb3dCdWZmZXIgPSBTbG93QnVmZmVyXG5leHBvcnRzLklOU1BFQ1RfTUFYX0JZVEVTID0gNTBcbkJ1ZmZlci5wb29sU2l6ZSA9IDgxOTIgLy8gbm90IHVzZWQgYnkgdGhpcyBpbXBsZW1lbnRhdGlvblxuXG52YXIgcm9vdFBhcmVudCA9IHt9XG5cbi8qKlxuICogSWYgYEJ1ZmZlci5UWVBFRF9BUlJBWV9TVVBQT1JUYDpcbiAqICAgPT09IHRydWUgICAgVXNlIFVpbnQ4QXJyYXkgaW1wbGVtZW50YXRpb24gKGZhc3Rlc3QpXG4gKiAgID09PSBmYWxzZSAgIFVzZSBPYmplY3QgaW1wbGVtZW50YXRpb24gKG1vc3QgY29tcGF0aWJsZSwgZXZlbiBJRTYpXG4gKlxuICogQnJvd3NlcnMgdGhhdCBzdXBwb3J0IHR5cGVkIGFycmF5cyBhcmUgSUUgMTArLCBGaXJlZm94IDQrLCBDaHJvbWUgNyssIFNhZmFyaSA1LjErLFxuICogT3BlcmEgMTEuNissIGlPUyA0LjIrLlxuICpcbiAqIER1ZSB0byB2YXJpb3VzIGJyb3dzZXIgYnVncywgc29tZXRpbWVzIHRoZSBPYmplY3QgaW1wbGVtZW50YXRpb24gd2lsbCBiZSB1c2VkIGV2ZW5cbiAqIHdoZW4gdGhlIGJyb3dzZXIgc3VwcG9ydHMgdHlwZWQgYXJyYXlzLlxuICpcbiAqIE5vdGU6XG4gKlxuICogICAtIEZpcmVmb3ggNC0yOSBsYWNrcyBzdXBwb3J0IGZvciBhZGRpbmcgbmV3IHByb3BlcnRpZXMgdG8gYFVpbnQ4QXJyYXlgIGluc3RhbmNlcyxcbiAqICAgICBTZWU6IGh0dHBzOi8vYnVnemlsbGEubW96aWxsYS5vcmcvc2hvd19idWcuY2dpP2lkPTY5NTQzOC5cbiAqXG4gKiAgIC0gQ2hyb21lIDktMTAgaXMgbWlzc2luZyB0aGUgYFR5cGVkQXJyYXkucHJvdG90eXBlLnN1YmFycmF5YCBmdW5jdGlvbi5cbiAqXG4gKiAgIC0gSUUxMCBoYXMgYSBicm9rZW4gYFR5cGVkQXJyYXkucHJvdG90eXBlLnN1YmFycmF5YCBmdW5jdGlvbiB3aGljaCByZXR1cm5zIGFycmF5cyBvZlxuICogICAgIGluY29ycmVjdCBsZW5ndGggaW4gc29tZSBzaXR1YXRpb25zLlxuXG4gKiBXZSBkZXRlY3QgdGhlc2UgYnVnZ3kgYnJvd3NlcnMgYW5kIHNldCBgQnVmZmVyLlRZUEVEX0FSUkFZX1NVUFBPUlRgIHRvIGBmYWxzZWAgc28gdGhleVxuICogZ2V0IHRoZSBPYmplY3QgaW1wbGVtZW50YXRpb24sIHdoaWNoIGlzIHNsb3dlciBidXQgYmVoYXZlcyBjb3JyZWN0bHkuXG4gKi9cbkJ1ZmZlci5UWVBFRF9BUlJBWV9TVVBQT1JUID0gZ2xvYmFsLlRZUEVEX0FSUkFZX1NVUFBPUlQgIT09IHVuZGVmaW5lZFxuICA/IGdsb2JhbC5UWVBFRF9BUlJBWV9TVVBQT1JUXG4gIDogdHlwZWRBcnJheVN1cHBvcnQoKVxuXG5mdW5jdGlvbiB0eXBlZEFycmF5U3VwcG9ydCAoKSB7XG4gIHRyeSB7XG4gICAgdmFyIGFyciA9IG5ldyBVaW50OEFycmF5KDEpXG4gICAgYXJyLmZvbyA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuIDQyIH1cbiAgICByZXR1cm4gYXJyLmZvbygpID09PSA0MiAmJiAvLyB0eXBlZCBhcnJheSBpbnN0YW5jZXMgY2FuIGJlIGF1Z21lbnRlZFxuICAgICAgICB0eXBlb2YgYXJyLnN1YmFycmF5ID09PSAnZnVuY3Rpb24nICYmIC8vIGNocm9tZSA5LTEwIGxhY2sgYHN1YmFycmF5YFxuICAgICAgICBhcnIuc3ViYXJyYXkoMSwgMSkuYnl0ZUxlbmd0aCA9PT0gMCAvLyBpZTEwIGhhcyBicm9rZW4gYHN1YmFycmF5YFxuICB9IGNhdGNoIChlKSB7XG4gICAgcmV0dXJuIGZhbHNlXG4gIH1cbn1cblxuZnVuY3Rpb24ga01heExlbmd0aCAoKSB7XG4gIHJldHVybiBCdWZmZXIuVFlQRURfQVJSQVlfU1VQUE9SVFxuICAgID8gMHg3ZmZmZmZmZlxuICAgIDogMHgzZmZmZmZmZlxufVxuXG4vKipcbiAqIENsYXNzOiBCdWZmZXJcbiAqID09PT09PT09PT09PT1cbiAqXG4gKiBUaGUgQnVmZmVyIGNvbnN0cnVjdG9yIHJldHVybnMgaW5zdGFuY2VzIG9mIGBVaW50OEFycmF5YCB0aGF0IGFyZSBhdWdtZW50ZWRcbiAqIHdpdGggZnVuY3Rpb24gcHJvcGVydGllcyBmb3IgYWxsIHRoZSBub2RlIGBCdWZmZXJgIEFQSSBmdW5jdGlvbnMuIFdlIHVzZVxuICogYFVpbnQ4QXJyYXlgIHNvIHRoYXQgc3F1YXJlIGJyYWNrZXQgbm90YXRpb24gd29ya3MgYXMgZXhwZWN0ZWQgLS0gaXQgcmV0dXJuc1xuICogYSBzaW5nbGUgb2N0ZXQuXG4gKlxuICogQnkgYXVnbWVudGluZyB0aGUgaW5zdGFuY2VzLCB3ZSBjYW4gYXZvaWQgbW9kaWZ5aW5nIHRoZSBgVWludDhBcnJheWBcbiAqIHByb3RvdHlwZS5cbiAqL1xuZnVuY3Rpb24gQnVmZmVyIChhcmcpIHtcbiAgaWYgKCEodGhpcyBpbnN0YW5jZW9mIEJ1ZmZlcikpIHtcbiAgICAvLyBBdm9pZCBnb2luZyB0aHJvdWdoIGFuIEFyZ3VtZW50c0FkYXB0b3JUcmFtcG9saW5lIGluIHRoZSBjb21tb24gY2FzZS5cbiAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA+IDEpIHJldHVybiBuZXcgQnVmZmVyKGFyZywgYXJndW1lbnRzWzFdKVxuICAgIHJldHVybiBuZXcgQnVmZmVyKGFyZylcbiAgfVxuXG4gIGlmICghQnVmZmVyLlRZUEVEX0FSUkFZX1NVUFBPUlQpIHtcbiAgICB0aGlzLmxlbmd0aCA9IDBcbiAgICB0aGlzLnBhcmVudCA9IHVuZGVmaW5lZFxuICB9XG5cbiAgLy8gQ29tbW9uIGNhc2UuXG4gIGlmICh0eXBlb2YgYXJnID09PSAnbnVtYmVyJykge1xuICAgIHJldHVybiBmcm9tTnVtYmVyKHRoaXMsIGFyZylcbiAgfVxuXG4gIC8vIFNsaWdodGx5IGxlc3MgY29tbW9uIGNhc2UuXG4gIGlmICh0eXBlb2YgYXJnID09PSAnc3RyaW5nJykge1xuICAgIHJldHVybiBmcm9tU3RyaW5nKHRoaXMsIGFyZywgYXJndW1lbnRzLmxlbmd0aCA+IDEgPyBhcmd1bWVudHNbMV0gOiAndXRmOCcpXG4gIH1cblxuICAvLyBVbnVzdWFsLlxuICByZXR1cm4gZnJvbU9iamVjdCh0aGlzLCBhcmcpXG59XG5cbmZ1bmN0aW9uIGZyb21OdW1iZXIgKHRoYXQsIGxlbmd0aCkge1xuICB0aGF0ID0gYWxsb2NhdGUodGhhdCwgbGVuZ3RoIDwgMCA/IDAgOiBjaGVja2VkKGxlbmd0aCkgfCAwKVxuICBpZiAoIUJ1ZmZlci5UWVBFRF9BUlJBWV9TVVBQT1JUKSB7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgdGhhdFtpXSA9IDBcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHRoYXRcbn1cblxuZnVuY3Rpb24gZnJvbVN0cmluZyAodGhhdCwgc3RyaW5nLCBlbmNvZGluZykge1xuICBpZiAodHlwZW9mIGVuY29kaW5nICE9PSAnc3RyaW5nJyB8fCBlbmNvZGluZyA9PT0gJycpIGVuY29kaW5nID0gJ3V0ZjgnXG5cbiAgLy8gQXNzdW1wdGlvbjogYnl0ZUxlbmd0aCgpIHJldHVybiB2YWx1ZSBpcyBhbHdheXMgPCBrTWF4TGVuZ3RoLlxuICB2YXIgbGVuZ3RoID0gYnl0ZUxlbmd0aChzdHJpbmcsIGVuY29kaW5nKSB8IDBcbiAgdGhhdCA9IGFsbG9jYXRlKHRoYXQsIGxlbmd0aClcblxuICB0aGF0LndyaXRlKHN0cmluZywgZW5jb2RpbmcpXG4gIHJldHVybiB0aGF0XG59XG5cbmZ1bmN0aW9uIGZyb21PYmplY3QgKHRoYXQsIG9iamVjdCkge1xuICBpZiAoQnVmZmVyLmlzQnVmZmVyKG9iamVjdCkpIHJldHVybiBmcm9tQnVmZmVyKHRoYXQsIG9iamVjdClcblxuICBpZiAoaXNBcnJheShvYmplY3QpKSByZXR1cm4gZnJvbUFycmF5KHRoYXQsIG9iamVjdClcblxuICBpZiAob2JqZWN0ID09IG51bGwpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdtdXN0IHN0YXJ0IHdpdGggbnVtYmVyLCBidWZmZXIsIGFycmF5IG9yIHN0cmluZycpXG4gIH1cblxuICBpZiAodHlwZW9mIEFycmF5QnVmZmVyICE9PSAndW5kZWZpbmVkJykge1xuICAgIGlmIChvYmplY3QuYnVmZmVyIGluc3RhbmNlb2YgQXJyYXlCdWZmZXIpIHtcbiAgICAgIHJldHVybiBmcm9tVHlwZWRBcnJheSh0aGF0LCBvYmplY3QpXG4gICAgfVxuICAgIGlmIChvYmplY3QgaW5zdGFuY2VvZiBBcnJheUJ1ZmZlcikge1xuICAgICAgcmV0dXJuIGZyb21BcnJheUJ1ZmZlcih0aGF0LCBvYmplY3QpXG4gICAgfVxuICB9XG5cbiAgaWYgKG9iamVjdC5sZW5ndGgpIHJldHVybiBmcm9tQXJyYXlMaWtlKHRoYXQsIG9iamVjdClcblxuICByZXR1cm4gZnJvbUpzb25PYmplY3QodGhhdCwgb2JqZWN0KVxufVxuXG5mdW5jdGlvbiBmcm9tQnVmZmVyICh0aGF0LCBidWZmZXIpIHtcbiAgdmFyIGxlbmd0aCA9IGNoZWNrZWQoYnVmZmVyLmxlbmd0aCkgfCAwXG4gIHRoYXQgPSBhbGxvY2F0ZSh0aGF0LCBsZW5ndGgpXG4gIGJ1ZmZlci5jb3B5KHRoYXQsIDAsIDAsIGxlbmd0aClcbiAgcmV0dXJuIHRoYXRcbn1cblxuZnVuY3Rpb24gZnJvbUFycmF5ICh0aGF0LCBhcnJheSkge1xuICB2YXIgbGVuZ3RoID0gY2hlY2tlZChhcnJheS5sZW5ndGgpIHwgMFxuICB0aGF0ID0gYWxsb2NhdGUodGhhdCwgbGVuZ3RoKVxuICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbmd0aDsgaSArPSAxKSB7XG4gICAgdGhhdFtpXSA9IGFycmF5W2ldICYgMjU1XG4gIH1cbiAgcmV0dXJuIHRoYXRcbn1cblxuLy8gRHVwbGljYXRlIG9mIGZyb21BcnJheSgpIHRvIGtlZXAgZnJvbUFycmF5KCkgbW9ub21vcnBoaWMuXG5mdW5jdGlvbiBmcm9tVHlwZWRBcnJheSAodGhhdCwgYXJyYXkpIHtcbiAgdmFyIGxlbmd0aCA9IGNoZWNrZWQoYXJyYXkubGVuZ3RoKSB8IDBcbiAgdGhhdCA9IGFsbG9jYXRlKHRoYXQsIGxlbmd0aClcbiAgLy8gVHJ1bmNhdGluZyB0aGUgZWxlbWVudHMgaXMgcHJvYmFibHkgbm90IHdoYXQgcGVvcGxlIGV4cGVjdCBmcm9tIHR5cGVkXG4gIC8vIGFycmF5cyB3aXRoIEJZVEVTX1BFUl9FTEVNRU5UID4gMSBidXQgaXQncyBjb21wYXRpYmxlIHdpdGggdGhlIGJlaGF2aW9yXG4gIC8vIG9mIHRoZSBvbGQgQnVmZmVyIGNvbnN0cnVjdG9yLlxuICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbmd0aDsgaSArPSAxKSB7XG4gICAgdGhhdFtpXSA9IGFycmF5W2ldICYgMjU1XG4gIH1cbiAgcmV0dXJuIHRoYXRcbn1cblxuZnVuY3Rpb24gZnJvbUFycmF5QnVmZmVyICh0aGF0LCBhcnJheSkge1xuICBhcnJheS5ieXRlTGVuZ3RoIC8vIHRoaXMgdGhyb3dzIGlmIGBhcnJheWAgaXMgbm90IGEgdmFsaWQgQXJyYXlCdWZmZXJcblxuICBpZiAoQnVmZmVyLlRZUEVEX0FSUkFZX1NVUFBPUlQpIHtcbiAgICAvLyBSZXR1cm4gYW4gYXVnbWVudGVkIGBVaW50OEFycmF5YCBpbnN0YW5jZSwgZm9yIGJlc3QgcGVyZm9ybWFuY2VcbiAgICB0aGF0ID0gbmV3IFVpbnQ4QXJyYXkoYXJyYXkpXG4gICAgdGhhdC5fX3Byb3RvX18gPSBCdWZmZXIucHJvdG90eXBlXG4gIH0gZWxzZSB7XG4gICAgLy8gRmFsbGJhY2s6IFJldHVybiBhbiBvYmplY3QgaW5zdGFuY2Ugb2YgdGhlIEJ1ZmZlciBjbGFzc1xuICAgIHRoYXQgPSBmcm9tVHlwZWRBcnJheSh0aGF0LCBuZXcgVWludDhBcnJheShhcnJheSkpXG4gIH1cbiAgcmV0dXJuIHRoYXRcbn1cblxuZnVuY3Rpb24gZnJvbUFycmF5TGlrZSAodGhhdCwgYXJyYXkpIHtcbiAgdmFyIGxlbmd0aCA9IGNoZWNrZWQoYXJyYXkubGVuZ3RoKSB8IDBcbiAgdGhhdCA9IGFsbG9jYXRlKHRoYXQsIGxlbmd0aClcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW5ndGg7IGkgKz0gMSkge1xuICAgIHRoYXRbaV0gPSBhcnJheVtpXSAmIDI1NVxuICB9XG4gIHJldHVybiB0aGF0XG59XG5cbi8vIERlc2VyaWFsaXplIHsgdHlwZTogJ0J1ZmZlcicsIGRhdGE6IFsxLDIsMywuLi5dIH0gaW50byBhIEJ1ZmZlciBvYmplY3QuXG4vLyBSZXR1cm5zIGEgemVyby1sZW5ndGggYnVmZmVyIGZvciBpbnB1dHMgdGhhdCBkb24ndCBjb25mb3JtIHRvIHRoZSBzcGVjLlxuZnVuY3Rpb24gZnJvbUpzb25PYmplY3QgKHRoYXQsIG9iamVjdCkge1xuICB2YXIgYXJyYXlcbiAgdmFyIGxlbmd0aCA9IDBcblxuICBpZiAob2JqZWN0LnR5cGUgPT09ICdCdWZmZXInICYmIGlzQXJyYXkob2JqZWN0LmRhdGEpKSB7XG4gICAgYXJyYXkgPSBvYmplY3QuZGF0YVxuICAgIGxlbmd0aCA9IGNoZWNrZWQoYXJyYXkubGVuZ3RoKSB8IDBcbiAgfVxuICB0aGF0ID0gYWxsb2NhdGUodGhhdCwgbGVuZ3RoKVxuXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuZ3RoOyBpICs9IDEpIHtcbiAgICB0aGF0W2ldID0gYXJyYXlbaV0gJiAyNTVcbiAgfVxuICByZXR1cm4gdGhhdFxufVxuXG5pZiAoQnVmZmVyLlRZUEVEX0FSUkFZX1NVUFBPUlQpIHtcbiAgQnVmZmVyLnByb3RvdHlwZS5fX3Byb3RvX18gPSBVaW50OEFycmF5LnByb3RvdHlwZVxuICBCdWZmZXIuX19wcm90b19fID0gVWludDhBcnJheVxufSBlbHNlIHtcbiAgLy8gcHJlLXNldCBmb3IgdmFsdWVzIHRoYXQgbWF5IGV4aXN0IGluIHRoZSBmdXR1cmVcbiAgQnVmZmVyLnByb3RvdHlwZS5sZW5ndGggPSB1bmRlZmluZWRcbiAgQnVmZmVyLnByb3RvdHlwZS5wYXJlbnQgPSB1bmRlZmluZWRcbn1cblxuZnVuY3Rpb24gYWxsb2NhdGUgKHRoYXQsIGxlbmd0aCkge1xuICBpZiAoQnVmZmVyLlRZUEVEX0FSUkFZX1NVUFBPUlQpIHtcbiAgICAvLyBSZXR1cm4gYW4gYXVnbWVudGVkIGBVaW50OEFycmF5YCBpbnN0YW5jZSwgZm9yIGJlc3QgcGVyZm9ybWFuY2VcbiAgICB0aGF0ID0gbmV3IFVpbnQ4QXJyYXkobGVuZ3RoKVxuICAgIHRoYXQuX19wcm90b19fID0gQnVmZmVyLnByb3RvdHlwZVxuICB9IGVsc2Uge1xuICAgIC8vIEZhbGxiYWNrOiBSZXR1cm4gYW4gb2JqZWN0IGluc3RhbmNlIG9mIHRoZSBCdWZmZXIgY2xhc3NcbiAgICB0aGF0Lmxlbmd0aCA9IGxlbmd0aFxuICB9XG5cbiAgdmFyIGZyb21Qb29sID0gbGVuZ3RoICE9PSAwICYmIGxlbmd0aCA8PSBCdWZmZXIucG9vbFNpemUgPj4+IDFcbiAgaWYgKGZyb21Qb29sKSB0aGF0LnBhcmVudCA9IHJvb3RQYXJlbnRcblxuICByZXR1cm4gdGhhdFxufVxuXG5mdW5jdGlvbiBjaGVja2VkIChsZW5ndGgpIHtcbiAgLy8gTm90ZTogY2Fubm90IHVzZSBgbGVuZ3RoIDwga01heExlbmd0aGAgaGVyZSBiZWNhdXNlIHRoYXQgZmFpbHMgd2hlblxuICAvLyBsZW5ndGggaXMgTmFOICh3aGljaCBpcyBvdGhlcndpc2UgY29lcmNlZCB0byB6ZXJvLilcbiAgaWYgKGxlbmd0aCA+PSBrTWF4TGVuZ3RoKCkpIHtcbiAgICB0aHJvdyBuZXcgUmFuZ2VFcnJvcignQXR0ZW1wdCB0byBhbGxvY2F0ZSBCdWZmZXIgbGFyZ2VyIHRoYW4gbWF4aW11bSAnICtcbiAgICAgICAgICAgICAgICAgICAgICAgICAnc2l6ZTogMHgnICsga01heExlbmd0aCgpLnRvU3RyaW5nKDE2KSArICcgYnl0ZXMnKVxuICB9XG4gIHJldHVybiBsZW5ndGggfCAwXG59XG5cbmZ1bmN0aW9uIFNsb3dCdWZmZXIgKHN1YmplY3QsIGVuY29kaW5nKSB7XG4gIGlmICghKHRoaXMgaW5zdGFuY2VvZiBTbG93QnVmZmVyKSkgcmV0dXJuIG5ldyBTbG93QnVmZmVyKHN1YmplY3QsIGVuY29kaW5nKVxuXG4gIHZhciBidWYgPSBuZXcgQnVmZmVyKHN1YmplY3QsIGVuY29kaW5nKVxuICBkZWxldGUgYnVmLnBhcmVudFxuICByZXR1cm4gYnVmXG59XG5cbkJ1ZmZlci5pc0J1ZmZlciA9IGZ1bmN0aW9uIGlzQnVmZmVyIChiKSB7XG4gIHJldHVybiAhIShiICE9IG51bGwgJiYgYi5faXNCdWZmZXIpXG59XG5cbkJ1ZmZlci5jb21wYXJlID0gZnVuY3Rpb24gY29tcGFyZSAoYSwgYikge1xuICBpZiAoIUJ1ZmZlci5pc0J1ZmZlcihhKSB8fCAhQnVmZmVyLmlzQnVmZmVyKGIpKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcignQXJndW1lbnRzIG11c3QgYmUgQnVmZmVycycpXG4gIH1cblxuICBpZiAoYSA9PT0gYikgcmV0dXJuIDBcblxuICB2YXIgeCA9IGEubGVuZ3RoXG4gIHZhciB5ID0gYi5sZW5ndGhcblxuICB2YXIgaSA9IDBcbiAgdmFyIGxlbiA9IE1hdGgubWluKHgsIHkpXG4gIHdoaWxlIChpIDwgbGVuKSB7XG4gICAgaWYgKGFbaV0gIT09IGJbaV0pIGJyZWFrXG5cbiAgICArK2lcbiAgfVxuXG4gIGlmIChpICE9PSBsZW4pIHtcbiAgICB4ID0gYVtpXVxuICAgIHkgPSBiW2ldXG4gIH1cblxuICBpZiAoeCA8IHkpIHJldHVybiAtMVxuICBpZiAoeSA8IHgpIHJldHVybiAxXG4gIHJldHVybiAwXG59XG5cbkJ1ZmZlci5pc0VuY29kaW5nID0gZnVuY3Rpb24gaXNFbmNvZGluZyAoZW5jb2RpbmcpIHtcbiAgc3dpdGNoIChTdHJpbmcoZW5jb2RpbmcpLnRvTG93ZXJDYXNlKCkpIHtcbiAgICBjYXNlICdoZXgnOlxuICAgIGNhc2UgJ3V0ZjgnOlxuICAgIGNhc2UgJ3V0Zi04JzpcbiAgICBjYXNlICdhc2NpaSc6XG4gICAgY2FzZSAnYmluYXJ5JzpcbiAgICBjYXNlICdiYXNlNjQnOlxuICAgIGNhc2UgJ3Jhdyc6XG4gICAgY2FzZSAndWNzMic6XG4gICAgY2FzZSAndWNzLTInOlxuICAgIGNhc2UgJ3V0ZjE2bGUnOlxuICAgIGNhc2UgJ3V0Zi0xNmxlJzpcbiAgICAgIHJldHVybiB0cnVlXG4gICAgZGVmYXVsdDpcbiAgICAgIHJldHVybiBmYWxzZVxuICB9XG59XG5cbkJ1ZmZlci5jb25jYXQgPSBmdW5jdGlvbiBjb25jYXQgKGxpc3QsIGxlbmd0aCkge1xuICBpZiAoIWlzQXJyYXkobGlzdCkpIHRocm93IG5ldyBUeXBlRXJyb3IoJ2xpc3QgYXJndW1lbnQgbXVzdCBiZSBhbiBBcnJheSBvZiBCdWZmZXJzLicpXG5cbiAgaWYgKGxpc3QubGVuZ3RoID09PSAwKSB7XG4gICAgcmV0dXJuIG5ldyBCdWZmZXIoMClcbiAgfVxuXG4gIHZhciBpXG4gIGlmIChsZW5ndGggPT09IHVuZGVmaW5lZCkge1xuICAgIGxlbmd0aCA9IDBcbiAgICBmb3IgKGkgPSAwOyBpIDwgbGlzdC5sZW5ndGg7IGkrKykge1xuICAgICAgbGVuZ3RoICs9IGxpc3RbaV0ubGVuZ3RoXG4gICAgfVxuICB9XG5cbiAgdmFyIGJ1ZiA9IG5ldyBCdWZmZXIobGVuZ3RoKVxuICB2YXIgcG9zID0gMFxuICBmb3IgKGkgPSAwOyBpIDwgbGlzdC5sZW5ndGg7IGkrKykge1xuICAgIHZhciBpdGVtID0gbGlzdFtpXVxuICAgIGl0ZW0uY29weShidWYsIHBvcylcbiAgICBwb3MgKz0gaXRlbS5sZW5ndGhcbiAgfVxuICByZXR1cm4gYnVmXG59XG5cbmZ1bmN0aW9uIGJ5dGVMZW5ndGggKHN0cmluZywgZW5jb2RpbmcpIHtcbiAgaWYgKHR5cGVvZiBzdHJpbmcgIT09ICdzdHJpbmcnKSBzdHJpbmcgPSAnJyArIHN0cmluZ1xuXG4gIHZhciBsZW4gPSBzdHJpbmcubGVuZ3RoXG4gIGlmIChsZW4gPT09IDApIHJldHVybiAwXG5cbiAgLy8gVXNlIGEgZm9yIGxvb3AgdG8gYXZvaWQgcmVjdXJzaW9uXG4gIHZhciBsb3dlcmVkQ2FzZSA9IGZhbHNlXG4gIGZvciAoOzspIHtcbiAgICBzd2l0Y2ggKGVuY29kaW5nKSB7XG4gICAgICBjYXNlICdhc2NpaSc6XG4gICAgICBjYXNlICdiaW5hcnknOlxuICAgICAgLy8gRGVwcmVjYXRlZFxuICAgICAgY2FzZSAncmF3JzpcbiAgICAgIGNhc2UgJ3Jhd3MnOlxuICAgICAgICByZXR1cm4gbGVuXG4gICAgICBjYXNlICd1dGY4JzpcbiAgICAgIGNhc2UgJ3V0Zi04JzpcbiAgICAgICAgcmV0dXJuIHV0ZjhUb0J5dGVzKHN0cmluZykubGVuZ3RoXG4gICAgICBjYXNlICd1Y3MyJzpcbiAgICAgIGNhc2UgJ3Vjcy0yJzpcbiAgICAgIGNhc2UgJ3V0ZjE2bGUnOlxuICAgICAgY2FzZSAndXRmLTE2bGUnOlxuICAgICAgICByZXR1cm4gbGVuICogMlxuICAgICAgY2FzZSAnaGV4JzpcbiAgICAgICAgcmV0dXJuIGxlbiA+Pj4gMVxuICAgICAgY2FzZSAnYmFzZTY0JzpcbiAgICAgICAgcmV0dXJuIGJhc2U2NFRvQnl0ZXMoc3RyaW5nKS5sZW5ndGhcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIGlmIChsb3dlcmVkQ2FzZSkgcmV0dXJuIHV0ZjhUb0J5dGVzKHN0cmluZykubGVuZ3RoIC8vIGFzc3VtZSB1dGY4XG4gICAgICAgIGVuY29kaW5nID0gKCcnICsgZW5jb2RpbmcpLnRvTG93ZXJDYXNlKClcbiAgICAgICAgbG93ZXJlZENhc2UgPSB0cnVlXG4gICAgfVxuICB9XG59XG5CdWZmZXIuYnl0ZUxlbmd0aCA9IGJ5dGVMZW5ndGhcblxuZnVuY3Rpb24gc2xvd1RvU3RyaW5nIChlbmNvZGluZywgc3RhcnQsIGVuZCkge1xuICB2YXIgbG93ZXJlZENhc2UgPSBmYWxzZVxuXG4gIHN0YXJ0ID0gc3RhcnQgfCAwXG4gIGVuZCA9IGVuZCA9PT0gdW5kZWZpbmVkIHx8IGVuZCA9PT0gSW5maW5pdHkgPyB0aGlzLmxlbmd0aCA6IGVuZCB8IDBcblxuICBpZiAoIWVuY29kaW5nKSBlbmNvZGluZyA9ICd1dGY4J1xuICBpZiAoc3RhcnQgPCAwKSBzdGFydCA9IDBcbiAgaWYgKGVuZCA+IHRoaXMubGVuZ3RoKSBlbmQgPSB0aGlzLmxlbmd0aFxuICBpZiAoZW5kIDw9IHN0YXJ0KSByZXR1cm4gJydcblxuICB3aGlsZSAodHJ1ZSkge1xuICAgIHN3aXRjaCAoZW5jb2RpbmcpIHtcbiAgICAgIGNhc2UgJ2hleCc6XG4gICAgICAgIHJldHVybiBoZXhTbGljZSh0aGlzLCBzdGFydCwgZW5kKVxuXG4gICAgICBjYXNlICd1dGY4JzpcbiAgICAgIGNhc2UgJ3V0Zi04JzpcbiAgICAgICAgcmV0dXJuIHV0ZjhTbGljZSh0aGlzLCBzdGFydCwgZW5kKVxuXG4gICAgICBjYXNlICdhc2NpaSc6XG4gICAgICAgIHJldHVybiBhc2NpaVNsaWNlKHRoaXMsIHN0YXJ0LCBlbmQpXG5cbiAgICAgIGNhc2UgJ2JpbmFyeSc6XG4gICAgICAgIHJldHVybiBiaW5hcnlTbGljZSh0aGlzLCBzdGFydCwgZW5kKVxuXG4gICAgICBjYXNlICdiYXNlNjQnOlxuICAgICAgICByZXR1cm4gYmFzZTY0U2xpY2UodGhpcywgc3RhcnQsIGVuZClcblxuICAgICAgY2FzZSAndWNzMic6XG4gICAgICBjYXNlICd1Y3MtMic6XG4gICAgICBjYXNlICd1dGYxNmxlJzpcbiAgICAgIGNhc2UgJ3V0Zi0xNmxlJzpcbiAgICAgICAgcmV0dXJuIHV0ZjE2bGVTbGljZSh0aGlzLCBzdGFydCwgZW5kKVxuXG4gICAgICBkZWZhdWx0OlxuICAgICAgICBpZiAobG93ZXJlZENhc2UpIHRocm93IG5ldyBUeXBlRXJyb3IoJ1Vua25vd24gZW5jb2Rpbmc6ICcgKyBlbmNvZGluZylcbiAgICAgICAgZW5jb2RpbmcgPSAoZW5jb2RpbmcgKyAnJykudG9Mb3dlckNhc2UoKVxuICAgICAgICBsb3dlcmVkQ2FzZSA9IHRydWVcbiAgICB9XG4gIH1cbn1cblxuLy8gRXZlbiB0aG91Z2ggdGhpcyBwcm9wZXJ0eSBpcyBwcml2YXRlLCBpdCBzaG91bGRuJ3QgYmUgcmVtb3ZlZCBiZWNhdXNlIGl0IGlzXG4vLyB1c2VkIGJ5IGBpcy1idWZmZXJgIHRvIGRldGVjdCBidWZmZXIgaW5zdGFuY2VzIGluIFNhZmFyaSA1LTcuXG5CdWZmZXIucHJvdG90eXBlLl9pc0J1ZmZlciA9IHRydWVcblxuQnVmZmVyLnByb3RvdHlwZS50b1N0cmluZyA9IGZ1bmN0aW9uIHRvU3RyaW5nICgpIHtcbiAgdmFyIGxlbmd0aCA9IHRoaXMubGVuZ3RoIHwgMFxuICBpZiAobGVuZ3RoID09PSAwKSByZXR1cm4gJydcbiAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDApIHJldHVybiB1dGY4U2xpY2UodGhpcywgMCwgbGVuZ3RoKVxuICByZXR1cm4gc2xvd1RvU3RyaW5nLmFwcGx5KHRoaXMsIGFyZ3VtZW50cylcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5lcXVhbHMgPSBmdW5jdGlvbiBlcXVhbHMgKGIpIHtcbiAgaWYgKCFCdWZmZXIuaXNCdWZmZXIoYikpIHRocm93IG5ldyBUeXBlRXJyb3IoJ0FyZ3VtZW50IG11c3QgYmUgYSBCdWZmZXInKVxuICBpZiAodGhpcyA9PT0gYikgcmV0dXJuIHRydWVcbiAgcmV0dXJuIEJ1ZmZlci5jb21wYXJlKHRoaXMsIGIpID09PSAwXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUuaW5zcGVjdCA9IGZ1bmN0aW9uIGluc3BlY3QgKCkge1xuICB2YXIgc3RyID0gJydcbiAgdmFyIG1heCA9IGV4cG9ydHMuSU5TUEVDVF9NQVhfQllURVNcbiAgaWYgKHRoaXMubGVuZ3RoID4gMCkge1xuICAgIHN0ciA9IHRoaXMudG9TdHJpbmcoJ2hleCcsIDAsIG1heCkubWF0Y2goLy57Mn0vZykuam9pbignICcpXG4gICAgaWYgKHRoaXMubGVuZ3RoID4gbWF4KSBzdHIgKz0gJyAuLi4gJ1xuICB9XG4gIHJldHVybiAnPEJ1ZmZlciAnICsgc3RyICsgJz4nXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUuY29tcGFyZSA9IGZ1bmN0aW9uIGNvbXBhcmUgKGIpIHtcbiAgaWYgKCFCdWZmZXIuaXNCdWZmZXIoYikpIHRocm93IG5ldyBUeXBlRXJyb3IoJ0FyZ3VtZW50IG11c3QgYmUgYSBCdWZmZXInKVxuICBpZiAodGhpcyA9PT0gYikgcmV0dXJuIDBcbiAgcmV0dXJuIEJ1ZmZlci5jb21wYXJlKHRoaXMsIGIpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUuaW5kZXhPZiA9IGZ1bmN0aW9uIGluZGV4T2YgKHZhbCwgYnl0ZU9mZnNldCkge1xuICBpZiAoYnl0ZU9mZnNldCA+IDB4N2ZmZmZmZmYpIGJ5dGVPZmZzZXQgPSAweDdmZmZmZmZmXG4gIGVsc2UgaWYgKGJ5dGVPZmZzZXQgPCAtMHg4MDAwMDAwMCkgYnl0ZU9mZnNldCA9IC0weDgwMDAwMDAwXG4gIGJ5dGVPZmZzZXQgPj49IDBcblxuICBpZiAodGhpcy5sZW5ndGggPT09IDApIHJldHVybiAtMVxuICBpZiAoYnl0ZU9mZnNldCA+PSB0aGlzLmxlbmd0aCkgcmV0dXJuIC0xXG5cbiAgLy8gTmVnYXRpdmUgb2Zmc2V0cyBzdGFydCBmcm9tIHRoZSBlbmQgb2YgdGhlIGJ1ZmZlclxuICBpZiAoYnl0ZU9mZnNldCA8IDApIGJ5dGVPZmZzZXQgPSBNYXRoLm1heCh0aGlzLmxlbmd0aCArIGJ5dGVPZmZzZXQsIDApXG5cbiAgaWYgKHR5cGVvZiB2YWwgPT09ICdzdHJpbmcnKSB7XG4gICAgaWYgKHZhbC5sZW5ndGggPT09IDApIHJldHVybiAtMSAvLyBzcGVjaWFsIGNhc2U6IGxvb2tpbmcgZm9yIGVtcHR5IHN0cmluZyBhbHdheXMgZmFpbHNcbiAgICByZXR1cm4gU3RyaW5nLnByb3RvdHlwZS5pbmRleE9mLmNhbGwodGhpcywgdmFsLCBieXRlT2Zmc2V0KVxuICB9XG4gIGlmIChCdWZmZXIuaXNCdWZmZXIodmFsKSkge1xuICAgIHJldHVybiBhcnJheUluZGV4T2YodGhpcywgdmFsLCBieXRlT2Zmc2V0KVxuICB9XG4gIGlmICh0eXBlb2YgdmFsID09PSAnbnVtYmVyJykge1xuICAgIGlmIChCdWZmZXIuVFlQRURfQVJSQVlfU1VQUE9SVCAmJiBVaW50OEFycmF5LnByb3RvdHlwZS5pbmRleE9mID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICByZXR1cm4gVWludDhBcnJheS5wcm90b3R5cGUuaW5kZXhPZi5jYWxsKHRoaXMsIHZhbCwgYnl0ZU9mZnNldClcbiAgICB9XG4gICAgcmV0dXJuIGFycmF5SW5kZXhPZih0aGlzLCBbIHZhbCBdLCBieXRlT2Zmc2V0KVxuICB9XG5cbiAgZnVuY3Rpb24gYXJyYXlJbmRleE9mIChhcnIsIHZhbCwgYnl0ZU9mZnNldCkge1xuICAgIHZhciBmb3VuZEluZGV4ID0gLTFcbiAgICBmb3IgKHZhciBpID0gMDsgYnl0ZU9mZnNldCArIGkgPCBhcnIubGVuZ3RoOyBpKyspIHtcbiAgICAgIGlmIChhcnJbYnl0ZU9mZnNldCArIGldID09PSB2YWxbZm91bmRJbmRleCA9PT0gLTEgPyAwIDogaSAtIGZvdW5kSW5kZXhdKSB7XG4gICAgICAgIGlmIChmb3VuZEluZGV4ID09PSAtMSkgZm91bmRJbmRleCA9IGlcbiAgICAgICAgaWYgKGkgLSBmb3VuZEluZGV4ICsgMSA9PT0gdmFsLmxlbmd0aCkgcmV0dXJuIGJ5dGVPZmZzZXQgKyBmb3VuZEluZGV4XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBmb3VuZEluZGV4ID0gLTFcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIC0xXG4gIH1cblxuICB0aHJvdyBuZXcgVHlwZUVycm9yKCd2YWwgbXVzdCBiZSBzdHJpbmcsIG51bWJlciBvciBCdWZmZXInKVxufVxuXG5mdW5jdGlvbiBoZXhXcml0ZSAoYnVmLCBzdHJpbmcsIG9mZnNldCwgbGVuZ3RoKSB7XG4gIG9mZnNldCA9IE51bWJlcihvZmZzZXQpIHx8IDBcbiAgdmFyIHJlbWFpbmluZyA9IGJ1Zi5sZW5ndGggLSBvZmZzZXRcbiAgaWYgKCFsZW5ndGgpIHtcbiAgICBsZW5ndGggPSByZW1haW5pbmdcbiAgfSBlbHNlIHtcbiAgICBsZW5ndGggPSBOdW1iZXIobGVuZ3RoKVxuICAgIGlmIChsZW5ndGggPiByZW1haW5pbmcpIHtcbiAgICAgIGxlbmd0aCA9IHJlbWFpbmluZ1xuICAgIH1cbiAgfVxuXG4gIC8vIG11c3QgYmUgYW4gZXZlbiBudW1iZXIgb2YgZGlnaXRzXG4gIHZhciBzdHJMZW4gPSBzdHJpbmcubGVuZ3RoXG4gIGlmIChzdHJMZW4gJSAyICE9PSAwKSB0aHJvdyBuZXcgRXJyb3IoJ0ludmFsaWQgaGV4IHN0cmluZycpXG5cbiAgaWYgKGxlbmd0aCA+IHN0ckxlbiAvIDIpIHtcbiAgICBsZW5ndGggPSBzdHJMZW4gLyAyXG4gIH1cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgIHZhciBwYXJzZWQgPSBwYXJzZUludChzdHJpbmcuc3Vic3RyKGkgKiAyLCAyKSwgMTYpXG4gICAgaWYgKGlzTmFOKHBhcnNlZCkpIHRocm93IG5ldyBFcnJvcignSW52YWxpZCBoZXggc3RyaW5nJylcbiAgICBidWZbb2Zmc2V0ICsgaV0gPSBwYXJzZWRcbiAgfVxuICByZXR1cm4gaVxufVxuXG5mdW5jdGlvbiB1dGY4V3JpdGUgKGJ1Ziwgc3RyaW5nLCBvZmZzZXQsIGxlbmd0aCkge1xuICByZXR1cm4gYmxpdEJ1ZmZlcih1dGY4VG9CeXRlcyhzdHJpbmcsIGJ1Zi5sZW5ndGggLSBvZmZzZXQpLCBidWYsIG9mZnNldCwgbGVuZ3RoKVxufVxuXG5mdW5jdGlvbiBhc2NpaVdyaXRlIChidWYsIHN0cmluZywgb2Zmc2V0LCBsZW5ndGgpIHtcbiAgcmV0dXJuIGJsaXRCdWZmZXIoYXNjaWlUb0J5dGVzKHN0cmluZyksIGJ1Ziwgb2Zmc2V0LCBsZW5ndGgpXG59XG5cbmZ1bmN0aW9uIGJpbmFyeVdyaXRlIChidWYsIHN0cmluZywgb2Zmc2V0LCBsZW5ndGgpIHtcbiAgcmV0dXJuIGFzY2lpV3JpdGUoYnVmLCBzdHJpbmcsIG9mZnNldCwgbGVuZ3RoKVxufVxuXG5mdW5jdGlvbiBiYXNlNjRXcml0ZSAoYnVmLCBzdHJpbmcsIG9mZnNldCwgbGVuZ3RoKSB7XG4gIHJldHVybiBibGl0QnVmZmVyKGJhc2U2NFRvQnl0ZXMoc3RyaW5nKSwgYnVmLCBvZmZzZXQsIGxlbmd0aClcbn1cblxuZnVuY3Rpb24gdWNzMldyaXRlIChidWYsIHN0cmluZywgb2Zmc2V0LCBsZW5ndGgpIHtcbiAgcmV0dXJuIGJsaXRCdWZmZXIodXRmMTZsZVRvQnl0ZXMoc3RyaW5nLCBidWYubGVuZ3RoIC0gb2Zmc2V0KSwgYnVmLCBvZmZzZXQsIGxlbmd0aClcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZSA9IGZ1bmN0aW9uIHdyaXRlIChzdHJpbmcsIG9mZnNldCwgbGVuZ3RoLCBlbmNvZGluZykge1xuICAvLyBCdWZmZXIjd3JpdGUoc3RyaW5nKVxuICBpZiAob2Zmc2V0ID09PSB1bmRlZmluZWQpIHtcbiAgICBlbmNvZGluZyA9ICd1dGY4J1xuICAgIGxlbmd0aCA9IHRoaXMubGVuZ3RoXG4gICAgb2Zmc2V0ID0gMFxuICAvLyBCdWZmZXIjd3JpdGUoc3RyaW5nLCBlbmNvZGluZylcbiAgfSBlbHNlIGlmIChsZW5ndGggPT09IHVuZGVmaW5lZCAmJiB0eXBlb2Ygb2Zmc2V0ID09PSAnc3RyaW5nJykge1xuICAgIGVuY29kaW5nID0gb2Zmc2V0XG4gICAgbGVuZ3RoID0gdGhpcy5sZW5ndGhcbiAgICBvZmZzZXQgPSAwXG4gIC8vIEJ1ZmZlciN3cml0ZShzdHJpbmcsIG9mZnNldFssIGxlbmd0aF1bLCBlbmNvZGluZ10pXG4gIH0gZWxzZSBpZiAoaXNGaW5pdGUob2Zmc2V0KSkge1xuICAgIG9mZnNldCA9IG9mZnNldCB8IDBcbiAgICBpZiAoaXNGaW5pdGUobGVuZ3RoKSkge1xuICAgICAgbGVuZ3RoID0gbGVuZ3RoIHwgMFxuICAgICAgaWYgKGVuY29kaW5nID09PSB1bmRlZmluZWQpIGVuY29kaW5nID0gJ3V0ZjgnXG4gICAgfSBlbHNlIHtcbiAgICAgIGVuY29kaW5nID0gbGVuZ3RoXG4gICAgICBsZW5ndGggPSB1bmRlZmluZWRcbiAgICB9XG4gIC8vIGxlZ2FjeSB3cml0ZShzdHJpbmcsIGVuY29kaW5nLCBvZmZzZXQsIGxlbmd0aCkgLSByZW1vdmUgaW4gdjAuMTNcbiAgfSBlbHNlIHtcbiAgICB2YXIgc3dhcCA9IGVuY29kaW5nXG4gICAgZW5jb2RpbmcgPSBvZmZzZXRcbiAgICBvZmZzZXQgPSBsZW5ndGggfCAwXG4gICAgbGVuZ3RoID0gc3dhcFxuICB9XG5cbiAgdmFyIHJlbWFpbmluZyA9IHRoaXMubGVuZ3RoIC0gb2Zmc2V0XG4gIGlmIChsZW5ndGggPT09IHVuZGVmaW5lZCB8fCBsZW5ndGggPiByZW1haW5pbmcpIGxlbmd0aCA9IHJlbWFpbmluZ1xuXG4gIGlmICgoc3RyaW5nLmxlbmd0aCA+IDAgJiYgKGxlbmd0aCA8IDAgfHwgb2Zmc2V0IDwgMCkpIHx8IG9mZnNldCA+IHRoaXMubGVuZ3RoKSB7XG4gICAgdGhyb3cgbmV3IFJhbmdlRXJyb3IoJ2F0dGVtcHQgdG8gd3JpdGUgb3V0c2lkZSBidWZmZXIgYm91bmRzJylcbiAgfVxuXG4gIGlmICghZW5jb2RpbmcpIGVuY29kaW5nID0gJ3V0ZjgnXG5cbiAgdmFyIGxvd2VyZWRDYXNlID0gZmFsc2VcbiAgZm9yICg7Oykge1xuICAgIHN3aXRjaCAoZW5jb2RpbmcpIHtcbiAgICAgIGNhc2UgJ2hleCc6XG4gICAgICAgIHJldHVybiBoZXhXcml0ZSh0aGlzLCBzdHJpbmcsIG9mZnNldCwgbGVuZ3RoKVxuXG4gICAgICBjYXNlICd1dGY4JzpcbiAgICAgIGNhc2UgJ3V0Zi04JzpcbiAgICAgICAgcmV0dXJuIHV0ZjhXcml0ZSh0aGlzLCBzdHJpbmcsIG9mZnNldCwgbGVuZ3RoKVxuXG4gICAgICBjYXNlICdhc2NpaSc6XG4gICAgICAgIHJldHVybiBhc2NpaVdyaXRlKHRoaXMsIHN0cmluZywgb2Zmc2V0LCBsZW5ndGgpXG5cbiAgICAgIGNhc2UgJ2JpbmFyeSc6XG4gICAgICAgIHJldHVybiBiaW5hcnlXcml0ZSh0aGlzLCBzdHJpbmcsIG9mZnNldCwgbGVuZ3RoKVxuXG4gICAgICBjYXNlICdiYXNlNjQnOlxuICAgICAgICAvLyBXYXJuaW5nOiBtYXhMZW5ndGggbm90IHRha2VuIGludG8gYWNjb3VudCBpbiBiYXNlNjRXcml0ZVxuICAgICAgICByZXR1cm4gYmFzZTY0V3JpdGUodGhpcywgc3RyaW5nLCBvZmZzZXQsIGxlbmd0aClcblxuICAgICAgY2FzZSAndWNzMic6XG4gICAgICBjYXNlICd1Y3MtMic6XG4gICAgICBjYXNlICd1dGYxNmxlJzpcbiAgICAgIGNhc2UgJ3V0Zi0xNmxlJzpcbiAgICAgICAgcmV0dXJuIHVjczJXcml0ZSh0aGlzLCBzdHJpbmcsIG9mZnNldCwgbGVuZ3RoKVxuXG4gICAgICBkZWZhdWx0OlxuICAgICAgICBpZiAobG93ZXJlZENhc2UpIHRocm93IG5ldyBUeXBlRXJyb3IoJ1Vua25vd24gZW5jb2Rpbmc6ICcgKyBlbmNvZGluZylcbiAgICAgICAgZW5jb2RpbmcgPSAoJycgKyBlbmNvZGluZykudG9Mb3dlckNhc2UoKVxuICAgICAgICBsb3dlcmVkQ2FzZSA9IHRydWVcbiAgICB9XG4gIH1cbn1cblxuQnVmZmVyLnByb3RvdHlwZS50b0pTT04gPSBmdW5jdGlvbiB0b0pTT04gKCkge1xuICByZXR1cm4ge1xuICAgIHR5cGU6ICdCdWZmZXInLFxuICAgIGRhdGE6IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKHRoaXMuX2FyciB8fCB0aGlzLCAwKVxuICB9XG59XG5cbmZ1bmN0aW9uIGJhc2U2NFNsaWNlIChidWYsIHN0YXJ0LCBlbmQpIHtcbiAgaWYgKHN0YXJ0ID09PSAwICYmIGVuZCA9PT0gYnVmLmxlbmd0aCkge1xuICAgIHJldHVybiBiYXNlNjQuZnJvbUJ5dGVBcnJheShidWYpXG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIGJhc2U2NC5mcm9tQnl0ZUFycmF5KGJ1Zi5zbGljZShzdGFydCwgZW5kKSlcbiAgfVxufVxuXG5mdW5jdGlvbiB1dGY4U2xpY2UgKGJ1Ziwgc3RhcnQsIGVuZCkge1xuICBlbmQgPSBNYXRoLm1pbihidWYubGVuZ3RoLCBlbmQpXG4gIHZhciByZXMgPSBbXVxuXG4gIHZhciBpID0gc3RhcnRcbiAgd2hpbGUgKGkgPCBlbmQpIHtcbiAgICB2YXIgZmlyc3RCeXRlID0gYnVmW2ldXG4gICAgdmFyIGNvZGVQb2ludCA9IG51bGxcbiAgICB2YXIgYnl0ZXNQZXJTZXF1ZW5jZSA9IChmaXJzdEJ5dGUgPiAweEVGKSA/IDRcbiAgICAgIDogKGZpcnN0Qnl0ZSA+IDB4REYpID8gM1xuICAgICAgOiAoZmlyc3RCeXRlID4gMHhCRikgPyAyXG4gICAgICA6IDFcblxuICAgIGlmIChpICsgYnl0ZXNQZXJTZXF1ZW5jZSA8PSBlbmQpIHtcbiAgICAgIHZhciBzZWNvbmRCeXRlLCB0aGlyZEJ5dGUsIGZvdXJ0aEJ5dGUsIHRlbXBDb2RlUG9pbnRcblxuICAgICAgc3dpdGNoIChieXRlc1BlclNlcXVlbmNlKSB7XG4gICAgICAgIGNhc2UgMTpcbiAgICAgICAgICBpZiAoZmlyc3RCeXRlIDwgMHg4MCkge1xuICAgICAgICAgICAgY29kZVBvaW50ID0gZmlyc3RCeXRlXG4gICAgICAgICAgfVxuICAgICAgICAgIGJyZWFrXG4gICAgICAgIGNhc2UgMjpcbiAgICAgICAgICBzZWNvbmRCeXRlID0gYnVmW2kgKyAxXVxuICAgICAgICAgIGlmICgoc2Vjb25kQnl0ZSAmIDB4QzApID09PSAweDgwKSB7XG4gICAgICAgICAgICB0ZW1wQ29kZVBvaW50ID0gKGZpcnN0Qnl0ZSAmIDB4MUYpIDw8IDB4NiB8IChzZWNvbmRCeXRlICYgMHgzRilcbiAgICAgICAgICAgIGlmICh0ZW1wQ29kZVBvaW50ID4gMHg3Rikge1xuICAgICAgICAgICAgICBjb2RlUG9pbnQgPSB0ZW1wQ29kZVBvaW50XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgIGJyZWFrXG4gICAgICAgIGNhc2UgMzpcbiAgICAgICAgICBzZWNvbmRCeXRlID0gYnVmW2kgKyAxXVxuICAgICAgICAgIHRoaXJkQnl0ZSA9IGJ1ZltpICsgMl1cbiAgICAgICAgICBpZiAoKHNlY29uZEJ5dGUgJiAweEMwKSA9PT0gMHg4MCAmJiAodGhpcmRCeXRlICYgMHhDMCkgPT09IDB4ODApIHtcbiAgICAgICAgICAgIHRlbXBDb2RlUG9pbnQgPSAoZmlyc3RCeXRlICYgMHhGKSA8PCAweEMgfCAoc2Vjb25kQnl0ZSAmIDB4M0YpIDw8IDB4NiB8ICh0aGlyZEJ5dGUgJiAweDNGKVxuICAgICAgICAgICAgaWYgKHRlbXBDb2RlUG9pbnQgPiAweDdGRiAmJiAodGVtcENvZGVQb2ludCA8IDB4RDgwMCB8fCB0ZW1wQ29kZVBvaW50ID4gMHhERkZGKSkge1xuICAgICAgICAgICAgICBjb2RlUG9pbnQgPSB0ZW1wQ29kZVBvaW50XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgIGJyZWFrXG4gICAgICAgIGNhc2UgNDpcbiAgICAgICAgICBzZWNvbmRCeXRlID0gYnVmW2kgKyAxXVxuICAgICAgICAgIHRoaXJkQnl0ZSA9IGJ1ZltpICsgMl1cbiAgICAgICAgICBmb3VydGhCeXRlID0gYnVmW2kgKyAzXVxuICAgICAgICAgIGlmICgoc2Vjb25kQnl0ZSAmIDB4QzApID09PSAweDgwICYmICh0aGlyZEJ5dGUgJiAweEMwKSA9PT0gMHg4MCAmJiAoZm91cnRoQnl0ZSAmIDB4QzApID09PSAweDgwKSB7XG4gICAgICAgICAgICB0ZW1wQ29kZVBvaW50ID0gKGZpcnN0Qnl0ZSAmIDB4RikgPDwgMHgxMiB8IChzZWNvbmRCeXRlICYgMHgzRikgPDwgMHhDIHwgKHRoaXJkQnl0ZSAmIDB4M0YpIDw8IDB4NiB8IChmb3VydGhCeXRlICYgMHgzRilcbiAgICAgICAgICAgIGlmICh0ZW1wQ29kZVBvaW50ID4gMHhGRkZGICYmIHRlbXBDb2RlUG9pbnQgPCAweDExMDAwMCkge1xuICAgICAgICAgICAgICBjb2RlUG9pbnQgPSB0ZW1wQ29kZVBvaW50XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChjb2RlUG9pbnQgPT09IG51bGwpIHtcbiAgICAgIC8vIHdlIGRpZCBub3QgZ2VuZXJhdGUgYSB2YWxpZCBjb2RlUG9pbnQgc28gaW5zZXJ0IGFcbiAgICAgIC8vIHJlcGxhY2VtZW50IGNoYXIgKFUrRkZGRCkgYW5kIGFkdmFuY2Ugb25seSAxIGJ5dGVcbiAgICAgIGNvZGVQb2ludCA9IDB4RkZGRFxuICAgICAgYnl0ZXNQZXJTZXF1ZW5jZSA9IDFcbiAgICB9IGVsc2UgaWYgKGNvZGVQb2ludCA+IDB4RkZGRikge1xuICAgICAgLy8gZW5jb2RlIHRvIHV0ZjE2IChzdXJyb2dhdGUgcGFpciBkYW5jZSlcbiAgICAgIGNvZGVQb2ludCAtPSAweDEwMDAwXG4gICAgICByZXMucHVzaChjb2RlUG9pbnQgPj4+IDEwICYgMHgzRkYgfCAweEQ4MDApXG4gICAgICBjb2RlUG9pbnQgPSAweERDMDAgfCBjb2RlUG9pbnQgJiAweDNGRlxuICAgIH1cblxuICAgIHJlcy5wdXNoKGNvZGVQb2ludClcbiAgICBpICs9IGJ5dGVzUGVyU2VxdWVuY2VcbiAgfVxuXG4gIHJldHVybiBkZWNvZGVDb2RlUG9pbnRzQXJyYXkocmVzKVxufVxuXG4vLyBCYXNlZCBvbiBodHRwOi8vc3RhY2tvdmVyZmxvdy5jb20vYS8yMjc0NzI3Mi82ODA3NDIsIHRoZSBicm93c2VyIHdpdGhcbi8vIHRoZSBsb3dlc3QgbGltaXQgaXMgQ2hyb21lLCB3aXRoIDB4MTAwMDAgYXJncy5cbi8vIFdlIGdvIDEgbWFnbml0dWRlIGxlc3MsIGZvciBzYWZldHlcbnZhciBNQVhfQVJHVU1FTlRTX0xFTkdUSCA9IDB4MTAwMFxuXG5mdW5jdGlvbiBkZWNvZGVDb2RlUG9pbnRzQXJyYXkgKGNvZGVQb2ludHMpIHtcbiAgdmFyIGxlbiA9IGNvZGVQb2ludHMubGVuZ3RoXG4gIGlmIChsZW4gPD0gTUFYX0FSR1VNRU5UU19MRU5HVEgpIHtcbiAgICByZXR1cm4gU3RyaW5nLmZyb21DaGFyQ29kZS5hcHBseShTdHJpbmcsIGNvZGVQb2ludHMpIC8vIGF2b2lkIGV4dHJhIHNsaWNlKClcbiAgfVxuXG4gIC8vIERlY29kZSBpbiBjaHVua3MgdG8gYXZvaWQgXCJjYWxsIHN0YWNrIHNpemUgZXhjZWVkZWRcIi5cbiAgdmFyIHJlcyA9ICcnXG4gIHZhciBpID0gMFxuICB3aGlsZSAoaSA8IGxlbikge1xuICAgIHJlcyArPSBTdHJpbmcuZnJvbUNoYXJDb2RlLmFwcGx5KFxuICAgICAgU3RyaW5nLFxuICAgICAgY29kZVBvaW50cy5zbGljZShpLCBpICs9IE1BWF9BUkdVTUVOVFNfTEVOR1RIKVxuICAgIClcbiAgfVxuICByZXR1cm4gcmVzXG59XG5cbmZ1bmN0aW9uIGFzY2lpU2xpY2UgKGJ1Ziwgc3RhcnQsIGVuZCkge1xuICB2YXIgcmV0ID0gJydcbiAgZW5kID0gTWF0aC5taW4oYnVmLmxlbmd0aCwgZW5kKVxuXG4gIGZvciAodmFyIGkgPSBzdGFydDsgaSA8IGVuZDsgaSsrKSB7XG4gICAgcmV0ICs9IFN0cmluZy5mcm9tQ2hhckNvZGUoYnVmW2ldICYgMHg3RilcbiAgfVxuICByZXR1cm4gcmV0XG59XG5cbmZ1bmN0aW9uIGJpbmFyeVNsaWNlIChidWYsIHN0YXJ0LCBlbmQpIHtcbiAgdmFyIHJldCA9ICcnXG4gIGVuZCA9IE1hdGgubWluKGJ1Zi5sZW5ndGgsIGVuZClcblxuICBmb3IgKHZhciBpID0gc3RhcnQ7IGkgPCBlbmQ7IGkrKykge1xuICAgIHJldCArPSBTdHJpbmcuZnJvbUNoYXJDb2RlKGJ1ZltpXSlcbiAgfVxuICByZXR1cm4gcmV0XG59XG5cbmZ1bmN0aW9uIGhleFNsaWNlIChidWYsIHN0YXJ0LCBlbmQpIHtcbiAgdmFyIGxlbiA9IGJ1Zi5sZW5ndGhcblxuICBpZiAoIXN0YXJ0IHx8IHN0YXJ0IDwgMCkgc3RhcnQgPSAwXG4gIGlmICghZW5kIHx8IGVuZCA8IDAgfHwgZW5kID4gbGVuKSBlbmQgPSBsZW5cblxuICB2YXIgb3V0ID0gJydcbiAgZm9yICh2YXIgaSA9IHN0YXJ0OyBpIDwgZW5kOyBpKyspIHtcbiAgICBvdXQgKz0gdG9IZXgoYnVmW2ldKVxuICB9XG4gIHJldHVybiBvdXRcbn1cblxuZnVuY3Rpb24gdXRmMTZsZVNsaWNlIChidWYsIHN0YXJ0LCBlbmQpIHtcbiAgdmFyIGJ5dGVzID0gYnVmLnNsaWNlKHN0YXJ0LCBlbmQpXG4gIHZhciByZXMgPSAnJ1xuICBmb3IgKHZhciBpID0gMDsgaSA8IGJ5dGVzLmxlbmd0aDsgaSArPSAyKSB7XG4gICAgcmVzICs9IFN0cmluZy5mcm9tQ2hhckNvZGUoYnl0ZXNbaV0gKyBieXRlc1tpICsgMV0gKiAyNTYpXG4gIH1cbiAgcmV0dXJuIHJlc1xufVxuXG5CdWZmZXIucHJvdG90eXBlLnNsaWNlID0gZnVuY3Rpb24gc2xpY2UgKHN0YXJ0LCBlbmQpIHtcbiAgdmFyIGxlbiA9IHRoaXMubGVuZ3RoXG4gIHN0YXJ0ID0gfn5zdGFydFxuICBlbmQgPSBlbmQgPT09IHVuZGVmaW5lZCA/IGxlbiA6IH5+ZW5kXG5cbiAgaWYgKHN0YXJ0IDwgMCkge1xuICAgIHN0YXJ0ICs9IGxlblxuICAgIGlmIChzdGFydCA8IDApIHN0YXJ0ID0gMFxuICB9IGVsc2UgaWYgKHN0YXJ0ID4gbGVuKSB7XG4gICAgc3RhcnQgPSBsZW5cbiAgfVxuXG4gIGlmIChlbmQgPCAwKSB7XG4gICAgZW5kICs9IGxlblxuICAgIGlmIChlbmQgPCAwKSBlbmQgPSAwXG4gIH0gZWxzZSBpZiAoZW5kID4gbGVuKSB7XG4gICAgZW5kID0gbGVuXG4gIH1cblxuICBpZiAoZW5kIDwgc3RhcnQpIGVuZCA9IHN0YXJ0XG5cbiAgdmFyIG5ld0J1ZlxuICBpZiAoQnVmZmVyLlRZUEVEX0FSUkFZX1NVUFBPUlQpIHtcbiAgICBuZXdCdWYgPSB0aGlzLnN1YmFycmF5KHN0YXJ0LCBlbmQpXG4gICAgbmV3QnVmLl9fcHJvdG9fXyA9IEJ1ZmZlci5wcm90b3R5cGVcbiAgfSBlbHNlIHtcbiAgICB2YXIgc2xpY2VMZW4gPSBlbmQgLSBzdGFydFxuICAgIG5ld0J1ZiA9IG5ldyBCdWZmZXIoc2xpY2VMZW4sIHVuZGVmaW5lZClcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHNsaWNlTGVuOyBpKyspIHtcbiAgICAgIG5ld0J1ZltpXSA9IHRoaXNbaSArIHN0YXJ0XVxuICAgIH1cbiAgfVxuXG4gIGlmIChuZXdCdWYubGVuZ3RoKSBuZXdCdWYucGFyZW50ID0gdGhpcy5wYXJlbnQgfHwgdGhpc1xuXG4gIHJldHVybiBuZXdCdWZcbn1cblxuLypcbiAqIE5lZWQgdG8gbWFrZSBzdXJlIHRoYXQgYnVmZmVyIGlzbid0IHRyeWluZyB0byB3cml0ZSBvdXQgb2YgYm91bmRzLlxuICovXG5mdW5jdGlvbiBjaGVja09mZnNldCAob2Zmc2V0LCBleHQsIGxlbmd0aCkge1xuICBpZiAoKG9mZnNldCAlIDEpICE9PSAwIHx8IG9mZnNldCA8IDApIHRocm93IG5ldyBSYW5nZUVycm9yKCdvZmZzZXQgaXMgbm90IHVpbnQnKVxuICBpZiAob2Zmc2V0ICsgZXh0ID4gbGVuZ3RoKSB0aHJvdyBuZXcgUmFuZ2VFcnJvcignVHJ5aW5nIHRvIGFjY2VzcyBiZXlvbmQgYnVmZmVyIGxlbmd0aCcpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZFVJbnRMRSA9IGZ1bmN0aW9uIHJlYWRVSW50TEUgKG9mZnNldCwgYnl0ZUxlbmd0aCwgbm9Bc3NlcnQpIHtcbiAgb2Zmc2V0ID0gb2Zmc2V0IHwgMFxuICBieXRlTGVuZ3RoID0gYnl0ZUxlbmd0aCB8IDBcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tPZmZzZXQob2Zmc2V0LCBieXRlTGVuZ3RoLCB0aGlzLmxlbmd0aClcblxuICB2YXIgdmFsID0gdGhpc1tvZmZzZXRdXG4gIHZhciBtdWwgPSAxXG4gIHZhciBpID0gMFxuICB3aGlsZSAoKytpIDwgYnl0ZUxlbmd0aCAmJiAobXVsICo9IDB4MTAwKSkge1xuICAgIHZhbCArPSB0aGlzW29mZnNldCArIGldICogbXVsXG4gIH1cblxuICByZXR1cm4gdmFsXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZFVJbnRCRSA9IGZ1bmN0aW9uIHJlYWRVSW50QkUgKG9mZnNldCwgYnl0ZUxlbmd0aCwgbm9Bc3NlcnQpIHtcbiAgb2Zmc2V0ID0gb2Zmc2V0IHwgMFxuICBieXRlTGVuZ3RoID0gYnl0ZUxlbmd0aCB8IDBcbiAgaWYgKCFub0Fzc2VydCkge1xuICAgIGNoZWNrT2Zmc2V0KG9mZnNldCwgYnl0ZUxlbmd0aCwgdGhpcy5sZW5ndGgpXG4gIH1cblxuICB2YXIgdmFsID0gdGhpc1tvZmZzZXQgKyAtLWJ5dGVMZW5ndGhdXG4gIHZhciBtdWwgPSAxXG4gIHdoaWxlIChieXRlTGVuZ3RoID4gMCAmJiAobXVsICo9IDB4MTAwKSkge1xuICAgIHZhbCArPSB0aGlzW29mZnNldCArIC0tYnl0ZUxlbmd0aF0gKiBtdWxcbiAgfVxuXG4gIHJldHVybiB2YWxcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkVUludDggPSBmdW5jdGlvbiByZWFkVUludDggKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tPZmZzZXQob2Zmc2V0LCAxLCB0aGlzLmxlbmd0aClcbiAgcmV0dXJuIHRoaXNbb2Zmc2V0XVxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRVSW50MTZMRSA9IGZ1bmN0aW9uIHJlYWRVSW50MTZMRSAob2Zmc2V0LCBub0Fzc2VydCkge1xuICBpZiAoIW5vQXNzZXJ0KSBjaGVja09mZnNldChvZmZzZXQsIDIsIHRoaXMubGVuZ3RoKVxuICByZXR1cm4gdGhpc1tvZmZzZXRdIHwgKHRoaXNbb2Zmc2V0ICsgMV0gPDwgOClcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkVUludDE2QkUgPSBmdW5jdGlvbiByZWFkVUludDE2QkUgKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tPZmZzZXQob2Zmc2V0LCAyLCB0aGlzLmxlbmd0aClcbiAgcmV0dXJuICh0aGlzW29mZnNldF0gPDwgOCkgfCB0aGlzW29mZnNldCArIDFdXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZFVJbnQzMkxFID0gZnVuY3Rpb24gcmVhZFVJbnQzMkxFIChvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrT2Zmc2V0KG9mZnNldCwgNCwgdGhpcy5sZW5ndGgpXG5cbiAgcmV0dXJuICgodGhpc1tvZmZzZXRdKSB8XG4gICAgICAodGhpc1tvZmZzZXQgKyAxXSA8PCA4KSB8XG4gICAgICAodGhpc1tvZmZzZXQgKyAyXSA8PCAxNikpICtcbiAgICAgICh0aGlzW29mZnNldCArIDNdICogMHgxMDAwMDAwKVxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRVSW50MzJCRSA9IGZ1bmN0aW9uIHJlYWRVSW50MzJCRSAob2Zmc2V0LCBub0Fzc2VydCkge1xuICBpZiAoIW5vQXNzZXJ0KSBjaGVja09mZnNldChvZmZzZXQsIDQsIHRoaXMubGVuZ3RoKVxuXG4gIHJldHVybiAodGhpc1tvZmZzZXRdICogMHgxMDAwMDAwKSArXG4gICAgKCh0aGlzW29mZnNldCArIDFdIDw8IDE2KSB8XG4gICAgKHRoaXNbb2Zmc2V0ICsgMl0gPDwgOCkgfFxuICAgIHRoaXNbb2Zmc2V0ICsgM10pXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZEludExFID0gZnVuY3Rpb24gcmVhZEludExFIChvZmZzZXQsIGJ5dGVMZW5ndGgsIG5vQXNzZXJ0KSB7XG4gIG9mZnNldCA9IG9mZnNldCB8IDBcbiAgYnl0ZUxlbmd0aCA9IGJ5dGVMZW5ndGggfCAwXG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrT2Zmc2V0KG9mZnNldCwgYnl0ZUxlbmd0aCwgdGhpcy5sZW5ndGgpXG5cbiAgdmFyIHZhbCA9IHRoaXNbb2Zmc2V0XVxuICB2YXIgbXVsID0gMVxuICB2YXIgaSA9IDBcbiAgd2hpbGUgKCsraSA8IGJ5dGVMZW5ndGggJiYgKG11bCAqPSAweDEwMCkpIHtcbiAgICB2YWwgKz0gdGhpc1tvZmZzZXQgKyBpXSAqIG11bFxuICB9XG4gIG11bCAqPSAweDgwXG5cbiAgaWYgKHZhbCA+PSBtdWwpIHZhbCAtPSBNYXRoLnBvdygyLCA4ICogYnl0ZUxlbmd0aClcblxuICByZXR1cm4gdmFsXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZEludEJFID0gZnVuY3Rpb24gcmVhZEludEJFIChvZmZzZXQsIGJ5dGVMZW5ndGgsIG5vQXNzZXJ0KSB7XG4gIG9mZnNldCA9IG9mZnNldCB8IDBcbiAgYnl0ZUxlbmd0aCA9IGJ5dGVMZW5ndGggfCAwXG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrT2Zmc2V0KG9mZnNldCwgYnl0ZUxlbmd0aCwgdGhpcy5sZW5ndGgpXG5cbiAgdmFyIGkgPSBieXRlTGVuZ3RoXG4gIHZhciBtdWwgPSAxXG4gIHZhciB2YWwgPSB0aGlzW29mZnNldCArIC0taV1cbiAgd2hpbGUgKGkgPiAwICYmIChtdWwgKj0gMHgxMDApKSB7XG4gICAgdmFsICs9IHRoaXNbb2Zmc2V0ICsgLS1pXSAqIG11bFxuICB9XG4gIG11bCAqPSAweDgwXG5cbiAgaWYgKHZhbCA+PSBtdWwpIHZhbCAtPSBNYXRoLnBvdygyLCA4ICogYnl0ZUxlbmd0aClcblxuICByZXR1cm4gdmFsXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZEludDggPSBmdW5jdGlvbiByZWFkSW50OCAob2Zmc2V0LCBub0Fzc2VydCkge1xuICBpZiAoIW5vQXNzZXJ0KSBjaGVja09mZnNldChvZmZzZXQsIDEsIHRoaXMubGVuZ3RoKVxuICBpZiAoISh0aGlzW29mZnNldF0gJiAweDgwKSkgcmV0dXJuICh0aGlzW29mZnNldF0pXG4gIHJldHVybiAoKDB4ZmYgLSB0aGlzW29mZnNldF0gKyAxKSAqIC0xKVxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRJbnQxNkxFID0gZnVuY3Rpb24gcmVhZEludDE2TEUgKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tPZmZzZXQob2Zmc2V0LCAyLCB0aGlzLmxlbmd0aClcbiAgdmFyIHZhbCA9IHRoaXNbb2Zmc2V0XSB8ICh0aGlzW29mZnNldCArIDFdIDw8IDgpXG4gIHJldHVybiAodmFsICYgMHg4MDAwKSA/IHZhbCB8IDB4RkZGRjAwMDAgOiB2YWxcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkSW50MTZCRSA9IGZ1bmN0aW9uIHJlYWRJbnQxNkJFIChvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrT2Zmc2V0KG9mZnNldCwgMiwgdGhpcy5sZW5ndGgpXG4gIHZhciB2YWwgPSB0aGlzW29mZnNldCArIDFdIHwgKHRoaXNbb2Zmc2V0XSA8PCA4KVxuICByZXR1cm4gKHZhbCAmIDB4ODAwMCkgPyB2YWwgfCAweEZGRkYwMDAwIDogdmFsXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZEludDMyTEUgPSBmdW5jdGlvbiByZWFkSW50MzJMRSAob2Zmc2V0LCBub0Fzc2VydCkge1xuICBpZiAoIW5vQXNzZXJ0KSBjaGVja09mZnNldChvZmZzZXQsIDQsIHRoaXMubGVuZ3RoKVxuXG4gIHJldHVybiAodGhpc1tvZmZzZXRdKSB8XG4gICAgKHRoaXNbb2Zmc2V0ICsgMV0gPDwgOCkgfFxuICAgICh0aGlzW29mZnNldCArIDJdIDw8IDE2KSB8XG4gICAgKHRoaXNbb2Zmc2V0ICsgM10gPDwgMjQpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZEludDMyQkUgPSBmdW5jdGlvbiByZWFkSW50MzJCRSAob2Zmc2V0LCBub0Fzc2VydCkge1xuICBpZiAoIW5vQXNzZXJ0KSBjaGVja09mZnNldChvZmZzZXQsIDQsIHRoaXMubGVuZ3RoKVxuXG4gIHJldHVybiAodGhpc1tvZmZzZXRdIDw8IDI0KSB8XG4gICAgKHRoaXNbb2Zmc2V0ICsgMV0gPDwgMTYpIHxcbiAgICAodGhpc1tvZmZzZXQgKyAyXSA8PCA4KSB8XG4gICAgKHRoaXNbb2Zmc2V0ICsgM10pXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZEZsb2F0TEUgPSBmdW5jdGlvbiByZWFkRmxvYXRMRSAob2Zmc2V0LCBub0Fzc2VydCkge1xuICBpZiAoIW5vQXNzZXJ0KSBjaGVja09mZnNldChvZmZzZXQsIDQsIHRoaXMubGVuZ3RoKVxuICByZXR1cm4gaWVlZTc1NC5yZWFkKHRoaXMsIG9mZnNldCwgdHJ1ZSwgMjMsIDQpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZEZsb2F0QkUgPSBmdW5jdGlvbiByZWFkRmxvYXRCRSAob2Zmc2V0LCBub0Fzc2VydCkge1xuICBpZiAoIW5vQXNzZXJ0KSBjaGVja09mZnNldChvZmZzZXQsIDQsIHRoaXMubGVuZ3RoKVxuICByZXR1cm4gaWVlZTc1NC5yZWFkKHRoaXMsIG9mZnNldCwgZmFsc2UsIDIzLCA0KVxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWREb3VibGVMRSA9IGZ1bmN0aW9uIHJlYWREb3VibGVMRSAob2Zmc2V0LCBub0Fzc2VydCkge1xuICBpZiAoIW5vQXNzZXJ0KSBjaGVja09mZnNldChvZmZzZXQsIDgsIHRoaXMubGVuZ3RoKVxuICByZXR1cm4gaWVlZTc1NC5yZWFkKHRoaXMsIG9mZnNldCwgdHJ1ZSwgNTIsIDgpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZERvdWJsZUJFID0gZnVuY3Rpb24gcmVhZERvdWJsZUJFIChvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrT2Zmc2V0KG9mZnNldCwgOCwgdGhpcy5sZW5ndGgpXG4gIHJldHVybiBpZWVlNzU0LnJlYWQodGhpcywgb2Zmc2V0LCBmYWxzZSwgNTIsIDgpXG59XG5cbmZ1bmN0aW9uIGNoZWNrSW50IChidWYsIHZhbHVlLCBvZmZzZXQsIGV4dCwgbWF4LCBtaW4pIHtcbiAgaWYgKCFCdWZmZXIuaXNCdWZmZXIoYnVmKSkgdGhyb3cgbmV3IFR5cGVFcnJvcignYnVmZmVyIG11c3QgYmUgYSBCdWZmZXIgaW5zdGFuY2UnKVxuICBpZiAodmFsdWUgPiBtYXggfHwgdmFsdWUgPCBtaW4pIHRocm93IG5ldyBSYW5nZUVycm9yKCd2YWx1ZSBpcyBvdXQgb2YgYm91bmRzJylcbiAgaWYgKG9mZnNldCArIGV4dCA+IGJ1Zi5sZW5ndGgpIHRocm93IG5ldyBSYW5nZUVycm9yKCdpbmRleCBvdXQgb2YgcmFuZ2UnKVxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlVUludExFID0gZnVuY3Rpb24gd3JpdGVVSW50TEUgKHZhbHVlLCBvZmZzZXQsIGJ5dGVMZW5ndGgsIG5vQXNzZXJ0KSB7XG4gIHZhbHVlID0gK3ZhbHVlXG4gIG9mZnNldCA9IG9mZnNldCB8IDBcbiAgYnl0ZUxlbmd0aCA9IGJ5dGVMZW5ndGggfCAwXG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrSW50KHRoaXMsIHZhbHVlLCBvZmZzZXQsIGJ5dGVMZW5ndGgsIE1hdGgucG93KDIsIDggKiBieXRlTGVuZ3RoKSwgMClcblxuICB2YXIgbXVsID0gMVxuICB2YXIgaSA9IDBcbiAgdGhpc1tvZmZzZXRdID0gdmFsdWUgJiAweEZGXG4gIHdoaWxlICgrK2kgPCBieXRlTGVuZ3RoICYmIChtdWwgKj0gMHgxMDApKSB7XG4gICAgdGhpc1tvZmZzZXQgKyBpXSA9ICh2YWx1ZSAvIG11bCkgJiAweEZGXG4gIH1cblxuICByZXR1cm4gb2Zmc2V0ICsgYnl0ZUxlbmd0aFxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlVUludEJFID0gZnVuY3Rpb24gd3JpdGVVSW50QkUgKHZhbHVlLCBvZmZzZXQsIGJ5dGVMZW5ndGgsIG5vQXNzZXJ0KSB7XG4gIHZhbHVlID0gK3ZhbHVlXG4gIG9mZnNldCA9IG9mZnNldCB8IDBcbiAgYnl0ZUxlbmd0aCA9IGJ5dGVMZW5ndGggfCAwXG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrSW50KHRoaXMsIHZhbHVlLCBvZmZzZXQsIGJ5dGVMZW5ndGgsIE1hdGgucG93KDIsIDggKiBieXRlTGVuZ3RoKSwgMClcblxuICB2YXIgaSA9IGJ5dGVMZW5ndGggLSAxXG4gIHZhciBtdWwgPSAxXG4gIHRoaXNbb2Zmc2V0ICsgaV0gPSB2YWx1ZSAmIDB4RkZcbiAgd2hpbGUgKC0taSA+PSAwICYmIChtdWwgKj0gMHgxMDApKSB7XG4gICAgdGhpc1tvZmZzZXQgKyBpXSA9ICh2YWx1ZSAvIG11bCkgJiAweEZGXG4gIH1cblxuICByZXR1cm4gb2Zmc2V0ICsgYnl0ZUxlbmd0aFxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlVUludDggPSBmdW5jdGlvbiB3cml0ZVVJbnQ4ICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICB2YWx1ZSA9ICt2YWx1ZVxuICBvZmZzZXQgPSBvZmZzZXQgfCAwXG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrSW50KHRoaXMsIHZhbHVlLCBvZmZzZXQsIDEsIDB4ZmYsIDApXG4gIGlmICghQnVmZmVyLlRZUEVEX0FSUkFZX1NVUFBPUlQpIHZhbHVlID0gTWF0aC5mbG9vcih2YWx1ZSlcbiAgdGhpc1tvZmZzZXRdID0gKHZhbHVlICYgMHhmZilcbiAgcmV0dXJuIG9mZnNldCArIDFcbn1cblxuZnVuY3Rpb24gb2JqZWN0V3JpdGVVSW50MTYgKGJ1ZiwgdmFsdWUsIG9mZnNldCwgbGl0dGxlRW5kaWFuKSB7XG4gIGlmICh2YWx1ZSA8IDApIHZhbHVlID0gMHhmZmZmICsgdmFsdWUgKyAxXG4gIGZvciAodmFyIGkgPSAwLCBqID0gTWF0aC5taW4oYnVmLmxlbmd0aCAtIG9mZnNldCwgMik7IGkgPCBqOyBpKyspIHtcbiAgICBidWZbb2Zmc2V0ICsgaV0gPSAodmFsdWUgJiAoMHhmZiA8PCAoOCAqIChsaXR0bGVFbmRpYW4gPyBpIDogMSAtIGkpKSkpID4+PlxuICAgICAgKGxpdHRsZUVuZGlhbiA/IGkgOiAxIC0gaSkgKiA4XG4gIH1cbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZVVJbnQxNkxFID0gZnVuY3Rpb24gd3JpdGVVSW50MTZMRSAodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgdmFsdWUgPSArdmFsdWVcbiAgb2Zmc2V0ID0gb2Zmc2V0IHwgMFxuICBpZiAoIW5vQXNzZXJ0KSBjaGVja0ludCh0aGlzLCB2YWx1ZSwgb2Zmc2V0LCAyLCAweGZmZmYsIDApXG4gIGlmIChCdWZmZXIuVFlQRURfQVJSQVlfU1VQUE9SVCkge1xuICAgIHRoaXNbb2Zmc2V0XSA9ICh2YWx1ZSAmIDB4ZmYpXG4gICAgdGhpc1tvZmZzZXQgKyAxXSA9ICh2YWx1ZSA+Pj4gOClcbiAgfSBlbHNlIHtcbiAgICBvYmplY3RXcml0ZVVJbnQxNih0aGlzLCB2YWx1ZSwgb2Zmc2V0LCB0cnVlKVxuICB9XG4gIHJldHVybiBvZmZzZXQgKyAyXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVVSW50MTZCRSA9IGZ1bmN0aW9uIHdyaXRlVUludDE2QkUgKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHZhbHVlID0gK3ZhbHVlXG4gIG9mZnNldCA9IG9mZnNldCB8IDBcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tJbnQodGhpcywgdmFsdWUsIG9mZnNldCwgMiwgMHhmZmZmLCAwKVxuICBpZiAoQnVmZmVyLlRZUEVEX0FSUkFZX1NVUFBPUlQpIHtcbiAgICB0aGlzW29mZnNldF0gPSAodmFsdWUgPj4+IDgpXG4gICAgdGhpc1tvZmZzZXQgKyAxXSA9ICh2YWx1ZSAmIDB4ZmYpXG4gIH0gZWxzZSB7XG4gICAgb2JqZWN0V3JpdGVVSW50MTYodGhpcywgdmFsdWUsIG9mZnNldCwgZmFsc2UpXG4gIH1cbiAgcmV0dXJuIG9mZnNldCArIDJcbn1cblxuZnVuY3Rpb24gb2JqZWN0V3JpdGVVSW50MzIgKGJ1ZiwgdmFsdWUsIG9mZnNldCwgbGl0dGxlRW5kaWFuKSB7XG4gIGlmICh2YWx1ZSA8IDApIHZhbHVlID0gMHhmZmZmZmZmZiArIHZhbHVlICsgMVxuICBmb3IgKHZhciBpID0gMCwgaiA9IE1hdGgubWluKGJ1Zi5sZW5ndGggLSBvZmZzZXQsIDQpOyBpIDwgajsgaSsrKSB7XG4gICAgYnVmW29mZnNldCArIGldID0gKHZhbHVlID4+PiAobGl0dGxlRW5kaWFuID8gaSA6IDMgLSBpKSAqIDgpICYgMHhmZlxuICB9XG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVVSW50MzJMRSA9IGZ1bmN0aW9uIHdyaXRlVUludDMyTEUgKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHZhbHVlID0gK3ZhbHVlXG4gIG9mZnNldCA9IG9mZnNldCB8IDBcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tJbnQodGhpcywgdmFsdWUsIG9mZnNldCwgNCwgMHhmZmZmZmZmZiwgMClcbiAgaWYgKEJ1ZmZlci5UWVBFRF9BUlJBWV9TVVBQT1JUKSB7XG4gICAgdGhpc1tvZmZzZXQgKyAzXSA9ICh2YWx1ZSA+Pj4gMjQpXG4gICAgdGhpc1tvZmZzZXQgKyAyXSA9ICh2YWx1ZSA+Pj4gMTYpXG4gICAgdGhpc1tvZmZzZXQgKyAxXSA9ICh2YWx1ZSA+Pj4gOClcbiAgICB0aGlzW29mZnNldF0gPSAodmFsdWUgJiAweGZmKVxuICB9IGVsc2Uge1xuICAgIG9iamVjdFdyaXRlVUludDMyKHRoaXMsIHZhbHVlLCBvZmZzZXQsIHRydWUpXG4gIH1cbiAgcmV0dXJuIG9mZnNldCArIDRcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZVVJbnQzMkJFID0gZnVuY3Rpb24gd3JpdGVVSW50MzJCRSAodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgdmFsdWUgPSArdmFsdWVcbiAgb2Zmc2V0ID0gb2Zmc2V0IHwgMFxuICBpZiAoIW5vQXNzZXJ0KSBjaGVja0ludCh0aGlzLCB2YWx1ZSwgb2Zmc2V0LCA0LCAweGZmZmZmZmZmLCAwKVxuICBpZiAoQnVmZmVyLlRZUEVEX0FSUkFZX1NVUFBPUlQpIHtcbiAgICB0aGlzW29mZnNldF0gPSAodmFsdWUgPj4+IDI0KVxuICAgIHRoaXNbb2Zmc2V0ICsgMV0gPSAodmFsdWUgPj4+IDE2KVxuICAgIHRoaXNbb2Zmc2V0ICsgMl0gPSAodmFsdWUgPj4+IDgpXG4gICAgdGhpc1tvZmZzZXQgKyAzXSA9ICh2YWx1ZSAmIDB4ZmYpXG4gIH0gZWxzZSB7XG4gICAgb2JqZWN0V3JpdGVVSW50MzIodGhpcywgdmFsdWUsIG9mZnNldCwgZmFsc2UpXG4gIH1cbiAgcmV0dXJuIG9mZnNldCArIDRcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZUludExFID0gZnVuY3Rpb24gd3JpdGVJbnRMRSAodmFsdWUsIG9mZnNldCwgYnl0ZUxlbmd0aCwgbm9Bc3NlcnQpIHtcbiAgdmFsdWUgPSArdmFsdWVcbiAgb2Zmc2V0ID0gb2Zmc2V0IHwgMFxuICBpZiAoIW5vQXNzZXJ0KSB7XG4gICAgdmFyIGxpbWl0ID0gTWF0aC5wb3coMiwgOCAqIGJ5dGVMZW5ndGggLSAxKVxuXG4gICAgY2hlY2tJbnQodGhpcywgdmFsdWUsIG9mZnNldCwgYnl0ZUxlbmd0aCwgbGltaXQgLSAxLCAtbGltaXQpXG4gIH1cblxuICB2YXIgaSA9IDBcbiAgdmFyIG11bCA9IDFcbiAgdmFyIHN1YiA9IHZhbHVlIDwgMCA/IDEgOiAwXG4gIHRoaXNbb2Zmc2V0XSA9IHZhbHVlICYgMHhGRlxuICB3aGlsZSAoKytpIDwgYnl0ZUxlbmd0aCAmJiAobXVsICo9IDB4MTAwKSkge1xuICAgIHRoaXNbb2Zmc2V0ICsgaV0gPSAoKHZhbHVlIC8gbXVsKSA+PiAwKSAtIHN1YiAmIDB4RkZcbiAgfVxuXG4gIHJldHVybiBvZmZzZXQgKyBieXRlTGVuZ3RoXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVJbnRCRSA9IGZ1bmN0aW9uIHdyaXRlSW50QkUgKHZhbHVlLCBvZmZzZXQsIGJ5dGVMZW5ndGgsIG5vQXNzZXJ0KSB7XG4gIHZhbHVlID0gK3ZhbHVlXG4gIG9mZnNldCA9IG9mZnNldCB8IDBcbiAgaWYgKCFub0Fzc2VydCkge1xuICAgIHZhciBsaW1pdCA9IE1hdGgucG93KDIsIDggKiBieXRlTGVuZ3RoIC0gMSlcblxuICAgIGNoZWNrSW50KHRoaXMsIHZhbHVlLCBvZmZzZXQsIGJ5dGVMZW5ndGgsIGxpbWl0IC0gMSwgLWxpbWl0KVxuICB9XG5cbiAgdmFyIGkgPSBieXRlTGVuZ3RoIC0gMVxuICB2YXIgbXVsID0gMVxuICB2YXIgc3ViID0gdmFsdWUgPCAwID8gMSA6IDBcbiAgdGhpc1tvZmZzZXQgKyBpXSA9IHZhbHVlICYgMHhGRlxuICB3aGlsZSAoLS1pID49IDAgJiYgKG11bCAqPSAweDEwMCkpIHtcbiAgICB0aGlzW29mZnNldCArIGldID0gKCh2YWx1ZSAvIG11bCkgPj4gMCkgLSBzdWIgJiAweEZGXG4gIH1cblxuICByZXR1cm4gb2Zmc2V0ICsgYnl0ZUxlbmd0aFxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlSW50OCA9IGZ1bmN0aW9uIHdyaXRlSW50OCAodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgdmFsdWUgPSArdmFsdWVcbiAgb2Zmc2V0ID0gb2Zmc2V0IHwgMFxuICBpZiAoIW5vQXNzZXJ0KSBjaGVja0ludCh0aGlzLCB2YWx1ZSwgb2Zmc2V0LCAxLCAweDdmLCAtMHg4MClcbiAgaWYgKCFCdWZmZXIuVFlQRURfQVJSQVlfU1VQUE9SVCkgdmFsdWUgPSBNYXRoLmZsb29yKHZhbHVlKVxuICBpZiAodmFsdWUgPCAwKSB2YWx1ZSA9IDB4ZmYgKyB2YWx1ZSArIDFcbiAgdGhpc1tvZmZzZXRdID0gKHZhbHVlICYgMHhmZilcbiAgcmV0dXJuIG9mZnNldCArIDFcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZUludDE2TEUgPSBmdW5jdGlvbiB3cml0ZUludDE2TEUgKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHZhbHVlID0gK3ZhbHVlXG4gIG9mZnNldCA9IG9mZnNldCB8IDBcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tJbnQodGhpcywgdmFsdWUsIG9mZnNldCwgMiwgMHg3ZmZmLCAtMHg4MDAwKVxuICBpZiAoQnVmZmVyLlRZUEVEX0FSUkFZX1NVUFBPUlQpIHtcbiAgICB0aGlzW29mZnNldF0gPSAodmFsdWUgJiAweGZmKVxuICAgIHRoaXNbb2Zmc2V0ICsgMV0gPSAodmFsdWUgPj4+IDgpXG4gIH0gZWxzZSB7XG4gICAgb2JqZWN0V3JpdGVVSW50MTYodGhpcywgdmFsdWUsIG9mZnNldCwgdHJ1ZSlcbiAgfVxuICByZXR1cm4gb2Zmc2V0ICsgMlxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlSW50MTZCRSA9IGZ1bmN0aW9uIHdyaXRlSW50MTZCRSAodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgdmFsdWUgPSArdmFsdWVcbiAgb2Zmc2V0ID0gb2Zmc2V0IHwgMFxuICBpZiAoIW5vQXNzZXJ0KSBjaGVja0ludCh0aGlzLCB2YWx1ZSwgb2Zmc2V0LCAyLCAweDdmZmYsIC0weDgwMDApXG4gIGlmIChCdWZmZXIuVFlQRURfQVJSQVlfU1VQUE9SVCkge1xuICAgIHRoaXNbb2Zmc2V0XSA9ICh2YWx1ZSA+Pj4gOClcbiAgICB0aGlzW29mZnNldCArIDFdID0gKHZhbHVlICYgMHhmZilcbiAgfSBlbHNlIHtcbiAgICBvYmplY3RXcml0ZVVJbnQxNih0aGlzLCB2YWx1ZSwgb2Zmc2V0LCBmYWxzZSlcbiAgfVxuICByZXR1cm4gb2Zmc2V0ICsgMlxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlSW50MzJMRSA9IGZ1bmN0aW9uIHdyaXRlSW50MzJMRSAodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgdmFsdWUgPSArdmFsdWVcbiAgb2Zmc2V0ID0gb2Zmc2V0IHwgMFxuICBpZiAoIW5vQXNzZXJ0KSBjaGVja0ludCh0aGlzLCB2YWx1ZSwgb2Zmc2V0LCA0LCAweDdmZmZmZmZmLCAtMHg4MDAwMDAwMClcbiAgaWYgKEJ1ZmZlci5UWVBFRF9BUlJBWV9TVVBQT1JUKSB7XG4gICAgdGhpc1tvZmZzZXRdID0gKHZhbHVlICYgMHhmZilcbiAgICB0aGlzW29mZnNldCArIDFdID0gKHZhbHVlID4+PiA4KVxuICAgIHRoaXNbb2Zmc2V0ICsgMl0gPSAodmFsdWUgPj4+IDE2KVxuICAgIHRoaXNbb2Zmc2V0ICsgM10gPSAodmFsdWUgPj4+IDI0KVxuICB9IGVsc2Uge1xuICAgIG9iamVjdFdyaXRlVUludDMyKHRoaXMsIHZhbHVlLCBvZmZzZXQsIHRydWUpXG4gIH1cbiAgcmV0dXJuIG9mZnNldCArIDRcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZUludDMyQkUgPSBmdW5jdGlvbiB3cml0ZUludDMyQkUgKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHZhbHVlID0gK3ZhbHVlXG4gIG9mZnNldCA9IG9mZnNldCB8IDBcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tJbnQodGhpcywgdmFsdWUsIG9mZnNldCwgNCwgMHg3ZmZmZmZmZiwgLTB4ODAwMDAwMDApXG4gIGlmICh2YWx1ZSA8IDApIHZhbHVlID0gMHhmZmZmZmZmZiArIHZhbHVlICsgMVxuICBpZiAoQnVmZmVyLlRZUEVEX0FSUkFZX1NVUFBPUlQpIHtcbiAgICB0aGlzW29mZnNldF0gPSAodmFsdWUgPj4+IDI0KVxuICAgIHRoaXNbb2Zmc2V0ICsgMV0gPSAodmFsdWUgPj4+IDE2KVxuICAgIHRoaXNbb2Zmc2V0ICsgMl0gPSAodmFsdWUgPj4+IDgpXG4gICAgdGhpc1tvZmZzZXQgKyAzXSA9ICh2YWx1ZSAmIDB4ZmYpXG4gIH0gZWxzZSB7XG4gICAgb2JqZWN0V3JpdGVVSW50MzIodGhpcywgdmFsdWUsIG9mZnNldCwgZmFsc2UpXG4gIH1cbiAgcmV0dXJuIG9mZnNldCArIDRcbn1cblxuZnVuY3Rpb24gY2hlY2tJRUVFNzU0IChidWYsIHZhbHVlLCBvZmZzZXQsIGV4dCwgbWF4LCBtaW4pIHtcbiAgaWYgKHZhbHVlID4gbWF4IHx8IHZhbHVlIDwgbWluKSB0aHJvdyBuZXcgUmFuZ2VFcnJvcigndmFsdWUgaXMgb3V0IG9mIGJvdW5kcycpXG4gIGlmIChvZmZzZXQgKyBleHQgPiBidWYubGVuZ3RoKSB0aHJvdyBuZXcgUmFuZ2VFcnJvcignaW5kZXggb3V0IG9mIHJhbmdlJylcbiAgaWYgKG9mZnNldCA8IDApIHRocm93IG5ldyBSYW5nZUVycm9yKCdpbmRleCBvdXQgb2YgcmFuZ2UnKVxufVxuXG5mdW5jdGlvbiB3cml0ZUZsb2F0IChidWYsIHZhbHVlLCBvZmZzZXQsIGxpdHRsZUVuZGlhbiwgbm9Bc3NlcnQpIHtcbiAgaWYgKCFub0Fzc2VydCkge1xuICAgIGNoZWNrSUVFRTc1NChidWYsIHZhbHVlLCBvZmZzZXQsIDQsIDMuNDAyODIzNDY2Mzg1Mjg4NmUrMzgsIC0zLjQwMjgyMzQ2NjM4NTI4ODZlKzM4KVxuICB9XG4gIGllZWU3NTQud3JpdGUoYnVmLCB2YWx1ZSwgb2Zmc2V0LCBsaXR0bGVFbmRpYW4sIDIzLCA0KVxuICByZXR1cm4gb2Zmc2V0ICsgNFxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlRmxvYXRMRSA9IGZ1bmN0aW9uIHdyaXRlRmxvYXRMRSAodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgcmV0dXJuIHdyaXRlRmxvYXQodGhpcywgdmFsdWUsIG9mZnNldCwgdHJ1ZSwgbm9Bc3NlcnQpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVGbG9hdEJFID0gZnVuY3Rpb24gd3JpdGVGbG9hdEJFICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICByZXR1cm4gd3JpdGVGbG9hdCh0aGlzLCB2YWx1ZSwgb2Zmc2V0LCBmYWxzZSwgbm9Bc3NlcnQpXG59XG5cbmZ1bmN0aW9uIHdyaXRlRG91YmxlIChidWYsIHZhbHVlLCBvZmZzZXQsIGxpdHRsZUVuZGlhbiwgbm9Bc3NlcnQpIHtcbiAgaWYgKCFub0Fzc2VydCkge1xuICAgIGNoZWNrSUVFRTc1NChidWYsIHZhbHVlLCBvZmZzZXQsIDgsIDEuNzk3NjkzMTM0ODYyMzE1N0UrMzA4LCAtMS43OTc2OTMxMzQ4NjIzMTU3RSszMDgpXG4gIH1cbiAgaWVlZTc1NC53cml0ZShidWYsIHZhbHVlLCBvZmZzZXQsIGxpdHRsZUVuZGlhbiwgNTIsIDgpXG4gIHJldHVybiBvZmZzZXQgKyA4XG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVEb3VibGVMRSA9IGZ1bmN0aW9uIHdyaXRlRG91YmxlTEUgKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHJldHVybiB3cml0ZURvdWJsZSh0aGlzLCB2YWx1ZSwgb2Zmc2V0LCB0cnVlLCBub0Fzc2VydClcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZURvdWJsZUJFID0gZnVuY3Rpb24gd3JpdGVEb3VibGVCRSAodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgcmV0dXJuIHdyaXRlRG91YmxlKHRoaXMsIHZhbHVlLCBvZmZzZXQsIGZhbHNlLCBub0Fzc2VydClcbn1cblxuLy8gY29weSh0YXJnZXRCdWZmZXIsIHRhcmdldFN0YXJ0PTAsIHNvdXJjZVN0YXJ0PTAsIHNvdXJjZUVuZD1idWZmZXIubGVuZ3RoKVxuQnVmZmVyLnByb3RvdHlwZS5jb3B5ID0gZnVuY3Rpb24gY29weSAodGFyZ2V0LCB0YXJnZXRTdGFydCwgc3RhcnQsIGVuZCkge1xuICBpZiAoIXN0YXJ0KSBzdGFydCA9IDBcbiAgaWYgKCFlbmQgJiYgZW5kICE9PSAwKSBlbmQgPSB0aGlzLmxlbmd0aFxuICBpZiAodGFyZ2V0U3RhcnQgPj0gdGFyZ2V0Lmxlbmd0aCkgdGFyZ2V0U3RhcnQgPSB0YXJnZXQubGVuZ3RoXG4gIGlmICghdGFyZ2V0U3RhcnQpIHRhcmdldFN0YXJ0ID0gMFxuICBpZiAoZW5kID4gMCAmJiBlbmQgPCBzdGFydCkgZW5kID0gc3RhcnRcblxuICAvLyBDb3B5IDAgYnl0ZXM7IHdlJ3JlIGRvbmVcbiAgaWYgKGVuZCA9PT0gc3RhcnQpIHJldHVybiAwXG4gIGlmICh0YXJnZXQubGVuZ3RoID09PSAwIHx8IHRoaXMubGVuZ3RoID09PSAwKSByZXR1cm4gMFxuXG4gIC8vIEZhdGFsIGVycm9yIGNvbmRpdGlvbnNcbiAgaWYgKHRhcmdldFN0YXJ0IDwgMCkge1xuICAgIHRocm93IG5ldyBSYW5nZUVycm9yKCd0YXJnZXRTdGFydCBvdXQgb2YgYm91bmRzJylcbiAgfVxuICBpZiAoc3RhcnQgPCAwIHx8IHN0YXJ0ID49IHRoaXMubGVuZ3RoKSB0aHJvdyBuZXcgUmFuZ2VFcnJvcignc291cmNlU3RhcnQgb3V0IG9mIGJvdW5kcycpXG4gIGlmIChlbmQgPCAwKSB0aHJvdyBuZXcgUmFuZ2VFcnJvcignc291cmNlRW5kIG91dCBvZiBib3VuZHMnKVxuXG4gIC8vIEFyZSB3ZSBvb2I/XG4gIGlmIChlbmQgPiB0aGlzLmxlbmd0aCkgZW5kID0gdGhpcy5sZW5ndGhcbiAgaWYgKHRhcmdldC5sZW5ndGggLSB0YXJnZXRTdGFydCA8IGVuZCAtIHN0YXJ0KSB7XG4gICAgZW5kID0gdGFyZ2V0Lmxlbmd0aCAtIHRhcmdldFN0YXJ0ICsgc3RhcnRcbiAgfVxuXG4gIHZhciBsZW4gPSBlbmQgLSBzdGFydFxuICB2YXIgaVxuXG4gIGlmICh0aGlzID09PSB0YXJnZXQgJiYgc3RhcnQgPCB0YXJnZXRTdGFydCAmJiB0YXJnZXRTdGFydCA8IGVuZCkge1xuICAgIC8vIGRlc2NlbmRpbmcgY29weSBmcm9tIGVuZFxuICAgIGZvciAoaSA9IGxlbiAtIDE7IGkgPj0gMDsgaS0tKSB7XG4gICAgICB0YXJnZXRbaSArIHRhcmdldFN0YXJ0XSA9IHRoaXNbaSArIHN0YXJ0XVxuICAgIH1cbiAgfSBlbHNlIGlmIChsZW4gPCAxMDAwIHx8ICFCdWZmZXIuVFlQRURfQVJSQVlfU1VQUE9SVCkge1xuICAgIC8vIGFzY2VuZGluZyBjb3B5IGZyb20gc3RhcnRcbiAgICBmb3IgKGkgPSAwOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgIHRhcmdldFtpICsgdGFyZ2V0U3RhcnRdID0gdGhpc1tpICsgc3RhcnRdXG4gICAgfVxuICB9IGVsc2Uge1xuICAgIFVpbnQ4QXJyYXkucHJvdG90eXBlLnNldC5jYWxsKFxuICAgICAgdGFyZ2V0LFxuICAgICAgdGhpcy5zdWJhcnJheShzdGFydCwgc3RhcnQgKyBsZW4pLFxuICAgICAgdGFyZ2V0U3RhcnRcbiAgICApXG4gIH1cblxuICByZXR1cm4gbGVuXG59XG5cbi8vIGZpbGwodmFsdWUsIHN0YXJ0PTAsIGVuZD1idWZmZXIubGVuZ3RoKVxuQnVmZmVyLnByb3RvdHlwZS5maWxsID0gZnVuY3Rpb24gZmlsbCAodmFsdWUsIHN0YXJ0LCBlbmQpIHtcbiAgaWYgKCF2YWx1ZSkgdmFsdWUgPSAwXG4gIGlmICghc3RhcnQpIHN0YXJ0ID0gMFxuICBpZiAoIWVuZCkgZW5kID0gdGhpcy5sZW5ndGhcblxuICBpZiAoZW5kIDwgc3RhcnQpIHRocm93IG5ldyBSYW5nZUVycm9yKCdlbmQgPCBzdGFydCcpXG5cbiAgLy8gRmlsbCAwIGJ5dGVzOyB3ZSdyZSBkb25lXG4gIGlmIChlbmQgPT09IHN0YXJ0KSByZXR1cm5cbiAgaWYgKHRoaXMubGVuZ3RoID09PSAwKSByZXR1cm5cblxuICBpZiAoc3RhcnQgPCAwIHx8IHN0YXJ0ID49IHRoaXMubGVuZ3RoKSB0aHJvdyBuZXcgUmFuZ2VFcnJvcignc3RhcnQgb3V0IG9mIGJvdW5kcycpXG4gIGlmIChlbmQgPCAwIHx8IGVuZCA+IHRoaXMubGVuZ3RoKSB0aHJvdyBuZXcgUmFuZ2VFcnJvcignZW5kIG91dCBvZiBib3VuZHMnKVxuXG4gIHZhciBpXG4gIGlmICh0eXBlb2YgdmFsdWUgPT09ICdudW1iZXInKSB7XG4gICAgZm9yIChpID0gc3RhcnQ7IGkgPCBlbmQ7IGkrKykge1xuICAgICAgdGhpc1tpXSA9IHZhbHVlXG4gICAgfVxuICB9IGVsc2Uge1xuICAgIHZhciBieXRlcyA9IHV0ZjhUb0J5dGVzKHZhbHVlLnRvU3RyaW5nKCkpXG4gICAgdmFyIGxlbiA9IGJ5dGVzLmxlbmd0aFxuICAgIGZvciAoaSA9IHN0YXJ0OyBpIDwgZW5kOyBpKyspIHtcbiAgICAgIHRoaXNbaV0gPSBieXRlc1tpICUgbGVuXVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiB0aGlzXG59XG5cbi8vIEhFTFBFUiBGVU5DVElPTlNcbi8vID09PT09PT09PT09PT09PT1cblxudmFyIElOVkFMSURfQkFTRTY0X1JFID0gL1teK1xcLzAtOUEtWmEtei1fXS9nXG5cbmZ1bmN0aW9uIGJhc2U2NGNsZWFuIChzdHIpIHtcbiAgLy8gTm9kZSBzdHJpcHMgb3V0IGludmFsaWQgY2hhcmFjdGVycyBsaWtlIFxcbiBhbmQgXFx0IGZyb20gdGhlIHN0cmluZywgYmFzZTY0LWpzIGRvZXMgbm90XG4gIHN0ciA9IHN0cmluZ3RyaW0oc3RyKS5yZXBsYWNlKElOVkFMSURfQkFTRTY0X1JFLCAnJylcbiAgLy8gTm9kZSBjb252ZXJ0cyBzdHJpbmdzIHdpdGggbGVuZ3RoIDwgMiB0byAnJ1xuICBpZiAoc3RyLmxlbmd0aCA8IDIpIHJldHVybiAnJ1xuICAvLyBOb2RlIGFsbG93cyBmb3Igbm9uLXBhZGRlZCBiYXNlNjQgc3RyaW5ncyAobWlzc2luZyB0cmFpbGluZyA9PT0pLCBiYXNlNjQtanMgZG9lcyBub3RcbiAgd2hpbGUgKHN0ci5sZW5ndGggJSA0ICE9PSAwKSB7XG4gICAgc3RyID0gc3RyICsgJz0nXG4gIH1cbiAgcmV0dXJuIHN0clxufVxuXG5mdW5jdGlvbiBzdHJpbmd0cmltIChzdHIpIHtcbiAgaWYgKHN0ci50cmltKSByZXR1cm4gc3RyLnRyaW0oKVxuICByZXR1cm4gc3RyLnJlcGxhY2UoL15cXHMrfFxccyskL2csICcnKVxufVxuXG5mdW5jdGlvbiB0b0hleCAobikge1xuICBpZiAobiA8IDE2KSByZXR1cm4gJzAnICsgbi50b1N0cmluZygxNilcbiAgcmV0dXJuIG4udG9TdHJpbmcoMTYpXG59XG5cbmZ1bmN0aW9uIHV0ZjhUb0J5dGVzIChzdHJpbmcsIHVuaXRzKSB7XG4gIHVuaXRzID0gdW5pdHMgfHwgSW5maW5pdHlcbiAgdmFyIGNvZGVQb2ludFxuICB2YXIgbGVuZ3RoID0gc3RyaW5nLmxlbmd0aFxuICB2YXIgbGVhZFN1cnJvZ2F0ZSA9IG51bGxcbiAgdmFyIGJ5dGVzID0gW11cblxuICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgY29kZVBvaW50ID0gc3RyaW5nLmNoYXJDb2RlQXQoaSlcblxuICAgIC8vIGlzIHN1cnJvZ2F0ZSBjb21wb25lbnRcbiAgICBpZiAoY29kZVBvaW50ID4gMHhEN0ZGICYmIGNvZGVQb2ludCA8IDB4RTAwMCkge1xuICAgICAgLy8gbGFzdCBjaGFyIHdhcyBhIGxlYWRcbiAgICAgIGlmICghbGVhZFN1cnJvZ2F0ZSkge1xuICAgICAgICAvLyBubyBsZWFkIHlldFxuICAgICAgICBpZiAoY29kZVBvaW50ID4gMHhEQkZGKSB7XG4gICAgICAgICAgLy8gdW5leHBlY3RlZCB0cmFpbFxuICAgICAgICAgIGlmICgodW5pdHMgLT0gMykgPiAtMSkgYnl0ZXMucHVzaCgweEVGLCAweEJGLCAweEJEKVxuICAgICAgICAgIGNvbnRpbnVlXG4gICAgICAgIH0gZWxzZSBpZiAoaSArIDEgPT09IGxlbmd0aCkge1xuICAgICAgICAgIC8vIHVucGFpcmVkIGxlYWRcbiAgICAgICAgICBpZiAoKHVuaXRzIC09IDMpID4gLTEpIGJ5dGVzLnB1c2goMHhFRiwgMHhCRiwgMHhCRClcbiAgICAgICAgICBjb250aW51ZVxuICAgICAgICB9XG5cbiAgICAgICAgLy8gdmFsaWQgbGVhZFxuICAgICAgICBsZWFkU3Vycm9nYXRlID0gY29kZVBvaW50XG5cbiAgICAgICAgY29udGludWVcbiAgICAgIH1cblxuICAgICAgLy8gMiBsZWFkcyBpbiBhIHJvd1xuICAgICAgaWYgKGNvZGVQb2ludCA8IDB4REMwMCkge1xuICAgICAgICBpZiAoKHVuaXRzIC09IDMpID4gLTEpIGJ5dGVzLnB1c2goMHhFRiwgMHhCRiwgMHhCRClcbiAgICAgICAgbGVhZFN1cnJvZ2F0ZSA9IGNvZGVQb2ludFxuICAgICAgICBjb250aW51ZVxuICAgICAgfVxuXG4gICAgICAvLyB2YWxpZCBzdXJyb2dhdGUgcGFpclxuICAgICAgY29kZVBvaW50ID0gKGxlYWRTdXJyb2dhdGUgLSAweEQ4MDAgPDwgMTAgfCBjb2RlUG9pbnQgLSAweERDMDApICsgMHgxMDAwMFxuICAgIH0gZWxzZSBpZiAobGVhZFN1cnJvZ2F0ZSkge1xuICAgICAgLy8gdmFsaWQgYm1wIGNoYXIsIGJ1dCBsYXN0IGNoYXIgd2FzIGEgbGVhZFxuICAgICAgaWYgKCh1bml0cyAtPSAzKSA+IC0xKSBieXRlcy5wdXNoKDB4RUYsIDB4QkYsIDB4QkQpXG4gICAgfVxuXG4gICAgbGVhZFN1cnJvZ2F0ZSA9IG51bGxcblxuICAgIC8vIGVuY29kZSB1dGY4XG4gICAgaWYgKGNvZGVQb2ludCA8IDB4ODApIHtcbiAgICAgIGlmICgodW5pdHMgLT0gMSkgPCAwKSBicmVha1xuICAgICAgYnl0ZXMucHVzaChjb2RlUG9pbnQpXG4gICAgfSBlbHNlIGlmIChjb2RlUG9pbnQgPCAweDgwMCkge1xuICAgICAgaWYgKCh1bml0cyAtPSAyKSA8IDApIGJyZWFrXG4gICAgICBieXRlcy5wdXNoKFxuICAgICAgICBjb2RlUG9pbnQgPj4gMHg2IHwgMHhDMCxcbiAgICAgICAgY29kZVBvaW50ICYgMHgzRiB8IDB4ODBcbiAgICAgIClcbiAgICB9IGVsc2UgaWYgKGNvZGVQb2ludCA8IDB4MTAwMDApIHtcbiAgICAgIGlmICgodW5pdHMgLT0gMykgPCAwKSBicmVha1xuICAgICAgYnl0ZXMucHVzaChcbiAgICAgICAgY29kZVBvaW50ID4+IDB4QyB8IDB4RTAsXG4gICAgICAgIGNvZGVQb2ludCA+PiAweDYgJiAweDNGIHwgMHg4MCxcbiAgICAgICAgY29kZVBvaW50ICYgMHgzRiB8IDB4ODBcbiAgICAgIClcbiAgICB9IGVsc2UgaWYgKGNvZGVQb2ludCA8IDB4MTEwMDAwKSB7XG4gICAgICBpZiAoKHVuaXRzIC09IDQpIDwgMCkgYnJlYWtcbiAgICAgIGJ5dGVzLnB1c2goXG4gICAgICAgIGNvZGVQb2ludCA+PiAweDEyIHwgMHhGMCxcbiAgICAgICAgY29kZVBvaW50ID4+IDB4QyAmIDB4M0YgfCAweDgwLFxuICAgICAgICBjb2RlUG9pbnQgPj4gMHg2ICYgMHgzRiB8IDB4ODAsXG4gICAgICAgIGNvZGVQb2ludCAmIDB4M0YgfCAweDgwXG4gICAgICApXG4gICAgfSBlbHNlIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignSW52YWxpZCBjb2RlIHBvaW50JylcbiAgICB9XG4gIH1cblxuICByZXR1cm4gYnl0ZXNcbn1cblxuZnVuY3Rpb24gYXNjaWlUb0J5dGVzIChzdHIpIHtcbiAgdmFyIGJ5dGVBcnJheSA9IFtdXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgc3RyLmxlbmd0aDsgaSsrKSB7XG4gICAgLy8gTm9kZSdzIGNvZGUgc2VlbXMgdG8gYmUgZG9pbmcgdGhpcyBhbmQgbm90ICYgMHg3Ri4uXG4gICAgYnl0ZUFycmF5LnB1c2goc3RyLmNoYXJDb2RlQXQoaSkgJiAweEZGKVxuICB9XG4gIHJldHVybiBieXRlQXJyYXlcbn1cblxuZnVuY3Rpb24gdXRmMTZsZVRvQnl0ZXMgKHN0ciwgdW5pdHMpIHtcbiAgdmFyIGMsIGhpLCBsb1xuICB2YXIgYnl0ZUFycmF5ID0gW11cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBzdHIubGVuZ3RoOyBpKyspIHtcbiAgICBpZiAoKHVuaXRzIC09IDIpIDwgMCkgYnJlYWtcblxuICAgIGMgPSBzdHIuY2hhckNvZGVBdChpKVxuICAgIGhpID0gYyA+PiA4XG4gICAgbG8gPSBjICUgMjU2XG4gICAgYnl0ZUFycmF5LnB1c2gobG8pXG4gICAgYnl0ZUFycmF5LnB1c2goaGkpXG4gIH1cblxuICByZXR1cm4gYnl0ZUFycmF5XG59XG5cbmZ1bmN0aW9uIGJhc2U2NFRvQnl0ZXMgKHN0cikge1xuICByZXR1cm4gYmFzZTY0LnRvQnl0ZUFycmF5KGJhc2U2NGNsZWFuKHN0cikpXG59XG5cbmZ1bmN0aW9uIGJsaXRCdWZmZXIgKHNyYywgZHN0LCBvZmZzZXQsIGxlbmd0aCkge1xuICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgaWYgKChpICsgb2Zmc2V0ID49IGRzdC5sZW5ndGgpIHx8IChpID49IHNyYy5sZW5ndGgpKSBicmVha1xuICAgIGRzdFtpICsgb2Zmc2V0XSA9IHNyY1tpXVxuICB9XG4gIHJldHVybiBpXG59XG4iLCI7KGZ1bmN0aW9uIChleHBvcnRzKSB7XG4gICd1c2Ugc3RyaWN0J1xuXG4gIHZhciBsb29rdXAgPSAnQUJDREVGR0hJSktMTU5PUFFSU1RVVldYWVphYmNkZWZnaGlqa2xtbm9wcXJzdHV2d3h5ejAxMjM0NTY3ODkrLydcblxuICB2YXIgQXJyID0gKHR5cGVvZiBVaW50OEFycmF5ICE9PSAndW5kZWZpbmVkJylcbiAgICA/IFVpbnQ4QXJyYXlcbiAgICA6IEFycmF5XG5cbiAgdmFyIFBMVVMgPSAnKycuY2hhckNvZGVBdCgwKVxuICB2YXIgU0xBU0ggPSAnLycuY2hhckNvZGVBdCgwKVxuICB2YXIgTlVNQkVSID0gJzAnLmNoYXJDb2RlQXQoMClcbiAgdmFyIExPV0VSID0gJ2EnLmNoYXJDb2RlQXQoMClcbiAgdmFyIFVQUEVSID0gJ0EnLmNoYXJDb2RlQXQoMClcbiAgdmFyIFBMVVNfVVJMX1NBRkUgPSAnLScuY2hhckNvZGVBdCgwKVxuICB2YXIgU0xBU0hfVVJMX1NBRkUgPSAnXycuY2hhckNvZGVBdCgwKVxuXG4gIGZ1bmN0aW9uIGRlY29kZSAoZWx0KSB7XG4gICAgdmFyIGNvZGUgPSBlbHQuY2hhckNvZGVBdCgwKVxuICAgIGlmIChjb2RlID09PSBQTFVTIHx8IGNvZGUgPT09IFBMVVNfVVJMX1NBRkUpIHJldHVybiA2MiAvLyAnKydcbiAgICBpZiAoY29kZSA9PT0gU0xBU0ggfHwgY29kZSA9PT0gU0xBU0hfVVJMX1NBRkUpIHJldHVybiA2MyAvLyAnLydcbiAgICBpZiAoY29kZSA8IE5VTUJFUikgcmV0dXJuIC0xIC8vIG5vIG1hdGNoXG4gICAgaWYgKGNvZGUgPCBOVU1CRVIgKyAxMCkgcmV0dXJuIGNvZGUgLSBOVU1CRVIgKyAyNiArIDI2XG4gICAgaWYgKGNvZGUgPCBVUFBFUiArIDI2KSByZXR1cm4gY29kZSAtIFVQUEVSXG4gICAgaWYgKGNvZGUgPCBMT1dFUiArIDI2KSByZXR1cm4gY29kZSAtIExPV0VSICsgMjZcbiAgfVxuXG4gIGZ1bmN0aW9uIGI2NFRvQnl0ZUFycmF5IChiNjQpIHtcbiAgICB2YXIgaSwgaiwgbCwgdG1wLCBwbGFjZUhvbGRlcnMsIGFyclxuXG4gICAgaWYgKGI2NC5sZW5ndGggJSA0ID4gMCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdJbnZhbGlkIHN0cmluZy4gTGVuZ3RoIG11c3QgYmUgYSBtdWx0aXBsZSBvZiA0JylcbiAgICB9XG5cbiAgICAvLyB0aGUgbnVtYmVyIG9mIGVxdWFsIHNpZ25zIChwbGFjZSBob2xkZXJzKVxuICAgIC8vIGlmIHRoZXJlIGFyZSB0d28gcGxhY2Vob2xkZXJzLCB0aGFuIHRoZSB0d28gY2hhcmFjdGVycyBiZWZvcmUgaXRcbiAgICAvLyByZXByZXNlbnQgb25lIGJ5dGVcbiAgICAvLyBpZiB0aGVyZSBpcyBvbmx5IG9uZSwgdGhlbiB0aGUgdGhyZWUgY2hhcmFjdGVycyBiZWZvcmUgaXQgcmVwcmVzZW50IDIgYnl0ZXNcbiAgICAvLyB0aGlzIGlzIGp1c3QgYSBjaGVhcCBoYWNrIHRvIG5vdCBkbyBpbmRleE9mIHR3aWNlXG4gICAgdmFyIGxlbiA9IGI2NC5sZW5ndGhcbiAgICBwbGFjZUhvbGRlcnMgPSBiNjQuY2hhckF0KGxlbiAtIDIpID09PSAnPScgPyAyIDogYjY0LmNoYXJBdChsZW4gLSAxKSA9PT0gJz0nID8gMSA6IDBcblxuICAgIC8vIGJhc2U2NCBpcyA0LzMgKyB1cCB0byB0d28gY2hhcmFjdGVycyBvZiB0aGUgb3JpZ2luYWwgZGF0YVxuICAgIGFyciA9IG5ldyBBcnIoYjY0Lmxlbmd0aCAqIDMgLyA0IC0gcGxhY2VIb2xkZXJzKVxuXG4gICAgLy8gaWYgdGhlcmUgYXJlIHBsYWNlaG9sZGVycywgb25seSBnZXQgdXAgdG8gdGhlIGxhc3QgY29tcGxldGUgNCBjaGFyc1xuICAgIGwgPSBwbGFjZUhvbGRlcnMgPiAwID8gYjY0Lmxlbmd0aCAtIDQgOiBiNjQubGVuZ3RoXG5cbiAgICB2YXIgTCA9IDBcblxuICAgIGZ1bmN0aW9uIHB1c2ggKHYpIHtcbiAgICAgIGFycltMKytdID0gdlxuICAgIH1cblxuICAgIGZvciAoaSA9IDAsIGogPSAwOyBpIDwgbDsgaSArPSA0LCBqICs9IDMpIHtcbiAgICAgIHRtcCA9IChkZWNvZGUoYjY0LmNoYXJBdChpKSkgPDwgMTgpIHwgKGRlY29kZShiNjQuY2hhckF0KGkgKyAxKSkgPDwgMTIpIHwgKGRlY29kZShiNjQuY2hhckF0KGkgKyAyKSkgPDwgNikgfCBkZWNvZGUoYjY0LmNoYXJBdChpICsgMykpXG4gICAgICBwdXNoKCh0bXAgJiAweEZGMDAwMCkgPj4gMTYpXG4gICAgICBwdXNoKCh0bXAgJiAweEZGMDApID4+IDgpXG4gICAgICBwdXNoKHRtcCAmIDB4RkYpXG4gICAgfVxuXG4gICAgaWYgKHBsYWNlSG9sZGVycyA9PT0gMikge1xuICAgICAgdG1wID0gKGRlY29kZShiNjQuY2hhckF0KGkpKSA8PCAyKSB8IChkZWNvZGUoYjY0LmNoYXJBdChpICsgMSkpID4+IDQpXG4gICAgICBwdXNoKHRtcCAmIDB4RkYpXG4gICAgfSBlbHNlIGlmIChwbGFjZUhvbGRlcnMgPT09IDEpIHtcbiAgICAgIHRtcCA9IChkZWNvZGUoYjY0LmNoYXJBdChpKSkgPDwgMTApIHwgKGRlY29kZShiNjQuY2hhckF0KGkgKyAxKSkgPDwgNCkgfCAoZGVjb2RlKGI2NC5jaGFyQXQoaSArIDIpKSA+PiAyKVxuICAgICAgcHVzaCgodG1wID4+IDgpICYgMHhGRilcbiAgICAgIHB1c2godG1wICYgMHhGRilcbiAgICB9XG5cbiAgICByZXR1cm4gYXJyXG4gIH1cblxuICBmdW5jdGlvbiB1aW50OFRvQmFzZTY0ICh1aW50OCkge1xuICAgIHZhciBpXG4gICAgdmFyIGV4dHJhQnl0ZXMgPSB1aW50OC5sZW5ndGggJSAzIC8vIGlmIHdlIGhhdmUgMSBieXRlIGxlZnQsIHBhZCAyIGJ5dGVzXG4gICAgdmFyIG91dHB1dCA9ICcnXG4gICAgdmFyIHRlbXAsIGxlbmd0aFxuXG4gICAgZnVuY3Rpb24gZW5jb2RlIChudW0pIHtcbiAgICAgIHJldHVybiBsb29rdXAuY2hhckF0KG51bSlcbiAgICB9XG5cbiAgICBmdW5jdGlvbiB0cmlwbGV0VG9CYXNlNjQgKG51bSkge1xuICAgICAgcmV0dXJuIGVuY29kZShudW0gPj4gMTggJiAweDNGKSArIGVuY29kZShudW0gPj4gMTIgJiAweDNGKSArIGVuY29kZShudW0gPj4gNiAmIDB4M0YpICsgZW5jb2RlKG51bSAmIDB4M0YpXG4gICAgfVxuXG4gICAgLy8gZ28gdGhyb3VnaCB0aGUgYXJyYXkgZXZlcnkgdGhyZWUgYnl0ZXMsIHdlJ2xsIGRlYWwgd2l0aCB0cmFpbGluZyBzdHVmZiBsYXRlclxuICAgIGZvciAoaSA9IDAsIGxlbmd0aCA9IHVpbnQ4Lmxlbmd0aCAtIGV4dHJhQnl0ZXM7IGkgPCBsZW5ndGg7IGkgKz0gMykge1xuICAgICAgdGVtcCA9ICh1aW50OFtpXSA8PCAxNikgKyAodWludDhbaSArIDFdIDw8IDgpICsgKHVpbnQ4W2kgKyAyXSlcbiAgICAgIG91dHB1dCArPSB0cmlwbGV0VG9CYXNlNjQodGVtcClcbiAgICB9XG5cbiAgICAvLyBwYWQgdGhlIGVuZCB3aXRoIHplcm9zLCBidXQgbWFrZSBzdXJlIHRvIG5vdCBmb3JnZXQgdGhlIGV4dHJhIGJ5dGVzXG4gICAgc3dpdGNoIChleHRyYUJ5dGVzKSB7XG4gICAgICBjYXNlIDE6XG4gICAgICAgIHRlbXAgPSB1aW50OFt1aW50OC5sZW5ndGggLSAxXVxuICAgICAgICBvdXRwdXQgKz0gZW5jb2RlKHRlbXAgPj4gMilcbiAgICAgICAgb3V0cHV0ICs9IGVuY29kZSgodGVtcCA8PCA0KSAmIDB4M0YpXG4gICAgICAgIG91dHB1dCArPSAnPT0nXG4gICAgICAgIGJyZWFrXG4gICAgICBjYXNlIDI6XG4gICAgICAgIHRlbXAgPSAodWludDhbdWludDgubGVuZ3RoIC0gMl0gPDwgOCkgKyAodWludDhbdWludDgubGVuZ3RoIC0gMV0pXG4gICAgICAgIG91dHB1dCArPSBlbmNvZGUodGVtcCA+PiAxMClcbiAgICAgICAgb3V0cHV0ICs9IGVuY29kZSgodGVtcCA+PiA0KSAmIDB4M0YpXG4gICAgICAgIG91dHB1dCArPSBlbmNvZGUoKHRlbXAgPDwgMikgJiAweDNGKVxuICAgICAgICBvdXRwdXQgKz0gJz0nXG4gICAgICAgIGJyZWFrXG4gICAgICBkZWZhdWx0OlxuICAgICAgICBicmVha1xuICAgIH1cblxuICAgIHJldHVybiBvdXRwdXRcbiAgfVxuXG4gIGV4cG9ydHMudG9CeXRlQXJyYXkgPSBiNjRUb0J5dGVBcnJheVxuICBleHBvcnRzLmZyb21CeXRlQXJyYXkgPSB1aW50OFRvQmFzZTY0XG59KHR5cGVvZiBleHBvcnRzID09PSAndW5kZWZpbmVkJyA/ICh0aGlzLmJhc2U2NGpzID0ge30pIDogZXhwb3J0cykpXG4iLCJleHBvcnRzLnJlYWQgPSBmdW5jdGlvbiAoYnVmZmVyLCBvZmZzZXQsIGlzTEUsIG1MZW4sIG5CeXRlcykge1xuICB2YXIgZSwgbVxuICB2YXIgZUxlbiA9IG5CeXRlcyAqIDggLSBtTGVuIC0gMVxuICB2YXIgZU1heCA9ICgxIDw8IGVMZW4pIC0gMVxuICB2YXIgZUJpYXMgPSBlTWF4ID4+IDFcbiAgdmFyIG5CaXRzID0gLTdcbiAgdmFyIGkgPSBpc0xFID8gKG5CeXRlcyAtIDEpIDogMFxuICB2YXIgZCA9IGlzTEUgPyAtMSA6IDFcbiAgdmFyIHMgPSBidWZmZXJbb2Zmc2V0ICsgaV1cblxuICBpICs9IGRcblxuICBlID0gcyAmICgoMSA8PCAoLW5CaXRzKSkgLSAxKVxuICBzID4+PSAoLW5CaXRzKVxuICBuQml0cyArPSBlTGVuXG4gIGZvciAoOyBuQml0cyA+IDA7IGUgPSBlICogMjU2ICsgYnVmZmVyW29mZnNldCArIGldLCBpICs9IGQsIG5CaXRzIC09IDgpIHt9XG5cbiAgbSA9IGUgJiAoKDEgPDwgKC1uQml0cykpIC0gMSlcbiAgZSA+Pj0gKC1uQml0cylcbiAgbkJpdHMgKz0gbUxlblxuICBmb3IgKDsgbkJpdHMgPiAwOyBtID0gbSAqIDI1NiArIGJ1ZmZlcltvZmZzZXQgKyBpXSwgaSArPSBkLCBuQml0cyAtPSA4KSB7fVxuXG4gIGlmIChlID09PSAwKSB7XG4gICAgZSA9IDEgLSBlQmlhc1xuICB9IGVsc2UgaWYgKGUgPT09IGVNYXgpIHtcbiAgICByZXR1cm4gbSA/IE5hTiA6ICgocyA/IC0xIDogMSkgKiBJbmZpbml0eSlcbiAgfSBlbHNlIHtcbiAgICBtID0gbSArIE1hdGgucG93KDIsIG1MZW4pXG4gICAgZSA9IGUgLSBlQmlhc1xuICB9XG4gIHJldHVybiAocyA/IC0xIDogMSkgKiBtICogTWF0aC5wb3coMiwgZSAtIG1MZW4pXG59XG5cbmV4cG9ydHMud3JpdGUgPSBmdW5jdGlvbiAoYnVmZmVyLCB2YWx1ZSwgb2Zmc2V0LCBpc0xFLCBtTGVuLCBuQnl0ZXMpIHtcbiAgdmFyIGUsIG0sIGNcbiAgdmFyIGVMZW4gPSBuQnl0ZXMgKiA4IC0gbUxlbiAtIDFcbiAgdmFyIGVNYXggPSAoMSA8PCBlTGVuKSAtIDFcbiAgdmFyIGVCaWFzID0gZU1heCA+PiAxXG4gIHZhciBydCA9IChtTGVuID09PSAyMyA/IE1hdGgucG93KDIsIC0yNCkgLSBNYXRoLnBvdygyLCAtNzcpIDogMClcbiAgdmFyIGkgPSBpc0xFID8gMCA6IChuQnl0ZXMgLSAxKVxuICB2YXIgZCA9IGlzTEUgPyAxIDogLTFcbiAgdmFyIHMgPSB2YWx1ZSA8IDAgfHwgKHZhbHVlID09PSAwICYmIDEgLyB2YWx1ZSA8IDApID8gMSA6IDBcblxuICB2YWx1ZSA9IE1hdGguYWJzKHZhbHVlKVxuXG4gIGlmIChpc05hTih2YWx1ZSkgfHwgdmFsdWUgPT09IEluZmluaXR5KSB7XG4gICAgbSA9IGlzTmFOKHZhbHVlKSA/IDEgOiAwXG4gICAgZSA9IGVNYXhcbiAgfSBlbHNlIHtcbiAgICBlID0gTWF0aC5mbG9vcihNYXRoLmxvZyh2YWx1ZSkgLyBNYXRoLkxOMilcbiAgICBpZiAodmFsdWUgKiAoYyA9IE1hdGgucG93KDIsIC1lKSkgPCAxKSB7XG4gICAgICBlLS1cbiAgICAgIGMgKj0gMlxuICAgIH1cbiAgICBpZiAoZSArIGVCaWFzID49IDEpIHtcbiAgICAgIHZhbHVlICs9IHJ0IC8gY1xuICAgIH0gZWxzZSB7XG4gICAgICB2YWx1ZSArPSBydCAqIE1hdGgucG93KDIsIDEgLSBlQmlhcylcbiAgICB9XG4gICAgaWYgKHZhbHVlICogYyA+PSAyKSB7XG4gICAgICBlKytcbiAgICAgIGMgLz0gMlxuICAgIH1cblxuICAgIGlmIChlICsgZUJpYXMgPj0gZU1heCkge1xuICAgICAgbSA9IDBcbiAgICAgIGUgPSBlTWF4XG4gICAgfSBlbHNlIGlmIChlICsgZUJpYXMgPj0gMSkge1xuICAgICAgbSA9ICh2YWx1ZSAqIGMgLSAxKSAqIE1hdGgucG93KDIsIG1MZW4pXG4gICAgICBlID0gZSArIGVCaWFzXG4gICAgfSBlbHNlIHtcbiAgICAgIG0gPSB2YWx1ZSAqIE1hdGgucG93KDIsIGVCaWFzIC0gMSkgKiBNYXRoLnBvdygyLCBtTGVuKVxuICAgICAgZSA9IDBcbiAgICB9XG4gIH1cblxuICBmb3IgKDsgbUxlbiA+PSA4OyBidWZmZXJbb2Zmc2V0ICsgaV0gPSBtICYgMHhmZiwgaSArPSBkLCBtIC89IDI1NiwgbUxlbiAtPSA4KSB7fVxuXG4gIGUgPSAoZSA8PCBtTGVuKSB8IG1cbiAgZUxlbiArPSBtTGVuXG4gIGZvciAoOyBlTGVuID4gMDsgYnVmZmVyW29mZnNldCArIGldID0gZSAmIDB4ZmYsIGkgKz0gZCwgZSAvPSAyNTYsIGVMZW4gLT0gOCkge31cblxuICBidWZmZXJbb2Zmc2V0ICsgaSAtIGRdIHw9IHMgKiAxMjhcbn1cbiIsInZhciB0b1N0cmluZyA9IHt9LnRvU3RyaW5nO1xuXG5tb2R1bGUuZXhwb3J0cyA9IEFycmF5LmlzQXJyYXkgfHwgZnVuY3Rpb24gKGFycikge1xuICByZXR1cm4gdG9TdHJpbmcuY2FsbChhcnIpID09ICdbb2JqZWN0IEFycmF5XSc7XG59O1xuIiwiLy8gQ29weXJpZ2h0IEpveWVudCwgSW5jLiBhbmQgb3RoZXIgTm9kZSBjb250cmlidXRvcnMuXG4vL1xuLy8gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGFcbi8vIGNvcHkgb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGVcbi8vIFwiU29mdHdhcmVcIiksIHRvIGRlYWwgaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZ1xuLy8gd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHMgdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLFxuLy8gZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdFxuLy8gcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpcyBmdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlXG4vLyBmb2xsb3dpbmcgY29uZGl0aW9uczpcbi8vXG4vLyBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZFxuLy8gaW4gYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG4vL1xuLy8gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTU1xuLy8gT1IgSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRlxuLy8gTUVSQ0hBTlRBQklMSVRZLCBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTlxuLy8gTk8gRVZFTlQgU0hBTEwgVEhFIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sXG4vLyBEQU1BR0VTIE9SIE9USEVSIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1Jcbi8vIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLCBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEVcbi8vIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTiBUSEUgU09GVFdBUkUuXG5cbmZ1bmN0aW9uIEV2ZW50RW1pdHRlcigpIHtcbiAgdGhpcy5fZXZlbnRzID0gdGhpcy5fZXZlbnRzIHx8IHt9O1xuICB0aGlzLl9tYXhMaXN0ZW5lcnMgPSB0aGlzLl9tYXhMaXN0ZW5lcnMgfHwgdW5kZWZpbmVkO1xufVxubW9kdWxlLmV4cG9ydHMgPSBFdmVudEVtaXR0ZXI7XG5cbi8vIEJhY2t3YXJkcy1jb21wYXQgd2l0aCBub2RlIDAuMTAueFxuRXZlbnRFbWl0dGVyLkV2ZW50RW1pdHRlciA9IEV2ZW50RW1pdHRlcjtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5fZXZlbnRzID0gdW5kZWZpbmVkO1xuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5fbWF4TGlzdGVuZXJzID0gdW5kZWZpbmVkO1xuXG4vLyBCeSBkZWZhdWx0IEV2ZW50RW1pdHRlcnMgd2lsbCBwcmludCBhIHdhcm5pbmcgaWYgbW9yZSB0aGFuIDEwIGxpc3RlbmVycyBhcmVcbi8vIGFkZGVkIHRvIGl0LiBUaGlzIGlzIGEgdXNlZnVsIGRlZmF1bHQgd2hpY2ggaGVscHMgZmluZGluZyBtZW1vcnkgbGVha3MuXG5FdmVudEVtaXR0ZXIuZGVmYXVsdE1heExpc3RlbmVycyA9IDEwO1xuXG4vLyBPYnZpb3VzbHkgbm90IGFsbCBFbWl0dGVycyBzaG91bGQgYmUgbGltaXRlZCB0byAxMC4gVGhpcyBmdW5jdGlvbiBhbGxvd3Ncbi8vIHRoYXQgdG8gYmUgaW5jcmVhc2VkLiBTZXQgdG8gemVybyBmb3IgdW5saW1pdGVkLlxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5zZXRNYXhMaXN0ZW5lcnMgPSBmdW5jdGlvbihuKSB7XG4gIGlmICghaXNOdW1iZXIobikgfHwgbiA8IDAgfHwgaXNOYU4obikpXG4gICAgdGhyb3cgVHlwZUVycm9yKCduIG11c3QgYmUgYSBwb3NpdGl2ZSBudW1iZXInKTtcbiAgdGhpcy5fbWF4TGlzdGVuZXJzID0gbjtcbiAgcmV0dXJuIHRoaXM7XG59O1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLmVtaXQgPSBmdW5jdGlvbih0eXBlKSB7XG4gIHZhciBlciwgaGFuZGxlciwgbGVuLCBhcmdzLCBpLCBsaXN0ZW5lcnM7XG5cbiAgaWYgKCF0aGlzLl9ldmVudHMpXG4gICAgdGhpcy5fZXZlbnRzID0ge307XG5cbiAgLy8gSWYgdGhlcmUgaXMgbm8gJ2Vycm9yJyBldmVudCBsaXN0ZW5lciB0aGVuIHRocm93LlxuICBpZiAodHlwZSA9PT0gJ2Vycm9yJykge1xuICAgIGlmICghdGhpcy5fZXZlbnRzLmVycm9yIHx8XG4gICAgICAgIChpc09iamVjdCh0aGlzLl9ldmVudHMuZXJyb3IpICYmICF0aGlzLl9ldmVudHMuZXJyb3IubGVuZ3RoKSkge1xuICAgICAgZXIgPSBhcmd1bWVudHNbMV07XG4gICAgICBpZiAoZXIgaW5zdGFuY2VvZiBFcnJvcikge1xuICAgICAgICB0aHJvdyBlcjsgLy8gVW5oYW5kbGVkICdlcnJvcicgZXZlbnRcbiAgICAgIH1cbiAgICAgIHRocm93IFR5cGVFcnJvcignVW5jYXVnaHQsIHVuc3BlY2lmaWVkIFwiZXJyb3JcIiBldmVudC4nKTtcbiAgICB9XG4gIH1cblxuICBoYW5kbGVyID0gdGhpcy5fZXZlbnRzW3R5cGVdO1xuXG4gIGlmIChpc1VuZGVmaW5lZChoYW5kbGVyKSlcbiAgICByZXR1cm4gZmFsc2U7XG5cbiAgaWYgKGlzRnVuY3Rpb24oaGFuZGxlcikpIHtcbiAgICBzd2l0Y2ggKGFyZ3VtZW50cy5sZW5ndGgpIHtcbiAgICAgIC8vIGZhc3QgY2FzZXNcbiAgICAgIGNhc2UgMTpcbiAgICAgICAgaGFuZGxlci5jYWxsKHRoaXMpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgMjpcbiAgICAgICAgaGFuZGxlci5jYWxsKHRoaXMsIGFyZ3VtZW50c1sxXSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAzOlxuICAgICAgICBoYW5kbGVyLmNhbGwodGhpcywgYXJndW1lbnRzWzFdLCBhcmd1bWVudHNbMl0pO1xuICAgICAgICBicmVhaztcbiAgICAgIC8vIHNsb3dlclxuICAgICAgZGVmYXVsdDpcbiAgICAgICAgYXJncyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMSk7XG4gICAgICAgIGhhbmRsZXIuYXBwbHkodGhpcywgYXJncyk7XG4gICAgfVxuICB9IGVsc2UgaWYgKGlzT2JqZWN0KGhhbmRsZXIpKSB7XG4gICAgYXJncyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMSk7XG4gICAgbGlzdGVuZXJzID0gaGFuZGxlci5zbGljZSgpO1xuICAgIGxlbiA9IGxpc3RlbmVycy5sZW5ndGg7XG4gICAgZm9yIChpID0gMDsgaSA8IGxlbjsgaSsrKVxuICAgICAgbGlzdGVuZXJzW2ldLmFwcGx5KHRoaXMsIGFyZ3MpO1xuICB9XG5cbiAgcmV0dXJuIHRydWU7XG59O1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLmFkZExpc3RlbmVyID0gZnVuY3Rpb24odHlwZSwgbGlzdGVuZXIpIHtcbiAgdmFyIG07XG5cbiAgaWYgKCFpc0Z1bmN0aW9uKGxpc3RlbmVyKSlcbiAgICB0aHJvdyBUeXBlRXJyb3IoJ2xpc3RlbmVyIG11c3QgYmUgYSBmdW5jdGlvbicpO1xuXG4gIGlmICghdGhpcy5fZXZlbnRzKVxuICAgIHRoaXMuX2V2ZW50cyA9IHt9O1xuXG4gIC8vIFRvIGF2b2lkIHJlY3Vyc2lvbiBpbiB0aGUgY2FzZSB0aGF0IHR5cGUgPT09IFwibmV3TGlzdGVuZXJcIiEgQmVmb3JlXG4gIC8vIGFkZGluZyBpdCB0byB0aGUgbGlzdGVuZXJzLCBmaXJzdCBlbWl0IFwibmV3TGlzdGVuZXJcIi5cbiAgaWYgKHRoaXMuX2V2ZW50cy5uZXdMaXN0ZW5lcilcbiAgICB0aGlzLmVtaXQoJ25ld0xpc3RlbmVyJywgdHlwZSxcbiAgICAgICAgICAgICAgaXNGdW5jdGlvbihsaXN0ZW5lci5saXN0ZW5lcikgP1xuICAgICAgICAgICAgICBsaXN0ZW5lci5saXN0ZW5lciA6IGxpc3RlbmVyKTtcblxuICBpZiAoIXRoaXMuX2V2ZW50c1t0eXBlXSlcbiAgICAvLyBPcHRpbWl6ZSB0aGUgY2FzZSBvZiBvbmUgbGlzdGVuZXIuIERvbid0IG5lZWQgdGhlIGV4dHJhIGFycmF5IG9iamVjdC5cbiAgICB0aGlzLl9ldmVudHNbdHlwZV0gPSBsaXN0ZW5lcjtcbiAgZWxzZSBpZiAoaXNPYmplY3QodGhpcy5fZXZlbnRzW3R5cGVdKSlcbiAgICAvLyBJZiB3ZSd2ZSBhbHJlYWR5IGdvdCBhbiBhcnJheSwganVzdCBhcHBlbmQuXG4gICAgdGhpcy5fZXZlbnRzW3R5cGVdLnB1c2gobGlzdGVuZXIpO1xuICBlbHNlXG4gICAgLy8gQWRkaW5nIHRoZSBzZWNvbmQgZWxlbWVudCwgbmVlZCB0byBjaGFuZ2UgdG8gYXJyYXkuXG4gICAgdGhpcy5fZXZlbnRzW3R5cGVdID0gW3RoaXMuX2V2ZW50c1t0eXBlXSwgbGlzdGVuZXJdO1xuXG4gIC8vIENoZWNrIGZvciBsaXN0ZW5lciBsZWFrXG4gIGlmIChpc09iamVjdCh0aGlzLl9ldmVudHNbdHlwZV0pICYmICF0aGlzLl9ldmVudHNbdHlwZV0ud2FybmVkKSB7XG4gICAgaWYgKCFpc1VuZGVmaW5lZCh0aGlzLl9tYXhMaXN0ZW5lcnMpKSB7XG4gICAgICBtID0gdGhpcy5fbWF4TGlzdGVuZXJzO1xuICAgIH0gZWxzZSB7XG4gICAgICBtID0gRXZlbnRFbWl0dGVyLmRlZmF1bHRNYXhMaXN0ZW5lcnM7XG4gICAgfVxuXG4gICAgaWYgKG0gJiYgbSA+IDAgJiYgdGhpcy5fZXZlbnRzW3R5cGVdLmxlbmd0aCA+IG0pIHtcbiAgICAgIHRoaXMuX2V2ZW50c1t0eXBlXS53YXJuZWQgPSB0cnVlO1xuICAgICAgY29uc29sZS5lcnJvcignKG5vZGUpIHdhcm5pbmc6IHBvc3NpYmxlIEV2ZW50RW1pdHRlciBtZW1vcnkgJyArXG4gICAgICAgICAgICAgICAgICAgICdsZWFrIGRldGVjdGVkLiAlZCBsaXN0ZW5lcnMgYWRkZWQuICcgK1xuICAgICAgICAgICAgICAgICAgICAnVXNlIGVtaXR0ZXIuc2V0TWF4TGlzdGVuZXJzKCkgdG8gaW5jcmVhc2UgbGltaXQuJyxcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fZXZlbnRzW3R5cGVdLmxlbmd0aCk7XG4gICAgICBpZiAodHlwZW9mIGNvbnNvbGUudHJhY2UgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgLy8gbm90IHN1cHBvcnRlZCBpbiBJRSAxMFxuICAgICAgICBjb25zb2xlLnRyYWNlKCk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHRoaXM7XG59O1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLm9uID0gRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5hZGRMaXN0ZW5lcjtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5vbmNlID0gZnVuY3Rpb24odHlwZSwgbGlzdGVuZXIpIHtcbiAgaWYgKCFpc0Z1bmN0aW9uKGxpc3RlbmVyKSlcbiAgICB0aHJvdyBUeXBlRXJyb3IoJ2xpc3RlbmVyIG11c3QgYmUgYSBmdW5jdGlvbicpO1xuXG4gIHZhciBmaXJlZCA9IGZhbHNlO1xuXG4gIGZ1bmN0aW9uIGcoKSB7XG4gICAgdGhpcy5yZW1vdmVMaXN0ZW5lcih0eXBlLCBnKTtcblxuICAgIGlmICghZmlyZWQpIHtcbiAgICAgIGZpcmVkID0gdHJ1ZTtcbiAgICAgIGxpc3RlbmVyLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgfVxuICB9XG5cbiAgZy5saXN0ZW5lciA9IGxpc3RlbmVyO1xuICB0aGlzLm9uKHR5cGUsIGcpO1xuXG4gIHJldHVybiB0aGlzO1xufTtcblxuLy8gZW1pdHMgYSAncmVtb3ZlTGlzdGVuZXInIGV2ZW50IGlmZiB0aGUgbGlzdGVuZXIgd2FzIHJlbW92ZWRcbkV2ZW50RW1pdHRlci5wcm90b3R5cGUucmVtb3ZlTGlzdGVuZXIgPSBmdW5jdGlvbih0eXBlLCBsaXN0ZW5lcikge1xuICB2YXIgbGlzdCwgcG9zaXRpb24sIGxlbmd0aCwgaTtcblxuICBpZiAoIWlzRnVuY3Rpb24obGlzdGVuZXIpKVxuICAgIHRocm93IFR5cGVFcnJvcignbGlzdGVuZXIgbXVzdCBiZSBhIGZ1bmN0aW9uJyk7XG5cbiAgaWYgKCF0aGlzLl9ldmVudHMgfHwgIXRoaXMuX2V2ZW50c1t0eXBlXSlcbiAgICByZXR1cm4gdGhpcztcblxuICBsaXN0ID0gdGhpcy5fZXZlbnRzW3R5cGVdO1xuICBsZW5ndGggPSBsaXN0Lmxlbmd0aDtcbiAgcG9zaXRpb24gPSAtMTtcblxuICBpZiAobGlzdCA9PT0gbGlzdGVuZXIgfHxcbiAgICAgIChpc0Z1bmN0aW9uKGxpc3QubGlzdGVuZXIpICYmIGxpc3QubGlzdGVuZXIgPT09IGxpc3RlbmVyKSkge1xuICAgIGRlbGV0ZSB0aGlzLl9ldmVudHNbdHlwZV07XG4gICAgaWYgKHRoaXMuX2V2ZW50cy5yZW1vdmVMaXN0ZW5lcilcbiAgICAgIHRoaXMuZW1pdCgncmVtb3ZlTGlzdGVuZXInLCB0eXBlLCBsaXN0ZW5lcik7XG5cbiAgfSBlbHNlIGlmIChpc09iamVjdChsaXN0KSkge1xuICAgIGZvciAoaSA9IGxlbmd0aDsgaS0tID4gMDspIHtcbiAgICAgIGlmIChsaXN0W2ldID09PSBsaXN0ZW5lciB8fFxuICAgICAgICAgIChsaXN0W2ldLmxpc3RlbmVyICYmIGxpc3RbaV0ubGlzdGVuZXIgPT09IGxpc3RlbmVyKSkge1xuICAgICAgICBwb3NpdGlvbiA9IGk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChwb3NpdGlvbiA8IDApXG4gICAgICByZXR1cm4gdGhpcztcblxuICAgIGlmIChsaXN0Lmxlbmd0aCA9PT0gMSkge1xuICAgICAgbGlzdC5sZW5ndGggPSAwO1xuICAgICAgZGVsZXRlIHRoaXMuX2V2ZW50c1t0eXBlXTtcbiAgICB9IGVsc2Uge1xuICAgICAgbGlzdC5zcGxpY2UocG9zaXRpb24sIDEpO1xuICAgIH1cblxuICAgIGlmICh0aGlzLl9ldmVudHMucmVtb3ZlTGlzdGVuZXIpXG4gICAgICB0aGlzLmVtaXQoJ3JlbW92ZUxpc3RlbmVyJywgdHlwZSwgbGlzdGVuZXIpO1xuICB9XG5cbiAgcmV0dXJuIHRoaXM7XG59O1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLnJlbW92ZUFsbExpc3RlbmVycyA9IGZ1bmN0aW9uKHR5cGUpIHtcbiAgdmFyIGtleSwgbGlzdGVuZXJzO1xuXG4gIGlmICghdGhpcy5fZXZlbnRzKVxuICAgIHJldHVybiB0aGlzO1xuXG4gIC8vIG5vdCBsaXN0ZW5pbmcgZm9yIHJlbW92ZUxpc3RlbmVyLCBubyBuZWVkIHRvIGVtaXRcbiAgaWYgKCF0aGlzLl9ldmVudHMucmVtb3ZlTGlzdGVuZXIpIHtcbiAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMClcbiAgICAgIHRoaXMuX2V2ZW50cyA9IHt9O1xuICAgIGVsc2UgaWYgKHRoaXMuX2V2ZW50c1t0eXBlXSlcbiAgICAgIGRlbGV0ZSB0aGlzLl9ldmVudHNbdHlwZV07XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICAvLyBlbWl0IHJlbW92ZUxpc3RlbmVyIGZvciBhbGwgbGlzdGVuZXJzIG9uIGFsbCBldmVudHNcbiAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDApIHtcbiAgICBmb3IgKGtleSBpbiB0aGlzLl9ldmVudHMpIHtcbiAgICAgIGlmIChrZXkgPT09ICdyZW1vdmVMaXN0ZW5lcicpIGNvbnRpbnVlO1xuICAgICAgdGhpcy5yZW1vdmVBbGxMaXN0ZW5lcnMoa2V5KTtcbiAgICB9XG4gICAgdGhpcy5yZW1vdmVBbGxMaXN0ZW5lcnMoJ3JlbW92ZUxpc3RlbmVyJyk7XG4gICAgdGhpcy5fZXZlbnRzID0ge307XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICBsaXN0ZW5lcnMgPSB0aGlzLl9ldmVudHNbdHlwZV07XG5cbiAgaWYgKGlzRnVuY3Rpb24obGlzdGVuZXJzKSkge1xuICAgIHRoaXMucmVtb3ZlTGlzdGVuZXIodHlwZSwgbGlzdGVuZXJzKTtcbiAgfSBlbHNlIGlmIChsaXN0ZW5lcnMpIHtcbiAgICAvLyBMSUZPIG9yZGVyXG4gICAgd2hpbGUgKGxpc3RlbmVycy5sZW5ndGgpXG4gICAgICB0aGlzLnJlbW92ZUxpc3RlbmVyKHR5cGUsIGxpc3RlbmVyc1tsaXN0ZW5lcnMubGVuZ3RoIC0gMV0pO1xuICB9XG4gIGRlbGV0ZSB0aGlzLl9ldmVudHNbdHlwZV07XG5cbiAgcmV0dXJuIHRoaXM7XG59O1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLmxpc3RlbmVycyA9IGZ1bmN0aW9uKHR5cGUpIHtcbiAgdmFyIHJldDtcbiAgaWYgKCF0aGlzLl9ldmVudHMgfHwgIXRoaXMuX2V2ZW50c1t0eXBlXSlcbiAgICByZXQgPSBbXTtcbiAgZWxzZSBpZiAoaXNGdW5jdGlvbih0aGlzLl9ldmVudHNbdHlwZV0pKVxuICAgIHJldCA9IFt0aGlzLl9ldmVudHNbdHlwZV1dO1xuICBlbHNlXG4gICAgcmV0ID0gdGhpcy5fZXZlbnRzW3R5cGVdLnNsaWNlKCk7XG4gIHJldHVybiByZXQ7XG59O1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLmxpc3RlbmVyQ291bnQgPSBmdW5jdGlvbih0eXBlKSB7XG4gIGlmICh0aGlzLl9ldmVudHMpIHtcbiAgICB2YXIgZXZsaXN0ZW5lciA9IHRoaXMuX2V2ZW50c1t0eXBlXTtcblxuICAgIGlmIChpc0Z1bmN0aW9uKGV2bGlzdGVuZXIpKVxuICAgICAgcmV0dXJuIDE7XG4gICAgZWxzZSBpZiAoZXZsaXN0ZW5lcilcbiAgICAgIHJldHVybiBldmxpc3RlbmVyLmxlbmd0aDtcbiAgfVxuICByZXR1cm4gMDtcbn07XG5cbkV2ZW50RW1pdHRlci5saXN0ZW5lckNvdW50ID0gZnVuY3Rpb24oZW1pdHRlciwgdHlwZSkge1xuICByZXR1cm4gZW1pdHRlci5saXN0ZW5lckNvdW50KHR5cGUpO1xufTtcblxuZnVuY3Rpb24gaXNGdW5jdGlvbihhcmcpIHtcbiAgcmV0dXJuIHR5cGVvZiBhcmcgPT09ICdmdW5jdGlvbic7XG59XG5cbmZ1bmN0aW9uIGlzTnVtYmVyKGFyZykge1xuICByZXR1cm4gdHlwZW9mIGFyZyA9PT0gJ251bWJlcic7XG59XG5cbmZ1bmN0aW9uIGlzT2JqZWN0KGFyZykge1xuICByZXR1cm4gdHlwZW9mIGFyZyA9PT0gJ29iamVjdCcgJiYgYXJnICE9PSBudWxsO1xufVxuXG5mdW5jdGlvbiBpc1VuZGVmaW5lZChhcmcpIHtcbiAgcmV0dXJuIGFyZyA9PT0gdm9pZCAwO1xufVxuIiwiaWYgKHR5cGVvZiBPYmplY3QuY3JlYXRlID09PSAnZnVuY3Rpb24nKSB7XG4gIC8vIGltcGxlbWVudGF0aW9uIGZyb20gc3RhbmRhcmQgbm9kZS5qcyAndXRpbCcgbW9kdWxlXG4gIG1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gaW5oZXJpdHMoY3Rvciwgc3VwZXJDdG9yKSB7XG4gICAgY3Rvci5zdXBlcl8gPSBzdXBlckN0b3JcbiAgICBjdG9yLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoc3VwZXJDdG9yLnByb3RvdHlwZSwge1xuICAgICAgY29uc3RydWN0b3I6IHtcbiAgICAgICAgdmFsdWU6IGN0b3IsXG4gICAgICAgIGVudW1lcmFibGU6IGZhbHNlLFxuICAgICAgICB3cml0YWJsZTogdHJ1ZSxcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXG4gICAgICB9XG4gICAgfSk7XG4gIH07XG59IGVsc2Uge1xuICAvLyBvbGQgc2Nob29sIHNoaW0gZm9yIG9sZCBicm93c2Vyc1xuICBtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGluaGVyaXRzKGN0b3IsIHN1cGVyQ3Rvcikge1xuICAgIGN0b3Iuc3VwZXJfID0gc3VwZXJDdG9yXG4gICAgdmFyIFRlbXBDdG9yID0gZnVuY3Rpb24gKCkge31cbiAgICBUZW1wQ3Rvci5wcm90b3R5cGUgPSBzdXBlckN0b3IucHJvdG90eXBlXG4gICAgY3Rvci5wcm90b3R5cGUgPSBuZXcgVGVtcEN0b3IoKVxuICAgIGN0b3IucHJvdG90eXBlLmNvbnN0cnVjdG9yID0gY3RvclxuICB9XG59XG4iLCIvKipcbiAqIERldGVybWluZSBpZiBhbiBvYmplY3QgaXMgQnVmZmVyXG4gKlxuICogQXV0aG9yOiAgIEZlcm9zcyBBYm91a2hhZGlqZWggPGZlcm9zc0BmZXJvc3Mub3JnPiA8aHR0cDovL2Zlcm9zcy5vcmc+XG4gKiBMaWNlbnNlOiAgTUlUXG4gKlxuICogYG5wbSBpbnN0YWxsIGlzLWJ1ZmZlcmBcbiAqL1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChvYmopIHtcbiAgcmV0dXJuICEhKG9iaiAhPSBudWxsICYmXG4gICAgKG9iai5faXNCdWZmZXIgfHwgLy8gRm9yIFNhZmFyaSA1LTcgKG1pc3NpbmcgT2JqZWN0LnByb3RvdHlwZS5jb25zdHJ1Y3RvcilcbiAgICAgIChvYmouY29uc3RydWN0b3IgJiZcbiAgICAgIHR5cGVvZiBvYmouY29uc3RydWN0b3IuaXNCdWZmZXIgPT09ICdmdW5jdGlvbicgJiZcbiAgICAgIG9iai5jb25zdHJ1Y3Rvci5pc0J1ZmZlcihvYmopKVxuICAgICkpXG59XG4iLCJtb2R1bGUuZXhwb3J0cyA9IEFycmF5LmlzQXJyYXkgfHwgZnVuY3Rpb24gKGFycikge1xuICByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKGFycikgPT0gJ1tvYmplY3QgQXJyYXldJztcbn07XG4iLCIvLyBzaGltIGZvciB1c2luZyBwcm9jZXNzIGluIGJyb3dzZXJcblxudmFyIHByb2Nlc3MgPSBtb2R1bGUuZXhwb3J0cyA9IHt9O1xudmFyIHF1ZXVlID0gW107XG52YXIgZHJhaW5pbmcgPSBmYWxzZTtcbnZhciBjdXJyZW50UXVldWU7XG52YXIgcXVldWVJbmRleCA9IC0xO1xuXG5mdW5jdGlvbiBjbGVhblVwTmV4dFRpY2soKSB7XG4gICAgZHJhaW5pbmcgPSBmYWxzZTtcbiAgICBpZiAoY3VycmVudFF1ZXVlLmxlbmd0aCkge1xuICAgICAgICBxdWV1ZSA9IGN1cnJlbnRRdWV1ZS5jb25jYXQocXVldWUpO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHF1ZXVlSW5kZXggPSAtMTtcbiAgICB9XG4gICAgaWYgKHF1ZXVlLmxlbmd0aCkge1xuICAgICAgICBkcmFpblF1ZXVlKCk7XG4gICAgfVxufVxuXG5mdW5jdGlvbiBkcmFpblF1ZXVlKCkge1xuICAgIGlmIChkcmFpbmluZykge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIHZhciB0aW1lb3V0ID0gc2V0VGltZW91dChjbGVhblVwTmV4dFRpY2spO1xuICAgIGRyYWluaW5nID0gdHJ1ZTtcblxuICAgIHZhciBsZW4gPSBxdWV1ZS5sZW5ndGg7XG4gICAgd2hpbGUobGVuKSB7XG4gICAgICAgIGN1cnJlbnRRdWV1ZSA9IHF1ZXVlO1xuICAgICAgICBxdWV1ZSA9IFtdO1xuICAgICAgICB3aGlsZSAoKytxdWV1ZUluZGV4IDwgbGVuKSB7XG4gICAgICAgICAgICBpZiAoY3VycmVudFF1ZXVlKSB7XG4gICAgICAgICAgICAgICAgY3VycmVudFF1ZXVlW3F1ZXVlSW5kZXhdLnJ1bigpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHF1ZXVlSW5kZXggPSAtMTtcbiAgICAgICAgbGVuID0gcXVldWUubGVuZ3RoO1xuICAgIH1cbiAgICBjdXJyZW50UXVldWUgPSBudWxsO1xuICAgIGRyYWluaW5nID0gZmFsc2U7XG4gICAgY2xlYXJUaW1lb3V0KHRpbWVvdXQpO1xufVxuXG5wcm9jZXNzLm5leHRUaWNrID0gZnVuY3Rpb24gKGZ1bikge1xuICAgIHZhciBhcmdzID0gbmV3IEFycmF5KGFyZ3VtZW50cy5sZW5ndGggLSAxKTtcbiAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA+IDEpIHtcbiAgICAgICAgZm9yICh2YXIgaSA9IDE7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGFyZ3NbaSAtIDFdID0gYXJndW1lbnRzW2ldO1xuICAgICAgICB9XG4gICAgfVxuICAgIHF1ZXVlLnB1c2gobmV3IEl0ZW0oZnVuLCBhcmdzKSk7XG4gICAgaWYgKHF1ZXVlLmxlbmd0aCA9PT0gMSAmJiAhZHJhaW5pbmcpIHtcbiAgICAgICAgc2V0VGltZW91dChkcmFpblF1ZXVlLCAwKTtcbiAgICB9XG59O1xuXG4vLyB2OCBsaWtlcyBwcmVkaWN0aWJsZSBvYmplY3RzXG5mdW5jdGlvbiBJdGVtKGZ1biwgYXJyYXkpIHtcbiAgICB0aGlzLmZ1biA9IGZ1bjtcbiAgICB0aGlzLmFycmF5ID0gYXJyYXk7XG59XG5JdGVtLnByb3RvdHlwZS5ydW4gPSBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy5mdW4uYXBwbHkobnVsbCwgdGhpcy5hcnJheSk7XG59O1xucHJvY2Vzcy50aXRsZSA9ICdicm93c2VyJztcbnByb2Nlc3MuYnJvd3NlciA9IHRydWU7XG5wcm9jZXNzLmVudiA9IHt9O1xucHJvY2Vzcy5hcmd2ID0gW107XG5wcm9jZXNzLnZlcnNpb24gPSAnJzsgLy8gZW1wdHkgc3RyaW5nIHRvIGF2b2lkIHJlZ2V4cCBpc3N1ZXNcbnByb2Nlc3MudmVyc2lvbnMgPSB7fTtcblxuZnVuY3Rpb24gbm9vcCgpIHt9XG5cbnByb2Nlc3Mub24gPSBub29wO1xucHJvY2Vzcy5hZGRMaXN0ZW5lciA9IG5vb3A7XG5wcm9jZXNzLm9uY2UgPSBub29wO1xucHJvY2Vzcy5vZmYgPSBub29wO1xucHJvY2Vzcy5yZW1vdmVMaXN0ZW5lciA9IG5vb3A7XG5wcm9jZXNzLnJlbW92ZUFsbExpc3RlbmVycyA9IG5vb3A7XG5wcm9jZXNzLmVtaXQgPSBub29wO1xuXG5wcm9jZXNzLmJpbmRpbmcgPSBmdW5jdGlvbiAobmFtZSkge1xuICAgIHRocm93IG5ldyBFcnJvcigncHJvY2Vzcy5iaW5kaW5nIGlzIG5vdCBzdXBwb3J0ZWQnKTtcbn07XG5cbnByb2Nlc3MuY3dkID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gJy8nIH07XG5wcm9jZXNzLmNoZGlyID0gZnVuY3Rpb24gKGRpcikge1xuICAgIHRocm93IG5ldyBFcnJvcigncHJvY2Vzcy5jaGRpciBpcyBub3Qgc3VwcG9ydGVkJyk7XG59O1xucHJvY2Vzcy51bWFzayA9IGZ1bmN0aW9uKCkgeyByZXR1cm4gMDsgfTtcbiIsIi8vIENvcHlyaWdodCBKb3llbnQsIEluYy4gYW5kIG90aGVyIE5vZGUgY29udHJpYnV0b3JzLlxuLy9cbi8vIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhXG4vLyBjb3B5IG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlXG4vLyBcIlNvZnR3YXJlXCIpLCB0byBkZWFsIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmdcbi8vIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCxcbi8vIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXRcbi8vIHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXMgZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZVxuLy8gZm9sbG93aW5nIGNvbmRpdGlvbnM6XG4vL1xuLy8gVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWRcbi8vIGluIGFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuLy9cbi8vIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1Ncbi8vIE9SIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0Zcbi8vIE1FUkNIQU5UQUJJTElUWSwgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU5cbi8vIE5PIEVWRU5UIFNIQUxMIFRIRSBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLFxuLy8gREFNQUdFUyBPUiBPVEhFUiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SXG4vLyBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSwgT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFXG4vLyBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU4gVEhFIFNPRlRXQVJFLlxuXG4ndXNlIHN0cmljdCc7XG5cbi8vIElmIG9iai5oYXNPd25Qcm9wZXJ0eSBoYXMgYmVlbiBvdmVycmlkZGVuLCB0aGVuIGNhbGxpbmdcbi8vIG9iai5oYXNPd25Qcm9wZXJ0eShwcm9wKSB3aWxsIGJyZWFrLlxuLy8gU2VlOiBodHRwczovL2dpdGh1Yi5jb20vam95ZW50L25vZGUvaXNzdWVzLzE3MDdcbmZ1bmN0aW9uIGhhc093blByb3BlcnR5KG9iaiwgcHJvcCkge1xuICByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24ocXMsIHNlcCwgZXEsIG9wdGlvbnMpIHtcbiAgc2VwID0gc2VwIHx8ICcmJztcbiAgZXEgPSBlcSB8fCAnPSc7XG4gIHZhciBvYmogPSB7fTtcblxuICBpZiAodHlwZW9mIHFzICE9PSAnc3RyaW5nJyB8fCBxcy5sZW5ndGggPT09IDApIHtcbiAgICByZXR1cm4gb2JqO1xuICB9XG5cbiAgdmFyIHJlZ2V4cCA9IC9cXCsvZztcbiAgcXMgPSBxcy5zcGxpdChzZXApO1xuXG4gIHZhciBtYXhLZXlzID0gMTAwMDtcbiAgaWYgKG9wdGlvbnMgJiYgdHlwZW9mIG9wdGlvbnMubWF4S2V5cyA9PT0gJ251bWJlcicpIHtcbiAgICBtYXhLZXlzID0gb3B0aW9ucy5tYXhLZXlzO1xuICB9XG5cbiAgdmFyIGxlbiA9IHFzLmxlbmd0aDtcbiAgLy8gbWF4S2V5cyA8PSAwIG1lYW5zIHRoYXQgd2Ugc2hvdWxkIG5vdCBsaW1pdCBrZXlzIGNvdW50XG4gIGlmIChtYXhLZXlzID4gMCAmJiBsZW4gPiBtYXhLZXlzKSB7XG4gICAgbGVuID0gbWF4S2V5cztcbiAgfVxuXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuOyArK2kpIHtcbiAgICB2YXIgeCA9IHFzW2ldLnJlcGxhY2UocmVnZXhwLCAnJTIwJyksXG4gICAgICAgIGlkeCA9IHguaW5kZXhPZihlcSksXG4gICAgICAgIGtzdHIsIHZzdHIsIGssIHY7XG5cbiAgICBpZiAoaWR4ID49IDApIHtcbiAgICAgIGtzdHIgPSB4LnN1YnN0cigwLCBpZHgpO1xuICAgICAgdnN0ciA9IHguc3Vic3RyKGlkeCArIDEpO1xuICAgIH0gZWxzZSB7XG4gICAgICBrc3RyID0geDtcbiAgICAgIHZzdHIgPSAnJztcbiAgICB9XG5cbiAgICBrID0gZGVjb2RlVVJJQ29tcG9uZW50KGtzdHIpO1xuICAgIHYgPSBkZWNvZGVVUklDb21wb25lbnQodnN0cik7XG5cbiAgICBpZiAoIWhhc093blByb3BlcnR5KG9iaiwgaykpIHtcbiAgICAgIG9ialtrXSA9IHY7XG4gICAgfSBlbHNlIGlmIChpc0FycmF5KG9ialtrXSkpIHtcbiAgICAgIG9ialtrXS5wdXNoKHYpO1xuICAgIH0gZWxzZSB7XG4gICAgICBvYmpba10gPSBbb2JqW2tdLCB2XTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gb2JqO1xufTtcblxudmFyIGlzQXJyYXkgPSBBcnJheS5pc0FycmF5IHx8IGZ1bmN0aW9uICh4cykge1xuICByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKHhzKSA9PT0gJ1tvYmplY3QgQXJyYXldJztcbn07XG4iLCIvLyBDb3B5cmlnaHQgSm95ZW50LCBJbmMuIGFuZCBvdGhlciBOb2RlIGNvbnRyaWJ1dG9ycy5cbi8vXG4vLyBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYVxuLy8gY29weSBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZVxuLy8gXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbCBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nXG4vLyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0cyB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsXG4vLyBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbCBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0XG4vLyBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzIGZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGVcbi8vIGZvbGxvd2luZyBjb25kaXRpb25zOlxuLy9cbi8vIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkXG4vLyBpbiBhbGwgY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cbi8vXG4vLyBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTXG4vLyBPUiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GXG4vLyBNRVJDSEFOVEFCSUxJVFksIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOXG4vLyBOTyBFVkVOVCBTSEFMTCBUSEUgQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSxcbi8vIERBTUFHRVMgT1IgT1RIRVIgTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUlxuLy8gT1RIRVJXSVNFLCBBUklTSU5HIEZST00sIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRVxuLy8gVVNFIE9SIE9USEVSIERFQUxJTkdTIElOIFRIRSBTT0ZUV0FSRS5cblxuJ3VzZSBzdHJpY3QnO1xuXG52YXIgc3RyaW5naWZ5UHJpbWl0aXZlID0gZnVuY3Rpb24odikge1xuICBzd2l0Y2ggKHR5cGVvZiB2KSB7XG4gICAgY2FzZSAnc3RyaW5nJzpcbiAgICAgIHJldHVybiB2O1xuXG4gICAgY2FzZSAnYm9vbGVhbic6XG4gICAgICByZXR1cm4gdiA/ICd0cnVlJyA6ICdmYWxzZSc7XG5cbiAgICBjYXNlICdudW1iZXInOlxuICAgICAgcmV0dXJuIGlzRmluaXRlKHYpID8gdiA6ICcnO1xuXG4gICAgZGVmYXVsdDpcbiAgICAgIHJldHVybiAnJztcbiAgfVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihvYmosIHNlcCwgZXEsIG5hbWUpIHtcbiAgc2VwID0gc2VwIHx8ICcmJztcbiAgZXEgPSBlcSB8fCAnPSc7XG4gIGlmIChvYmogPT09IG51bGwpIHtcbiAgICBvYmogPSB1bmRlZmluZWQ7XG4gIH1cblxuICBpZiAodHlwZW9mIG9iaiA9PT0gJ29iamVjdCcpIHtcbiAgICByZXR1cm4gbWFwKG9iamVjdEtleXMob2JqKSwgZnVuY3Rpb24oaykge1xuICAgICAgdmFyIGtzID0gZW5jb2RlVVJJQ29tcG9uZW50KHN0cmluZ2lmeVByaW1pdGl2ZShrKSkgKyBlcTtcbiAgICAgIGlmIChpc0FycmF5KG9ialtrXSkpIHtcbiAgICAgICAgcmV0dXJuIG1hcChvYmpba10sIGZ1bmN0aW9uKHYpIHtcbiAgICAgICAgICByZXR1cm4ga3MgKyBlbmNvZGVVUklDb21wb25lbnQoc3RyaW5naWZ5UHJpbWl0aXZlKHYpKTtcbiAgICAgICAgfSkuam9pbihzZXApO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIGtzICsgZW5jb2RlVVJJQ29tcG9uZW50KHN0cmluZ2lmeVByaW1pdGl2ZShvYmpba10pKTtcbiAgICAgIH1cbiAgICB9KS5qb2luKHNlcCk7XG5cbiAgfVxuXG4gIGlmICghbmFtZSkgcmV0dXJuICcnO1xuICByZXR1cm4gZW5jb2RlVVJJQ29tcG9uZW50KHN0cmluZ2lmeVByaW1pdGl2ZShuYW1lKSkgKyBlcSArXG4gICAgICAgICBlbmNvZGVVUklDb21wb25lbnQoc3RyaW5naWZ5UHJpbWl0aXZlKG9iaikpO1xufTtcblxudmFyIGlzQXJyYXkgPSBBcnJheS5pc0FycmF5IHx8IGZ1bmN0aW9uICh4cykge1xuICByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKHhzKSA9PT0gJ1tvYmplY3QgQXJyYXldJztcbn07XG5cbmZ1bmN0aW9uIG1hcCAoeHMsIGYpIHtcbiAgaWYgKHhzLm1hcCkgcmV0dXJuIHhzLm1hcChmKTtcbiAgdmFyIHJlcyA9IFtdO1xuICBmb3IgKHZhciBpID0gMDsgaSA8IHhzLmxlbmd0aDsgaSsrKSB7XG4gICAgcmVzLnB1c2goZih4c1tpXSwgaSkpO1xuICB9XG4gIHJldHVybiByZXM7XG59XG5cbnZhciBvYmplY3RLZXlzID0gT2JqZWN0LmtleXMgfHwgZnVuY3Rpb24gKG9iaikge1xuICB2YXIgcmVzID0gW107XG4gIGZvciAodmFyIGtleSBpbiBvYmopIHtcbiAgICBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwga2V5KSkgcmVzLnB1c2goa2V5KTtcbiAgfVxuICByZXR1cm4gcmVzO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxuZXhwb3J0cy5kZWNvZGUgPSBleHBvcnRzLnBhcnNlID0gcmVxdWlyZSgnLi9kZWNvZGUnKTtcbmV4cG9ydHMuZW5jb2RlID0gZXhwb3J0cy5zdHJpbmdpZnkgPSByZXF1aXJlKCcuL2VuY29kZScpO1xuIiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiLi9saWIvX3N0cmVhbV9kdXBsZXguanNcIilcbiIsIi8vIGEgZHVwbGV4IHN0cmVhbSBpcyBqdXN0IGEgc3RyZWFtIHRoYXQgaXMgYm90aCByZWFkYWJsZSBhbmQgd3JpdGFibGUuXG4vLyBTaW5jZSBKUyBkb2Vzbid0IGhhdmUgbXVsdGlwbGUgcHJvdG90eXBhbCBpbmhlcml0YW5jZSwgdGhpcyBjbGFzc1xuLy8gcHJvdG90eXBhbGx5IGluaGVyaXRzIGZyb20gUmVhZGFibGUsIGFuZCB0aGVuIHBhcmFzaXRpY2FsbHkgZnJvbVxuLy8gV3JpdGFibGUuXG5cbid1c2Ugc3RyaWN0JztcblxuLyo8cmVwbGFjZW1lbnQ+Ki9cbnZhciBvYmplY3RLZXlzID0gT2JqZWN0LmtleXMgfHwgZnVuY3Rpb24gKG9iaikge1xuICB2YXIga2V5cyA9IFtdO1xuICBmb3IgKHZhciBrZXkgaW4gb2JqKSBrZXlzLnB1c2goa2V5KTtcbiAgcmV0dXJuIGtleXM7XG59XG4vKjwvcmVwbGFjZW1lbnQ+Ki9cblxuXG5tb2R1bGUuZXhwb3J0cyA9IER1cGxleDtcblxuLyo8cmVwbGFjZW1lbnQ+Ki9cbnZhciBwcm9jZXNzTmV4dFRpY2sgPSByZXF1aXJlKCdwcm9jZXNzLW5leHRpY2stYXJncycpO1xuLyo8L3JlcGxhY2VtZW50PiovXG5cblxuXG4vKjxyZXBsYWNlbWVudD4qL1xudmFyIHV0aWwgPSByZXF1aXJlKCdjb3JlLXV0aWwtaXMnKTtcbnV0aWwuaW5oZXJpdHMgPSByZXF1aXJlKCdpbmhlcml0cycpO1xuLyo8L3JlcGxhY2VtZW50PiovXG5cbnZhciBSZWFkYWJsZSA9IHJlcXVpcmUoJy4vX3N0cmVhbV9yZWFkYWJsZScpO1xudmFyIFdyaXRhYmxlID0gcmVxdWlyZSgnLi9fc3RyZWFtX3dyaXRhYmxlJyk7XG5cbnV0aWwuaW5oZXJpdHMoRHVwbGV4LCBSZWFkYWJsZSk7XG5cbnZhciBrZXlzID0gb2JqZWN0S2V5cyhXcml0YWJsZS5wcm90b3R5cGUpO1xuZm9yICh2YXIgdiA9IDA7IHYgPCBrZXlzLmxlbmd0aDsgdisrKSB7XG4gIHZhciBtZXRob2QgPSBrZXlzW3ZdO1xuICBpZiAoIUR1cGxleC5wcm90b3R5cGVbbWV0aG9kXSlcbiAgICBEdXBsZXgucHJvdG90eXBlW21ldGhvZF0gPSBXcml0YWJsZS5wcm90b3R5cGVbbWV0aG9kXTtcbn1cblxuZnVuY3Rpb24gRHVwbGV4KG9wdGlvbnMpIHtcbiAgaWYgKCEodGhpcyBpbnN0YW5jZW9mIER1cGxleCkpXG4gICAgcmV0dXJuIG5ldyBEdXBsZXgob3B0aW9ucyk7XG5cbiAgUmVhZGFibGUuY2FsbCh0aGlzLCBvcHRpb25zKTtcbiAgV3JpdGFibGUuY2FsbCh0aGlzLCBvcHRpb25zKTtcblxuICBpZiAob3B0aW9ucyAmJiBvcHRpb25zLnJlYWRhYmxlID09PSBmYWxzZSlcbiAgICB0aGlzLnJlYWRhYmxlID0gZmFsc2U7XG5cbiAgaWYgKG9wdGlvbnMgJiYgb3B0aW9ucy53cml0YWJsZSA9PT0gZmFsc2UpXG4gICAgdGhpcy53cml0YWJsZSA9IGZhbHNlO1xuXG4gIHRoaXMuYWxsb3dIYWxmT3BlbiA9IHRydWU7XG4gIGlmIChvcHRpb25zICYmIG9wdGlvbnMuYWxsb3dIYWxmT3BlbiA9PT0gZmFsc2UpXG4gICAgdGhpcy5hbGxvd0hhbGZPcGVuID0gZmFsc2U7XG5cbiAgdGhpcy5vbmNlKCdlbmQnLCBvbmVuZCk7XG59XG5cbi8vIHRoZSBuby1oYWxmLW9wZW4gZW5mb3JjZXJcbmZ1bmN0aW9uIG9uZW5kKCkge1xuICAvLyBpZiB3ZSBhbGxvdyBoYWxmLW9wZW4gc3RhdGUsIG9yIGlmIHRoZSB3cml0YWJsZSBzaWRlIGVuZGVkLFxuICAvLyB0aGVuIHdlJ3JlIG9rLlxuICBpZiAodGhpcy5hbGxvd0hhbGZPcGVuIHx8IHRoaXMuX3dyaXRhYmxlU3RhdGUuZW5kZWQpXG4gICAgcmV0dXJuO1xuXG4gIC8vIG5vIG1vcmUgZGF0YSBjYW4gYmUgd3JpdHRlbi5cbiAgLy8gQnV0IGFsbG93IG1vcmUgd3JpdGVzIHRvIGhhcHBlbiBpbiB0aGlzIHRpY2suXG4gIHByb2Nlc3NOZXh0VGljayhvbkVuZE5ULCB0aGlzKTtcbn1cblxuZnVuY3Rpb24gb25FbmROVChzZWxmKSB7XG4gIHNlbGYuZW5kKCk7XG59XG5cbmZ1bmN0aW9uIGZvckVhY2ggKHhzLCBmKSB7XG4gIGZvciAodmFyIGkgPSAwLCBsID0geHMubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgZih4c1tpXSwgaSk7XG4gIH1cbn1cbiIsIi8vIGEgcGFzc3Rocm91Z2ggc3RyZWFtLlxuLy8gYmFzaWNhbGx5IGp1c3QgdGhlIG1vc3QgbWluaW1hbCBzb3J0IG9mIFRyYW5zZm9ybSBzdHJlYW0uXG4vLyBFdmVyeSB3cml0dGVuIGNodW5rIGdldHMgb3V0cHV0IGFzLWlzLlxuXG4ndXNlIHN0cmljdCc7XG5cbm1vZHVsZS5leHBvcnRzID0gUGFzc1Rocm91Z2g7XG5cbnZhciBUcmFuc2Zvcm0gPSByZXF1aXJlKCcuL19zdHJlYW1fdHJhbnNmb3JtJyk7XG5cbi8qPHJlcGxhY2VtZW50PiovXG52YXIgdXRpbCA9IHJlcXVpcmUoJ2NvcmUtdXRpbC1pcycpO1xudXRpbC5pbmhlcml0cyA9IHJlcXVpcmUoJ2luaGVyaXRzJyk7XG4vKjwvcmVwbGFjZW1lbnQ+Ki9cblxudXRpbC5pbmhlcml0cyhQYXNzVGhyb3VnaCwgVHJhbnNmb3JtKTtcblxuZnVuY3Rpb24gUGFzc1Rocm91Z2gob3B0aW9ucykge1xuICBpZiAoISh0aGlzIGluc3RhbmNlb2YgUGFzc1Rocm91Z2gpKVxuICAgIHJldHVybiBuZXcgUGFzc1Rocm91Z2gob3B0aW9ucyk7XG5cbiAgVHJhbnNmb3JtLmNhbGwodGhpcywgb3B0aW9ucyk7XG59XG5cblBhc3NUaHJvdWdoLnByb3RvdHlwZS5fdHJhbnNmb3JtID0gZnVuY3Rpb24oY2h1bmssIGVuY29kaW5nLCBjYikge1xuICBjYihudWxsLCBjaHVuayk7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFJlYWRhYmxlO1xuXG4vKjxyZXBsYWNlbWVudD4qL1xudmFyIHByb2Nlc3NOZXh0VGljayA9IHJlcXVpcmUoJ3Byb2Nlc3MtbmV4dGljay1hcmdzJyk7XG4vKjwvcmVwbGFjZW1lbnQ+Ki9cblxuXG4vKjxyZXBsYWNlbWVudD4qL1xudmFyIGlzQXJyYXkgPSByZXF1aXJlKCdpc2FycmF5Jyk7XG4vKjwvcmVwbGFjZW1lbnQ+Ki9cblxuXG4vKjxyZXBsYWNlbWVudD4qL1xudmFyIEJ1ZmZlciA9IHJlcXVpcmUoJ2J1ZmZlcicpLkJ1ZmZlcjtcbi8qPC9yZXBsYWNlbWVudD4qL1xuXG5SZWFkYWJsZS5SZWFkYWJsZVN0YXRlID0gUmVhZGFibGVTdGF0ZTtcblxudmFyIEVFID0gcmVxdWlyZSgnZXZlbnRzJyk7XG5cbi8qPHJlcGxhY2VtZW50PiovXG52YXIgRUVsaXN0ZW5lckNvdW50ID0gZnVuY3Rpb24oZW1pdHRlciwgdHlwZSkge1xuICByZXR1cm4gZW1pdHRlci5saXN0ZW5lcnModHlwZSkubGVuZ3RoO1xufTtcbi8qPC9yZXBsYWNlbWVudD4qL1xuXG5cblxuLyo8cmVwbGFjZW1lbnQ+Ki9cbnZhciBTdHJlYW07XG4oZnVuY3Rpb24gKCl7dHJ5e1xuICBTdHJlYW0gPSByZXF1aXJlKCdzdCcgKyAncmVhbScpO1xufWNhdGNoKF8pe31maW5hbGx5e1xuICBpZiAoIVN0cmVhbSlcbiAgICBTdHJlYW0gPSByZXF1aXJlKCdldmVudHMnKS5FdmVudEVtaXR0ZXI7XG59fSgpKVxuLyo8L3JlcGxhY2VtZW50PiovXG5cbnZhciBCdWZmZXIgPSByZXF1aXJlKCdidWZmZXInKS5CdWZmZXI7XG5cbi8qPHJlcGxhY2VtZW50PiovXG52YXIgdXRpbCA9IHJlcXVpcmUoJ2NvcmUtdXRpbC1pcycpO1xudXRpbC5pbmhlcml0cyA9IHJlcXVpcmUoJ2luaGVyaXRzJyk7XG4vKjwvcmVwbGFjZW1lbnQ+Ki9cblxuXG5cbi8qPHJlcGxhY2VtZW50PiovXG52YXIgZGVidWdVdGlsID0gcmVxdWlyZSgndXRpbCcpO1xudmFyIGRlYnVnO1xuaWYgKGRlYnVnVXRpbCAmJiBkZWJ1Z1V0aWwuZGVidWdsb2cpIHtcbiAgZGVidWcgPSBkZWJ1Z1V0aWwuZGVidWdsb2coJ3N0cmVhbScpO1xufSBlbHNlIHtcbiAgZGVidWcgPSBmdW5jdGlvbiAoKSB7fTtcbn1cbi8qPC9yZXBsYWNlbWVudD4qL1xuXG52YXIgU3RyaW5nRGVjb2RlcjtcblxudXRpbC5pbmhlcml0cyhSZWFkYWJsZSwgU3RyZWFtKTtcblxudmFyIER1cGxleDtcbmZ1bmN0aW9uIFJlYWRhYmxlU3RhdGUob3B0aW9ucywgc3RyZWFtKSB7XG4gIER1cGxleCA9IER1cGxleCB8fCByZXF1aXJlKCcuL19zdHJlYW1fZHVwbGV4Jyk7XG5cbiAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG5cbiAgLy8gb2JqZWN0IHN0cmVhbSBmbGFnLiBVc2VkIHRvIG1ha2UgcmVhZChuKSBpZ25vcmUgbiBhbmQgdG9cbiAgLy8gbWFrZSBhbGwgdGhlIGJ1ZmZlciBtZXJnaW5nIGFuZCBsZW5ndGggY2hlY2tzIGdvIGF3YXlcbiAgdGhpcy5vYmplY3RNb2RlID0gISFvcHRpb25zLm9iamVjdE1vZGU7XG5cbiAgaWYgKHN0cmVhbSBpbnN0YW5jZW9mIER1cGxleClcbiAgICB0aGlzLm9iamVjdE1vZGUgPSB0aGlzLm9iamVjdE1vZGUgfHwgISFvcHRpb25zLnJlYWRhYmxlT2JqZWN0TW9kZTtcblxuICAvLyB0aGUgcG9pbnQgYXQgd2hpY2ggaXQgc3RvcHMgY2FsbGluZyBfcmVhZCgpIHRvIGZpbGwgdGhlIGJ1ZmZlclxuICAvLyBOb3RlOiAwIGlzIGEgdmFsaWQgdmFsdWUsIG1lYW5zIFwiZG9uJ3QgY2FsbCBfcmVhZCBwcmVlbXB0aXZlbHkgZXZlclwiXG4gIHZhciBod20gPSBvcHRpb25zLmhpZ2hXYXRlck1hcms7XG4gIHZhciBkZWZhdWx0SHdtID0gdGhpcy5vYmplY3RNb2RlID8gMTYgOiAxNiAqIDEwMjQ7XG4gIHRoaXMuaGlnaFdhdGVyTWFyayA9IChod20gfHwgaHdtID09PSAwKSA/IGh3bSA6IGRlZmF1bHRId207XG5cbiAgLy8gY2FzdCB0byBpbnRzLlxuICB0aGlzLmhpZ2hXYXRlck1hcmsgPSB+fnRoaXMuaGlnaFdhdGVyTWFyaztcblxuICB0aGlzLmJ1ZmZlciA9IFtdO1xuICB0aGlzLmxlbmd0aCA9IDA7XG4gIHRoaXMucGlwZXMgPSBudWxsO1xuICB0aGlzLnBpcGVzQ291bnQgPSAwO1xuICB0aGlzLmZsb3dpbmcgPSBudWxsO1xuICB0aGlzLmVuZGVkID0gZmFsc2U7XG4gIHRoaXMuZW5kRW1pdHRlZCA9IGZhbHNlO1xuICB0aGlzLnJlYWRpbmcgPSBmYWxzZTtcblxuICAvLyBhIGZsYWcgdG8gYmUgYWJsZSB0byB0ZWxsIGlmIHRoZSBvbndyaXRlIGNiIGlzIGNhbGxlZCBpbW1lZGlhdGVseSxcbiAgLy8gb3Igb24gYSBsYXRlciB0aWNrLiAgV2Ugc2V0IHRoaXMgdG8gdHJ1ZSBhdCBmaXJzdCwgYmVjYXVzZSBhbnlcbiAgLy8gYWN0aW9ucyB0aGF0IHNob3VsZG4ndCBoYXBwZW4gdW50aWwgXCJsYXRlclwiIHNob3VsZCBnZW5lcmFsbHkgYWxzb1xuICAvLyBub3QgaGFwcGVuIGJlZm9yZSB0aGUgZmlyc3Qgd3JpdGUgY2FsbC5cbiAgdGhpcy5zeW5jID0gdHJ1ZTtcblxuICAvLyB3aGVuZXZlciB3ZSByZXR1cm4gbnVsbCwgdGhlbiB3ZSBzZXQgYSBmbGFnIHRvIHNheVxuICAvLyB0aGF0IHdlJ3JlIGF3YWl0aW5nIGEgJ3JlYWRhYmxlJyBldmVudCBlbWlzc2lvbi5cbiAgdGhpcy5uZWVkUmVhZGFibGUgPSBmYWxzZTtcbiAgdGhpcy5lbWl0dGVkUmVhZGFibGUgPSBmYWxzZTtcbiAgdGhpcy5yZWFkYWJsZUxpc3RlbmluZyA9IGZhbHNlO1xuXG4gIC8vIENyeXB0byBpcyBraW5kIG9mIG9sZCBhbmQgY3J1c3R5LiAgSGlzdG9yaWNhbGx5LCBpdHMgZGVmYXVsdCBzdHJpbmdcbiAgLy8gZW5jb2RpbmcgaXMgJ2JpbmFyeScgc28gd2UgaGF2ZSB0byBtYWtlIHRoaXMgY29uZmlndXJhYmxlLlxuICAvLyBFdmVyeXRoaW5nIGVsc2UgaW4gdGhlIHVuaXZlcnNlIHVzZXMgJ3V0ZjgnLCB0aG91Z2guXG4gIHRoaXMuZGVmYXVsdEVuY29kaW5nID0gb3B0aW9ucy5kZWZhdWx0RW5jb2RpbmcgfHwgJ3V0ZjgnO1xuXG4gIC8vIHdoZW4gcGlwaW5nLCB3ZSBvbmx5IGNhcmUgYWJvdXQgJ3JlYWRhYmxlJyBldmVudHMgdGhhdCBoYXBwZW5cbiAgLy8gYWZ0ZXIgcmVhZCgpaW5nIGFsbCB0aGUgYnl0ZXMgYW5kIG5vdCBnZXR0aW5nIGFueSBwdXNoYmFjay5cbiAgdGhpcy5yYW5PdXQgPSBmYWxzZTtcblxuICAvLyB0aGUgbnVtYmVyIG9mIHdyaXRlcnMgdGhhdCBhcmUgYXdhaXRpbmcgYSBkcmFpbiBldmVudCBpbiAucGlwZSgpc1xuICB0aGlzLmF3YWl0RHJhaW4gPSAwO1xuXG4gIC8vIGlmIHRydWUsIGEgbWF5YmVSZWFkTW9yZSBoYXMgYmVlbiBzY2hlZHVsZWRcbiAgdGhpcy5yZWFkaW5nTW9yZSA9IGZhbHNlO1xuXG4gIHRoaXMuZGVjb2RlciA9IG51bGw7XG4gIHRoaXMuZW5jb2RpbmcgPSBudWxsO1xuICBpZiAob3B0aW9ucy5lbmNvZGluZykge1xuICAgIGlmICghU3RyaW5nRGVjb2RlcilcbiAgICAgIFN0cmluZ0RlY29kZXIgPSByZXF1aXJlKCdzdHJpbmdfZGVjb2Rlci8nKS5TdHJpbmdEZWNvZGVyO1xuICAgIHRoaXMuZGVjb2RlciA9IG5ldyBTdHJpbmdEZWNvZGVyKG9wdGlvbnMuZW5jb2RpbmcpO1xuICAgIHRoaXMuZW5jb2RpbmcgPSBvcHRpb25zLmVuY29kaW5nO1xuICB9XG59XG5cbnZhciBEdXBsZXg7XG5mdW5jdGlvbiBSZWFkYWJsZShvcHRpb25zKSB7XG4gIER1cGxleCA9IER1cGxleCB8fCByZXF1aXJlKCcuL19zdHJlYW1fZHVwbGV4Jyk7XG5cbiAgaWYgKCEodGhpcyBpbnN0YW5jZW9mIFJlYWRhYmxlKSlcbiAgICByZXR1cm4gbmV3IFJlYWRhYmxlKG9wdGlvbnMpO1xuXG4gIHRoaXMuX3JlYWRhYmxlU3RhdGUgPSBuZXcgUmVhZGFibGVTdGF0ZShvcHRpb25zLCB0aGlzKTtcblxuICAvLyBsZWdhY3lcbiAgdGhpcy5yZWFkYWJsZSA9IHRydWU7XG5cbiAgaWYgKG9wdGlvbnMgJiYgdHlwZW9mIG9wdGlvbnMucmVhZCA9PT0gJ2Z1bmN0aW9uJylcbiAgICB0aGlzLl9yZWFkID0gb3B0aW9ucy5yZWFkO1xuXG4gIFN0cmVhbS5jYWxsKHRoaXMpO1xufVxuXG4vLyBNYW51YWxseSBzaG92ZSBzb21ldGhpbmcgaW50byB0aGUgcmVhZCgpIGJ1ZmZlci5cbi8vIFRoaXMgcmV0dXJucyB0cnVlIGlmIHRoZSBoaWdoV2F0ZXJNYXJrIGhhcyBub3QgYmVlbiBoaXQgeWV0LFxuLy8gc2ltaWxhciB0byBob3cgV3JpdGFibGUud3JpdGUoKSByZXR1cm5zIHRydWUgaWYgeW91IHNob3VsZFxuLy8gd3JpdGUoKSBzb21lIG1vcmUuXG5SZWFkYWJsZS5wcm90b3R5cGUucHVzaCA9IGZ1bmN0aW9uKGNodW5rLCBlbmNvZGluZykge1xuICB2YXIgc3RhdGUgPSB0aGlzLl9yZWFkYWJsZVN0YXRlO1xuXG4gIGlmICghc3RhdGUub2JqZWN0TW9kZSAmJiB0eXBlb2YgY2h1bmsgPT09ICdzdHJpbmcnKSB7XG4gICAgZW5jb2RpbmcgPSBlbmNvZGluZyB8fCBzdGF0ZS5kZWZhdWx0RW5jb2Rpbmc7XG4gICAgaWYgKGVuY29kaW5nICE9PSBzdGF0ZS5lbmNvZGluZykge1xuICAgICAgY2h1bmsgPSBuZXcgQnVmZmVyKGNodW5rLCBlbmNvZGluZyk7XG4gICAgICBlbmNvZGluZyA9ICcnO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiByZWFkYWJsZUFkZENodW5rKHRoaXMsIHN0YXRlLCBjaHVuaywgZW5jb2RpbmcsIGZhbHNlKTtcbn07XG5cbi8vIFVuc2hpZnQgc2hvdWxkICphbHdheXMqIGJlIHNvbWV0aGluZyBkaXJlY3RseSBvdXQgb2YgcmVhZCgpXG5SZWFkYWJsZS5wcm90b3R5cGUudW5zaGlmdCA9IGZ1bmN0aW9uKGNodW5rKSB7XG4gIHZhciBzdGF0ZSA9IHRoaXMuX3JlYWRhYmxlU3RhdGU7XG4gIHJldHVybiByZWFkYWJsZUFkZENodW5rKHRoaXMsIHN0YXRlLCBjaHVuaywgJycsIHRydWUpO1xufTtcblxuUmVhZGFibGUucHJvdG90eXBlLmlzUGF1c2VkID0gZnVuY3Rpb24oKSB7XG4gIHJldHVybiB0aGlzLl9yZWFkYWJsZVN0YXRlLmZsb3dpbmcgPT09IGZhbHNlO1xufTtcblxuZnVuY3Rpb24gcmVhZGFibGVBZGRDaHVuayhzdHJlYW0sIHN0YXRlLCBjaHVuaywgZW5jb2RpbmcsIGFkZFRvRnJvbnQpIHtcbiAgdmFyIGVyID0gY2h1bmtJbnZhbGlkKHN0YXRlLCBjaHVuayk7XG4gIGlmIChlcikge1xuICAgIHN0cmVhbS5lbWl0KCdlcnJvcicsIGVyKTtcbiAgfSBlbHNlIGlmIChjaHVuayA9PT0gbnVsbCkge1xuICAgIHN0YXRlLnJlYWRpbmcgPSBmYWxzZTtcbiAgICBvbkVvZkNodW5rKHN0cmVhbSwgc3RhdGUpO1xuICB9IGVsc2UgaWYgKHN0YXRlLm9iamVjdE1vZGUgfHwgY2h1bmsgJiYgY2h1bmsubGVuZ3RoID4gMCkge1xuICAgIGlmIChzdGF0ZS5lbmRlZCAmJiAhYWRkVG9Gcm9udCkge1xuICAgICAgdmFyIGUgPSBuZXcgRXJyb3IoJ3N0cmVhbS5wdXNoKCkgYWZ0ZXIgRU9GJyk7XG4gICAgICBzdHJlYW0uZW1pdCgnZXJyb3InLCBlKTtcbiAgICB9IGVsc2UgaWYgKHN0YXRlLmVuZEVtaXR0ZWQgJiYgYWRkVG9Gcm9udCkge1xuICAgICAgdmFyIGUgPSBuZXcgRXJyb3IoJ3N0cmVhbS51bnNoaWZ0KCkgYWZ0ZXIgZW5kIGV2ZW50Jyk7XG4gICAgICBzdHJlYW0uZW1pdCgnZXJyb3InLCBlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKHN0YXRlLmRlY29kZXIgJiYgIWFkZFRvRnJvbnQgJiYgIWVuY29kaW5nKVxuICAgICAgICBjaHVuayA9IHN0YXRlLmRlY29kZXIud3JpdGUoY2h1bmspO1xuXG4gICAgICBpZiAoIWFkZFRvRnJvbnQpXG4gICAgICAgIHN0YXRlLnJlYWRpbmcgPSBmYWxzZTtcblxuICAgICAgLy8gaWYgd2Ugd2FudCB0aGUgZGF0YSBub3csIGp1c3QgZW1pdCBpdC5cbiAgICAgIGlmIChzdGF0ZS5mbG93aW5nICYmIHN0YXRlLmxlbmd0aCA9PT0gMCAmJiAhc3RhdGUuc3luYykge1xuICAgICAgICBzdHJlYW0uZW1pdCgnZGF0YScsIGNodW5rKTtcbiAgICAgICAgc3RyZWFtLnJlYWQoMCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvLyB1cGRhdGUgdGhlIGJ1ZmZlciBpbmZvLlxuICAgICAgICBzdGF0ZS5sZW5ndGggKz0gc3RhdGUub2JqZWN0TW9kZSA/IDEgOiBjaHVuay5sZW5ndGg7XG4gICAgICAgIGlmIChhZGRUb0Zyb250KVxuICAgICAgICAgIHN0YXRlLmJ1ZmZlci51bnNoaWZ0KGNodW5rKTtcbiAgICAgICAgZWxzZVxuICAgICAgICAgIHN0YXRlLmJ1ZmZlci5wdXNoKGNodW5rKTtcblxuICAgICAgICBpZiAoc3RhdGUubmVlZFJlYWRhYmxlKVxuICAgICAgICAgIGVtaXRSZWFkYWJsZShzdHJlYW0pO1xuICAgICAgfVxuXG4gICAgICBtYXliZVJlYWRNb3JlKHN0cmVhbSwgc3RhdGUpO1xuICAgIH1cbiAgfSBlbHNlIGlmICghYWRkVG9Gcm9udCkge1xuICAgIHN0YXRlLnJlYWRpbmcgPSBmYWxzZTtcbiAgfVxuXG4gIHJldHVybiBuZWVkTW9yZURhdGEoc3RhdGUpO1xufVxuXG5cbi8vIGlmIGl0J3MgcGFzdCB0aGUgaGlnaCB3YXRlciBtYXJrLCB3ZSBjYW4gcHVzaCBpbiBzb21lIG1vcmUuXG4vLyBBbHNvLCBpZiB3ZSBoYXZlIG5vIGRhdGEgeWV0LCB3ZSBjYW4gc3RhbmQgc29tZVxuLy8gbW9yZSBieXRlcy4gIFRoaXMgaXMgdG8gd29yayBhcm91bmQgY2FzZXMgd2hlcmUgaHdtPTAsXG4vLyBzdWNoIGFzIHRoZSByZXBsLiAgQWxzbywgaWYgdGhlIHB1c2goKSB0cmlnZ2VyZWQgYVxuLy8gcmVhZGFibGUgZXZlbnQsIGFuZCB0aGUgdXNlciBjYWxsZWQgcmVhZChsYXJnZU51bWJlcikgc3VjaCB0aGF0XG4vLyBuZWVkUmVhZGFibGUgd2FzIHNldCwgdGhlbiB3ZSBvdWdodCB0byBwdXNoIG1vcmUsIHNvIHRoYXQgYW5vdGhlclxuLy8gJ3JlYWRhYmxlJyBldmVudCB3aWxsIGJlIHRyaWdnZXJlZC5cbmZ1bmN0aW9uIG5lZWRNb3JlRGF0YShzdGF0ZSkge1xuICByZXR1cm4gIXN0YXRlLmVuZGVkICYmXG4gICAgICAgICAoc3RhdGUubmVlZFJlYWRhYmxlIHx8XG4gICAgICAgICAgc3RhdGUubGVuZ3RoIDwgc3RhdGUuaGlnaFdhdGVyTWFyayB8fFxuICAgICAgICAgIHN0YXRlLmxlbmd0aCA9PT0gMCk7XG59XG5cbi8vIGJhY2t3YXJkcyBjb21wYXRpYmlsaXR5LlxuUmVhZGFibGUucHJvdG90eXBlLnNldEVuY29kaW5nID0gZnVuY3Rpb24oZW5jKSB7XG4gIGlmICghU3RyaW5nRGVjb2RlcilcbiAgICBTdHJpbmdEZWNvZGVyID0gcmVxdWlyZSgnc3RyaW5nX2RlY29kZXIvJykuU3RyaW5nRGVjb2RlcjtcbiAgdGhpcy5fcmVhZGFibGVTdGF0ZS5kZWNvZGVyID0gbmV3IFN0cmluZ0RlY29kZXIoZW5jKTtcbiAgdGhpcy5fcmVhZGFibGVTdGF0ZS5lbmNvZGluZyA9IGVuYztcbiAgcmV0dXJuIHRoaXM7XG59O1xuXG4vLyBEb24ndCByYWlzZSB0aGUgaHdtID4gOE1CXG52YXIgTUFYX0hXTSA9IDB4ODAwMDAwO1xuZnVuY3Rpb24gY29tcHV0ZU5ld0hpZ2hXYXRlck1hcmsobikge1xuICBpZiAobiA+PSBNQVhfSFdNKSB7XG4gICAgbiA9IE1BWF9IV007XG4gIH0gZWxzZSB7XG4gICAgLy8gR2V0IHRoZSBuZXh0IGhpZ2hlc3QgcG93ZXIgb2YgMlxuICAgIG4tLTtcbiAgICBuIHw9IG4gPj4+IDE7XG4gICAgbiB8PSBuID4+PiAyO1xuICAgIG4gfD0gbiA+Pj4gNDtcbiAgICBuIHw9IG4gPj4+IDg7XG4gICAgbiB8PSBuID4+PiAxNjtcbiAgICBuKys7XG4gIH1cbiAgcmV0dXJuIG47XG59XG5cbmZ1bmN0aW9uIGhvd011Y2hUb1JlYWQobiwgc3RhdGUpIHtcbiAgaWYgKHN0YXRlLmxlbmd0aCA9PT0gMCAmJiBzdGF0ZS5lbmRlZClcbiAgICByZXR1cm4gMDtcblxuICBpZiAoc3RhdGUub2JqZWN0TW9kZSlcbiAgICByZXR1cm4gbiA9PT0gMCA/IDAgOiAxO1xuXG4gIGlmIChuID09PSBudWxsIHx8IGlzTmFOKG4pKSB7XG4gICAgLy8gb25seSBmbG93IG9uZSBidWZmZXIgYXQgYSB0aW1lXG4gICAgaWYgKHN0YXRlLmZsb3dpbmcgJiYgc3RhdGUuYnVmZmVyLmxlbmd0aClcbiAgICAgIHJldHVybiBzdGF0ZS5idWZmZXJbMF0ubGVuZ3RoO1xuICAgIGVsc2VcbiAgICAgIHJldHVybiBzdGF0ZS5sZW5ndGg7XG4gIH1cblxuICBpZiAobiA8PSAwKVxuICAgIHJldHVybiAwO1xuXG4gIC8vIElmIHdlJ3JlIGFza2luZyBmb3IgbW9yZSB0aGFuIHRoZSB0YXJnZXQgYnVmZmVyIGxldmVsLFxuICAvLyB0aGVuIHJhaXNlIHRoZSB3YXRlciBtYXJrLiAgQnVtcCB1cCB0byB0aGUgbmV4dCBoaWdoZXN0XG4gIC8vIHBvd2VyIG9mIDIsIHRvIHByZXZlbnQgaW5jcmVhc2luZyBpdCBleGNlc3NpdmVseSBpbiB0aW55XG4gIC8vIGFtb3VudHMuXG4gIGlmIChuID4gc3RhdGUuaGlnaFdhdGVyTWFyaylcbiAgICBzdGF0ZS5oaWdoV2F0ZXJNYXJrID0gY29tcHV0ZU5ld0hpZ2hXYXRlck1hcmsobik7XG5cbiAgLy8gZG9uJ3QgaGF2ZSB0aGF0IG11Y2guICByZXR1cm4gbnVsbCwgdW5sZXNzIHdlJ3ZlIGVuZGVkLlxuICBpZiAobiA+IHN0YXRlLmxlbmd0aCkge1xuICAgIGlmICghc3RhdGUuZW5kZWQpIHtcbiAgICAgIHN0YXRlLm5lZWRSZWFkYWJsZSA9IHRydWU7XG4gICAgICByZXR1cm4gMDtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHN0YXRlLmxlbmd0aDtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gbjtcbn1cblxuLy8geW91IGNhbiBvdmVycmlkZSBlaXRoZXIgdGhpcyBtZXRob2QsIG9yIHRoZSBhc3luYyBfcmVhZChuKSBiZWxvdy5cblJlYWRhYmxlLnByb3RvdHlwZS5yZWFkID0gZnVuY3Rpb24obikge1xuICBkZWJ1ZygncmVhZCcsIG4pO1xuICB2YXIgc3RhdGUgPSB0aGlzLl9yZWFkYWJsZVN0YXRlO1xuICB2YXIgbk9yaWcgPSBuO1xuXG4gIGlmICh0eXBlb2YgbiAhPT0gJ251bWJlcicgfHwgbiA+IDApXG4gICAgc3RhdGUuZW1pdHRlZFJlYWRhYmxlID0gZmFsc2U7XG5cbiAgLy8gaWYgd2UncmUgZG9pbmcgcmVhZCgwKSB0byB0cmlnZ2VyIGEgcmVhZGFibGUgZXZlbnQsIGJ1dCB3ZVxuICAvLyBhbHJlYWR5IGhhdmUgYSBidW5jaCBvZiBkYXRhIGluIHRoZSBidWZmZXIsIHRoZW4ganVzdCB0cmlnZ2VyXG4gIC8vIHRoZSAncmVhZGFibGUnIGV2ZW50IGFuZCBtb3ZlIG9uLlxuICBpZiAobiA9PT0gMCAmJlxuICAgICAgc3RhdGUubmVlZFJlYWRhYmxlICYmXG4gICAgICAoc3RhdGUubGVuZ3RoID49IHN0YXRlLmhpZ2hXYXRlck1hcmsgfHwgc3RhdGUuZW5kZWQpKSB7XG4gICAgZGVidWcoJ3JlYWQ6IGVtaXRSZWFkYWJsZScsIHN0YXRlLmxlbmd0aCwgc3RhdGUuZW5kZWQpO1xuICAgIGlmIChzdGF0ZS5sZW5ndGggPT09IDAgJiYgc3RhdGUuZW5kZWQpXG4gICAgICBlbmRSZWFkYWJsZSh0aGlzKTtcbiAgICBlbHNlXG4gICAgICBlbWl0UmVhZGFibGUodGhpcyk7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICBuID0gaG93TXVjaFRvUmVhZChuLCBzdGF0ZSk7XG5cbiAgLy8gaWYgd2UndmUgZW5kZWQsIGFuZCB3ZSdyZSBub3cgY2xlYXIsIHRoZW4gZmluaXNoIGl0IHVwLlxuICBpZiAobiA9PT0gMCAmJiBzdGF0ZS5lbmRlZCkge1xuICAgIGlmIChzdGF0ZS5sZW5ndGggPT09IDApXG4gICAgICBlbmRSZWFkYWJsZSh0aGlzKTtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIC8vIEFsbCB0aGUgYWN0dWFsIGNodW5rIGdlbmVyYXRpb24gbG9naWMgbmVlZHMgdG8gYmVcbiAgLy8gKmJlbG93KiB0aGUgY2FsbCB0byBfcmVhZC4gIFRoZSByZWFzb24gaXMgdGhhdCBpbiBjZXJ0YWluXG4gIC8vIHN5bnRoZXRpYyBzdHJlYW0gY2FzZXMsIHN1Y2ggYXMgcGFzc3Rocm91Z2ggc3RyZWFtcywgX3JlYWRcbiAgLy8gbWF5IGJlIGEgY29tcGxldGVseSBzeW5jaHJvbm91cyBvcGVyYXRpb24gd2hpY2ggbWF5IGNoYW5nZVxuICAvLyB0aGUgc3RhdGUgb2YgdGhlIHJlYWQgYnVmZmVyLCBwcm92aWRpbmcgZW5vdWdoIGRhdGEgd2hlblxuICAvLyBiZWZvcmUgdGhlcmUgd2FzICpub3QqIGVub3VnaC5cbiAgLy9cbiAgLy8gU28sIHRoZSBzdGVwcyBhcmU6XG4gIC8vIDEuIEZpZ3VyZSBvdXQgd2hhdCB0aGUgc3RhdGUgb2YgdGhpbmdzIHdpbGwgYmUgYWZ0ZXIgd2UgZG9cbiAgLy8gYSByZWFkIGZyb20gdGhlIGJ1ZmZlci5cbiAgLy9cbiAgLy8gMi4gSWYgdGhhdCByZXN1bHRpbmcgc3RhdGUgd2lsbCB0cmlnZ2VyIGEgX3JlYWQsIHRoZW4gY2FsbCBfcmVhZC5cbiAgLy8gTm90ZSB0aGF0IHRoaXMgbWF5IGJlIGFzeW5jaHJvbm91cywgb3Igc3luY2hyb25vdXMuICBZZXMsIGl0IGlzXG4gIC8vIGRlZXBseSB1Z2x5IHRvIHdyaXRlIEFQSXMgdGhpcyB3YXksIGJ1dCB0aGF0IHN0aWxsIGRvZXNuJ3QgbWVhblxuICAvLyB0aGF0IHRoZSBSZWFkYWJsZSBjbGFzcyBzaG91bGQgYmVoYXZlIGltcHJvcGVybHksIGFzIHN0cmVhbXMgYXJlXG4gIC8vIGRlc2lnbmVkIHRvIGJlIHN5bmMvYXN5bmMgYWdub3N0aWMuXG4gIC8vIFRha2Ugbm90ZSBpZiB0aGUgX3JlYWQgY2FsbCBpcyBzeW5jIG9yIGFzeW5jIChpZSwgaWYgdGhlIHJlYWQgY2FsbFxuICAvLyBoYXMgcmV0dXJuZWQgeWV0KSwgc28gdGhhdCB3ZSBrbm93IHdoZXRoZXIgb3Igbm90IGl0J3Mgc2FmZSB0byBlbWl0XG4gIC8vICdyZWFkYWJsZScgZXRjLlxuICAvL1xuICAvLyAzLiBBY3R1YWxseSBwdWxsIHRoZSByZXF1ZXN0ZWQgY2h1bmtzIG91dCBvZiB0aGUgYnVmZmVyIGFuZCByZXR1cm4uXG5cbiAgLy8gaWYgd2UgbmVlZCBhIHJlYWRhYmxlIGV2ZW50LCB0aGVuIHdlIG5lZWQgdG8gZG8gc29tZSByZWFkaW5nLlxuICB2YXIgZG9SZWFkID0gc3RhdGUubmVlZFJlYWRhYmxlO1xuICBkZWJ1ZygnbmVlZCByZWFkYWJsZScsIGRvUmVhZCk7XG5cbiAgLy8gaWYgd2UgY3VycmVudGx5IGhhdmUgbGVzcyB0aGFuIHRoZSBoaWdoV2F0ZXJNYXJrLCB0aGVuIGFsc28gcmVhZCBzb21lXG4gIGlmIChzdGF0ZS5sZW5ndGggPT09IDAgfHwgc3RhdGUubGVuZ3RoIC0gbiA8IHN0YXRlLmhpZ2hXYXRlck1hcmspIHtcbiAgICBkb1JlYWQgPSB0cnVlO1xuICAgIGRlYnVnKCdsZW5ndGggbGVzcyB0aGFuIHdhdGVybWFyaycsIGRvUmVhZCk7XG4gIH1cblxuICAvLyBob3dldmVyLCBpZiB3ZSd2ZSBlbmRlZCwgdGhlbiB0aGVyZSdzIG5vIHBvaW50LCBhbmQgaWYgd2UncmUgYWxyZWFkeVxuICAvLyByZWFkaW5nLCB0aGVuIGl0J3MgdW5uZWNlc3NhcnkuXG4gIGlmIChzdGF0ZS5lbmRlZCB8fCBzdGF0ZS5yZWFkaW5nKSB7XG4gICAgZG9SZWFkID0gZmFsc2U7XG4gICAgZGVidWcoJ3JlYWRpbmcgb3IgZW5kZWQnLCBkb1JlYWQpO1xuICB9XG5cbiAgaWYgKGRvUmVhZCkge1xuICAgIGRlYnVnKCdkbyByZWFkJyk7XG4gICAgc3RhdGUucmVhZGluZyA9IHRydWU7XG4gICAgc3RhdGUuc3luYyA9IHRydWU7XG4gICAgLy8gaWYgdGhlIGxlbmd0aCBpcyBjdXJyZW50bHkgemVybywgdGhlbiB3ZSAqbmVlZCogYSByZWFkYWJsZSBldmVudC5cbiAgICBpZiAoc3RhdGUubGVuZ3RoID09PSAwKVxuICAgICAgc3RhdGUubmVlZFJlYWRhYmxlID0gdHJ1ZTtcbiAgICAvLyBjYWxsIGludGVybmFsIHJlYWQgbWV0aG9kXG4gICAgdGhpcy5fcmVhZChzdGF0ZS5oaWdoV2F0ZXJNYXJrKTtcbiAgICBzdGF0ZS5zeW5jID0gZmFsc2U7XG4gIH1cblxuICAvLyBJZiBfcmVhZCBwdXNoZWQgZGF0YSBzeW5jaHJvbm91c2x5LCB0aGVuIGByZWFkaW5nYCB3aWxsIGJlIGZhbHNlLFxuICAvLyBhbmQgd2UgbmVlZCB0byByZS1ldmFsdWF0ZSBob3cgbXVjaCBkYXRhIHdlIGNhbiByZXR1cm4gdG8gdGhlIHVzZXIuXG4gIGlmIChkb1JlYWQgJiYgIXN0YXRlLnJlYWRpbmcpXG4gICAgbiA9IGhvd011Y2hUb1JlYWQobk9yaWcsIHN0YXRlKTtcblxuICB2YXIgcmV0O1xuICBpZiAobiA+IDApXG4gICAgcmV0ID0gZnJvbUxpc3Qobiwgc3RhdGUpO1xuICBlbHNlXG4gICAgcmV0ID0gbnVsbDtcblxuICBpZiAocmV0ID09PSBudWxsKSB7XG4gICAgc3RhdGUubmVlZFJlYWRhYmxlID0gdHJ1ZTtcbiAgICBuID0gMDtcbiAgfVxuXG4gIHN0YXRlLmxlbmd0aCAtPSBuO1xuXG4gIC8vIElmIHdlIGhhdmUgbm90aGluZyBpbiB0aGUgYnVmZmVyLCB0aGVuIHdlIHdhbnQgdG8ga25vd1xuICAvLyBhcyBzb29uIGFzIHdlICpkbyogZ2V0IHNvbWV0aGluZyBpbnRvIHRoZSBidWZmZXIuXG4gIGlmIChzdGF0ZS5sZW5ndGggPT09IDAgJiYgIXN0YXRlLmVuZGVkKVxuICAgIHN0YXRlLm5lZWRSZWFkYWJsZSA9IHRydWU7XG5cbiAgLy8gSWYgd2UgdHJpZWQgdG8gcmVhZCgpIHBhc3QgdGhlIEVPRiwgdGhlbiBlbWl0IGVuZCBvbiB0aGUgbmV4dCB0aWNrLlxuICBpZiAobk9yaWcgIT09IG4gJiYgc3RhdGUuZW5kZWQgJiYgc3RhdGUubGVuZ3RoID09PSAwKVxuICAgIGVuZFJlYWRhYmxlKHRoaXMpO1xuXG4gIGlmIChyZXQgIT09IG51bGwpXG4gICAgdGhpcy5lbWl0KCdkYXRhJywgcmV0KTtcblxuICByZXR1cm4gcmV0O1xufTtcblxuZnVuY3Rpb24gY2h1bmtJbnZhbGlkKHN0YXRlLCBjaHVuaykge1xuICB2YXIgZXIgPSBudWxsO1xuICBpZiAoIShCdWZmZXIuaXNCdWZmZXIoY2h1bmspKSAmJlxuICAgICAgdHlwZW9mIGNodW5rICE9PSAnc3RyaW5nJyAmJlxuICAgICAgY2h1bmsgIT09IG51bGwgJiZcbiAgICAgIGNodW5rICE9PSB1bmRlZmluZWQgJiZcbiAgICAgICFzdGF0ZS5vYmplY3RNb2RlKSB7XG4gICAgZXIgPSBuZXcgVHlwZUVycm9yKCdJbnZhbGlkIG5vbi1zdHJpbmcvYnVmZmVyIGNodW5rJyk7XG4gIH1cbiAgcmV0dXJuIGVyO1xufVxuXG5cbmZ1bmN0aW9uIG9uRW9mQ2h1bmsoc3RyZWFtLCBzdGF0ZSkge1xuICBpZiAoc3RhdGUuZW5kZWQpIHJldHVybjtcbiAgaWYgKHN0YXRlLmRlY29kZXIpIHtcbiAgICB2YXIgY2h1bmsgPSBzdGF0ZS5kZWNvZGVyLmVuZCgpO1xuICAgIGlmIChjaHVuayAmJiBjaHVuay5sZW5ndGgpIHtcbiAgICAgIHN0YXRlLmJ1ZmZlci5wdXNoKGNodW5rKTtcbiAgICAgIHN0YXRlLmxlbmd0aCArPSBzdGF0ZS5vYmplY3RNb2RlID8gMSA6IGNodW5rLmxlbmd0aDtcbiAgICB9XG4gIH1cbiAgc3RhdGUuZW5kZWQgPSB0cnVlO1xuXG4gIC8vIGVtaXQgJ3JlYWRhYmxlJyBub3cgdG8gbWFrZSBzdXJlIGl0IGdldHMgcGlja2VkIHVwLlxuICBlbWl0UmVhZGFibGUoc3RyZWFtKTtcbn1cblxuLy8gRG9uJ3QgZW1pdCByZWFkYWJsZSByaWdodCBhd2F5IGluIHN5bmMgbW9kZSwgYmVjYXVzZSB0aGlzIGNhbiB0cmlnZ2VyXG4vLyBhbm90aGVyIHJlYWQoKSBjYWxsID0+IHN0YWNrIG92ZXJmbG93LiAgVGhpcyB3YXksIGl0IG1pZ2h0IHRyaWdnZXJcbi8vIGEgbmV4dFRpY2sgcmVjdXJzaW9uIHdhcm5pbmcsIGJ1dCB0aGF0J3Mgbm90IHNvIGJhZC5cbmZ1bmN0aW9uIGVtaXRSZWFkYWJsZShzdHJlYW0pIHtcbiAgdmFyIHN0YXRlID0gc3RyZWFtLl9yZWFkYWJsZVN0YXRlO1xuICBzdGF0ZS5uZWVkUmVhZGFibGUgPSBmYWxzZTtcbiAgaWYgKCFzdGF0ZS5lbWl0dGVkUmVhZGFibGUpIHtcbiAgICBkZWJ1ZygnZW1pdFJlYWRhYmxlJywgc3RhdGUuZmxvd2luZyk7XG4gICAgc3RhdGUuZW1pdHRlZFJlYWRhYmxlID0gdHJ1ZTtcbiAgICBpZiAoc3RhdGUuc3luYylcbiAgICAgIHByb2Nlc3NOZXh0VGljayhlbWl0UmVhZGFibGVfLCBzdHJlYW0pO1xuICAgIGVsc2VcbiAgICAgIGVtaXRSZWFkYWJsZV8oc3RyZWFtKTtcbiAgfVxufVxuXG5mdW5jdGlvbiBlbWl0UmVhZGFibGVfKHN0cmVhbSkge1xuICBkZWJ1ZygnZW1pdCByZWFkYWJsZScpO1xuICBzdHJlYW0uZW1pdCgncmVhZGFibGUnKTtcbiAgZmxvdyhzdHJlYW0pO1xufVxuXG5cbi8vIGF0IHRoaXMgcG9pbnQsIHRoZSB1c2VyIGhhcyBwcmVzdW1hYmx5IHNlZW4gdGhlICdyZWFkYWJsZScgZXZlbnQsXG4vLyBhbmQgY2FsbGVkIHJlYWQoKSB0byBjb25zdW1lIHNvbWUgZGF0YS4gIHRoYXQgbWF5IGhhdmUgdHJpZ2dlcmVkXG4vLyBpbiB0dXJuIGFub3RoZXIgX3JlYWQobikgY2FsbCwgaW4gd2hpY2ggY2FzZSByZWFkaW5nID0gdHJ1ZSBpZlxuLy8gaXQncyBpbiBwcm9ncmVzcy5cbi8vIEhvd2V2ZXIsIGlmIHdlJ3JlIG5vdCBlbmRlZCwgb3IgcmVhZGluZywgYW5kIHRoZSBsZW5ndGggPCBod20sXG4vLyB0aGVuIGdvIGFoZWFkIGFuZCB0cnkgdG8gcmVhZCBzb21lIG1vcmUgcHJlZW1wdGl2ZWx5LlxuZnVuY3Rpb24gbWF5YmVSZWFkTW9yZShzdHJlYW0sIHN0YXRlKSB7XG4gIGlmICghc3RhdGUucmVhZGluZ01vcmUpIHtcbiAgICBzdGF0ZS5yZWFkaW5nTW9yZSA9IHRydWU7XG4gICAgcHJvY2Vzc05leHRUaWNrKG1heWJlUmVhZE1vcmVfLCBzdHJlYW0sIHN0YXRlKTtcbiAgfVxufVxuXG5mdW5jdGlvbiBtYXliZVJlYWRNb3JlXyhzdHJlYW0sIHN0YXRlKSB7XG4gIHZhciBsZW4gPSBzdGF0ZS5sZW5ndGg7XG4gIHdoaWxlICghc3RhdGUucmVhZGluZyAmJiAhc3RhdGUuZmxvd2luZyAmJiAhc3RhdGUuZW5kZWQgJiZcbiAgICAgICAgIHN0YXRlLmxlbmd0aCA8IHN0YXRlLmhpZ2hXYXRlck1hcmspIHtcbiAgICBkZWJ1ZygnbWF5YmVSZWFkTW9yZSByZWFkIDAnKTtcbiAgICBzdHJlYW0ucmVhZCgwKTtcbiAgICBpZiAobGVuID09PSBzdGF0ZS5sZW5ndGgpXG4gICAgICAvLyBkaWRuJ3QgZ2V0IGFueSBkYXRhLCBzdG9wIHNwaW5uaW5nLlxuICAgICAgYnJlYWs7XG4gICAgZWxzZVxuICAgICAgbGVuID0gc3RhdGUubGVuZ3RoO1xuICB9XG4gIHN0YXRlLnJlYWRpbmdNb3JlID0gZmFsc2U7XG59XG5cbi8vIGFic3RyYWN0IG1ldGhvZC4gIHRvIGJlIG92ZXJyaWRkZW4gaW4gc3BlY2lmaWMgaW1wbGVtZW50YXRpb24gY2xhc3Nlcy5cbi8vIGNhbGwgY2IoZXIsIGRhdGEpIHdoZXJlIGRhdGEgaXMgPD0gbiBpbiBsZW5ndGguXG4vLyBmb3IgdmlydHVhbCAobm9uLXN0cmluZywgbm9uLWJ1ZmZlcikgc3RyZWFtcywgXCJsZW5ndGhcIiBpcyBzb21ld2hhdFxuLy8gYXJiaXRyYXJ5LCBhbmQgcGVyaGFwcyBub3QgdmVyeSBtZWFuaW5nZnVsLlxuUmVhZGFibGUucHJvdG90eXBlLl9yZWFkID0gZnVuY3Rpb24obikge1xuICB0aGlzLmVtaXQoJ2Vycm9yJywgbmV3IEVycm9yKCdub3QgaW1wbGVtZW50ZWQnKSk7XG59O1xuXG5SZWFkYWJsZS5wcm90b3R5cGUucGlwZSA9IGZ1bmN0aW9uKGRlc3QsIHBpcGVPcHRzKSB7XG4gIHZhciBzcmMgPSB0aGlzO1xuICB2YXIgc3RhdGUgPSB0aGlzLl9yZWFkYWJsZVN0YXRlO1xuXG4gIHN3aXRjaCAoc3RhdGUucGlwZXNDb3VudCkge1xuICAgIGNhc2UgMDpcbiAgICAgIHN0YXRlLnBpcGVzID0gZGVzdDtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgMTpcbiAgICAgIHN0YXRlLnBpcGVzID0gW3N0YXRlLnBpcGVzLCBkZXN0XTtcbiAgICAgIGJyZWFrO1xuICAgIGRlZmF1bHQ6XG4gICAgICBzdGF0ZS5waXBlcy5wdXNoKGRlc3QpO1xuICAgICAgYnJlYWs7XG4gIH1cbiAgc3RhdGUucGlwZXNDb3VudCArPSAxO1xuICBkZWJ1ZygncGlwZSBjb3VudD0lZCBvcHRzPSVqJywgc3RhdGUucGlwZXNDb3VudCwgcGlwZU9wdHMpO1xuXG4gIHZhciBkb0VuZCA9ICghcGlwZU9wdHMgfHwgcGlwZU9wdHMuZW5kICE9PSBmYWxzZSkgJiZcbiAgICAgICAgICAgICAgZGVzdCAhPT0gcHJvY2Vzcy5zdGRvdXQgJiZcbiAgICAgICAgICAgICAgZGVzdCAhPT0gcHJvY2Vzcy5zdGRlcnI7XG5cbiAgdmFyIGVuZEZuID0gZG9FbmQgPyBvbmVuZCA6IGNsZWFudXA7XG4gIGlmIChzdGF0ZS5lbmRFbWl0dGVkKVxuICAgIHByb2Nlc3NOZXh0VGljayhlbmRGbik7XG4gIGVsc2VcbiAgICBzcmMub25jZSgnZW5kJywgZW5kRm4pO1xuXG4gIGRlc3Qub24oJ3VucGlwZScsIG9udW5waXBlKTtcbiAgZnVuY3Rpb24gb251bnBpcGUocmVhZGFibGUpIHtcbiAgICBkZWJ1Zygnb251bnBpcGUnKTtcbiAgICBpZiAocmVhZGFibGUgPT09IHNyYykge1xuICAgICAgY2xlYW51cCgpO1xuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIG9uZW5kKCkge1xuICAgIGRlYnVnKCdvbmVuZCcpO1xuICAgIGRlc3QuZW5kKCk7XG4gIH1cblxuICAvLyB3aGVuIHRoZSBkZXN0IGRyYWlucywgaXQgcmVkdWNlcyB0aGUgYXdhaXREcmFpbiBjb3VudGVyXG4gIC8vIG9uIHRoZSBzb3VyY2UuICBUaGlzIHdvdWxkIGJlIG1vcmUgZWxlZ2FudCB3aXRoIGEgLm9uY2UoKVxuICAvLyBoYW5kbGVyIGluIGZsb3coKSwgYnV0IGFkZGluZyBhbmQgcmVtb3ZpbmcgcmVwZWF0ZWRseSBpc1xuICAvLyB0b28gc2xvdy5cbiAgdmFyIG9uZHJhaW4gPSBwaXBlT25EcmFpbihzcmMpO1xuICBkZXN0Lm9uKCdkcmFpbicsIG9uZHJhaW4pO1xuXG4gIHZhciBjbGVhbmVkVXAgPSBmYWxzZTtcbiAgZnVuY3Rpb24gY2xlYW51cCgpIHtcbiAgICBkZWJ1ZygnY2xlYW51cCcpO1xuICAgIC8vIGNsZWFudXAgZXZlbnQgaGFuZGxlcnMgb25jZSB0aGUgcGlwZSBpcyBicm9rZW5cbiAgICBkZXN0LnJlbW92ZUxpc3RlbmVyKCdjbG9zZScsIG9uY2xvc2UpO1xuICAgIGRlc3QucmVtb3ZlTGlzdGVuZXIoJ2ZpbmlzaCcsIG9uZmluaXNoKTtcbiAgICBkZXN0LnJlbW92ZUxpc3RlbmVyKCdkcmFpbicsIG9uZHJhaW4pO1xuICAgIGRlc3QucmVtb3ZlTGlzdGVuZXIoJ2Vycm9yJywgb25lcnJvcik7XG4gICAgZGVzdC5yZW1vdmVMaXN0ZW5lcigndW5waXBlJywgb251bnBpcGUpO1xuICAgIHNyYy5yZW1vdmVMaXN0ZW5lcignZW5kJywgb25lbmQpO1xuICAgIHNyYy5yZW1vdmVMaXN0ZW5lcignZW5kJywgY2xlYW51cCk7XG4gICAgc3JjLnJlbW92ZUxpc3RlbmVyKCdkYXRhJywgb25kYXRhKTtcblxuICAgIGNsZWFuZWRVcCA9IHRydWU7XG5cbiAgICAvLyBpZiB0aGUgcmVhZGVyIGlzIHdhaXRpbmcgZm9yIGEgZHJhaW4gZXZlbnQgZnJvbSB0aGlzXG4gICAgLy8gc3BlY2lmaWMgd3JpdGVyLCB0aGVuIGl0IHdvdWxkIGNhdXNlIGl0IHRvIG5ldmVyIHN0YXJ0XG4gICAgLy8gZmxvd2luZyBhZ2Fpbi5cbiAgICAvLyBTbywgaWYgdGhpcyBpcyBhd2FpdGluZyBhIGRyYWluLCB0aGVuIHdlIGp1c3QgY2FsbCBpdCBub3cuXG4gICAgLy8gSWYgd2UgZG9uJ3Qga25vdywgdGhlbiBhc3N1bWUgdGhhdCB3ZSBhcmUgd2FpdGluZyBmb3Igb25lLlxuICAgIGlmIChzdGF0ZS5hd2FpdERyYWluICYmXG4gICAgICAgICghZGVzdC5fd3JpdGFibGVTdGF0ZSB8fCBkZXN0Ll93cml0YWJsZVN0YXRlLm5lZWREcmFpbikpXG4gICAgICBvbmRyYWluKCk7XG4gIH1cblxuICBzcmMub24oJ2RhdGEnLCBvbmRhdGEpO1xuICBmdW5jdGlvbiBvbmRhdGEoY2h1bmspIHtcbiAgICBkZWJ1Zygnb25kYXRhJyk7XG4gICAgdmFyIHJldCA9IGRlc3Qud3JpdGUoY2h1bmspO1xuICAgIGlmIChmYWxzZSA9PT0gcmV0KSB7XG4gICAgICAvLyBJZiB0aGUgdXNlciB1bnBpcGVkIGR1cmluZyBgZGVzdC53cml0ZSgpYCwgaXQgaXMgcG9zc2libGVcbiAgICAgIC8vIHRvIGdldCBzdHVjayBpbiBhIHBlcm1hbmVudGx5IHBhdXNlZCBzdGF0ZSBpZiB0aGF0IHdyaXRlXG4gICAgICAvLyBhbHNvIHJldHVybmVkIGZhbHNlLlxuICAgICAgaWYgKHN0YXRlLnBpcGVzQ291bnQgPT09IDEgJiZcbiAgICAgICAgICBzdGF0ZS5waXBlc1swXSA9PT0gZGVzdCAmJlxuICAgICAgICAgIHNyYy5saXN0ZW5lckNvdW50KCdkYXRhJykgPT09IDEgJiZcbiAgICAgICAgICAhY2xlYW5lZFVwKSB7XG4gICAgICAgIGRlYnVnKCdmYWxzZSB3cml0ZSByZXNwb25zZSwgcGF1c2UnLCBzcmMuX3JlYWRhYmxlU3RhdGUuYXdhaXREcmFpbik7XG4gICAgICAgIHNyYy5fcmVhZGFibGVTdGF0ZS5hd2FpdERyYWluKys7XG4gICAgICB9XG4gICAgICBzcmMucGF1c2UoKTtcbiAgICB9XG4gIH1cblxuICAvLyBpZiB0aGUgZGVzdCBoYXMgYW4gZXJyb3IsIHRoZW4gc3RvcCBwaXBpbmcgaW50byBpdC5cbiAgLy8gaG93ZXZlciwgZG9uJ3Qgc3VwcHJlc3MgdGhlIHRocm93aW5nIGJlaGF2aW9yIGZvciB0aGlzLlxuICBmdW5jdGlvbiBvbmVycm9yKGVyKSB7XG4gICAgZGVidWcoJ29uZXJyb3InLCBlcik7XG4gICAgdW5waXBlKCk7XG4gICAgZGVzdC5yZW1vdmVMaXN0ZW5lcignZXJyb3InLCBvbmVycm9yKTtcbiAgICBpZiAoRUVsaXN0ZW5lckNvdW50KGRlc3QsICdlcnJvcicpID09PSAwKVxuICAgICAgZGVzdC5lbWl0KCdlcnJvcicsIGVyKTtcbiAgfVxuICAvLyBUaGlzIGlzIGEgYnJ1dGFsbHkgdWdseSBoYWNrIHRvIG1ha2Ugc3VyZSB0aGF0IG91ciBlcnJvciBoYW5kbGVyXG4gIC8vIGlzIGF0dGFjaGVkIGJlZm9yZSBhbnkgdXNlcmxhbmQgb25lcy4gIE5FVkVSIERPIFRISVMuXG4gIGlmICghZGVzdC5fZXZlbnRzIHx8ICFkZXN0Ll9ldmVudHMuZXJyb3IpXG4gICAgZGVzdC5vbignZXJyb3InLCBvbmVycm9yKTtcbiAgZWxzZSBpZiAoaXNBcnJheShkZXN0Ll9ldmVudHMuZXJyb3IpKVxuICAgIGRlc3QuX2V2ZW50cy5lcnJvci51bnNoaWZ0KG9uZXJyb3IpO1xuICBlbHNlXG4gICAgZGVzdC5fZXZlbnRzLmVycm9yID0gW29uZXJyb3IsIGRlc3QuX2V2ZW50cy5lcnJvcl07XG5cblxuICAvLyBCb3RoIGNsb3NlIGFuZCBmaW5pc2ggc2hvdWxkIHRyaWdnZXIgdW5waXBlLCBidXQgb25seSBvbmNlLlxuICBmdW5jdGlvbiBvbmNsb3NlKCkge1xuICAgIGRlc3QucmVtb3ZlTGlzdGVuZXIoJ2ZpbmlzaCcsIG9uZmluaXNoKTtcbiAgICB1bnBpcGUoKTtcbiAgfVxuICBkZXN0Lm9uY2UoJ2Nsb3NlJywgb25jbG9zZSk7XG4gIGZ1bmN0aW9uIG9uZmluaXNoKCkge1xuICAgIGRlYnVnKCdvbmZpbmlzaCcpO1xuICAgIGRlc3QucmVtb3ZlTGlzdGVuZXIoJ2Nsb3NlJywgb25jbG9zZSk7XG4gICAgdW5waXBlKCk7XG4gIH1cbiAgZGVzdC5vbmNlKCdmaW5pc2gnLCBvbmZpbmlzaCk7XG5cbiAgZnVuY3Rpb24gdW5waXBlKCkge1xuICAgIGRlYnVnKCd1bnBpcGUnKTtcbiAgICBzcmMudW5waXBlKGRlc3QpO1xuICB9XG5cbiAgLy8gdGVsbCB0aGUgZGVzdCB0aGF0IGl0J3MgYmVpbmcgcGlwZWQgdG9cbiAgZGVzdC5lbWl0KCdwaXBlJywgc3JjKTtcblxuICAvLyBzdGFydCB0aGUgZmxvdyBpZiBpdCBoYXNuJ3QgYmVlbiBzdGFydGVkIGFscmVhZHkuXG4gIGlmICghc3RhdGUuZmxvd2luZykge1xuICAgIGRlYnVnKCdwaXBlIHJlc3VtZScpO1xuICAgIHNyYy5yZXN1bWUoKTtcbiAgfVxuXG4gIHJldHVybiBkZXN0O1xufTtcblxuZnVuY3Rpb24gcGlwZU9uRHJhaW4oc3JjKSB7XG4gIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICB2YXIgc3RhdGUgPSBzcmMuX3JlYWRhYmxlU3RhdGU7XG4gICAgZGVidWcoJ3BpcGVPbkRyYWluJywgc3RhdGUuYXdhaXREcmFpbik7XG4gICAgaWYgKHN0YXRlLmF3YWl0RHJhaW4pXG4gICAgICBzdGF0ZS5hd2FpdERyYWluLS07XG4gICAgaWYgKHN0YXRlLmF3YWl0RHJhaW4gPT09IDAgJiYgRUVsaXN0ZW5lckNvdW50KHNyYywgJ2RhdGEnKSkge1xuICAgICAgc3RhdGUuZmxvd2luZyA9IHRydWU7XG4gICAgICBmbG93KHNyYyk7XG4gICAgfVxuICB9O1xufVxuXG5cblJlYWRhYmxlLnByb3RvdHlwZS51bnBpcGUgPSBmdW5jdGlvbihkZXN0KSB7XG4gIHZhciBzdGF0ZSA9IHRoaXMuX3JlYWRhYmxlU3RhdGU7XG5cbiAgLy8gaWYgd2UncmUgbm90IHBpcGluZyBhbnl3aGVyZSwgdGhlbiBkbyBub3RoaW5nLlxuICBpZiAoc3RhdGUucGlwZXNDb3VudCA9PT0gMClcbiAgICByZXR1cm4gdGhpcztcblxuICAvLyBqdXN0IG9uZSBkZXN0aW5hdGlvbi4gIG1vc3QgY29tbW9uIGNhc2UuXG4gIGlmIChzdGF0ZS5waXBlc0NvdW50ID09PSAxKSB7XG4gICAgLy8gcGFzc2VkIGluIG9uZSwgYnV0IGl0J3Mgbm90IHRoZSByaWdodCBvbmUuXG4gICAgaWYgKGRlc3QgJiYgZGVzdCAhPT0gc3RhdGUucGlwZXMpXG4gICAgICByZXR1cm4gdGhpcztcblxuICAgIGlmICghZGVzdClcbiAgICAgIGRlc3QgPSBzdGF0ZS5waXBlcztcblxuICAgIC8vIGdvdCBhIG1hdGNoLlxuICAgIHN0YXRlLnBpcGVzID0gbnVsbDtcbiAgICBzdGF0ZS5waXBlc0NvdW50ID0gMDtcbiAgICBzdGF0ZS5mbG93aW5nID0gZmFsc2U7XG4gICAgaWYgKGRlc3QpXG4gICAgICBkZXN0LmVtaXQoJ3VucGlwZScsIHRoaXMpO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgLy8gc2xvdyBjYXNlLiBtdWx0aXBsZSBwaXBlIGRlc3RpbmF0aW9ucy5cblxuICBpZiAoIWRlc3QpIHtcbiAgICAvLyByZW1vdmUgYWxsLlxuICAgIHZhciBkZXN0cyA9IHN0YXRlLnBpcGVzO1xuICAgIHZhciBsZW4gPSBzdGF0ZS5waXBlc0NvdW50O1xuICAgIHN0YXRlLnBpcGVzID0gbnVsbDtcbiAgICBzdGF0ZS5waXBlc0NvdW50ID0gMDtcbiAgICBzdGF0ZS5mbG93aW5nID0gZmFsc2U7XG5cbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbjsgaSsrKVxuICAgICAgZGVzdHNbaV0uZW1pdCgndW5waXBlJywgdGhpcyk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICAvLyB0cnkgdG8gZmluZCB0aGUgcmlnaHQgb25lLlxuICB2YXIgaSA9IGluZGV4T2Yoc3RhdGUucGlwZXMsIGRlc3QpO1xuICBpZiAoaSA9PT0gLTEpXG4gICAgcmV0dXJuIHRoaXM7XG5cbiAgc3RhdGUucGlwZXMuc3BsaWNlKGksIDEpO1xuICBzdGF0ZS5waXBlc0NvdW50IC09IDE7XG4gIGlmIChzdGF0ZS5waXBlc0NvdW50ID09PSAxKVxuICAgIHN0YXRlLnBpcGVzID0gc3RhdGUucGlwZXNbMF07XG5cbiAgZGVzdC5lbWl0KCd1bnBpcGUnLCB0aGlzKTtcblxuICByZXR1cm4gdGhpcztcbn07XG5cbi8vIHNldCB1cCBkYXRhIGV2ZW50cyBpZiB0aGV5IGFyZSBhc2tlZCBmb3Jcbi8vIEVuc3VyZSByZWFkYWJsZSBsaXN0ZW5lcnMgZXZlbnR1YWxseSBnZXQgc29tZXRoaW5nXG5SZWFkYWJsZS5wcm90b3R5cGUub24gPSBmdW5jdGlvbihldiwgZm4pIHtcbiAgdmFyIHJlcyA9IFN0cmVhbS5wcm90b3R5cGUub24uY2FsbCh0aGlzLCBldiwgZm4pO1xuXG4gIC8vIElmIGxpc3RlbmluZyB0byBkYXRhLCBhbmQgaXQgaGFzIG5vdCBleHBsaWNpdGx5IGJlZW4gcGF1c2VkLFxuICAvLyB0aGVuIGNhbGwgcmVzdW1lIHRvIHN0YXJ0IHRoZSBmbG93IG9mIGRhdGEgb24gdGhlIG5leHQgdGljay5cbiAgaWYgKGV2ID09PSAnZGF0YScgJiYgZmFsc2UgIT09IHRoaXMuX3JlYWRhYmxlU3RhdGUuZmxvd2luZykge1xuICAgIHRoaXMucmVzdW1lKCk7XG4gIH1cblxuICBpZiAoZXYgPT09ICdyZWFkYWJsZScgJiYgdGhpcy5yZWFkYWJsZSkge1xuICAgIHZhciBzdGF0ZSA9IHRoaXMuX3JlYWRhYmxlU3RhdGU7XG4gICAgaWYgKCFzdGF0ZS5yZWFkYWJsZUxpc3RlbmluZykge1xuICAgICAgc3RhdGUucmVhZGFibGVMaXN0ZW5pbmcgPSB0cnVlO1xuICAgICAgc3RhdGUuZW1pdHRlZFJlYWRhYmxlID0gZmFsc2U7XG4gICAgICBzdGF0ZS5uZWVkUmVhZGFibGUgPSB0cnVlO1xuICAgICAgaWYgKCFzdGF0ZS5yZWFkaW5nKSB7XG4gICAgICAgIHByb2Nlc3NOZXh0VGljayhuUmVhZGluZ05leHRUaWNrLCB0aGlzKTtcbiAgICAgIH0gZWxzZSBpZiAoc3RhdGUubGVuZ3RoKSB7XG4gICAgICAgIGVtaXRSZWFkYWJsZSh0aGlzLCBzdGF0ZSk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHJlcztcbn07XG5SZWFkYWJsZS5wcm90b3R5cGUuYWRkTGlzdGVuZXIgPSBSZWFkYWJsZS5wcm90b3R5cGUub247XG5cbmZ1bmN0aW9uIG5SZWFkaW5nTmV4dFRpY2soc2VsZikge1xuICBkZWJ1ZygncmVhZGFibGUgbmV4dHRpY2sgcmVhZCAwJyk7XG4gIHNlbGYucmVhZCgwKTtcbn1cblxuLy8gcGF1c2UoKSBhbmQgcmVzdW1lKCkgYXJlIHJlbW5hbnRzIG9mIHRoZSBsZWdhY3kgcmVhZGFibGUgc3RyZWFtIEFQSVxuLy8gSWYgdGhlIHVzZXIgdXNlcyB0aGVtLCB0aGVuIHN3aXRjaCBpbnRvIG9sZCBtb2RlLlxuUmVhZGFibGUucHJvdG90eXBlLnJlc3VtZSA9IGZ1bmN0aW9uKCkge1xuICB2YXIgc3RhdGUgPSB0aGlzLl9yZWFkYWJsZVN0YXRlO1xuICBpZiAoIXN0YXRlLmZsb3dpbmcpIHtcbiAgICBkZWJ1ZygncmVzdW1lJyk7XG4gICAgc3RhdGUuZmxvd2luZyA9IHRydWU7XG4gICAgcmVzdW1lKHRoaXMsIHN0YXRlKTtcbiAgfVxuICByZXR1cm4gdGhpcztcbn07XG5cbmZ1bmN0aW9uIHJlc3VtZShzdHJlYW0sIHN0YXRlKSB7XG4gIGlmICghc3RhdGUucmVzdW1lU2NoZWR1bGVkKSB7XG4gICAgc3RhdGUucmVzdW1lU2NoZWR1bGVkID0gdHJ1ZTtcbiAgICBwcm9jZXNzTmV4dFRpY2socmVzdW1lXywgc3RyZWFtLCBzdGF0ZSk7XG4gIH1cbn1cblxuZnVuY3Rpb24gcmVzdW1lXyhzdHJlYW0sIHN0YXRlKSB7XG4gIGlmICghc3RhdGUucmVhZGluZykge1xuICAgIGRlYnVnKCdyZXN1bWUgcmVhZCAwJyk7XG4gICAgc3RyZWFtLnJlYWQoMCk7XG4gIH1cblxuICBzdGF0ZS5yZXN1bWVTY2hlZHVsZWQgPSBmYWxzZTtcbiAgc3RyZWFtLmVtaXQoJ3Jlc3VtZScpO1xuICBmbG93KHN0cmVhbSk7XG4gIGlmIChzdGF0ZS5mbG93aW5nICYmICFzdGF0ZS5yZWFkaW5nKVxuICAgIHN0cmVhbS5yZWFkKDApO1xufVxuXG5SZWFkYWJsZS5wcm90b3R5cGUucGF1c2UgPSBmdW5jdGlvbigpIHtcbiAgZGVidWcoJ2NhbGwgcGF1c2UgZmxvd2luZz0laicsIHRoaXMuX3JlYWRhYmxlU3RhdGUuZmxvd2luZyk7XG4gIGlmIChmYWxzZSAhPT0gdGhpcy5fcmVhZGFibGVTdGF0ZS5mbG93aW5nKSB7XG4gICAgZGVidWcoJ3BhdXNlJyk7XG4gICAgdGhpcy5fcmVhZGFibGVTdGF0ZS5mbG93aW5nID0gZmFsc2U7XG4gICAgdGhpcy5lbWl0KCdwYXVzZScpO1xuICB9XG4gIHJldHVybiB0aGlzO1xufTtcblxuZnVuY3Rpb24gZmxvdyhzdHJlYW0pIHtcbiAgdmFyIHN0YXRlID0gc3RyZWFtLl9yZWFkYWJsZVN0YXRlO1xuICBkZWJ1ZygnZmxvdycsIHN0YXRlLmZsb3dpbmcpO1xuICBpZiAoc3RhdGUuZmxvd2luZykge1xuICAgIGRvIHtcbiAgICAgIHZhciBjaHVuayA9IHN0cmVhbS5yZWFkKCk7XG4gICAgfSB3aGlsZSAobnVsbCAhPT0gY2h1bmsgJiYgc3RhdGUuZmxvd2luZyk7XG4gIH1cbn1cblxuLy8gd3JhcCBhbiBvbGQtc3R5bGUgc3RyZWFtIGFzIHRoZSBhc3luYyBkYXRhIHNvdXJjZS5cbi8vIFRoaXMgaXMgKm5vdCogcGFydCBvZiB0aGUgcmVhZGFibGUgc3RyZWFtIGludGVyZmFjZS5cbi8vIEl0IGlzIGFuIHVnbHkgdW5mb3J0dW5hdGUgbWVzcyBvZiBoaXN0b3J5LlxuUmVhZGFibGUucHJvdG90eXBlLndyYXAgPSBmdW5jdGlvbihzdHJlYW0pIHtcbiAgdmFyIHN0YXRlID0gdGhpcy5fcmVhZGFibGVTdGF0ZTtcbiAgdmFyIHBhdXNlZCA9IGZhbHNlO1xuXG4gIHZhciBzZWxmID0gdGhpcztcbiAgc3RyZWFtLm9uKCdlbmQnLCBmdW5jdGlvbigpIHtcbiAgICBkZWJ1Zygnd3JhcHBlZCBlbmQnKTtcbiAgICBpZiAoc3RhdGUuZGVjb2RlciAmJiAhc3RhdGUuZW5kZWQpIHtcbiAgICAgIHZhciBjaHVuayA9IHN0YXRlLmRlY29kZXIuZW5kKCk7XG4gICAgICBpZiAoY2h1bmsgJiYgY2h1bmsubGVuZ3RoKVxuICAgICAgICBzZWxmLnB1c2goY2h1bmspO1xuICAgIH1cblxuICAgIHNlbGYucHVzaChudWxsKTtcbiAgfSk7XG5cbiAgc3RyZWFtLm9uKCdkYXRhJywgZnVuY3Rpb24oY2h1bmspIHtcbiAgICBkZWJ1Zygnd3JhcHBlZCBkYXRhJyk7XG4gICAgaWYgKHN0YXRlLmRlY29kZXIpXG4gICAgICBjaHVuayA9IHN0YXRlLmRlY29kZXIud3JpdGUoY2h1bmspO1xuXG4gICAgLy8gZG9uJ3Qgc2tpcCBvdmVyIGZhbHN5IHZhbHVlcyBpbiBvYmplY3RNb2RlXG4gICAgaWYgKHN0YXRlLm9iamVjdE1vZGUgJiYgKGNodW5rID09PSBudWxsIHx8IGNodW5rID09PSB1bmRlZmluZWQpKVxuICAgICAgcmV0dXJuO1xuICAgIGVsc2UgaWYgKCFzdGF0ZS5vYmplY3RNb2RlICYmICghY2h1bmsgfHwgIWNodW5rLmxlbmd0aCkpXG4gICAgICByZXR1cm47XG5cbiAgICB2YXIgcmV0ID0gc2VsZi5wdXNoKGNodW5rKTtcbiAgICBpZiAoIXJldCkge1xuICAgICAgcGF1c2VkID0gdHJ1ZTtcbiAgICAgIHN0cmVhbS5wYXVzZSgpO1xuICAgIH1cbiAgfSk7XG5cbiAgLy8gcHJveHkgYWxsIHRoZSBvdGhlciBtZXRob2RzLlxuICAvLyBpbXBvcnRhbnQgd2hlbiB3cmFwcGluZyBmaWx0ZXJzIGFuZCBkdXBsZXhlcy5cbiAgZm9yICh2YXIgaSBpbiBzdHJlYW0pIHtcbiAgICBpZiAodGhpc1tpXSA9PT0gdW5kZWZpbmVkICYmIHR5cGVvZiBzdHJlYW1baV0gPT09ICdmdW5jdGlvbicpIHtcbiAgICAgIHRoaXNbaV0gPSBmdW5jdGlvbihtZXRob2QpIHsgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gc3RyZWFtW21ldGhvZF0uYXBwbHkoc3RyZWFtLCBhcmd1bWVudHMpO1xuICAgICAgfTsgfShpKTtcbiAgICB9XG4gIH1cblxuICAvLyBwcm94eSBjZXJ0YWluIGltcG9ydGFudCBldmVudHMuXG4gIHZhciBldmVudHMgPSBbJ2Vycm9yJywgJ2Nsb3NlJywgJ2Rlc3Ryb3knLCAncGF1c2UnLCAncmVzdW1lJ107XG4gIGZvckVhY2goZXZlbnRzLCBmdW5jdGlvbihldikge1xuICAgIHN0cmVhbS5vbihldiwgc2VsZi5lbWl0LmJpbmQoc2VsZiwgZXYpKTtcbiAgfSk7XG5cbiAgLy8gd2hlbiB3ZSB0cnkgdG8gY29uc3VtZSBzb21lIG1vcmUgYnl0ZXMsIHNpbXBseSB1bnBhdXNlIHRoZVxuICAvLyB1bmRlcmx5aW5nIHN0cmVhbS5cbiAgc2VsZi5fcmVhZCA9IGZ1bmN0aW9uKG4pIHtcbiAgICBkZWJ1Zygnd3JhcHBlZCBfcmVhZCcsIG4pO1xuICAgIGlmIChwYXVzZWQpIHtcbiAgICAgIHBhdXNlZCA9IGZhbHNlO1xuICAgICAgc3RyZWFtLnJlc3VtZSgpO1xuICAgIH1cbiAgfTtcblxuICByZXR1cm4gc2VsZjtcbn07XG5cblxuLy8gZXhwb3NlZCBmb3IgdGVzdGluZyBwdXJwb3NlcyBvbmx5LlxuUmVhZGFibGUuX2Zyb21MaXN0ID0gZnJvbUxpc3Q7XG5cbi8vIFBsdWNrIG9mZiBuIGJ5dGVzIGZyb20gYW4gYXJyYXkgb2YgYnVmZmVycy5cbi8vIExlbmd0aCBpcyB0aGUgY29tYmluZWQgbGVuZ3RocyBvZiBhbGwgdGhlIGJ1ZmZlcnMgaW4gdGhlIGxpc3QuXG5mdW5jdGlvbiBmcm9tTGlzdChuLCBzdGF0ZSkge1xuICB2YXIgbGlzdCA9IHN0YXRlLmJ1ZmZlcjtcbiAgdmFyIGxlbmd0aCA9IHN0YXRlLmxlbmd0aDtcbiAgdmFyIHN0cmluZ01vZGUgPSAhIXN0YXRlLmRlY29kZXI7XG4gIHZhciBvYmplY3RNb2RlID0gISFzdGF0ZS5vYmplY3RNb2RlO1xuICB2YXIgcmV0O1xuXG4gIC8vIG5vdGhpbmcgaW4gdGhlIGxpc3QsIGRlZmluaXRlbHkgZW1wdHkuXG4gIGlmIChsaXN0Lmxlbmd0aCA9PT0gMClcbiAgICByZXR1cm4gbnVsbDtcblxuICBpZiAobGVuZ3RoID09PSAwKVxuICAgIHJldCA9IG51bGw7XG4gIGVsc2UgaWYgKG9iamVjdE1vZGUpXG4gICAgcmV0ID0gbGlzdC5zaGlmdCgpO1xuICBlbHNlIGlmICghbiB8fCBuID49IGxlbmd0aCkge1xuICAgIC8vIHJlYWQgaXQgYWxsLCB0cnVuY2F0ZSB0aGUgYXJyYXkuXG4gICAgaWYgKHN0cmluZ01vZGUpXG4gICAgICByZXQgPSBsaXN0LmpvaW4oJycpO1xuICAgIGVsc2UgaWYgKGxpc3QubGVuZ3RoID09PSAxKVxuICAgICAgcmV0ID0gbGlzdFswXTtcbiAgICBlbHNlXG4gICAgICByZXQgPSBCdWZmZXIuY29uY2F0KGxpc3QsIGxlbmd0aCk7XG4gICAgbGlzdC5sZW5ndGggPSAwO1xuICB9IGVsc2Uge1xuICAgIC8vIHJlYWQganVzdCBzb21lIG9mIGl0LlxuICAgIGlmIChuIDwgbGlzdFswXS5sZW5ndGgpIHtcbiAgICAgIC8vIGp1c3QgdGFrZSBhIHBhcnQgb2YgdGhlIGZpcnN0IGxpc3QgaXRlbS5cbiAgICAgIC8vIHNsaWNlIGlzIHRoZSBzYW1lIGZvciBidWZmZXJzIGFuZCBzdHJpbmdzLlxuICAgICAgdmFyIGJ1ZiA9IGxpc3RbMF07XG4gICAgICByZXQgPSBidWYuc2xpY2UoMCwgbik7XG4gICAgICBsaXN0WzBdID0gYnVmLnNsaWNlKG4pO1xuICAgIH0gZWxzZSBpZiAobiA9PT0gbGlzdFswXS5sZW5ndGgpIHtcbiAgICAgIC8vIGZpcnN0IGxpc3QgaXMgYSBwZXJmZWN0IG1hdGNoXG4gICAgICByZXQgPSBsaXN0LnNoaWZ0KCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIGNvbXBsZXggY2FzZS5cbiAgICAgIC8vIHdlIGhhdmUgZW5vdWdoIHRvIGNvdmVyIGl0LCBidXQgaXQgc3BhbnMgcGFzdCB0aGUgZmlyc3QgYnVmZmVyLlxuICAgICAgaWYgKHN0cmluZ01vZGUpXG4gICAgICAgIHJldCA9ICcnO1xuICAgICAgZWxzZVxuICAgICAgICByZXQgPSBuZXcgQnVmZmVyKG4pO1xuXG4gICAgICB2YXIgYyA9IDA7XG4gICAgICBmb3IgKHZhciBpID0gMCwgbCA9IGxpc3QubGVuZ3RoOyBpIDwgbCAmJiBjIDwgbjsgaSsrKSB7XG4gICAgICAgIHZhciBidWYgPSBsaXN0WzBdO1xuICAgICAgICB2YXIgY3B5ID0gTWF0aC5taW4obiAtIGMsIGJ1Zi5sZW5ndGgpO1xuXG4gICAgICAgIGlmIChzdHJpbmdNb2RlKVxuICAgICAgICAgIHJldCArPSBidWYuc2xpY2UoMCwgY3B5KTtcbiAgICAgICAgZWxzZVxuICAgICAgICAgIGJ1Zi5jb3B5KHJldCwgYywgMCwgY3B5KTtcblxuICAgICAgICBpZiAoY3B5IDwgYnVmLmxlbmd0aClcbiAgICAgICAgICBsaXN0WzBdID0gYnVmLnNsaWNlKGNweSk7XG4gICAgICAgIGVsc2VcbiAgICAgICAgICBsaXN0LnNoaWZ0KCk7XG5cbiAgICAgICAgYyArPSBjcHk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHJldDtcbn1cblxuZnVuY3Rpb24gZW5kUmVhZGFibGUoc3RyZWFtKSB7XG4gIHZhciBzdGF0ZSA9IHN0cmVhbS5fcmVhZGFibGVTdGF0ZTtcblxuICAvLyBJZiB3ZSBnZXQgaGVyZSBiZWZvcmUgY29uc3VtaW5nIGFsbCB0aGUgYnl0ZXMsIHRoZW4gdGhhdCBpcyBhXG4gIC8vIGJ1ZyBpbiBub2RlLiAgU2hvdWxkIG5ldmVyIGhhcHBlbi5cbiAgaWYgKHN0YXRlLmxlbmd0aCA+IDApXG4gICAgdGhyb3cgbmV3IEVycm9yKCdlbmRSZWFkYWJsZSBjYWxsZWQgb24gbm9uLWVtcHR5IHN0cmVhbScpO1xuXG4gIGlmICghc3RhdGUuZW5kRW1pdHRlZCkge1xuICAgIHN0YXRlLmVuZGVkID0gdHJ1ZTtcbiAgICBwcm9jZXNzTmV4dFRpY2soZW5kUmVhZGFibGVOVCwgc3RhdGUsIHN0cmVhbSk7XG4gIH1cbn1cblxuZnVuY3Rpb24gZW5kUmVhZGFibGVOVChzdGF0ZSwgc3RyZWFtKSB7XG4gIC8vIENoZWNrIHRoYXQgd2UgZGlkbid0IGdldCBvbmUgbGFzdCB1bnNoaWZ0LlxuICBpZiAoIXN0YXRlLmVuZEVtaXR0ZWQgJiYgc3RhdGUubGVuZ3RoID09PSAwKSB7XG4gICAgc3RhdGUuZW5kRW1pdHRlZCA9IHRydWU7XG4gICAgc3RyZWFtLnJlYWRhYmxlID0gZmFsc2U7XG4gICAgc3RyZWFtLmVtaXQoJ2VuZCcpO1xuICB9XG59XG5cbmZ1bmN0aW9uIGZvckVhY2ggKHhzLCBmKSB7XG4gIGZvciAodmFyIGkgPSAwLCBsID0geHMubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgZih4c1tpXSwgaSk7XG4gIH1cbn1cblxuZnVuY3Rpb24gaW5kZXhPZiAoeHMsIHgpIHtcbiAgZm9yICh2YXIgaSA9IDAsIGwgPSB4cy5sZW5ndGg7IGkgPCBsOyBpKyspIHtcbiAgICBpZiAoeHNbaV0gPT09IHgpIHJldHVybiBpO1xuICB9XG4gIHJldHVybiAtMTtcbn1cbiIsIi8vIGEgdHJhbnNmb3JtIHN0cmVhbSBpcyBhIHJlYWRhYmxlL3dyaXRhYmxlIHN0cmVhbSB3aGVyZSB5b3UgZG9cbi8vIHNvbWV0aGluZyB3aXRoIHRoZSBkYXRhLiAgU29tZXRpbWVzIGl0J3MgY2FsbGVkIGEgXCJmaWx0ZXJcIixcbi8vIGJ1dCB0aGF0J3Mgbm90IGEgZ3JlYXQgbmFtZSBmb3IgaXQsIHNpbmNlIHRoYXQgaW1wbGllcyBhIHRoaW5nIHdoZXJlXG4vLyBzb21lIGJpdHMgcGFzcyB0aHJvdWdoLCBhbmQgb3RoZXJzIGFyZSBzaW1wbHkgaWdub3JlZC4gIChUaGF0IHdvdWxkXG4vLyBiZSBhIHZhbGlkIGV4YW1wbGUgb2YgYSB0cmFuc2Zvcm0sIG9mIGNvdXJzZS4pXG4vL1xuLy8gV2hpbGUgdGhlIG91dHB1dCBpcyBjYXVzYWxseSByZWxhdGVkIHRvIHRoZSBpbnB1dCwgaXQncyBub3QgYVxuLy8gbmVjZXNzYXJpbHkgc3ltbWV0cmljIG9yIHN5bmNocm9ub3VzIHRyYW5zZm9ybWF0aW9uLiAgRm9yIGV4YW1wbGUsXG4vLyBhIHpsaWIgc3RyZWFtIG1pZ2h0IHRha2UgbXVsdGlwbGUgcGxhaW4tdGV4dCB3cml0ZXMoKSwgYW5kIHRoZW5cbi8vIGVtaXQgYSBzaW5nbGUgY29tcHJlc3NlZCBjaHVuayBzb21lIHRpbWUgaW4gdGhlIGZ1dHVyZS5cbi8vXG4vLyBIZXJlJ3MgaG93IHRoaXMgd29ya3M6XG4vL1xuLy8gVGhlIFRyYW5zZm9ybSBzdHJlYW0gaGFzIGFsbCB0aGUgYXNwZWN0cyBvZiB0aGUgcmVhZGFibGUgYW5kIHdyaXRhYmxlXG4vLyBzdHJlYW0gY2xhc3Nlcy4gIFdoZW4geW91IHdyaXRlKGNodW5rKSwgdGhhdCBjYWxscyBfd3JpdGUoY2h1bmssY2IpXG4vLyBpbnRlcm5hbGx5LCBhbmQgcmV0dXJucyBmYWxzZSBpZiB0aGVyZSdzIGEgbG90IG9mIHBlbmRpbmcgd3JpdGVzXG4vLyBidWZmZXJlZCB1cC4gIFdoZW4geW91IGNhbGwgcmVhZCgpLCB0aGF0IGNhbGxzIF9yZWFkKG4pIHVudGlsXG4vLyB0aGVyZSdzIGVub3VnaCBwZW5kaW5nIHJlYWRhYmxlIGRhdGEgYnVmZmVyZWQgdXAuXG4vL1xuLy8gSW4gYSB0cmFuc2Zvcm0gc3RyZWFtLCB0aGUgd3JpdHRlbiBkYXRhIGlzIHBsYWNlZCBpbiBhIGJ1ZmZlci4gIFdoZW5cbi8vIF9yZWFkKG4pIGlzIGNhbGxlZCwgaXQgdHJhbnNmb3JtcyB0aGUgcXVldWVkIHVwIGRhdGEsIGNhbGxpbmcgdGhlXG4vLyBidWZmZXJlZCBfd3JpdGUgY2IncyBhcyBpdCBjb25zdW1lcyBjaHVua3MuICBJZiBjb25zdW1pbmcgYSBzaW5nbGVcbi8vIHdyaXR0ZW4gY2h1bmsgd291bGQgcmVzdWx0IGluIG11bHRpcGxlIG91dHB1dCBjaHVua3MsIHRoZW4gdGhlIGZpcnN0XG4vLyBvdXRwdXR0ZWQgYml0IGNhbGxzIHRoZSByZWFkY2IsIGFuZCBzdWJzZXF1ZW50IGNodW5rcyBqdXN0IGdvIGludG9cbi8vIHRoZSByZWFkIGJ1ZmZlciwgYW5kIHdpbGwgY2F1c2UgaXQgdG8gZW1pdCAncmVhZGFibGUnIGlmIG5lY2Vzc2FyeS5cbi8vXG4vLyBUaGlzIHdheSwgYmFjay1wcmVzc3VyZSBpcyBhY3R1YWxseSBkZXRlcm1pbmVkIGJ5IHRoZSByZWFkaW5nIHNpZGUsXG4vLyBzaW5jZSBfcmVhZCBoYXMgdG8gYmUgY2FsbGVkIHRvIHN0YXJ0IHByb2Nlc3NpbmcgYSBuZXcgY2h1bmsuICBIb3dldmVyLFxuLy8gYSBwYXRob2xvZ2ljYWwgaW5mbGF0ZSB0eXBlIG9mIHRyYW5zZm9ybSBjYW4gY2F1c2UgZXhjZXNzaXZlIGJ1ZmZlcmluZ1xuLy8gaGVyZS4gIEZvciBleGFtcGxlLCBpbWFnaW5lIGEgc3RyZWFtIHdoZXJlIGV2ZXJ5IGJ5dGUgb2YgaW5wdXQgaXNcbi8vIGludGVycHJldGVkIGFzIGFuIGludGVnZXIgZnJvbSAwLTI1NSwgYW5kIHRoZW4gcmVzdWx0cyBpbiB0aGF0IG1hbnlcbi8vIGJ5dGVzIG9mIG91dHB1dC4gIFdyaXRpbmcgdGhlIDQgYnl0ZXMge2ZmLGZmLGZmLGZmfSB3b3VsZCByZXN1bHQgaW5cbi8vIDFrYiBvZiBkYXRhIGJlaW5nIG91dHB1dC4gIEluIHRoaXMgY2FzZSwgeW91IGNvdWxkIHdyaXRlIGEgdmVyeSBzbWFsbFxuLy8gYW1vdW50IG9mIGlucHV0LCBhbmQgZW5kIHVwIHdpdGggYSB2ZXJ5IGxhcmdlIGFtb3VudCBvZiBvdXRwdXQuICBJblxuLy8gc3VjaCBhIHBhdGhvbG9naWNhbCBpbmZsYXRpbmcgbWVjaGFuaXNtLCB0aGVyZSdkIGJlIG5vIHdheSB0byB0ZWxsXG4vLyB0aGUgc3lzdGVtIHRvIHN0b3AgZG9pbmcgdGhlIHRyYW5zZm9ybS4gIEEgc2luZ2xlIDRNQiB3cml0ZSBjb3VsZFxuLy8gY2F1c2UgdGhlIHN5c3RlbSB0byBydW4gb3V0IG9mIG1lbW9yeS5cbi8vXG4vLyBIb3dldmVyLCBldmVuIGluIHN1Y2ggYSBwYXRob2xvZ2ljYWwgY2FzZSwgb25seSBhIHNpbmdsZSB3cml0dGVuIGNodW5rXG4vLyB3b3VsZCBiZSBjb25zdW1lZCwgYW5kIHRoZW4gdGhlIHJlc3Qgd291bGQgd2FpdCAodW4tdHJhbnNmb3JtZWQpIHVudGlsXG4vLyB0aGUgcmVzdWx0cyBvZiB0aGUgcHJldmlvdXMgdHJhbnNmb3JtZWQgY2h1bmsgd2VyZSBjb25zdW1lZC5cblxuJ3VzZSBzdHJpY3QnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFRyYW5zZm9ybTtcblxudmFyIER1cGxleCA9IHJlcXVpcmUoJy4vX3N0cmVhbV9kdXBsZXgnKTtcblxuLyo8cmVwbGFjZW1lbnQ+Ki9cbnZhciB1dGlsID0gcmVxdWlyZSgnY29yZS11dGlsLWlzJyk7XG51dGlsLmluaGVyaXRzID0gcmVxdWlyZSgnaW5oZXJpdHMnKTtcbi8qPC9yZXBsYWNlbWVudD4qL1xuXG51dGlsLmluaGVyaXRzKFRyYW5zZm9ybSwgRHVwbGV4KTtcblxuXG5mdW5jdGlvbiBUcmFuc2Zvcm1TdGF0ZShzdHJlYW0pIHtcbiAgdGhpcy5hZnRlclRyYW5zZm9ybSA9IGZ1bmN0aW9uKGVyLCBkYXRhKSB7XG4gICAgcmV0dXJuIGFmdGVyVHJhbnNmb3JtKHN0cmVhbSwgZXIsIGRhdGEpO1xuICB9O1xuXG4gIHRoaXMubmVlZFRyYW5zZm9ybSA9IGZhbHNlO1xuICB0aGlzLnRyYW5zZm9ybWluZyA9IGZhbHNlO1xuICB0aGlzLndyaXRlY2IgPSBudWxsO1xuICB0aGlzLndyaXRlY2h1bmsgPSBudWxsO1xufVxuXG5mdW5jdGlvbiBhZnRlclRyYW5zZm9ybShzdHJlYW0sIGVyLCBkYXRhKSB7XG4gIHZhciB0cyA9IHN0cmVhbS5fdHJhbnNmb3JtU3RhdGU7XG4gIHRzLnRyYW5zZm9ybWluZyA9IGZhbHNlO1xuXG4gIHZhciBjYiA9IHRzLndyaXRlY2I7XG5cbiAgaWYgKCFjYilcbiAgICByZXR1cm4gc3RyZWFtLmVtaXQoJ2Vycm9yJywgbmV3IEVycm9yKCdubyB3cml0ZWNiIGluIFRyYW5zZm9ybSBjbGFzcycpKTtcblxuICB0cy53cml0ZWNodW5rID0gbnVsbDtcbiAgdHMud3JpdGVjYiA9IG51bGw7XG5cbiAgaWYgKGRhdGEgIT09IG51bGwgJiYgZGF0YSAhPT0gdW5kZWZpbmVkKVxuICAgIHN0cmVhbS5wdXNoKGRhdGEpO1xuXG4gIGlmIChjYilcbiAgICBjYihlcik7XG5cbiAgdmFyIHJzID0gc3RyZWFtLl9yZWFkYWJsZVN0YXRlO1xuICBycy5yZWFkaW5nID0gZmFsc2U7XG4gIGlmIChycy5uZWVkUmVhZGFibGUgfHwgcnMubGVuZ3RoIDwgcnMuaGlnaFdhdGVyTWFyaykge1xuICAgIHN0cmVhbS5fcmVhZChycy5oaWdoV2F0ZXJNYXJrKTtcbiAgfVxufVxuXG5cbmZ1bmN0aW9uIFRyYW5zZm9ybShvcHRpb25zKSB7XG4gIGlmICghKHRoaXMgaW5zdGFuY2VvZiBUcmFuc2Zvcm0pKVxuICAgIHJldHVybiBuZXcgVHJhbnNmb3JtKG9wdGlvbnMpO1xuXG4gIER1cGxleC5jYWxsKHRoaXMsIG9wdGlvbnMpO1xuXG4gIHRoaXMuX3RyYW5zZm9ybVN0YXRlID0gbmV3IFRyYW5zZm9ybVN0YXRlKHRoaXMpO1xuXG4gIC8vIHdoZW4gdGhlIHdyaXRhYmxlIHNpZGUgZmluaXNoZXMsIHRoZW4gZmx1c2ggb3V0IGFueXRoaW5nIHJlbWFpbmluZy5cbiAgdmFyIHN0cmVhbSA9IHRoaXM7XG5cbiAgLy8gc3RhcnQgb3V0IGFza2luZyBmb3IgYSByZWFkYWJsZSBldmVudCBvbmNlIGRhdGEgaXMgdHJhbnNmb3JtZWQuXG4gIHRoaXMuX3JlYWRhYmxlU3RhdGUubmVlZFJlYWRhYmxlID0gdHJ1ZTtcblxuICAvLyB3ZSBoYXZlIGltcGxlbWVudGVkIHRoZSBfcmVhZCBtZXRob2QsIGFuZCBkb25lIHRoZSBvdGhlciB0aGluZ3NcbiAgLy8gdGhhdCBSZWFkYWJsZSB3YW50cyBiZWZvcmUgdGhlIGZpcnN0IF9yZWFkIGNhbGwsIHNvIHVuc2V0IHRoZVxuICAvLyBzeW5jIGd1YXJkIGZsYWcuXG4gIHRoaXMuX3JlYWRhYmxlU3RhdGUuc3luYyA9IGZhbHNlO1xuXG4gIGlmIChvcHRpb25zKSB7XG4gICAgaWYgKHR5cGVvZiBvcHRpb25zLnRyYW5zZm9ybSA9PT0gJ2Z1bmN0aW9uJylcbiAgICAgIHRoaXMuX3RyYW5zZm9ybSA9IG9wdGlvbnMudHJhbnNmb3JtO1xuXG4gICAgaWYgKHR5cGVvZiBvcHRpb25zLmZsdXNoID09PSAnZnVuY3Rpb24nKVxuICAgICAgdGhpcy5fZmx1c2ggPSBvcHRpb25zLmZsdXNoO1xuICB9XG5cbiAgdGhpcy5vbmNlKCdwcmVmaW5pc2gnLCBmdW5jdGlvbigpIHtcbiAgICBpZiAodHlwZW9mIHRoaXMuX2ZsdXNoID09PSAnZnVuY3Rpb24nKVxuICAgICAgdGhpcy5fZmx1c2goZnVuY3Rpb24oZXIpIHtcbiAgICAgICAgZG9uZShzdHJlYW0sIGVyKTtcbiAgICAgIH0pO1xuICAgIGVsc2VcbiAgICAgIGRvbmUoc3RyZWFtKTtcbiAgfSk7XG59XG5cblRyYW5zZm9ybS5wcm90b3R5cGUucHVzaCA9IGZ1bmN0aW9uKGNodW5rLCBlbmNvZGluZykge1xuICB0aGlzLl90cmFuc2Zvcm1TdGF0ZS5uZWVkVHJhbnNmb3JtID0gZmFsc2U7XG4gIHJldHVybiBEdXBsZXgucHJvdG90eXBlLnB1c2guY2FsbCh0aGlzLCBjaHVuaywgZW5jb2RpbmcpO1xufTtcblxuLy8gVGhpcyBpcyB0aGUgcGFydCB3aGVyZSB5b3UgZG8gc3R1ZmYhXG4vLyBvdmVycmlkZSB0aGlzIGZ1bmN0aW9uIGluIGltcGxlbWVudGF0aW9uIGNsYXNzZXMuXG4vLyAnY2h1bmsnIGlzIGFuIGlucHV0IGNodW5rLlxuLy9cbi8vIENhbGwgYHB1c2gobmV3Q2h1bmspYCB0byBwYXNzIGFsb25nIHRyYW5zZm9ybWVkIG91dHB1dFxuLy8gdG8gdGhlIHJlYWRhYmxlIHNpZGUuICBZb3UgbWF5IGNhbGwgJ3B1c2gnIHplcm8gb3IgbW9yZSB0aW1lcy5cbi8vXG4vLyBDYWxsIGBjYihlcnIpYCB3aGVuIHlvdSBhcmUgZG9uZSB3aXRoIHRoaXMgY2h1bmsuICBJZiB5b3UgcGFzc1xuLy8gYW4gZXJyb3IsIHRoZW4gdGhhdCdsbCBwdXQgdGhlIGh1cnQgb24gdGhlIHdob2xlIG9wZXJhdGlvbi4gIElmIHlvdVxuLy8gbmV2ZXIgY2FsbCBjYigpLCB0aGVuIHlvdSdsbCBuZXZlciBnZXQgYW5vdGhlciBjaHVuay5cblRyYW5zZm9ybS5wcm90b3R5cGUuX3RyYW5zZm9ybSA9IGZ1bmN0aW9uKGNodW5rLCBlbmNvZGluZywgY2IpIHtcbiAgdGhyb3cgbmV3IEVycm9yKCdub3QgaW1wbGVtZW50ZWQnKTtcbn07XG5cblRyYW5zZm9ybS5wcm90b3R5cGUuX3dyaXRlID0gZnVuY3Rpb24oY2h1bmssIGVuY29kaW5nLCBjYikge1xuICB2YXIgdHMgPSB0aGlzLl90cmFuc2Zvcm1TdGF0ZTtcbiAgdHMud3JpdGVjYiA9IGNiO1xuICB0cy53cml0ZWNodW5rID0gY2h1bms7XG4gIHRzLndyaXRlZW5jb2RpbmcgPSBlbmNvZGluZztcbiAgaWYgKCF0cy50cmFuc2Zvcm1pbmcpIHtcbiAgICB2YXIgcnMgPSB0aGlzLl9yZWFkYWJsZVN0YXRlO1xuICAgIGlmICh0cy5uZWVkVHJhbnNmb3JtIHx8XG4gICAgICAgIHJzLm5lZWRSZWFkYWJsZSB8fFxuICAgICAgICBycy5sZW5ndGggPCBycy5oaWdoV2F0ZXJNYXJrKVxuICAgICAgdGhpcy5fcmVhZChycy5oaWdoV2F0ZXJNYXJrKTtcbiAgfVxufTtcblxuLy8gRG9lc24ndCBtYXR0ZXIgd2hhdCB0aGUgYXJncyBhcmUgaGVyZS5cbi8vIF90cmFuc2Zvcm0gZG9lcyBhbGwgdGhlIHdvcmsuXG4vLyBUaGF0IHdlIGdvdCBoZXJlIG1lYW5zIHRoYXQgdGhlIHJlYWRhYmxlIHNpZGUgd2FudHMgbW9yZSBkYXRhLlxuVHJhbnNmb3JtLnByb3RvdHlwZS5fcmVhZCA9IGZ1bmN0aW9uKG4pIHtcbiAgdmFyIHRzID0gdGhpcy5fdHJhbnNmb3JtU3RhdGU7XG5cbiAgaWYgKHRzLndyaXRlY2h1bmsgIT09IG51bGwgJiYgdHMud3JpdGVjYiAmJiAhdHMudHJhbnNmb3JtaW5nKSB7XG4gICAgdHMudHJhbnNmb3JtaW5nID0gdHJ1ZTtcbiAgICB0aGlzLl90cmFuc2Zvcm0odHMud3JpdGVjaHVuaywgdHMud3JpdGVlbmNvZGluZywgdHMuYWZ0ZXJUcmFuc2Zvcm0pO1xuICB9IGVsc2Uge1xuICAgIC8vIG1hcmsgdGhhdCB3ZSBuZWVkIGEgdHJhbnNmb3JtLCBzbyB0aGF0IGFueSBkYXRhIHRoYXQgY29tZXMgaW5cbiAgICAvLyB3aWxsIGdldCBwcm9jZXNzZWQsIG5vdyB0aGF0IHdlJ3ZlIGFza2VkIGZvciBpdC5cbiAgICB0cy5uZWVkVHJhbnNmb3JtID0gdHJ1ZTtcbiAgfVxufTtcblxuXG5mdW5jdGlvbiBkb25lKHN0cmVhbSwgZXIpIHtcbiAgaWYgKGVyKVxuICAgIHJldHVybiBzdHJlYW0uZW1pdCgnZXJyb3InLCBlcik7XG5cbiAgLy8gaWYgdGhlcmUncyBub3RoaW5nIGluIHRoZSB3cml0ZSBidWZmZXIsIHRoZW4gdGhhdCBtZWFuc1xuICAvLyB0aGF0IG5vdGhpbmcgbW9yZSB3aWxsIGV2ZXIgYmUgcHJvdmlkZWRcbiAgdmFyIHdzID0gc3RyZWFtLl93cml0YWJsZVN0YXRlO1xuICB2YXIgdHMgPSBzdHJlYW0uX3RyYW5zZm9ybVN0YXRlO1xuXG4gIGlmICh3cy5sZW5ndGgpXG4gICAgdGhyb3cgbmV3IEVycm9yKCdjYWxsaW5nIHRyYW5zZm9ybSBkb25lIHdoZW4gd3MubGVuZ3RoICE9IDAnKTtcblxuICBpZiAodHMudHJhbnNmb3JtaW5nKVxuICAgIHRocm93IG5ldyBFcnJvcignY2FsbGluZyB0cmFuc2Zvcm0gZG9uZSB3aGVuIHN0aWxsIHRyYW5zZm9ybWluZycpO1xuXG4gIHJldHVybiBzdHJlYW0ucHVzaChudWxsKTtcbn1cbiIsIi8vIEEgYml0IHNpbXBsZXIgdGhhbiByZWFkYWJsZSBzdHJlYW1zLlxuLy8gSW1wbGVtZW50IGFuIGFzeW5jIC5fd3JpdGUoY2h1bmssIGVuY29kaW5nLCBjYiksIGFuZCBpdCdsbCBoYW5kbGUgYWxsXG4vLyB0aGUgZHJhaW4gZXZlbnQgZW1pc3Npb24gYW5kIGJ1ZmZlcmluZy5cblxuJ3VzZSBzdHJpY3QnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFdyaXRhYmxlO1xuXG4vKjxyZXBsYWNlbWVudD4qL1xudmFyIHByb2Nlc3NOZXh0VGljayA9IHJlcXVpcmUoJ3Byb2Nlc3MtbmV4dGljay1hcmdzJyk7XG4vKjwvcmVwbGFjZW1lbnQ+Ki9cblxuXG4vKjxyZXBsYWNlbWVudD4qL1xudmFyIEJ1ZmZlciA9IHJlcXVpcmUoJ2J1ZmZlcicpLkJ1ZmZlcjtcbi8qPC9yZXBsYWNlbWVudD4qL1xuXG5Xcml0YWJsZS5Xcml0YWJsZVN0YXRlID0gV3JpdGFibGVTdGF0ZTtcblxuXG4vKjxyZXBsYWNlbWVudD4qL1xudmFyIHV0aWwgPSByZXF1aXJlKCdjb3JlLXV0aWwtaXMnKTtcbnV0aWwuaW5oZXJpdHMgPSByZXF1aXJlKCdpbmhlcml0cycpO1xuLyo8L3JlcGxhY2VtZW50PiovXG5cblxuLyo8cmVwbGFjZW1lbnQ+Ki9cbnZhciBpbnRlcm5hbFV0aWwgPSB7XG4gIGRlcHJlY2F0ZTogcmVxdWlyZSgndXRpbC1kZXByZWNhdGUnKVxufTtcbi8qPC9yZXBsYWNlbWVudD4qL1xuXG5cblxuLyo8cmVwbGFjZW1lbnQ+Ki9cbnZhciBTdHJlYW07XG4oZnVuY3Rpb24gKCl7dHJ5e1xuICBTdHJlYW0gPSByZXF1aXJlKCdzdCcgKyAncmVhbScpO1xufWNhdGNoKF8pe31maW5hbGx5e1xuICBpZiAoIVN0cmVhbSlcbiAgICBTdHJlYW0gPSByZXF1aXJlKCdldmVudHMnKS5FdmVudEVtaXR0ZXI7XG59fSgpKVxuLyo8L3JlcGxhY2VtZW50PiovXG5cbnZhciBCdWZmZXIgPSByZXF1aXJlKCdidWZmZXInKS5CdWZmZXI7XG5cbnV0aWwuaW5oZXJpdHMoV3JpdGFibGUsIFN0cmVhbSk7XG5cbmZ1bmN0aW9uIG5vcCgpIHt9XG5cbmZ1bmN0aW9uIFdyaXRlUmVxKGNodW5rLCBlbmNvZGluZywgY2IpIHtcbiAgdGhpcy5jaHVuayA9IGNodW5rO1xuICB0aGlzLmVuY29kaW5nID0gZW5jb2Rpbmc7XG4gIHRoaXMuY2FsbGJhY2sgPSBjYjtcbiAgdGhpcy5uZXh0ID0gbnVsbDtcbn1cblxudmFyIER1cGxleDtcbmZ1bmN0aW9uIFdyaXRhYmxlU3RhdGUob3B0aW9ucywgc3RyZWFtKSB7XG4gIER1cGxleCA9IER1cGxleCB8fCByZXF1aXJlKCcuL19zdHJlYW1fZHVwbGV4Jyk7XG5cbiAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG5cbiAgLy8gb2JqZWN0IHN0cmVhbSBmbGFnIHRvIGluZGljYXRlIHdoZXRoZXIgb3Igbm90IHRoaXMgc3RyZWFtXG4gIC8vIGNvbnRhaW5zIGJ1ZmZlcnMgb3Igb2JqZWN0cy5cbiAgdGhpcy5vYmplY3RNb2RlID0gISFvcHRpb25zLm9iamVjdE1vZGU7XG5cbiAgaWYgKHN0cmVhbSBpbnN0YW5jZW9mIER1cGxleClcbiAgICB0aGlzLm9iamVjdE1vZGUgPSB0aGlzLm9iamVjdE1vZGUgfHwgISFvcHRpb25zLndyaXRhYmxlT2JqZWN0TW9kZTtcblxuICAvLyB0aGUgcG9pbnQgYXQgd2hpY2ggd3JpdGUoKSBzdGFydHMgcmV0dXJuaW5nIGZhbHNlXG4gIC8vIE5vdGU6IDAgaXMgYSB2YWxpZCB2YWx1ZSwgbWVhbnMgdGhhdCB3ZSBhbHdheXMgcmV0dXJuIGZhbHNlIGlmXG4gIC8vIHRoZSBlbnRpcmUgYnVmZmVyIGlzIG5vdCBmbHVzaGVkIGltbWVkaWF0ZWx5IG9uIHdyaXRlKClcbiAgdmFyIGh3bSA9IG9wdGlvbnMuaGlnaFdhdGVyTWFyaztcbiAgdmFyIGRlZmF1bHRId20gPSB0aGlzLm9iamVjdE1vZGUgPyAxNiA6IDE2ICogMTAyNDtcbiAgdGhpcy5oaWdoV2F0ZXJNYXJrID0gKGh3bSB8fCBod20gPT09IDApID8gaHdtIDogZGVmYXVsdEh3bTtcblxuICAvLyBjYXN0IHRvIGludHMuXG4gIHRoaXMuaGlnaFdhdGVyTWFyayA9IH5+dGhpcy5oaWdoV2F0ZXJNYXJrO1xuXG4gIHRoaXMubmVlZERyYWluID0gZmFsc2U7XG4gIC8vIGF0IHRoZSBzdGFydCBvZiBjYWxsaW5nIGVuZCgpXG4gIHRoaXMuZW5kaW5nID0gZmFsc2U7XG4gIC8vIHdoZW4gZW5kKCkgaGFzIGJlZW4gY2FsbGVkLCBhbmQgcmV0dXJuZWRcbiAgdGhpcy5lbmRlZCA9IGZhbHNlO1xuICAvLyB3aGVuICdmaW5pc2gnIGlzIGVtaXR0ZWRcbiAgdGhpcy5maW5pc2hlZCA9IGZhbHNlO1xuXG4gIC8vIHNob3VsZCB3ZSBkZWNvZGUgc3RyaW5ncyBpbnRvIGJ1ZmZlcnMgYmVmb3JlIHBhc3NpbmcgdG8gX3dyaXRlP1xuICAvLyB0aGlzIGlzIGhlcmUgc28gdGhhdCBzb21lIG5vZGUtY29yZSBzdHJlYW1zIGNhbiBvcHRpbWl6ZSBzdHJpbmdcbiAgLy8gaGFuZGxpbmcgYXQgYSBsb3dlciBsZXZlbC5cbiAgdmFyIG5vRGVjb2RlID0gb3B0aW9ucy5kZWNvZGVTdHJpbmdzID09PSBmYWxzZTtcbiAgdGhpcy5kZWNvZGVTdHJpbmdzID0gIW5vRGVjb2RlO1xuXG4gIC8vIENyeXB0byBpcyBraW5kIG9mIG9sZCBhbmQgY3J1c3R5LiAgSGlzdG9yaWNhbGx5LCBpdHMgZGVmYXVsdCBzdHJpbmdcbiAgLy8gZW5jb2RpbmcgaXMgJ2JpbmFyeScgc28gd2UgaGF2ZSB0byBtYWtlIHRoaXMgY29uZmlndXJhYmxlLlxuICAvLyBFdmVyeXRoaW5nIGVsc2UgaW4gdGhlIHVuaXZlcnNlIHVzZXMgJ3V0ZjgnLCB0aG91Z2guXG4gIHRoaXMuZGVmYXVsdEVuY29kaW5nID0gb3B0aW9ucy5kZWZhdWx0RW5jb2RpbmcgfHwgJ3V0ZjgnO1xuXG4gIC8vIG5vdCBhbiBhY3R1YWwgYnVmZmVyIHdlIGtlZXAgdHJhY2sgb2YsIGJ1dCBhIG1lYXN1cmVtZW50XG4gIC8vIG9mIGhvdyBtdWNoIHdlJ3JlIHdhaXRpbmcgdG8gZ2V0IHB1c2hlZCB0byBzb21lIHVuZGVybHlpbmdcbiAgLy8gc29ja2V0IG9yIGZpbGUuXG4gIHRoaXMubGVuZ3RoID0gMDtcblxuICAvLyBhIGZsYWcgdG8gc2VlIHdoZW4gd2UncmUgaW4gdGhlIG1pZGRsZSBvZiBhIHdyaXRlLlxuICB0aGlzLndyaXRpbmcgPSBmYWxzZTtcblxuICAvLyB3aGVuIHRydWUgYWxsIHdyaXRlcyB3aWxsIGJlIGJ1ZmZlcmVkIHVudGlsIC51bmNvcmsoKSBjYWxsXG4gIHRoaXMuY29ya2VkID0gMDtcblxuICAvLyBhIGZsYWcgdG8gYmUgYWJsZSB0byB0ZWxsIGlmIHRoZSBvbndyaXRlIGNiIGlzIGNhbGxlZCBpbW1lZGlhdGVseSxcbiAgLy8gb3Igb24gYSBsYXRlciB0aWNrLiAgV2Ugc2V0IHRoaXMgdG8gdHJ1ZSBhdCBmaXJzdCwgYmVjYXVzZSBhbnlcbiAgLy8gYWN0aW9ucyB0aGF0IHNob3VsZG4ndCBoYXBwZW4gdW50aWwgXCJsYXRlclwiIHNob3VsZCBnZW5lcmFsbHkgYWxzb1xuICAvLyBub3QgaGFwcGVuIGJlZm9yZSB0aGUgZmlyc3Qgd3JpdGUgY2FsbC5cbiAgdGhpcy5zeW5jID0gdHJ1ZTtcblxuICAvLyBhIGZsYWcgdG8ga25vdyBpZiB3ZSdyZSBwcm9jZXNzaW5nIHByZXZpb3VzbHkgYnVmZmVyZWQgaXRlbXMsIHdoaWNoXG4gIC8vIG1heSBjYWxsIHRoZSBfd3JpdGUoKSBjYWxsYmFjayBpbiB0aGUgc2FtZSB0aWNrLCBzbyB0aGF0IHdlIGRvbid0XG4gIC8vIGVuZCB1cCBpbiBhbiBvdmVybGFwcGVkIG9ud3JpdGUgc2l0dWF0aW9uLlxuICB0aGlzLmJ1ZmZlclByb2Nlc3NpbmcgPSBmYWxzZTtcblxuICAvLyB0aGUgY2FsbGJhY2sgdGhhdCdzIHBhc3NlZCB0byBfd3JpdGUoY2h1bmssY2IpXG4gIHRoaXMub253cml0ZSA9IGZ1bmN0aW9uKGVyKSB7XG4gICAgb253cml0ZShzdHJlYW0sIGVyKTtcbiAgfTtcblxuICAvLyB0aGUgY2FsbGJhY2sgdGhhdCB0aGUgdXNlciBzdXBwbGllcyB0byB3cml0ZShjaHVuayxlbmNvZGluZyxjYilcbiAgdGhpcy53cml0ZWNiID0gbnVsbDtcblxuICAvLyB0aGUgYW1vdW50IHRoYXQgaXMgYmVpbmcgd3JpdHRlbiB3aGVuIF93cml0ZSBpcyBjYWxsZWQuXG4gIHRoaXMud3JpdGVsZW4gPSAwO1xuXG4gIHRoaXMuYnVmZmVyZWRSZXF1ZXN0ID0gbnVsbDtcbiAgdGhpcy5sYXN0QnVmZmVyZWRSZXF1ZXN0ID0gbnVsbDtcblxuICAvLyBudW1iZXIgb2YgcGVuZGluZyB1c2VyLXN1cHBsaWVkIHdyaXRlIGNhbGxiYWNrc1xuICAvLyB0aGlzIG11c3QgYmUgMCBiZWZvcmUgJ2ZpbmlzaCcgY2FuIGJlIGVtaXR0ZWRcbiAgdGhpcy5wZW5kaW5nY2IgPSAwO1xuXG4gIC8vIGVtaXQgcHJlZmluaXNoIGlmIHRoZSBvbmx5IHRoaW5nIHdlJ3JlIHdhaXRpbmcgZm9yIGlzIF93cml0ZSBjYnNcbiAgLy8gVGhpcyBpcyByZWxldmFudCBmb3Igc3luY2hyb25vdXMgVHJhbnNmb3JtIHN0cmVhbXNcbiAgdGhpcy5wcmVmaW5pc2hlZCA9IGZhbHNlO1xuXG4gIC8vIFRydWUgaWYgdGhlIGVycm9yIHdhcyBhbHJlYWR5IGVtaXR0ZWQgYW5kIHNob3VsZCBub3QgYmUgdGhyb3duIGFnYWluXG4gIHRoaXMuZXJyb3JFbWl0dGVkID0gZmFsc2U7XG59XG5cbldyaXRhYmxlU3RhdGUucHJvdG90eXBlLmdldEJ1ZmZlciA9IGZ1bmN0aW9uIHdyaXRhYmxlU3RhdGVHZXRCdWZmZXIoKSB7XG4gIHZhciBjdXJyZW50ID0gdGhpcy5idWZmZXJlZFJlcXVlc3Q7XG4gIHZhciBvdXQgPSBbXTtcbiAgd2hpbGUgKGN1cnJlbnQpIHtcbiAgICBvdXQucHVzaChjdXJyZW50KTtcbiAgICBjdXJyZW50ID0gY3VycmVudC5uZXh0O1xuICB9XG4gIHJldHVybiBvdXQ7XG59O1xuXG4oZnVuY3Rpb24gKCl7dHJ5IHtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShXcml0YWJsZVN0YXRlLnByb3RvdHlwZSwgJ2J1ZmZlcicsIHtcbiAgZ2V0OiBpbnRlcm5hbFV0aWwuZGVwcmVjYXRlKGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB0aGlzLmdldEJ1ZmZlcigpO1xuICB9LCAnX3dyaXRhYmxlU3RhdGUuYnVmZmVyIGlzIGRlcHJlY2F0ZWQuIFVzZSBfd3JpdGFibGVTdGF0ZS5nZXRCdWZmZXIgJyArXG4gICAgICdpbnN0ZWFkLicpXG59KTtcbn1jYXRjaChfKXt9fSgpKTtcblxuXG52YXIgRHVwbGV4O1xuZnVuY3Rpb24gV3JpdGFibGUob3B0aW9ucykge1xuICBEdXBsZXggPSBEdXBsZXggfHwgcmVxdWlyZSgnLi9fc3RyZWFtX2R1cGxleCcpO1xuXG4gIC8vIFdyaXRhYmxlIGN0b3IgaXMgYXBwbGllZCB0byBEdXBsZXhlcywgdGhvdWdoIHRoZXkncmUgbm90XG4gIC8vIGluc3RhbmNlb2YgV3JpdGFibGUsIHRoZXkncmUgaW5zdGFuY2VvZiBSZWFkYWJsZS5cbiAgaWYgKCEodGhpcyBpbnN0YW5jZW9mIFdyaXRhYmxlKSAmJiAhKHRoaXMgaW5zdGFuY2VvZiBEdXBsZXgpKVxuICAgIHJldHVybiBuZXcgV3JpdGFibGUob3B0aW9ucyk7XG5cbiAgdGhpcy5fd3JpdGFibGVTdGF0ZSA9IG5ldyBXcml0YWJsZVN0YXRlKG9wdGlvbnMsIHRoaXMpO1xuXG4gIC8vIGxlZ2FjeS5cbiAgdGhpcy53cml0YWJsZSA9IHRydWU7XG5cbiAgaWYgKG9wdGlvbnMpIHtcbiAgICBpZiAodHlwZW9mIG9wdGlvbnMud3JpdGUgPT09ICdmdW5jdGlvbicpXG4gICAgICB0aGlzLl93cml0ZSA9IG9wdGlvbnMud3JpdGU7XG5cbiAgICBpZiAodHlwZW9mIG9wdGlvbnMud3JpdGV2ID09PSAnZnVuY3Rpb24nKVxuICAgICAgdGhpcy5fd3JpdGV2ID0gb3B0aW9ucy53cml0ZXY7XG4gIH1cblxuICBTdHJlYW0uY2FsbCh0aGlzKTtcbn1cblxuLy8gT3RoZXJ3aXNlIHBlb3BsZSBjYW4gcGlwZSBXcml0YWJsZSBzdHJlYW1zLCB3aGljaCBpcyBqdXN0IHdyb25nLlxuV3JpdGFibGUucHJvdG90eXBlLnBpcGUgPSBmdW5jdGlvbigpIHtcbiAgdGhpcy5lbWl0KCdlcnJvcicsIG5ldyBFcnJvcignQ2Fubm90IHBpcGUuIE5vdCByZWFkYWJsZS4nKSk7XG59O1xuXG5cbmZ1bmN0aW9uIHdyaXRlQWZ0ZXJFbmQoc3RyZWFtLCBjYikge1xuICB2YXIgZXIgPSBuZXcgRXJyb3IoJ3dyaXRlIGFmdGVyIGVuZCcpO1xuICAvLyBUT0RPOiBkZWZlciBlcnJvciBldmVudHMgY29uc2lzdGVudGx5IGV2ZXJ5d2hlcmUsIG5vdCBqdXN0IHRoZSBjYlxuICBzdHJlYW0uZW1pdCgnZXJyb3InLCBlcik7XG4gIHByb2Nlc3NOZXh0VGljayhjYiwgZXIpO1xufVxuXG4vLyBJZiB3ZSBnZXQgc29tZXRoaW5nIHRoYXQgaXMgbm90IGEgYnVmZmVyLCBzdHJpbmcsIG51bGwsIG9yIHVuZGVmaW5lZCxcbi8vIGFuZCB3ZSdyZSBub3QgaW4gb2JqZWN0TW9kZSwgdGhlbiB0aGF0J3MgYW4gZXJyb3IuXG4vLyBPdGhlcndpc2Ugc3RyZWFtIGNodW5rcyBhcmUgYWxsIGNvbnNpZGVyZWQgdG8gYmUgb2YgbGVuZ3RoPTEsIGFuZCB0aGVcbi8vIHdhdGVybWFya3MgZGV0ZXJtaW5lIGhvdyBtYW55IG9iamVjdHMgdG8ga2VlcCBpbiB0aGUgYnVmZmVyLCByYXRoZXIgdGhhblxuLy8gaG93IG1hbnkgYnl0ZXMgb3IgY2hhcmFjdGVycy5cbmZ1bmN0aW9uIHZhbGlkQ2h1bmsoc3RyZWFtLCBzdGF0ZSwgY2h1bmssIGNiKSB7XG4gIHZhciB2YWxpZCA9IHRydWU7XG5cbiAgaWYgKCEoQnVmZmVyLmlzQnVmZmVyKGNodW5rKSkgJiZcbiAgICAgIHR5cGVvZiBjaHVuayAhPT0gJ3N0cmluZycgJiZcbiAgICAgIGNodW5rICE9PSBudWxsICYmXG4gICAgICBjaHVuayAhPT0gdW5kZWZpbmVkICYmXG4gICAgICAhc3RhdGUub2JqZWN0TW9kZSkge1xuICAgIHZhciBlciA9IG5ldyBUeXBlRXJyb3IoJ0ludmFsaWQgbm9uLXN0cmluZy9idWZmZXIgY2h1bmsnKTtcbiAgICBzdHJlYW0uZW1pdCgnZXJyb3InLCBlcik7XG4gICAgcHJvY2Vzc05leHRUaWNrKGNiLCBlcik7XG4gICAgdmFsaWQgPSBmYWxzZTtcbiAgfVxuICByZXR1cm4gdmFsaWQ7XG59XG5cbldyaXRhYmxlLnByb3RvdHlwZS53cml0ZSA9IGZ1bmN0aW9uKGNodW5rLCBlbmNvZGluZywgY2IpIHtcbiAgdmFyIHN0YXRlID0gdGhpcy5fd3JpdGFibGVTdGF0ZTtcbiAgdmFyIHJldCA9IGZhbHNlO1xuXG4gIGlmICh0eXBlb2YgZW5jb2RpbmcgPT09ICdmdW5jdGlvbicpIHtcbiAgICBjYiA9IGVuY29kaW5nO1xuICAgIGVuY29kaW5nID0gbnVsbDtcbiAgfVxuXG4gIGlmIChCdWZmZXIuaXNCdWZmZXIoY2h1bmspKVxuICAgIGVuY29kaW5nID0gJ2J1ZmZlcic7XG4gIGVsc2UgaWYgKCFlbmNvZGluZylcbiAgICBlbmNvZGluZyA9IHN0YXRlLmRlZmF1bHRFbmNvZGluZztcblxuICBpZiAodHlwZW9mIGNiICE9PSAnZnVuY3Rpb24nKVxuICAgIGNiID0gbm9wO1xuXG4gIGlmIChzdGF0ZS5lbmRlZClcbiAgICB3cml0ZUFmdGVyRW5kKHRoaXMsIGNiKTtcbiAgZWxzZSBpZiAodmFsaWRDaHVuayh0aGlzLCBzdGF0ZSwgY2h1bmssIGNiKSkge1xuICAgIHN0YXRlLnBlbmRpbmdjYisrO1xuICAgIHJldCA9IHdyaXRlT3JCdWZmZXIodGhpcywgc3RhdGUsIGNodW5rLCBlbmNvZGluZywgY2IpO1xuICB9XG5cbiAgcmV0dXJuIHJldDtcbn07XG5cbldyaXRhYmxlLnByb3RvdHlwZS5jb3JrID0gZnVuY3Rpb24oKSB7XG4gIHZhciBzdGF0ZSA9IHRoaXMuX3dyaXRhYmxlU3RhdGU7XG5cbiAgc3RhdGUuY29ya2VkKys7XG59O1xuXG5Xcml0YWJsZS5wcm90b3R5cGUudW5jb3JrID0gZnVuY3Rpb24oKSB7XG4gIHZhciBzdGF0ZSA9IHRoaXMuX3dyaXRhYmxlU3RhdGU7XG5cbiAgaWYgKHN0YXRlLmNvcmtlZCkge1xuICAgIHN0YXRlLmNvcmtlZC0tO1xuXG4gICAgaWYgKCFzdGF0ZS53cml0aW5nICYmXG4gICAgICAgICFzdGF0ZS5jb3JrZWQgJiZcbiAgICAgICAgIXN0YXRlLmZpbmlzaGVkICYmXG4gICAgICAgICFzdGF0ZS5idWZmZXJQcm9jZXNzaW5nICYmXG4gICAgICAgIHN0YXRlLmJ1ZmZlcmVkUmVxdWVzdClcbiAgICAgIGNsZWFyQnVmZmVyKHRoaXMsIHN0YXRlKTtcbiAgfVxufTtcblxuV3JpdGFibGUucHJvdG90eXBlLnNldERlZmF1bHRFbmNvZGluZyA9IGZ1bmN0aW9uIHNldERlZmF1bHRFbmNvZGluZyhlbmNvZGluZykge1xuICAvLyBub2RlOjpQYXJzZUVuY29kaW5nKCkgcmVxdWlyZXMgbG93ZXIgY2FzZS5cbiAgaWYgKHR5cGVvZiBlbmNvZGluZyA9PT0gJ3N0cmluZycpXG4gICAgZW5jb2RpbmcgPSBlbmNvZGluZy50b0xvd2VyQ2FzZSgpO1xuICBpZiAoIShbJ2hleCcsICd1dGY4JywgJ3V0Zi04JywgJ2FzY2lpJywgJ2JpbmFyeScsICdiYXNlNjQnLFxuJ3VjczInLCAndWNzLTInLCd1dGYxNmxlJywgJ3V0Zi0xNmxlJywgJ3JhdyddXG4uaW5kZXhPZigoZW5jb2RpbmcgKyAnJykudG9Mb3dlckNhc2UoKSkgPiAtMSkpXG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcignVW5rbm93biBlbmNvZGluZzogJyArIGVuY29kaW5nKTtcbiAgdGhpcy5fd3JpdGFibGVTdGF0ZS5kZWZhdWx0RW5jb2RpbmcgPSBlbmNvZGluZztcbn07XG5cbmZ1bmN0aW9uIGRlY29kZUNodW5rKHN0YXRlLCBjaHVuaywgZW5jb2RpbmcpIHtcbiAgaWYgKCFzdGF0ZS5vYmplY3RNb2RlICYmXG4gICAgICBzdGF0ZS5kZWNvZGVTdHJpbmdzICE9PSBmYWxzZSAmJlxuICAgICAgdHlwZW9mIGNodW5rID09PSAnc3RyaW5nJykge1xuICAgIGNodW5rID0gbmV3IEJ1ZmZlcihjaHVuaywgZW5jb2RpbmcpO1xuICB9XG4gIHJldHVybiBjaHVuaztcbn1cblxuLy8gaWYgd2UncmUgYWxyZWFkeSB3cml0aW5nIHNvbWV0aGluZywgdGhlbiBqdXN0IHB1dCB0aGlzXG4vLyBpbiB0aGUgcXVldWUsIGFuZCB3YWl0IG91ciB0dXJuLiAgT3RoZXJ3aXNlLCBjYWxsIF93cml0ZVxuLy8gSWYgd2UgcmV0dXJuIGZhbHNlLCB0aGVuIHdlIG5lZWQgYSBkcmFpbiBldmVudCwgc28gc2V0IHRoYXQgZmxhZy5cbmZ1bmN0aW9uIHdyaXRlT3JCdWZmZXIoc3RyZWFtLCBzdGF0ZSwgY2h1bmssIGVuY29kaW5nLCBjYikge1xuICBjaHVuayA9IGRlY29kZUNodW5rKHN0YXRlLCBjaHVuaywgZW5jb2RpbmcpO1xuXG4gIGlmIChCdWZmZXIuaXNCdWZmZXIoY2h1bmspKVxuICAgIGVuY29kaW5nID0gJ2J1ZmZlcic7XG4gIHZhciBsZW4gPSBzdGF0ZS5vYmplY3RNb2RlID8gMSA6IGNodW5rLmxlbmd0aDtcblxuICBzdGF0ZS5sZW5ndGggKz0gbGVuO1xuXG4gIHZhciByZXQgPSBzdGF0ZS5sZW5ndGggPCBzdGF0ZS5oaWdoV2F0ZXJNYXJrO1xuICAvLyB3ZSBtdXN0IGVuc3VyZSB0aGF0IHByZXZpb3VzIG5lZWREcmFpbiB3aWxsIG5vdCBiZSByZXNldCB0byBmYWxzZS5cbiAgaWYgKCFyZXQpXG4gICAgc3RhdGUubmVlZERyYWluID0gdHJ1ZTtcblxuICBpZiAoc3RhdGUud3JpdGluZyB8fCBzdGF0ZS5jb3JrZWQpIHtcbiAgICB2YXIgbGFzdCA9IHN0YXRlLmxhc3RCdWZmZXJlZFJlcXVlc3Q7XG4gICAgc3RhdGUubGFzdEJ1ZmZlcmVkUmVxdWVzdCA9IG5ldyBXcml0ZVJlcShjaHVuaywgZW5jb2RpbmcsIGNiKTtcbiAgICBpZiAobGFzdCkge1xuICAgICAgbGFzdC5uZXh0ID0gc3RhdGUubGFzdEJ1ZmZlcmVkUmVxdWVzdDtcbiAgICB9IGVsc2Uge1xuICAgICAgc3RhdGUuYnVmZmVyZWRSZXF1ZXN0ID0gc3RhdGUubGFzdEJ1ZmZlcmVkUmVxdWVzdDtcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgZG9Xcml0ZShzdHJlYW0sIHN0YXRlLCBmYWxzZSwgbGVuLCBjaHVuaywgZW5jb2RpbmcsIGNiKTtcbiAgfVxuXG4gIHJldHVybiByZXQ7XG59XG5cbmZ1bmN0aW9uIGRvV3JpdGUoc3RyZWFtLCBzdGF0ZSwgd3JpdGV2LCBsZW4sIGNodW5rLCBlbmNvZGluZywgY2IpIHtcbiAgc3RhdGUud3JpdGVsZW4gPSBsZW47XG4gIHN0YXRlLndyaXRlY2IgPSBjYjtcbiAgc3RhdGUud3JpdGluZyA9IHRydWU7XG4gIHN0YXRlLnN5bmMgPSB0cnVlO1xuICBpZiAod3JpdGV2KVxuICAgIHN0cmVhbS5fd3JpdGV2KGNodW5rLCBzdGF0ZS5vbndyaXRlKTtcbiAgZWxzZVxuICAgIHN0cmVhbS5fd3JpdGUoY2h1bmssIGVuY29kaW5nLCBzdGF0ZS5vbndyaXRlKTtcbiAgc3RhdGUuc3luYyA9IGZhbHNlO1xufVxuXG5mdW5jdGlvbiBvbndyaXRlRXJyb3Ioc3RyZWFtLCBzdGF0ZSwgc3luYywgZXIsIGNiKSB7XG4gIC0tc3RhdGUucGVuZGluZ2NiO1xuICBpZiAoc3luYylcbiAgICBwcm9jZXNzTmV4dFRpY2soY2IsIGVyKTtcbiAgZWxzZVxuICAgIGNiKGVyKTtcblxuICBzdHJlYW0uX3dyaXRhYmxlU3RhdGUuZXJyb3JFbWl0dGVkID0gdHJ1ZTtcbiAgc3RyZWFtLmVtaXQoJ2Vycm9yJywgZXIpO1xufVxuXG5mdW5jdGlvbiBvbndyaXRlU3RhdGVVcGRhdGUoc3RhdGUpIHtcbiAgc3RhdGUud3JpdGluZyA9IGZhbHNlO1xuICBzdGF0ZS53cml0ZWNiID0gbnVsbDtcbiAgc3RhdGUubGVuZ3RoIC09IHN0YXRlLndyaXRlbGVuO1xuICBzdGF0ZS53cml0ZWxlbiA9IDA7XG59XG5cbmZ1bmN0aW9uIG9ud3JpdGUoc3RyZWFtLCBlcikge1xuICB2YXIgc3RhdGUgPSBzdHJlYW0uX3dyaXRhYmxlU3RhdGU7XG4gIHZhciBzeW5jID0gc3RhdGUuc3luYztcbiAgdmFyIGNiID0gc3RhdGUud3JpdGVjYjtcblxuICBvbndyaXRlU3RhdGVVcGRhdGUoc3RhdGUpO1xuXG4gIGlmIChlcilcbiAgICBvbndyaXRlRXJyb3Ioc3RyZWFtLCBzdGF0ZSwgc3luYywgZXIsIGNiKTtcbiAgZWxzZSB7XG4gICAgLy8gQ2hlY2sgaWYgd2UncmUgYWN0dWFsbHkgcmVhZHkgdG8gZmluaXNoLCBidXQgZG9uJ3QgZW1pdCB5ZXRcbiAgICB2YXIgZmluaXNoZWQgPSBuZWVkRmluaXNoKHN0YXRlKTtcblxuICAgIGlmICghZmluaXNoZWQgJiZcbiAgICAgICAgIXN0YXRlLmNvcmtlZCAmJlxuICAgICAgICAhc3RhdGUuYnVmZmVyUHJvY2Vzc2luZyAmJlxuICAgICAgICBzdGF0ZS5idWZmZXJlZFJlcXVlc3QpIHtcbiAgICAgIGNsZWFyQnVmZmVyKHN0cmVhbSwgc3RhdGUpO1xuICAgIH1cblxuICAgIGlmIChzeW5jKSB7XG4gICAgICBwcm9jZXNzTmV4dFRpY2soYWZ0ZXJXcml0ZSwgc3RyZWFtLCBzdGF0ZSwgZmluaXNoZWQsIGNiKTtcbiAgICB9IGVsc2Uge1xuICAgICAgYWZ0ZXJXcml0ZShzdHJlYW0sIHN0YXRlLCBmaW5pc2hlZCwgY2IpO1xuICAgIH1cbiAgfVxufVxuXG5mdW5jdGlvbiBhZnRlcldyaXRlKHN0cmVhbSwgc3RhdGUsIGZpbmlzaGVkLCBjYikge1xuICBpZiAoIWZpbmlzaGVkKVxuICAgIG9ud3JpdGVEcmFpbihzdHJlYW0sIHN0YXRlKTtcbiAgc3RhdGUucGVuZGluZ2NiLS07XG4gIGNiKCk7XG4gIGZpbmlzaE1heWJlKHN0cmVhbSwgc3RhdGUpO1xufVxuXG4vLyBNdXN0IGZvcmNlIGNhbGxiYWNrIHRvIGJlIGNhbGxlZCBvbiBuZXh0VGljaywgc28gdGhhdCB3ZSBkb24ndFxuLy8gZW1pdCAnZHJhaW4nIGJlZm9yZSB0aGUgd3JpdGUoKSBjb25zdW1lciBnZXRzIHRoZSAnZmFsc2UnIHJldHVyblxuLy8gdmFsdWUsIGFuZCBoYXMgYSBjaGFuY2UgdG8gYXR0YWNoIGEgJ2RyYWluJyBsaXN0ZW5lci5cbmZ1bmN0aW9uIG9ud3JpdGVEcmFpbihzdHJlYW0sIHN0YXRlKSB7XG4gIGlmIChzdGF0ZS5sZW5ndGggPT09IDAgJiYgc3RhdGUubmVlZERyYWluKSB7XG4gICAgc3RhdGUubmVlZERyYWluID0gZmFsc2U7XG4gICAgc3RyZWFtLmVtaXQoJ2RyYWluJyk7XG4gIH1cbn1cblxuXG4vLyBpZiB0aGVyZSdzIHNvbWV0aGluZyBpbiB0aGUgYnVmZmVyIHdhaXRpbmcsIHRoZW4gcHJvY2VzcyBpdFxuZnVuY3Rpb24gY2xlYXJCdWZmZXIoc3RyZWFtLCBzdGF0ZSkge1xuICBzdGF0ZS5idWZmZXJQcm9jZXNzaW5nID0gdHJ1ZTtcbiAgdmFyIGVudHJ5ID0gc3RhdGUuYnVmZmVyZWRSZXF1ZXN0O1xuXG4gIGlmIChzdHJlYW0uX3dyaXRldiAmJiBlbnRyeSAmJiBlbnRyeS5uZXh0KSB7XG4gICAgLy8gRmFzdCBjYXNlLCB3cml0ZSBldmVyeXRoaW5nIHVzaW5nIF93cml0ZXYoKVxuICAgIHZhciBidWZmZXIgPSBbXTtcbiAgICB2YXIgY2JzID0gW107XG4gICAgd2hpbGUgKGVudHJ5KSB7XG4gICAgICBjYnMucHVzaChlbnRyeS5jYWxsYmFjayk7XG4gICAgICBidWZmZXIucHVzaChlbnRyeSk7XG4gICAgICBlbnRyeSA9IGVudHJ5Lm5leHQ7XG4gICAgfVxuXG4gICAgLy8gY291bnQgdGhlIG9uZSB3ZSBhcmUgYWRkaW5nLCBhcyB3ZWxsLlxuICAgIC8vIFRPRE8oaXNhYWNzKSBjbGVhbiB0aGlzIHVwXG4gICAgc3RhdGUucGVuZGluZ2NiKys7XG4gICAgc3RhdGUubGFzdEJ1ZmZlcmVkUmVxdWVzdCA9IG51bGw7XG4gICAgZG9Xcml0ZShzdHJlYW0sIHN0YXRlLCB0cnVlLCBzdGF0ZS5sZW5ndGgsIGJ1ZmZlciwgJycsIGZ1bmN0aW9uKGVycikge1xuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBjYnMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgc3RhdGUucGVuZGluZ2NiLS07XG4gICAgICAgIGNic1tpXShlcnIpO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgLy8gQ2xlYXIgYnVmZmVyXG4gIH0gZWxzZSB7XG4gICAgLy8gU2xvdyBjYXNlLCB3cml0ZSBjaHVua3Mgb25lLWJ5LW9uZVxuICAgIHdoaWxlIChlbnRyeSkge1xuICAgICAgdmFyIGNodW5rID0gZW50cnkuY2h1bms7XG4gICAgICB2YXIgZW5jb2RpbmcgPSBlbnRyeS5lbmNvZGluZztcbiAgICAgIHZhciBjYiA9IGVudHJ5LmNhbGxiYWNrO1xuICAgICAgdmFyIGxlbiA9IHN0YXRlLm9iamVjdE1vZGUgPyAxIDogY2h1bmsubGVuZ3RoO1xuXG4gICAgICBkb1dyaXRlKHN0cmVhbSwgc3RhdGUsIGZhbHNlLCBsZW4sIGNodW5rLCBlbmNvZGluZywgY2IpO1xuICAgICAgZW50cnkgPSBlbnRyeS5uZXh0O1xuICAgICAgLy8gaWYgd2UgZGlkbid0IGNhbGwgdGhlIG9ud3JpdGUgaW1tZWRpYXRlbHksIHRoZW5cbiAgICAgIC8vIGl0IG1lYW5zIHRoYXQgd2UgbmVlZCB0byB3YWl0IHVudGlsIGl0IGRvZXMuXG4gICAgICAvLyBhbHNvLCB0aGF0IG1lYW5zIHRoYXQgdGhlIGNodW5rIGFuZCBjYiBhcmUgY3VycmVudGx5XG4gICAgICAvLyBiZWluZyBwcm9jZXNzZWQsIHNvIG1vdmUgdGhlIGJ1ZmZlciBjb3VudGVyIHBhc3QgdGhlbS5cbiAgICAgIGlmIChzdGF0ZS53cml0aW5nKSB7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChlbnRyeSA9PT0gbnVsbClcbiAgICAgIHN0YXRlLmxhc3RCdWZmZXJlZFJlcXVlc3QgPSBudWxsO1xuICB9XG4gIHN0YXRlLmJ1ZmZlcmVkUmVxdWVzdCA9IGVudHJ5O1xuICBzdGF0ZS5idWZmZXJQcm9jZXNzaW5nID0gZmFsc2U7XG59XG5cbldyaXRhYmxlLnByb3RvdHlwZS5fd3JpdGUgPSBmdW5jdGlvbihjaHVuaywgZW5jb2RpbmcsIGNiKSB7XG4gIGNiKG5ldyBFcnJvcignbm90IGltcGxlbWVudGVkJykpO1xufTtcblxuV3JpdGFibGUucHJvdG90eXBlLl93cml0ZXYgPSBudWxsO1xuXG5Xcml0YWJsZS5wcm90b3R5cGUuZW5kID0gZnVuY3Rpb24oY2h1bmssIGVuY29kaW5nLCBjYikge1xuICB2YXIgc3RhdGUgPSB0aGlzLl93cml0YWJsZVN0YXRlO1xuXG4gIGlmICh0eXBlb2YgY2h1bmsgPT09ICdmdW5jdGlvbicpIHtcbiAgICBjYiA9IGNodW5rO1xuICAgIGNodW5rID0gbnVsbDtcbiAgICBlbmNvZGluZyA9IG51bGw7XG4gIH0gZWxzZSBpZiAodHlwZW9mIGVuY29kaW5nID09PSAnZnVuY3Rpb24nKSB7XG4gICAgY2IgPSBlbmNvZGluZztcbiAgICBlbmNvZGluZyA9IG51bGw7XG4gIH1cblxuICBpZiAoY2h1bmsgIT09IG51bGwgJiYgY2h1bmsgIT09IHVuZGVmaW5lZClcbiAgICB0aGlzLndyaXRlKGNodW5rLCBlbmNvZGluZyk7XG5cbiAgLy8gLmVuZCgpIGZ1bGx5IHVuY29ya3NcbiAgaWYgKHN0YXRlLmNvcmtlZCkge1xuICAgIHN0YXRlLmNvcmtlZCA9IDE7XG4gICAgdGhpcy51bmNvcmsoKTtcbiAgfVxuXG4gIC8vIGlnbm9yZSB1bm5lY2Vzc2FyeSBlbmQoKSBjYWxscy5cbiAgaWYgKCFzdGF0ZS5lbmRpbmcgJiYgIXN0YXRlLmZpbmlzaGVkKVxuICAgIGVuZFdyaXRhYmxlKHRoaXMsIHN0YXRlLCBjYik7XG59O1xuXG5cbmZ1bmN0aW9uIG5lZWRGaW5pc2goc3RhdGUpIHtcbiAgcmV0dXJuIChzdGF0ZS5lbmRpbmcgJiZcbiAgICAgICAgICBzdGF0ZS5sZW5ndGggPT09IDAgJiZcbiAgICAgICAgICBzdGF0ZS5idWZmZXJlZFJlcXVlc3QgPT09IG51bGwgJiZcbiAgICAgICAgICAhc3RhdGUuZmluaXNoZWQgJiZcbiAgICAgICAgICAhc3RhdGUud3JpdGluZyk7XG59XG5cbmZ1bmN0aW9uIHByZWZpbmlzaChzdHJlYW0sIHN0YXRlKSB7XG4gIGlmICghc3RhdGUucHJlZmluaXNoZWQpIHtcbiAgICBzdGF0ZS5wcmVmaW5pc2hlZCA9IHRydWU7XG4gICAgc3RyZWFtLmVtaXQoJ3ByZWZpbmlzaCcpO1xuICB9XG59XG5cbmZ1bmN0aW9uIGZpbmlzaE1heWJlKHN0cmVhbSwgc3RhdGUpIHtcbiAgdmFyIG5lZWQgPSBuZWVkRmluaXNoKHN0YXRlKTtcbiAgaWYgKG5lZWQpIHtcbiAgICBpZiAoc3RhdGUucGVuZGluZ2NiID09PSAwKSB7XG4gICAgICBwcmVmaW5pc2goc3RyZWFtLCBzdGF0ZSk7XG4gICAgICBzdGF0ZS5maW5pc2hlZCA9IHRydWU7XG4gICAgICBzdHJlYW0uZW1pdCgnZmluaXNoJyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHByZWZpbmlzaChzdHJlYW0sIHN0YXRlKTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIG5lZWQ7XG59XG5cbmZ1bmN0aW9uIGVuZFdyaXRhYmxlKHN0cmVhbSwgc3RhdGUsIGNiKSB7XG4gIHN0YXRlLmVuZGluZyA9IHRydWU7XG4gIGZpbmlzaE1heWJlKHN0cmVhbSwgc3RhdGUpO1xuICBpZiAoY2IpIHtcbiAgICBpZiAoc3RhdGUuZmluaXNoZWQpXG4gICAgICBwcm9jZXNzTmV4dFRpY2soY2IpO1xuICAgIGVsc2VcbiAgICAgIHN0cmVhbS5vbmNlKCdmaW5pc2gnLCBjYik7XG4gIH1cbiAgc3RhdGUuZW5kZWQgPSB0cnVlO1xufVxuIiwiLy8gQ29weXJpZ2h0IEpveWVudCwgSW5jLiBhbmQgb3RoZXIgTm9kZSBjb250cmlidXRvcnMuXG4vL1xuLy8gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGFcbi8vIGNvcHkgb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGVcbi8vIFwiU29mdHdhcmVcIiksIHRvIGRlYWwgaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZ1xuLy8gd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHMgdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLFxuLy8gZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdFxuLy8gcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpcyBmdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlXG4vLyBmb2xsb3dpbmcgY29uZGl0aW9uczpcbi8vXG4vLyBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZFxuLy8gaW4gYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG4vL1xuLy8gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTU1xuLy8gT1IgSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRlxuLy8gTUVSQ0hBTlRBQklMSVRZLCBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTlxuLy8gTk8gRVZFTlQgU0hBTEwgVEhFIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sXG4vLyBEQU1BR0VTIE9SIE9USEVSIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1Jcbi8vIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLCBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEVcbi8vIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTiBUSEUgU09GVFdBUkUuXG5cbi8vIE5PVEU6IFRoZXNlIHR5cGUgY2hlY2tpbmcgZnVuY3Rpb25zIGludGVudGlvbmFsbHkgZG9uJ3QgdXNlIGBpbnN0YW5jZW9mYFxuLy8gYmVjYXVzZSBpdCBpcyBmcmFnaWxlIGFuZCBjYW4gYmUgZWFzaWx5IGZha2VkIHdpdGggYE9iamVjdC5jcmVhdGUoKWAuXG5cbmZ1bmN0aW9uIGlzQXJyYXkoYXJnKSB7XG4gIGlmIChBcnJheS5pc0FycmF5KSB7XG4gICAgcmV0dXJuIEFycmF5LmlzQXJyYXkoYXJnKTtcbiAgfVxuICByZXR1cm4gb2JqZWN0VG9TdHJpbmcoYXJnKSA9PT0gJ1tvYmplY3QgQXJyYXldJztcbn1cbmV4cG9ydHMuaXNBcnJheSA9IGlzQXJyYXk7XG5cbmZ1bmN0aW9uIGlzQm9vbGVhbihhcmcpIHtcbiAgcmV0dXJuIHR5cGVvZiBhcmcgPT09ICdib29sZWFuJztcbn1cbmV4cG9ydHMuaXNCb29sZWFuID0gaXNCb29sZWFuO1xuXG5mdW5jdGlvbiBpc051bGwoYXJnKSB7XG4gIHJldHVybiBhcmcgPT09IG51bGw7XG59XG5leHBvcnRzLmlzTnVsbCA9IGlzTnVsbDtcblxuZnVuY3Rpb24gaXNOdWxsT3JVbmRlZmluZWQoYXJnKSB7XG4gIHJldHVybiBhcmcgPT0gbnVsbDtcbn1cbmV4cG9ydHMuaXNOdWxsT3JVbmRlZmluZWQgPSBpc051bGxPclVuZGVmaW5lZDtcblxuZnVuY3Rpb24gaXNOdW1iZXIoYXJnKSB7XG4gIHJldHVybiB0eXBlb2YgYXJnID09PSAnbnVtYmVyJztcbn1cbmV4cG9ydHMuaXNOdW1iZXIgPSBpc051bWJlcjtcblxuZnVuY3Rpb24gaXNTdHJpbmcoYXJnKSB7XG4gIHJldHVybiB0eXBlb2YgYXJnID09PSAnc3RyaW5nJztcbn1cbmV4cG9ydHMuaXNTdHJpbmcgPSBpc1N0cmluZztcblxuZnVuY3Rpb24gaXNTeW1ib2woYXJnKSB7XG4gIHJldHVybiB0eXBlb2YgYXJnID09PSAnc3ltYm9sJztcbn1cbmV4cG9ydHMuaXNTeW1ib2wgPSBpc1N5bWJvbDtcblxuZnVuY3Rpb24gaXNVbmRlZmluZWQoYXJnKSB7XG4gIHJldHVybiBhcmcgPT09IHZvaWQgMDtcbn1cbmV4cG9ydHMuaXNVbmRlZmluZWQgPSBpc1VuZGVmaW5lZDtcblxuZnVuY3Rpb24gaXNSZWdFeHAocmUpIHtcbiAgcmV0dXJuIG9iamVjdFRvU3RyaW5nKHJlKSA9PT0gJ1tvYmplY3QgUmVnRXhwXSc7XG59XG5leHBvcnRzLmlzUmVnRXhwID0gaXNSZWdFeHA7XG5cbmZ1bmN0aW9uIGlzT2JqZWN0KGFyZykge1xuICByZXR1cm4gdHlwZW9mIGFyZyA9PT0gJ29iamVjdCcgJiYgYXJnICE9PSBudWxsO1xufVxuZXhwb3J0cy5pc09iamVjdCA9IGlzT2JqZWN0O1xuXG5mdW5jdGlvbiBpc0RhdGUoZCkge1xuICByZXR1cm4gb2JqZWN0VG9TdHJpbmcoZCkgPT09ICdbb2JqZWN0IERhdGVdJztcbn1cbmV4cG9ydHMuaXNEYXRlID0gaXNEYXRlO1xuXG5mdW5jdGlvbiBpc0Vycm9yKGUpIHtcbiAgcmV0dXJuIChvYmplY3RUb1N0cmluZyhlKSA9PT0gJ1tvYmplY3QgRXJyb3JdJyB8fCBlIGluc3RhbmNlb2YgRXJyb3IpO1xufVxuZXhwb3J0cy5pc0Vycm9yID0gaXNFcnJvcjtcblxuZnVuY3Rpb24gaXNGdW5jdGlvbihhcmcpIHtcbiAgcmV0dXJuIHR5cGVvZiBhcmcgPT09ICdmdW5jdGlvbic7XG59XG5leHBvcnRzLmlzRnVuY3Rpb24gPSBpc0Z1bmN0aW9uO1xuXG5mdW5jdGlvbiBpc1ByaW1pdGl2ZShhcmcpIHtcbiAgcmV0dXJuIGFyZyA9PT0gbnVsbCB8fFxuICAgICAgICAgdHlwZW9mIGFyZyA9PT0gJ2Jvb2xlYW4nIHx8XG4gICAgICAgICB0eXBlb2YgYXJnID09PSAnbnVtYmVyJyB8fFxuICAgICAgICAgdHlwZW9mIGFyZyA9PT0gJ3N0cmluZycgfHxcbiAgICAgICAgIHR5cGVvZiBhcmcgPT09ICdzeW1ib2wnIHx8ICAvLyBFUzYgc3ltYm9sXG4gICAgICAgICB0eXBlb2YgYXJnID09PSAndW5kZWZpbmVkJztcbn1cbmV4cG9ydHMuaXNQcmltaXRpdmUgPSBpc1ByaW1pdGl2ZTtcblxuZXhwb3J0cy5pc0J1ZmZlciA9IEJ1ZmZlci5pc0J1ZmZlcjtcblxuZnVuY3Rpb24gb2JqZWN0VG9TdHJpbmcobykge1xuICByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKG8pO1xufVxuIiwiJ3VzZSBzdHJpY3QnO1xuXG5pZiAoIXByb2Nlc3MudmVyc2lvbiB8fFxuICAgIHByb2Nlc3MudmVyc2lvbi5pbmRleE9mKCd2MC4nKSA9PT0gMCB8fFxuICAgIHByb2Nlc3MudmVyc2lvbi5pbmRleE9mKCd2MS4nKSA9PT0gMCAmJiBwcm9jZXNzLnZlcnNpb24uaW5kZXhPZigndjEuOC4nKSAhPT0gMCkge1xuICBtb2R1bGUuZXhwb3J0cyA9IG5leHRUaWNrO1xufSBlbHNlIHtcbiAgbW9kdWxlLmV4cG9ydHMgPSBwcm9jZXNzLm5leHRUaWNrO1xufVxuXG5mdW5jdGlvbiBuZXh0VGljayhmbikge1xuICB2YXIgYXJncyA9IG5ldyBBcnJheShhcmd1bWVudHMubGVuZ3RoIC0gMSk7XG4gIHZhciBpID0gMDtcbiAgd2hpbGUgKGkgPCBhcmdzLmxlbmd0aCkge1xuICAgIGFyZ3NbaSsrXSA9IGFyZ3VtZW50c1tpXTtcbiAgfVxuICBwcm9jZXNzLm5leHRUaWNrKGZ1bmN0aW9uIGFmdGVyVGljaygpIHtcbiAgICBmbi5hcHBseShudWxsLCBhcmdzKTtcbiAgfSk7XG59XG4iLCJcbi8qKlxuICogTW9kdWxlIGV4cG9ydHMuXG4gKi9cblxubW9kdWxlLmV4cG9ydHMgPSBkZXByZWNhdGU7XG5cbi8qKlxuICogTWFyayB0aGF0IGEgbWV0aG9kIHNob3VsZCBub3QgYmUgdXNlZC5cbiAqIFJldHVybnMgYSBtb2RpZmllZCBmdW5jdGlvbiB3aGljaCB3YXJucyBvbmNlIGJ5IGRlZmF1bHQuXG4gKlxuICogSWYgYGxvY2FsU3RvcmFnZS5ub0RlcHJlY2F0aW9uID0gdHJ1ZWAgaXMgc2V0LCB0aGVuIGl0IGlzIGEgbm8tb3AuXG4gKlxuICogSWYgYGxvY2FsU3RvcmFnZS50aHJvd0RlcHJlY2F0aW9uID0gdHJ1ZWAgaXMgc2V0LCB0aGVuIGRlcHJlY2F0ZWQgZnVuY3Rpb25zXG4gKiB3aWxsIHRocm93IGFuIEVycm9yIHdoZW4gaW52b2tlZC5cbiAqXG4gKiBJZiBgbG9jYWxTdG9yYWdlLnRyYWNlRGVwcmVjYXRpb24gPSB0cnVlYCBpcyBzZXQsIHRoZW4gZGVwcmVjYXRlZCBmdW5jdGlvbnNcbiAqIHdpbGwgaW52b2tlIGBjb25zb2xlLnRyYWNlKClgIGluc3RlYWQgb2YgYGNvbnNvbGUuZXJyb3IoKWAuXG4gKlxuICogQHBhcmFtIHtGdW5jdGlvbn0gZm4gLSB0aGUgZnVuY3Rpb24gdG8gZGVwcmVjYXRlXG4gKiBAcGFyYW0ge1N0cmluZ30gbXNnIC0gdGhlIHN0cmluZyB0byBwcmludCB0byB0aGUgY29uc29sZSB3aGVuIGBmbmAgaXMgaW52b2tlZFxuICogQHJldHVybnMge0Z1bmN0aW9ufSBhIG5ldyBcImRlcHJlY2F0ZWRcIiB2ZXJzaW9uIG9mIGBmbmBcbiAqIEBhcGkgcHVibGljXG4gKi9cblxuZnVuY3Rpb24gZGVwcmVjYXRlIChmbiwgbXNnKSB7XG4gIGlmIChjb25maWcoJ25vRGVwcmVjYXRpb24nKSkge1xuICAgIHJldHVybiBmbjtcbiAgfVxuXG4gIHZhciB3YXJuZWQgPSBmYWxzZTtcbiAgZnVuY3Rpb24gZGVwcmVjYXRlZCgpIHtcbiAgICBpZiAoIXdhcm5lZCkge1xuICAgICAgaWYgKGNvbmZpZygndGhyb3dEZXByZWNhdGlvbicpKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihtc2cpO1xuICAgICAgfSBlbHNlIGlmIChjb25maWcoJ3RyYWNlRGVwcmVjYXRpb24nKSkge1xuICAgICAgICBjb25zb2xlLnRyYWNlKG1zZyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjb25zb2xlLndhcm4obXNnKTtcbiAgICAgIH1cbiAgICAgIHdhcm5lZCA9IHRydWU7XG4gICAgfVxuICAgIHJldHVybiBmbi5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICB9XG5cbiAgcmV0dXJuIGRlcHJlY2F0ZWQ7XG59XG5cbi8qKlxuICogQ2hlY2tzIGBsb2NhbFN0b3JhZ2VgIGZvciBib29sZWFuIHZhbHVlcyBmb3IgdGhlIGdpdmVuIGBuYW1lYC5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gbmFtZVxuICogQHJldHVybnMge0Jvb2xlYW59XG4gKiBAYXBpIHByaXZhdGVcbiAqL1xuXG5mdW5jdGlvbiBjb25maWcgKG5hbWUpIHtcbiAgLy8gYWNjZXNzaW5nIGdsb2JhbC5sb2NhbFN0b3JhZ2UgY2FuIHRyaWdnZXIgYSBET01FeGNlcHRpb24gaW4gc2FuZGJveGVkIGlmcmFtZXNcbiAgdHJ5IHtcbiAgICBpZiAoIWdsb2JhbC5sb2NhbFN0b3JhZ2UpIHJldHVybiBmYWxzZTtcbiAgfSBjYXRjaCAoXykge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICB2YXIgdmFsID0gZ2xvYmFsLmxvY2FsU3RvcmFnZVtuYW1lXTtcbiAgaWYgKG51bGwgPT0gdmFsKSByZXR1cm4gZmFsc2U7XG4gIHJldHVybiBTdHJpbmcodmFsKS50b0xvd2VyQ2FzZSgpID09PSAndHJ1ZSc7XG59XG4iLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCIuL2xpYi9fc3RyZWFtX3Bhc3N0aHJvdWdoLmpzXCIpXG4iLCJ2YXIgU3RyZWFtID0gKGZ1bmN0aW9uICgpe1xuICB0cnkge1xuICAgIHJldHVybiByZXF1aXJlKCdzdCcgKyAncmVhbScpOyAvLyBoYWNrIHRvIGZpeCBhIGNpcmN1bGFyIGRlcGVuZGVuY3kgaXNzdWUgd2hlbiB1c2VkIHdpdGggYnJvd3NlcmlmeVxuICB9IGNhdGNoKF8pe31cbn0oKSk7XG5leHBvcnRzID0gbW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCcuL2xpYi9fc3RyZWFtX3JlYWRhYmxlLmpzJyk7XG5leHBvcnRzLlN0cmVhbSA9IFN0cmVhbSB8fCBleHBvcnRzO1xuZXhwb3J0cy5SZWFkYWJsZSA9IGV4cG9ydHM7XG5leHBvcnRzLldyaXRhYmxlID0gcmVxdWlyZSgnLi9saWIvX3N0cmVhbV93cml0YWJsZS5qcycpO1xuZXhwb3J0cy5EdXBsZXggPSByZXF1aXJlKCcuL2xpYi9fc3RyZWFtX2R1cGxleC5qcycpO1xuZXhwb3J0cy5UcmFuc2Zvcm0gPSByZXF1aXJlKCcuL2xpYi9fc3RyZWFtX3RyYW5zZm9ybS5qcycpO1xuZXhwb3J0cy5QYXNzVGhyb3VnaCA9IHJlcXVpcmUoJy4vbGliL19zdHJlYW1fcGFzc3Rocm91Z2guanMnKTtcbiIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcIi4vbGliL19zdHJlYW1fdHJhbnNmb3JtLmpzXCIpXG4iLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCIuL2xpYi9fc3RyZWFtX3dyaXRhYmxlLmpzXCIpXG4iLCIvLyBDb3B5cmlnaHQgSm95ZW50LCBJbmMuIGFuZCBvdGhlciBOb2RlIGNvbnRyaWJ1dG9ycy5cbi8vXG4vLyBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYVxuLy8gY29weSBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZVxuLy8gXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbCBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nXG4vLyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0cyB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsXG4vLyBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbCBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0XG4vLyBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzIGZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGVcbi8vIGZvbGxvd2luZyBjb25kaXRpb25zOlxuLy9cbi8vIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkXG4vLyBpbiBhbGwgY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cbi8vXG4vLyBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTXG4vLyBPUiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GXG4vLyBNRVJDSEFOVEFCSUxJVFksIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOXG4vLyBOTyBFVkVOVCBTSEFMTCBUSEUgQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSxcbi8vIERBTUFHRVMgT1IgT1RIRVIgTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUlxuLy8gT1RIRVJXSVNFLCBBUklTSU5HIEZST00sIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRVxuLy8gVVNFIE9SIE9USEVSIERFQUxJTkdTIElOIFRIRSBTT0ZUV0FSRS5cblxubW9kdWxlLmV4cG9ydHMgPSBTdHJlYW07XG5cbnZhciBFRSA9IHJlcXVpcmUoJ2V2ZW50cycpLkV2ZW50RW1pdHRlcjtcbnZhciBpbmhlcml0cyA9IHJlcXVpcmUoJ2luaGVyaXRzJyk7XG5cbmluaGVyaXRzKFN0cmVhbSwgRUUpO1xuU3RyZWFtLlJlYWRhYmxlID0gcmVxdWlyZSgncmVhZGFibGUtc3RyZWFtL3JlYWRhYmxlLmpzJyk7XG5TdHJlYW0uV3JpdGFibGUgPSByZXF1aXJlKCdyZWFkYWJsZS1zdHJlYW0vd3JpdGFibGUuanMnKTtcblN0cmVhbS5EdXBsZXggPSByZXF1aXJlKCdyZWFkYWJsZS1zdHJlYW0vZHVwbGV4LmpzJyk7XG5TdHJlYW0uVHJhbnNmb3JtID0gcmVxdWlyZSgncmVhZGFibGUtc3RyZWFtL3RyYW5zZm9ybS5qcycpO1xuU3RyZWFtLlBhc3NUaHJvdWdoID0gcmVxdWlyZSgncmVhZGFibGUtc3RyZWFtL3Bhc3N0aHJvdWdoLmpzJyk7XG5cbi8vIEJhY2t3YXJkcy1jb21wYXQgd2l0aCBub2RlIDAuNC54XG5TdHJlYW0uU3RyZWFtID0gU3RyZWFtO1xuXG5cblxuLy8gb2xkLXN0eWxlIHN0cmVhbXMuICBOb3RlIHRoYXQgdGhlIHBpcGUgbWV0aG9kICh0aGUgb25seSByZWxldmFudFxuLy8gcGFydCBvZiB0aGlzIGNsYXNzKSBpcyBvdmVycmlkZGVuIGluIHRoZSBSZWFkYWJsZSBjbGFzcy5cblxuZnVuY3Rpb24gU3RyZWFtKCkge1xuICBFRS5jYWxsKHRoaXMpO1xufVxuXG5TdHJlYW0ucHJvdG90eXBlLnBpcGUgPSBmdW5jdGlvbihkZXN0LCBvcHRpb25zKSB7XG4gIHZhciBzb3VyY2UgPSB0aGlzO1xuXG4gIGZ1bmN0aW9uIG9uZGF0YShjaHVuaykge1xuICAgIGlmIChkZXN0LndyaXRhYmxlKSB7XG4gICAgICBpZiAoZmFsc2UgPT09IGRlc3Qud3JpdGUoY2h1bmspICYmIHNvdXJjZS5wYXVzZSkge1xuICAgICAgICBzb3VyY2UucGF1c2UoKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBzb3VyY2Uub24oJ2RhdGEnLCBvbmRhdGEpO1xuXG4gIGZ1bmN0aW9uIG9uZHJhaW4oKSB7XG4gICAgaWYgKHNvdXJjZS5yZWFkYWJsZSAmJiBzb3VyY2UucmVzdW1lKSB7XG4gICAgICBzb3VyY2UucmVzdW1lKCk7XG4gICAgfVxuICB9XG5cbiAgZGVzdC5vbignZHJhaW4nLCBvbmRyYWluKTtcblxuICAvLyBJZiB0aGUgJ2VuZCcgb3B0aW9uIGlzIG5vdCBzdXBwbGllZCwgZGVzdC5lbmQoKSB3aWxsIGJlIGNhbGxlZCB3aGVuXG4gIC8vIHNvdXJjZSBnZXRzIHRoZSAnZW5kJyBvciAnY2xvc2UnIGV2ZW50cy4gIE9ubHkgZGVzdC5lbmQoKSBvbmNlLlxuICBpZiAoIWRlc3QuX2lzU3RkaW8gJiYgKCFvcHRpb25zIHx8IG9wdGlvbnMuZW5kICE9PSBmYWxzZSkpIHtcbiAgICBzb3VyY2Uub24oJ2VuZCcsIG9uZW5kKTtcbiAgICBzb3VyY2Uub24oJ2Nsb3NlJywgb25jbG9zZSk7XG4gIH1cblxuICB2YXIgZGlkT25FbmQgPSBmYWxzZTtcbiAgZnVuY3Rpb24gb25lbmQoKSB7XG4gICAgaWYgKGRpZE9uRW5kKSByZXR1cm47XG4gICAgZGlkT25FbmQgPSB0cnVlO1xuXG4gICAgZGVzdC5lbmQoKTtcbiAgfVxuXG5cbiAgZnVuY3Rpb24gb25jbG9zZSgpIHtcbiAgICBpZiAoZGlkT25FbmQpIHJldHVybjtcbiAgICBkaWRPbkVuZCA9IHRydWU7XG5cbiAgICBpZiAodHlwZW9mIGRlc3QuZGVzdHJveSA9PT0gJ2Z1bmN0aW9uJykgZGVzdC5kZXN0cm95KCk7XG4gIH1cblxuICAvLyBkb24ndCBsZWF2ZSBkYW5nbGluZyBwaXBlcyB3aGVuIHRoZXJlIGFyZSBlcnJvcnMuXG4gIGZ1bmN0aW9uIG9uZXJyb3IoZXIpIHtcbiAgICBjbGVhbnVwKCk7XG4gICAgaWYgKEVFLmxpc3RlbmVyQ291bnQodGhpcywgJ2Vycm9yJykgPT09IDApIHtcbiAgICAgIHRocm93IGVyOyAvLyBVbmhhbmRsZWQgc3RyZWFtIGVycm9yIGluIHBpcGUuXG4gICAgfVxuICB9XG5cbiAgc291cmNlLm9uKCdlcnJvcicsIG9uZXJyb3IpO1xuICBkZXN0Lm9uKCdlcnJvcicsIG9uZXJyb3IpO1xuXG4gIC8vIHJlbW92ZSBhbGwgdGhlIGV2ZW50IGxpc3RlbmVycyB0aGF0IHdlcmUgYWRkZWQuXG4gIGZ1bmN0aW9uIGNsZWFudXAoKSB7XG4gICAgc291cmNlLnJlbW92ZUxpc3RlbmVyKCdkYXRhJywgb25kYXRhKTtcbiAgICBkZXN0LnJlbW92ZUxpc3RlbmVyKCdkcmFpbicsIG9uZHJhaW4pO1xuXG4gICAgc291cmNlLnJlbW92ZUxpc3RlbmVyKCdlbmQnLCBvbmVuZCk7XG4gICAgc291cmNlLnJlbW92ZUxpc3RlbmVyKCdjbG9zZScsIG9uY2xvc2UpO1xuXG4gICAgc291cmNlLnJlbW92ZUxpc3RlbmVyKCdlcnJvcicsIG9uZXJyb3IpO1xuICAgIGRlc3QucmVtb3ZlTGlzdGVuZXIoJ2Vycm9yJywgb25lcnJvcik7XG5cbiAgICBzb3VyY2UucmVtb3ZlTGlzdGVuZXIoJ2VuZCcsIGNsZWFudXApO1xuICAgIHNvdXJjZS5yZW1vdmVMaXN0ZW5lcignY2xvc2UnLCBjbGVhbnVwKTtcblxuICAgIGRlc3QucmVtb3ZlTGlzdGVuZXIoJ2Nsb3NlJywgY2xlYW51cCk7XG4gIH1cblxuICBzb3VyY2Uub24oJ2VuZCcsIGNsZWFudXApO1xuICBzb3VyY2Uub24oJ2Nsb3NlJywgY2xlYW51cCk7XG5cbiAgZGVzdC5vbignY2xvc2UnLCBjbGVhbnVwKTtcblxuICBkZXN0LmVtaXQoJ3BpcGUnLCBzb3VyY2UpO1xuXG4gIC8vIEFsbG93IGZvciB1bml4LWxpa2UgdXNhZ2U6IEEucGlwZShCKS5waXBlKEMpXG4gIHJldHVybiBkZXN0O1xufTtcbiIsIi8vIENvcHlyaWdodCBKb3llbnQsIEluYy4gYW5kIG90aGVyIE5vZGUgY29udHJpYnV0b3JzLlxuLy9cbi8vIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhXG4vLyBjb3B5IG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlXG4vLyBcIlNvZnR3YXJlXCIpLCB0byBkZWFsIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmdcbi8vIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCxcbi8vIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXRcbi8vIHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXMgZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZVxuLy8gZm9sbG93aW5nIGNvbmRpdGlvbnM6XG4vL1xuLy8gVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWRcbi8vIGluIGFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuLy9cbi8vIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1Ncbi8vIE9SIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0Zcbi8vIE1FUkNIQU5UQUJJTElUWSwgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU5cbi8vIE5PIEVWRU5UIFNIQUxMIFRIRSBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLFxuLy8gREFNQUdFUyBPUiBPVEhFUiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SXG4vLyBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSwgT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFXG4vLyBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU4gVEhFIFNPRlRXQVJFLlxuXG52YXIgQnVmZmVyID0gcmVxdWlyZSgnYnVmZmVyJykuQnVmZmVyO1xuXG52YXIgaXNCdWZmZXJFbmNvZGluZyA9IEJ1ZmZlci5pc0VuY29kaW5nXG4gIHx8IGZ1bmN0aW9uKGVuY29kaW5nKSB7XG4gICAgICAgc3dpdGNoIChlbmNvZGluZyAmJiBlbmNvZGluZy50b0xvd2VyQ2FzZSgpKSB7XG4gICAgICAgICBjYXNlICdoZXgnOiBjYXNlICd1dGY4JzogY2FzZSAndXRmLTgnOiBjYXNlICdhc2NpaSc6IGNhc2UgJ2JpbmFyeSc6IGNhc2UgJ2Jhc2U2NCc6IGNhc2UgJ3VjczInOiBjYXNlICd1Y3MtMic6IGNhc2UgJ3V0ZjE2bGUnOiBjYXNlICd1dGYtMTZsZSc6IGNhc2UgJ3Jhdyc6IHJldHVybiB0cnVlO1xuICAgICAgICAgZGVmYXVsdDogcmV0dXJuIGZhbHNlO1xuICAgICAgIH1cbiAgICAgfVxuXG5cbmZ1bmN0aW9uIGFzc2VydEVuY29kaW5nKGVuY29kaW5nKSB7XG4gIGlmIChlbmNvZGluZyAmJiAhaXNCdWZmZXJFbmNvZGluZyhlbmNvZGluZykpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ1Vua25vd24gZW5jb2Rpbmc6ICcgKyBlbmNvZGluZyk7XG4gIH1cbn1cblxuLy8gU3RyaW5nRGVjb2RlciBwcm92aWRlcyBhbiBpbnRlcmZhY2UgZm9yIGVmZmljaWVudGx5IHNwbGl0dGluZyBhIHNlcmllcyBvZlxuLy8gYnVmZmVycyBpbnRvIGEgc2VyaWVzIG9mIEpTIHN0cmluZ3Mgd2l0aG91dCBicmVha2luZyBhcGFydCBtdWx0aS1ieXRlXG4vLyBjaGFyYWN0ZXJzLiBDRVNVLTggaXMgaGFuZGxlZCBhcyBwYXJ0IG9mIHRoZSBVVEYtOCBlbmNvZGluZy5cbi8vXG4vLyBAVE9ETyBIYW5kbGluZyBhbGwgZW5jb2RpbmdzIGluc2lkZSBhIHNpbmdsZSBvYmplY3QgbWFrZXMgaXQgdmVyeSBkaWZmaWN1bHRcbi8vIHRvIHJlYXNvbiBhYm91dCB0aGlzIGNvZGUsIHNvIGl0IHNob3VsZCBiZSBzcGxpdCB1cCBpbiB0aGUgZnV0dXJlLlxuLy8gQFRPRE8gVGhlcmUgc2hvdWxkIGJlIGEgdXRmOC1zdHJpY3QgZW5jb2RpbmcgdGhhdCByZWplY3RzIGludmFsaWQgVVRGLTggY29kZVxuLy8gcG9pbnRzIGFzIHVzZWQgYnkgQ0VTVS04LlxudmFyIFN0cmluZ0RlY29kZXIgPSBleHBvcnRzLlN0cmluZ0RlY29kZXIgPSBmdW5jdGlvbihlbmNvZGluZykge1xuICB0aGlzLmVuY29kaW5nID0gKGVuY29kaW5nIHx8ICd1dGY4JykudG9Mb3dlckNhc2UoKS5yZXBsYWNlKC9bLV9dLywgJycpO1xuICBhc3NlcnRFbmNvZGluZyhlbmNvZGluZyk7XG4gIHN3aXRjaCAodGhpcy5lbmNvZGluZykge1xuICAgIGNhc2UgJ3V0ZjgnOlxuICAgICAgLy8gQ0VTVS04IHJlcHJlc2VudHMgZWFjaCBvZiBTdXJyb2dhdGUgUGFpciBieSAzLWJ5dGVzXG4gICAgICB0aGlzLnN1cnJvZ2F0ZVNpemUgPSAzO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSAndWNzMic6XG4gICAgY2FzZSAndXRmMTZsZSc6XG4gICAgICAvLyBVVEYtMTYgcmVwcmVzZW50cyBlYWNoIG9mIFN1cnJvZ2F0ZSBQYWlyIGJ5IDItYnl0ZXNcbiAgICAgIHRoaXMuc3Vycm9nYXRlU2l6ZSA9IDI7XG4gICAgICB0aGlzLmRldGVjdEluY29tcGxldGVDaGFyID0gdXRmMTZEZXRlY3RJbmNvbXBsZXRlQ2hhcjtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgJ2Jhc2U2NCc6XG4gICAgICAvLyBCYXNlLTY0IHN0b3JlcyAzIGJ5dGVzIGluIDQgY2hhcnMsIGFuZCBwYWRzIHRoZSByZW1haW5kZXIuXG4gICAgICB0aGlzLnN1cnJvZ2F0ZVNpemUgPSAzO1xuICAgICAgdGhpcy5kZXRlY3RJbmNvbXBsZXRlQ2hhciA9IGJhc2U2NERldGVjdEluY29tcGxldGVDaGFyO1xuICAgICAgYnJlYWs7XG4gICAgZGVmYXVsdDpcbiAgICAgIHRoaXMud3JpdGUgPSBwYXNzVGhyb3VnaFdyaXRlO1xuICAgICAgcmV0dXJuO1xuICB9XG5cbiAgLy8gRW5vdWdoIHNwYWNlIHRvIHN0b3JlIGFsbCBieXRlcyBvZiBhIHNpbmdsZSBjaGFyYWN0ZXIuIFVURi04IG5lZWRzIDRcbiAgLy8gYnl0ZXMsIGJ1dCBDRVNVLTggbWF5IHJlcXVpcmUgdXAgdG8gNiAoMyBieXRlcyBwZXIgc3Vycm9nYXRlKS5cbiAgdGhpcy5jaGFyQnVmZmVyID0gbmV3IEJ1ZmZlcig2KTtcbiAgLy8gTnVtYmVyIG9mIGJ5dGVzIHJlY2VpdmVkIGZvciB0aGUgY3VycmVudCBpbmNvbXBsZXRlIG11bHRpLWJ5dGUgY2hhcmFjdGVyLlxuICB0aGlzLmNoYXJSZWNlaXZlZCA9IDA7XG4gIC8vIE51bWJlciBvZiBieXRlcyBleHBlY3RlZCBmb3IgdGhlIGN1cnJlbnQgaW5jb21wbGV0ZSBtdWx0aS1ieXRlIGNoYXJhY3Rlci5cbiAgdGhpcy5jaGFyTGVuZ3RoID0gMDtcbn07XG5cblxuLy8gd3JpdGUgZGVjb2RlcyB0aGUgZ2l2ZW4gYnVmZmVyIGFuZCByZXR1cm5zIGl0IGFzIEpTIHN0cmluZyB0aGF0IGlzXG4vLyBndWFyYW50ZWVkIHRvIG5vdCBjb250YWluIGFueSBwYXJ0aWFsIG11bHRpLWJ5dGUgY2hhcmFjdGVycy4gQW55IHBhcnRpYWxcbi8vIGNoYXJhY3RlciBmb3VuZCBhdCB0aGUgZW5kIG9mIHRoZSBidWZmZXIgaXMgYnVmZmVyZWQgdXAsIGFuZCB3aWxsIGJlXG4vLyByZXR1cm5lZCB3aGVuIGNhbGxpbmcgd3JpdGUgYWdhaW4gd2l0aCB0aGUgcmVtYWluaW5nIGJ5dGVzLlxuLy9cbi8vIE5vdGU6IENvbnZlcnRpbmcgYSBCdWZmZXIgY29udGFpbmluZyBhbiBvcnBoYW4gc3Vycm9nYXRlIHRvIGEgU3RyaW5nXG4vLyBjdXJyZW50bHkgd29ya3MsIGJ1dCBjb252ZXJ0aW5nIGEgU3RyaW5nIHRvIGEgQnVmZmVyICh2aWEgYG5ldyBCdWZmZXJgLCBvclxuLy8gQnVmZmVyI3dyaXRlKSB3aWxsIHJlcGxhY2UgaW5jb21wbGV0ZSBzdXJyb2dhdGVzIHdpdGggdGhlIHVuaWNvZGVcbi8vIHJlcGxhY2VtZW50IGNoYXJhY3Rlci4gU2VlIGh0dHBzOi8vY29kZXJldmlldy5jaHJvbWl1bS5vcmcvMTIxMTczMDA5LyAuXG5TdHJpbmdEZWNvZGVyLnByb3RvdHlwZS53cml0ZSA9IGZ1bmN0aW9uKGJ1ZmZlcikge1xuICB2YXIgY2hhclN0ciA9ICcnO1xuICAvLyBpZiBvdXIgbGFzdCB3cml0ZSBlbmRlZCB3aXRoIGFuIGluY29tcGxldGUgbXVsdGlieXRlIGNoYXJhY3RlclxuICB3aGlsZSAodGhpcy5jaGFyTGVuZ3RoKSB7XG4gICAgLy8gZGV0ZXJtaW5lIGhvdyBtYW55IHJlbWFpbmluZyBieXRlcyB0aGlzIGJ1ZmZlciBoYXMgdG8gb2ZmZXIgZm9yIHRoaXMgY2hhclxuICAgIHZhciBhdmFpbGFibGUgPSAoYnVmZmVyLmxlbmd0aCA+PSB0aGlzLmNoYXJMZW5ndGggLSB0aGlzLmNoYXJSZWNlaXZlZCkgP1xuICAgICAgICB0aGlzLmNoYXJMZW5ndGggLSB0aGlzLmNoYXJSZWNlaXZlZCA6XG4gICAgICAgIGJ1ZmZlci5sZW5ndGg7XG5cbiAgICAvLyBhZGQgdGhlIG5ldyBieXRlcyB0byB0aGUgY2hhciBidWZmZXJcbiAgICBidWZmZXIuY29weSh0aGlzLmNoYXJCdWZmZXIsIHRoaXMuY2hhclJlY2VpdmVkLCAwLCBhdmFpbGFibGUpO1xuICAgIHRoaXMuY2hhclJlY2VpdmVkICs9IGF2YWlsYWJsZTtcblxuICAgIGlmICh0aGlzLmNoYXJSZWNlaXZlZCA8IHRoaXMuY2hhckxlbmd0aCkge1xuICAgICAgLy8gc3RpbGwgbm90IGVub3VnaCBjaGFycyBpbiB0aGlzIGJ1ZmZlcj8gd2FpdCBmb3IgbW9yZSAuLi5cbiAgICAgIHJldHVybiAnJztcbiAgICB9XG5cbiAgICAvLyByZW1vdmUgYnl0ZXMgYmVsb25naW5nIHRvIHRoZSBjdXJyZW50IGNoYXJhY3RlciBmcm9tIHRoZSBidWZmZXJcbiAgICBidWZmZXIgPSBidWZmZXIuc2xpY2UoYXZhaWxhYmxlLCBidWZmZXIubGVuZ3RoKTtcblxuICAgIC8vIGdldCB0aGUgY2hhcmFjdGVyIHRoYXQgd2FzIHNwbGl0XG4gICAgY2hhclN0ciA9IHRoaXMuY2hhckJ1ZmZlci5zbGljZSgwLCB0aGlzLmNoYXJMZW5ndGgpLnRvU3RyaW5nKHRoaXMuZW5jb2RpbmcpO1xuXG4gICAgLy8gQ0VTVS04OiBsZWFkIHN1cnJvZ2F0ZSAoRDgwMC1EQkZGKSBpcyBhbHNvIHRoZSBpbmNvbXBsZXRlIGNoYXJhY3RlclxuICAgIHZhciBjaGFyQ29kZSA9IGNoYXJTdHIuY2hhckNvZGVBdChjaGFyU3RyLmxlbmd0aCAtIDEpO1xuICAgIGlmIChjaGFyQ29kZSA+PSAweEQ4MDAgJiYgY2hhckNvZGUgPD0gMHhEQkZGKSB7XG4gICAgICB0aGlzLmNoYXJMZW5ndGggKz0gdGhpcy5zdXJyb2dhdGVTaXplO1xuICAgICAgY2hhclN0ciA9ICcnO1xuICAgICAgY29udGludWU7XG4gICAgfVxuICAgIHRoaXMuY2hhclJlY2VpdmVkID0gdGhpcy5jaGFyTGVuZ3RoID0gMDtcblxuICAgIC8vIGlmIHRoZXJlIGFyZSBubyBtb3JlIGJ5dGVzIGluIHRoaXMgYnVmZmVyLCBqdXN0IGVtaXQgb3VyIGNoYXJcbiAgICBpZiAoYnVmZmVyLmxlbmd0aCA9PT0gMCkge1xuICAgICAgcmV0dXJuIGNoYXJTdHI7XG4gICAgfVxuICAgIGJyZWFrO1xuICB9XG5cbiAgLy8gZGV0ZXJtaW5lIGFuZCBzZXQgY2hhckxlbmd0aCAvIGNoYXJSZWNlaXZlZFxuICB0aGlzLmRldGVjdEluY29tcGxldGVDaGFyKGJ1ZmZlcik7XG5cbiAgdmFyIGVuZCA9IGJ1ZmZlci5sZW5ndGg7XG4gIGlmICh0aGlzLmNoYXJMZW5ndGgpIHtcbiAgICAvLyBidWZmZXIgdGhlIGluY29tcGxldGUgY2hhcmFjdGVyIGJ5dGVzIHdlIGdvdFxuICAgIGJ1ZmZlci5jb3B5KHRoaXMuY2hhckJ1ZmZlciwgMCwgYnVmZmVyLmxlbmd0aCAtIHRoaXMuY2hhclJlY2VpdmVkLCBlbmQpO1xuICAgIGVuZCAtPSB0aGlzLmNoYXJSZWNlaXZlZDtcbiAgfVxuXG4gIGNoYXJTdHIgKz0gYnVmZmVyLnRvU3RyaW5nKHRoaXMuZW5jb2RpbmcsIDAsIGVuZCk7XG5cbiAgdmFyIGVuZCA9IGNoYXJTdHIubGVuZ3RoIC0gMTtcbiAgdmFyIGNoYXJDb2RlID0gY2hhclN0ci5jaGFyQ29kZUF0KGVuZCk7XG4gIC8vIENFU1UtODogbGVhZCBzdXJyb2dhdGUgKEQ4MDAtREJGRikgaXMgYWxzbyB0aGUgaW5jb21wbGV0ZSBjaGFyYWN0ZXJcbiAgaWYgKGNoYXJDb2RlID49IDB4RDgwMCAmJiBjaGFyQ29kZSA8PSAweERCRkYpIHtcbiAgICB2YXIgc2l6ZSA9IHRoaXMuc3Vycm9nYXRlU2l6ZTtcbiAgICB0aGlzLmNoYXJMZW5ndGggKz0gc2l6ZTtcbiAgICB0aGlzLmNoYXJSZWNlaXZlZCArPSBzaXplO1xuICAgIHRoaXMuY2hhckJ1ZmZlci5jb3B5KHRoaXMuY2hhckJ1ZmZlciwgc2l6ZSwgMCwgc2l6ZSk7XG4gICAgYnVmZmVyLmNvcHkodGhpcy5jaGFyQnVmZmVyLCAwLCAwLCBzaXplKTtcbiAgICByZXR1cm4gY2hhclN0ci5zdWJzdHJpbmcoMCwgZW5kKTtcbiAgfVxuXG4gIC8vIG9yIGp1c3QgZW1pdCB0aGUgY2hhclN0clxuICByZXR1cm4gY2hhclN0cjtcbn07XG5cbi8vIGRldGVjdEluY29tcGxldGVDaGFyIGRldGVybWluZXMgaWYgdGhlcmUgaXMgYW4gaW5jb21wbGV0ZSBVVEYtOCBjaGFyYWN0ZXIgYXRcbi8vIHRoZSBlbmQgb2YgdGhlIGdpdmVuIGJ1ZmZlci4gSWYgc28sIGl0IHNldHMgdGhpcy5jaGFyTGVuZ3RoIHRvIHRoZSBieXRlXG4vLyBsZW5ndGggdGhhdCBjaGFyYWN0ZXIsIGFuZCBzZXRzIHRoaXMuY2hhclJlY2VpdmVkIHRvIHRoZSBudW1iZXIgb2YgYnl0ZXNcbi8vIHRoYXQgYXJlIGF2YWlsYWJsZSBmb3IgdGhpcyBjaGFyYWN0ZXIuXG5TdHJpbmdEZWNvZGVyLnByb3RvdHlwZS5kZXRlY3RJbmNvbXBsZXRlQ2hhciA9IGZ1bmN0aW9uKGJ1ZmZlcikge1xuICAvLyBkZXRlcm1pbmUgaG93IG1hbnkgYnl0ZXMgd2UgaGF2ZSB0byBjaGVjayBhdCB0aGUgZW5kIG9mIHRoaXMgYnVmZmVyXG4gIHZhciBpID0gKGJ1ZmZlci5sZW5ndGggPj0gMykgPyAzIDogYnVmZmVyLmxlbmd0aDtcblxuICAvLyBGaWd1cmUgb3V0IGlmIG9uZSBvZiB0aGUgbGFzdCBpIGJ5dGVzIG9mIG91ciBidWZmZXIgYW5ub3VuY2VzIGFuXG4gIC8vIGluY29tcGxldGUgY2hhci5cbiAgZm9yICg7IGkgPiAwOyBpLS0pIHtcbiAgICB2YXIgYyA9IGJ1ZmZlcltidWZmZXIubGVuZ3RoIC0gaV07XG5cbiAgICAvLyBTZWUgaHR0cDovL2VuLndpa2lwZWRpYS5vcmcvd2lraS9VVEYtOCNEZXNjcmlwdGlvblxuXG4gICAgLy8gMTEwWFhYWFhcbiAgICBpZiAoaSA9PSAxICYmIGMgPj4gNSA9PSAweDA2KSB7XG4gICAgICB0aGlzLmNoYXJMZW5ndGggPSAyO1xuICAgICAgYnJlYWs7XG4gICAgfVxuXG4gICAgLy8gMTExMFhYWFhcbiAgICBpZiAoaSA8PSAyICYmIGMgPj4gNCA9PSAweDBFKSB7XG4gICAgICB0aGlzLmNoYXJMZW5ndGggPSAzO1xuICAgICAgYnJlYWs7XG4gICAgfVxuXG4gICAgLy8gMTExMTBYWFhcbiAgICBpZiAoaSA8PSAzICYmIGMgPj4gMyA9PSAweDFFKSB7XG4gICAgICB0aGlzLmNoYXJMZW5ndGggPSA0O1xuICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG4gIHRoaXMuY2hhclJlY2VpdmVkID0gaTtcbn07XG5cblN0cmluZ0RlY29kZXIucHJvdG90eXBlLmVuZCA9IGZ1bmN0aW9uKGJ1ZmZlcikge1xuICB2YXIgcmVzID0gJyc7XG4gIGlmIChidWZmZXIgJiYgYnVmZmVyLmxlbmd0aClcbiAgICByZXMgPSB0aGlzLndyaXRlKGJ1ZmZlcik7XG5cbiAgaWYgKHRoaXMuY2hhclJlY2VpdmVkKSB7XG4gICAgdmFyIGNyID0gdGhpcy5jaGFyUmVjZWl2ZWQ7XG4gICAgdmFyIGJ1ZiA9IHRoaXMuY2hhckJ1ZmZlcjtcbiAgICB2YXIgZW5jID0gdGhpcy5lbmNvZGluZztcbiAgICByZXMgKz0gYnVmLnNsaWNlKDAsIGNyKS50b1N0cmluZyhlbmMpO1xuICB9XG5cbiAgcmV0dXJuIHJlcztcbn07XG5cbmZ1bmN0aW9uIHBhc3NUaHJvdWdoV3JpdGUoYnVmZmVyKSB7XG4gIHJldHVybiBidWZmZXIudG9TdHJpbmcodGhpcy5lbmNvZGluZyk7XG59XG5cbmZ1bmN0aW9uIHV0ZjE2RGV0ZWN0SW5jb21wbGV0ZUNoYXIoYnVmZmVyKSB7XG4gIHRoaXMuY2hhclJlY2VpdmVkID0gYnVmZmVyLmxlbmd0aCAlIDI7XG4gIHRoaXMuY2hhckxlbmd0aCA9IHRoaXMuY2hhclJlY2VpdmVkID8gMiA6IDA7XG59XG5cbmZ1bmN0aW9uIGJhc2U2NERldGVjdEluY29tcGxldGVDaGFyKGJ1ZmZlcikge1xuICB0aGlzLmNoYXJSZWNlaXZlZCA9IGJ1ZmZlci5sZW5ndGggJSAzO1xuICB0aGlzLmNoYXJMZW5ndGggPSB0aGlzLmNoYXJSZWNlaXZlZCA/IDMgOiAwO1xufVxuIiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBpc0J1ZmZlcihhcmcpIHtcbiAgcmV0dXJuIGFyZyAmJiB0eXBlb2YgYXJnID09PSAnb2JqZWN0J1xuICAgICYmIHR5cGVvZiBhcmcuY29weSA9PT0gJ2Z1bmN0aW9uJ1xuICAgICYmIHR5cGVvZiBhcmcuZmlsbCA9PT0gJ2Z1bmN0aW9uJ1xuICAgICYmIHR5cGVvZiBhcmcucmVhZFVJbnQ4ID09PSAnZnVuY3Rpb24nO1xufSIsIi8vIENvcHlyaWdodCBKb3llbnQsIEluYy4gYW5kIG90aGVyIE5vZGUgY29udHJpYnV0b3JzLlxuLy9cbi8vIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhXG4vLyBjb3B5IG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlXG4vLyBcIlNvZnR3YXJlXCIpLCB0byBkZWFsIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmdcbi8vIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCxcbi8vIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXRcbi8vIHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXMgZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZVxuLy8gZm9sbG93aW5nIGNvbmRpdGlvbnM6XG4vL1xuLy8gVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWRcbi8vIGluIGFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuLy9cbi8vIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1Ncbi8vIE9SIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0Zcbi8vIE1FUkNIQU5UQUJJTElUWSwgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU5cbi8vIE5PIEVWRU5UIFNIQUxMIFRIRSBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLFxuLy8gREFNQUdFUyBPUiBPVEhFUiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SXG4vLyBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSwgT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFXG4vLyBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU4gVEhFIFNPRlRXQVJFLlxuXG52YXIgZm9ybWF0UmVnRXhwID0gLyVbc2RqJV0vZztcbmV4cG9ydHMuZm9ybWF0ID0gZnVuY3Rpb24oZikge1xuICBpZiAoIWlzU3RyaW5nKGYpKSB7XG4gICAgdmFyIG9iamVjdHMgPSBbXTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKykge1xuICAgICAgb2JqZWN0cy5wdXNoKGluc3BlY3QoYXJndW1lbnRzW2ldKSk7XG4gICAgfVxuICAgIHJldHVybiBvYmplY3RzLmpvaW4oJyAnKTtcbiAgfVxuXG4gIHZhciBpID0gMTtcbiAgdmFyIGFyZ3MgPSBhcmd1bWVudHM7XG4gIHZhciBsZW4gPSBhcmdzLmxlbmd0aDtcbiAgdmFyIHN0ciA9IFN0cmluZyhmKS5yZXBsYWNlKGZvcm1hdFJlZ0V4cCwgZnVuY3Rpb24oeCkge1xuICAgIGlmICh4ID09PSAnJSUnKSByZXR1cm4gJyUnO1xuICAgIGlmIChpID49IGxlbikgcmV0dXJuIHg7XG4gICAgc3dpdGNoICh4KSB7XG4gICAgICBjYXNlICclcyc6IHJldHVybiBTdHJpbmcoYXJnc1tpKytdKTtcbiAgICAgIGNhc2UgJyVkJzogcmV0dXJuIE51bWJlcihhcmdzW2krK10pO1xuICAgICAgY2FzZSAnJWonOlxuICAgICAgICB0cnkge1xuICAgICAgICAgIHJldHVybiBKU09OLnN0cmluZ2lmeShhcmdzW2krK10pO1xuICAgICAgICB9IGNhdGNoIChfKSB7XG4gICAgICAgICAgcmV0dXJuICdbQ2lyY3VsYXJdJztcbiAgICAgICAgfVxuICAgICAgZGVmYXVsdDpcbiAgICAgICAgcmV0dXJuIHg7XG4gICAgfVxuICB9KTtcbiAgZm9yICh2YXIgeCA9IGFyZ3NbaV07IGkgPCBsZW47IHggPSBhcmdzWysraV0pIHtcbiAgICBpZiAoaXNOdWxsKHgpIHx8ICFpc09iamVjdCh4KSkge1xuICAgICAgc3RyICs9ICcgJyArIHg7XG4gICAgfSBlbHNlIHtcbiAgICAgIHN0ciArPSAnICcgKyBpbnNwZWN0KHgpO1xuICAgIH1cbiAgfVxuICByZXR1cm4gc3RyO1xufTtcblxuXG4vLyBNYXJrIHRoYXQgYSBtZXRob2Qgc2hvdWxkIG5vdCBiZSB1c2VkLlxuLy8gUmV0dXJucyBhIG1vZGlmaWVkIGZ1bmN0aW9uIHdoaWNoIHdhcm5zIG9uY2UgYnkgZGVmYXVsdC5cbi8vIElmIC0tbm8tZGVwcmVjYXRpb24gaXMgc2V0LCB0aGVuIGl0IGlzIGEgbm8tb3AuXG5leHBvcnRzLmRlcHJlY2F0ZSA9IGZ1bmN0aW9uKGZuLCBtc2cpIHtcbiAgLy8gQWxsb3cgZm9yIGRlcHJlY2F0aW5nIHRoaW5ncyBpbiB0aGUgcHJvY2VzcyBvZiBzdGFydGluZyB1cC5cbiAgaWYgKGlzVW5kZWZpbmVkKGdsb2JhbC5wcm9jZXNzKSkge1xuICAgIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiBleHBvcnRzLmRlcHJlY2F0ZShmbiwgbXNnKS5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIH07XG4gIH1cblxuICBpZiAocHJvY2Vzcy5ub0RlcHJlY2F0aW9uID09PSB0cnVlKSB7XG4gICAgcmV0dXJuIGZuO1xuICB9XG5cbiAgdmFyIHdhcm5lZCA9IGZhbHNlO1xuICBmdW5jdGlvbiBkZXByZWNhdGVkKCkge1xuICAgIGlmICghd2FybmVkKSB7XG4gICAgICBpZiAocHJvY2Vzcy50aHJvd0RlcHJlY2F0aW9uKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihtc2cpO1xuICAgICAgfSBlbHNlIGlmIChwcm9jZXNzLnRyYWNlRGVwcmVjYXRpb24pIHtcbiAgICAgICAgY29uc29sZS50cmFjZShtc2cpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY29uc29sZS5lcnJvcihtc2cpO1xuICAgICAgfVxuICAgICAgd2FybmVkID0gdHJ1ZTtcbiAgICB9XG4gICAgcmV0dXJuIGZuLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gIH1cblxuICByZXR1cm4gZGVwcmVjYXRlZDtcbn07XG5cblxudmFyIGRlYnVncyA9IHt9O1xudmFyIGRlYnVnRW52aXJvbjtcbmV4cG9ydHMuZGVidWdsb2cgPSBmdW5jdGlvbihzZXQpIHtcbiAgaWYgKGlzVW5kZWZpbmVkKGRlYnVnRW52aXJvbikpXG4gICAgZGVidWdFbnZpcm9uID0gcHJvY2Vzcy5lbnYuTk9ERV9ERUJVRyB8fCAnJztcbiAgc2V0ID0gc2V0LnRvVXBwZXJDYXNlKCk7XG4gIGlmICghZGVidWdzW3NldF0pIHtcbiAgICBpZiAobmV3IFJlZ0V4cCgnXFxcXGInICsgc2V0ICsgJ1xcXFxiJywgJ2knKS50ZXN0KGRlYnVnRW52aXJvbikpIHtcbiAgICAgIHZhciBwaWQgPSBwcm9jZXNzLnBpZDtcbiAgICAgIGRlYnVnc1tzZXRdID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBtc2cgPSBleHBvcnRzLmZvcm1hdC5hcHBseShleHBvcnRzLCBhcmd1bWVudHMpO1xuICAgICAgICBjb25zb2xlLmVycm9yKCclcyAlZDogJXMnLCBzZXQsIHBpZCwgbXNnKTtcbiAgICAgIH07XG4gICAgfSBlbHNlIHtcbiAgICAgIGRlYnVnc1tzZXRdID0gZnVuY3Rpb24oKSB7fTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIGRlYnVnc1tzZXRdO1xufTtcblxuXG4vKipcbiAqIEVjaG9zIHRoZSB2YWx1ZSBvZiBhIHZhbHVlLiBUcnlzIHRvIHByaW50IHRoZSB2YWx1ZSBvdXRcbiAqIGluIHRoZSBiZXN0IHdheSBwb3NzaWJsZSBnaXZlbiB0aGUgZGlmZmVyZW50IHR5cGVzLlxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmogVGhlIG9iamVjdCB0byBwcmludCBvdXQuXG4gKiBAcGFyYW0ge09iamVjdH0gb3B0cyBPcHRpb25hbCBvcHRpb25zIG9iamVjdCB0aGF0IGFsdGVycyB0aGUgb3V0cHV0LlxuICovXG4vKiBsZWdhY3k6IG9iaiwgc2hvd0hpZGRlbiwgZGVwdGgsIGNvbG9ycyovXG5mdW5jdGlvbiBpbnNwZWN0KG9iaiwgb3B0cykge1xuICAvLyBkZWZhdWx0IG9wdGlvbnNcbiAgdmFyIGN0eCA9IHtcbiAgICBzZWVuOiBbXSxcbiAgICBzdHlsaXplOiBzdHlsaXplTm9Db2xvclxuICB9O1xuICAvLyBsZWdhY3kuLi5cbiAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPj0gMykgY3R4LmRlcHRoID0gYXJndW1lbnRzWzJdO1xuICBpZiAoYXJndW1lbnRzLmxlbmd0aCA+PSA0KSBjdHguY29sb3JzID0gYXJndW1lbnRzWzNdO1xuICBpZiAoaXNCb29sZWFuKG9wdHMpKSB7XG4gICAgLy8gbGVnYWN5Li4uXG4gICAgY3R4LnNob3dIaWRkZW4gPSBvcHRzO1xuICB9IGVsc2UgaWYgKG9wdHMpIHtcbiAgICAvLyBnb3QgYW4gXCJvcHRpb25zXCIgb2JqZWN0XG4gICAgZXhwb3J0cy5fZXh0ZW5kKGN0eCwgb3B0cyk7XG4gIH1cbiAgLy8gc2V0IGRlZmF1bHQgb3B0aW9uc1xuICBpZiAoaXNVbmRlZmluZWQoY3R4LnNob3dIaWRkZW4pKSBjdHguc2hvd0hpZGRlbiA9IGZhbHNlO1xuICBpZiAoaXNVbmRlZmluZWQoY3R4LmRlcHRoKSkgY3R4LmRlcHRoID0gMjtcbiAgaWYgKGlzVW5kZWZpbmVkKGN0eC5jb2xvcnMpKSBjdHguY29sb3JzID0gZmFsc2U7XG4gIGlmIChpc1VuZGVmaW5lZChjdHguY3VzdG9tSW5zcGVjdCkpIGN0eC5jdXN0b21JbnNwZWN0ID0gdHJ1ZTtcbiAgaWYgKGN0eC5jb2xvcnMpIGN0eC5zdHlsaXplID0gc3R5bGl6ZVdpdGhDb2xvcjtcbiAgcmV0dXJuIGZvcm1hdFZhbHVlKGN0eCwgb2JqLCBjdHguZGVwdGgpO1xufVxuZXhwb3J0cy5pbnNwZWN0ID0gaW5zcGVjdDtcblxuXG4vLyBodHRwOi8vZW4ud2lraXBlZGlhLm9yZy93aWtpL0FOU0lfZXNjYXBlX2NvZGUjZ3JhcGhpY3Ncbmluc3BlY3QuY29sb3JzID0ge1xuICAnYm9sZCcgOiBbMSwgMjJdLFxuICAnaXRhbGljJyA6IFszLCAyM10sXG4gICd1bmRlcmxpbmUnIDogWzQsIDI0XSxcbiAgJ2ludmVyc2UnIDogWzcsIDI3XSxcbiAgJ3doaXRlJyA6IFszNywgMzldLFxuICAnZ3JleScgOiBbOTAsIDM5XSxcbiAgJ2JsYWNrJyA6IFszMCwgMzldLFxuICAnYmx1ZScgOiBbMzQsIDM5XSxcbiAgJ2N5YW4nIDogWzM2LCAzOV0sXG4gICdncmVlbicgOiBbMzIsIDM5XSxcbiAgJ21hZ2VudGEnIDogWzM1LCAzOV0sXG4gICdyZWQnIDogWzMxLCAzOV0sXG4gICd5ZWxsb3cnIDogWzMzLCAzOV1cbn07XG5cbi8vIERvbid0IHVzZSAnYmx1ZScgbm90IHZpc2libGUgb24gY21kLmV4ZVxuaW5zcGVjdC5zdHlsZXMgPSB7XG4gICdzcGVjaWFsJzogJ2N5YW4nLFxuICAnbnVtYmVyJzogJ3llbGxvdycsXG4gICdib29sZWFuJzogJ3llbGxvdycsXG4gICd1bmRlZmluZWQnOiAnZ3JleScsXG4gICdudWxsJzogJ2JvbGQnLFxuICAnc3RyaW5nJzogJ2dyZWVuJyxcbiAgJ2RhdGUnOiAnbWFnZW50YScsXG4gIC8vIFwibmFtZVwiOiBpbnRlbnRpb25hbGx5IG5vdCBzdHlsaW5nXG4gICdyZWdleHAnOiAncmVkJ1xufTtcblxuXG5mdW5jdGlvbiBzdHlsaXplV2l0aENvbG9yKHN0ciwgc3R5bGVUeXBlKSB7XG4gIHZhciBzdHlsZSA9IGluc3BlY3Quc3R5bGVzW3N0eWxlVHlwZV07XG5cbiAgaWYgKHN0eWxlKSB7XG4gICAgcmV0dXJuICdcXHUwMDFiWycgKyBpbnNwZWN0LmNvbG9yc1tzdHlsZV1bMF0gKyAnbScgKyBzdHIgK1xuICAgICAgICAgICAnXFx1MDAxYlsnICsgaW5zcGVjdC5jb2xvcnNbc3R5bGVdWzFdICsgJ20nO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiBzdHI7XG4gIH1cbn1cblxuXG5mdW5jdGlvbiBzdHlsaXplTm9Db2xvcihzdHIsIHN0eWxlVHlwZSkge1xuICByZXR1cm4gc3RyO1xufVxuXG5cbmZ1bmN0aW9uIGFycmF5VG9IYXNoKGFycmF5KSB7XG4gIHZhciBoYXNoID0ge307XG5cbiAgYXJyYXkuZm9yRWFjaChmdW5jdGlvbih2YWwsIGlkeCkge1xuICAgIGhhc2hbdmFsXSA9IHRydWU7XG4gIH0pO1xuXG4gIHJldHVybiBoYXNoO1xufVxuXG5cbmZ1bmN0aW9uIGZvcm1hdFZhbHVlKGN0eCwgdmFsdWUsIHJlY3Vyc2VUaW1lcykge1xuICAvLyBQcm92aWRlIGEgaG9vayBmb3IgdXNlci1zcGVjaWZpZWQgaW5zcGVjdCBmdW5jdGlvbnMuXG4gIC8vIENoZWNrIHRoYXQgdmFsdWUgaXMgYW4gb2JqZWN0IHdpdGggYW4gaW5zcGVjdCBmdW5jdGlvbiBvbiBpdFxuICBpZiAoY3R4LmN1c3RvbUluc3BlY3QgJiZcbiAgICAgIHZhbHVlICYmXG4gICAgICBpc0Z1bmN0aW9uKHZhbHVlLmluc3BlY3QpICYmXG4gICAgICAvLyBGaWx0ZXIgb3V0IHRoZSB1dGlsIG1vZHVsZSwgaXQncyBpbnNwZWN0IGZ1bmN0aW9uIGlzIHNwZWNpYWxcbiAgICAgIHZhbHVlLmluc3BlY3QgIT09IGV4cG9ydHMuaW5zcGVjdCAmJlxuICAgICAgLy8gQWxzbyBmaWx0ZXIgb3V0IGFueSBwcm90b3R5cGUgb2JqZWN0cyB1c2luZyB0aGUgY2lyY3VsYXIgY2hlY2suXG4gICAgICAhKHZhbHVlLmNvbnN0cnVjdG9yICYmIHZhbHVlLmNvbnN0cnVjdG9yLnByb3RvdHlwZSA9PT0gdmFsdWUpKSB7XG4gICAgdmFyIHJldCA9IHZhbHVlLmluc3BlY3QocmVjdXJzZVRpbWVzLCBjdHgpO1xuICAgIGlmICghaXNTdHJpbmcocmV0KSkge1xuICAgICAgcmV0ID0gZm9ybWF0VmFsdWUoY3R4LCByZXQsIHJlY3Vyc2VUaW1lcyk7XG4gICAgfVxuICAgIHJldHVybiByZXQ7XG4gIH1cblxuICAvLyBQcmltaXRpdmUgdHlwZXMgY2Fubm90IGhhdmUgcHJvcGVydGllc1xuICB2YXIgcHJpbWl0aXZlID0gZm9ybWF0UHJpbWl0aXZlKGN0eCwgdmFsdWUpO1xuICBpZiAocHJpbWl0aXZlKSB7XG4gICAgcmV0dXJuIHByaW1pdGl2ZTtcbiAgfVxuXG4gIC8vIExvb2sgdXAgdGhlIGtleXMgb2YgdGhlIG9iamVjdC5cbiAgdmFyIGtleXMgPSBPYmplY3Qua2V5cyh2YWx1ZSk7XG4gIHZhciB2aXNpYmxlS2V5cyA9IGFycmF5VG9IYXNoKGtleXMpO1xuXG4gIGlmIChjdHguc2hvd0hpZGRlbikge1xuICAgIGtleXMgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyh2YWx1ZSk7XG4gIH1cblxuICAvLyBJRSBkb2Vzbid0IG1ha2UgZXJyb3IgZmllbGRzIG5vbi1lbnVtZXJhYmxlXG4gIC8vIGh0dHA6Ly9tc2RuLm1pY3Jvc29mdC5jb20vZW4tdXMvbGlicmFyeS9pZS9kd3c1MnNidCh2PXZzLjk0KS5hc3B4XG4gIGlmIChpc0Vycm9yKHZhbHVlKVxuICAgICAgJiYgKGtleXMuaW5kZXhPZignbWVzc2FnZScpID49IDAgfHwga2V5cy5pbmRleE9mKCdkZXNjcmlwdGlvbicpID49IDApKSB7XG4gICAgcmV0dXJuIGZvcm1hdEVycm9yKHZhbHVlKTtcbiAgfVxuXG4gIC8vIFNvbWUgdHlwZSBvZiBvYmplY3Qgd2l0aG91dCBwcm9wZXJ0aWVzIGNhbiBiZSBzaG9ydGN1dHRlZC5cbiAgaWYgKGtleXMubGVuZ3RoID09PSAwKSB7XG4gICAgaWYgKGlzRnVuY3Rpb24odmFsdWUpKSB7XG4gICAgICB2YXIgbmFtZSA9IHZhbHVlLm5hbWUgPyAnOiAnICsgdmFsdWUubmFtZSA6ICcnO1xuICAgICAgcmV0dXJuIGN0eC5zdHlsaXplKCdbRnVuY3Rpb24nICsgbmFtZSArICddJywgJ3NwZWNpYWwnKTtcbiAgICB9XG4gICAgaWYgKGlzUmVnRXhwKHZhbHVlKSkge1xuICAgICAgcmV0dXJuIGN0eC5zdHlsaXplKFJlZ0V4cC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbCh2YWx1ZSksICdyZWdleHAnKTtcbiAgICB9XG4gICAgaWYgKGlzRGF0ZSh2YWx1ZSkpIHtcbiAgICAgIHJldHVybiBjdHguc3R5bGl6ZShEYXRlLnByb3RvdHlwZS50b1N0cmluZy5jYWxsKHZhbHVlKSwgJ2RhdGUnKTtcbiAgICB9XG4gICAgaWYgKGlzRXJyb3IodmFsdWUpKSB7XG4gICAgICByZXR1cm4gZm9ybWF0RXJyb3IodmFsdWUpO1xuICAgIH1cbiAgfVxuXG4gIHZhciBiYXNlID0gJycsIGFycmF5ID0gZmFsc2UsIGJyYWNlcyA9IFsneycsICd9J107XG5cbiAgLy8gTWFrZSBBcnJheSBzYXkgdGhhdCB0aGV5IGFyZSBBcnJheVxuICBpZiAoaXNBcnJheSh2YWx1ZSkpIHtcbiAgICBhcnJheSA9IHRydWU7XG4gICAgYnJhY2VzID0gWydbJywgJ10nXTtcbiAgfVxuXG4gIC8vIE1ha2UgZnVuY3Rpb25zIHNheSB0aGF0IHRoZXkgYXJlIGZ1bmN0aW9uc1xuICBpZiAoaXNGdW5jdGlvbih2YWx1ZSkpIHtcbiAgICB2YXIgbiA9IHZhbHVlLm5hbWUgPyAnOiAnICsgdmFsdWUubmFtZSA6ICcnO1xuICAgIGJhc2UgPSAnIFtGdW5jdGlvbicgKyBuICsgJ10nO1xuICB9XG5cbiAgLy8gTWFrZSBSZWdFeHBzIHNheSB0aGF0IHRoZXkgYXJlIFJlZ0V4cHNcbiAgaWYgKGlzUmVnRXhwKHZhbHVlKSkge1xuICAgIGJhc2UgPSAnICcgKyBSZWdFeHAucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwodmFsdWUpO1xuICB9XG5cbiAgLy8gTWFrZSBkYXRlcyB3aXRoIHByb3BlcnRpZXMgZmlyc3Qgc2F5IHRoZSBkYXRlXG4gIGlmIChpc0RhdGUodmFsdWUpKSB7XG4gICAgYmFzZSA9ICcgJyArIERhdGUucHJvdG90eXBlLnRvVVRDU3RyaW5nLmNhbGwodmFsdWUpO1xuICB9XG5cbiAgLy8gTWFrZSBlcnJvciB3aXRoIG1lc3NhZ2UgZmlyc3Qgc2F5IHRoZSBlcnJvclxuICBpZiAoaXNFcnJvcih2YWx1ZSkpIHtcbiAgICBiYXNlID0gJyAnICsgZm9ybWF0RXJyb3IodmFsdWUpO1xuICB9XG5cbiAgaWYgKGtleXMubGVuZ3RoID09PSAwICYmICghYXJyYXkgfHwgdmFsdWUubGVuZ3RoID09IDApKSB7XG4gICAgcmV0dXJuIGJyYWNlc1swXSArIGJhc2UgKyBicmFjZXNbMV07XG4gIH1cblxuICBpZiAocmVjdXJzZVRpbWVzIDwgMCkge1xuICAgIGlmIChpc1JlZ0V4cCh2YWx1ZSkpIHtcbiAgICAgIHJldHVybiBjdHguc3R5bGl6ZShSZWdFeHAucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwodmFsdWUpLCAncmVnZXhwJyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBjdHguc3R5bGl6ZSgnW09iamVjdF0nLCAnc3BlY2lhbCcpO1xuICAgIH1cbiAgfVxuXG4gIGN0eC5zZWVuLnB1c2godmFsdWUpO1xuXG4gIHZhciBvdXRwdXQ7XG4gIGlmIChhcnJheSkge1xuICAgIG91dHB1dCA9IGZvcm1hdEFycmF5KGN0eCwgdmFsdWUsIHJlY3Vyc2VUaW1lcywgdmlzaWJsZUtleXMsIGtleXMpO1xuICB9IGVsc2Uge1xuICAgIG91dHB1dCA9IGtleXMubWFwKGZ1bmN0aW9uKGtleSkge1xuICAgICAgcmV0dXJuIGZvcm1hdFByb3BlcnR5KGN0eCwgdmFsdWUsIHJlY3Vyc2VUaW1lcywgdmlzaWJsZUtleXMsIGtleSwgYXJyYXkpO1xuICAgIH0pO1xuICB9XG5cbiAgY3R4LnNlZW4ucG9wKCk7XG5cbiAgcmV0dXJuIHJlZHVjZVRvU2luZ2xlU3RyaW5nKG91dHB1dCwgYmFzZSwgYnJhY2VzKTtcbn1cblxuXG5mdW5jdGlvbiBmb3JtYXRQcmltaXRpdmUoY3R4LCB2YWx1ZSkge1xuICBpZiAoaXNVbmRlZmluZWQodmFsdWUpKVxuICAgIHJldHVybiBjdHguc3R5bGl6ZSgndW5kZWZpbmVkJywgJ3VuZGVmaW5lZCcpO1xuICBpZiAoaXNTdHJpbmcodmFsdWUpKSB7XG4gICAgdmFyIHNpbXBsZSA9ICdcXCcnICsgSlNPTi5zdHJpbmdpZnkodmFsdWUpLnJlcGxhY2UoL15cInxcIiQvZywgJycpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAucmVwbGFjZSgvJy9nLCBcIlxcXFwnXCIpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAucmVwbGFjZSgvXFxcXFwiL2csICdcIicpICsgJ1xcJyc7XG4gICAgcmV0dXJuIGN0eC5zdHlsaXplKHNpbXBsZSwgJ3N0cmluZycpO1xuICB9XG4gIGlmIChpc051bWJlcih2YWx1ZSkpXG4gICAgcmV0dXJuIGN0eC5zdHlsaXplKCcnICsgdmFsdWUsICdudW1iZXInKTtcbiAgaWYgKGlzQm9vbGVhbih2YWx1ZSkpXG4gICAgcmV0dXJuIGN0eC5zdHlsaXplKCcnICsgdmFsdWUsICdib29sZWFuJyk7XG4gIC8vIEZvciBzb21lIHJlYXNvbiB0eXBlb2YgbnVsbCBpcyBcIm9iamVjdFwiLCBzbyBzcGVjaWFsIGNhc2UgaGVyZS5cbiAgaWYgKGlzTnVsbCh2YWx1ZSkpXG4gICAgcmV0dXJuIGN0eC5zdHlsaXplKCdudWxsJywgJ251bGwnKTtcbn1cblxuXG5mdW5jdGlvbiBmb3JtYXRFcnJvcih2YWx1ZSkge1xuICByZXR1cm4gJ1snICsgRXJyb3IucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwodmFsdWUpICsgJ10nO1xufVxuXG5cbmZ1bmN0aW9uIGZvcm1hdEFycmF5KGN0eCwgdmFsdWUsIHJlY3Vyc2VUaW1lcywgdmlzaWJsZUtleXMsIGtleXMpIHtcbiAgdmFyIG91dHB1dCA9IFtdO1xuICBmb3IgKHZhciBpID0gMCwgbCA9IHZhbHVlLmxlbmd0aDsgaSA8IGw7ICsraSkge1xuICAgIGlmIChoYXNPd25Qcm9wZXJ0eSh2YWx1ZSwgU3RyaW5nKGkpKSkge1xuICAgICAgb3V0cHV0LnB1c2goZm9ybWF0UHJvcGVydHkoY3R4LCB2YWx1ZSwgcmVjdXJzZVRpbWVzLCB2aXNpYmxlS2V5cyxcbiAgICAgICAgICBTdHJpbmcoaSksIHRydWUpKTtcbiAgICB9IGVsc2Uge1xuICAgICAgb3V0cHV0LnB1c2goJycpO1xuICAgIH1cbiAgfVxuICBrZXlzLmZvckVhY2goZnVuY3Rpb24oa2V5KSB7XG4gICAgaWYgKCFrZXkubWF0Y2goL15cXGQrJC8pKSB7XG4gICAgICBvdXRwdXQucHVzaChmb3JtYXRQcm9wZXJ0eShjdHgsIHZhbHVlLCByZWN1cnNlVGltZXMsIHZpc2libGVLZXlzLFxuICAgICAgICAgIGtleSwgdHJ1ZSkpO1xuICAgIH1cbiAgfSk7XG4gIHJldHVybiBvdXRwdXQ7XG59XG5cblxuZnVuY3Rpb24gZm9ybWF0UHJvcGVydHkoY3R4LCB2YWx1ZSwgcmVjdXJzZVRpbWVzLCB2aXNpYmxlS2V5cywga2V5LCBhcnJheSkge1xuICB2YXIgbmFtZSwgc3RyLCBkZXNjO1xuICBkZXNjID0gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcih2YWx1ZSwga2V5KSB8fCB7IHZhbHVlOiB2YWx1ZVtrZXldIH07XG4gIGlmIChkZXNjLmdldCkge1xuICAgIGlmIChkZXNjLnNldCkge1xuICAgICAgc3RyID0gY3R4LnN0eWxpemUoJ1tHZXR0ZXIvU2V0dGVyXScsICdzcGVjaWFsJyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHN0ciA9IGN0eC5zdHlsaXplKCdbR2V0dGVyXScsICdzcGVjaWFsJyk7XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIGlmIChkZXNjLnNldCkge1xuICAgICAgc3RyID0gY3R4LnN0eWxpemUoJ1tTZXR0ZXJdJywgJ3NwZWNpYWwnKTtcbiAgICB9XG4gIH1cbiAgaWYgKCFoYXNPd25Qcm9wZXJ0eSh2aXNpYmxlS2V5cywga2V5KSkge1xuICAgIG5hbWUgPSAnWycgKyBrZXkgKyAnXSc7XG4gIH1cbiAgaWYgKCFzdHIpIHtcbiAgICBpZiAoY3R4LnNlZW4uaW5kZXhPZihkZXNjLnZhbHVlKSA8IDApIHtcbiAgICAgIGlmIChpc051bGwocmVjdXJzZVRpbWVzKSkge1xuICAgICAgICBzdHIgPSBmb3JtYXRWYWx1ZShjdHgsIGRlc2MudmFsdWUsIG51bGwpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgc3RyID0gZm9ybWF0VmFsdWUoY3R4LCBkZXNjLnZhbHVlLCByZWN1cnNlVGltZXMgLSAxKTtcbiAgICAgIH1cbiAgICAgIGlmIChzdHIuaW5kZXhPZignXFxuJykgPiAtMSkge1xuICAgICAgICBpZiAoYXJyYXkpIHtcbiAgICAgICAgICBzdHIgPSBzdHIuc3BsaXQoJ1xcbicpLm1hcChmdW5jdGlvbihsaW5lKSB7XG4gICAgICAgICAgICByZXR1cm4gJyAgJyArIGxpbmU7XG4gICAgICAgICAgfSkuam9pbignXFxuJykuc3Vic3RyKDIpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHN0ciA9ICdcXG4nICsgc3RyLnNwbGl0KCdcXG4nKS5tYXAoZnVuY3Rpb24obGluZSkge1xuICAgICAgICAgICAgcmV0dXJuICcgICAnICsgbGluZTtcbiAgICAgICAgICB9KS5qb2luKCdcXG4nKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBzdHIgPSBjdHguc3R5bGl6ZSgnW0NpcmN1bGFyXScsICdzcGVjaWFsJyk7XG4gICAgfVxuICB9XG4gIGlmIChpc1VuZGVmaW5lZChuYW1lKSkge1xuICAgIGlmIChhcnJheSAmJiBrZXkubWF0Y2goL15cXGQrJC8pKSB7XG4gICAgICByZXR1cm4gc3RyO1xuICAgIH1cbiAgICBuYW1lID0gSlNPTi5zdHJpbmdpZnkoJycgKyBrZXkpO1xuICAgIGlmIChuYW1lLm1hdGNoKC9eXCIoW2EtekEtWl9dW2EtekEtWl8wLTldKilcIiQvKSkge1xuICAgICAgbmFtZSA9IG5hbWUuc3Vic3RyKDEsIG5hbWUubGVuZ3RoIC0gMik7XG4gICAgICBuYW1lID0gY3R4LnN0eWxpemUobmFtZSwgJ25hbWUnKTtcbiAgICB9IGVsc2Uge1xuICAgICAgbmFtZSA9IG5hbWUucmVwbGFjZSgvJy9nLCBcIlxcXFwnXCIpXG4gICAgICAgICAgICAgICAgIC5yZXBsYWNlKC9cXFxcXCIvZywgJ1wiJylcbiAgICAgICAgICAgICAgICAgLnJlcGxhY2UoLyheXCJ8XCIkKS9nLCBcIidcIik7XG4gICAgICBuYW1lID0gY3R4LnN0eWxpemUobmFtZSwgJ3N0cmluZycpO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBuYW1lICsgJzogJyArIHN0cjtcbn1cblxuXG5mdW5jdGlvbiByZWR1Y2VUb1NpbmdsZVN0cmluZyhvdXRwdXQsIGJhc2UsIGJyYWNlcykge1xuICB2YXIgbnVtTGluZXNFc3QgPSAwO1xuICB2YXIgbGVuZ3RoID0gb3V0cHV0LnJlZHVjZShmdW5jdGlvbihwcmV2LCBjdXIpIHtcbiAgICBudW1MaW5lc0VzdCsrO1xuICAgIGlmIChjdXIuaW5kZXhPZignXFxuJykgPj0gMCkgbnVtTGluZXNFc3QrKztcbiAgICByZXR1cm4gcHJldiArIGN1ci5yZXBsYWNlKC9cXHUwMDFiXFxbXFxkXFxkP20vZywgJycpLmxlbmd0aCArIDE7XG4gIH0sIDApO1xuXG4gIGlmIChsZW5ndGggPiA2MCkge1xuICAgIHJldHVybiBicmFjZXNbMF0gK1xuICAgICAgICAgICAoYmFzZSA9PT0gJycgPyAnJyA6IGJhc2UgKyAnXFxuICcpICtcbiAgICAgICAgICAgJyAnICtcbiAgICAgICAgICAgb3V0cHV0LmpvaW4oJyxcXG4gICcpICtcbiAgICAgICAgICAgJyAnICtcbiAgICAgICAgICAgYnJhY2VzWzFdO1xuICB9XG5cbiAgcmV0dXJuIGJyYWNlc1swXSArIGJhc2UgKyAnICcgKyBvdXRwdXQuam9pbignLCAnKSArICcgJyArIGJyYWNlc1sxXTtcbn1cblxuXG4vLyBOT1RFOiBUaGVzZSB0eXBlIGNoZWNraW5nIGZ1bmN0aW9ucyBpbnRlbnRpb25hbGx5IGRvbid0IHVzZSBgaW5zdGFuY2VvZmBcbi8vIGJlY2F1c2UgaXQgaXMgZnJhZ2lsZSBhbmQgY2FuIGJlIGVhc2lseSBmYWtlZCB3aXRoIGBPYmplY3QuY3JlYXRlKClgLlxuZnVuY3Rpb24gaXNBcnJheShhcikge1xuICByZXR1cm4gQXJyYXkuaXNBcnJheShhcik7XG59XG5leHBvcnRzLmlzQXJyYXkgPSBpc0FycmF5O1xuXG5mdW5jdGlvbiBpc0Jvb2xlYW4oYXJnKSB7XG4gIHJldHVybiB0eXBlb2YgYXJnID09PSAnYm9vbGVhbic7XG59XG5leHBvcnRzLmlzQm9vbGVhbiA9IGlzQm9vbGVhbjtcblxuZnVuY3Rpb24gaXNOdWxsKGFyZykge1xuICByZXR1cm4gYXJnID09PSBudWxsO1xufVxuZXhwb3J0cy5pc051bGwgPSBpc051bGw7XG5cbmZ1bmN0aW9uIGlzTnVsbE9yVW5kZWZpbmVkKGFyZykge1xuICByZXR1cm4gYXJnID09IG51bGw7XG59XG5leHBvcnRzLmlzTnVsbE9yVW5kZWZpbmVkID0gaXNOdWxsT3JVbmRlZmluZWQ7XG5cbmZ1bmN0aW9uIGlzTnVtYmVyKGFyZykge1xuICByZXR1cm4gdHlwZW9mIGFyZyA9PT0gJ251bWJlcic7XG59XG5leHBvcnRzLmlzTnVtYmVyID0gaXNOdW1iZXI7XG5cbmZ1bmN0aW9uIGlzU3RyaW5nKGFyZykge1xuICByZXR1cm4gdHlwZW9mIGFyZyA9PT0gJ3N0cmluZyc7XG59XG5leHBvcnRzLmlzU3RyaW5nID0gaXNTdHJpbmc7XG5cbmZ1bmN0aW9uIGlzU3ltYm9sKGFyZykge1xuICByZXR1cm4gdHlwZW9mIGFyZyA9PT0gJ3N5bWJvbCc7XG59XG5leHBvcnRzLmlzU3ltYm9sID0gaXNTeW1ib2w7XG5cbmZ1bmN0aW9uIGlzVW5kZWZpbmVkKGFyZykge1xuICByZXR1cm4gYXJnID09PSB2b2lkIDA7XG59XG5leHBvcnRzLmlzVW5kZWZpbmVkID0gaXNVbmRlZmluZWQ7XG5cbmZ1bmN0aW9uIGlzUmVnRXhwKHJlKSB7XG4gIHJldHVybiBpc09iamVjdChyZSkgJiYgb2JqZWN0VG9TdHJpbmcocmUpID09PSAnW29iamVjdCBSZWdFeHBdJztcbn1cbmV4cG9ydHMuaXNSZWdFeHAgPSBpc1JlZ0V4cDtcblxuZnVuY3Rpb24gaXNPYmplY3QoYXJnKSB7XG4gIHJldHVybiB0eXBlb2YgYXJnID09PSAnb2JqZWN0JyAmJiBhcmcgIT09IG51bGw7XG59XG5leHBvcnRzLmlzT2JqZWN0ID0gaXNPYmplY3Q7XG5cbmZ1bmN0aW9uIGlzRGF0ZShkKSB7XG4gIHJldHVybiBpc09iamVjdChkKSAmJiBvYmplY3RUb1N0cmluZyhkKSA9PT0gJ1tvYmplY3QgRGF0ZV0nO1xufVxuZXhwb3J0cy5pc0RhdGUgPSBpc0RhdGU7XG5cbmZ1bmN0aW9uIGlzRXJyb3IoZSkge1xuICByZXR1cm4gaXNPYmplY3QoZSkgJiZcbiAgICAgIChvYmplY3RUb1N0cmluZyhlKSA9PT0gJ1tvYmplY3QgRXJyb3JdJyB8fCBlIGluc3RhbmNlb2YgRXJyb3IpO1xufVxuZXhwb3J0cy5pc0Vycm9yID0gaXNFcnJvcjtcblxuZnVuY3Rpb24gaXNGdW5jdGlvbihhcmcpIHtcbiAgcmV0dXJuIHR5cGVvZiBhcmcgPT09ICdmdW5jdGlvbic7XG59XG5leHBvcnRzLmlzRnVuY3Rpb24gPSBpc0Z1bmN0aW9uO1xuXG5mdW5jdGlvbiBpc1ByaW1pdGl2ZShhcmcpIHtcbiAgcmV0dXJuIGFyZyA9PT0gbnVsbCB8fFxuICAgICAgICAgdHlwZW9mIGFyZyA9PT0gJ2Jvb2xlYW4nIHx8XG4gICAgICAgICB0eXBlb2YgYXJnID09PSAnbnVtYmVyJyB8fFxuICAgICAgICAgdHlwZW9mIGFyZyA9PT0gJ3N0cmluZycgfHxcbiAgICAgICAgIHR5cGVvZiBhcmcgPT09ICdzeW1ib2wnIHx8ICAvLyBFUzYgc3ltYm9sXG4gICAgICAgICB0eXBlb2YgYXJnID09PSAndW5kZWZpbmVkJztcbn1cbmV4cG9ydHMuaXNQcmltaXRpdmUgPSBpc1ByaW1pdGl2ZTtcblxuZXhwb3J0cy5pc0J1ZmZlciA9IHJlcXVpcmUoJy4vc3VwcG9ydC9pc0J1ZmZlcicpO1xuXG5mdW5jdGlvbiBvYmplY3RUb1N0cmluZyhvKSB7XG4gIHJldHVybiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwobyk7XG59XG5cblxuZnVuY3Rpb24gcGFkKG4pIHtcbiAgcmV0dXJuIG4gPCAxMCA/ICcwJyArIG4udG9TdHJpbmcoMTApIDogbi50b1N0cmluZygxMCk7XG59XG5cblxudmFyIG1vbnRocyA9IFsnSmFuJywgJ0ZlYicsICdNYXInLCAnQXByJywgJ01heScsICdKdW4nLCAnSnVsJywgJ0F1ZycsICdTZXAnLFxuICAgICAgICAgICAgICAnT2N0JywgJ05vdicsICdEZWMnXTtcblxuLy8gMjYgRmViIDE2OjE5OjM0XG5mdW5jdGlvbiB0aW1lc3RhbXAoKSB7XG4gIHZhciBkID0gbmV3IERhdGUoKTtcbiAgdmFyIHRpbWUgPSBbcGFkKGQuZ2V0SG91cnMoKSksXG4gICAgICAgICAgICAgIHBhZChkLmdldE1pbnV0ZXMoKSksXG4gICAgICAgICAgICAgIHBhZChkLmdldFNlY29uZHMoKSldLmpvaW4oJzonKTtcbiAgcmV0dXJuIFtkLmdldERhdGUoKSwgbW9udGhzW2QuZ2V0TW9udGgoKV0sIHRpbWVdLmpvaW4oJyAnKTtcbn1cblxuXG4vLyBsb2cgaXMganVzdCBhIHRoaW4gd3JhcHBlciB0byBjb25zb2xlLmxvZyB0aGF0IHByZXBlbmRzIGEgdGltZXN0YW1wXG5leHBvcnRzLmxvZyA9IGZ1bmN0aW9uKCkge1xuICBjb25zb2xlLmxvZygnJXMgLSAlcycsIHRpbWVzdGFtcCgpLCBleHBvcnRzLmZvcm1hdC5hcHBseShleHBvcnRzLCBhcmd1bWVudHMpKTtcbn07XG5cblxuLyoqXG4gKiBJbmhlcml0IHRoZSBwcm90b3R5cGUgbWV0aG9kcyBmcm9tIG9uZSBjb25zdHJ1Y3RvciBpbnRvIGFub3RoZXIuXG4gKlxuICogVGhlIEZ1bmN0aW9uLnByb3RvdHlwZS5pbmhlcml0cyBmcm9tIGxhbmcuanMgcmV3cml0dGVuIGFzIGEgc3RhbmRhbG9uZVxuICogZnVuY3Rpb24gKG5vdCBvbiBGdW5jdGlvbi5wcm90b3R5cGUpLiBOT1RFOiBJZiB0aGlzIGZpbGUgaXMgdG8gYmUgbG9hZGVkXG4gKiBkdXJpbmcgYm9vdHN0cmFwcGluZyB0aGlzIGZ1bmN0aW9uIG5lZWRzIHRvIGJlIHJld3JpdHRlbiB1c2luZyBzb21lIG5hdGl2ZVxuICogZnVuY3Rpb25zIGFzIHByb3RvdHlwZSBzZXR1cCB1c2luZyBub3JtYWwgSmF2YVNjcmlwdCBkb2VzIG5vdCB3b3JrIGFzXG4gKiBleHBlY3RlZCBkdXJpbmcgYm9vdHN0cmFwcGluZyAoc2VlIG1pcnJvci5qcyBpbiByMTE0OTAzKS5cbiAqXG4gKiBAcGFyYW0ge2Z1bmN0aW9ufSBjdG9yIENvbnN0cnVjdG9yIGZ1bmN0aW9uIHdoaWNoIG5lZWRzIHRvIGluaGVyaXQgdGhlXG4gKiAgICAgcHJvdG90eXBlLlxuICogQHBhcmFtIHtmdW5jdGlvbn0gc3VwZXJDdG9yIENvbnN0cnVjdG9yIGZ1bmN0aW9uIHRvIGluaGVyaXQgcHJvdG90eXBlIGZyb20uXG4gKi9cbmV4cG9ydHMuaW5oZXJpdHMgPSByZXF1aXJlKCdpbmhlcml0cycpO1xuXG5leHBvcnRzLl9leHRlbmQgPSBmdW5jdGlvbihvcmlnaW4sIGFkZCkge1xuICAvLyBEb24ndCBkbyBhbnl0aGluZyBpZiBhZGQgaXNuJ3QgYW4gb2JqZWN0XG4gIGlmICghYWRkIHx8ICFpc09iamVjdChhZGQpKSByZXR1cm4gb3JpZ2luO1xuXG4gIHZhciBrZXlzID0gT2JqZWN0LmtleXMoYWRkKTtcbiAgdmFyIGkgPSBrZXlzLmxlbmd0aDtcbiAgd2hpbGUgKGktLSkge1xuICAgIG9yaWdpbltrZXlzW2ldXSA9IGFkZFtrZXlzW2ldXTtcbiAgfVxuICByZXR1cm4gb3JpZ2luO1xufTtcblxuZnVuY3Rpb24gaGFzT3duUHJvcGVydHkob2JqLCBwcm9wKSB7XG4gIHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKTtcbn1cbiIsIi8vIGdldFVzZXJNZWRpYSBoZWxwZXIgYnkgQEhlbnJpa0pvcmV0ZWdcbnZhciBhZGFwdGVyID0gcmVxdWlyZSgnd2VicnRjLWFkYXB0ZXItdGVzdCcpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChjb25zdHJhaW50cywgY2IpIHtcbiAgICB2YXIgb3B0aW9ucywgZXJyb3I7XG4gICAgdmFyIGhhdmVPcHRzID0gYXJndW1lbnRzLmxlbmd0aCA9PT0gMjtcbiAgICB2YXIgZGVmYXVsdE9wdHMgPSB7dmlkZW86IHRydWUsIGF1ZGlvOiB0cnVlfTtcblxuICAgIHZhciBkZW5pZWQgPSAnUGVybWlzc2lvbkRlbmllZEVycm9yJztcbiAgICB2YXIgYWx0RGVuaWVkID0gJ1BFUk1JU1NJT05fREVOSUVEJztcbiAgICB2YXIgbm90U2F0aXNmaWVkID0gJ0NvbnN0cmFpbnROb3RTYXRpc2ZpZWRFcnJvcic7XG5cbiAgICAvLyBtYWtlIGNvbnN0cmFpbnRzIG9wdGlvbmFsXG4gICAgaWYgKCFoYXZlT3B0cykge1xuICAgICAgICBjYiA9IGNvbnN0cmFpbnRzO1xuICAgICAgICBjb25zdHJhaW50cyA9IGRlZmF1bHRPcHRzO1xuICAgIH1cblxuICAgIC8vIHRyZWF0IGxhY2sgb2YgYnJvd3NlciBzdXBwb3J0IGxpa2UgYW4gZXJyb3JcbiAgICBpZiAoIW5hdmlnYXRvci5nZXRVc2VyTWVkaWEpIHtcbiAgICAgICAgLy8gdGhyb3cgcHJvcGVyIGVycm9yIHBlciBzcGVjXG4gICAgICAgIGVycm9yID0gbmV3IEVycm9yKCdNZWRpYVN0cmVhbUVycm9yJyk7XG4gICAgICAgIGVycm9yLm5hbWUgPSAnTm90U3VwcG9ydGVkRXJyb3InO1xuXG4gICAgICAgIC8vIGtlZXAgYWxsIGNhbGxiYWNrcyBhc3luY1xuICAgICAgICByZXR1cm4gd2luZG93LnNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgY2IoZXJyb3IpO1xuICAgICAgICB9LCAwKTtcbiAgICB9XG5cbiAgICAvLyBub3JtYWxpemUgZXJyb3IgaGFuZGxpbmcgd2hlbiBubyBtZWRpYSB0eXBlcyBhcmUgcmVxdWVzdGVkXG4gICAgaWYgKCFjb25zdHJhaW50cy5hdWRpbyAmJiAhY29uc3RyYWludHMudmlkZW8pIHtcbiAgICAgICAgZXJyb3IgPSBuZXcgRXJyb3IoJ01lZGlhU3RyZWFtRXJyb3InKTtcbiAgICAgICAgZXJyb3IubmFtZSA9ICdOb01lZGlhUmVxdWVzdGVkRXJyb3InO1xuXG4gICAgICAgIC8vIGtlZXAgYWxsIGNhbGxiYWNrcyBhc3luY1xuICAgICAgICByZXR1cm4gd2luZG93LnNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgY2IoZXJyb3IpO1xuICAgICAgICB9LCAwKTtcbiAgICB9XG5cbiAgICAvLyB0ZXN0aW5nIHN1cHBvcnRcbiAgICBpZiAobG9jYWxTdG9yYWdlICYmIGxvY2FsU3RvcmFnZS51c2VGaXJlZm94RmFrZURldmljZSA9PT0gXCJ0cnVlXCIpIHtcbiAgICAgICAgY29uc3RyYWludHMuZmFrZSA9IHRydWU7XG4gICAgfVxuXG4gICAgbmF2aWdhdG9yLmdldFVzZXJNZWRpYShjb25zdHJhaW50cywgZnVuY3Rpb24gKHN0cmVhbSkge1xuICAgICAgICBjYihudWxsLCBzdHJlYW0pO1xuICAgIH0sIGZ1bmN0aW9uIChlcnIpIHtcbiAgICAgICAgdmFyIGVycm9yO1xuICAgICAgICAvLyBjb2VyY2UgaW50byBhbiBlcnJvciBvYmplY3Qgc2luY2UgRkYgZ2l2ZXMgdXMgYSBzdHJpbmdcbiAgICAgICAgLy8gdGhlcmUgYXJlIG9ubHkgdHdvIHZhbGlkIG5hbWVzIGFjY29yZGluZyB0byB0aGUgc3BlY1xuICAgICAgICAvLyB3ZSBjb2VyY2UgYWxsIG5vbi1kZW5pZWQgdG8gXCJjb25zdHJhaW50IG5vdCBzYXRpc2ZpZWRcIi5cbiAgICAgICAgaWYgKHR5cGVvZiBlcnIgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICBlcnJvciA9IG5ldyBFcnJvcignTWVkaWFTdHJlYW1FcnJvcicpO1xuICAgICAgICAgICAgaWYgKGVyciA9PT0gZGVuaWVkIHx8IGVyciA9PT0gYWx0RGVuaWVkKSB7XG4gICAgICAgICAgICAgICAgZXJyb3IubmFtZSA9IGRlbmllZDtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgZXJyb3IubmFtZSA9IG5vdFNhdGlzZmllZDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIC8vIGlmIHdlIGdldCBhbiBlcnJvciBvYmplY3QgbWFrZSBzdXJlICcubmFtZScgcHJvcGVydHkgaXMgc2V0XG4gICAgICAgICAgICAvLyBhY2NvcmRpbmcgdG8gc3BlYzogaHR0cDovL2Rldi53My5vcmcvMjAxMS93ZWJydGMvZWRpdG9yL2dldHVzZXJtZWRpYS5odG1sI25hdmlnYXRvcnVzZXJtZWRpYWVycm9yLWFuZC1uYXZpZ2F0b3J1c2VybWVkaWFlcnJvcmNhbGxiYWNrXG4gICAgICAgICAgICBlcnJvciA9IGVycjtcbiAgICAgICAgICAgIGlmICghZXJyb3IubmFtZSkge1xuICAgICAgICAgICAgICAgIC8vIHRoaXMgaXMgbGlrZWx5IGNocm9tZSB3aGljaFxuICAgICAgICAgICAgICAgIC8vIHNldHMgYSBwcm9wZXJ0eSBjYWxsZWQgXCJFUlJPUl9ERU5JRURcIiBvbiB0aGUgZXJyb3Igb2JqZWN0XG4gICAgICAgICAgICAgICAgLy8gaWYgc28gd2UgbWFrZSBzdXJlIHRvIHNldCBhIG5hbWVcbiAgICAgICAgICAgICAgICBpZiAoZXJyb3JbZGVuaWVkXSkge1xuICAgICAgICAgICAgICAgICAgICBlcnIubmFtZSA9IGRlbmllZDtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBlcnIubmFtZSA9IG5vdFNhdGlzZmllZDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBjYihlcnJvcik7XG4gICAgfSk7XG59O1xuIiwiLypcbiAqICBDb3B5cmlnaHQgKGMpIDIwMTYgVGhlIFdlYlJUQyBwcm9qZWN0IGF1dGhvcnMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGEgQlNELXN0eWxlIGxpY2Vuc2VcbiAqICB0aGF0IGNhbiBiZSBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGluIHRoZSByb290IG9mIHRoZSBzb3VyY2VcbiAqICB0cmVlLlxuICovXG5cbi8qIE1vcmUgaW5mb3JtYXRpb24gYWJvdXQgdGhlc2Ugb3B0aW9ucyBhdCBqc2hpbnQuY29tL2RvY3Mvb3B0aW9ucyAqL1xuLyoganNoaW50IGJyb3dzZXI6IHRydWUsIGNhbWVsY2FzZTogdHJ1ZSwgY3VybHk6IHRydWUsIGRldmVsOiB0cnVlLFxuICAgZXFlcWVxOiB0cnVlLCBmb3JpbjogZmFsc2UsIGdsb2JhbHN0cmljdDogdHJ1ZSwgbm9kZTogdHJ1ZSxcbiAgIHF1b3RtYXJrOiBzaW5nbGUsIHVuZGVmOiB0cnVlLCB1bnVzZWQ6IHN0cmljdCAqL1xuLyogZ2xvYmFsIG1velJUQ0ljZUNhbmRpZGF0ZSwgbW96UlRDUGVlckNvbm5lY3Rpb24sIFByb21pc2UsXG5tb3pSVENTZXNzaW9uRGVzY3JpcHRpb24sIHdlYmtpdFJUQ1BlZXJDb25uZWN0aW9uLCBNZWRpYVN0cmVhbVRyYWNrLFxuTWVkaWFTdHJlYW0sIFJUQ0ljZUdhdGhlcmVyLCBSVENJY2VUcmFuc3BvcnQsIFJUQ0R0bHNUcmFuc3BvcnQsXG5SVENSdHBTZW5kZXIsIFJUQ1J0cFJlY2VpdmVyKi9cbi8qIGV4cG9ydGVkIHRyYWNlLHJlcXVlc3RVc2VyTWVkaWEgKi9cblxuJ3VzZSBzdHJpY3QnO1xuXG52YXIgZ2V0VXNlck1lZGlhID0gbnVsbDtcbnZhciBhdHRhY2hNZWRpYVN0cmVhbSA9IG51bGw7XG52YXIgcmVhdHRhY2hNZWRpYVN0cmVhbSA9IG51bGw7XG52YXIgd2VicnRjRGV0ZWN0ZWRCcm93c2VyID0gbnVsbDtcbnZhciB3ZWJydGNEZXRlY3RlZFZlcnNpb24gPSBudWxsO1xudmFyIHdlYnJ0Y01pbmltdW1WZXJzaW9uID0gbnVsbDtcbnZhciB3ZWJydGNVdGlscyA9IHtcbiAgbG9nOiBmdW5jdGlvbigpIHtcbiAgICAvLyBzdXBwcmVzcyBjb25zb2xlLmxvZyBvdXRwdXQgd2hlbiBiZWluZyBpbmNsdWRlZCBhcyBhIG1vZHVsZS5cbiAgICBpZiAodHlwZW9mIG1vZHVsZSAhPT0gJ3VuZGVmaW5lZCcgfHxcbiAgICAgICAgdHlwZW9mIHJlcXVpcmUgPT09ICdmdW5jdGlvbicgJiYgdHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBjb25zb2xlLmxvZy5hcHBseShjb25zb2xlLCBhcmd1bWVudHMpO1xuICB9LFxuICBleHRyYWN0VmVyc2lvbjogZnVuY3Rpb24odWFzdHJpbmcsIGV4cHIsIHBvcykge1xuICAgIHZhciBtYXRjaCA9IHVhc3RyaW5nLm1hdGNoKGV4cHIpO1xuICAgIHJldHVybiBtYXRjaCAmJiBtYXRjaC5sZW5ndGggPj0gcG9zICYmIHBhcnNlSW50KG1hdGNoW3Bvc10sIDEwKTtcbiAgfVxufTtcblxuZnVuY3Rpb24gdHJhY2UodGV4dCkge1xuICAvLyBUaGlzIGZ1bmN0aW9uIGlzIHVzZWQgZm9yIGxvZ2dpbmcuXG4gIGlmICh0ZXh0W3RleHQubGVuZ3RoIC0gMV0gPT09ICdcXG4nKSB7XG4gICAgdGV4dCA9IHRleHQuc3Vic3RyaW5nKDAsIHRleHQubGVuZ3RoIC0gMSk7XG4gIH1cbiAgaWYgKHdpbmRvdy5wZXJmb3JtYW5jZSkge1xuICAgIHZhciBub3cgPSAod2luZG93LnBlcmZvcm1hbmNlLm5vdygpIC8gMTAwMCkudG9GaXhlZCgzKTtcbiAgICB3ZWJydGNVdGlscy5sb2cobm93ICsgJzogJyArIHRleHQpO1xuICB9IGVsc2Uge1xuICAgIHdlYnJ0Y1V0aWxzLmxvZyh0ZXh0KTtcbiAgfVxufVxuXG5pZiAodHlwZW9mIHdpbmRvdyA9PT0gJ29iamVjdCcpIHtcbiAgaWYgKHdpbmRvdy5IVE1MTWVkaWFFbGVtZW50ICYmXG4gICAgISgnc3JjT2JqZWN0JyBpbiB3aW5kb3cuSFRNTE1lZGlhRWxlbWVudC5wcm90b3R5cGUpKSB7XG4gICAgLy8gU2hpbSB0aGUgc3JjT2JqZWN0IHByb3BlcnR5LCBvbmNlLCB3aGVuIEhUTUxNZWRpYUVsZW1lbnQgaXMgZm91bmQuXG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHdpbmRvdy5IVE1MTWVkaWFFbGVtZW50LnByb3RvdHlwZSwgJ3NyY09iamVjdCcsIHtcbiAgICAgIGdldDogZnVuY3Rpb24oKSB7XG4gICAgICAgIC8vIElmIHByZWZpeGVkIHNyY09iamVjdCBwcm9wZXJ0eSBleGlzdHMsIHJldHVybiBpdC5cbiAgICAgICAgLy8gT3RoZXJ3aXNlIHVzZSB0aGUgc2hpbW1lZCBwcm9wZXJ0eSwgX3NyY09iamVjdFxuICAgICAgICByZXR1cm4gJ21velNyY09iamVjdCcgaW4gdGhpcyA/IHRoaXMubW96U3JjT2JqZWN0IDogdGhpcy5fc3JjT2JqZWN0O1xuICAgICAgfSxcbiAgICAgIHNldDogZnVuY3Rpb24oc3RyZWFtKSB7XG4gICAgICAgIGlmICgnbW96U3JjT2JqZWN0JyBpbiB0aGlzKSB7XG4gICAgICAgICAgdGhpcy5tb3pTcmNPYmplY3QgPSBzdHJlYW07XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgLy8gVXNlIF9zcmNPYmplY3QgYXMgYSBwcml2YXRlIHByb3BlcnR5IGZvciB0aGlzIHNoaW1cbiAgICAgICAgICB0aGlzLl9zcmNPYmplY3QgPSBzdHJlYW07XG4gICAgICAgICAgLy8gVE9ETzogcmV2b2tlT2JqZWN0VXJsKHRoaXMuc3JjKSB3aGVuICFzdHJlYW0gdG8gcmVsZWFzZSByZXNvdXJjZXM/XG4gICAgICAgICAgdGhpcy5zcmMgPSBVUkwuY3JlYXRlT2JqZWN0VVJMKHN0cmVhbSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuICAvLyBQcm94eSBleGlzdGluZyBnbG9iYWxzXG4gIGdldFVzZXJNZWRpYSA9IHdpbmRvdy5uYXZpZ2F0b3IgJiYgd2luZG93Lm5hdmlnYXRvci5nZXRVc2VyTWVkaWE7XG59XG5cbi8vIEF0dGFjaCBhIG1lZGlhIHN0cmVhbSB0byBhbiBlbGVtZW50LlxuYXR0YWNoTWVkaWFTdHJlYW0gPSBmdW5jdGlvbihlbGVtZW50LCBzdHJlYW0pIHtcbiAgZWxlbWVudC5zcmNPYmplY3QgPSBzdHJlYW07XG59O1xuXG5yZWF0dGFjaE1lZGlhU3RyZWFtID0gZnVuY3Rpb24odG8sIGZyb20pIHtcbiAgdG8uc3JjT2JqZWN0ID0gZnJvbS5zcmNPYmplY3Q7XG59O1xuXG5pZiAodHlwZW9mIHdpbmRvdyA9PT0gJ3VuZGVmaW5lZCcgfHwgIXdpbmRvdy5uYXZpZ2F0b3IpIHtcbiAgd2VicnRjVXRpbHMubG9nKCdUaGlzIGRvZXMgbm90IGFwcGVhciB0byBiZSBhIGJyb3dzZXInKTtcbiAgd2VicnRjRGV0ZWN0ZWRCcm93c2VyID0gJ25vdCBhIGJyb3dzZXInO1xufSBlbHNlIGlmIChuYXZpZ2F0b3IubW96R2V0VXNlck1lZGlhICYmIHdpbmRvdy5tb3pSVENQZWVyQ29ubmVjdGlvbikge1xuICB3ZWJydGNVdGlscy5sb2coJ1RoaXMgYXBwZWFycyB0byBiZSBGaXJlZm94Jyk7XG5cbiAgd2VicnRjRGV0ZWN0ZWRCcm93c2VyID0gJ2ZpcmVmb3gnO1xuXG4gIC8vIHRoZSBkZXRlY3RlZCBmaXJlZm94IHZlcnNpb24uXG4gIHdlYnJ0Y0RldGVjdGVkVmVyc2lvbiA9IHdlYnJ0Y1V0aWxzLmV4dHJhY3RWZXJzaW9uKG5hdmlnYXRvci51c2VyQWdlbnQsXG4gICAgICAvRmlyZWZveFxcLyhbMC05XSspXFwuLywgMSk7XG5cbiAgLy8gdGhlIG1pbmltdW0gZmlyZWZveCB2ZXJzaW9uIHN0aWxsIHN1cHBvcnRlZCBieSBhZGFwdGVyLlxuICB3ZWJydGNNaW5pbXVtVmVyc2lvbiA9IDMxO1xuXG4gIC8vIFRoZSBSVENQZWVyQ29ubmVjdGlvbiBvYmplY3QuXG4gIHdpbmRvdy5SVENQZWVyQ29ubmVjdGlvbiA9IGZ1bmN0aW9uKHBjQ29uZmlnLCBwY0NvbnN0cmFpbnRzKSB7XG4gICAgaWYgKHdlYnJ0Y0RldGVjdGVkVmVyc2lvbiA8IDM4KSB7XG4gICAgICAvLyAudXJscyBpcyBub3Qgc3VwcG9ydGVkIGluIEZGIDwgMzguXG4gICAgICAvLyBjcmVhdGUgUlRDSWNlU2VydmVycyB3aXRoIGEgc2luZ2xlIHVybC5cbiAgICAgIGlmIChwY0NvbmZpZyAmJiBwY0NvbmZpZy5pY2VTZXJ2ZXJzKSB7XG4gICAgICAgIHZhciBuZXdJY2VTZXJ2ZXJzID0gW107XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcGNDb25maWcuaWNlU2VydmVycy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgIHZhciBzZXJ2ZXIgPSBwY0NvbmZpZy5pY2VTZXJ2ZXJzW2ldO1xuICAgICAgICAgIGlmIChzZXJ2ZXIuaGFzT3duUHJvcGVydHkoJ3VybHMnKSkge1xuICAgICAgICAgICAgZm9yICh2YXIgaiA9IDA7IGogPCBzZXJ2ZXIudXJscy5sZW5ndGg7IGorKykge1xuICAgICAgICAgICAgICB2YXIgbmV3U2VydmVyID0ge1xuICAgICAgICAgICAgICAgIHVybDogc2VydmVyLnVybHNbal1cbiAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgaWYgKHNlcnZlci51cmxzW2pdLmluZGV4T2YoJ3R1cm4nKSA9PT0gMCkge1xuICAgICAgICAgICAgICAgIG5ld1NlcnZlci51c2VybmFtZSA9IHNlcnZlci51c2VybmFtZTtcbiAgICAgICAgICAgICAgICBuZXdTZXJ2ZXIuY3JlZGVudGlhbCA9IHNlcnZlci5jcmVkZW50aWFsO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIG5ld0ljZVNlcnZlcnMucHVzaChuZXdTZXJ2ZXIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBuZXdJY2VTZXJ2ZXJzLnB1c2gocGNDb25maWcuaWNlU2VydmVyc1tpXSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHBjQ29uZmlnLmljZVNlcnZlcnMgPSBuZXdJY2VTZXJ2ZXJzO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gbmV3IG1velJUQ1BlZXJDb25uZWN0aW9uKHBjQ29uZmlnLCBwY0NvbnN0cmFpbnRzKTsgLy8ganNjczppZ25vcmUgcmVxdWlyZUNhcGl0YWxpemVkQ29uc3RydWN0b3JzXG4gIH07XG5cbiAgLy8gd3JhcCBzdGF0aWMgbWV0aG9kcy4gQ3VycmVudGx5IGp1c3QgZ2VuZXJhdGVDZXJ0aWZpY2F0ZS5cbiAgaWYgKG1velJUQ1BlZXJDb25uZWN0aW9uLmdlbmVyYXRlQ2VydGlmaWNhdGUpIHtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkod2luZG93LlJUQ1BlZXJDb25uZWN0aW9uLCAnZ2VuZXJhdGVDZXJ0aWZpY2F0ZScsIHtcbiAgICAgIGdldDogZnVuY3Rpb24oKSB7XG4gICAgICAgIGlmIChhcmd1bWVudHMubGVuZ3RoKSB7XG4gICAgICAgICAgcmV0dXJuIG1velJUQ1BlZXJDb25uZWN0aW9uLmdlbmVyYXRlQ2VydGlmaWNhdGUuYXBwbHkobnVsbCxcbiAgICAgICAgICAgICAgYXJndW1lbnRzKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXR1cm4gbW96UlRDUGVlckNvbm5lY3Rpb24uZ2VuZXJhdGVDZXJ0aWZpY2F0ZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgLy8gVGhlIFJUQ1Nlc3Npb25EZXNjcmlwdGlvbiBvYmplY3QuXG4gIGlmICghd2luZG93LlJUQ1Nlc3Npb25EZXNjcmlwdGlvbikge1xuICAgIHdpbmRvdy5SVENTZXNzaW9uRGVzY3JpcHRpb24gPSBtb3pSVENTZXNzaW9uRGVzY3JpcHRpb247XG4gIH1cblxuICAvLyBUaGUgUlRDSWNlQ2FuZGlkYXRlIG9iamVjdC5cbiAgaWYgKCF3aW5kb3cuUlRDSWNlQ2FuZGlkYXRlKSB7XG4gICAgd2luZG93LlJUQ0ljZUNhbmRpZGF0ZSA9IG1velJUQ0ljZUNhbmRpZGF0ZTtcbiAgfVxuXG4gIC8vIGdldFVzZXJNZWRpYSBjb25zdHJhaW50cyBzaGltLlxuICBnZXRVc2VyTWVkaWEgPSBmdW5jdGlvbihjb25zdHJhaW50cywgb25TdWNjZXNzLCBvbkVycm9yKSB7XG4gICAgdmFyIGNvbnN0cmFpbnRzVG9GRjM3ID0gZnVuY3Rpb24oYykge1xuICAgICAgaWYgKHR5cGVvZiBjICE9PSAnb2JqZWN0JyB8fCBjLnJlcXVpcmUpIHtcbiAgICAgICAgcmV0dXJuIGM7XG4gICAgICB9XG4gICAgICB2YXIgcmVxdWlyZSA9IFtdO1xuICAgICAgT2JqZWN0LmtleXMoYykuZm9yRWFjaChmdW5jdGlvbihrZXkpIHtcbiAgICAgICAgaWYgKGtleSA9PT0gJ3JlcXVpcmUnIHx8IGtleSA9PT0gJ2FkdmFuY2VkJyB8fCBrZXkgPT09ICdtZWRpYVNvdXJjZScpIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgdmFyIHIgPSBjW2tleV0gPSAodHlwZW9mIGNba2V5XSA9PT0gJ29iamVjdCcpID9cbiAgICAgICAgICAgIGNba2V5XSA6IHtpZGVhbDogY1trZXldfTtcbiAgICAgICAgaWYgKHIubWluICE9PSB1bmRlZmluZWQgfHxcbiAgICAgICAgICAgIHIubWF4ICE9PSB1bmRlZmluZWQgfHwgci5leGFjdCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgcmVxdWlyZS5wdXNoKGtleSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHIuZXhhY3QgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgIGlmICh0eXBlb2Ygci5leGFjdCA9PT0gJ251bWJlcicpIHtcbiAgICAgICAgICAgIHIubWluID0gci5tYXggPSByLmV4YWN0O1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjW2tleV0gPSByLmV4YWN0O1xuICAgICAgICAgIH1cbiAgICAgICAgICBkZWxldGUgci5leGFjdDtcbiAgICAgICAgfVxuICAgICAgICBpZiAoci5pZGVhbCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgYy5hZHZhbmNlZCA9IGMuYWR2YW5jZWQgfHwgW107XG4gICAgICAgICAgdmFyIG9jID0ge307XG4gICAgICAgICAgaWYgKHR5cGVvZiByLmlkZWFsID09PSAnbnVtYmVyJykge1xuICAgICAgICAgICAgb2Nba2V5XSA9IHttaW46IHIuaWRlYWwsIG1heDogci5pZGVhbH07XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIG9jW2tleV0gPSByLmlkZWFsO1xuICAgICAgICAgIH1cbiAgICAgICAgICBjLmFkdmFuY2VkLnB1c2gob2MpO1xuICAgICAgICAgIGRlbGV0ZSByLmlkZWFsO1xuICAgICAgICAgIGlmICghT2JqZWN0LmtleXMocikubGVuZ3RoKSB7XG4gICAgICAgICAgICBkZWxldGUgY1trZXldO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICBpZiAocmVxdWlyZS5sZW5ndGgpIHtcbiAgICAgICAgYy5yZXF1aXJlID0gcmVxdWlyZTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBjO1xuICAgIH07XG4gICAgaWYgKHdlYnJ0Y0RldGVjdGVkVmVyc2lvbiA8IDM4KSB7XG4gICAgICB3ZWJydGNVdGlscy5sb2coJ3NwZWM6ICcgKyBKU09OLnN0cmluZ2lmeShjb25zdHJhaW50cykpO1xuICAgICAgaWYgKGNvbnN0cmFpbnRzLmF1ZGlvKSB7XG4gICAgICAgIGNvbnN0cmFpbnRzLmF1ZGlvID0gY29uc3RyYWludHNUb0ZGMzcoY29uc3RyYWludHMuYXVkaW8pO1xuICAgICAgfVxuICAgICAgaWYgKGNvbnN0cmFpbnRzLnZpZGVvKSB7XG4gICAgICAgIGNvbnN0cmFpbnRzLnZpZGVvID0gY29uc3RyYWludHNUb0ZGMzcoY29uc3RyYWludHMudmlkZW8pO1xuICAgICAgfVxuICAgICAgd2VicnRjVXRpbHMubG9nKCdmZjM3OiAnICsgSlNPTi5zdHJpbmdpZnkoY29uc3RyYWludHMpKTtcbiAgICB9XG4gICAgcmV0dXJuIG5hdmlnYXRvci5tb3pHZXRVc2VyTWVkaWEoY29uc3RyYWludHMsIG9uU3VjY2Vzcywgb25FcnJvcik7XG4gIH07XG5cbiAgbmF2aWdhdG9yLmdldFVzZXJNZWRpYSA9IGdldFVzZXJNZWRpYTtcblxuICAvLyBTaGltIGZvciBtZWRpYURldmljZXMgb24gb2xkZXIgdmVyc2lvbnMuXG4gIGlmICghbmF2aWdhdG9yLm1lZGlhRGV2aWNlcykge1xuICAgIG5hdmlnYXRvci5tZWRpYURldmljZXMgPSB7Z2V0VXNlck1lZGlhOiByZXF1ZXN0VXNlck1lZGlhLFxuICAgICAgYWRkRXZlbnRMaXN0ZW5lcjogZnVuY3Rpb24oKSB7IH0sXG4gICAgICByZW1vdmVFdmVudExpc3RlbmVyOiBmdW5jdGlvbigpIHsgfVxuICAgIH07XG4gIH1cbiAgbmF2aWdhdG9yLm1lZGlhRGV2aWNlcy5lbnVtZXJhdGVEZXZpY2VzID1cbiAgICAgIG5hdmlnYXRvci5tZWRpYURldmljZXMuZW51bWVyYXRlRGV2aWNlcyB8fCBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSkge1xuICAgICAgdmFyIGluZm9zID0gW1xuICAgICAgICB7a2luZDogJ2F1ZGlvaW5wdXQnLCBkZXZpY2VJZDogJ2RlZmF1bHQnLCBsYWJlbDogJycsIGdyb3VwSWQ6ICcnfSxcbiAgICAgICAge2tpbmQ6ICd2aWRlb2lucHV0JywgZGV2aWNlSWQ6ICdkZWZhdWx0JywgbGFiZWw6ICcnLCBncm91cElkOiAnJ31cbiAgICAgIF07XG4gICAgICByZXNvbHZlKGluZm9zKTtcbiAgICB9KTtcbiAgfTtcblxuICBpZiAod2VicnRjRGV0ZWN0ZWRWZXJzaW9uIDwgNDEpIHtcbiAgICAvLyBXb3JrIGFyb3VuZCBodHRwOi8vYnVnemlsLmxhLzExNjk2NjVcbiAgICB2YXIgb3JnRW51bWVyYXRlRGV2aWNlcyA9XG4gICAgICAgIG5hdmlnYXRvci5tZWRpYURldmljZXMuZW51bWVyYXRlRGV2aWNlcy5iaW5kKG5hdmlnYXRvci5tZWRpYURldmljZXMpO1xuICAgIG5hdmlnYXRvci5tZWRpYURldmljZXMuZW51bWVyYXRlRGV2aWNlcyA9IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIG9yZ0VudW1lcmF0ZURldmljZXMoKS50aGVuKHVuZGVmaW5lZCwgZnVuY3Rpb24oZSkge1xuICAgICAgICBpZiAoZS5uYW1lID09PSAnTm90Rm91bmRFcnJvcicpIHtcbiAgICAgICAgICByZXR1cm4gW107XG4gICAgICAgIH1cbiAgICAgICAgdGhyb3cgZTtcbiAgICAgIH0pO1xuICAgIH07XG4gIH1cbn0gZWxzZSBpZiAobmF2aWdhdG9yLndlYmtpdEdldFVzZXJNZWRpYSAmJiB3aW5kb3cud2Via2l0UlRDUGVlckNvbm5lY3Rpb24pIHtcbiAgd2VicnRjVXRpbHMubG9nKCdUaGlzIGFwcGVhcnMgdG8gYmUgQ2hyb21lJyk7XG5cbiAgd2VicnRjRGV0ZWN0ZWRCcm93c2VyID0gJ2Nocm9tZSc7XG5cbiAgLy8gdGhlIGRldGVjdGVkIGNocm9tZSB2ZXJzaW9uLlxuICB3ZWJydGNEZXRlY3RlZFZlcnNpb24gPSB3ZWJydGNVdGlscy5leHRyYWN0VmVyc2lvbihuYXZpZ2F0b3IudXNlckFnZW50LFxuICAgICAgL0Nocm9tKGV8aXVtKVxcLyhbMC05XSspXFwuLywgMik7XG5cbiAgLy8gdGhlIG1pbmltdW0gY2hyb21lIHZlcnNpb24gc3RpbGwgc3VwcG9ydGVkIGJ5IGFkYXB0ZXIuXG4gIHdlYnJ0Y01pbmltdW1WZXJzaW9uID0gMzg7XG5cbiAgLy8gVGhlIFJUQ1BlZXJDb25uZWN0aW9uIG9iamVjdC5cbiAgd2luZG93LlJUQ1BlZXJDb25uZWN0aW9uID0gZnVuY3Rpb24ocGNDb25maWcsIHBjQ29uc3RyYWludHMpIHtcbiAgICAvLyBUcmFuc2xhdGUgaWNlVHJhbnNwb3J0UG9saWN5IHRvIGljZVRyYW5zcG9ydHMsXG4gICAgLy8gc2VlIGh0dHBzOi8vY29kZS5nb29nbGUuY29tL3Avd2VicnRjL2lzc3Vlcy9kZXRhaWw/aWQ9NDg2OVxuICAgIGlmIChwY0NvbmZpZyAmJiBwY0NvbmZpZy5pY2VUcmFuc3BvcnRQb2xpY3kpIHtcbiAgICAgIHBjQ29uZmlnLmljZVRyYW5zcG9ydHMgPSBwY0NvbmZpZy5pY2VUcmFuc3BvcnRQb2xpY3k7XG4gICAgfVxuXG4gICAgdmFyIHBjID0gbmV3IHdlYmtpdFJUQ1BlZXJDb25uZWN0aW9uKHBjQ29uZmlnLCBwY0NvbnN0cmFpbnRzKTsgLy8ganNjczppZ25vcmUgcmVxdWlyZUNhcGl0YWxpemVkQ29uc3RydWN0b3JzXG4gICAgdmFyIG9yaWdHZXRTdGF0cyA9IHBjLmdldFN0YXRzLmJpbmQocGMpO1xuICAgIHBjLmdldFN0YXRzID0gZnVuY3Rpb24oc2VsZWN0b3IsIHN1Y2Nlc3NDYWxsYmFjaywgZXJyb3JDYWxsYmFjaykgeyAvLyBqc2hpbnQgaWdub3JlOiBsaW5lXG4gICAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgICB2YXIgYXJncyA9IGFyZ3VtZW50cztcblxuICAgICAgLy8gSWYgc2VsZWN0b3IgaXMgYSBmdW5jdGlvbiB0aGVuIHdlIGFyZSBpbiB0aGUgb2xkIHN0eWxlIHN0YXRzIHNvIGp1c3RcbiAgICAgIC8vIHBhc3MgYmFjayB0aGUgb3JpZ2luYWwgZ2V0U3RhdHMgZm9ybWF0IHRvIGF2b2lkIGJyZWFraW5nIG9sZCB1c2Vycy5cbiAgICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID4gMCAmJiB0eXBlb2Ygc2VsZWN0b3IgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgcmV0dXJuIG9yaWdHZXRTdGF0cyhzZWxlY3Rvciwgc3VjY2Vzc0NhbGxiYWNrKTtcbiAgICAgIH1cblxuICAgICAgdmFyIGZpeENocm9tZVN0YXRzID0gZnVuY3Rpb24ocmVzcG9uc2UpIHtcbiAgICAgICAgdmFyIHN0YW5kYXJkUmVwb3J0ID0ge307XG4gICAgICAgIHZhciByZXBvcnRzID0gcmVzcG9uc2UucmVzdWx0KCk7XG4gICAgICAgIHJlcG9ydHMuZm9yRWFjaChmdW5jdGlvbihyZXBvcnQpIHtcbiAgICAgICAgICB2YXIgc3RhbmRhcmRTdGF0cyA9IHtcbiAgICAgICAgICAgIGlkOiByZXBvcnQuaWQsXG4gICAgICAgICAgICB0aW1lc3RhbXA6IHJlcG9ydC50aW1lc3RhbXAsXG4gICAgICAgICAgICB0eXBlOiByZXBvcnQudHlwZVxuICAgICAgICAgIH07XG4gICAgICAgICAgcmVwb3J0Lm5hbWVzKCkuZm9yRWFjaChmdW5jdGlvbihuYW1lKSB7XG4gICAgICAgICAgICBzdGFuZGFyZFN0YXRzW25hbWVdID0gcmVwb3J0LnN0YXQobmFtZSk7XG4gICAgICAgICAgfSk7XG4gICAgICAgICAgc3RhbmRhcmRSZXBvcnRbc3RhbmRhcmRTdGF0cy5pZF0gPSBzdGFuZGFyZFN0YXRzO1xuICAgICAgICB9KTtcblxuICAgICAgICByZXR1cm4gc3RhbmRhcmRSZXBvcnQ7XG4gICAgICB9O1xuXG4gICAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA+PSAyKSB7XG4gICAgICAgIHZhciBzdWNjZXNzQ2FsbGJhY2tXcmFwcGVyID0gZnVuY3Rpb24ocmVzcG9uc2UpIHtcbiAgICAgICAgICBhcmdzWzFdKGZpeENocm9tZVN0YXRzKHJlc3BvbnNlKSk7XG4gICAgICAgIH07XG5cbiAgICAgICAgcmV0dXJuIG9yaWdHZXRTdGF0cy5hcHBseSh0aGlzLCBbc3VjY2Vzc0NhbGxiYWNrV3JhcHBlciwgYXJndW1lbnRzWzBdXSk7XG4gICAgICB9XG5cbiAgICAgIC8vIHByb21pc2Utc3VwcG9ydFxuICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgICBpZiAoYXJncy5sZW5ndGggPT09IDEgJiYgc2VsZWN0b3IgPT09IG51bGwpIHtcbiAgICAgICAgICBvcmlnR2V0U3RhdHMuYXBwbHkoc2VsZiwgW1xuICAgICAgICAgICAgICBmdW5jdGlvbihyZXNwb25zZSkge1xuICAgICAgICAgICAgICAgIHJlc29sdmUuYXBwbHkobnVsbCwgW2ZpeENocm9tZVN0YXRzKHJlc3BvbnNlKV0pO1xuICAgICAgICAgICAgICB9LCByZWplY3RdKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBvcmlnR2V0U3RhdHMuYXBwbHkoc2VsZiwgW3Jlc29sdmUsIHJlamVjdF0pO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9O1xuXG4gICAgcmV0dXJuIHBjO1xuICB9O1xuXG4gIC8vIHdyYXAgc3RhdGljIG1ldGhvZHMuIEN1cnJlbnRseSBqdXN0IGdlbmVyYXRlQ2VydGlmaWNhdGUuXG4gIGlmICh3ZWJraXRSVENQZWVyQ29ubmVjdGlvbi5nZW5lcmF0ZUNlcnRpZmljYXRlKSB7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHdpbmRvdy5SVENQZWVyQ29ubmVjdGlvbiwgJ2dlbmVyYXRlQ2VydGlmaWNhdGUnLCB7XG4gICAgICBnZXQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCkge1xuICAgICAgICAgIHJldHVybiB3ZWJraXRSVENQZWVyQ29ubmVjdGlvbi5nZW5lcmF0ZUNlcnRpZmljYXRlLmFwcGx5KG51bGwsXG4gICAgICAgICAgICAgIGFyZ3VtZW50cyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmV0dXJuIHdlYmtpdFJUQ1BlZXJDb25uZWN0aW9uLmdlbmVyYXRlQ2VydGlmaWNhdGU7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIC8vIGFkZCBwcm9taXNlIHN1cHBvcnRcbiAgWydjcmVhdGVPZmZlcicsICdjcmVhdGVBbnN3ZXInXS5mb3JFYWNoKGZ1bmN0aW9uKG1ldGhvZCkge1xuICAgIHZhciBuYXRpdmVNZXRob2QgPSB3ZWJraXRSVENQZWVyQ29ubmVjdGlvbi5wcm90b3R5cGVbbWV0aG9kXTtcbiAgICB3ZWJraXRSVENQZWVyQ29ubmVjdGlvbi5wcm90b3R5cGVbbWV0aG9kXSA9IGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPCAxIHx8IChhcmd1bWVudHMubGVuZ3RoID09PSAxICYmXG4gICAgICAgICAgdHlwZW9mKGFyZ3VtZW50c1swXSkgPT09ICdvYmplY3QnKSkge1xuICAgICAgICB2YXIgb3B0cyA9IGFyZ3VtZW50cy5sZW5ndGggPT09IDEgPyBhcmd1bWVudHNbMF0gOiB1bmRlZmluZWQ7XG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgICAgICBuYXRpdmVNZXRob2QuYXBwbHkoc2VsZiwgW3Jlc29sdmUsIHJlamVjdCwgb3B0c10pO1xuICAgICAgICB9KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBuYXRpdmVNZXRob2QuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICAgIH1cbiAgICB9O1xuICB9KTtcblxuICBbJ3NldExvY2FsRGVzY3JpcHRpb24nLCAnc2V0UmVtb3RlRGVzY3JpcHRpb24nLFxuICAgICAgJ2FkZEljZUNhbmRpZGF0ZSddLmZvckVhY2goZnVuY3Rpb24obWV0aG9kKSB7XG4gICAgdmFyIG5hdGl2ZU1ldGhvZCA9IHdlYmtpdFJUQ1BlZXJDb25uZWN0aW9uLnByb3RvdHlwZVttZXRob2RdO1xuICAgIHdlYmtpdFJUQ1BlZXJDb25uZWN0aW9uLnByb3RvdHlwZVttZXRob2RdID0gZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgYXJncyA9IGFyZ3VtZW50cztcbiAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgICAgbmF0aXZlTWV0aG9kLmFwcGx5KHNlbGYsIFthcmdzWzBdLFxuICAgICAgICAgICAgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgIHJlc29sdmUoKTtcbiAgICAgICAgICAgICAgaWYgKGFyZ3MubGVuZ3RoID49IDIpIHtcbiAgICAgICAgICAgICAgICBhcmdzWzFdLmFwcGx5KG51bGwsIFtdKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGZ1bmN0aW9uKGVycikge1xuICAgICAgICAgICAgICByZWplY3QoZXJyKTtcbiAgICAgICAgICAgICAgaWYgKGFyZ3MubGVuZ3RoID49IDMpIHtcbiAgICAgICAgICAgICAgICBhcmdzWzJdLmFwcGx5KG51bGwsIFtlcnJdKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfV1cbiAgICAgICAgICApO1xuICAgICAgfSk7XG4gICAgfTtcbiAgfSk7XG5cbiAgLy8gZ2V0VXNlck1lZGlhIGNvbnN0cmFpbnRzIHNoaW0uXG4gIHZhciBjb25zdHJhaW50c1RvQ2hyb21lID0gZnVuY3Rpb24oYykge1xuICAgIGlmICh0eXBlb2YgYyAhPT0gJ29iamVjdCcgfHwgYy5tYW5kYXRvcnkgfHwgYy5vcHRpb25hbCkge1xuICAgICAgcmV0dXJuIGM7XG4gICAgfVxuICAgIHZhciBjYyA9IHt9O1xuICAgIE9iamVjdC5rZXlzKGMpLmZvckVhY2goZnVuY3Rpb24oa2V5KSB7XG4gICAgICBpZiAoa2V5ID09PSAncmVxdWlyZScgfHwga2V5ID09PSAnYWR2YW5jZWQnIHx8IGtleSA9PT0gJ21lZGlhU291cmNlJykge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICB2YXIgciA9ICh0eXBlb2YgY1trZXldID09PSAnb2JqZWN0JykgPyBjW2tleV0gOiB7aWRlYWw6IGNba2V5XX07XG4gICAgICBpZiAoci5leGFjdCAhPT0gdW5kZWZpbmVkICYmIHR5cGVvZiByLmV4YWN0ID09PSAnbnVtYmVyJykge1xuICAgICAgICByLm1pbiA9IHIubWF4ID0gci5leGFjdDtcbiAgICAgIH1cbiAgICAgIHZhciBvbGRuYW1lID0gZnVuY3Rpb24ocHJlZml4LCBuYW1lKSB7XG4gICAgICAgIGlmIChwcmVmaXgpIHtcbiAgICAgICAgICByZXR1cm4gcHJlZml4ICsgbmFtZS5jaGFyQXQoMCkudG9VcHBlckNhc2UoKSArIG5hbWUuc2xpY2UoMSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIChuYW1lID09PSAnZGV2aWNlSWQnKSA/ICdzb3VyY2VJZCcgOiBuYW1lO1xuICAgICAgfTtcbiAgICAgIGlmIChyLmlkZWFsICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgY2Mub3B0aW9uYWwgPSBjYy5vcHRpb25hbCB8fCBbXTtcbiAgICAgICAgdmFyIG9jID0ge307XG4gICAgICAgIGlmICh0eXBlb2Ygci5pZGVhbCA9PT0gJ251bWJlcicpIHtcbiAgICAgICAgICBvY1tvbGRuYW1lKCdtaW4nLCBrZXkpXSA9IHIuaWRlYWw7XG4gICAgICAgICAgY2Mub3B0aW9uYWwucHVzaChvYyk7XG4gICAgICAgICAgb2MgPSB7fTtcbiAgICAgICAgICBvY1tvbGRuYW1lKCdtYXgnLCBrZXkpXSA9IHIuaWRlYWw7XG4gICAgICAgICAgY2Mub3B0aW9uYWwucHVzaChvYyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgb2Nbb2xkbmFtZSgnJywga2V5KV0gPSByLmlkZWFsO1xuICAgICAgICAgIGNjLm9wdGlvbmFsLnB1c2gob2MpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZiAoci5leGFjdCAhPT0gdW5kZWZpbmVkICYmIHR5cGVvZiByLmV4YWN0ICE9PSAnbnVtYmVyJykge1xuICAgICAgICBjYy5tYW5kYXRvcnkgPSBjYy5tYW5kYXRvcnkgfHwge307XG4gICAgICAgIGNjLm1hbmRhdG9yeVtvbGRuYW1lKCcnLCBrZXkpXSA9IHIuZXhhY3Q7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBbJ21pbicsICdtYXgnXS5mb3JFYWNoKGZ1bmN0aW9uKG1peCkge1xuICAgICAgICAgIGlmIChyW21peF0gIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgY2MubWFuZGF0b3J5ID0gY2MubWFuZGF0b3J5IHx8IHt9O1xuICAgICAgICAgICAgY2MubWFuZGF0b3J5W29sZG5hbWUobWl4LCBrZXkpXSA9IHJbbWl4XTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH0pO1xuICAgIGlmIChjLmFkdmFuY2VkKSB7XG4gICAgICBjYy5vcHRpb25hbCA9IChjYy5vcHRpb25hbCB8fCBbXSkuY29uY2F0KGMuYWR2YW5jZWQpO1xuICAgIH1cbiAgICByZXR1cm4gY2M7XG4gIH07XG5cbiAgZ2V0VXNlck1lZGlhID0gZnVuY3Rpb24oY29uc3RyYWludHMsIG9uU3VjY2Vzcywgb25FcnJvcikge1xuICAgIGlmIChjb25zdHJhaW50cy5hdWRpbykge1xuICAgICAgY29uc3RyYWludHMuYXVkaW8gPSBjb25zdHJhaW50c1RvQ2hyb21lKGNvbnN0cmFpbnRzLmF1ZGlvKTtcbiAgICB9XG4gICAgaWYgKGNvbnN0cmFpbnRzLnZpZGVvKSB7XG4gICAgICBjb25zdHJhaW50cy52aWRlbyA9IGNvbnN0cmFpbnRzVG9DaHJvbWUoY29uc3RyYWludHMudmlkZW8pO1xuICAgIH1cbiAgICB3ZWJydGNVdGlscy5sb2coJ2Nocm9tZTogJyArIEpTT04uc3RyaW5naWZ5KGNvbnN0cmFpbnRzKSk7XG4gICAgcmV0dXJuIG5hdmlnYXRvci53ZWJraXRHZXRVc2VyTWVkaWEoY29uc3RyYWludHMsIG9uU3VjY2Vzcywgb25FcnJvcik7XG4gIH07XG4gIG5hdmlnYXRvci5nZXRVc2VyTWVkaWEgPSBnZXRVc2VyTWVkaWE7XG5cbiAgaWYgKCFuYXZpZ2F0b3IubWVkaWFEZXZpY2VzKSB7XG4gICAgbmF2aWdhdG9yLm1lZGlhRGV2aWNlcyA9IHtnZXRVc2VyTWVkaWE6IHJlcXVlc3RVc2VyTWVkaWEsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbnVtZXJhdGVEZXZpY2VzOiBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlKSB7XG4gICAgICAgIHZhciBraW5kcyA9IHthdWRpbzogJ2F1ZGlvaW5wdXQnLCB2aWRlbzogJ3ZpZGVvaW5wdXQnfTtcbiAgICAgICAgcmV0dXJuIE1lZGlhU3RyZWFtVHJhY2suZ2V0U291cmNlcyhmdW5jdGlvbihkZXZpY2VzKSB7XG4gICAgICAgICAgcmVzb2x2ZShkZXZpY2VzLm1hcChmdW5jdGlvbihkZXZpY2UpIHtcbiAgICAgICAgICAgIHJldHVybiB7bGFiZWw6IGRldmljZS5sYWJlbCxcbiAgICAgICAgICAgICAgICAgICAga2luZDoga2luZHNbZGV2aWNlLmtpbmRdLFxuICAgICAgICAgICAgICAgICAgICBkZXZpY2VJZDogZGV2aWNlLmlkLFxuICAgICAgICAgICAgICAgICAgICBncm91cElkOiAnJ307XG4gICAgICAgICAgfSkpO1xuICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgIH19O1xuICB9XG5cbiAgLy8gQSBzaGltIGZvciBnZXRVc2VyTWVkaWEgbWV0aG9kIG9uIHRoZSBtZWRpYURldmljZXMgb2JqZWN0LlxuICAvLyBUT0RPKEthcHRlbkphbnNzb24pIHJlbW92ZSBvbmNlIGltcGxlbWVudGVkIGluIENocm9tZSBzdGFibGUuXG4gIGlmICghbmF2aWdhdG9yLm1lZGlhRGV2aWNlcy5nZXRVc2VyTWVkaWEpIHtcbiAgICBuYXZpZ2F0b3IubWVkaWFEZXZpY2VzLmdldFVzZXJNZWRpYSA9IGZ1bmN0aW9uKGNvbnN0cmFpbnRzKSB7XG4gICAgICByZXR1cm4gcmVxdWVzdFVzZXJNZWRpYShjb25zdHJhaW50cyk7XG4gICAgfTtcbiAgfSBlbHNlIHtcbiAgICAvLyBFdmVuIHRob3VnaCBDaHJvbWUgNDUgaGFzIG5hdmlnYXRvci5tZWRpYURldmljZXMgYW5kIGEgZ2V0VXNlck1lZGlhXG4gICAgLy8gZnVuY3Rpb24gd2hpY2ggcmV0dXJucyBhIFByb21pc2UsIGl0IGRvZXMgbm90IGFjY2VwdCBzcGVjLXN0eWxlXG4gICAgLy8gY29uc3RyYWludHMuXG4gICAgdmFyIG9yaWdHZXRVc2VyTWVkaWEgPSBuYXZpZ2F0b3IubWVkaWFEZXZpY2VzLmdldFVzZXJNZWRpYS5cbiAgICAgICAgYmluZChuYXZpZ2F0b3IubWVkaWFEZXZpY2VzKTtcbiAgICBuYXZpZ2F0b3IubWVkaWFEZXZpY2VzLmdldFVzZXJNZWRpYSA9IGZ1bmN0aW9uKGMpIHtcbiAgICAgIHdlYnJ0Y1V0aWxzLmxvZygnc3BlYzogICAnICsgSlNPTi5zdHJpbmdpZnkoYykpOyAvLyB3aGl0ZXNwYWNlIGZvciBhbGlnbm1lbnRcbiAgICAgIGMuYXVkaW8gPSBjb25zdHJhaW50c1RvQ2hyb21lKGMuYXVkaW8pO1xuICAgICAgYy52aWRlbyA9IGNvbnN0cmFpbnRzVG9DaHJvbWUoYy52aWRlbyk7XG4gICAgICB3ZWJydGNVdGlscy5sb2coJ2Nocm9tZTogJyArIEpTT04uc3RyaW5naWZ5KGMpKTtcbiAgICAgIHJldHVybiBvcmlnR2V0VXNlck1lZGlhKGMpO1xuICAgIH07XG4gIH1cblxuICAvLyBEdW1teSBkZXZpY2VjaGFuZ2UgZXZlbnQgbWV0aG9kcy5cbiAgLy8gVE9ETyhLYXB0ZW5KYW5zc29uKSByZW1vdmUgb25jZSBpbXBsZW1lbnRlZCBpbiBDaHJvbWUgc3RhYmxlLlxuICBpZiAodHlwZW9mIG5hdmlnYXRvci5tZWRpYURldmljZXMuYWRkRXZlbnRMaXN0ZW5lciA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICBuYXZpZ2F0b3IubWVkaWFEZXZpY2VzLmFkZEV2ZW50TGlzdGVuZXIgPSBmdW5jdGlvbigpIHtcbiAgICAgIHdlYnJ0Y1V0aWxzLmxvZygnRHVtbXkgbWVkaWFEZXZpY2VzLmFkZEV2ZW50TGlzdGVuZXIgY2FsbGVkLicpO1xuICAgIH07XG4gIH1cbiAgaWYgKHR5cGVvZiBuYXZpZ2F0b3IubWVkaWFEZXZpY2VzLnJlbW92ZUV2ZW50TGlzdGVuZXIgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgbmF2aWdhdG9yLm1lZGlhRGV2aWNlcy5yZW1vdmVFdmVudExpc3RlbmVyID0gZnVuY3Rpb24oKSB7XG4gICAgICB3ZWJydGNVdGlscy5sb2coJ0R1bW15IG1lZGlhRGV2aWNlcy5yZW1vdmVFdmVudExpc3RlbmVyIGNhbGxlZC4nKTtcbiAgICB9O1xuICB9XG5cbiAgLy8gQXR0YWNoIGEgbWVkaWEgc3RyZWFtIHRvIGFuIGVsZW1lbnQuXG4gIGF0dGFjaE1lZGlhU3RyZWFtID0gZnVuY3Rpb24oZWxlbWVudCwgc3RyZWFtKSB7XG4gICAgaWYgKHdlYnJ0Y0RldGVjdGVkVmVyc2lvbiA+PSA0Mykge1xuICAgICAgZWxlbWVudC5zcmNPYmplY3QgPSBzdHJlYW07XG4gICAgfSBlbHNlIGlmICh0eXBlb2YgZWxlbWVudC5zcmMgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICBlbGVtZW50LnNyYyA9IFVSTC5jcmVhdGVPYmplY3RVUkwoc3RyZWFtKTtcbiAgICB9IGVsc2Uge1xuICAgICAgd2VicnRjVXRpbHMubG9nKCdFcnJvciBhdHRhY2hpbmcgc3RyZWFtIHRvIGVsZW1lbnQuJyk7XG4gICAgfVxuICB9O1xuICByZWF0dGFjaE1lZGlhU3RyZWFtID0gZnVuY3Rpb24odG8sIGZyb20pIHtcbiAgICBpZiAod2VicnRjRGV0ZWN0ZWRWZXJzaW9uID49IDQzKSB7XG4gICAgICB0by5zcmNPYmplY3QgPSBmcm9tLnNyY09iamVjdDtcbiAgICB9IGVsc2Uge1xuICAgICAgdG8uc3JjID0gZnJvbS5zcmM7XG4gICAgfVxuICB9O1xuXG59IGVsc2UgaWYgKG5hdmlnYXRvci5tZWRpYURldmljZXMgJiYgbmF2aWdhdG9yLnVzZXJBZ2VudC5tYXRjaChcbiAgICAvRWRnZVxcLyhcXGQrKS4oXFxkKykkLykpIHtcbiAgd2VicnRjVXRpbHMubG9nKCdUaGlzIGFwcGVhcnMgdG8gYmUgRWRnZScpO1xuICB3ZWJydGNEZXRlY3RlZEJyb3dzZXIgPSAnZWRnZSc7XG5cbiAgd2VicnRjRGV0ZWN0ZWRWZXJzaW9uID0gd2VicnRjVXRpbHMuZXh0cmFjdFZlcnNpb24obmF2aWdhdG9yLnVzZXJBZ2VudCxcbiAgICAgIC9FZGdlXFwvKFxcZCspLihcXGQrKSQvLCAyKTtcblxuICAvLyBUaGUgbWluaW11bSB2ZXJzaW9uIHN0aWxsIHN1cHBvcnRlZCBieSBhZGFwdGVyLlxuICAvLyBUaGlzIGlzIHRoZSBidWlsZCBudW1iZXIgZm9yIEVkZ2UuXG4gIHdlYnJ0Y01pbmltdW1WZXJzaW9uID0gMTA1NDc7XG5cbiAgaWYgKFJUQ0ljZUdhdGhlcmVyKSB7XG4gICAgLy8gR2VuZXJhdGUgYW4gYWxwaGFudW1lcmljIGlkZW50aWZpZXIgZm9yIGNuYW1lIG9yIG1pZHMuXG4gICAgLy8gVE9ETzogdXNlIFVVSURzIGluc3RlYWQ/IGh0dHBzOi8vZ2lzdC5naXRodWIuY29tL2plZC85ODI4ODNcbiAgICB2YXIgZ2VuZXJhdGVJZGVudGlmaWVyID0gZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gTWF0aC5yYW5kb20oKS50b1N0cmluZygzNikuc3Vic3RyKDIsIDEwKTtcbiAgICB9O1xuXG4gICAgLy8gVGhlIFJUQ1AgQ05BTUUgdXNlZCBieSBhbGwgcGVlcmNvbm5lY3Rpb25zIGZyb20gdGhlIHNhbWUgSlMuXG4gICAgdmFyIGxvY2FsQ05hbWUgPSBnZW5lcmF0ZUlkZW50aWZpZXIoKTtcblxuICAgIC8vIFNEUCBoZWxwZXJzIC0gdG8gYmUgbW92ZWQgaW50byBzZXBhcmF0ZSBtb2R1bGUuXG4gICAgdmFyIFNEUFV0aWxzID0ge307XG5cbiAgICAvLyBTcGxpdHMgU0RQIGludG8gbGluZXMsIGRlYWxpbmcgd2l0aCBib3RoIENSTEYgYW5kIExGLlxuICAgIFNEUFV0aWxzLnNwbGl0TGluZXMgPSBmdW5jdGlvbihibG9iKSB7XG4gICAgICByZXR1cm4gYmxvYi50cmltKCkuc3BsaXQoJ1xcbicpLm1hcChmdW5jdGlvbihsaW5lKSB7XG4gICAgICAgIHJldHVybiBsaW5lLnRyaW0oKTtcbiAgICAgIH0pO1xuICAgIH07XG5cbiAgICAvLyBTcGxpdHMgU0RQIGludG8gc2Vzc2lvbnBhcnQgYW5kIG1lZGlhc2VjdGlvbnMuIEVuc3VyZXMgQ1JMRi5cbiAgICBTRFBVdGlscy5zcGxpdFNlY3Rpb25zID0gZnVuY3Rpb24oYmxvYikge1xuICAgICAgdmFyIHBhcnRzID0gYmxvYi5zcGxpdCgnXFxyXFxubT0nKTtcbiAgICAgIHJldHVybiBwYXJ0cy5tYXAoZnVuY3Rpb24ocGFydCwgaW5kZXgpIHtcbiAgICAgICAgcmV0dXJuIChpbmRleCA+IDAgPyAnbT0nICsgcGFydCA6IHBhcnQpLnRyaW0oKSArICdcXHJcXG4nO1xuICAgICAgfSk7XG4gICAgfTtcblxuICAgIC8vIFJldHVybnMgbGluZXMgdGhhdCBzdGFydCB3aXRoIGEgY2VydGFpbiBwcmVmaXguXG4gICAgU0RQVXRpbHMubWF0Y2hQcmVmaXggPSBmdW5jdGlvbihibG9iLCBwcmVmaXgpIHtcbiAgICAgIHJldHVybiBTRFBVdGlscy5zcGxpdExpbmVzKGJsb2IpLmZpbHRlcihmdW5jdGlvbihsaW5lKSB7XG4gICAgICAgIHJldHVybiBsaW5lLmluZGV4T2YocHJlZml4KSA9PT0gMDtcbiAgICAgIH0pO1xuICAgIH07XG5cbiAgICAvLyBQYXJzZXMgYW4gSUNFIGNhbmRpZGF0ZSBsaW5lLiBTYW1wbGUgaW5wdXQ6XG4gICAgLy8gY2FuZGlkYXRlOjcwMjc4NjM1MCAyIHVkcCA0MTgxOTkwMiA4LjguOC44IDYwNzY5IHR5cCByZWxheSByYWRkciA4LjguOC44IHJwb3J0IDU1OTk2XCJcbiAgICBTRFBVdGlscy5wYXJzZUNhbmRpZGF0ZSA9IGZ1bmN0aW9uKGxpbmUpIHtcbiAgICAgIHZhciBwYXJ0cztcbiAgICAgIC8vIFBhcnNlIGJvdGggdmFyaWFudHMuXG4gICAgICBpZiAobGluZS5pbmRleE9mKCdhPWNhbmRpZGF0ZTonKSA9PT0gMCkge1xuICAgICAgICBwYXJ0cyA9IGxpbmUuc3Vic3RyaW5nKDEyKS5zcGxpdCgnICcpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcGFydHMgPSBsaW5lLnN1YnN0cmluZygxMCkuc3BsaXQoJyAnKTtcbiAgICAgIH1cblxuICAgICAgdmFyIGNhbmRpZGF0ZSA9IHtcbiAgICAgICAgZm91bmRhdGlvbjogcGFydHNbMF0sXG4gICAgICAgIGNvbXBvbmVudDogcGFydHNbMV0sXG4gICAgICAgIHByb3RvY29sOiBwYXJ0c1syXS50b0xvd2VyQ2FzZSgpLFxuICAgICAgICBwcmlvcml0eTogcGFyc2VJbnQocGFydHNbM10sIDEwKSxcbiAgICAgICAgaXA6IHBhcnRzWzRdLFxuICAgICAgICBwb3J0OiBwYXJzZUludChwYXJ0c1s1XSwgMTApLFxuICAgICAgICAvLyBza2lwIHBhcnRzWzZdID09ICd0eXAnXG4gICAgICAgIHR5cGU6IHBhcnRzWzddXG4gICAgICB9O1xuXG4gICAgICBmb3IgKHZhciBpID0gODsgaSA8IHBhcnRzLmxlbmd0aDsgaSArPSAyKSB7XG4gICAgICAgIHN3aXRjaCAocGFydHNbaV0pIHtcbiAgICAgICAgICBjYXNlICdyYWRkcic6XG4gICAgICAgICAgICBjYW5kaWRhdGUucmVsYXRlZEFkZHJlc3MgPSBwYXJ0c1tpICsgMV07XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICBjYXNlICdycG9ydCc6XG4gICAgICAgICAgICBjYW5kaWRhdGUucmVsYXRlZFBvcnQgPSBwYXJzZUludChwYXJ0c1tpICsgMV0sIDEwKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIGNhc2UgJ3RjcHR5cGUnOlxuICAgICAgICAgICAgY2FuZGlkYXRlLnRjcFR5cGUgPSBwYXJ0c1tpICsgMV07XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICBkZWZhdWx0OiAvLyBVbmtub3duIGV4dGVuc2lvbnMgYXJlIHNpbGVudGx5IGlnbm9yZWQuXG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIGNhbmRpZGF0ZTtcbiAgICB9O1xuXG4gICAgLy8gVHJhbnNsYXRlcyBhIGNhbmRpZGF0ZSBvYmplY3QgaW50byBTRFAgY2FuZGlkYXRlIGF0dHJpYnV0ZS5cbiAgICBTRFBVdGlscy53cml0ZUNhbmRpZGF0ZSA9IGZ1bmN0aW9uKGNhbmRpZGF0ZSkge1xuICAgICAgdmFyIHNkcCA9IFtdO1xuICAgICAgc2RwLnB1c2goY2FuZGlkYXRlLmZvdW5kYXRpb24pO1xuICAgICAgc2RwLnB1c2goY2FuZGlkYXRlLmNvbXBvbmVudCk7XG4gICAgICBzZHAucHVzaChjYW5kaWRhdGUucHJvdG9jb2wudG9VcHBlckNhc2UoKSk7XG4gICAgICBzZHAucHVzaChjYW5kaWRhdGUucHJpb3JpdHkpO1xuICAgICAgc2RwLnB1c2goY2FuZGlkYXRlLmlwKTtcbiAgICAgIHNkcC5wdXNoKGNhbmRpZGF0ZS5wb3J0KTtcblxuICAgICAgdmFyIHR5cGUgPSBjYW5kaWRhdGUudHlwZTtcbiAgICAgIHNkcC5wdXNoKCd0eXAnKTtcbiAgICAgIHNkcC5wdXNoKHR5cGUpO1xuICAgICAgaWYgKHR5cGUgIT09ICdob3N0JyAmJiBjYW5kaWRhdGUucmVsYXRlZEFkZHJlc3MgJiZcbiAgICAgICAgICBjYW5kaWRhdGUucmVsYXRlZFBvcnQpIHtcbiAgICAgICAgc2RwLnB1c2goJ3JhZGRyJyk7XG4gICAgICAgIHNkcC5wdXNoKGNhbmRpZGF0ZS5yZWxhdGVkQWRkcmVzcyk7IC8vIHdhczogcmVsQWRkclxuICAgICAgICBzZHAucHVzaCgncnBvcnQnKTtcbiAgICAgICAgc2RwLnB1c2goY2FuZGlkYXRlLnJlbGF0ZWRQb3J0KTsgLy8gd2FzOiByZWxQb3J0XG4gICAgICB9XG4gICAgICBpZiAoY2FuZGlkYXRlLnRjcFR5cGUgJiYgY2FuZGlkYXRlLnByb3RvY29sLnRvTG93ZXJDYXNlKCkgPT09ICd0Y3AnKSB7XG4gICAgICAgIHNkcC5wdXNoKCd0Y3B0eXBlJyk7XG4gICAgICAgIHNkcC5wdXNoKGNhbmRpZGF0ZS50Y3BUeXBlKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiAnY2FuZGlkYXRlOicgKyBzZHAuam9pbignICcpO1xuICAgIH07XG5cbiAgICAvLyBQYXJzZXMgYW4gcnRwbWFwIGxpbmUsIHJldHVybnMgUlRDUnRwQ29kZGVjUGFyYW1ldGVycy4gU2FtcGxlIGlucHV0OlxuICAgIC8vIGE9cnRwbWFwOjExMSBvcHVzLzQ4MDAwLzJcbiAgICBTRFBVdGlscy5wYXJzZVJ0cE1hcCA9IGZ1bmN0aW9uKGxpbmUpIHtcbiAgICAgIHZhciBwYXJ0cyA9IGxpbmUuc3Vic3RyKDkpLnNwbGl0KCcgJyk7XG4gICAgICB2YXIgcGFyc2VkID0ge1xuICAgICAgICBwYXlsb2FkVHlwZTogcGFyc2VJbnQocGFydHMuc2hpZnQoKSwgMTApIC8vIHdhczogaWRcbiAgICAgIH07XG5cbiAgICAgIHBhcnRzID0gcGFydHNbMF0uc3BsaXQoJy8nKTtcblxuICAgICAgcGFyc2VkLm5hbWUgPSBwYXJ0c1swXTtcbiAgICAgIHBhcnNlZC5jbG9ja1JhdGUgPSBwYXJzZUludChwYXJ0c1sxXSwgMTApOyAvLyB3YXM6IGNsb2NrcmF0ZVxuICAgICAgcGFyc2VkLm51bUNoYW5uZWxzID0gcGFydHMubGVuZ3RoID09PSAzID8gcGFyc2VJbnQocGFydHNbMl0sIDEwKSA6IDE7IC8vIHdhczogY2hhbm5lbHNcbiAgICAgIHJldHVybiBwYXJzZWQ7XG4gICAgfTtcblxuICAgIC8vIEdlbmVyYXRlIGFuIGE9cnRwbWFwIGxpbmUgZnJvbSBSVENSdHBDb2RlY0NhcGFiaWxpdHkgb3IgUlRDUnRwQ29kZWNQYXJhbWV0ZXJzLlxuICAgIFNEUFV0aWxzLndyaXRlUnRwTWFwID0gZnVuY3Rpb24oY29kZWMpIHtcbiAgICAgIHZhciBwdCA9IGNvZGVjLnBheWxvYWRUeXBlO1xuICAgICAgaWYgKGNvZGVjLnByZWZlcnJlZFBheWxvYWRUeXBlICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgcHQgPSBjb2RlYy5wcmVmZXJyZWRQYXlsb2FkVHlwZTtcbiAgICAgIH1cbiAgICAgIHJldHVybiAnYT1ydHBtYXA6JyArIHB0ICsgJyAnICsgY29kZWMubmFtZSArICcvJyArIGNvZGVjLmNsb2NrUmF0ZSArXG4gICAgICAgICAgKGNvZGVjLm51bUNoYW5uZWxzICE9PSAxID8gJy8nICsgY29kZWMubnVtQ2hhbm5lbHMgOiAnJykgKyAnXFxyXFxuJztcbiAgICB9O1xuXG4gICAgLy8gUGFyc2VzIGFuIGZ0bXAgbGluZSwgcmV0dXJucyBkaWN0aW9uYXJ5LiBTYW1wbGUgaW5wdXQ6XG4gICAgLy8gYT1mbXRwOjk2IHZicj1vbjtjbmc9b25cbiAgICAvLyBBbHNvIGRlYWxzIHdpdGggdmJyPW9uOyBjbmc9b25cbiAgICBTRFBVdGlscy5wYXJzZUZtdHAgPSBmdW5jdGlvbihsaW5lKSB7XG4gICAgICB2YXIgcGFyc2VkID0ge307XG4gICAgICB2YXIga3Y7XG4gICAgICB2YXIgcGFydHMgPSBsaW5lLnN1YnN0cihsaW5lLmluZGV4T2YoJyAnKSArIDEpLnNwbGl0KCc7Jyk7XG4gICAgICBmb3IgKHZhciBqID0gMDsgaiA8IHBhcnRzLmxlbmd0aDsgaisrKSB7XG4gICAgICAgIGt2ID0gcGFydHNbal0udHJpbSgpLnNwbGl0KCc9Jyk7XG4gICAgICAgIHBhcnNlZFtrdlswXS50cmltKCldID0ga3ZbMV07XG4gICAgICB9XG4gICAgICByZXR1cm4gcGFyc2VkO1xuICAgIH07XG5cbiAgICAvLyBHZW5lcmF0ZXMgYW4gYT1mdG1wIGxpbmUgZnJvbSBSVENSdHBDb2RlY0NhcGFiaWxpdHkgb3IgUlRDUnRwQ29kZWNQYXJhbWV0ZXJzLlxuICAgIFNEUFV0aWxzLndyaXRlRnRtcCA9IGZ1bmN0aW9uKGNvZGVjKSB7XG4gICAgICB2YXIgbGluZSA9ICcnO1xuICAgICAgdmFyIHB0ID0gY29kZWMucGF5bG9hZFR5cGU7XG4gICAgICBpZiAoY29kZWMucHJlZmVycmVkUGF5bG9hZFR5cGUgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICBwdCA9IGNvZGVjLnByZWZlcnJlZFBheWxvYWRUeXBlO1xuICAgICAgfVxuICAgICAgaWYgKGNvZGVjLnBhcmFtZXRlcnMgJiYgY29kZWMucGFyYW1ldGVycy5sZW5ndGgpIHtcbiAgICAgICAgdmFyIHBhcmFtcyA9IFtdO1xuICAgICAgICBPYmplY3Qua2V5cyhjb2RlYy5wYXJhbWV0ZXJzKS5mb3JFYWNoKGZ1bmN0aW9uKHBhcmFtKSB7XG4gICAgICAgICAgcGFyYW1zLnB1c2gocGFyYW0gKyAnPScgKyBjb2RlYy5wYXJhbWV0ZXJzW3BhcmFtXSk7XG4gICAgICAgIH0pO1xuICAgICAgICBsaW5lICs9ICdhPWZtdHA6JyArIHB0ICsgJyAnICsgcGFyYW1zLmpvaW4oJzsnKSArICdcXHJcXG4nO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGxpbmU7XG4gICAgfTtcblxuICAgIC8vIFBhcnNlcyBhbiBydGNwLWZiIGxpbmUsIHJldHVybnMgUlRDUFJ0Y3BGZWVkYmFjayBvYmplY3QuIFNhbXBsZSBpbnB1dDpcbiAgICAvLyBhPXJ0Y3AtZmI6OTggbmFjayBycHNpXG4gICAgU0RQVXRpbHMucGFyc2VSdGNwRmIgPSBmdW5jdGlvbihsaW5lKSB7XG4gICAgICB2YXIgcGFydHMgPSBsaW5lLnN1YnN0cihsaW5lLmluZGV4T2YoJyAnKSArIDEpLnNwbGl0KCcgJyk7XG4gICAgICByZXR1cm4ge1xuICAgICAgICB0eXBlOiBwYXJ0cy5zaGlmdCgpLFxuICAgICAgICBwYXJhbWV0ZXI6IHBhcnRzLmpvaW4oJyAnKVxuICAgICAgfTtcbiAgICB9O1xuICAgIC8vIEdlbmVyYXRlIGE9cnRjcC1mYiBsaW5lcyBmcm9tIFJUQ1J0cENvZGVjQ2FwYWJpbGl0eSBvciBSVENSdHBDb2RlY1BhcmFtZXRlcnMuXG4gICAgU0RQVXRpbHMud3JpdGVSdGNwRmIgPSBmdW5jdGlvbihjb2RlYykge1xuICAgICAgdmFyIGxpbmVzID0gJyc7XG4gICAgICB2YXIgcHQgPSBjb2RlYy5wYXlsb2FkVHlwZTtcbiAgICAgIGlmIChjb2RlYy5wcmVmZXJyZWRQYXlsb2FkVHlwZSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIHB0ID0gY29kZWMucHJlZmVycmVkUGF5bG9hZFR5cGU7XG4gICAgICB9XG4gICAgICBpZiAoY29kZWMucnRjcEZlZWRiYWNrICYmIGNvZGVjLnJ0Y3BGZWVkYmFjay5sZW5ndGgpIHtcbiAgICAgICAgLy8gRklYTUU6IHNwZWNpYWwgaGFuZGxpbmcgZm9yIHRyci1pbnQ/XG4gICAgICAgIGNvZGVjLnJ0Y3BGZWVkYmFjay5mb3JFYWNoKGZ1bmN0aW9uKGZiKSB7XG4gICAgICAgICAgbGluZXMgKz0gJ2E9cnRjcC1mYjonICsgcHQgKyAnICcgKyBmYi50eXBlICsgJyAnICsgZmIucGFyYW1ldGVyICtcbiAgICAgICAgICAgICAgJ1xcclxcbic7XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGxpbmVzO1xuICAgIH07XG5cbiAgICAvLyBQYXJzZXMgYW4gUkZDIDU1NzYgc3NyYyBtZWRpYSBhdHRyaWJ1dGUuIFNhbXBsZSBpbnB1dDpcbiAgICAvLyBhPXNzcmM6MzczNTkyODU1OSBjbmFtZTpzb21ldGhpbmdcbiAgICBTRFBVdGlscy5wYXJzZVNzcmNNZWRpYSA9IGZ1bmN0aW9uKGxpbmUpIHtcbiAgICAgIHZhciBzcCA9IGxpbmUuaW5kZXhPZignICcpO1xuICAgICAgdmFyIHBhcnRzID0ge1xuICAgICAgICBzc3JjOiBsaW5lLnN1YnN0cig3LCBzcCAtIDcpLFxuICAgICAgfTtcbiAgICAgIHZhciBjb2xvbiA9IGxpbmUuaW5kZXhPZignOicsIHNwKTtcbiAgICAgIGlmIChjb2xvbiA+IC0xKSB7XG4gICAgICAgIHBhcnRzLmF0dHJpYnV0ZSA9IGxpbmUuc3Vic3RyKHNwICsgMSwgY29sb24gLSBzcCAtIDEpO1xuICAgICAgICBwYXJ0cy52YWx1ZSA9IGxpbmUuc3Vic3RyKGNvbG9uICsgMSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBwYXJ0cy5hdHRyaWJ1dGUgPSBsaW5lLnN1YnN0cihzcCArIDEpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHBhcnRzO1xuICAgIH07XG5cbiAgICAvLyBFeHRyYWN0cyBEVExTIHBhcmFtZXRlcnMgZnJvbSBTRFAgbWVkaWEgc2VjdGlvbiBvciBzZXNzaW9ucGFydC5cbiAgICAvLyBGSVhNRTogZm9yIGNvbnNpc3RlbmN5IHdpdGggb3RoZXIgZnVuY3Rpb25zIHRoaXMgc2hvdWxkIG9ubHlcbiAgICAvLyAgIGdldCB0aGUgZmluZ2VycHJpbnQgbGluZSBhcyBpbnB1dC4gU2VlIGFsc28gZ2V0SWNlUGFyYW1ldGVycy5cbiAgICBTRFBVdGlscy5nZXREdGxzUGFyYW1ldGVycyA9IGZ1bmN0aW9uKG1lZGlhU2VjdGlvbiwgc2Vzc2lvbnBhcnQpIHtcbiAgICAgIHZhciBsaW5lcyA9IFNEUFV0aWxzLnNwbGl0TGluZXMobWVkaWFTZWN0aW9uKTtcbiAgICAgIGxpbmVzID0gbGluZXMuY29uY2F0KFNEUFV0aWxzLnNwbGl0TGluZXMoc2Vzc2lvbnBhcnQpKTsgLy8gU2VhcmNoIGluIHNlc3Npb24gcGFydCwgdG9vLlxuICAgICAgdmFyIGZwTGluZSA9IGxpbmVzLmZpbHRlcihmdW5jdGlvbihsaW5lKSB7XG4gICAgICAgIHJldHVybiBsaW5lLmluZGV4T2YoJ2E9ZmluZ2VycHJpbnQ6JykgPT09IDA7XG4gICAgICB9KVswXS5zdWJzdHIoMTQpO1xuICAgICAgLy8gTm90ZTogYT1zZXR1cCBsaW5lIGlzIGlnbm9yZWQgc2luY2Ugd2UgdXNlIHRoZSAnYXV0bycgcm9sZS5cbiAgICAgIHZhciBkdGxzUGFyYW1ldGVycyA9IHtcbiAgICAgICAgcm9sZTogJ2F1dG8nLFxuICAgICAgICBmaW5nZXJwcmludHM6IFt7XG4gICAgICAgICAgYWxnb3JpdGhtOiBmcExpbmUuc3BsaXQoJyAnKVswXSxcbiAgICAgICAgICB2YWx1ZTogZnBMaW5lLnNwbGl0KCcgJylbMV1cbiAgICAgICAgfV1cbiAgICAgIH07XG4gICAgICByZXR1cm4gZHRsc1BhcmFtZXRlcnM7XG4gICAgfTtcblxuICAgIC8vIFNlcmlhbGl6ZXMgRFRMUyBwYXJhbWV0ZXJzIHRvIFNEUC5cbiAgICBTRFBVdGlscy53cml0ZUR0bHNQYXJhbWV0ZXJzID0gZnVuY3Rpb24ocGFyYW1zLCBzZXR1cFR5cGUpIHtcbiAgICAgIHZhciBzZHAgPSAnYT1zZXR1cDonICsgc2V0dXBUeXBlICsgJ1xcclxcbic7XG4gICAgICBwYXJhbXMuZmluZ2VycHJpbnRzLmZvckVhY2goZnVuY3Rpb24oZnApIHtcbiAgICAgICAgc2RwICs9ICdhPWZpbmdlcnByaW50OicgKyBmcC5hbGdvcml0aG0gKyAnICcgKyBmcC52YWx1ZSArICdcXHJcXG4nO1xuICAgICAgfSk7XG4gICAgICByZXR1cm4gc2RwO1xuICAgIH07XG4gICAgLy8gUGFyc2VzIElDRSBpbmZvcm1hdGlvbiBmcm9tIFNEUCBtZWRpYSBzZWN0aW9uIG9yIHNlc3Npb25wYXJ0LlxuICAgIC8vIEZJWE1FOiBmb3IgY29uc2lzdGVuY3kgd2l0aCBvdGhlciBmdW5jdGlvbnMgdGhpcyBzaG91bGQgb25seVxuICAgIC8vICAgZ2V0IHRoZSBpY2UtdWZyYWcgYW5kIGljZS1wd2QgbGluZXMgYXMgaW5wdXQuXG4gICAgU0RQVXRpbHMuZ2V0SWNlUGFyYW1ldGVycyA9IGZ1bmN0aW9uKG1lZGlhU2VjdGlvbiwgc2Vzc2lvbnBhcnQpIHtcbiAgICAgIHZhciBsaW5lcyA9IFNEUFV0aWxzLnNwbGl0TGluZXMobWVkaWFTZWN0aW9uKTtcbiAgICAgIGxpbmVzID0gbGluZXMuY29uY2F0KFNEUFV0aWxzLnNwbGl0TGluZXMoc2Vzc2lvbnBhcnQpKTsgLy8gU2VhcmNoIGluIHNlc3Npb24gcGFydCwgdG9vLlxuICAgICAgdmFyIGljZVBhcmFtZXRlcnMgPSB7XG4gICAgICAgIHVzZXJuYW1lRnJhZ21lbnQ6IGxpbmVzLmZpbHRlcihmdW5jdGlvbihsaW5lKSB7XG4gICAgICAgICAgcmV0dXJuIGxpbmUuaW5kZXhPZignYT1pY2UtdWZyYWc6JykgPT09IDA7XG4gICAgICAgIH0pWzBdLnN1YnN0cigxMiksXG4gICAgICAgIHBhc3N3b3JkOiBsaW5lcy5maWx0ZXIoZnVuY3Rpb24obGluZSkge1xuICAgICAgICAgIHJldHVybiBsaW5lLmluZGV4T2YoJ2E9aWNlLXB3ZDonKSA9PT0gMDtcbiAgICAgICAgfSlbMF0uc3Vic3RyKDEwKVxuICAgICAgfTtcbiAgICAgIHJldHVybiBpY2VQYXJhbWV0ZXJzO1xuICAgIH07XG5cbiAgICAvLyBTZXJpYWxpemVzIElDRSBwYXJhbWV0ZXJzIHRvIFNEUC5cbiAgICBTRFBVdGlscy53cml0ZUljZVBhcmFtZXRlcnMgPSBmdW5jdGlvbihwYXJhbXMpIHtcbiAgICAgIHJldHVybiAnYT1pY2UtdWZyYWc6JyArIHBhcmFtcy51c2VybmFtZUZyYWdtZW50ICsgJ1xcclxcbicgK1xuICAgICAgICAgICdhPWljZS1wd2Q6JyArIHBhcmFtcy5wYXNzd29yZCArICdcXHJcXG4nO1xuICAgIH07XG5cbiAgICAvLyBQYXJzZXMgdGhlIFNEUCBtZWRpYSBzZWN0aW9uIGFuZCByZXR1cm5zIFJUQ1J0cFBhcmFtZXRlcnMuXG4gICAgU0RQVXRpbHMucGFyc2VSdHBQYXJhbWV0ZXJzID0gZnVuY3Rpb24obWVkaWFTZWN0aW9uKSB7XG4gICAgICB2YXIgZGVzY3JpcHRpb24gPSB7XG4gICAgICAgIGNvZGVjczogW10sXG4gICAgICAgIGhlYWRlckV4dGVuc2lvbnM6IFtdLFxuICAgICAgICBmZWNNZWNoYW5pc21zOiBbXSxcbiAgICAgICAgcnRjcDogW11cbiAgICAgIH07XG4gICAgICB2YXIgbGluZXMgPSBTRFBVdGlscy5zcGxpdExpbmVzKG1lZGlhU2VjdGlvbik7XG4gICAgICB2YXIgbWxpbmUgPSBsaW5lc1swXS5zcGxpdCgnICcpO1xuICAgICAgZm9yICh2YXIgaSA9IDM7IGkgPCBtbGluZS5sZW5ndGg7IGkrKykgeyAvLyBmaW5kIGFsbCBjb2RlY3MgZnJvbSBtbGluZVszLi5dXG4gICAgICAgIHZhciBwdCA9IG1saW5lW2ldO1xuICAgICAgICB2YXIgcnRwbWFwbGluZSA9IFNEUFV0aWxzLm1hdGNoUHJlZml4KFxuICAgICAgICAgICAgbWVkaWFTZWN0aW9uLCAnYT1ydHBtYXA6JyArIHB0ICsgJyAnKVswXTtcbiAgICAgICAgaWYgKHJ0cG1hcGxpbmUpIHtcbiAgICAgICAgICB2YXIgY29kZWMgPSBTRFBVdGlscy5wYXJzZVJ0cE1hcChydHBtYXBsaW5lKTtcbiAgICAgICAgICB2YXIgZm10cHMgPSBTRFBVdGlscy5tYXRjaFByZWZpeChcbiAgICAgICAgICAgICAgbWVkaWFTZWN0aW9uLCAnYT1mbXRwOicgKyBwdCArICcgJyk7XG4gICAgICAgICAgLy8gT25seSB0aGUgZmlyc3QgYT1mbXRwOjxwdD4gaXMgY29uc2lkZXJlZC5cbiAgICAgICAgICBjb2RlYy5wYXJhbWV0ZXJzID0gZm10cHMubGVuZ3RoID8gU0RQVXRpbHMucGFyc2VGbXRwKGZtdHBzWzBdKSA6IHt9O1xuICAgICAgICAgIGNvZGVjLnJ0Y3BGZWVkYmFjayA9IFNEUFV0aWxzLm1hdGNoUHJlZml4KFxuICAgICAgICAgICAgICBtZWRpYVNlY3Rpb24sICdhPXJ0Y3AtZmI6JyArIHB0ICsgJyAnKVxuICAgICAgICAgICAgLm1hcChTRFBVdGlscy5wYXJzZVJ0Y3BGYik7XG4gICAgICAgICAgZGVzY3JpcHRpb24uY29kZWNzLnB1c2goY29kZWMpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICAvLyBGSVhNRTogcGFyc2UgaGVhZGVyRXh0ZW5zaW9ucywgZmVjTWVjaGFuaXNtcyBhbmQgcnRjcC5cbiAgICAgIHJldHVybiBkZXNjcmlwdGlvbjtcbiAgICB9O1xuXG4gICAgLy8gR2VuZXJhdGVzIHBhcnRzIG9mIHRoZSBTRFAgbWVkaWEgc2VjdGlvbiBkZXNjcmliaW5nIHRoZSBjYXBhYmlsaXRpZXMgLyBwYXJhbWV0ZXJzLlxuICAgIFNEUFV0aWxzLndyaXRlUnRwRGVzY3JpcHRpb24gPSBmdW5jdGlvbihraW5kLCBjYXBzKSB7XG4gICAgICB2YXIgc2RwID0gJyc7XG5cbiAgICAgIC8vIEJ1aWxkIHRoZSBtbGluZS5cbiAgICAgIHNkcCArPSAnbT0nICsga2luZCArICcgJztcbiAgICAgIHNkcCArPSBjYXBzLmNvZGVjcy5sZW5ndGggPiAwID8gJzknIDogJzAnOyAvLyByZWplY3QgaWYgbm8gY29kZWNzLlxuICAgICAgc2RwICs9ICcgVURQL1RMUy9SVFAvU0FWUEYgJztcbiAgICAgIHNkcCArPSBjYXBzLmNvZGVjcy5tYXAoZnVuY3Rpb24oY29kZWMpIHtcbiAgICAgICAgaWYgKGNvZGVjLnByZWZlcnJlZFBheWxvYWRUeXBlICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICByZXR1cm4gY29kZWMucHJlZmVycmVkUGF5bG9hZFR5cGU7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGNvZGVjLnBheWxvYWRUeXBlO1xuICAgICAgfSkuam9pbignICcpICsgJ1xcclxcbic7XG5cbiAgICAgIHNkcCArPSAnYz1JTiBJUDQgMC4wLjAuMFxcclxcbic7XG4gICAgICBzZHAgKz0gJ2E9cnRjcDo5IElOIElQNCAwLjAuMC4wXFxyXFxuJztcblxuICAgICAgLy8gQWRkIGE9cnRwbWFwIGxpbmVzIGZvciBlYWNoIGNvZGVjLiBBbHNvIGZtdHAgYW5kIHJ0Y3AtZmIuXG4gICAgICBjYXBzLmNvZGVjcy5mb3JFYWNoKGZ1bmN0aW9uKGNvZGVjKSB7XG4gICAgICAgIHNkcCArPSBTRFBVdGlscy53cml0ZVJ0cE1hcChjb2RlYyk7XG4gICAgICAgIHNkcCArPSBTRFBVdGlscy53cml0ZUZ0bXAoY29kZWMpO1xuICAgICAgICBzZHAgKz0gU0RQVXRpbHMud3JpdGVSdGNwRmIoY29kZWMpO1xuICAgICAgfSk7XG4gICAgICAvLyBGSVhNRTogYWRkIGhlYWRlckV4dGVuc2lvbnMsIGZlY01lY2hhbmlzbcWfIGFuZCBydGNwLlxuICAgICAgc2RwICs9ICdhPXJ0Y3AtbXV4XFxyXFxuJztcbiAgICAgIHJldHVybiBzZHA7XG4gICAgfTtcblxuICAgIFNEUFV0aWxzLndyaXRlU2Vzc2lvbkJvaWxlcnBsYXRlID0gZnVuY3Rpb24oKSB7XG4gICAgICAvLyBGSVhNRTogc2Vzcy1pZCBzaG91bGQgYmUgYW4gTlRQIHRpbWVzdGFtcC5cbiAgICAgIHJldHVybiAndj0wXFxyXFxuJyArXG4gICAgICAgICAgJ289dGhpc2lzYWRhcHRlcm9ydGMgODE2OTYzOTkxNTY0Njk0MzEzNyAyIElOIElQNCAxMjcuMC4wLjFcXHJcXG4nICtcbiAgICAgICAgICAncz0tXFxyXFxuJyArXG4gICAgICAgICAgJ3Q9MCAwXFxyXFxuJztcbiAgICB9O1xuXG4gICAgU0RQVXRpbHMud3JpdGVNZWRpYVNlY3Rpb24gPSBmdW5jdGlvbih0cmFuc2NlaXZlciwgY2FwcywgdHlwZSwgc3RyZWFtKSB7XG4gICAgICB2YXIgc2RwID0gU0RQVXRpbHMud3JpdGVSdHBEZXNjcmlwdGlvbih0cmFuc2NlaXZlci5raW5kLCBjYXBzKTtcblxuICAgICAgLy8gTWFwIElDRSBwYXJhbWV0ZXJzICh1ZnJhZywgcHdkKSB0byBTRFAuXG4gICAgICBzZHAgKz0gU0RQVXRpbHMud3JpdGVJY2VQYXJhbWV0ZXJzKFxuICAgICAgICAgIHRyYW5zY2VpdmVyLmljZUdhdGhlcmVyLmdldExvY2FsUGFyYW1ldGVycygpKTtcblxuICAgICAgLy8gTWFwIERUTFMgcGFyYW1ldGVycyB0byBTRFAuXG4gICAgICBzZHAgKz0gU0RQVXRpbHMud3JpdGVEdGxzUGFyYW1ldGVycyhcbiAgICAgICAgICB0cmFuc2NlaXZlci5kdGxzVHJhbnNwb3J0LmdldExvY2FsUGFyYW1ldGVycygpLFxuICAgICAgICAgIHR5cGUgPT09ICdvZmZlcicgPyAnYWN0cGFzcycgOiAnYWN0aXZlJyk7XG5cbiAgICAgIHNkcCArPSAnYT1taWQ6JyArIHRyYW5zY2VpdmVyLm1pZCArICdcXHJcXG4nO1xuXG4gICAgICBpZiAodHJhbnNjZWl2ZXIucnRwU2VuZGVyICYmIHRyYW5zY2VpdmVyLnJ0cFJlY2VpdmVyKSB7XG4gICAgICAgIHNkcCArPSAnYT1zZW5kcmVjdlxcclxcbic7XG4gICAgICB9IGVsc2UgaWYgKHRyYW5zY2VpdmVyLnJ0cFNlbmRlcikge1xuICAgICAgICBzZHAgKz0gJ2E9c2VuZG9ubHlcXHJcXG4nO1xuICAgICAgfSBlbHNlIGlmICh0cmFuc2NlaXZlci5ydHBSZWNlaXZlcikge1xuICAgICAgICBzZHAgKz0gJ2E9cmVjdm9ubHlcXHJcXG4nO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgc2RwICs9ICdhPWluYWN0aXZlXFxyXFxuJztcbiAgICAgIH1cblxuICAgICAgLy8gRklYTUU6IGZvciBSVFggdGhlcmUgbWlnaHQgYmUgbXVsdGlwbGUgU1NSQ3MuIE5vdCBpbXBsZW1lbnRlZCBpbiBFZGdlIHlldC5cbiAgICAgIGlmICh0cmFuc2NlaXZlci5ydHBTZW5kZXIpIHtcbiAgICAgICAgdmFyIG1zaWQgPSAnbXNpZDonICsgc3RyZWFtLmlkICsgJyAnICtcbiAgICAgICAgICAgIHRyYW5zY2VpdmVyLnJ0cFNlbmRlci50cmFjay5pZCArICdcXHJcXG4nO1xuICAgICAgICBzZHAgKz0gJ2E9JyArIG1zaWQ7XG4gICAgICAgIHNkcCArPSAnYT1zc3JjOicgKyB0cmFuc2NlaXZlci5zZW5kU3NyYyArICcgJyArIG1zaWQ7XG4gICAgICB9XG4gICAgICAvLyBGSVhNRTogdGhpcyBzaG91bGQgYmUgd3JpdHRlbiBieSB3cml0ZVJ0cERlc2NyaXB0aW9uLlxuICAgICAgc2RwICs9ICdhPXNzcmM6JyArIHRyYW5zY2VpdmVyLnNlbmRTc3JjICsgJyBjbmFtZTonICtcbiAgICAgICAgICBsb2NhbENOYW1lICsgJ1xcclxcbic7XG4gICAgICByZXR1cm4gc2RwO1xuICAgIH07XG5cbiAgICAvLyBHZXRzIHRoZSBkaXJlY3Rpb24gZnJvbSB0aGUgbWVkaWFTZWN0aW9uIG9yIHRoZSBzZXNzaW9ucGFydC5cbiAgICBTRFBVdGlscy5nZXREaXJlY3Rpb24gPSBmdW5jdGlvbihtZWRpYVNlY3Rpb24sIHNlc3Npb25wYXJ0KSB7XG4gICAgICAvLyBMb29rIGZvciBzZW5kcmVjdiwgc2VuZG9ubHksIHJlY3Zvbmx5LCBpbmFjdGl2ZSwgZGVmYXVsdCB0byBzZW5kcmVjdi5cbiAgICAgIHZhciBsaW5lcyA9IFNEUFV0aWxzLnNwbGl0TGluZXMobWVkaWFTZWN0aW9uKTtcbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbGluZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgc3dpdGNoIChsaW5lc1tpXSkge1xuICAgICAgICAgIGNhc2UgJ2E9c2VuZHJlY3YnOlxuICAgICAgICAgIGNhc2UgJ2E9c2VuZG9ubHknOlxuICAgICAgICAgIGNhc2UgJ2E9cmVjdm9ubHknOlxuICAgICAgICAgIGNhc2UgJ2E9aW5hY3RpdmUnOlxuICAgICAgICAgICAgcmV0dXJuIGxpbmVzW2ldLnN1YnN0cigyKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKHNlc3Npb25wYXJ0KSB7XG4gICAgICAgIHJldHVybiBTRFBVdGlscy5nZXREaXJlY3Rpb24oc2Vzc2lvbnBhcnQpO1xuICAgICAgfVxuICAgICAgcmV0dXJuICdzZW5kcmVjdic7XG4gICAgfTtcblxuICAgIC8vIE9SVEMgZGVmaW5lcyBhbiBSVENJY2VDYW5kaWRhdGUgb2JqZWN0IGJ1dCBubyBjb25zdHJ1Y3Rvci5cbiAgICAvLyBOb3QgaW1wbGVtZW50ZWQgaW4gRWRnZS5cbiAgICBpZiAoIXdpbmRvdy5SVENJY2VDYW5kaWRhdGUpIHtcbiAgICAgIHdpbmRvdy5SVENJY2VDYW5kaWRhdGUgPSBmdW5jdGlvbihhcmdzKSB7XG4gICAgICAgIHJldHVybiBhcmdzO1xuICAgICAgfTtcbiAgICB9XG4gICAgLy8gT1JUQyBkb2VzIG5vdCBoYXZlIGEgc2Vzc2lvbiBkZXNjcmlwdGlvbiBvYmplY3QgYnV0XG4gICAgLy8gb3RoZXIgYnJvd3NlcnMgKGkuZS4gQ2hyb21lKSB0aGF0IHdpbGwgc3VwcG9ydCBib3RoIFBDIGFuZCBPUlRDXG4gICAgLy8gaW4gdGhlIGZ1dHVyZSBtaWdodCBoYXZlIHRoaXMgZGVmaW5lZCBhbHJlYWR5LlxuICAgIGlmICghd2luZG93LlJUQ1Nlc3Npb25EZXNjcmlwdGlvbikge1xuICAgICAgd2luZG93LlJUQ1Nlc3Npb25EZXNjcmlwdGlvbiA9IGZ1bmN0aW9uKGFyZ3MpIHtcbiAgICAgICAgcmV0dXJuIGFyZ3M7XG4gICAgICB9O1xuICAgIH1cblxuICAgIHdpbmRvdy5SVENQZWVyQ29ubmVjdGlvbiA9IGZ1bmN0aW9uKGNvbmZpZykge1xuICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuXG4gICAgICB0aGlzLm9uaWNlY2FuZGlkYXRlID0gbnVsbDtcbiAgICAgIHRoaXMub25hZGRzdHJlYW0gPSBudWxsO1xuICAgICAgdGhpcy5vbnJlbW92ZXN0cmVhbSA9IG51bGw7XG4gICAgICB0aGlzLm9uc2lnbmFsaW5nc3RhdGVjaGFuZ2UgPSBudWxsO1xuICAgICAgdGhpcy5vbmljZWNvbm5lY3Rpb25zdGF0ZWNoYW5nZSA9IG51bGw7XG4gICAgICB0aGlzLm9ubmVnb3RpYXRpb25uZWVkZWQgPSBudWxsO1xuICAgICAgdGhpcy5vbmRhdGFjaGFubmVsID0gbnVsbDtcblxuICAgICAgdGhpcy5sb2NhbFN0cmVhbXMgPSBbXTtcbiAgICAgIHRoaXMucmVtb3RlU3RyZWFtcyA9IFtdO1xuICAgICAgdGhpcy5nZXRMb2NhbFN0cmVhbXMgPSBmdW5jdGlvbigpIHsgcmV0dXJuIHNlbGYubG9jYWxTdHJlYW1zOyB9O1xuICAgICAgdGhpcy5nZXRSZW1vdGVTdHJlYW1zID0gZnVuY3Rpb24oKSB7IHJldHVybiBzZWxmLnJlbW90ZVN0cmVhbXM7IH07XG5cbiAgICAgIHRoaXMubG9jYWxEZXNjcmlwdGlvbiA9IG5ldyBSVENTZXNzaW9uRGVzY3JpcHRpb24oe1xuICAgICAgICB0eXBlOiAnJyxcbiAgICAgICAgc2RwOiAnJ1xuICAgICAgfSk7XG4gICAgICB0aGlzLnJlbW90ZURlc2NyaXB0aW9uID0gbmV3IFJUQ1Nlc3Npb25EZXNjcmlwdGlvbih7XG4gICAgICAgIHR5cGU6ICcnLFxuICAgICAgICBzZHA6ICcnXG4gICAgICB9KTtcbiAgICAgIHRoaXMuc2lnbmFsaW5nU3RhdGUgPSAnc3RhYmxlJztcbiAgICAgIHRoaXMuaWNlQ29ubmVjdGlvblN0YXRlID0gJ25ldyc7XG5cbiAgICAgIHRoaXMuaWNlT3B0aW9ucyA9IHtcbiAgICAgICAgZ2F0aGVyUG9saWN5OiAnYWxsJyxcbiAgICAgICAgaWNlU2VydmVyczogW11cbiAgICAgIH07XG4gICAgICBpZiAoY29uZmlnICYmIGNvbmZpZy5pY2VUcmFuc3BvcnRQb2xpY3kpIHtcbiAgICAgICAgc3dpdGNoIChjb25maWcuaWNlVHJhbnNwb3J0UG9saWN5KSB7XG4gICAgICAgICAgY2FzZSAnYWxsJzpcbiAgICAgICAgICBjYXNlICdyZWxheSc6XG4gICAgICAgICAgICB0aGlzLmljZU9wdGlvbnMuZ2F0aGVyUG9saWN5ID0gY29uZmlnLmljZVRyYW5zcG9ydFBvbGljeTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIGNhc2UgJ25vbmUnOlxuICAgICAgICAgICAgLy8gRklYTUU6IHJlbW92ZSBvbmNlIGltcGxlbWVudGF0aW9uIGFuZCBzcGVjIGhhdmUgYWRkZWQgdGhpcy5cbiAgICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ2ljZVRyYW5zcG9ydFBvbGljeSBcIm5vbmVcIiBub3Qgc3VwcG9ydGVkJyk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmIChjb25maWcgJiYgY29uZmlnLmljZVNlcnZlcnMpIHtcbiAgICAgICAgLy8gRWRnZSBkb2VzIG5vdCBsaWtlXG4gICAgICAgIC8vIDEpIHN0dW46XG4gICAgICAgIC8vIDIpIHR1cm46IHRoYXQgZG9lcyBub3QgaGF2ZSBhbGwgb2YgdHVybjpob3N0OnBvcnQ/dHJhbnNwb3J0PXVkcFxuICAgICAgICAvLyAzKSBhbiBhcnJheSBvZiB1cmxzXG4gICAgICAgIGNvbmZpZy5pY2VTZXJ2ZXJzLmZvckVhY2goZnVuY3Rpb24oc2VydmVyKSB7XG4gICAgICAgICAgaWYgKHNlcnZlci51cmxzKSB7XG4gICAgICAgICAgICB2YXIgdXJsO1xuICAgICAgICAgICAgaWYgKHR5cGVvZihzZXJ2ZXIudXJscykgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICAgIHVybCA9IHNlcnZlci51cmxzO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgdXJsID0gc2VydmVyLnVybHNbMF07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAodXJsLmluZGV4T2YoJ3RyYW5zcG9ydD11ZHAnKSAhPT0gLTEpIHtcbiAgICAgICAgICAgICAgc2VsZi5pY2VTZXJ2ZXJzLnB1c2goe1xuICAgICAgICAgICAgICAgIHVzZXJuYW1lOiBzZXJ2ZXIudXNlcm5hbWUsXG4gICAgICAgICAgICAgICAgY3JlZGVudGlhbDogc2VydmVyLmNyZWRlbnRpYWwsXG4gICAgICAgICAgICAgICAgdXJsczogdXJsXG4gICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9XG5cbiAgICAgIC8vIHBlci10cmFjayBpY2VHYXRoZXJzLCBpY2VUcmFuc3BvcnRzLCBkdGxzVHJhbnNwb3J0cywgcnRwU2VuZGVycywgLi4uXG4gICAgICAvLyBldmVyeXRoaW5nIHRoYXQgaXMgbmVlZGVkIHRvIGRlc2NyaWJlIGEgU0RQIG0tbGluZS5cbiAgICAgIHRoaXMudHJhbnNjZWl2ZXJzID0gW107XG5cbiAgICAgIC8vIHNpbmNlIHRoZSBpY2VHYXRoZXJlciBpcyBjdXJyZW50bHkgY3JlYXRlZCBpbiBjcmVhdGVPZmZlciBidXQgd2VcbiAgICAgIC8vIG11c3Qgbm90IGVtaXQgY2FuZGlkYXRlcyB1bnRpbCBhZnRlciBzZXRMb2NhbERlc2NyaXB0aW9uIHdlIGJ1ZmZlclxuICAgICAgLy8gdGhlbSBpbiB0aGlzIGFycmF5LlxuICAgICAgdGhpcy5fbG9jYWxJY2VDYW5kaWRhdGVzQnVmZmVyID0gW107XG4gICAgfTtcblxuICAgIHdpbmRvdy5SVENQZWVyQ29ubmVjdGlvbi5wcm90b3R5cGUuX2VtaXRCdWZmZXJlZENhbmRpZGF0ZXMgPSBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgIC8vIEZJWE1FOiBuZWVkIHRvIGFwcGx5IGljZSBjYW5kaWRhdGVzIGluIGEgd2F5IHdoaWNoIGlzIGFzeW5jIGJ1dCBpbi1vcmRlclxuICAgICAgdGhpcy5fbG9jYWxJY2VDYW5kaWRhdGVzQnVmZmVyLmZvckVhY2goZnVuY3Rpb24oZXZlbnQpIHtcbiAgICAgICAgaWYgKHNlbGYub25pY2VjYW5kaWRhdGUgIT09IG51bGwpIHtcbiAgICAgICAgICBzZWxmLm9uaWNlY2FuZGlkYXRlKGV2ZW50KTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICB0aGlzLl9sb2NhbEljZUNhbmRpZGF0ZXNCdWZmZXIgPSBbXTtcbiAgICB9O1xuXG4gICAgd2luZG93LlJUQ1BlZXJDb25uZWN0aW9uLnByb3RvdHlwZS5hZGRTdHJlYW0gPSBmdW5jdGlvbihzdHJlYW0pIHtcbiAgICAgIC8vIENsb25lIGlzIG5lY2Vzc2FyeSBmb3IgbG9jYWwgZGVtb3MgbW9zdGx5LCBhdHRhY2hpbmcgZGlyZWN0bHlcbiAgICAgIC8vIHRvIHR3byBkaWZmZXJlbnQgc2VuZGVycyBkb2VzIG5vdCB3b3JrIChidWlsZCAxMDU0NykuXG4gICAgICB0aGlzLmxvY2FsU3RyZWFtcy5wdXNoKHN0cmVhbS5jbG9uZSgpKTtcbiAgICAgIHRoaXMuX21heWJlRmlyZU5lZ290aWF0aW9uTmVlZGVkKCk7XG4gICAgfTtcblxuICAgIHdpbmRvdy5SVENQZWVyQ29ubmVjdGlvbi5wcm90b3R5cGUucmVtb3ZlU3RyZWFtID0gZnVuY3Rpb24oc3RyZWFtKSB7XG4gICAgICB2YXIgaWR4ID0gdGhpcy5sb2NhbFN0cmVhbXMuaW5kZXhPZihzdHJlYW0pO1xuICAgICAgaWYgKGlkeCA+IC0xKSB7XG4gICAgICAgIHRoaXMubG9jYWxTdHJlYW1zLnNwbGljZShpZHgsIDEpO1xuICAgICAgICB0aGlzLl9tYXliZUZpcmVOZWdvdGlhdGlvbk5lZWRlZCgpO1xuICAgICAgfVxuICAgIH07XG5cbiAgICAvLyBEZXRlcm1pbmVzIHRoZSBpbnRlcnNlY3Rpb24gb2YgbG9jYWwgYW5kIHJlbW90ZSBjYXBhYmlsaXRpZXMuXG4gICAgd2luZG93LlJUQ1BlZXJDb25uZWN0aW9uLnByb3RvdHlwZS5fZ2V0Q29tbW9uQ2FwYWJpbGl0aWVzID1cbiAgICAgICAgZnVuY3Rpb24obG9jYWxDYXBhYmlsaXRpZXMsIHJlbW90ZUNhcGFiaWxpdGllcykge1xuICAgICAgdmFyIGNvbW1vbkNhcGFiaWxpdGllcyA9IHtcbiAgICAgICAgY29kZWNzOiBbXSxcbiAgICAgICAgaGVhZGVyRXh0ZW5zaW9uczogW10sXG4gICAgICAgIGZlY01lY2hhbmlzbXM6IFtdXG4gICAgICB9O1xuICAgICAgbG9jYWxDYXBhYmlsaXRpZXMuY29kZWNzLmZvckVhY2goZnVuY3Rpb24obENvZGVjKSB7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcmVtb3RlQ2FwYWJpbGl0aWVzLmNvZGVjcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgIHZhciByQ29kZWMgPSByZW1vdGVDYXBhYmlsaXRpZXMuY29kZWNzW2ldO1xuICAgICAgICAgIGlmIChsQ29kZWMubmFtZS50b0xvd2VyQ2FzZSgpID09PSByQ29kZWMubmFtZS50b0xvd2VyQ2FzZSgpICYmXG4gICAgICAgICAgICAgIGxDb2RlYy5jbG9ja1JhdGUgPT09IHJDb2RlYy5jbG9ja1JhdGUgJiZcbiAgICAgICAgICAgICAgbENvZGVjLm51bUNoYW5uZWxzID09PSByQ29kZWMubnVtQ2hhbm5lbHMpIHtcbiAgICAgICAgICAgIC8vIHB1c2ggckNvZGVjIHNvIHdlIHJlcGx5IHdpdGggb2ZmZXJlciBwYXlsb2FkIHR5cGVcbiAgICAgICAgICAgIGNvbW1vbkNhcGFiaWxpdGllcy5jb2RlY3MucHVzaChyQ29kZWMpO1xuXG4gICAgICAgICAgICAvLyBGSVhNRTogYWxzbyBuZWVkIHRvIGRldGVybWluZSBpbnRlcnNlY3Rpb24gYmV0d2VlblxuICAgICAgICAgICAgLy8gLnJ0Y3BGZWVkYmFjayBhbmQgLnBhcmFtZXRlcnNcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSk7XG5cbiAgICAgIGxvY2FsQ2FwYWJpbGl0aWVzLmhlYWRlckV4dGVuc2lvbnMuZm9yRWFjaChmdW5jdGlvbihsSGVhZGVyRXh0ZW5zaW9uKSB7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcmVtb3RlQ2FwYWJpbGl0aWVzLmhlYWRlckV4dGVuc2lvbnMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICB2YXIgckhlYWRlckV4dGVuc2lvbiA9IHJlbW90ZUNhcGFiaWxpdGllcy5oZWFkZXJFeHRlbnNpb25zW2ldO1xuICAgICAgICAgIGlmIChsSGVhZGVyRXh0ZW5zaW9uLnVyaSA9PT0gckhlYWRlckV4dGVuc2lvbi51cmkpIHtcbiAgICAgICAgICAgIGNvbW1vbkNhcGFiaWxpdGllcy5oZWFkZXJFeHRlbnNpb25zLnB1c2gockhlYWRlckV4dGVuc2lvbik7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0pO1xuXG4gICAgICAvLyBGSVhNRTogZmVjTWVjaGFuaXNtc1xuICAgICAgcmV0dXJuIGNvbW1vbkNhcGFiaWxpdGllcztcbiAgICB9O1xuXG4gICAgLy8gQ3JlYXRlIElDRSBnYXRoZXJlciwgSUNFIHRyYW5zcG9ydCBhbmQgRFRMUyB0cmFuc3BvcnQuXG4gICAgd2luZG93LlJUQ1BlZXJDb25uZWN0aW9uLnByb3RvdHlwZS5fY3JlYXRlSWNlQW5kRHRsc1RyYW5zcG9ydHMgPVxuICAgICAgICBmdW5jdGlvbihtaWQsIHNkcE1MaW5lSW5kZXgpIHtcbiAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgIHZhciBpY2VHYXRoZXJlciA9IG5ldyBSVENJY2VHYXRoZXJlcihzZWxmLmljZU9wdGlvbnMpO1xuICAgICAgdmFyIGljZVRyYW5zcG9ydCA9IG5ldyBSVENJY2VUcmFuc3BvcnQoaWNlR2F0aGVyZXIpO1xuICAgICAgaWNlR2F0aGVyZXIub25sb2NhbGNhbmRpZGF0ZSA9IGZ1bmN0aW9uKGV2dCkge1xuICAgICAgICB2YXIgZXZlbnQgPSB7fTtcbiAgICAgICAgZXZlbnQuY2FuZGlkYXRlID0ge3NkcE1pZDogbWlkLCBzZHBNTGluZUluZGV4OiBzZHBNTGluZUluZGV4fTtcblxuICAgICAgICB2YXIgY2FuZCA9IGV2dC5jYW5kaWRhdGU7XG4gICAgICAgIC8vIEVkZ2UgZW1pdHMgYW4gZW1wdHkgb2JqZWN0IGZvciBSVENJY2VDYW5kaWRhdGVDb21wbGV0ZeKApVxuICAgICAgICBpZiAoIWNhbmQgfHwgT2JqZWN0LmtleXMoY2FuZCkubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgLy8gcG9seWZpbGwgc2luY2UgUlRDSWNlR2F0aGVyZXIuc3RhdGUgaXMgbm90IGltcGxlbWVudGVkIGluIEVkZ2UgMTA1NDcgeWV0LlxuICAgICAgICAgIGlmIChpY2VHYXRoZXJlci5zdGF0ZSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICBpY2VHYXRoZXJlci5zdGF0ZSA9ICdjb21wbGV0ZWQnO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIC8vIEVtaXQgYSBjYW5kaWRhdGUgd2l0aCB0eXBlIGVuZE9mQ2FuZGlkYXRlcyB0byBtYWtlIHRoZSBzYW1wbGVzIHdvcmsuXG4gICAgICAgICAgLy8gRWRnZSByZXF1aXJlcyBhZGRJY2VDYW5kaWRhdGUgd2l0aCB0aGlzIGVtcHR5IGNhbmRpZGF0ZSB0byBzdGFydCBjaGVja2luZy5cbiAgICAgICAgICAvLyBUaGUgcmVhbCBzb2x1dGlvbiBpcyB0byBzaWduYWwgZW5kLW9mLWNhbmRpZGF0ZXMgdG8gdGhlIG90aGVyIHNpZGUgd2hlblxuICAgICAgICAgIC8vIGdldHRpbmcgdGhlIG51bGwgY2FuZGlkYXRlIGJ1dCBzb21lIGFwcHMgKGxpa2UgdGhlIHNhbXBsZXMpIGRvbid0IGRvIHRoYXQuXG4gICAgICAgICAgZXZlbnQuY2FuZGlkYXRlLmNhbmRpZGF0ZSA9XG4gICAgICAgICAgICAgICdjYW5kaWRhdGU6MSAxIHVkcCAxIDAuMC4wLjAgOSB0eXAgZW5kT2ZDYW5kaWRhdGVzJztcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAvLyBSVENJY2VDYW5kaWRhdGUgZG9lc24ndCBoYXZlIGEgY29tcG9uZW50LCBuZWVkcyB0byBiZSBhZGRlZFxuICAgICAgICAgIGNhbmQuY29tcG9uZW50ID0gaWNlVHJhbnNwb3J0LmNvbXBvbmVudCA9PT0gJ1JUQ1AnID8gMiA6IDE7XG4gICAgICAgICAgZXZlbnQuY2FuZGlkYXRlLmNhbmRpZGF0ZSA9IFNEUFV0aWxzLndyaXRlQ2FuZGlkYXRlKGNhbmQpO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIGNvbXBsZXRlID0gc2VsZi50cmFuc2NlaXZlcnMuZXZlcnkoZnVuY3Rpb24odHJhbnNjZWl2ZXIpIHtcbiAgICAgICAgICByZXR1cm4gdHJhbnNjZWl2ZXIuaWNlR2F0aGVyZXIgJiZcbiAgICAgICAgICAgICAgdHJhbnNjZWl2ZXIuaWNlR2F0aGVyZXIuc3RhdGUgPT09ICdjb21wbGV0ZWQnO1xuICAgICAgICB9KTtcbiAgICAgICAgLy8gRklYTUU6IHVwZGF0ZSAubG9jYWxEZXNjcmlwdGlvbiB3aXRoIGNhbmRpZGF0ZSBhbmQgKHBvdGVudGlhbGx5KSBlbmQtb2YtY2FuZGlkYXRlcy5cbiAgICAgICAgLy8gICAgIFRvIG1ha2UgdGhpcyBoYXJkZXIsIHRoZSBnYXRoZXJlciBtaWdodCBlbWl0IGNhbmRpZGF0ZXMgYmVmb3JlIGxvY2FsZGVzY3JpcHRpb25cbiAgICAgICAgLy8gICAgIGlzIHNldC4gVG8gbWFrZSB0aGluZ3Mgd29yc2UsIGdhdGhlci5nZXRMb2NhbENhbmRpZGF0ZXMgc3RpbGwgZXJyb3JzIGluXG4gICAgICAgIC8vICAgICBFZGdlIDEwNTQ3IHdoZW4gbm8gY2FuZGlkYXRlcyBoYXZlIGJlZW4gZ2F0aGVyZWQgeWV0LlxuXG4gICAgICAgIGlmIChzZWxmLm9uaWNlY2FuZGlkYXRlICE9PSBudWxsKSB7XG4gICAgICAgICAgLy8gRW1pdCBjYW5kaWRhdGUgaWYgbG9jYWxEZXNjcmlwdGlvbiBpcyBzZXQuXG4gICAgICAgICAgLy8gQWxzbyBlbWl0cyBudWxsIGNhbmRpZGF0ZSB3aGVuIGFsbCBnYXRoZXJlcnMgYXJlIGNvbXBsZXRlLlxuICAgICAgICAgIGlmIChzZWxmLmxvY2FsRGVzY3JpcHRpb24gJiYgc2VsZi5sb2NhbERlc2NyaXB0aW9uLnR5cGUgPT09ICcnKSB7XG4gICAgICAgICAgICBzZWxmLl9sb2NhbEljZUNhbmRpZGF0ZXNCdWZmZXIucHVzaChldmVudCk7XG4gICAgICAgICAgICBpZiAoY29tcGxldGUpIHtcbiAgICAgICAgICAgICAgc2VsZi5fbG9jYWxJY2VDYW5kaWRhdGVzQnVmZmVyLnB1c2goe30pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBzZWxmLm9uaWNlY2FuZGlkYXRlKGV2ZW50KTtcbiAgICAgICAgICAgIGlmIChjb21wbGV0ZSkge1xuICAgICAgICAgICAgICBzZWxmLm9uaWNlY2FuZGlkYXRlKHt9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgICBpY2VUcmFuc3BvcnQub25pY2VzdGF0ZWNoYW5nZSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICBzZWxmLl91cGRhdGVDb25uZWN0aW9uU3RhdGUoKTtcbiAgICAgIH07XG5cbiAgICAgIHZhciBkdGxzVHJhbnNwb3J0ID0gbmV3IFJUQ0R0bHNUcmFuc3BvcnQoaWNlVHJhbnNwb3J0KTtcbiAgICAgIGR0bHNUcmFuc3BvcnQub25kdGxzc3RhdGVjaGFuZ2UgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgc2VsZi5fdXBkYXRlQ29ubmVjdGlvblN0YXRlKCk7XG4gICAgICB9O1xuICAgICAgZHRsc1RyYW5zcG9ydC5vbmVycm9yID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIC8vIG9uZXJyb3IgZG9lcyBub3Qgc2V0IHN0YXRlIHRvIGZhaWxlZCBieSBpdHNlbGYuXG4gICAgICAgIGR0bHNUcmFuc3BvcnQuc3RhdGUgPSAnZmFpbGVkJztcbiAgICAgICAgc2VsZi5fdXBkYXRlQ29ubmVjdGlvblN0YXRlKCk7XG4gICAgICB9O1xuXG4gICAgICByZXR1cm4ge1xuICAgICAgICBpY2VHYXRoZXJlcjogaWNlR2F0aGVyZXIsXG4gICAgICAgIGljZVRyYW5zcG9ydDogaWNlVHJhbnNwb3J0LFxuICAgICAgICBkdGxzVHJhbnNwb3J0OiBkdGxzVHJhbnNwb3J0XG4gICAgICB9O1xuICAgIH07XG5cbiAgICAvLyBTdGFydCB0aGUgUlRQIFNlbmRlciBhbmQgUmVjZWl2ZXIgZm9yIGEgdHJhbnNjZWl2ZXIuXG4gICAgd2luZG93LlJUQ1BlZXJDb25uZWN0aW9uLnByb3RvdHlwZS5fdHJhbnNjZWl2ZSA9IGZ1bmN0aW9uKHRyYW5zY2VpdmVyLFxuICAgICAgICBzZW5kLCByZWN2KSB7XG4gICAgICB2YXIgcGFyYW1zID0gdGhpcy5fZ2V0Q29tbW9uQ2FwYWJpbGl0aWVzKHRyYW5zY2VpdmVyLmxvY2FsQ2FwYWJpbGl0aWVzLFxuICAgICAgICAgIHRyYW5zY2VpdmVyLnJlbW90ZUNhcGFiaWxpdGllcyk7XG4gICAgICBpZiAoc2VuZCAmJiB0cmFuc2NlaXZlci5ydHBTZW5kZXIpIHtcbiAgICAgICAgcGFyYW1zLmVuY29kaW5ncyA9IFt7XG4gICAgICAgICAgc3NyYzogdHJhbnNjZWl2ZXIuc2VuZFNzcmNcbiAgICAgICAgfV07XG4gICAgICAgIHBhcmFtcy5ydGNwID0ge1xuICAgICAgICAgIGNuYW1lOiBsb2NhbENOYW1lLFxuICAgICAgICAgIHNzcmM6IHRyYW5zY2VpdmVyLnJlY3ZTc3JjXG4gICAgICAgIH07XG4gICAgICAgIHRyYW5zY2VpdmVyLnJ0cFNlbmRlci5zZW5kKHBhcmFtcyk7XG4gICAgICB9XG4gICAgICBpZiAocmVjdiAmJiB0cmFuc2NlaXZlci5ydHBSZWNlaXZlcikge1xuICAgICAgICBwYXJhbXMuZW5jb2RpbmdzID0gW3tcbiAgICAgICAgICBzc3JjOiB0cmFuc2NlaXZlci5yZWN2U3NyY1xuICAgICAgICB9XTtcbiAgICAgICAgcGFyYW1zLnJ0Y3AgPSB7XG4gICAgICAgICAgY25hbWU6IHRyYW5zY2VpdmVyLmNuYW1lLFxuICAgICAgICAgIHNzcmM6IHRyYW5zY2VpdmVyLnNlbmRTc3JjXG4gICAgICAgIH07XG4gICAgICAgIHRyYW5zY2VpdmVyLnJ0cFJlY2VpdmVyLnJlY2VpdmUocGFyYW1zKTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgd2luZG93LlJUQ1BlZXJDb25uZWN0aW9uLnByb3RvdHlwZS5zZXRMb2NhbERlc2NyaXB0aW9uID1cbiAgICAgICAgZnVuY3Rpb24oZGVzY3JpcHRpb24pIHtcbiAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgIGlmIChkZXNjcmlwdGlvbi50eXBlID09PSAnb2ZmZXInKSB7XG4gICAgICAgIGlmICghdGhpcy5fcGVuZGluZ09mZmVyKSB7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhpcy50cmFuc2NlaXZlcnMgPSB0aGlzLl9wZW5kaW5nT2ZmZXI7XG4gICAgICAgICAgZGVsZXRlIHRoaXMuX3BlbmRpbmdPZmZlcjtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIGlmIChkZXNjcmlwdGlvbi50eXBlID09PSAnYW5zd2VyJykge1xuICAgICAgICB2YXIgc2VjdGlvbnMgPSBTRFBVdGlscy5zcGxpdFNlY3Rpb25zKHNlbGYucmVtb3RlRGVzY3JpcHRpb24uc2RwKTtcbiAgICAgICAgdmFyIHNlc3Npb25wYXJ0ID0gc2VjdGlvbnMuc2hpZnQoKTtcbiAgICAgICAgc2VjdGlvbnMuZm9yRWFjaChmdW5jdGlvbihtZWRpYVNlY3Rpb24sIHNkcE1MaW5lSW5kZXgpIHtcbiAgICAgICAgICB2YXIgdHJhbnNjZWl2ZXIgPSBzZWxmLnRyYW5zY2VpdmVyc1tzZHBNTGluZUluZGV4XTtcbiAgICAgICAgICB2YXIgaWNlR2F0aGVyZXIgPSB0cmFuc2NlaXZlci5pY2VHYXRoZXJlcjtcbiAgICAgICAgICB2YXIgaWNlVHJhbnNwb3J0ID0gdHJhbnNjZWl2ZXIuaWNlVHJhbnNwb3J0O1xuICAgICAgICAgIHZhciBkdGxzVHJhbnNwb3J0ID0gdHJhbnNjZWl2ZXIuZHRsc1RyYW5zcG9ydDtcbiAgICAgICAgICB2YXIgbG9jYWxDYXBhYmlsaXRpZXMgPSB0cmFuc2NlaXZlci5sb2NhbENhcGFiaWxpdGllcztcbiAgICAgICAgICB2YXIgcmVtb3RlQ2FwYWJpbGl0aWVzID0gdHJhbnNjZWl2ZXIucmVtb3RlQ2FwYWJpbGl0aWVzO1xuICAgICAgICAgIHZhciByZWplY3RlZCA9IG1lZGlhU2VjdGlvbi5zcGxpdCgnXFxuJywgMSlbMF1cbiAgICAgICAgICAgICAgLnNwbGl0KCcgJywgMilbMV0gPT09ICcwJztcblxuICAgICAgICAgIGlmICghcmVqZWN0ZWQpIHtcbiAgICAgICAgICAgIHZhciByZW1vdGVJY2VQYXJhbWV0ZXJzID0gU0RQVXRpbHMuZ2V0SWNlUGFyYW1ldGVycyhtZWRpYVNlY3Rpb24sXG4gICAgICAgICAgICAgICAgc2Vzc2lvbnBhcnQpO1xuICAgICAgICAgICAgaWNlVHJhbnNwb3J0LnN0YXJ0KGljZUdhdGhlcmVyLCByZW1vdGVJY2VQYXJhbWV0ZXJzLCAnY29udHJvbGxlZCcpO1xuXG4gICAgICAgICAgICB2YXIgcmVtb3RlRHRsc1BhcmFtZXRlcnMgPSBTRFBVdGlscy5nZXREdGxzUGFyYW1ldGVycyhtZWRpYVNlY3Rpb24sXG4gICAgICAgICAgICAgIHNlc3Npb25wYXJ0KTtcbiAgICAgICAgICAgIGR0bHNUcmFuc3BvcnQuc3RhcnQocmVtb3RlRHRsc1BhcmFtZXRlcnMpO1xuXG4gICAgICAgICAgICAvLyBDYWxjdWxhdGUgaW50ZXJzZWN0aW9uIG9mIGNhcGFiaWxpdGllcy5cbiAgICAgICAgICAgIHZhciBwYXJhbXMgPSBzZWxmLl9nZXRDb21tb25DYXBhYmlsaXRpZXMobG9jYWxDYXBhYmlsaXRpZXMsXG4gICAgICAgICAgICAgICAgcmVtb3RlQ2FwYWJpbGl0aWVzKTtcblxuICAgICAgICAgICAgLy8gU3RhcnQgdGhlIFJUQ1J0cFNlbmRlci4gVGhlIFJUQ1J0cFJlY2VpdmVyIGZvciB0aGlzIHRyYW5zY2VpdmVyXG4gICAgICAgICAgICAvLyBoYXMgYWxyZWFkeSBiZWVuIHN0YXJ0ZWQgaW4gc2V0UmVtb3RlRGVzY3JpcHRpb24uXG4gICAgICAgICAgICBzZWxmLl90cmFuc2NlaXZlKHRyYW5zY2VpdmVyLFxuICAgICAgICAgICAgICAgIHBhcmFtcy5jb2RlY3MubGVuZ3RoID4gMCxcbiAgICAgICAgICAgICAgICBmYWxzZSk7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH1cblxuICAgICAgdGhpcy5sb2NhbERlc2NyaXB0aW9uID0gZGVzY3JpcHRpb247XG4gICAgICBzd2l0Y2ggKGRlc2NyaXB0aW9uLnR5cGUpIHtcbiAgICAgICAgY2FzZSAnb2ZmZXInOlxuICAgICAgICAgIHRoaXMuX3VwZGF0ZVNpZ25hbGluZ1N0YXRlKCdoYXZlLWxvY2FsLW9mZmVyJyk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgJ2Fuc3dlcic6XG4gICAgICAgICAgdGhpcy5fdXBkYXRlU2lnbmFsaW5nU3RhdGUoJ3N0YWJsZScpO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ3Vuc3VwcG9ydGVkIHR5cGUgXCInICsgZGVzY3JpcHRpb24udHlwZSArICdcIicpO1xuICAgICAgfVxuXG4gICAgICAvLyBJZiBhIHN1Y2Nlc3MgY2FsbGJhY2sgd2FzIHByb3ZpZGVkLCBlbWl0IElDRSBjYW5kaWRhdGVzIGFmdGVyIGl0IGhhcyBiZWVuXG4gICAgICAvLyBleGVjdXRlZC4gT3RoZXJ3aXNlLCBlbWl0IGNhbGxiYWNrIGFmdGVyIHRoZSBQcm9taXNlIGlzIHJlc29sdmVkLlxuICAgICAgdmFyIGhhc0NhbGxiYWNrID0gYXJndW1lbnRzLmxlbmd0aCA+IDEgJiZcbiAgICAgICAgdHlwZW9mIGFyZ3VtZW50c1sxXSA9PT0gJ2Z1bmN0aW9uJztcbiAgICAgIGlmIChoYXNDYWxsYmFjaykge1xuICAgICAgICB2YXIgY2IgPSBhcmd1bWVudHNbMV07XG4gICAgICAgIHdpbmRvdy5zZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICAgIGNiKCk7XG4gICAgICAgICAgc2VsZi5fZW1pdEJ1ZmZlcmVkQ2FuZGlkYXRlcygpO1xuICAgICAgICB9LCAwKTtcbiAgICAgIH1cbiAgICAgIHZhciBwID0gUHJvbWlzZS5yZXNvbHZlKCk7XG4gICAgICBwLnRoZW4oZnVuY3Rpb24oKSB7XG4gICAgICAgIGlmICghaGFzQ2FsbGJhY2spIHtcbiAgICAgICAgICB3aW5kb3cuc2V0VGltZW91dChzZWxmLl9lbWl0QnVmZmVyZWRDYW5kaWRhdGVzLmJpbmQoc2VsZiksIDApO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIHJldHVybiBwO1xuICAgIH07XG5cbiAgICB3aW5kb3cuUlRDUGVlckNvbm5lY3Rpb24ucHJvdG90eXBlLnNldFJlbW90ZURlc2NyaXB0aW9uID1cbiAgICAgICAgZnVuY3Rpb24oZGVzY3JpcHRpb24pIHtcbiAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgIHZhciBzdHJlYW0gPSBuZXcgTWVkaWFTdHJlYW0oKTtcbiAgICAgIHZhciBzZWN0aW9ucyA9IFNEUFV0aWxzLnNwbGl0U2VjdGlvbnMoZGVzY3JpcHRpb24uc2RwKTtcbiAgICAgIHZhciBzZXNzaW9ucGFydCA9IHNlY3Rpb25zLnNoaWZ0KCk7XG4gICAgICBzZWN0aW9ucy5mb3JFYWNoKGZ1bmN0aW9uKG1lZGlhU2VjdGlvbiwgc2RwTUxpbmVJbmRleCkge1xuICAgICAgICB2YXIgbGluZXMgPSBTRFBVdGlscy5zcGxpdExpbmVzKG1lZGlhU2VjdGlvbik7XG4gICAgICAgIHZhciBtbGluZSA9IGxpbmVzWzBdLnN1YnN0cigyKS5zcGxpdCgnICcpO1xuICAgICAgICB2YXIga2luZCA9IG1saW5lWzBdO1xuICAgICAgICB2YXIgcmVqZWN0ZWQgPSBtbGluZVsxXSA9PT0gJzAnO1xuICAgICAgICB2YXIgZGlyZWN0aW9uID0gU0RQVXRpbHMuZ2V0RGlyZWN0aW9uKG1lZGlhU2VjdGlvbiwgc2Vzc2lvbnBhcnQpO1xuXG4gICAgICAgIHZhciB0cmFuc2NlaXZlcjtcbiAgICAgICAgdmFyIGljZUdhdGhlcmVyO1xuICAgICAgICB2YXIgaWNlVHJhbnNwb3J0O1xuICAgICAgICB2YXIgZHRsc1RyYW5zcG9ydDtcbiAgICAgICAgdmFyIHJ0cFNlbmRlcjtcbiAgICAgICAgdmFyIHJ0cFJlY2VpdmVyO1xuICAgICAgICB2YXIgc2VuZFNzcmM7XG4gICAgICAgIHZhciByZWN2U3NyYztcbiAgICAgICAgdmFyIGxvY2FsQ2FwYWJpbGl0aWVzO1xuXG4gICAgICAgIC8vIEZJWE1FOiBlbnN1cmUgdGhlIG1lZGlhU2VjdGlvbiBoYXMgcnRjcC1tdXggc2V0LlxuICAgICAgICB2YXIgcmVtb3RlQ2FwYWJpbGl0aWVzID0gU0RQVXRpbHMucGFyc2VSdHBQYXJhbWV0ZXJzKG1lZGlhU2VjdGlvbik7XG4gICAgICAgIHZhciByZW1vdGVJY2VQYXJhbWV0ZXJzO1xuICAgICAgICB2YXIgcmVtb3RlRHRsc1BhcmFtZXRlcnM7XG4gICAgICAgIGlmICghcmVqZWN0ZWQpIHtcbiAgICAgICAgICByZW1vdGVJY2VQYXJhbWV0ZXJzID0gU0RQVXRpbHMuZ2V0SWNlUGFyYW1ldGVycyhtZWRpYVNlY3Rpb24sXG4gICAgICAgICAgICAgIHNlc3Npb25wYXJ0KTtcbiAgICAgICAgICByZW1vdGVEdGxzUGFyYW1ldGVycyA9IFNEUFV0aWxzLmdldER0bHNQYXJhbWV0ZXJzKG1lZGlhU2VjdGlvbixcbiAgICAgICAgICAgICAgc2Vzc2lvbnBhcnQpO1xuICAgICAgICB9XG4gICAgICAgIHZhciBtaWQgPSBTRFBVdGlscy5tYXRjaFByZWZpeChtZWRpYVNlY3Rpb24sICdhPW1pZDonKVswXS5zdWJzdHIoNik7XG5cbiAgICAgICAgdmFyIGNuYW1lO1xuICAgICAgICAvLyBHZXRzIHRoZSBmaXJzdCBTU1JDLiBOb3RlIHRoYXQgd2l0aCBSVFggdGhlcmUgbWlnaHQgYmUgbXVsdGlwbGUgU1NSQ3MuXG4gICAgICAgIHZhciByZW1vdGVTc3JjID0gU0RQVXRpbHMubWF0Y2hQcmVmaXgobWVkaWFTZWN0aW9uLCAnYT1zc3JjOicpXG4gICAgICAgICAgICAubWFwKGZ1bmN0aW9uKGxpbmUpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIFNEUFV0aWxzLnBhcnNlU3NyY01lZGlhKGxpbmUpO1xuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC5maWx0ZXIoZnVuY3Rpb24ob2JqKSB7XG4gICAgICAgICAgICAgIHJldHVybiBvYmouYXR0cmlidXRlID09PSAnY25hbWUnO1xuICAgICAgICAgICAgfSlbMF07XG4gICAgICAgIGlmIChyZW1vdGVTc3JjKSB7XG4gICAgICAgICAgcmVjdlNzcmMgPSBwYXJzZUludChyZW1vdGVTc3JjLnNzcmMsIDEwKTtcbiAgICAgICAgICBjbmFtZSA9IHJlbW90ZVNzcmMudmFsdWU7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoZGVzY3JpcHRpb24udHlwZSA9PT0gJ29mZmVyJykge1xuICAgICAgICAgIHZhciB0cmFuc3BvcnRzID0gc2VsZi5fY3JlYXRlSWNlQW5kRHRsc1RyYW5zcG9ydHMobWlkLCBzZHBNTGluZUluZGV4KTtcblxuICAgICAgICAgIGxvY2FsQ2FwYWJpbGl0aWVzID0gUlRDUnRwUmVjZWl2ZXIuZ2V0Q2FwYWJpbGl0aWVzKGtpbmQpO1xuICAgICAgICAgIHNlbmRTc3JjID0gKDIgKiBzZHBNTGluZUluZGV4ICsgMikgKiAxMDAxO1xuXG4gICAgICAgICAgcnRwUmVjZWl2ZXIgPSBuZXcgUlRDUnRwUmVjZWl2ZXIodHJhbnNwb3J0cy5kdGxzVHJhbnNwb3J0LCBraW5kKTtcblxuICAgICAgICAgIC8vIEZJWE1FOiBub3QgY29ycmVjdCB3aGVuIHRoZXJlIGFyZSBtdWx0aXBsZSBzdHJlYW1zIGJ1dCB0aGF0IGlzXG4gICAgICAgICAgLy8gbm90IGN1cnJlbnRseSBzdXBwb3J0ZWQgaW4gdGhpcyBzaGltLlxuICAgICAgICAgIHN0cmVhbS5hZGRUcmFjayhydHBSZWNlaXZlci50cmFjayk7XG5cbiAgICAgICAgICAvLyBGSVhNRTogbG9vayBhdCBkaXJlY3Rpb24uXG4gICAgICAgICAgaWYgKHNlbGYubG9jYWxTdHJlYW1zLmxlbmd0aCA+IDAgJiZcbiAgICAgICAgICAgICAgc2VsZi5sb2NhbFN0cmVhbXNbMF0uZ2V0VHJhY2tzKCkubGVuZ3RoID49IHNkcE1MaW5lSW5kZXgpIHtcbiAgICAgICAgICAgIC8vIEZJWE1FOiBhY3R1YWxseSBtb3JlIGNvbXBsaWNhdGVkLCBuZWVkcyB0byBtYXRjaCB0eXBlcyBldGNcbiAgICAgICAgICAgIHZhciBsb2NhbHRyYWNrID0gc2VsZi5sb2NhbFN0cmVhbXNbMF0uZ2V0VHJhY2tzKClbc2RwTUxpbmVJbmRleF07XG4gICAgICAgICAgICBydHBTZW5kZXIgPSBuZXcgUlRDUnRwU2VuZGVyKGxvY2FsdHJhY2ssIHRyYW5zcG9ydHMuZHRsc1RyYW5zcG9ydCk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgc2VsZi50cmFuc2NlaXZlcnNbc2RwTUxpbmVJbmRleF0gPSB7XG4gICAgICAgICAgICBpY2VHYXRoZXJlcjogdHJhbnNwb3J0cy5pY2VHYXRoZXJlcixcbiAgICAgICAgICAgIGljZVRyYW5zcG9ydDogdHJhbnNwb3J0cy5pY2VUcmFuc3BvcnQsXG4gICAgICAgICAgICBkdGxzVHJhbnNwb3J0OiB0cmFuc3BvcnRzLmR0bHNUcmFuc3BvcnQsXG4gICAgICAgICAgICBsb2NhbENhcGFiaWxpdGllczogbG9jYWxDYXBhYmlsaXRpZXMsXG4gICAgICAgICAgICByZW1vdGVDYXBhYmlsaXRpZXM6IHJlbW90ZUNhcGFiaWxpdGllcyxcbiAgICAgICAgICAgIHJ0cFNlbmRlcjogcnRwU2VuZGVyLFxuICAgICAgICAgICAgcnRwUmVjZWl2ZXI6IHJ0cFJlY2VpdmVyLFxuICAgICAgICAgICAga2luZDoga2luZCxcbiAgICAgICAgICAgIG1pZDogbWlkLFxuICAgICAgICAgICAgY25hbWU6IGNuYW1lLFxuICAgICAgICAgICAgc2VuZFNzcmM6IHNlbmRTc3JjLFxuICAgICAgICAgICAgcmVjdlNzcmM6IHJlY3ZTc3JjXG4gICAgICAgICAgfTtcbiAgICAgICAgICAvLyBTdGFydCB0aGUgUlRDUnRwUmVjZWl2ZXIgbm93LiBUaGUgUlRQU2VuZGVyIGlzIHN0YXJ0ZWQgaW4gc2V0TG9jYWxEZXNjcmlwdGlvbi5cbiAgICAgICAgICBzZWxmLl90cmFuc2NlaXZlKHNlbGYudHJhbnNjZWl2ZXJzW3NkcE1MaW5lSW5kZXhdLFxuICAgICAgICAgICAgICBmYWxzZSxcbiAgICAgICAgICAgICAgZGlyZWN0aW9uID09PSAnc2VuZHJlY3YnIHx8IGRpcmVjdGlvbiA9PT0gJ3NlbmRvbmx5Jyk7XG4gICAgICAgIH0gZWxzZSBpZiAoZGVzY3JpcHRpb24udHlwZSA9PT0gJ2Fuc3dlcicgJiYgIXJlamVjdGVkKSB7XG4gICAgICAgICAgdHJhbnNjZWl2ZXIgPSBzZWxmLnRyYW5zY2VpdmVyc1tzZHBNTGluZUluZGV4XTtcbiAgICAgICAgICBpY2VHYXRoZXJlciA9IHRyYW5zY2VpdmVyLmljZUdhdGhlcmVyO1xuICAgICAgICAgIGljZVRyYW5zcG9ydCA9IHRyYW5zY2VpdmVyLmljZVRyYW5zcG9ydDtcbiAgICAgICAgICBkdGxzVHJhbnNwb3J0ID0gdHJhbnNjZWl2ZXIuZHRsc1RyYW5zcG9ydDtcbiAgICAgICAgICBydHBTZW5kZXIgPSB0cmFuc2NlaXZlci5ydHBTZW5kZXI7XG4gICAgICAgICAgcnRwUmVjZWl2ZXIgPSB0cmFuc2NlaXZlci5ydHBSZWNlaXZlcjtcbiAgICAgICAgICBzZW5kU3NyYyA9IHRyYW5zY2VpdmVyLnNlbmRTc3JjO1xuICAgICAgICAgIC8vcmVjdlNzcmMgPSB0cmFuc2NlaXZlci5yZWN2U3NyYztcbiAgICAgICAgICBsb2NhbENhcGFiaWxpdGllcyA9IHRyYW5zY2VpdmVyLmxvY2FsQ2FwYWJpbGl0aWVzO1xuXG4gICAgICAgICAgc2VsZi50cmFuc2NlaXZlcnNbc2RwTUxpbmVJbmRleF0ucmVjdlNzcmMgPSByZWN2U3NyYztcbiAgICAgICAgICBzZWxmLnRyYW5zY2VpdmVyc1tzZHBNTGluZUluZGV4XS5yZW1vdGVDYXBhYmlsaXRpZXMgPVxuICAgICAgICAgICAgICByZW1vdGVDYXBhYmlsaXRpZXM7XG4gICAgICAgICAgc2VsZi50cmFuc2NlaXZlcnNbc2RwTUxpbmVJbmRleF0uY25hbWUgPSBjbmFtZTtcblxuICAgICAgICAgIGljZVRyYW5zcG9ydC5zdGFydChpY2VHYXRoZXJlciwgcmVtb3RlSWNlUGFyYW1ldGVycywgJ2NvbnRyb2xsaW5nJyk7XG4gICAgICAgICAgZHRsc1RyYW5zcG9ydC5zdGFydChyZW1vdGVEdGxzUGFyYW1ldGVycyk7XG5cbiAgICAgICAgICBzZWxmLl90cmFuc2NlaXZlKHRyYW5zY2VpdmVyLFxuICAgICAgICAgICAgICBkaXJlY3Rpb24gPT09ICdzZW5kcmVjdicgfHwgZGlyZWN0aW9uID09PSAncmVjdm9ubHknLFxuICAgICAgICAgICAgICBkaXJlY3Rpb24gPT09ICdzZW5kcmVjdicgfHwgZGlyZWN0aW9uID09PSAnc2VuZG9ubHknKTtcblxuICAgICAgICAgIGlmIChydHBSZWNlaXZlciAmJlxuICAgICAgICAgICAgICAoZGlyZWN0aW9uID09PSAnc2VuZHJlY3YnIHx8IGRpcmVjdGlvbiA9PT0gJ3NlbmRvbmx5JykpIHtcbiAgICAgICAgICAgIHN0cmVhbS5hZGRUcmFjayhydHBSZWNlaXZlci50cmFjayk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIC8vIEZJWE1FOiBhY3R1YWxseSB0aGUgcmVjZWl2ZXIgc2hvdWxkIGJlIGNyZWF0ZWQgbGF0ZXIuXG4gICAgICAgICAgICBkZWxldGUgdHJhbnNjZWl2ZXIucnRwUmVjZWl2ZXI7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9KTtcblxuICAgICAgdGhpcy5yZW1vdGVEZXNjcmlwdGlvbiA9IGRlc2NyaXB0aW9uO1xuICAgICAgc3dpdGNoIChkZXNjcmlwdGlvbi50eXBlKSB7XG4gICAgICAgIGNhc2UgJ29mZmVyJzpcbiAgICAgICAgICB0aGlzLl91cGRhdGVTaWduYWxpbmdTdGF0ZSgnaGF2ZS1yZW1vdGUtb2ZmZXInKTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAnYW5zd2VyJzpcbiAgICAgICAgICB0aGlzLl91cGRhdGVTaWduYWxpbmdTdGF0ZSgnc3RhYmxlJyk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcigndW5zdXBwb3J0ZWQgdHlwZSBcIicgKyBkZXNjcmlwdGlvbi50eXBlICsgJ1wiJyk7XG4gICAgICB9XG4gICAgICB3aW5kb3cuc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgICAgaWYgKHNlbGYub25hZGRzdHJlYW0gIT09IG51bGwgJiYgc3RyZWFtLmdldFRyYWNrcygpLmxlbmd0aCkge1xuICAgICAgICAgIHNlbGYucmVtb3RlU3RyZWFtcy5wdXNoKHN0cmVhbSk7XG4gICAgICAgICAgd2luZG93LnNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBzZWxmLm9uYWRkc3RyZWFtKHtzdHJlYW06IHN0cmVhbX0pO1xuICAgICAgICAgIH0sIDApO1xuICAgICAgICB9XG4gICAgICB9LCAwKTtcbiAgICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID4gMSAmJiB0eXBlb2YgYXJndW1lbnRzWzFdID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIHdpbmRvdy5zZXRUaW1lb3V0KGFyZ3VtZW50c1sxXSwgMCk7XG4gICAgICB9XG4gICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKCk7XG4gICAgfTtcblxuICAgIHdpbmRvdy5SVENQZWVyQ29ubmVjdGlvbi5wcm90b3R5cGUuY2xvc2UgPSBmdW5jdGlvbigpIHtcbiAgICAgIHRoaXMudHJhbnNjZWl2ZXJzLmZvckVhY2goZnVuY3Rpb24odHJhbnNjZWl2ZXIpIHtcbiAgICAgICAgLyogbm90IHlldFxuICAgICAgICBpZiAodHJhbnNjZWl2ZXIuaWNlR2F0aGVyZXIpIHtcbiAgICAgICAgICB0cmFuc2NlaXZlci5pY2VHYXRoZXJlci5jbG9zZSgpO1xuICAgICAgICB9XG4gICAgICAgICovXG4gICAgICAgIGlmICh0cmFuc2NlaXZlci5pY2VUcmFuc3BvcnQpIHtcbiAgICAgICAgICB0cmFuc2NlaXZlci5pY2VUcmFuc3BvcnQuc3RvcCgpO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0cmFuc2NlaXZlci5kdGxzVHJhbnNwb3J0KSB7XG4gICAgICAgICAgdHJhbnNjZWl2ZXIuZHRsc1RyYW5zcG9ydC5zdG9wKCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRyYW5zY2VpdmVyLnJ0cFNlbmRlcikge1xuICAgICAgICAgIHRyYW5zY2VpdmVyLnJ0cFNlbmRlci5zdG9wKCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRyYW5zY2VpdmVyLnJ0cFJlY2VpdmVyKSB7XG4gICAgICAgICAgdHJhbnNjZWl2ZXIucnRwUmVjZWl2ZXIuc3RvcCgpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIC8vIEZJWE1FOiBjbGVhbiB1cCB0cmFja3MsIGxvY2FsIHN0cmVhbXMsIHJlbW90ZSBzdHJlYW1zLCBldGNcbiAgICAgIHRoaXMuX3VwZGF0ZVNpZ25hbGluZ1N0YXRlKCdjbG9zZWQnKTtcbiAgICB9O1xuXG4gICAgLy8gVXBkYXRlIHRoZSBzaWduYWxpbmcgc3RhdGUuXG4gICAgd2luZG93LlJUQ1BlZXJDb25uZWN0aW9uLnByb3RvdHlwZS5fdXBkYXRlU2lnbmFsaW5nU3RhdGUgPVxuICAgICAgICBmdW5jdGlvbihuZXdTdGF0ZSkge1xuICAgICAgdGhpcy5zaWduYWxpbmdTdGF0ZSA9IG5ld1N0YXRlO1xuICAgICAgaWYgKHRoaXMub25zaWduYWxpbmdzdGF0ZWNoYW5nZSAhPT0gbnVsbCkge1xuICAgICAgICB0aGlzLm9uc2lnbmFsaW5nc3RhdGVjaGFuZ2UoKTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgLy8gRGV0ZXJtaW5lIHdoZXRoZXIgdG8gZmlyZSB0aGUgbmVnb3RpYXRpb25uZWVkZWQgZXZlbnQuXG4gICAgd2luZG93LlJUQ1BlZXJDb25uZWN0aW9uLnByb3RvdHlwZS5fbWF5YmVGaXJlTmVnb3RpYXRpb25OZWVkZWQgPVxuICAgICAgICBmdW5jdGlvbigpIHtcbiAgICAgIC8vIEZpcmUgYXdheSAoZm9yIG5vdykuXG4gICAgICBpZiAodGhpcy5vbm5lZ290aWF0aW9ubmVlZGVkICE9PSBudWxsKSB7XG4gICAgICAgIHRoaXMub25uZWdvdGlhdGlvbm5lZWRlZCgpO1xuICAgICAgfVxuICAgIH07XG5cbiAgICAvLyBVcGRhdGUgdGhlIGNvbm5lY3Rpb24gc3RhdGUuXG4gICAgd2luZG93LlJUQ1BlZXJDb25uZWN0aW9uLnByb3RvdHlwZS5fdXBkYXRlQ29ubmVjdGlvblN0YXRlID1cbiAgICAgICAgZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgICB2YXIgbmV3U3RhdGU7XG4gICAgICB2YXIgc3RhdGVzID0ge1xuICAgICAgICAnbmV3JzogMCxcbiAgICAgICAgY2xvc2VkOiAwLFxuICAgICAgICBjb25uZWN0aW5nOiAwLFxuICAgICAgICBjaGVja2luZzogMCxcbiAgICAgICAgY29ubmVjdGVkOiAwLFxuICAgICAgICBjb21wbGV0ZWQ6IDAsXG4gICAgICAgIGZhaWxlZDogMFxuICAgICAgfTtcbiAgICAgIHRoaXMudHJhbnNjZWl2ZXJzLmZvckVhY2goZnVuY3Rpb24odHJhbnNjZWl2ZXIpIHtcbiAgICAgICAgc3RhdGVzW3RyYW5zY2VpdmVyLmljZVRyYW5zcG9ydC5zdGF0ZV0rKztcbiAgICAgICAgc3RhdGVzW3RyYW5zY2VpdmVyLmR0bHNUcmFuc3BvcnQuc3RhdGVdKys7XG4gICAgICB9KTtcbiAgICAgIC8vIElDRVRyYW5zcG9ydC5jb21wbGV0ZWQgYW5kIGNvbm5lY3RlZCBhcmUgdGhlIHNhbWUgZm9yIHRoaXMgcHVycG9zZS5cbiAgICAgIHN0YXRlcy5jb25uZWN0ZWQgKz0gc3RhdGVzLmNvbXBsZXRlZDtcblxuICAgICAgbmV3U3RhdGUgPSAnbmV3JztcbiAgICAgIGlmIChzdGF0ZXMuZmFpbGVkID4gMCkge1xuICAgICAgICBuZXdTdGF0ZSA9ICdmYWlsZWQnO1xuICAgICAgfSBlbHNlIGlmIChzdGF0ZXMuY29ubmVjdGluZyA+IDAgfHwgc3RhdGVzLmNoZWNraW5nID4gMCkge1xuICAgICAgICBuZXdTdGF0ZSA9ICdjb25uZWN0aW5nJztcbiAgICAgIH0gZWxzZSBpZiAoc3RhdGVzLmRpc2Nvbm5lY3RlZCA+IDApIHtcbiAgICAgICAgbmV3U3RhdGUgPSAnZGlzY29ubmVjdGVkJztcbiAgICAgIH0gZWxzZSBpZiAoc3RhdGVzLm5ldyA+IDApIHtcbiAgICAgICAgbmV3U3RhdGUgPSAnbmV3JztcbiAgICAgIH0gZWxzZSBpZiAoc3RhdGVzLmNvbm5lY3RpbmcgPiAwIHx8IHN0YXRlcy5jb21wbGV0ZWQgPiAwKSB7XG4gICAgICAgIG5ld1N0YXRlID0gJ2Nvbm5lY3RlZCc7XG4gICAgICB9XG5cbiAgICAgIGlmIChuZXdTdGF0ZSAhPT0gc2VsZi5pY2VDb25uZWN0aW9uU3RhdGUpIHtcbiAgICAgICAgc2VsZi5pY2VDb25uZWN0aW9uU3RhdGUgPSBuZXdTdGF0ZTtcbiAgICAgICAgaWYgKHRoaXMub25pY2Vjb25uZWN0aW9uc3RhdGVjaGFuZ2UgIT09IG51bGwpIHtcbiAgICAgICAgICB0aGlzLm9uaWNlY29ubmVjdGlvbnN0YXRlY2hhbmdlKCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9O1xuXG4gICAgd2luZG93LlJUQ1BlZXJDb25uZWN0aW9uLnByb3RvdHlwZS5jcmVhdGVPZmZlciA9IGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgaWYgKHRoaXMuX3BlbmRpbmdPZmZlcikge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ2NyZWF0ZU9mZmVyIGNhbGxlZCB3aGlsZSB0aGVyZSBpcyBhIHBlbmRpbmcgb2ZmZXIuJyk7XG4gICAgICB9XG4gICAgICB2YXIgb2ZmZXJPcHRpb25zO1xuICAgICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDEgJiYgdHlwZW9mIGFyZ3VtZW50c1swXSAhPT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICBvZmZlck9wdGlvbnMgPSBhcmd1bWVudHNbMF07XG4gICAgICB9IGVsc2UgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDMpIHtcbiAgICAgICAgb2ZmZXJPcHRpb25zID0gYXJndW1lbnRzWzJdO1xuICAgICAgfVxuXG4gICAgICB2YXIgdHJhY2tzID0gW107XG4gICAgICB2YXIgbnVtQXVkaW9UcmFja3MgPSAwO1xuICAgICAgdmFyIG51bVZpZGVvVHJhY2tzID0gMDtcbiAgICAgIC8vIERlZmF1bHQgdG8gc2VuZHJlY3YuXG4gICAgICBpZiAodGhpcy5sb2NhbFN0cmVhbXMubGVuZ3RoKSB7XG4gICAgICAgIG51bUF1ZGlvVHJhY2tzID0gdGhpcy5sb2NhbFN0cmVhbXNbMF0uZ2V0QXVkaW9UcmFja3MoKS5sZW5ndGg7XG4gICAgICAgIG51bVZpZGVvVHJhY2tzID0gdGhpcy5sb2NhbFN0cmVhbXNbMF0uZ2V0VmlkZW9UcmFja3MoKS5sZW5ndGg7XG4gICAgICB9XG4gICAgICAvLyBEZXRlcm1pbmUgbnVtYmVyIG9mIGF1ZGlvIGFuZCB2aWRlbyB0cmFja3Mgd2UgbmVlZCB0byBzZW5kL3JlY3YuXG4gICAgICBpZiAob2ZmZXJPcHRpb25zKSB7XG4gICAgICAgIC8vIFJlamVjdCBDaHJvbWUgbGVnYWN5IGNvbnN0cmFpbnRzLlxuICAgICAgICBpZiAob2ZmZXJPcHRpb25zLm1hbmRhdG9yeSB8fCBvZmZlck9wdGlvbnMub3B0aW9uYWwpIHtcbiAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFxuICAgICAgICAgICAgICAnTGVnYWN5IG1hbmRhdG9yeS9vcHRpb25hbCBjb25zdHJhaW50cyBub3Qgc3VwcG9ydGVkLicpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChvZmZlck9wdGlvbnMub2ZmZXJUb1JlY2VpdmVBdWRpbyAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgbnVtQXVkaW9UcmFja3MgPSBvZmZlck9wdGlvbnMub2ZmZXJUb1JlY2VpdmVBdWRpbztcbiAgICAgICAgfVxuICAgICAgICBpZiAob2ZmZXJPcHRpb25zLm9mZmVyVG9SZWNlaXZlVmlkZW8gIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgIG51bVZpZGVvVHJhY2tzID0gb2ZmZXJPcHRpb25zLm9mZmVyVG9SZWNlaXZlVmlkZW87XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmICh0aGlzLmxvY2FsU3RyZWFtcy5sZW5ndGgpIHtcbiAgICAgICAgLy8gUHVzaCBsb2NhbCBzdHJlYW1zLlxuICAgICAgICB0aGlzLmxvY2FsU3RyZWFtc1swXS5nZXRUcmFja3MoKS5mb3JFYWNoKGZ1bmN0aW9uKHRyYWNrKSB7XG4gICAgICAgICAgdHJhY2tzLnB1c2goe1xuICAgICAgICAgICAga2luZDogdHJhY2sua2luZCxcbiAgICAgICAgICAgIHRyYWNrOiB0cmFjayxcbiAgICAgICAgICAgIHdhbnRSZWNlaXZlOiB0cmFjay5raW5kID09PSAnYXVkaW8nID9cbiAgICAgICAgICAgICAgICBudW1BdWRpb1RyYWNrcyA+IDAgOiBudW1WaWRlb1RyYWNrcyA+IDBcbiAgICAgICAgICB9KTtcbiAgICAgICAgICBpZiAodHJhY2sua2luZCA9PT0gJ2F1ZGlvJykge1xuICAgICAgICAgICAgbnVtQXVkaW9UcmFja3MtLTtcbiAgICAgICAgICB9IGVsc2UgaWYgKHRyYWNrLmtpbmQgPT09ICd2aWRlbycpIHtcbiAgICAgICAgICAgIG51bVZpZGVvVHJhY2tzLS07XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICAgIC8vIENyZWF0ZSBNLWxpbmVzIGZvciByZWN2b25seSBzdHJlYW1zLlxuICAgICAgd2hpbGUgKG51bUF1ZGlvVHJhY2tzID4gMCB8fCBudW1WaWRlb1RyYWNrcyA+IDApIHtcbiAgICAgICAgaWYgKG51bUF1ZGlvVHJhY2tzID4gMCkge1xuICAgICAgICAgIHRyYWNrcy5wdXNoKHtcbiAgICAgICAgICAgIGtpbmQ6ICdhdWRpbycsXG4gICAgICAgICAgICB3YW50UmVjZWl2ZTogdHJ1ZVxuICAgICAgICAgIH0pO1xuICAgICAgICAgIG51bUF1ZGlvVHJhY2tzLS07XG4gICAgICAgIH1cbiAgICAgICAgaWYgKG51bVZpZGVvVHJhY2tzID4gMCkge1xuICAgICAgICAgIHRyYWNrcy5wdXNoKHtcbiAgICAgICAgICAgIGtpbmQ6ICd2aWRlbycsXG4gICAgICAgICAgICB3YW50UmVjZWl2ZTogdHJ1ZVxuICAgICAgICAgIH0pO1xuICAgICAgICAgIG51bVZpZGVvVHJhY2tzLS07XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgdmFyIHNkcCA9IFNEUFV0aWxzLndyaXRlU2Vzc2lvbkJvaWxlcnBsYXRlKCk7XG4gICAgICB2YXIgdHJhbnNjZWl2ZXJzID0gW107XG4gICAgICB0cmFja3MuZm9yRWFjaChmdW5jdGlvbihtbGluZSwgc2RwTUxpbmVJbmRleCkge1xuICAgICAgICAvLyBGb3IgZWFjaCB0cmFjaywgY3JlYXRlIGFuIGljZSBnYXRoZXJlciwgaWNlIHRyYW5zcG9ydCwgZHRscyB0cmFuc3BvcnQsXG4gICAgICAgIC8vIHBvdGVudGlhbGx5IHJ0cHNlbmRlciBhbmQgcnRwcmVjZWl2ZXIuXG4gICAgICAgIHZhciB0cmFjayA9IG1saW5lLnRyYWNrO1xuICAgICAgICB2YXIga2luZCA9IG1saW5lLmtpbmQ7XG4gICAgICAgIHZhciBtaWQgPSBnZW5lcmF0ZUlkZW50aWZpZXIoKTtcblxuICAgICAgICB2YXIgdHJhbnNwb3J0cyA9IHNlbGYuX2NyZWF0ZUljZUFuZER0bHNUcmFuc3BvcnRzKG1pZCwgc2RwTUxpbmVJbmRleCk7XG5cbiAgICAgICAgdmFyIGxvY2FsQ2FwYWJpbGl0aWVzID0gUlRDUnRwU2VuZGVyLmdldENhcGFiaWxpdGllcyhraW5kKTtcbiAgICAgICAgdmFyIHJ0cFNlbmRlcjtcbiAgICAgICAgdmFyIHJ0cFJlY2VpdmVyO1xuXG4gICAgICAgIC8vIGdlbmVyYXRlIGFuIHNzcmMgbm93LCB0byBiZSB1c2VkIGxhdGVyIGluIHJ0cFNlbmRlci5zZW5kXG4gICAgICAgIHZhciBzZW5kU3NyYyA9ICgyICogc2RwTUxpbmVJbmRleCArIDEpICogMTAwMTtcbiAgICAgICAgaWYgKHRyYWNrKSB7XG4gICAgICAgICAgcnRwU2VuZGVyID0gbmV3IFJUQ1J0cFNlbmRlcih0cmFjaywgdHJhbnNwb3J0cy5kdGxzVHJhbnNwb3J0KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChtbGluZS53YW50UmVjZWl2ZSkge1xuICAgICAgICAgIHJ0cFJlY2VpdmVyID0gbmV3IFJUQ1J0cFJlY2VpdmVyKHRyYW5zcG9ydHMuZHRsc1RyYW5zcG9ydCwga2luZCk7XG4gICAgICAgIH1cblxuICAgICAgICB0cmFuc2NlaXZlcnNbc2RwTUxpbmVJbmRleF0gPSB7XG4gICAgICAgICAgaWNlR2F0aGVyZXI6IHRyYW5zcG9ydHMuaWNlR2F0aGVyZXIsXG4gICAgICAgICAgaWNlVHJhbnNwb3J0OiB0cmFuc3BvcnRzLmljZVRyYW5zcG9ydCxcbiAgICAgICAgICBkdGxzVHJhbnNwb3J0OiB0cmFuc3BvcnRzLmR0bHNUcmFuc3BvcnQsXG4gICAgICAgICAgbG9jYWxDYXBhYmlsaXRpZXM6IGxvY2FsQ2FwYWJpbGl0aWVzLFxuICAgICAgICAgIHJlbW90ZUNhcGFiaWxpdGllczogbnVsbCxcbiAgICAgICAgICBydHBTZW5kZXI6IHJ0cFNlbmRlcixcbiAgICAgICAgICBydHBSZWNlaXZlcjogcnRwUmVjZWl2ZXIsXG4gICAgICAgICAga2luZDoga2luZCxcbiAgICAgICAgICBtaWQ6IG1pZCxcbiAgICAgICAgICBzZW5kU3NyYzogc2VuZFNzcmMsXG4gICAgICAgICAgcmVjdlNzcmM6IG51bGxcbiAgICAgICAgfTtcbiAgICAgICAgdmFyIHRyYW5zY2VpdmVyID0gdHJhbnNjZWl2ZXJzW3NkcE1MaW5lSW5kZXhdO1xuICAgICAgICBzZHAgKz0gU0RQVXRpbHMud3JpdGVNZWRpYVNlY3Rpb24odHJhbnNjZWl2ZXIsXG4gICAgICAgICAgICB0cmFuc2NlaXZlci5sb2NhbENhcGFiaWxpdGllcywgJ29mZmVyJywgc2VsZi5sb2NhbFN0cmVhbXNbMF0pO1xuICAgICAgfSk7XG5cbiAgICAgIHRoaXMuX3BlbmRpbmdPZmZlciA9IHRyYW5zY2VpdmVycztcbiAgICAgIHZhciBkZXNjID0gbmV3IFJUQ1Nlc3Npb25EZXNjcmlwdGlvbih7XG4gICAgICAgIHR5cGU6ICdvZmZlcicsXG4gICAgICAgIHNkcDogc2RwXG4gICAgICB9KTtcbiAgICAgIGlmIChhcmd1bWVudHMubGVuZ3RoICYmIHR5cGVvZiBhcmd1bWVudHNbMF0gPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgd2luZG93LnNldFRpbWVvdXQoYXJndW1lbnRzWzBdLCAwLCBkZXNjKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoZGVzYyk7XG4gICAgfTtcblxuICAgIHdpbmRvdy5SVENQZWVyQ29ubmVjdGlvbi5wcm90b3R5cGUuY3JlYXRlQW5zd2VyID0gZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgICB2YXIgYW5zd2VyT3B0aW9ucztcbiAgICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAxICYmIHR5cGVvZiBhcmd1bWVudHNbMF0gIT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgYW5zd2VyT3B0aW9ucyA9IGFyZ3VtZW50c1swXTtcbiAgICAgIH0gZWxzZSBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMykge1xuICAgICAgICBhbnN3ZXJPcHRpb25zID0gYXJndW1lbnRzWzJdO1xuICAgICAgfVxuXG4gICAgICB2YXIgc2RwID0gU0RQVXRpbHMud3JpdGVTZXNzaW9uQm9pbGVycGxhdGUoKTtcbiAgICAgIHRoaXMudHJhbnNjZWl2ZXJzLmZvckVhY2goZnVuY3Rpb24odHJhbnNjZWl2ZXIpIHtcbiAgICAgICAgLy8gQ2FsY3VsYXRlIGludGVyc2VjdGlvbiBvZiBjYXBhYmlsaXRpZXMuXG4gICAgICAgIHZhciBjb21tb25DYXBhYmlsaXRpZXMgPSBzZWxmLl9nZXRDb21tb25DYXBhYmlsaXRpZXMoXG4gICAgICAgICAgICB0cmFuc2NlaXZlci5sb2NhbENhcGFiaWxpdGllcyxcbiAgICAgICAgICAgIHRyYW5zY2VpdmVyLnJlbW90ZUNhcGFiaWxpdGllcyk7XG5cbiAgICAgICAgc2RwICs9IFNEUFV0aWxzLndyaXRlTWVkaWFTZWN0aW9uKHRyYW5zY2VpdmVyLCBjb21tb25DYXBhYmlsaXRpZXMsXG4gICAgICAgICAgICAnYW5zd2VyJywgc2VsZi5sb2NhbFN0cmVhbXNbMF0pO1xuICAgICAgfSk7XG5cbiAgICAgIHZhciBkZXNjID0gbmV3IFJUQ1Nlc3Npb25EZXNjcmlwdGlvbih7XG4gICAgICAgIHR5cGU6ICdhbnN3ZXInLFxuICAgICAgICBzZHA6IHNkcFxuICAgICAgfSk7XG4gICAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCAmJiB0eXBlb2YgYXJndW1lbnRzWzBdID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIHdpbmRvdy5zZXRUaW1lb3V0KGFyZ3VtZW50c1swXSwgMCwgZGVzYyk7XG4gICAgICB9XG4gICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKGRlc2MpO1xuICAgIH07XG5cbiAgICB3aW5kb3cuUlRDUGVlckNvbm5lY3Rpb24ucHJvdG90eXBlLmFkZEljZUNhbmRpZGF0ZSA9IGZ1bmN0aW9uKGNhbmRpZGF0ZSkge1xuICAgICAgdmFyIG1MaW5lSW5kZXggPSBjYW5kaWRhdGUuc2RwTUxpbmVJbmRleDtcbiAgICAgIGlmIChjYW5kaWRhdGUuc2RwTWlkKSB7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy50cmFuc2NlaXZlcnMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICBpZiAodGhpcy50cmFuc2NlaXZlcnNbaV0ubWlkID09PSBjYW5kaWRhdGUuc2RwTWlkKSB7XG4gICAgICAgICAgICBtTGluZUluZGV4ID0gaTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgdmFyIHRyYW5zY2VpdmVyID0gdGhpcy50cmFuc2NlaXZlcnNbbUxpbmVJbmRleF07XG4gICAgICBpZiAodHJhbnNjZWl2ZXIpIHtcbiAgICAgICAgdmFyIGNhbmQgPSBPYmplY3Qua2V5cyhjYW5kaWRhdGUuY2FuZGlkYXRlKS5sZW5ndGggPiAwID9cbiAgICAgICAgICAgIFNEUFV0aWxzLnBhcnNlQ2FuZGlkYXRlKGNhbmRpZGF0ZS5jYW5kaWRhdGUpIDoge307XG4gICAgICAgIC8vIElnbm9yZSBDaHJvbWUncyBpbnZhbGlkIGNhbmRpZGF0ZXMgc2luY2UgRWRnZSBkb2VzIG5vdCBsaWtlIHRoZW0uXG4gICAgICAgIGlmIChjYW5kLnByb3RvY29sID09PSAndGNwJyAmJiBjYW5kLnBvcnQgPT09IDApIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgLy8gSWdub3JlIFJUQ1AgY2FuZGlkYXRlcywgd2UgYXNzdW1lIFJUQ1AtTVVYLlxuICAgICAgICBpZiAoY2FuZC5jb21wb25lbnQgIT09ICcxJykge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICAvLyBBIGRpcnR5IGhhY2sgdG8gbWFrZSBzYW1wbGVzIHdvcmsuXG4gICAgICAgIGlmIChjYW5kLnR5cGUgPT09ICdlbmRPZkNhbmRpZGF0ZXMnKSB7XG4gICAgICAgICAgY2FuZCA9IHt9O1xuICAgICAgICB9XG4gICAgICAgIHRyYW5zY2VpdmVyLmljZVRyYW5zcG9ydC5hZGRSZW1vdGVDYW5kaWRhdGUoY2FuZCk7XG4gICAgICB9XG4gICAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA+IDEgJiYgdHlwZW9mIGFyZ3VtZW50c1sxXSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICB3aW5kb3cuc2V0VGltZW91dChhcmd1bWVudHNbMV0sIDApO1xuICAgICAgfVxuICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSgpO1xuICAgIH07XG5cbiAgICB3aW5kb3cuUlRDUGVlckNvbm5lY3Rpb24ucHJvdG90eXBlLmdldFN0YXRzID0gZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgcHJvbWlzZXMgPSBbXTtcbiAgICAgIHRoaXMudHJhbnNjZWl2ZXJzLmZvckVhY2goZnVuY3Rpb24odHJhbnNjZWl2ZXIpIHtcbiAgICAgICAgWydydHBTZW5kZXInLCAncnRwUmVjZWl2ZXInLCAnaWNlR2F0aGVyZXInLCAnaWNlVHJhbnNwb3J0JyxcbiAgICAgICAgICAgICdkdGxzVHJhbnNwb3J0J10uZm9yRWFjaChmdW5jdGlvbihtZXRob2QpIHtcbiAgICAgICAgICBpZiAodHJhbnNjZWl2ZXJbbWV0aG9kXSkge1xuICAgICAgICAgICAgcHJvbWlzZXMucHVzaCh0cmFuc2NlaXZlclttZXRob2RdLmdldFN0YXRzKCkpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICAgIHZhciBjYiA9IGFyZ3VtZW50cy5sZW5ndGggPiAxICYmIHR5cGVvZiBhcmd1bWVudHNbMV0gPT09ICdmdW5jdGlvbicgJiZcbiAgICAgICAgICBhcmd1bWVudHNbMV07XG4gICAgICByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSkge1xuICAgICAgICB2YXIgcmVzdWx0cyA9IHt9O1xuICAgICAgICBQcm9taXNlLmFsbChwcm9taXNlcykudGhlbihmdW5jdGlvbihyZXMpIHtcbiAgICAgICAgICByZXMuZm9yRWFjaChmdW5jdGlvbihyZXN1bHQpIHtcbiAgICAgICAgICAgIE9iamVjdC5rZXlzKHJlc3VsdCkuZm9yRWFjaChmdW5jdGlvbihpZCkge1xuICAgICAgICAgICAgICByZXN1bHRzW2lkXSA9IHJlc3VsdFtpZF07XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgICBpZiAoY2IpIHtcbiAgICAgICAgICAgIHdpbmRvdy5zZXRUaW1lb3V0KGNiLCAwLCByZXN1bHRzKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgcmVzb2x2ZShyZXN1bHRzKTtcbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICB9O1xuICB9XG59IGVsc2Uge1xuICB3ZWJydGNVdGlscy5sb2coJ0Jyb3dzZXIgZG9lcyBub3QgYXBwZWFyIHRvIGJlIFdlYlJUQy1jYXBhYmxlJyk7XG59XG5cbi8vIFJldHVybnMgdGhlIHJlc3VsdCBvZiBnZXRVc2VyTWVkaWEgYXMgYSBQcm9taXNlLlxuZnVuY3Rpb24gcmVxdWVzdFVzZXJNZWRpYShjb25zdHJhaW50cykge1xuICByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgZ2V0VXNlck1lZGlhKGNvbnN0cmFpbnRzLCByZXNvbHZlLCByZWplY3QpO1xuICB9KTtcbn1cblxudmFyIHdlYnJ0Y1Rlc3RpbmcgPSB7fTtcbnRyeSB7XG4gIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh3ZWJydGNUZXN0aW5nLCAndmVyc2lvbicsIHtcbiAgICBzZXQ6IGZ1bmN0aW9uKHZlcnNpb24pIHtcbiAgICAgIHdlYnJ0Y0RldGVjdGVkVmVyc2lvbiA9IHZlcnNpb247XG4gICAgfVxuICB9KTtcbn0gY2F0Y2ggKGUpIHt9XG5cbmlmICh0eXBlb2YgbW9kdWxlICE9PSAndW5kZWZpbmVkJykge1xuICB2YXIgUlRDUGVlckNvbm5lY3Rpb247XG4gIHZhciBSVENJY2VDYW5kaWRhdGU7XG4gIHZhciBSVENTZXNzaW9uRGVzY3JpcHRpb247XG4gIGlmICh0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJykge1xuICAgIFJUQ1BlZXJDb25uZWN0aW9uID0gd2luZG93LlJUQ1BlZXJDb25uZWN0aW9uO1xuICAgIFJUQ0ljZUNhbmRpZGF0ZSA9IHdpbmRvdy5SVENJY2VDYW5kaWRhdGU7XG4gICAgUlRDU2Vzc2lvbkRlc2NyaXB0aW9uID0gd2luZG93LlJUQ1Nlc3Npb25EZXNjcmlwdGlvbjtcbiAgfVxuICBtb2R1bGUuZXhwb3J0cyA9IHtcbiAgICBSVENQZWVyQ29ubmVjdGlvbjogUlRDUGVlckNvbm5lY3Rpb24sXG4gICAgUlRDSWNlQ2FuZGlkYXRlOiBSVENJY2VDYW5kaWRhdGUsXG4gICAgUlRDU2Vzc2lvbkRlc2NyaXB0aW9uOiBSVENTZXNzaW9uRGVzY3JpcHRpb24sXG4gICAgZ2V0VXNlck1lZGlhOiBnZXRVc2VyTWVkaWEsXG4gICAgYXR0YWNoTWVkaWFTdHJlYW06IGF0dGFjaE1lZGlhU3RyZWFtLFxuICAgIHJlYXR0YWNoTWVkaWFTdHJlYW06IHJlYXR0YWNoTWVkaWFTdHJlYW0sXG4gICAgd2VicnRjRGV0ZWN0ZWRCcm93c2VyOiB3ZWJydGNEZXRlY3RlZEJyb3dzZXIsXG4gICAgd2VicnRjRGV0ZWN0ZWRWZXJzaW9uOiB3ZWJydGNEZXRlY3RlZFZlcnNpb24sXG4gICAgd2VicnRjTWluaW11bVZlcnNpb246IHdlYnJ0Y01pbmltdW1WZXJzaW9uLFxuICAgIHdlYnJ0Y1Rlc3Rpbmc6IHdlYnJ0Y1Rlc3RpbmcsXG4gICAgd2VicnRjVXRpbHM6IHdlYnJ0Y1V0aWxzXG4gICAgLy9yZXF1ZXN0VXNlck1lZGlhOiBub3QgZXhwb3NlZCBvbiBwdXJwb3NlLlxuICAgIC8vdHJhY2U6IG5vdCBleHBvc2VkIG9uIHB1cnBvc2UuXG4gIH07XG59IGVsc2UgaWYgKCh0eXBlb2YgcmVxdWlyZSA9PT0gJ2Z1bmN0aW9uJykgJiYgKHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicpKSB7XG4gIC8vIEV4cG9zZSBvYmplY3RzIGFuZCBmdW5jdGlvbnMgd2hlbiBSZXF1aXJlSlMgaXMgZG9pbmcgdGhlIGxvYWRpbmcuXG4gIGRlZmluZShbXSwgZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIFJUQ1BlZXJDb25uZWN0aW9uOiB3aW5kb3cuUlRDUGVlckNvbm5lY3Rpb24sXG4gICAgICBSVENJY2VDYW5kaWRhdGU6IHdpbmRvdy5SVENJY2VDYW5kaWRhdGUsXG4gICAgICBSVENTZXNzaW9uRGVzY3JpcHRpb246IHdpbmRvdy5SVENTZXNzaW9uRGVzY3JpcHRpb24sXG4gICAgICBnZXRVc2VyTWVkaWE6IGdldFVzZXJNZWRpYSxcbiAgICAgIGF0dGFjaE1lZGlhU3RyZWFtOiBhdHRhY2hNZWRpYVN0cmVhbSxcbiAgICAgIHJlYXR0YWNoTWVkaWFTdHJlYW06IHJlYXR0YWNoTWVkaWFTdHJlYW0sXG4gICAgICB3ZWJydGNEZXRlY3RlZEJyb3dzZXI6IHdlYnJ0Y0RldGVjdGVkQnJvd3NlcixcbiAgICAgIHdlYnJ0Y0RldGVjdGVkVmVyc2lvbjogd2VicnRjRGV0ZWN0ZWRWZXJzaW9uLFxuICAgICAgd2VicnRjTWluaW11bVZlcnNpb246IHdlYnJ0Y01pbmltdW1WZXJzaW9uLFxuICAgICAgd2VicnRjVGVzdGluZzogd2VicnRjVGVzdGluZyxcbiAgICAgIHdlYnJ0Y1V0aWxzOiB3ZWJydGNVdGlsc1xuICAgICAgLy9yZXF1ZXN0VXNlck1lZGlhOiBub3QgZXhwb3NlZCBvbiBwdXJwb3NlLlxuICAgICAgLy90cmFjZTogbm90IGV4cG9zZWQgb24gcHVycG9zZS5cbiAgICB9O1xuICB9KTtcbn1cbiIsInZhciBjb3B5T2JqZWN0V2l0aCA9IHJlcXVpcmUoJy4vaW50ZXJuYWwvY29weU9iamVjdFdpdGgnKSxcbiAgICBjcmVhdGVBc3NpZ25lciA9IHJlcXVpcmUoJy4vaW50ZXJuYWwvY3JlYXRlQXNzaWduZXInKSxcbiAgICBrZXlzSW4gPSByZXF1aXJlKCcuL2tleXNJbicpO1xuXG4vKipcbiAqIFRoaXMgbWV0aG9kIGlzIGxpa2UgYF8uYXNzaWduSW5gIGV4Y2VwdCB0aGF0IGl0IGFjY2VwdHMgYGN1c3RvbWl6ZXJgIHdoaWNoXG4gKiBpcyBpbnZva2VkIHRvIHByb2R1Y2UgdGhlIGFzc2lnbmVkIHZhbHVlcy4gSWYgYGN1c3RvbWl6ZXJgIHJldHVybnMgYHVuZGVmaW5lZGBcbiAqIGFzc2lnbm1lbnQgaXMgaGFuZGxlZCBieSB0aGUgbWV0aG9kIGluc3RlYWQuIFRoZSBgY3VzdG9taXplcmAgaXMgaW52b2tlZFxuICogd2l0aCBmaXZlIGFyZ3VtZW50czogKG9ialZhbHVlLCBzcmNWYWx1ZSwga2V5LCBvYmplY3QsIHNvdXJjZSkuXG4gKlxuICogKipOb3RlOioqIFRoaXMgbWV0aG9kIG11dGF0ZXMgYG9iamVjdGAuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBhbGlhcyBleHRlbmRXaXRoXG4gKiBAY2F0ZWdvcnkgT2JqZWN0XG4gKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBkZXN0aW5hdGlvbiBvYmplY3QuXG4gKiBAcGFyYW0gey4uLk9iamVjdH0gc291cmNlcyBUaGUgc291cmNlIG9iamVjdHMuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBbY3VzdG9taXplcl0gVGhlIGZ1bmN0aW9uIHRvIGN1c3RvbWl6ZSBhc3NpZ25lZCB2YWx1ZXMuXG4gKiBAcmV0dXJucyB7T2JqZWN0fSBSZXR1cm5zIGBvYmplY3RgLlxuICogQGV4YW1wbGVcbiAqXG4gKiBmdW5jdGlvbiBjdXN0b21pemVyKG9ialZhbHVlLCBzcmNWYWx1ZSkge1xuICogICByZXR1cm4gXy5pc1VuZGVmaW5lZChvYmpWYWx1ZSkgPyBzcmNWYWx1ZSA6IG9ialZhbHVlO1xuICogfVxuICpcbiAqIHZhciBkZWZhdWx0cyA9IF8ucGFydGlhbFJpZ2h0KF8uYXNzaWduSW5XaXRoLCBjdXN0b21pemVyKTtcbiAqXG4gKiBkZWZhdWx0cyh7ICdhJzogMSB9LCB7ICdiJzogMiB9LCB7ICdhJzogMyB9KTtcbiAqIC8vID0+IHsgJ2EnOiAxLCAnYic6IDIgfVxuICovXG52YXIgYXNzaWduSW5XaXRoID0gY3JlYXRlQXNzaWduZXIoZnVuY3Rpb24ob2JqZWN0LCBzb3VyY2UsIGN1c3RvbWl6ZXIpIHtcbiAgY29weU9iamVjdFdpdGgoc291cmNlLCBrZXlzSW4oc291cmNlKSwgb2JqZWN0LCBjdXN0b21pemVyKTtcbn0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGFzc2lnbkluV2l0aDtcbiIsInZhciBhcHBseSA9IHJlcXVpcmUoJy4vaW50ZXJuYWwvYXBwbHknKSxcbiAgICBhc3NpZ25JbkRlZmF1bHRzID0gcmVxdWlyZSgnLi9pbnRlcm5hbC9hc3NpZ25JbkRlZmF1bHRzJyksXG4gICAgYXNzaWduSW5XaXRoID0gcmVxdWlyZSgnLi9hc3NpZ25JbldpdGgnKSxcbiAgICByZXN0ID0gcmVxdWlyZSgnLi9yZXN0Jyk7XG5cbi8qKlxuICogQXNzaWducyBvd24gYW5kIGluaGVyaXRlZCBlbnVtZXJhYmxlIHByb3BlcnRpZXMgb2Ygc291cmNlIG9iamVjdHMgdG8gdGhlXG4gKiBkZXN0aW5hdGlvbiBvYmplY3QgZm9yIGFsbCBkZXN0aW5hdGlvbiBwcm9wZXJ0aWVzIHRoYXQgcmVzb2x2ZSB0byBgdW5kZWZpbmVkYC5cbiAqIFNvdXJjZSBvYmplY3RzIGFyZSBhcHBsaWVkIGZyb20gbGVmdCB0byByaWdodC4gT25jZSBhIHByb3BlcnR5IGlzIHNldCxcbiAqIGFkZGl0aW9uYWwgdmFsdWVzIG9mIHRoZSBzYW1lIHByb3BlcnR5IGFyZSBpZ25vcmVkLlxuICpcbiAqICoqTm90ZToqKiBUaGlzIG1ldGhvZCBtdXRhdGVzIGBvYmplY3RgLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAY2F0ZWdvcnkgT2JqZWN0XG4gKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBkZXN0aW5hdGlvbiBvYmplY3QuXG4gKiBAcGFyYW0gey4uLk9iamVjdH0gW3NvdXJjZXNdIFRoZSBzb3VyY2Ugb2JqZWN0cy5cbiAqIEByZXR1cm5zIHtPYmplY3R9IFJldHVybnMgYG9iamVjdGAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8uZGVmYXVsdHMoeyAndXNlcic6ICdiYXJuZXknIH0sIHsgJ2FnZSc6IDM2IH0sIHsgJ3VzZXInOiAnZnJlZCcgfSk7XG4gKiAvLyA9PiB7ICd1c2VyJzogJ2Jhcm5leScsICdhZ2UnOiAzNiB9XG4gKi9cbnZhciBkZWZhdWx0cyA9IHJlc3QoZnVuY3Rpb24oYXJncykge1xuICBhcmdzLnB1c2godW5kZWZpbmVkLCBhc3NpZ25JbkRlZmF1bHRzKTtcbiAgcmV0dXJuIGFwcGx5KGFzc2lnbkluV2l0aCwgdW5kZWZpbmVkLCBhcmdzKTtcbn0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGRlZmF1bHRzO1xuIiwiLyoqXG4gKiBQZXJmb3JtcyBhIFtgU2FtZVZhbHVlWmVyb2BdKGh0dHA6Ly9lY21hLWludGVybmF0aW9uYWwub3JnL2VjbWEtMjYyLzYuMC8jc2VjLXNhbWV2YWx1ZXplcm8pXG4gKiBjb21wYXJpc29uIGJldHdlZW4gdHdvIHZhbHVlcyB0byBkZXRlcm1pbmUgaWYgdGhleSBhcmUgZXF1aXZhbGVudC5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQGNhdGVnb3J5IExhbmdcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNvbXBhcmUuXG4gKiBAcGFyYW0geyp9IG90aGVyIFRoZSBvdGhlciB2YWx1ZSB0byBjb21wYXJlLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIHRoZSB2YWx1ZXMgYXJlIGVxdWl2YWxlbnQsIGVsc2UgYGZhbHNlYC5cbiAqIEBleGFtcGxlXG4gKlxuICogdmFyIG9iamVjdCA9IHsgJ3VzZXInOiAnZnJlZCcgfTtcbiAqIHZhciBvdGhlciA9IHsgJ3VzZXInOiAnZnJlZCcgfTtcbiAqXG4gKiBfLmVxKG9iamVjdCwgb2JqZWN0KTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmVxKG9iamVjdCwgb3RoZXIpO1xuICogLy8gPT4gZmFsc2VcbiAqXG4gKiBfLmVxKCdhJywgJ2EnKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmVxKCdhJywgT2JqZWN0KCdhJykpO1xuICogLy8gPT4gZmFsc2VcbiAqXG4gKiBfLmVxKE5hTiwgTmFOKTtcbiAqIC8vID0+IHRydWVcbiAqL1xuZnVuY3Rpb24gZXEodmFsdWUsIG90aGVyKSB7XG4gIHJldHVybiB2YWx1ZSA9PT0gb3RoZXIgfHwgKHZhbHVlICE9PSB2YWx1ZSAmJiBvdGhlciAhPT0gb3RoZXIpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGVxO1xuIiwiLyoqIEJ1aWx0LWluIHZhbHVlIHJlZmVyZW5jZXMuICovXG52YXIgUmVmbGVjdCA9IGdsb2JhbC5SZWZsZWN0O1xuXG5tb2R1bGUuZXhwb3J0cyA9IFJlZmxlY3Q7XG4iLCIvKipcbiAqIEEgZmFzdGVyIGFsdGVybmF0aXZlIHRvIGBGdW5jdGlvbiNhcHBseWAsIHRoaXMgZnVuY3Rpb24gaW52b2tlcyBgZnVuY2BcbiAqIHdpdGggdGhlIGB0aGlzYCBiaW5kaW5nIG9mIGB0aGlzQXJnYCBhbmQgdGhlIGFyZ3VtZW50cyBvZiBgYXJnc2AuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZ1bmMgVGhlIGZ1bmN0aW9uIHRvIGludm9rZS5cbiAqIEBwYXJhbSB7Kn0gdGhpc0FyZyBUaGUgYHRoaXNgIGJpbmRpbmcgb2YgYGZ1bmNgLlxuICogQHBhcmFtIHsuLi4qfSBbYXJnc10gVGhlIGFyZ3VtZW50cyB0byBpbnZva2UgYGZ1bmNgIHdpdGguXG4gKiBAcmV0dXJucyB7Kn0gUmV0dXJucyB0aGUgcmVzdWx0IG9mIGBmdW5jYC5cbiAqL1xuZnVuY3Rpb24gYXBwbHkoZnVuYywgdGhpc0FyZywgYXJncykge1xuICB2YXIgbGVuZ3RoID0gYXJncyA/IGFyZ3MubGVuZ3RoIDogMDtcbiAgc3dpdGNoIChsZW5ndGgpIHtcbiAgICBjYXNlIDA6IHJldHVybiBmdW5jLmNhbGwodGhpc0FyZyk7XG4gICAgY2FzZSAxOiByZXR1cm4gZnVuYy5jYWxsKHRoaXNBcmcsIGFyZ3NbMF0pO1xuICAgIGNhc2UgMjogcmV0dXJuIGZ1bmMuY2FsbCh0aGlzQXJnLCBhcmdzWzBdLCBhcmdzWzFdKTtcbiAgICBjYXNlIDM6IHJldHVybiBmdW5jLmNhbGwodGhpc0FyZywgYXJnc1swXSwgYXJnc1sxXSwgYXJnc1syXSk7XG4gIH1cbiAgcmV0dXJuIGZ1bmMuYXBwbHkodGhpc0FyZywgYXJncyk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYXBwbHk7XG4iLCIvKipcbiAqIEFwcGVuZHMgdGhlIGVsZW1lbnRzIG9mIGB2YWx1ZXNgIHRvIGBhcnJheWAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7QXJyYXl9IGFycmF5IFRoZSBhcnJheSB0byBtb2RpZnkuXG4gKiBAcGFyYW0ge0FycmF5fSB2YWx1ZXMgVGhlIHZhbHVlcyB0byBhcHBlbmQuXG4gKiBAcmV0dXJucyB7QXJyYXl9IFJldHVybnMgYGFycmF5YC5cbiAqL1xuZnVuY3Rpb24gYXJyYXlQdXNoKGFycmF5LCB2YWx1ZXMpIHtcbiAgdmFyIGluZGV4ID0gLTEsXG4gICAgICBsZW5ndGggPSB2YWx1ZXMubGVuZ3RoLFxuICAgICAgb2Zmc2V0ID0gYXJyYXkubGVuZ3RoO1xuXG4gIHdoaWxlICgrK2luZGV4IDwgbGVuZ3RoKSB7XG4gICAgYXJyYXlbb2Zmc2V0ICsgaW5kZXhdID0gdmFsdWVzW2luZGV4XTtcbiAgfVxuICByZXR1cm4gYXJyYXk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYXJyYXlQdXNoO1xuIiwiLyoqXG4gKiBBIHNwZWNpYWxpemVkIHZlcnNpb24gb2YgYF8ucmVkdWNlYCBmb3IgYXJyYXlzIHdpdGhvdXQgc3VwcG9ydCBmb3JcbiAqIGl0ZXJhdGVlIHNob3J0aGFuZHMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7QXJyYXl9IGFycmF5IFRoZSBhcnJheSB0byBpdGVyYXRlIG92ZXIuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBpdGVyYXRlZSBUaGUgZnVuY3Rpb24gaW52b2tlZCBwZXIgaXRlcmF0aW9uLlxuICogQHBhcmFtIHsqfSBbYWNjdW11bGF0b3JdIFRoZSBpbml0aWFsIHZhbHVlLlxuICogQHBhcmFtIHtib29sZWFufSBbaW5pdEZyb21BcnJheV0gU3BlY2lmeSB1c2luZyB0aGUgZmlyc3QgZWxlbWVudCBvZiBgYXJyYXlgIGFzIHRoZSBpbml0aWFsIHZhbHVlLlxuICogQHJldHVybnMgeyp9IFJldHVybnMgdGhlIGFjY3VtdWxhdGVkIHZhbHVlLlxuICovXG5mdW5jdGlvbiBhcnJheVJlZHVjZShhcnJheSwgaXRlcmF0ZWUsIGFjY3VtdWxhdG9yLCBpbml0RnJvbUFycmF5KSB7XG4gIHZhciBpbmRleCA9IC0xLFxuICAgICAgbGVuZ3RoID0gYXJyYXkubGVuZ3RoO1xuXG4gIGlmIChpbml0RnJvbUFycmF5ICYmIGxlbmd0aCkge1xuICAgIGFjY3VtdWxhdG9yID0gYXJyYXlbKytpbmRleF07XG4gIH1cbiAgd2hpbGUgKCsraW5kZXggPCBsZW5ndGgpIHtcbiAgICBhY2N1bXVsYXRvciA9IGl0ZXJhdGVlKGFjY3VtdWxhdG9yLCBhcnJheVtpbmRleF0sIGluZGV4LCBhcnJheSk7XG4gIH1cbiAgcmV0dXJuIGFjY3VtdWxhdG9yO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGFycmF5UmVkdWNlO1xuIiwidmFyIGVxID0gcmVxdWlyZSgnLi4vZXEnKTtcblxuLyoqIFVzZWQgZm9yIGJ1aWx0LWluIG1ldGhvZCByZWZlcmVuY2VzLiAqL1xudmFyIG9iamVjdFByb3RvID0gZ2xvYmFsLk9iamVjdC5wcm90b3R5cGU7XG5cbi8qKiBVc2VkIHRvIGNoZWNrIG9iamVjdHMgZm9yIG93biBwcm9wZXJ0aWVzLiAqL1xudmFyIGhhc093blByb3BlcnR5ID0gb2JqZWN0UHJvdG8uaGFzT3duUHJvcGVydHk7XG5cbi8qKlxuICogVXNlZCBieSBgXy5kZWZhdWx0c2AgdG8gY3VzdG9taXplIGl0cyBgXy5hc3NpZ25JbmAgdXNlLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0geyp9IG9ialZhbHVlIFRoZSBkZXN0aW5hdGlvbiB2YWx1ZS5cbiAqIEBwYXJhbSB7Kn0gc3JjVmFsdWUgVGhlIHNvdXJjZSB2YWx1ZS5cbiAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgVGhlIGtleSBvZiB0aGUgcHJvcGVydHkgdG8gYXNzaWduLlxuICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgcGFyZW50IG9iamVjdCBvZiBgb2JqVmFsdWVgLlxuICogQHJldHVybnMgeyp9IFJldHVybnMgdGhlIHZhbHVlIHRvIGFzc2lnbi5cbiAqL1xuZnVuY3Rpb24gYXNzaWduSW5EZWZhdWx0cyhvYmpWYWx1ZSwgc3JjVmFsdWUsIGtleSwgb2JqZWN0KSB7XG4gIGlmIChvYmpWYWx1ZSA9PT0gdW5kZWZpbmVkIHx8XG4gICAgICAoZXEob2JqVmFsdWUsIG9iamVjdFByb3RvW2tleV0pICYmICFoYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwga2V5KSkpIHtcbiAgICByZXR1cm4gc3JjVmFsdWU7XG4gIH1cbiAgcmV0dXJuIG9ialZhbHVlO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGFzc2lnbkluRGVmYXVsdHM7XG4iLCJ2YXIgZXEgPSByZXF1aXJlKCcuLi9lcScpO1xuXG4vKiogVXNlZCBmb3IgYnVpbHQtaW4gbWV0aG9kIHJlZmVyZW5jZXMuICovXG52YXIgb2JqZWN0UHJvdG8gPSBnbG9iYWwuT2JqZWN0LnByb3RvdHlwZTtcblxuLyoqIFVzZWQgdG8gY2hlY2sgb2JqZWN0cyBmb3Igb3duIHByb3BlcnRpZXMuICovXG52YXIgaGFzT3duUHJvcGVydHkgPSBvYmplY3RQcm90by5oYXNPd25Qcm9wZXJ0eTtcblxuLyoqXG4gKiBBc3NpZ25zIGB2YWx1ZWAgdG8gYGtleWAgb2YgYG9iamVjdGAgaWYgdGhlIGV4aXN0aW5nIHZhbHVlIGlzIG5vdCBlcXVpdmFsZW50XG4gKiB1c2luZyBbYFNhbWVWYWx1ZVplcm9gXShodHRwOi8vZWNtYS1pbnRlcm5hdGlvbmFsLm9yZy9lY21hLTI2Mi82LjAvI3NlYy1zYW1ldmFsdWV6ZXJvKVxuICogZm9yIGVxdWFsaXR5IGNvbXBhcmlzb25zLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBvYmplY3QgdG8gbW9kaWZ5LlxuICogQHBhcmFtIHtzdHJpbmd9IGtleSBUaGUga2V5IG9mIHRoZSBwcm9wZXJ0eSB0byBhc3NpZ24uXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBhc3NpZ24uXG4gKi9cbmZ1bmN0aW9uIGFzc2lnblZhbHVlKG9iamVjdCwga2V5LCB2YWx1ZSkge1xuICB2YXIgb2JqVmFsdWUgPSBvYmplY3Rba2V5XTtcbiAgaWYgKCghZXEob2JqVmFsdWUsIHZhbHVlKSB8fFxuICAgICAgICAoZXEob2JqVmFsdWUsIG9iamVjdFByb3RvW2tleV0pICYmICFoYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwga2V5KSkpIHx8XG4gICAgICAodmFsdWUgPT09IHVuZGVmaW5lZCAmJiAhKGtleSBpbiBvYmplY3QpKSkge1xuICAgIG9iamVjdFtrZXldID0gdmFsdWU7XG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBhc3NpZ25WYWx1ZTtcbiIsInZhciBhcnJheVB1c2ggPSByZXF1aXJlKCcuL2FycmF5UHVzaCcpLFxuICAgIGlzQXJndW1lbnRzID0gcmVxdWlyZSgnLi4vaXNBcmd1bWVudHMnKSxcbiAgICBpc0FycmF5ID0gcmVxdWlyZSgnLi4vaXNBcnJheScpLFxuICAgIGlzQXJyYXlMaWtlT2JqZWN0ID0gcmVxdWlyZSgnLi4vaXNBcnJheUxpa2VPYmplY3QnKTtcblxuLyoqXG4gKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgXy5mbGF0dGVuYCB3aXRoIHN1cHBvcnQgZm9yIHJlc3RyaWN0aW5nIGZsYXR0ZW5pbmcuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7QXJyYXl9IGFycmF5IFRoZSBhcnJheSB0byBmbGF0dGVuLlxuICogQHBhcmFtIHtib29sZWFufSBbaXNEZWVwXSBTcGVjaWZ5IGEgZGVlcCBmbGF0dGVuLlxuICogQHBhcmFtIHtib29sZWFufSBbaXNTdHJpY3RdIFJlc3RyaWN0IGZsYXR0ZW5pbmcgdG8gYXJyYXlzLWxpa2Ugb2JqZWN0cy5cbiAqIEBwYXJhbSB7QXJyYXl9IFtyZXN1bHQ9W11dIFRoZSBpbml0aWFsIHJlc3VsdCB2YWx1ZS5cbiAqIEByZXR1cm5zIHtBcnJheX0gUmV0dXJucyB0aGUgbmV3IGZsYXR0ZW5lZCBhcnJheS5cbiAqL1xuZnVuY3Rpb24gYmFzZUZsYXR0ZW4oYXJyYXksIGlzRGVlcCwgaXNTdHJpY3QsIHJlc3VsdCkge1xuICByZXN1bHQgfHwgKHJlc3VsdCA9IFtdKTtcblxuICB2YXIgaW5kZXggPSAtMSxcbiAgICAgIGxlbmd0aCA9IGFycmF5Lmxlbmd0aDtcblxuICB3aGlsZSAoKytpbmRleCA8IGxlbmd0aCkge1xuICAgIHZhciB2YWx1ZSA9IGFycmF5W2luZGV4XTtcbiAgICBpZiAoaXNBcnJheUxpa2VPYmplY3QodmFsdWUpICYmXG4gICAgICAgIChpc1N0cmljdCB8fCBpc0FycmF5KHZhbHVlKSB8fCBpc0FyZ3VtZW50cyh2YWx1ZSkpKSB7XG4gICAgICBpZiAoaXNEZWVwKSB7XG4gICAgICAgIC8vIFJlY3Vyc2l2ZWx5IGZsYXR0ZW4gYXJyYXlzIChzdXNjZXB0aWJsZSB0byBjYWxsIHN0YWNrIGxpbWl0cykuXG4gICAgICAgIGJhc2VGbGF0dGVuKHZhbHVlLCBpc0RlZXAsIGlzU3RyaWN0LCByZXN1bHQpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgYXJyYXlQdXNoKHJlc3VsdCwgdmFsdWUpO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAoIWlzU3RyaWN0KSB7XG4gICAgICByZXN1bHRbcmVzdWx0Lmxlbmd0aF0gPSB2YWx1ZTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBiYXNlRmxhdHRlbjtcbiIsInZhciBSZWZsZWN0ID0gcmVxdWlyZSgnLi9SZWZsZWN0JyksXG4gICAgaXRlcmF0b3JUb0FycmF5ID0gcmVxdWlyZSgnLi9pdGVyYXRvclRvQXJyYXknKTtcblxuLyoqIFVzZWQgZm9yIGJ1aWx0LWluIG1ldGhvZCByZWZlcmVuY2VzLiAqL1xudmFyIG9iamVjdFByb3RvID0gZ2xvYmFsLk9iamVjdC5wcm90b3R5cGU7XG5cbi8qKiBCdWlsdC1pbiB2YWx1ZSByZWZlcmVuY2VzLiAqL1xudmFyIGVudW1lcmF0ZSA9IFJlZmxlY3QgPyBSZWZsZWN0LmVudW1lcmF0ZSA6IHVuZGVmaW5lZCxcbiAgICBwcm9wZXJ0eUlzRW51bWVyYWJsZSA9IG9iamVjdFByb3RvLnByb3BlcnR5SXNFbnVtZXJhYmxlO1xuXG4vKipcbiAqIFRoZSBiYXNlIGltcGxlbWVudGF0aW9uIG9mIGBfLmtleXNJbmAgd2hpY2ggZG9lc24ndCBza2lwIHRoZSBjb25zdHJ1Y3RvclxuICogcHJvcGVydHkgb2YgcHJvdG90eXBlcyBvciB0cmVhdCBzcGFyc2UgYXJyYXlzIGFzIGRlbnNlLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBvYmplY3QgdG8gcXVlcnkuXG4gKiBAcmV0dXJucyB7QXJyYXl9IFJldHVybnMgdGhlIGFycmF5IG9mIHByb3BlcnR5IG5hbWVzLlxuICovXG5mdW5jdGlvbiBiYXNlS2V5c0luKG9iamVjdCkge1xuICBvYmplY3QgPSBvYmplY3QgPT0gbnVsbCA/IG9iamVjdCA6IE9iamVjdChvYmplY3QpO1xuXG4gIHZhciByZXN1bHQgPSBbXTtcbiAgZm9yICh2YXIga2V5IGluIG9iamVjdCkge1xuICAgIHJlc3VsdC5wdXNoKGtleSk7XG4gIH1cbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxuLy8gRmFsbGJhY2sgZm9yIElFIDwgOSB3aXRoIGVzNi1zaGltLlxuaWYgKGVudW1lcmF0ZSAmJiAhcHJvcGVydHlJc0VudW1lcmFibGUuY2FsbCh7ICd2YWx1ZU9mJzogMSB9LCAndmFsdWVPZicpKSB7XG4gIGJhc2VLZXlzSW4gPSBmdW5jdGlvbihvYmplY3QpIHtcbiAgICByZXR1cm4gaXRlcmF0b3JUb0FycmF5KGVudW1lcmF0ZShvYmplY3QpKTtcbiAgfTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBiYXNlS2V5c0luO1xuIiwidmFyIGFycmF5UmVkdWNlID0gcmVxdWlyZSgnLi9hcnJheVJlZHVjZScpO1xuXG4vKipcbiAqIFRoZSBiYXNlIGltcGxlbWVudGF0aW9uIG9mIGBfLnBpY2tgIHdpdGhvdXQgc3VwcG9ydCBmb3IgaW5kaXZpZHVhbFxuICogcHJvcGVydHkgbmFtZXMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgVGhlIHNvdXJjZSBvYmplY3QuXG4gKiBAcGFyYW0ge3N0cmluZ1tdfSBwcm9wcyBUaGUgcHJvcGVydHkgbmFtZXMgdG8gcGljay5cbiAqIEByZXR1cm5zIHtPYmplY3R9IFJldHVybnMgdGhlIG5ldyBvYmplY3QuXG4gKi9cbmZ1bmN0aW9uIGJhc2VQaWNrKG9iamVjdCwgcHJvcHMpIHtcbiAgb2JqZWN0ID0gT2JqZWN0KG9iamVjdCk7XG4gIHJldHVybiBhcnJheVJlZHVjZShwcm9wcywgZnVuY3Rpb24ocmVzdWx0LCBrZXkpIHtcbiAgICBpZiAoa2V5IGluIG9iamVjdCkge1xuICAgICAgcmVzdWx0W2tleV0gPSBvYmplY3Rba2V5XTtcbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfSwge30pO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGJhc2VQaWNrO1xuIiwiLyoqXG4gKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgXy5wcm9wZXJ0eWAgd2l0aG91dCBzdXBwb3J0IGZvciBkZWVwIHBhdGhzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5IFRoZSBrZXkgb2YgdGhlIHByb3BlcnR5IHRvIGdldC5cbiAqIEByZXR1cm5zIHtGdW5jdGlvbn0gUmV0dXJucyB0aGUgbmV3IGZ1bmN0aW9uLlxuICovXG5mdW5jdGlvbiBiYXNlUHJvcGVydHkoa2V5KSB7XG4gIHJldHVybiBmdW5jdGlvbihvYmplY3QpIHtcbiAgICByZXR1cm4gb2JqZWN0ID09IG51bGwgPyB1bmRlZmluZWQgOiBvYmplY3Rba2V5XTtcbiAgfTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBiYXNlUHJvcGVydHk7XG4iLCIvKipcbiAqIFRoZSBiYXNlIGltcGxlbWVudGF0aW9uIG9mIGBfLnRpbWVzYCB3aXRob3V0IHN1cHBvcnQgZm9yIGl0ZXJhdGVlIHNob3J0aGFuZHNcbiAqIG9yIG1heCBhcnJheSBsZW5ndGggY2hlY2tzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge251bWJlcn0gbiBUaGUgbnVtYmVyIG9mIHRpbWVzIHRvIGludm9rZSBgaXRlcmF0ZWVgLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gaXRlcmF0ZWUgVGhlIGZ1bmN0aW9uIGludm9rZWQgcGVyIGl0ZXJhdGlvbi5cbiAqIEByZXR1cm5zIHtBcnJheX0gUmV0dXJucyB0aGUgYXJyYXkgb2YgcmVzdWx0cy5cbiAqL1xuZnVuY3Rpb24gYmFzZVRpbWVzKG4sIGl0ZXJhdGVlKSB7XG4gIHZhciBpbmRleCA9IC0xLFxuICAgICAgcmVzdWx0ID0gQXJyYXkobik7XG5cbiAgd2hpbGUgKCsraW5kZXggPCBuKSB7XG4gICAgcmVzdWx0W2luZGV4XSA9IGl0ZXJhdGVlKGluZGV4KTtcbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGJhc2VUaW1lcztcbiIsInZhciBhc3NpZ25WYWx1ZSA9IHJlcXVpcmUoJy4vYXNzaWduVmFsdWUnKTtcblxuLyoqXG4gKiBUaGlzIGZ1bmN0aW9uIGlzIGxpa2UgYGNvcHlPYmplY3RgIGV4Y2VwdCB0aGF0IGl0IGFjY2VwdHMgYSBmdW5jdGlvbiB0b1xuICogY3VzdG9taXplIGNvcGllZCB2YWx1ZXMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBzb3VyY2UgVGhlIG9iamVjdCB0byBjb3B5IHByb3BlcnRpZXMgZnJvbS5cbiAqIEBwYXJhbSB7QXJyYXl9IHByb3BzIFRoZSBwcm9wZXJ0eSBuYW1lcyB0byBjb3B5LlxuICogQHBhcmFtIHtPYmplY3R9IFtvYmplY3Q9e31dIFRoZSBvYmplY3QgdG8gY29weSBwcm9wZXJ0aWVzIHRvLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gW2N1c3RvbWl6ZXJdIFRoZSBmdW5jdGlvbiB0byBjdXN0b21pemUgY29waWVkIHZhbHVlcy5cbiAqIEByZXR1cm5zIHtPYmplY3R9IFJldHVybnMgYG9iamVjdGAuXG4gKi9cbmZ1bmN0aW9uIGNvcHlPYmplY3RXaXRoKHNvdXJjZSwgcHJvcHMsIG9iamVjdCwgY3VzdG9taXplcikge1xuICBvYmplY3QgfHwgKG9iamVjdCA9IHt9KTtcblxuICB2YXIgaW5kZXggPSAtMSxcbiAgICAgIGxlbmd0aCA9IHByb3BzLmxlbmd0aDtcblxuICB3aGlsZSAoKytpbmRleCA8IGxlbmd0aCkge1xuICAgIHZhciBrZXkgPSBwcm9wc1tpbmRleF0sXG4gICAgICAgIG5ld1ZhbHVlID0gY3VzdG9taXplciA/IGN1c3RvbWl6ZXIob2JqZWN0W2tleV0sIHNvdXJjZVtrZXldLCBrZXksIG9iamVjdCwgc291cmNlKSA6IHNvdXJjZVtrZXldO1xuXG4gICAgYXNzaWduVmFsdWUob2JqZWN0LCBrZXksIG5ld1ZhbHVlKTtcbiAgfVxuICByZXR1cm4gb2JqZWN0O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGNvcHlPYmplY3RXaXRoO1xuIiwidmFyIGlzSXRlcmF0ZWVDYWxsID0gcmVxdWlyZSgnLi9pc0l0ZXJhdGVlQ2FsbCcpLFxuICAgIHJlc3QgPSByZXF1aXJlKCcuLi9yZXN0Jyk7XG5cbi8qKlxuICogQ3JlYXRlcyBhIGZ1bmN0aW9uIGxpa2UgYF8uYXNzaWduYC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtGdW5jdGlvbn0gYXNzaWduZXIgVGhlIGZ1bmN0aW9uIHRvIGFzc2lnbiB2YWx1ZXMuXG4gKiBAcmV0dXJucyB7RnVuY3Rpb259IFJldHVybnMgdGhlIG5ldyBhc3NpZ25lciBmdW5jdGlvbi5cbiAqL1xuZnVuY3Rpb24gY3JlYXRlQXNzaWduZXIoYXNzaWduZXIpIHtcbiAgcmV0dXJuIHJlc3QoZnVuY3Rpb24ob2JqZWN0LCBzb3VyY2VzKSB7XG4gICAgdmFyIGluZGV4ID0gLTEsXG4gICAgICAgIGxlbmd0aCA9IHNvdXJjZXMubGVuZ3RoLFxuICAgICAgICBjdXN0b21pemVyID0gbGVuZ3RoID4gMSA/IHNvdXJjZXNbbGVuZ3RoIC0gMV0gOiB1bmRlZmluZWQsXG4gICAgICAgIGd1YXJkID0gbGVuZ3RoID4gMiA/IHNvdXJjZXNbMl0gOiB1bmRlZmluZWQ7XG5cbiAgICBjdXN0b21pemVyID0gdHlwZW9mIGN1c3RvbWl6ZXIgPT0gJ2Z1bmN0aW9uJyA/IChsZW5ndGgtLSwgY3VzdG9taXplcikgOiB1bmRlZmluZWQ7XG4gICAgaWYgKGd1YXJkICYmIGlzSXRlcmF0ZWVDYWxsKHNvdXJjZXNbMF0sIHNvdXJjZXNbMV0sIGd1YXJkKSkge1xuICAgICAgY3VzdG9taXplciA9IGxlbmd0aCA8IDMgPyB1bmRlZmluZWQgOiBjdXN0b21pemVyO1xuICAgICAgbGVuZ3RoID0gMTtcbiAgICB9XG4gICAgb2JqZWN0ID0gT2JqZWN0KG9iamVjdCk7XG4gICAgd2hpbGUgKCsraW5kZXggPCBsZW5ndGgpIHtcbiAgICAgIHZhciBzb3VyY2UgPSBzb3VyY2VzW2luZGV4XTtcbiAgICAgIGlmIChzb3VyY2UpIHtcbiAgICAgICAgYXNzaWduZXIob2JqZWN0LCBzb3VyY2UsIGN1c3RvbWl6ZXIpO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gb2JqZWN0O1xuICB9KTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBjcmVhdGVBc3NpZ25lcjtcbiIsInZhciBiYXNlUHJvcGVydHkgPSByZXF1aXJlKCcuL2Jhc2VQcm9wZXJ0eScpO1xuXG4vKipcbiAqIEdldHMgdGhlIFwibGVuZ3RoXCIgcHJvcGVydHkgdmFsdWUgb2YgYG9iamVjdGAuXG4gKlxuICogKipOb3RlOioqIFRoaXMgZnVuY3Rpb24gaXMgdXNlZCB0byBhdm9pZCBhIFtKSVQgYnVnXShodHRwczovL2J1Z3Mud2Via2l0Lm9yZy9zaG93X2J1Zy5jZ2k/aWQ9MTQyNzkyKVxuICogdGhhdCBhZmZlY3RzIFNhZmFyaSBvbiBhdCBsZWFzdCBpT1MgOC4xLTguMyBBUk02NC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgb2JqZWN0IHRvIHF1ZXJ5LlxuICogQHJldHVybnMgeyp9IFJldHVybnMgdGhlIFwibGVuZ3RoXCIgdmFsdWUuXG4gKi9cbnZhciBnZXRMZW5ndGggPSBiYXNlUHJvcGVydHkoJ2xlbmd0aCcpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGdldExlbmd0aDtcbiIsInZhciBiYXNlVGltZXMgPSByZXF1aXJlKCcuL2Jhc2VUaW1lcycpLFxuICAgIGlzQXJndW1lbnRzID0gcmVxdWlyZSgnLi4vaXNBcmd1bWVudHMnKSxcbiAgICBpc0FycmF5ID0gcmVxdWlyZSgnLi4vaXNBcnJheScpLFxuICAgIGlzTGVuZ3RoID0gcmVxdWlyZSgnLi4vaXNMZW5ndGgnKSxcbiAgICBpc1N0cmluZyA9IHJlcXVpcmUoJy4uL2lzU3RyaW5nJyk7XG5cbi8qKlxuICogQ3JlYXRlcyBhbiBhcnJheSBvZiBpbmRleCBrZXlzIGZvciBgb2JqZWN0YCB2YWx1ZXMgb2YgYXJyYXlzLFxuICogYGFyZ3VtZW50c2Agb2JqZWN0cywgYW5kIHN0cmluZ3MsIG90aGVyd2lzZSBgbnVsbGAgaXMgcmV0dXJuZWQuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgVGhlIG9iamVjdCB0byBxdWVyeS5cbiAqIEByZXR1cm5zIHtBcnJheXxudWxsfSBSZXR1cm5zIGluZGV4IGtleXMsIGVsc2UgYG51bGxgLlxuICovXG5mdW5jdGlvbiBpbmRleEtleXMob2JqZWN0KSB7XG4gIHZhciBsZW5ndGggPSBvYmplY3QgPyBvYmplY3QubGVuZ3RoIDogdW5kZWZpbmVkO1xuICByZXR1cm4gKGlzTGVuZ3RoKGxlbmd0aCkgJiYgKGlzQXJyYXkob2JqZWN0KSB8fCBpc1N0cmluZyhvYmplY3QpIHx8IGlzQXJndW1lbnRzKG9iamVjdCkpKVxuICAgID8gYmFzZVRpbWVzKGxlbmd0aCwgU3RyaW5nKVxuICAgIDogbnVsbDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBpbmRleEtleXM7XG4iLCIvKiogVXNlZCBhcyByZWZlcmVuY2VzIGZvciB2YXJpb3VzIGBOdW1iZXJgIGNvbnN0YW50cy4gKi9cbnZhciBNQVhfU0FGRV9JTlRFR0VSID0gOTAwNzE5OTI1NDc0MDk5MTtcblxuLyoqIFVzZWQgdG8gZGV0ZWN0IHVuc2lnbmVkIGludGVnZXIgdmFsdWVzLiAqL1xudmFyIHJlSXNVaW50ID0gL14oPzowfFsxLTldXFxkKikkLztcblxuLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBhIHZhbGlkIGFycmF5LWxpa2UgaW5kZXguXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHBhcmFtIHtudW1iZXJ9IFtsZW5ndGg9TUFYX1NBRkVfSU5URUdFUl0gVGhlIHVwcGVyIGJvdW5kcyBvZiBhIHZhbGlkIGluZGV4LlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYSB2YWxpZCBpbmRleCwgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBpc0luZGV4KHZhbHVlLCBsZW5ndGgpIHtcbiAgdmFsdWUgPSAodHlwZW9mIHZhbHVlID09ICdudW1iZXInIHx8IHJlSXNVaW50LnRlc3QodmFsdWUpKSA/ICt2YWx1ZSA6IC0xO1xuICBsZW5ndGggPSBsZW5ndGggPT0gbnVsbCA/IE1BWF9TQUZFX0lOVEVHRVIgOiBsZW5ndGg7XG4gIHJldHVybiB2YWx1ZSA+IC0xICYmIHZhbHVlICUgMSA9PSAwICYmIHZhbHVlIDwgbGVuZ3RoO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGlzSW5kZXg7XG4iLCJ2YXIgZXEgPSByZXF1aXJlKCcuLi9lcScpLFxuICAgIGlzQXJyYXlMaWtlID0gcmVxdWlyZSgnLi4vaXNBcnJheUxpa2UnKSxcbiAgICBpc0luZGV4ID0gcmVxdWlyZSgnLi9pc0luZGV4JyksXG4gICAgaXNPYmplY3QgPSByZXF1aXJlKCcuLi9pc09iamVjdCcpO1xuXG4vKipcbiAqIENoZWNrcyBpZiB0aGUgcHJvdmlkZWQgYXJndW1lbnRzIGFyZSBmcm9tIGFuIGl0ZXJhdGVlIGNhbGwuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHBvdGVudGlhbCBpdGVyYXRlZSB2YWx1ZSBhcmd1bWVudC5cbiAqIEBwYXJhbSB7Kn0gaW5kZXggVGhlIHBvdGVudGlhbCBpdGVyYXRlZSBpbmRleCBvciBrZXkgYXJndW1lbnQuXG4gKiBAcGFyYW0geyp9IG9iamVjdCBUaGUgcG90ZW50aWFsIGl0ZXJhdGVlIG9iamVjdCBhcmd1bWVudC5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiB0aGUgYXJndW1lbnRzIGFyZSBmcm9tIGFuIGl0ZXJhdGVlIGNhbGwsIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gaXNJdGVyYXRlZUNhbGwodmFsdWUsIGluZGV4LCBvYmplY3QpIHtcbiAgaWYgKCFpc09iamVjdChvYmplY3QpKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIHZhciB0eXBlID0gdHlwZW9mIGluZGV4O1xuICBpZiAodHlwZSA9PSAnbnVtYmVyJ1xuICAgICAgPyAoaXNBcnJheUxpa2Uob2JqZWN0KSAmJiBpc0luZGV4KGluZGV4LCBvYmplY3QubGVuZ3RoKSlcbiAgICAgIDogKHR5cGUgPT0gJ3N0cmluZycgJiYgaW5kZXggaW4gb2JqZWN0KSkge1xuICAgIHJldHVybiBlcShvYmplY3RbaW5kZXhdLCB2YWx1ZSk7XG4gIH1cbiAgcmV0dXJuIGZhbHNlO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGlzSXRlcmF0ZWVDYWxsO1xuIiwiLyoqIFVzZWQgZm9yIGJ1aWx0LWluIG1ldGhvZCByZWZlcmVuY2VzLiAqL1xudmFyIG9iamVjdFByb3RvID0gZ2xvYmFsLk9iamVjdC5wcm90b3R5cGU7XG5cbi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgbGlrZWx5IGEgcHJvdG90eXBlIG9iamVjdC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBhIHByb3RvdHlwZSwgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBpc1Byb3RvdHlwZSh2YWx1ZSkge1xuICB2YXIgQ3RvciA9IHZhbHVlICYmIHZhbHVlLmNvbnN0cnVjdG9yLFxuICAgICAgcHJvdG8gPSAodHlwZW9mIEN0b3IgPT0gJ2Z1bmN0aW9uJyAmJiBDdG9yLnByb3RvdHlwZSkgfHwgb2JqZWN0UHJvdG87XG5cbiAgcmV0dXJuIHZhbHVlID09PSBwcm90bztcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBpc1Byb3RvdHlwZTtcbiIsIi8qKlxuICogQ29udmVydHMgYGl0ZXJhdG9yYCB0byBhbiBhcnJheS5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IGl0ZXJhdG9yIFRoZSBpdGVyYXRvciB0byBjb252ZXJ0LlxuICogQHJldHVybnMge0FycmF5fSBSZXR1cm5zIHRoZSBjb252ZXJ0ZWQgYXJyYXkuXG4gKi9cbmZ1bmN0aW9uIGl0ZXJhdG9yVG9BcnJheShpdGVyYXRvcikge1xuICB2YXIgZGF0YSxcbiAgICAgIHJlc3VsdCA9IFtdO1xuXG4gIHdoaWxlICghKGRhdGEgPSBpdGVyYXRvci5uZXh0KCkpLmRvbmUpIHtcbiAgICByZXN1bHQucHVzaChkYXRhLnZhbHVlKTtcbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGl0ZXJhdG9yVG9BcnJheTtcbiIsInZhciBpc0FycmF5TGlrZU9iamVjdCA9IHJlcXVpcmUoJy4vaXNBcnJheUxpa2VPYmplY3QnKTtcblxuLyoqIGBPYmplY3QjdG9TdHJpbmdgIHJlc3VsdCByZWZlcmVuY2VzLiAqL1xudmFyIGFyZ3NUYWcgPSAnW29iamVjdCBBcmd1bWVudHNdJztcblxuLyoqIFVzZWQgZm9yIGJ1aWx0LWluIG1ldGhvZCByZWZlcmVuY2VzLiAqL1xudmFyIG9iamVjdFByb3RvID0gZ2xvYmFsLk9iamVjdC5wcm90b3R5cGU7XG5cbi8qKiBVc2VkIHRvIGNoZWNrIG9iamVjdHMgZm9yIG93biBwcm9wZXJ0aWVzLiAqL1xudmFyIGhhc093blByb3BlcnR5ID0gb2JqZWN0UHJvdG8uaGFzT3duUHJvcGVydHk7XG5cbi8qKlxuICogVXNlZCB0byByZXNvbHZlIHRoZSBbYHRvU3RyaW5nVGFnYF0oaHR0cDovL2VjbWEtaW50ZXJuYXRpb25hbC5vcmcvZWNtYS0yNjIvNi4wLyNzZWMtb2JqZWN0LnByb3RvdHlwZS50b3N0cmluZylcbiAqIG9mIHZhbHVlcy5cbiAqL1xudmFyIG9iamVjdFRvU3RyaW5nID0gb2JqZWN0UHJvdG8udG9TdHJpbmc7XG5cbi8qKiBCdWlsdC1pbiB2YWx1ZSByZWZlcmVuY2VzLiAqL1xudmFyIHByb3BlcnR5SXNFbnVtZXJhYmxlID0gb2JqZWN0UHJvdG8ucHJvcGVydHlJc0VudW1lcmFibGU7XG5cbi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgbGlrZWx5IGFuIGBhcmd1bWVudHNgIG9iamVjdC5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQGNhdGVnb3J5IExhbmdcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgY29ycmVjdGx5IGNsYXNzaWZpZWQsIGVsc2UgYGZhbHNlYC5cbiAqIEBleGFtcGxlXG4gKlxuICogXy5pc0FyZ3VtZW50cyhmdW5jdGlvbigpIHsgcmV0dXJuIGFyZ3VtZW50czsgfSgpKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzQXJndW1lbnRzKFsxLCAyLCAzXSk7XG4gKiAvLyA9PiBmYWxzZVxuICovXG5mdW5jdGlvbiBpc0FyZ3VtZW50cyh2YWx1ZSkge1xuICAvLyBTYWZhcmkgOC4xIGluY29ycmVjdGx5IG1ha2VzIGBhcmd1bWVudHMuY2FsbGVlYCBlbnVtZXJhYmxlIGluIHN0cmljdCBtb2RlLlxuICByZXR1cm4gaXNBcnJheUxpa2VPYmplY3QodmFsdWUpICYmIGhhc093blByb3BlcnR5LmNhbGwodmFsdWUsICdjYWxsZWUnKSAmJlxuICAgICghcHJvcGVydHlJc0VudW1lcmFibGUuY2FsbCh2YWx1ZSwgJ2NhbGxlZScpIHx8IG9iamVjdFRvU3RyaW5nLmNhbGwodmFsdWUpID09IGFyZ3NUYWcpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGlzQXJndW1lbnRzO1xuIiwiLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBjbGFzc2lmaWVkIGFzIGFuIGBBcnJheWAgb2JqZWN0LlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAdHlwZSBGdW5jdGlvblxuICogQGNhdGVnb3J5IExhbmdcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgY29ycmVjdGx5IGNsYXNzaWZpZWQsIGVsc2UgYGZhbHNlYC5cbiAqIEBleGFtcGxlXG4gKlxuICogXy5pc0FycmF5KFsxLCAyLCAzXSk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc0FycmF5KGRvY3VtZW50LmJvZHkuY2hpbGRyZW4pO1xuICogLy8gPT4gZmFsc2VcbiAqXG4gKiBfLmlzQXJyYXkoJ2FiYycpO1xuICogLy8gPT4gZmFsc2VcbiAqXG4gKiBfLmlzQXJyYXkoXy5ub29wKTtcbiAqIC8vID0+IGZhbHNlXG4gKi9cbnZhciBpc0FycmF5ID0gQXJyYXkuaXNBcnJheTtcblxubW9kdWxlLmV4cG9ydHMgPSBpc0FycmF5O1xuIiwidmFyIGdldExlbmd0aCA9IHJlcXVpcmUoJy4vaW50ZXJuYWwvZ2V0TGVuZ3RoJyksXG4gICAgaXNGdW5jdGlvbiA9IHJlcXVpcmUoJy4vaXNGdW5jdGlvbicpLFxuICAgIGlzTGVuZ3RoID0gcmVxdWlyZSgnLi9pc0xlbmd0aCcpO1xuXG4vKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIGFycmF5LWxpa2UuIEEgdmFsdWUgaXMgY29uc2lkZXJlZCBhcnJheS1saWtlIGlmIGl0J3NcbiAqIG5vdCBhIGZ1bmN0aW9uIGFuZCBoYXMgYSBgdmFsdWUubGVuZ3RoYCB0aGF0J3MgYW4gaW50ZWdlciBncmVhdGVyIHRoYW4gb3JcbiAqIGVxdWFsIHRvIGAwYCBhbmQgbGVzcyB0aGFuIG9yIGVxdWFsIHRvIGBOdW1iZXIuTUFYX1NBRkVfSU5URUdFUmAuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEB0eXBlIEZ1bmN0aW9uXG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBhcnJheS1saWtlLCBlbHNlIGBmYWxzZWAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8uaXNBcnJheUxpa2UoWzEsIDIsIDNdKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzQXJyYXlMaWtlKGRvY3VtZW50LmJvZHkuY2hpbGRyZW4pO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNBcnJheUxpa2UoJ2FiYycpO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNBcnJheUxpa2UoXy5ub29wKTtcbiAqIC8vID0+IGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzQXJyYXlMaWtlKHZhbHVlKSB7XG4gIHJldHVybiB2YWx1ZSAhPSBudWxsICYmXG4gICAgISh0eXBlb2YgdmFsdWUgPT0gJ2Z1bmN0aW9uJyAmJiBpc0Z1bmN0aW9uKHZhbHVlKSkgJiYgaXNMZW5ndGgoZ2V0TGVuZ3RoKHZhbHVlKSk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gaXNBcnJheUxpa2U7XG4iLCJ2YXIgaXNBcnJheUxpa2UgPSByZXF1aXJlKCcuL2lzQXJyYXlMaWtlJyksXG4gICAgaXNPYmplY3RMaWtlID0gcmVxdWlyZSgnLi9pc09iamVjdExpa2UnKTtcblxuLyoqXG4gKiBUaGlzIG1ldGhvZCBpcyBsaWtlIGBfLmlzQXJyYXlMaWtlYCBleGNlcHQgdGhhdCBpdCBhbHNvIGNoZWNrcyBpZiBgdmFsdWVgXG4gKiBpcyBhbiBvYmplY3QuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEB0eXBlIEZ1bmN0aW9uXG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBhbiBhcnJheS1saWtlIG9iamVjdCwgZWxzZSBgZmFsc2VgLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLmlzQXJyYXlMaWtlT2JqZWN0KFsxLCAyLCAzXSk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc0FycmF5TGlrZU9iamVjdChkb2N1bWVudC5ib2R5LmNoaWxkcmVuKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzQXJyYXlMaWtlT2JqZWN0KCdhYmMnKTtcbiAqIC8vID0+IGZhbHNlXG4gKlxuICogXy5pc0FycmF5TGlrZU9iamVjdChfLm5vb3ApO1xuICogLy8gPT4gZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNBcnJheUxpa2VPYmplY3QodmFsdWUpIHtcbiAgcmV0dXJuIGlzT2JqZWN0TGlrZSh2YWx1ZSkgJiYgaXNBcnJheUxpa2UodmFsdWUpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGlzQXJyYXlMaWtlT2JqZWN0O1xuIiwidmFyIGlzT2JqZWN0ID0gcmVxdWlyZSgnLi9pc09iamVjdCcpO1xuXG4vKiogYE9iamVjdCN0b1N0cmluZ2AgcmVzdWx0IHJlZmVyZW5jZXMuICovXG52YXIgZnVuY1RhZyA9ICdbb2JqZWN0IEZ1bmN0aW9uXScsXG4gICAgZ2VuVGFnID0gJ1tvYmplY3QgR2VuZXJhdG9yRnVuY3Rpb25dJztcblxuLyoqIFVzZWQgZm9yIGJ1aWx0LWluIG1ldGhvZCByZWZlcmVuY2VzLiAqL1xudmFyIG9iamVjdFByb3RvID0gZ2xvYmFsLk9iamVjdC5wcm90b3R5cGU7XG5cbi8qKlxuICogVXNlZCB0byByZXNvbHZlIHRoZSBbYHRvU3RyaW5nVGFnYF0oaHR0cDovL2VjbWEtaW50ZXJuYXRpb25hbC5vcmcvZWNtYS0yNjIvNi4wLyNzZWMtb2JqZWN0LnByb3RvdHlwZS50b3N0cmluZylcbiAqIG9mIHZhbHVlcy5cbiAqL1xudmFyIG9iamVjdFRvU3RyaW5nID0gb2JqZWN0UHJvdG8udG9TdHJpbmc7XG5cbi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgY2xhc3NpZmllZCBhcyBhIGBGdW5jdGlvbmAgb2JqZWN0LlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBjb3JyZWN0bHkgY2xhc3NpZmllZCwgZWxzZSBgZmFsc2VgLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLmlzRnVuY3Rpb24oXyk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc0Z1bmN0aW9uKC9hYmMvKTtcbiAqIC8vID0+IGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzRnVuY3Rpb24odmFsdWUpIHtcbiAgLy8gVGhlIHVzZSBvZiBgT2JqZWN0I3RvU3RyaW5nYCBhdm9pZHMgaXNzdWVzIHdpdGggdGhlIGB0eXBlb2ZgIG9wZXJhdG9yXG4gIC8vIGluIFNhZmFyaSA4IHdoaWNoIHJldHVybnMgJ29iamVjdCcgZm9yIHR5cGVkIGFycmF5IGNvbnN0cnVjdG9ycywgYW5kXG4gIC8vIFBoYW50b21KUyAxLjkgd2hpY2ggcmV0dXJucyAnZnVuY3Rpb24nIGZvciBgTm9kZUxpc3RgIGluc3RhbmNlcy5cbiAgdmFyIHRhZyA9IGlzT2JqZWN0KHZhbHVlKSA/IG9iamVjdFRvU3RyaW5nLmNhbGwodmFsdWUpIDogJyc7XG4gIHJldHVybiB0YWcgPT0gZnVuY1RhZyB8fCB0YWcgPT0gZ2VuVGFnO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGlzRnVuY3Rpb247XG4iLCIvKiogVXNlZCBhcyByZWZlcmVuY2VzIGZvciB2YXJpb3VzIGBOdW1iZXJgIGNvbnN0YW50cy4gKi9cbnZhciBNQVhfU0FGRV9JTlRFR0VSID0gOTAwNzE5OTI1NDc0MDk5MTtcblxuLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBhIHZhbGlkIGFycmF5LWxpa2UgbGVuZ3RoLlxuICpcbiAqICoqTm90ZToqKiBUaGlzIGZ1bmN0aW9uIGlzIGxvb3NlbHkgYmFzZWQgb24gW2BUb0xlbmd0aGBdKGh0dHA6Ly9lY21hLWludGVybmF0aW9uYWwub3JnL2VjbWEtMjYyLzYuMC8jc2VjLXRvbGVuZ3RoKS5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQGNhdGVnb3J5IExhbmdcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYSB2YWxpZCBsZW5ndGgsIGVsc2UgYGZhbHNlYC5cbiAqIEBleGFtcGxlXG4gKlxuICogXy5pc0xlbmd0aCgzKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzTGVuZ3RoKE51bWJlci5NSU5fVkFMVUUpO1xuICogLy8gPT4gZmFsc2VcbiAqXG4gKiBfLmlzTGVuZ3RoKEluZmluaXR5KTtcbiAqIC8vID0+IGZhbHNlXG4gKlxuICogXy5pc0xlbmd0aCgnMycpO1xuICogLy8gPT4gZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNMZW5ndGgodmFsdWUpIHtcbiAgcmV0dXJuIHR5cGVvZiB2YWx1ZSA9PSAnbnVtYmVyJyAmJiB2YWx1ZSA+IC0xICYmIHZhbHVlICUgMSA9PSAwICYmIHZhbHVlIDw9IE1BWF9TQUZFX0lOVEVHRVI7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gaXNMZW5ndGg7XG4iLCIvKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIHRoZSBbbGFuZ3VhZ2UgdHlwZV0oaHR0cHM6Ly9lczUuZ2l0aHViLmlvLyN4OCkgb2YgYE9iamVjdGAuXG4gKiAoZS5nLiBhcnJheXMsIGZ1bmN0aW9ucywgb2JqZWN0cywgcmVnZXhlcywgYG5ldyBOdW1iZXIoMClgLCBhbmQgYG5ldyBTdHJpbmcoJycpYClcbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQGNhdGVnb3J5IExhbmdcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYW4gb2JqZWN0LCBlbHNlIGBmYWxzZWAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8uaXNPYmplY3Qoe30pO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNPYmplY3QoWzEsIDIsIDNdKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzT2JqZWN0KF8ubm9vcCk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc09iamVjdChudWxsKTtcbiAqIC8vID0+IGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzT2JqZWN0KHZhbHVlKSB7XG4gIC8vIEF2b2lkIGEgVjggSklUIGJ1ZyBpbiBDaHJvbWUgMTktMjAuXG4gIC8vIFNlZSBodHRwczovL2NvZGUuZ29vZ2xlLmNvbS9wL3Y4L2lzc3Vlcy9kZXRhaWw/aWQ9MjI5MSBmb3IgbW9yZSBkZXRhaWxzLlxuICB2YXIgdHlwZSA9IHR5cGVvZiB2YWx1ZTtcbiAgcmV0dXJuICEhdmFsdWUgJiYgKHR5cGUgPT0gJ29iamVjdCcgfHwgdHlwZSA9PSAnZnVuY3Rpb24nKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBpc09iamVjdDtcbiIsIi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgb2JqZWN0LWxpa2UuIEEgdmFsdWUgaXMgb2JqZWN0LWxpa2UgaWYgaXQncyBub3QgYG51bGxgXG4gKiBhbmQgaGFzIGEgYHR5cGVvZmAgcmVzdWx0IG9mIFwib2JqZWN0XCIuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIG9iamVjdC1saWtlLCBlbHNlIGBmYWxzZWAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8uaXNPYmplY3RMaWtlKHt9KTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzT2JqZWN0TGlrZShbMSwgMiwgM10pO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNPYmplY3RMaWtlKF8ubm9vcCk7XG4gKiAvLyA9PiBmYWxzZVxuICpcbiAqIF8uaXNPYmplY3RMaWtlKG51bGwpO1xuICogLy8gPT4gZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNPYmplY3RMaWtlKHZhbHVlKSB7XG4gIHJldHVybiAhIXZhbHVlICYmIHR5cGVvZiB2YWx1ZSA9PSAnb2JqZWN0Jztcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBpc09iamVjdExpa2U7XG4iLCJ2YXIgaXNBcnJheSA9IHJlcXVpcmUoJy4vaXNBcnJheScpLFxuICAgIGlzT2JqZWN0TGlrZSA9IHJlcXVpcmUoJy4vaXNPYmplY3RMaWtlJyk7XG5cbi8qKiBgT2JqZWN0I3RvU3RyaW5nYCByZXN1bHQgcmVmZXJlbmNlcy4gKi9cbnZhciBzdHJpbmdUYWcgPSAnW29iamVjdCBTdHJpbmddJztcblxuLyoqIFVzZWQgZm9yIGJ1aWx0LWluIG1ldGhvZCByZWZlcmVuY2VzLiAqL1xudmFyIG9iamVjdFByb3RvID0gZ2xvYmFsLk9iamVjdC5wcm90b3R5cGU7XG5cbi8qKlxuICogVXNlZCB0byByZXNvbHZlIHRoZSBbYHRvU3RyaW5nVGFnYF0oaHR0cDovL2VjbWEtaW50ZXJuYXRpb25hbC5vcmcvZWNtYS0yNjIvNi4wLyNzZWMtb2JqZWN0LnByb3RvdHlwZS50b3N0cmluZylcbiAqIG9mIHZhbHVlcy5cbiAqL1xudmFyIG9iamVjdFRvU3RyaW5nID0gb2JqZWN0UHJvdG8udG9TdHJpbmc7XG5cbi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgY2xhc3NpZmllZCBhcyBhIGBTdHJpbmdgIHByaW1pdGl2ZSBvciBvYmplY3QuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGNvcnJlY3RseSBjbGFzc2lmaWVkLCBlbHNlIGBmYWxzZWAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8uaXNTdHJpbmcoJ2FiYycpO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNTdHJpbmcoMSk7XG4gKiAvLyA9PiBmYWxzZVxuICovXG5mdW5jdGlvbiBpc1N0cmluZyh2YWx1ZSkge1xuICByZXR1cm4gdHlwZW9mIHZhbHVlID09ICdzdHJpbmcnIHx8XG4gICAgKCFpc0FycmF5KHZhbHVlKSAmJiBpc09iamVjdExpa2UodmFsdWUpICYmIG9iamVjdFRvU3RyaW5nLmNhbGwodmFsdWUpID09IHN0cmluZ1RhZyk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gaXNTdHJpbmc7XG4iLCJ2YXIgYmFzZUtleXNJbiA9IHJlcXVpcmUoJy4vaW50ZXJuYWwvYmFzZUtleXNJbicpLFxuICAgIGluZGV4S2V5cyA9IHJlcXVpcmUoJy4vaW50ZXJuYWwvaW5kZXhLZXlzJyksXG4gICAgaXNJbmRleCA9IHJlcXVpcmUoJy4vaW50ZXJuYWwvaXNJbmRleCcpLFxuICAgIGlzUHJvdG90eXBlID0gcmVxdWlyZSgnLi9pbnRlcm5hbC9pc1Byb3RvdHlwZScpO1xuXG4vKiogVXNlZCBmb3IgYnVpbHQtaW4gbWV0aG9kIHJlZmVyZW5jZXMuICovXG52YXIgb2JqZWN0UHJvdG8gPSBnbG9iYWwuT2JqZWN0LnByb3RvdHlwZTtcblxuLyoqIFVzZWQgdG8gY2hlY2sgb2JqZWN0cyBmb3Igb3duIHByb3BlcnRpZXMuICovXG52YXIgaGFzT3duUHJvcGVydHkgPSBvYmplY3RQcm90by5oYXNPd25Qcm9wZXJ0eTtcblxuLyoqXG4gKiBDcmVhdGVzIGFuIGFycmF5IG9mIHRoZSBvd24gYW5kIGluaGVyaXRlZCBlbnVtZXJhYmxlIHByb3BlcnR5IG5hbWVzIG9mIGBvYmplY3RgLlxuICpcbiAqICoqTm90ZToqKiBOb24tb2JqZWN0IHZhbHVlcyBhcmUgY29lcmNlZCB0byBvYmplY3RzLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAY2F0ZWdvcnkgT2JqZWN0XG4gKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBvYmplY3QgdG8gcXVlcnkuXG4gKiBAcmV0dXJucyB7QXJyYXl9IFJldHVybnMgdGhlIGFycmF5IG9mIHByb3BlcnR5IG5hbWVzLlxuICogQGV4YW1wbGVcbiAqXG4gKiBmdW5jdGlvbiBGb28oKSB7XG4gKiAgIHRoaXMuYSA9IDE7XG4gKiAgIHRoaXMuYiA9IDI7XG4gKiB9XG4gKlxuICogRm9vLnByb3RvdHlwZS5jID0gMztcbiAqXG4gKiBfLmtleXNJbihuZXcgRm9vKTtcbiAqIC8vID0+IFsnYScsICdiJywgJ2MnXSAoaXRlcmF0aW9uIG9yZGVyIGlzIG5vdCBndWFyYW50ZWVkKVxuICovXG5mdW5jdGlvbiBrZXlzSW4ob2JqZWN0KSB7XG4gIHZhciBpbmRleCA9IC0xLFxuICAgICAgaXNQcm90byA9IGlzUHJvdG90eXBlKG9iamVjdCksXG4gICAgICBwcm9wcyA9IGJhc2VLZXlzSW4ob2JqZWN0KSxcbiAgICAgIHByb3BzTGVuZ3RoID0gcHJvcHMubGVuZ3RoLFxuICAgICAgaW5kZXhlcyA9IGluZGV4S2V5cyhvYmplY3QpLFxuICAgICAgc2tpcEluZGV4ZXMgPSAhIWluZGV4ZXMsXG4gICAgICByZXN1bHQgPSBpbmRleGVzIHx8IFtdLFxuICAgICAgbGVuZ3RoID0gcmVzdWx0Lmxlbmd0aDtcblxuICB3aGlsZSAoKytpbmRleCA8IHByb3BzTGVuZ3RoKSB7XG4gICAgdmFyIGtleSA9IHByb3BzW2luZGV4XTtcbiAgICBpZiAoIShza2lwSW5kZXhlcyAmJiAoa2V5ID09ICdsZW5ndGgnIHx8IGlzSW5kZXgoa2V5LCBsZW5ndGgpKSkgJiZcbiAgICAgICAgIShrZXkgPT0gJ2NvbnN0cnVjdG9yJyAmJiAoaXNQcm90byB8fCAhaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIGtleSkpKSkge1xuICAgICAgcmVzdWx0LnB1c2goa2V5KTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBrZXlzSW47XG4iLCJ2YXIgYmFzZUZsYXR0ZW4gPSByZXF1aXJlKCcuL2ludGVybmFsL2Jhc2VGbGF0dGVuJyksXG4gICAgYmFzZVBpY2sgPSByZXF1aXJlKCcuL2ludGVybmFsL2Jhc2VQaWNrJyksXG4gICAgcmVzdCA9IHJlcXVpcmUoJy4vcmVzdCcpO1xuXG4vKipcbiAqIENyZWF0ZXMgYW4gb2JqZWN0IGNvbXBvc2VkIG9mIHRoZSBwaWNrZWQgYG9iamVjdGAgcHJvcGVydGllcy5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQGNhdGVnb3J5IE9iamVjdFxuICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgc291cmNlIG9iamVjdC5cbiAqIEBwYXJhbSB7Li4uKHN0cmluZ3xzdHJpbmdbXSl9IFtwcm9wc10gVGhlIHByb3BlcnR5IG5hbWVzIHRvIHBpY2ssIHNwZWNpZmllZFxuICogIGluZGl2aWR1YWxseSBvciBpbiBhcnJheXMuXG4gKiBAcmV0dXJucyB7T2JqZWN0fSBSZXR1cm5zIHRoZSBuZXcgb2JqZWN0LlxuICogQGV4YW1wbGVcbiAqXG4gKiB2YXIgb2JqZWN0ID0geyAnYSc6IDEsICdiJzogJzInLCAnYyc6IDMgfTtcbiAqXG4gKiBfLnBpY2sob2JqZWN0LCBbJ2EnLCAnYyddKTtcbiAqIC8vID0+IHsgJ2EnOiAxLCAnYyc6IDMgfVxuICovXG52YXIgcGljayA9IHJlc3QoZnVuY3Rpb24ob2JqZWN0LCBwcm9wcykge1xuICByZXR1cm4gb2JqZWN0ID09IG51bGwgPyB7fSA6IGJhc2VQaWNrKG9iamVjdCwgYmFzZUZsYXR0ZW4ocHJvcHMpKTtcbn0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHBpY2s7XG4iLCJ2YXIgYXBwbHkgPSByZXF1aXJlKCcuL2ludGVybmFsL2FwcGx5JyksXG4gICAgdG9JbnRlZ2VyID0gcmVxdWlyZSgnLi90b0ludGVnZXInKTtcblxuLyoqIFVzZWQgYXMgdGhlIGBUeXBlRXJyb3JgIG1lc3NhZ2UgZm9yIFwiRnVuY3Rpb25zXCIgbWV0aG9kcy4gKi9cbnZhciBGVU5DX0VSUk9SX1RFWFQgPSAnRXhwZWN0ZWQgYSBmdW5jdGlvbic7XG5cbi8qIEJ1aWx0LWluIG1ldGhvZCByZWZlcmVuY2VzIGZvciB0aG9zZSB3aXRoIHRoZSBzYW1lIG5hbWUgYXMgb3RoZXIgYGxvZGFzaGAgbWV0aG9kcy4gKi9cbnZhciBuYXRpdmVNYXggPSBNYXRoLm1heDtcblxuLyoqXG4gKiBDcmVhdGVzIGEgZnVuY3Rpb24gdGhhdCBpbnZva2VzIGBmdW5jYCB3aXRoIHRoZSBgdGhpc2AgYmluZGluZyBvZiB0aGVcbiAqIGNyZWF0ZWQgZnVuY3Rpb24gYW5kIGFyZ3VtZW50cyBmcm9tIGBzdGFydGAgYW5kIGJleW9uZCBwcm92aWRlZCBhcyBhbiBhcnJheS5cbiAqXG4gKiAqKk5vdGU6KiogVGhpcyBtZXRob2QgaXMgYmFzZWQgb24gdGhlIFtyZXN0IHBhcmFtZXRlcl0oaHR0cHM6Ly9tZG4uaW8vcmVzdF9wYXJhbWV0ZXJzKS5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQGNhdGVnb3J5IEZ1bmN0aW9uXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmdW5jIFRoZSBmdW5jdGlvbiB0byBhcHBseSBhIHJlc3QgcGFyYW1ldGVyIHRvLlxuICogQHBhcmFtIHtudW1iZXJ9IFtzdGFydD1mdW5jLmxlbmd0aC0xXSBUaGUgc3RhcnQgcG9zaXRpb24gb2YgdGhlIHJlc3QgcGFyYW1ldGVyLlxuICogQHJldHVybnMge0Z1bmN0aW9ufSBSZXR1cm5zIHRoZSBuZXcgZnVuY3Rpb24uXG4gKiBAZXhhbXBsZVxuICpcbiAqIHZhciBzYXkgPSBfLnJlc3QoZnVuY3Rpb24od2hhdCwgbmFtZXMpIHtcbiAqICAgcmV0dXJuIHdoYXQgKyAnICcgKyBfLmluaXRpYWwobmFtZXMpLmpvaW4oJywgJykgK1xuICogICAgIChfLnNpemUobmFtZXMpID4gMSA/ICcsICYgJyA6ICcnKSArIF8ubGFzdChuYW1lcyk7XG4gKiB9KTtcbiAqXG4gKiBzYXkoJ2hlbGxvJywgJ2ZyZWQnLCAnYmFybmV5JywgJ3BlYmJsZXMnKTtcbiAqIC8vID0+ICdoZWxsbyBmcmVkLCBiYXJuZXksICYgcGViYmxlcydcbiAqL1xuZnVuY3Rpb24gcmVzdChmdW5jLCBzdGFydCkge1xuICBpZiAodHlwZW9mIGZ1bmMgIT0gJ2Z1bmN0aW9uJykge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoRlVOQ19FUlJPUl9URVhUKTtcbiAgfVxuICBzdGFydCA9IG5hdGl2ZU1heChzdGFydCA9PT0gdW5kZWZpbmVkID8gKGZ1bmMubGVuZ3RoIC0gMSkgOiB0b0ludGVnZXIoc3RhcnQpLCAwKTtcbiAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgIHZhciBhcmdzID0gYXJndW1lbnRzLFxuICAgICAgICBpbmRleCA9IC0xLFxuICAgICAgICBsZW5ndGggPSBuYXRpdmVNYXgoYXJncy5sZW5ndGggLSBzdGFydCwgMCksXG4gICAgICAgIGFycmF5ID0gQXJyYXkobGVuZ3RoKTtcblxuICAgIHdoaWxlICgrK2luZGV4IDwgbGVuZ3RoKSB7XG4gICAgICBhcnJheVtpbmRleF0gPSBhcmdzW3N0YXJ0ICsgaW5kZXhdO1xuICAgIH1cbiAgICBzd2l0Y2ggKHN0YXJ0KSB7XG4gICAgICBjYXNlIDA6IHJldHVybiBmdW5jLmNhbGwodGhpcywgYXJyYXkpO1xuICAgICAgY2FzZSAxOiByZXR1cm4gZnVuYy5jYWxsKHRoaXMsIGFyZ3NbMF0sIGFycmF5KTtcbiAgICAgIGNhc2UgMjogcmV0dXJuIGZ1bmMuY2FsbCh0aGlzLCBhcmdzWzBdLCBhcmdzWzFdLCBhcnJheSk7XG4gICAgfVxuICAgIHZhciBvdGhlckFyZ3MgPSBBcnJheShzdGFydCArIDEpO1xuICAgIGluZGV4ID0gLTE7XG4gICAgd2hpbGUgKCsraW5kZXggPCBzdGFydCkge1xuICAgICAgb3RoZXJBcmdzW2luZGV4XSA9IGFyZ3NbaW5kZXhdO1xuICAgIH1cbiAgICBvdGhlckFyZ3Nbc3RhcnRdID0gYXJyYXk7XG4gICAgcmV0dXJuIGFwcGx5KGZ1bmMsIHRoaXMsIG90aGVyQXJncyk7XG4gIH07XG59XG5cbm1vZHVsZS5leHBvcnRzID0gcmVzdDtcbiIsInZhciB0b051bWJlciA9IHJlcXVpcmUoJy4vdG9OdW1iZXInKTtcblxuLyoqIFVzZWQgYXMgcmVmZXJlbmNlcyBmb3IgdmFyaW91cyBgTnVtYmVyYCBjb25zdGFudHMuICovXG52YXIgSU5GSU5JVFkgPSAxIC8gMCxcbiAgICBNQVhfSU5URUdFUiA9IDEuNzk3NjkzMTM0ODYyMzE1N2UrMzA4O1xuXG4vKipcbiAqIENvbnZlcnRzIGB2YWx1ZWAgdG8gYW4gaW50ZWdlci5cbiAqXG4gKiAqKk5vdGU6KiogVGhpcyBmdW5jdGlvbiBpcyBsb29zZWx5IGJhc2VkIG9uIFtgVG9JbnRlZ2VyYF0oaHR0cDovL3d3dy5lY21hLWludGVybmF0aW9uYWwub3JnL2VjbWEtMjYyLzYuMC8jc2VjLXRvaW50ZWdlcikuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjb252ZXJ0LlxuICogQHJldHVybnMge251bWJlcn0gUmV0dXJucyB0aGUgY29udmVydGVkIGludGVnZXIuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8udG9JbnRlZ2VyKDMpO1xuICogLy8gPT4gM1xuICpcbiAqIF8udG9JbnRlZ2VyKE51bWJlci5NSU5fVkFMVUUpO1xuICogLy8gPT4gMFxuICpcbiAqIF8udG9JbnRlZ2VyKEluZmluaXR5KTtcbiAqIC8vID0+IDEuNzk3NjkzMTM0ODYyMzE1N2UrMzA4XG4gKlxuICogXy50b0ludGVnZXIoJzMnKTtcbiAqIC8vID0+IDNcbiAqL1xuZnVuY3Rpb24gdG9JbnRlZ2VyKHZhbHVlKSB7XG4gIGlmICghdmFsdWUpIHtcbiAgICByZXR1cm4gdmFsdWUgPT09IDAgPyB2YWx1ZSA6IDA7XG4gIH1cbiAgdmFsdWUgPSB0b051bWJlcih2YWx1ZSk7XG4gIGlmICh2YWx1ZSA9PT0gSU5GSU5JVFkgfHwgdmFsdWUgPT09IC1JTkZJTklUWSkge1xuICAgIHZhciBzaWduID0gKHZhbHVlIDwgMCA/IC0xIDogMSk7XG4gICAgcmV0dXJuIHNpZ24gKiBNQVhfSU5URUdFUjtcbiAgfVxuICB2YXIgcmVtYWluZGVyID0gdmFsdWUgJSAxO1xuICByZXR1cm4gdmFsdWUgPT09IHZhbHVlID8gKHJlbWFpbmRlciA/IHZhbHVlIC0gcmVtYWluZGVyIDogdmFsdWUpIDogMDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSB0b0ludGVnZXI7XG4iLCJ2YXIgaXNGdW5jdGlvbiA9IHJlcXVpcmUoJy4vaXNGdW5jdGlvbicpLFxuICAgIGlzT2JqZWN0ID0gcmVxdWlyZSgnLi9pc09iamVjdCcpO1xuXG4vKiogVXNlZCBhcyByZWZlcmVuY2VzIGZvciB2YXJpb3VzIGBOdW1iZXJgIGNvbnN0YW50cy4gKi9cbnZhciBOQU4gPSAwIC8gMDtcblxuLyoqIFVzZWQgdG8gbWF0Y2ggbGVhZGluZyBhbmQgdHJhaWxpbmcgd2hpdGVzcGFjZS4gKi9cbnZhciByZVRyaW0gPSAvXlxccyt8XFxzKyQvZztcblxuLyoqIFVzZWQgdG8gZGV0ZWN0IGJhZCBzaWduZWQgaGV4YWRlY2ltYWwgc3RyaW5nIHZhbHVlcy4gKi9cbnZhciByZUlzQmFkSGV4ID0gL15bLStdMHhbMC05YS1mXSskL2k7XG5cbi8qKiBVc2VkIHRvIGRldGVjdCBiaW5hcnkgc3RyaW5nIHZhbHVlcy4gKi9cbnZhciByZUlzQmluYXJ5ID0gL14wYlswMV0rJC9pO1xuXG4vKiogVXNlZCB0byBkZXRlY3Qgb2N0YWwgc3RyaW5nIHZhbHVlcy4gKi9cbnZhciByZUlzT2N0YWwgPSAvXjBvWzAtN10rJC9pO1xuXG4vKiogQnVpbHQtaW4gbWV0aG9kIHJlZmVyZW5jZXMgd2l0aG91dCBhIGRlcGVuZGVuY3kgb24gYGdsb2JhbGAuICovXG52YXIgZnJlZVBhcnNlSW50ID0gcGFyc2VJbnQ7XG5cbi8qKlxuICogQ29udmVydHMgYHZhbHVlYCB0byBhIG51bWJlci5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQGNhdGVnb3J5IExhbmdcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIHByb2Nlc3MuXG4gKiBAcmV0dXJucyB7bnVtYmVyfSBSZXR1cm5zIHRoZSBudW1iZXIuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8udG9OdW1iZXIoMyk7XG4gKiAvLyA9PiAzXG4gKlxuICogXy50b051bWJlcihOdW1iZXIuTUlOX1ZBTFVFKTtcbiAqIC8vID0+IDVlLTMyNFxuICpcbiAqIF8udG9OdW1iZXIoSW5maW5pdHkpO1xuICogLy8gPT4gSW5maW5pdHlcbiAqXG4gKiBfLnRvTnVtYmVyKCczJyk7XG4gKiAvLyA9PiAzXG4gKi9cbmZ1bmN0aW9uIHRvTnVtYmVyKHZhbHVlKSB7XG4gIGlmIChpc09iamVjdCh2YWx1ZSkpIHtcbiAgICB2YXIgb3RoZXIgPSBpc0Z1bmN0aW9uKHZhbHVlLnZhbHVlT2YpID8gdmFsdWUudmFsdWVPZigpIDogdmFsdWU7XG4gICAgdmFsdWUgPSBpc09iamVjdChvdGhlcikgPyAob3RoZXIgKyAnJykgOiBvdGhlcjtcbiAgfVxuICBpZiAodHlwZW9mIHZhbHVlICE9ICdzdHJpbmcnKSB7XG4gICAgcmV0dXJuIHZhbHVlID09PSAwID8gdmFsdWUgOiArdmFsdWU7XG4gIH1cbiAgdmFsdWUgPSB2YWx1ZS5yZXBsYWNlKHJlVHJpbSwgJycpO1xuICB2YXIgaXNCaW5hcnkgPSByZUlzQmluYXJ5LnRlc3QodmFsdWUpO1xuICByZXR1cm4gKGlzQmluYXJ5IHx8IHJlSXNPY3RhbC50ZXN0KHZhbHVlKSlcbiAgICA/IGZyZWVQYXJzZUludCh2YWx1ZS5zbGljZSgyKSwgaXNCaW5hcnkgPyAyIDogOClcbiAgICA6IChyZUlzQmFkSGV4LnRlc3QodmFsdWUpID8gTkFOIDogK3ZhbHVlKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSB0b051bWJlcjtcbiIsIi8vIGxvb3NlbHkgYmFzZWQgb24gaHR0cHM6Ly93d3cubnBtanMuY29tL3BhY2thZ2UvbWljcm9waG9uZS1zdHJlYW1cbnZhciBkZWZhdWx0cyA9IHJlcXVpcmUoJ2xvZGFzaC9kZWZhdWx0cycpO1xudmFyIFJlYWRhYmxlID0gcmVxdWlyZSgnc3RyZWFtJykuUmVhZGFibGU7XG52YXIgdXRpbCA9IHJlcXVpcmUoJ3V0aWwnKTtcblxuZnVuY3Rpb24gTWljU3RyZWFtKHN0cmVhbSwgb3B0cykge1xuICAgIGRlZmF1bHRzKG9wdHMsIHtcbiAgICAgICAgYnVmZmVyU2l6ZTogNDA5NlxuICAgIH0pO1xuXG4gICAgUmVhZGFibGUuY2FsbCh0aGlzLCBvcHRzKTtcblxuXG4gICAgdGhpcy5idWZmZXJVbnVzZWRTYW1wbGVzID0gbmV3IEZsb2F0MzJBcnJheSgwKTtcbiAgICB2YXIgY29udGV4dCA9IHRoaXMuYXVkaW9Db250ZXh0ID0gbmV3IEF1ZGlvQ29udGV4dCgpO1xuICAgIHZhciBhdWRpb0lucHV0ID0gY29udGV4dC5jcmVhdGVNZWRpYVN0cmVhbVNvdXJjZShzdHJlYW0pO1xuICAgIHZhciBpbnB1dENoYW5uZWxzID0gMSwgb3V0cHV0Q2hhbm5lbHMgPSAwO1xuICAgIHZhciByZWNvcmRlciA9IGNvbnRleHQuY3JlYXRlU2NyaXB0UHJvY2Vzc29yKG9wdHMuYnVmZmVyU2l6ZSwgaW5wdXRDaGFubmVscywgb3V0cHV0Q2hhbm5lbHMpO1xuXG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgIHZhciByZWNvcmRpbmcgPSB0cnVlOyAvLyBvbmF1ZGlvcHJvY2VzcyBjYW4gYmUgY2FsbGVkIGF0IGxlYXN0IG9uY2UgYWZ0ZXIgd2UndmUgc3RvcHBlZFxuICAgIHJlY29yZGVyLm9uYXVkaW9wcm9jZXNzID0gZnVuY3Rpb24oZSkge1xuICAgICAgICBpZiAocmVjb3JkaW5nKSB7XG4gICAgICAgICAgICB2YXIgcmF3ID0gbmV3IEZsb2F0MzJBcnJheShlLmlucHV0QnVmZmVyLmdldENoYW5uZWxEYXRhKDApKTtcbiAgICAgICAgICAgIHNlbGYucHVzaChzZWxmLl9leHBvcnREYXRhQnVmZmVyVG8xNktoeihyYXcpKTtcbiAgICAgICAgfVxuICAgIH07XG5cbiAgICBhdWRpb0lucHV0LmNvbm5lY3QocmVjb3JkZXIpO1xuXG4gICAgdGhpcy5zdG9wID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHN0cmVhbS5nZXRUcmFja3MoKVswXS5zdG9wKCk7XG4gICAgICAgIHJlY29yZGVyLmRpc2Nvbm5lY3QoMCk7XG4gICAgICAgIHJlY29yZGluZyA9IGZhbHNlO1xuICAgICAgICBzZWxmLnB1c2gobnVsbCk7XG4gICAgfVxufVxudXRpbC5pbmhlcml0cyhNaWNTdHJlYW0sIFJlYWRhYmxlKTtcblxuLyoqXG4gKiBDcmVhdGVzIGEgQmxvYiB0eXBlOiAnYXVkaW8vbDE2JyB3aXRoIHRoZSBjaHVuayBhbmQgZG93bnNhbXBsaW5nIHRvIDE2IGtIelxuICogY29taW5nIGZyb20gdGhlIG1pY3JvcGhvbmUuXG4gKlxuICogRXhwbGFuYXRpb24gZm9yIHRoZSBtYXRoOiBUaGUgcmF3IHZhbHVlcyBjYXB0dXJlZCBmcm9tIHRoZSBXZWIgQXVkaW8gQVBJIGFyZVxuICogaW4gMzItYml0IEZsb2F0aW5nIFBvaW50LCBiZXR3ZWVuIC0xIGFuZCAxIChwZXIgdGhlIHNwZWNpZmljYXRpb24pLlxuICogVGhlIHZhbHVlcyBmb3IgMTYtYml0IFBDTSByYW5nZSBiZXR3ZWVuIC0zMjc2OCBhbmQgKzMyNzY3ICgxNi1iaXQgc2lnbmVkIGludGVnZXIpLlxuICogTXVsdGlwbHkgdG8gY29udHJvbCB0aGUgdm9sdW1lIG9mIHRoZSBvdXRwdXQuIFdlIHN0b3JlIGluIGxpdHRsZSBlbmRpYW4uXG4gKlxuICogQHBhcmFtICB7T2JqZWN0fSBidWZmZXIgTWljcm9waG9uZSBhdWRpbyBjaHVua1xuICogQHJldHVybiB7QmxvYn0gJ2F1ZGlvL2wxNicgY2h1bmtcbiAqIEBkZXByZWNhdGVkIFRoaXMgbWV0aG9kIGlzIGRlcHJhY2F0ZWRcbiAqL1xuTWljU3RyZWFtLnByb3RvdHlwZS5fZXhwb3J0RGF0YUJ1ZmZlclRvMTZLaHogPSBmdW5jdGlvbihidWZmZXJOZXdTYW1wbGVzKSB7XG4gICAgdmFyIGJ1ZmZlciA9IG51bGwsXG4gICAgICAgIG5ld1NhbXBsZXMgPSBidWZmZXJOZXdTYW1wbGVzLmxlbmd0aCxcbiAgICAgICAgdW51c2VkU2FtcGxlcyA9IHRoaXMuYnVmZmVyVW51c2VkU2FtcGxlcy5sZW5ndGg7XG5cblxuICAgIGlmICh1bnVzZWRTYW1wbGVzID4gMCkge1xuICAgICAgICBidWZmZXIgPSBuZXcgRmxvYXQzMkFycmF5KHVudXNlZFNhbXBsZXMgKyBuZXdTYW1wbGVzKTtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB1bnVzZWRTYW1wbGVzOyArK2kpIHtcbiAgICAgICAgICAgIGJ1ZmZlcltpXSA9IHRoaXMuYnVmZmVyVW51c2VkU2FtcGxlc1tpXTtcbiAgICAgICAgfVxuICAgICAgICBmb3IgKGkgPSAwOyBpIDwgbmV3U2FtcGxlczsgKytpKSB7XG4gICAgICAgICAgICBidWZmZXJbdW51c2VkU2FtcGxlcyArIGldID0gYnVmZmVyTmV3U2FtcGxlc1tpXTtcbiAgICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICAgIGJ1ZmZlciA9IGJ1ZmZlck5ld1NhbXBsZXM7XG4gICAgfVxuXG4gICAgLy8gZG93bnNhbXBsaW5nIHZhcmlhYmxlc1xuICAgIHZhciBmaWx0ZXIgPSBbXG4gICAgICAgICAgICAtMC4wMzc5MzUsIC0wLjAwMDg5MDI0LCAwLjA0MDE3MywgMC4wMTk5ODksIDAuMDA0Nzc5MiwgLTAuMDU4Njc1LCAtMC4wNTY0ODcsXG4gICAgICAgICAgICAtMC4wMDQwNjUzLCAwLjE0NTI3LCAwLjI2OTI3LCAwLjMzOTEzLCAwLjI2OTI3LCAwLjE0NTI3LCAtMC4wMDQwNjUzLCAtMC4wNTY0ODcsXG4gICAgICAgICAgICAtMC4wNTg2NzUsIDAuMDA0Nzc5MiwgMC4wMTk5ODksIDAuMDQwMTczLCAtMC4wMDA4OTAyNCwgLTAuMDM3OTM1XG4gICAgICAgIF0sXG4gICAgICAgIHNhbXBsaW5nUmF0ZVJhdGlvID0gdGhpcy5hdWRpb0NvbnRleHQuc2FtcGxlUmF0ZSAvIDE2MDAwLFxuICAgICAgICBuT3V0cHV0U2FtcGxlcyA9IE1hdGguZmxvb3IoKGJ1ZmZlci5sZW5ndGggLSBmaWx0ZXIubGVuZ3RoKSAvIChzYW1wbGluZ1JhdGVSYXRpbykpICsgMSxcbiAgICAgICAgcGNtRW5jb2RlZEJ1ZmZlcjE2ayA9IG5ldyBBcnJheUJ1ZmZlcihuT3V0cHV0U2FtcGxlcyAqIDIpLFxuICAgICAgICBkYXRhVmlldzE2ayA9IG5ldyBEYXRhVmlldyhwY21FbmNvZGVkQnVmZmVyMTZrKSxcbiAgICAgICAgaW5kZXggPSAwLFxuICAgICAgICB2b2x1bWUgPSAweDdGRkYsIC8vcmFuZ2UgZnJvbSAwIHRvIDB4N0ZGRiB0byBjb250cm9sIHRoZSB2b2x1bWVcbiAgICAgICAgbk91dCA9IDA7XG5cbiAgICBmb3IgKGkgPSAwOyBpICsgZmlsdGVyLmxlbmd0aCAtIDEgPCBidWZmZXIubGVuZ3RoOyBpID0gTWF0aC5yb3VuZChzYW1wbGluZ1JhdGVSYXRpbyAqIG5PdXQpKSB7XG4gICAgICAgIHZhciBzYW1wbGUgPSAwO1xuICAgICAgICBmb3IgKHZhciBqID0gMDsgaiA8IGZpbHRlci5sZW5ndGg7ICsraikge1xuICAgICAgICAgICAgc2FtcGxlICs9IGJ1ZmZlcltpICsgal0gKiBmaWx0ZXJbal07XG4gICAgICAgIH1cbiAgICAgICAgc2FtcGxlICo9IHZvbHVtZTtcbiAgICAgICAgZGF0YVZpZXcxNmsuc2V0SW50MTYoaW5kZXgsIHNhbXBsZSwgdHJ1ZSk7IC8vICd0cnVlJyAtPiBtZWFucyBsaXR0bGUgZW5kaWFuXG4gICAgICAgIGluZGV4ICs9IDI7XG4gICAgICAgIG5PdXQrKztcbiAgICB9XG5cbiAgICB2YXIgaW5kZXhTYW1wbGVBZnRlckxhc3RVc2VkID0gTWF0aC5yb3VuZChzYW1wbGluZ1JhdGVSYXRpbyAqIG5PdXQpO1xuICAgIHZhciByZW1haW5pbmcgPSBidWZmZXIubGVuZ3RoIC0gaW5kZXhTYW1wbGVBZnRlckxhc3RVc2VkO1xuICAgIGlmIChyZW1haW5pbmcgPiAwKSB7XG4gICAgICAgIHRoaXMuYnVmZmVyVW51c2VkU2FtcGxlcyA9IG5ldyBGbG9hdDMyQXJyYXkocmVtYWluaW5nKTtcbiAgICAgICAgZm9yIChpID0gMDsgaSA8IHJlbWFpbmluZzsgKytpKSB7XG4gICAgICAgICAgICB0aGlzLmJ1ZmZlclVudXNlZFNhbXBsZXNbaV0gPSBidWZmZXJbaW5kZXhTYW1wbGVBZnRlckxhc3RVc2VkICsgaV07XG4gICAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLmJ1ZmZlclVudXNlZFNhbXBsZXMgPSBuZXcgRmxvYXQzMkFycmF5KDApO1xuICAgIH1cblxuICAgIHJldHVybiBuZXcgQnVmZmVyKGRhdGFWaWV3MTZrLmJ1ZmZlcik7XG59O1xuXG5NaWNTdHJlYW0ucHJvdG90eXBlLl9yZWFkID0gZnVuY3Rpb24oKSB7XG4gICAgLy8gbm8tb3AsIChmbG93LWNvbnRyb2wgZG9lc24ndCByZWFsbHkgd29yayBvbiBzb3VuZClcbn07XG5cblxubW9kdWxlLmV4cG9ydHMgPSBNaWNTdHJlYW07XG4iLCIvKipcbiAqIENvcHlyaWdodCAyMDE1IElCTSBDb3JwLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSAnTGljZW5zZScpO1xuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogICAgICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiAnQVMgSVMnIEJBU0lTLFxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqL1xuLyogZ2xvYmFsIE9mZmxpbmVBdWRpb0NvbnRleHQgKi9cbid1c2Ugc3RyaWN0JztcblxuLyoqXG4gKiBDYXB0dXJlcyBtaWNyb3Bob25lIGlucHV0IGZyb20gdGhlIGJyb3dzZXIuXG4gKiBXb3JrcyBhdCBsZWFzdCBvbiBsYXRlc3QgdmVyc2lvbnMgb2YgRmlyZWZveCBhbmQgQ2hyb21lXG4gKi9cbmZ1bmN0aW9uIE1pY3JvcGhvbmUoX29wdGlvbnMpIHtcbiAgdmFyIG9wdGlvbnMgPSBfb3B0aW9ucyB8fCB7fTtcblxuICAvLyB3ZSByZWNvcmQgaW4gbW9ubyBiZWNhdXNlIHRoZSBzcGVlY2ggcmVjb2duaXRpb24gc2VydmljZVxuICAvLyBkb2VzIG5vdCBzdXBwb3J0IHN0ZXJlby5cbiAgdGhpcy5idWZmZXJTaXplID0gb3B0aW9ucy5idWZmZXJTaXplIHx8IDgxOTI7XG4gIHRoaXMuaW5wdXRDaGFubmVscyA9IG9wdGlvbnMuaW5wdXRDaGFubmVscyB8fCAxO1xuICB0aGlzLm91dHB1dENoYW5uZWxzID0gb3B0aW9ucy5vdXRwdXRDaGFubmVscyB8fCAxO1xuICB0aGlzLnJlY29yZGluZyA9IGZhbHNlO1xuICB0aGlzLnJlcXVlc3RlZEFjY2VzcyA9IGZhbHNlO1xuICB0aGlzLnNhbXBsZVJhdGUgPSAxNjAwMDtcbiAgLy8gYXV4aWxpYXIgYnVmZmVyIHRvIGtlZXAgdW51c2VkIHNhbXBsZXMgKHVzZWQgd2hlbiBkb2luZyBkb3duc2FtcGxpbmcpXG4gIHRoaXMuYnVmZmVyVW51c2VkU2FtcGxlcyA9IG5ldyBGbG9hdDMyQXJyYXkoMCk7XG4gIHRoaXMuc2FtcGxlc0FsbCA9IG5ldyBGbG9hdDMyQXJyYXkoMjAwMDAwMDApO1xuICB0aGlzLnNhbXBsZXNBbGxPZmZzZXQgPSAwO1xuXG4gIC8vIENocm9tZSBvciBGaXJlZm94IG9yIElFIFVzZXIgbWVkaWFcbiAgaWYgKCFuYXZpZ2F0b3IuZ2V0VXNlck1lZGlhKSB7XG4gICAgbmF2aWdhdG9yLmdldFVzZXJNZWRpYSA9IG5hdmlnYXRvci53ZWJraXRHZXRVc2VyTWVkaWEgfHxcbiAgICBuYXZpZ2F0b3IubW96R2V0VXNlck1lZGlhIHx8IG5hdmlnYXRvci5tc0dldFVzZXJNZWRpYTtcbiAgfVxuXG59XG5cbi8qKlxuICogQ2FsbGVkIHdoZW4gdGhlIHVzZXIgcmVqZWN0IHRoZSB1c2Ugb2YgdGhlIG1pY2hyb3Bob25lXG4gKiBAcGFyYW0gIGVycm9yIFRoZSBlcnJvclxuICovXG5NaWNyb3Bob25lLnByb3RvdHlwZS5vblBlcm1pc3Npb25SZWplY3RlZCA9IGZ1bmN0aW9uKCkge1xuICBjb25zb2xlLmxvZygnTWljcm9waG9uZS5vblBlcm1pc3Npb25SZWplY3RlZCgpJyk7XG4gIHRoaXMucmVxdWVzdGVkQWNjZXNzID0gZmFsc2U7XG4gIHRoaXMub25FcnJvcignUGVybWlzc2lvbiB0byBhY2Nlc3MgdGhlIG1pY3JvcGhvbmUgcmVqZXRlZC4nKTtcbn07XG5cbk1pY3JvcGhvbmUucHJvdG90eXBlLm9uRXJyb3IgPSBmdW5jdGlvbihlcnJvcikge1xuICBjb25zb2xlLmxvZygnTWljcm9waG9uZS5vbkVycm9yKCk6JywgZXJyb3IpO1xufTtcblxuLyoqXG4gKiBDYWxsZWQgd2hlbiB0aGUgdXNlciBhdXRob3JpemVzIHRoZSB1c2Ugb2YgdGhlIG1pY3JvcGhvbmUuXG4gKiBAcGFyYW0gIHtPYmplY3R9IHN0cmVhbSBUaGUgU3RyZWFtIHRvIGNvbm5lY3QgdG9cbiAqXG4gKi9cbk1pY3JvcGhvbmUucHJvdG90eXBlLm9uTWVkaWFTdHJlYW0gPSAgZnVuY3Rpb24oc3RyZWFtKSB7XG4gIHZhciBBdWRpb0N0eCA9IHdpbmRvdy5BdWRpb0NvbnRleHQgfHwgd2luZG93LndlYmtpdEF1ZGlvQ29udGV4dDtcblxuICBpZiAoIUF1ZGlvQ3R4KVxuICAgIHRocm93IG5ldyBFcnJvcignQXVkaW9Db250ZXh0IG5vdCBhdmFpbGFibGUnKTtcblxuICBpZiAoIXRoaXMuYXVkaW9Db250ZXh0KVxuICAgIHRoaXMuYXVkaW9Db250ZXh0ID0gbmV3IEF1ZGlvQ3R4KCk7XG5cbiAgdmFyIGdhaW4gPSB0aGlzLmF1ZGlvQ29udGV4dC5jcmVhdGVHYWluKCk7XG4gIHZhciBhdWRpb0lucHV0ID0gdGhpcy5hdWRpb0NvbnRleHQuY3JlYXRlTWVkaWFTdHJlYW1Tb3VyY2Uoc3RyZWFtKTtcblxuICBhdWRpb0lucHV0LmNvbm5lY3QoZ2Fpbik7XG5cbiAgaWYoIXRoaXMubWljKSB7XG4gIHRoaXMubWljID0gdGhpcy5hdWRpb0NvbnRleHQuY3JlYXRlU2NyaXB0UHJvY2Vzc29yKHRoaXMuYnVmZmVyU2l6ZSxcbiAgICB0aGlzLmlucHV0Q2hhbm5lbHMsIHRoaXMub3V0cHV0Q2hhbm5lbHMpO1xuICB9XG5cbiAgLy8gdW5jb21tZW50IHRoZSBmb2xsb3dpbmcgbGluZSBpZiB5b3Ugd2FudCB0byB1c2UgeW91ciBtaWNyb3Bob25lIHNhbXBsZSByYXRlXG4gIC8vdGhpcy5zYW1wbGVSYXRlID0gdGhpcy5hdWRpb0NvbnRleHQuc2FtcGxlUmF0ZTtcbiAgY29uc29sZS5sb2coJ01pY3JvcGhvbmUub25NZWRpYVN0cmVhbSgpOiBzYW1wbGluZyByYXRlIGlzOicsIHRoaXMuc2FtcGxlUmF0ZSk7XG5cbiAgdGhpcy5taWMub25hdWRpb3Byb2Nlc3MgPSB0aGlzLl9vbmF1ZGlvcHJvY2Vzcy5iaW5kKHRoaXMpO1xuICB0aGlzLnN0cmVhbSA9IHN0cmVhbTtcblxuICBnYWluLmNvbm5lY3QodGhpcy5taWMpO1xuICB0aGlzLm1pYy5jb25uZWN0KHRoaXMuYXVkaW9Db250ZXh0LmRlc3RpbmF0aW9uKTtcbiAgdGhpcy5yZWNvcmRpbmcgPSB0cnVlO1xuICB0aGlzLnJlcXVlc3RlZEFjY2VzcyA9IGZhbHNlO1xuICB0aGlzLm9uU3RhcnRSZWNvcmRpbmcoKTtcbn07XG5cbi8qKlxuICogY2FsbGJhY2sgdGhhdCBpcyBiZWluZyB1c2VkIGJ5IHRoZSBtaWNyb3Bob25lXG4gKiB0byBzZW5kIGF1ZGlvIGNodW5rcy5cbiAqIEBwYXJhbSAge29iamVjdH0gZGF0YSBhdWRpb1xuICovXG5NaWNyb3Bob25lLnByb3RvdHlwZS5fb25hdWRpb3Byb2Nlc3MgPSBmdW5jdGlvbihkYXRhKSB7XG4gIGlmICghdGhpcy5yZWNvcmRpbmcpIHtcbiAgICAvLyBXZSBzcGVhayBidXQgd2UgYXJlIG5vdCByZWNvcmRpbmdcbiAgICByZXR1cm47XG4gIH1cblxuICAvLyBTaW5nbGUgY2hhbm5lbFxuICB2YXIgY2hhbiA9IGRhdGEuaW5wdXRCdWZmZXIuZ2V0Q2hhbm5lbERhdGEoMCk7XG5cbiAgLy9yZXNhbXBsZXIodGhpcy5hdWRpb0NvbnRleHQuc2FtcGxlUmF0ZSxkYXRhLmlucHV0QnVmZmVyLHRoaXMub25BdWRpbyk7XG5cbiAgdGhpcy5zYXZlRGF0YShuZXcgRmxvYXQzMkFycmF5KGNoYW4pKTtcbiAgdGhpcy5vbkF1ZGlvKHRoaXMuX2V4cG9ydERhdGFCdWZmZXJUbzE2S2h6KG5ldyBGbG9hdDMyQXJyYXkoY2hhbikpKTtcblxuICAvL2V4cG9ydCB3aXRoIG1pY3JvcGhvbmUgbWh6LCByZW1lbWJlciB0byB1cGRhdGUgdGhlIHRoaXMuc2FtcGxlUmF0ZVxuICAvLyB3aXRoIHRoZSBzYW1wbGUgcmF0ZSBmcm9tIHlvdXIgbWljcm9waG9uZVxuICAvLyB0aGlzLm9uQXVkaW8odGhpcy5fZXhwb3J0RGF0YUJ1ZmZlcihuZXcgRmxvYXQzMkFycmF5KGNoYW4pKSk7XG5cbn07XG5cbi8qKlxuICogU3RhcnQgdGhlIGF1ZGlvIHJlY29yZGluZ1xuICovXG5NaWNyb3Bob25lLnByb3RvdHlwZS5yZWNvcmQgPSBmdW5jdGlvbigpIHtcbiAgaWYgKCFuYXZpZ2F0b3IuZ2V0VXNlck1lZGlhKXtcbiAgICB0aGlzLm9uRXJyb3IoJ0Jyb3dzZXIgZG9lc25cXCd0IHN1cHBvcnQgbWljcm9waG9uZSBpbnB1dCcpO1xuICAgIHJldHVybjtcbiAgfVxuICBpZiAodGhpcy5yZXF1ZXN0ZWRBY2Nlc3MpIHtcbiAgICByZXR1cm47XG4gIH1cblxuICB0aGlzLnJlcXVlc3RlZEFjY2VzcyA9IHRydWU7XG4gIG5hdmlnYXRvci5nZXRVc2VyTWVkaWEoeyBhdWRpbzogdHJ1ZSB9LFxuICAgIHRoaXMub25NZWRpYVN0cmVhbS5iaW5kKHRoaXMpLCAvLyBNaWNyb3Bob25lIHBlcm1pc3Npb24gZ3JhbnRlZFxuICAgIHRoaXMub25QZXJtaXNzaW9uUmVqZWN0ZWQuYmluZCh0aGlzKSk7IC8vIE1pY3JvcGhvbmUgcGVybWlzc2lvbiByZWplY3RlZFxufTtcblxuLyoqXG4gKiBTdG9wIHRoZSBhdWRpbyByZWNvcmRpbmdcbiAqL1xuTWljcm9waG9uZS5wcm90b3R5cGUuc3RvcCA9IGZ1bmN0aW9uKCkge1xuICAvL2lmICghdGhpcy5yZWNvcmRpbmcpXG4gIC8vICByZXR1cm47XG4gIHRoaXMucmVjb3JkaW5nID0gZmFsc2U7XG4gIGlmICh0aGlzLnN0cmVhbSkge1xuICAgIHRoaXMuc3RyZWFtLmdldFRyYWNrcygpWzBdLnN0b3AoKTtcbiAgICB0aGlzLnJlcXVlc3RlZEFjY2VzcyA9IGZhbHNlO1xuICAgIHRoaXMubWljLmRpc2Nvbm5lY3QoMCk7XG4gIH1cbiAgdGhpcy5vblN0b3BSZWNvcmRpbmcoKTtcbn07XG5cbi8qKlxuICogQ3JlYXRlcyBhIEJsb2IgdHlwZTogJ2F1ZGlvL2wxNicgd2l0aCB0aGUgY2h1bmsgYW5kIGRvd25zYW1wbGluZyB0byAxNiBrSHpcbiAqIGNvbWluZyBmcm9tIHRoZSBtaWNyb3Bob25lLlxuICogRXhwbGFuYXRpb24gZm9yIHRoZSBtYXRoOiBUaGUgcmF3IHZhbHVlcyBjYXB0dXJlZCBmcm9tIHRoZSBXZWIgQXVkaW8gQVBJIGFyZVxuICogaW4gMzItYml0IEZsb2F0aW5nIFBvaW50LCBiZXR3ZWVuIC0xIGFuZCAxIChwZXIgdGhlIHNwZWNpZmljYXRpb24pLlxuICogVGhlIHZhbHVlcyBmb3IgMTYtYml0IFBDTSByYW5nZSBiZXR3ZWVuIC0zMjc2OCBhbmQgKzMyNzY3ICgxNi1iaXQgc2lnbmVkIGludGVnZXIpLlxuICogTXVsdGlwbHkgdG8gY29udHJvbCB0aGUgdm9sdW1lIG9mIHRoZSBvdXRwdXQuIFdlIHN0b3JlIGluIGxpdHRsZSBlbmRpYW4uXG4gKiBAcGFyYW0gIHtPYmplY3R9IGJ1ZmZlciBNaWNyb3Bob25lIGF1ZGlvIGNodW5rXG4gKiBAcmV0dXJuIHtCbG9ifSAnYXVkaW8vbDE2JyBjaHVua1xuICogQGRlcHJlY2F0ZWQgVGhpcyBtZXRob2QgaXMgZGVwcmFjYXRlZFxuICovXG5NaWNyb3Bob25lLnByb3RvdHlwZS5fZXhwb3J0RGF0YUJ1ZmZlclRvMTZLaHogPSBmdW5jdGlvbihidWZmZXJOZXdTYW1wbGVzKSB7XG4gIHZhciBidWZmZXIgPSBudWxsLFxuICAgIG5ld1NhbXBsZXMgPSBidWZmZXJOZXdTYW1wbGVzLmxlbmd0aCxcbiAgICB1bnVzZWRTYW1wbGVzID0gdGhpcy5idWZmZXJVbnVzZWRTYW1wbGVzLmxlbmd0aDtcblxuXG4gIGlmICh1bnVzZWRTYW1wbGVzID4gMCkge1xuICAgIGJ1ZmZlciA9IG5ldyBGbG9hdDMyQXJyYXkodW51c2VkU2FtcGxlcyArIG5ld1NhbXBsZXMpO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdW51c2VkU2FtcGxlczsgKytpKSB7XG4gICAgICBidWZmZXJbaV0gPSB0aGlzLmJ1ZmZlclVudXNlZFNhbXBsZXNbaV07XG4gICAgfVxuICAgIGZvciAoaSA9IDA7IGkgPCBuZXdTYW1wbGVzOyArK2kpIHtcbiAgICAgIGJ1ZmZlclt1bnVzZWRTYW1wbGVzICsgaV0gPSBidWZmZXJOZXdTYW1wbGVzW2ldO1xuICAgIH1cbiAgfSBlbHNlIHtcbiAgICBidWZmZXIgPSBidWZmZXJOZXdTYW1wbGVzO1xuICB9XG5cbiAgLy8gZG93bnNhbXBsaW5nIHZhcmlhYmxlc1xuICB2YXIgZmlsdGVyID0gW1xuICAgICAgLTAuMDM3OTM1LCAtMC4wMDA4OTAyNCwgMC4wNDAxNzMsIDAuMDE5OTg5LCAwLjAwNDc3OTIsIC0wLjA1ODY3NSwgLTAuMDU2NDg3LFxuICAgICAgLTAuMDA0MDY1MywgMC4xNDUyNywgMC4yNjkyNywgMC4zMzkxMywgMC4yNjkyNywgMC4xNDUyNywgLTAuMDA0MDY1MywgLTAuMDU2NDg3LFxuICAgICAgLTAuMDU4Njc1LCAwLjAwNDc3OTIsIDAuMDE5OTg5LCAwLjA0MDE3MywgLTAuMDAwODkwMjQsIC0wLjAzNzkzNVxuICAgIF0sXG4gICAgc2FtcGxpbmdSYXRlUmF0aW8gPSB0aGlzLmF1ZGlvQ29udGV4dC5zYW1wbGVSYXRlIC8gMTYwMDAsXG4gICAgbk91dHB1dFNhbXBsZXMgPSBNYXRoLmZsb29yKChidWZmZXIubGVuZ3RoIC0gZmlsdGVyLmxlbmd0aCkgLyAoc2FtcGxpbmdSYXRlUmF0aW8pKSArIDEsXG4gICAgcGNtRW5jb2RlZEJ1ZmZlcjE2ayA9IG5ldyBBcnJheUJ1ZmZlcihuT3V0cHV0U2FtcGxlcyAqIDIpLFxuICAgIGRhdGFWaWV3MTZrID0gbmV3IERhdGFWaWV3KHBjbUVuY29kZWRCdWZmZXIxNmspLFxuICAgIGluZGV4ID0gMCxcbiAgICB2b2x1bWUgPSAweDdGRkYsIC8vcmFuZ2UgZnJvbSAwIHRvIDB4N0ZGRiB0byBjb250cm9sIHRoZSB2b2x1bWVcbiAgICBuT3V0ID0gMDtcblxuICBmb3IgKHZhciBpID0gMDsgaSArIGZpbHRlci5sZW5ndGggLSAxIDwgYnVmZmVyLmxlbmd0aDsgaSA9IE1hdGgucm91bmQoc2FtcGxpbmdSYXRlUmF0aW8gKiBuT3V0KSkge1xuICAgIHZhciBzYW1wbGUgPSAwO1xuICAgIGZvciAodmFyIGogPSAwOyBqIDwgZmlsdGVyLmxlbmd0aDsgKytqKSB7XG4gICAgICBzYW1wbGUgKz0gYnVmZmVyW2kgKyBqXSAqIGZpbHRlcltqXTtcbiAgICB9XG4gICAgc2FtcGxlICo9IHZvbHVtZTtcbiAgICBkYXRhVmlldzE2ay5zZXRJbnQxNihpbmRleCwgc2FtcGxlLCB0cnVlKTsgLy8gJ3RydWUnIC0+IG1lYW5zIGxpdHRsZSBlbmRpYW5cbiAgICBpbmRleCArPSAyO1xuICAgIG5PdXQrKztcbiAgfVxuXG4gIHZhciBpbmRleFNhbXBsZUFmdGVyTGFzdFVzZWQgPSBNYXRoLnJvdW5kKHNhbXBsaW5nUmF0ZVJhdGlvICogbk91dCk7XG4gIHZhciByZW1haW5pbmcgPSBidWZmZXIubGVuZ3RoIC0gaW5kZXhTYW1wbGVBZnRlckxhc3RVc2VkO1xuICBpZiAocmVtYWluaW5nID4gMCkge1xuICAgIHRoaXMuYnVmZmVyVW51c2VkU2FtcGxlcyA9IG5ldyBGbG9hdDMyQXJyYXkocmVtYWluaW5nKTtcbiAgICBmb3IgKGkgPSAwOyBpIDwgcmVtYWluaW5nOyArK2kpIHtcbiAgICAgIHRoaXMuYnVmZmVyVW51c2VkU2FtcGxlc1tpXSA9IGJ1ZmZlcltpbmRleFNhbXBsZUFmdGVyTGFzdFVzZWQgKyBpXTtcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgdGhpcy5idWZmZXJVbnVzZWRTYW1wbGVzID0gbmV3IEZsb2F0MzJBcnJheSgwKTtcbiAgfVxuXG4gIHJldHVybiBuZXcgQmxvYihbZGF0YVZpZXcxNmtdLCB7XG4gICAgdHlwZTogJ2F1ZGlvL2wxNidcbiAgfSk7XG4gIH07XG5cblxuXG4vLyBuYXRpdmUgd2F5IG9mIHJlc2FtcGxpbmcgY2FwdHVyZWQgYXVkaW9cbnZhciByZXNhbXBsZXIgPSBmdW5jdGlvbihzYW1wbGVSYXRlLCBhdWRpb0J1ZmZlciwgY2FsbGJhY2tQcm9jZXNzQXVkaW8pIHtcblxuICBjb25zb2xlLmxvZygnbGVuZ3RoOiAnICsgYXVkaW9CdWZmZXIubGVuZ3RoICsgJyAnICsgc2FtcGxlUmF0ZSk7XG4gIHZhciBjaGFubmVscyA9IDE7XG4gIHZhciB0YXJnZXRTYW1wbGVSYXRlID0gMTYwMDA7XG4gIHZhciBudW1TYW1wbGVzVGFyZ2V0ID0gYXVkaW9CdWZmZXIubGVuZ3RoICogdGFyZ2V0U2FtcGxlUmF0ZSAvIHNhbXBsZVJhdGU7XG5cbiAgdmFyIG9mZmxpbmVDb250ZXh0ID0gbmV3IE9mZmxpbmVBdWRpb0NvbnRleHQoY2hhbm5lbHMsIG51bVNhbXBsZXNUYXJnZXQsIHRhcmdldFNhbXBsZVJhdGUpO1xuICB2YXIgYnVmZmVyU291cmNlID0gb2ZmbGluZUNvbnRleHQuY3JlYXRlQnVmZmVyU291cmNlKCk7XG4gIGJ1ZmZlclNvdXJjZS5idWZmZXIgPSBhdWRpb0J1ZmZlcjtcblxuICAvLyBjYWxsYmFjayB0aGF0IGlzIGNhbGxlZCB3aGVuIHRoZSByZXNhbXBsaW5nIGZpbmlzaGVzXG4gIG9mZmxpbmVDb250ZXh0Lm9uY29tcGxldGUgPSBmdW5jdGlvbihldmVudCkge1xuICAgIHZhciBzYW1wbGVzVGFyZ2V0ID0gZXZlbnQucmVuZGVyZWRCdWZmZXIuZ2V0Q2hhbm5lbERhdGEoMCk7XG4gICAgY29uc29sZS5sb2coJ0RvbmUgcmVzYW1wbGluZzogJyArIHNhbXBsZXNUYXJnZXQubGVuZ3RoICsgJyBzYW1wbGVzIHByb2R1Y2VkJyk7XG5cbiAgLy8gY29udmVydCBmcm9tIFstMSwxXSByYW5nZSBvZiBmbG9hdGluZyBwb2ludCBudW1iZXJzIHRvIFstMzI3NjcsMzI3NjddIHJhbmdlIG9mIGludGVnZXJzXG4gIHZhciBpbmRleCA9IDA7XG4gIHZhciB2b2x1bWUgPSAweDdGRkY7XG4gICAgdmFyIHBjbUVuY29kZWRCdWZmZXIgPSBuZXcgQXJyYXlCdWZmZXIoc2FtcGxlc1RhcmdldC5sZW5ndGgqMik7ICAgIC8vIHNob3J0IGludGVnZXIgdG8gYnl0ZVxuICAgIHZhciBkYXRhVmlldyA9IG5ldyBEYXRhVmlldyhwY21FbmNvZGVkQnVmZmVyKTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHNhbXBsZXNUYXJnZXQubGVuZ3RoOyBpKyspIHtcbiAgICAgIGRhdGFWaWV3LnNldEludDE2KGluZGV4LCBzYW1wbGVzVGFyZ2V0W2ldKnZvbHVtZSwgdHJ1ZSk7XG4gICAgICBpbmRleCArPSAyO1xuICAgIH1cblxuICAgIC8vIGwxNiBpcyB0aGUgTUlNRSB0eXBlIGZvciAxNi1iaXQgUENNXG4gICAgY2FsbGJhY2tQcm9jZXNzQXVkaW8obmV3IEJsb2IoW2RhdGFWaWV3XSwgeyB0eXBlOiAnYXVkaW8vbDE2JyB9KSk7XG4gIH07XG5cbiAgYnVmZmVyU291cmNlLmNvbm5lY3Qob2ZmbGluZUNvbnRleHQuZGVzdGluYXRpb24pO1xuICBidWZmZXJTb3VyY2Uuc3RhcnQoMCk7XG4gIG9mZmxpbmVDb250ZXh0LnN0YXJ0UmVuZGVyaW5nKCk7XG59O1xuXG5cblxuLyoqXG4gKiBDcmVhdGVzIGEgQmxvYiB0eXBlOiAnYXVkaW8vbDE2JyB3aXRoIHRoZVxuICogY2h1bmsgY29taW5nIGZyb20gdGhlIG1pY3JvcGhvbmUuXG4gKi9cbnZhciBleHBvcnREYXRhQnVmZmVyID0gZnVuY3Rpb24oYnVmZmVyLCBidWZmZXJTaXplKSB7XG4gIHZhciBwY21FbmNvZGVkQnVmZmVyID0gbnVsbCxcbiAgICBkYXRhVmlldyA9IG51bGwsXG4gICAgaW5kZXggPSAwLFxuICAgIHZvbHVtZSA9IDB4N0ZGRjsgLy9yYW5nZSBmcm9tIDAgdG8gMHg3RkZGIHRvIGNvbnRyb2wgdGhlIHZvbHVtZVxuXG4gIHBjbUVuY29kZWRCdWZmZXIgPSBuZXcgQXJyYXlCdWZmZXIoYnVmZmVyU2l6ZSAqIDIpO1xuICBkYXRhVmlldyA9IG5ldyBEYXRhVmlldyhwY21FbmNvZGVkQnVmZmVyKTtcblxuICAvKiBFeHBsYW5hdGlvbiBmb3IgdGhlIG1hdGg6IFRoZSByYXcgdmFsdWVzIGNhcHR1cmVkIGZyb20gdGhlIFdlYiBBdWRpbyBBUEkgYXJlXG4gICAqIGluIDMyLWJpdCBGbG9hdGluZyBQb2ludCwgYmV0d2VlbiAtMSBhbmQgMSAocGVyIHRoZSBzcGVjaWZpY2F0aW9uKS5cbiAgICogVGhlIHZhbHVlcyBmb3IgMTYtYml0IFBDTSByYW5nZSBiZXR3ZWVuIC0zMjc2OCBhbmQgKzMyNzY3ICgxNi1iaXQgc2lnbmVkIGludGVnZXIpLlxuICAgKiBNdWx0aXBseSB0byBjb250cm9sIHRoZSB2b2x1bWUgb2YgdGhlIG91dHB1dC4gV2Ugc3RvcmUgaW4gbGl0dGxlIGVuZGlhbi5cbiAgICovXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgYnVmZmVyLmxlbmd0aDsgaSsrKSB7XG4gICAgZGF0YVZpZXcuc2V0SW50MTYoaW5kZXgsIGJ1ZmZlcltpXSAqIHZvbHVtZSwgdHJ1ZSk7XG4gICAgaW5kZXggKz0gMjtcbiAgfVxuXG4gIC8vIGwxNiBpcyB0aGUgTUlNRSB0eXBlIGZvciAxNi1iaXQgUENNXG4gIHJldHVybiBuZXcgQmxvYihbZGF0YVZpZXddLCB7IHR5cGU6ICdhdWRpby9sMTYnIH0pO1xufTtcblxuTWljcm9waG9uZS5wcm90b3R5cGUuX2V4cG9ydERhdGFCdWZmZXIgPSBmdW5jdGlvbihidWZmZXIpe1xuICB1dGlscy5leHBvcnREYXRhQnVmZmVyKGJ1ZmZlciwgdGhpcy5idWZmZXJTaXplKTtcbn07XG5cblxuLy8gRnVuY3Rpb25zIHVzZWQgdG8gY29udHJvbCBNaWNyb3Bob25lIGV2ZW50cyBsaXN0ZW5lcnMuXG5NaWNyb3Bob25lLnByb3RvdHlwZS5vblN0YXJ0UmVjb3JkaW5nID0gIGZ1bmN0aW9uKCkge307XG5NaWNyb3Bob25lLnByb3RvdHlwZS5vblN0b3BSZWNvcmRpbmcgPSAgZnVuY3Rpb24oKSB7fTtcbk1pY3JvcGhvbmUucHJvdG90eXBlLm9uQXVkaW8gPSAgZnVuY3Rpb24oKSB7fTtcblxubW9kdWxlLmV4cG9ydHMgPSBNaWNyb3Bob25lO1xuXG4vLyBkb2VzIHRoaXMgc2F2ZSBpdCBpbiBtZW1vcnkgZm9yZXZlcj9cbk1pY3JvcGhvbmUucHJvdG90eXBlLnNhdmVEYXRhID0gZnVuY3Rpb24oc2FtcGxlcykge1xuICBmb3IodmFyIGk9MCA7IGkgPCBzYW1wbGVzLmxlbmd0aCA7ICsraSkge1xuICAgIHRoaXMuc2FtcGxlc0FsbFt0aGlzLnNhbXBsZXNBbGxPZmZzZXQraV0gPSBzYW1wbGVzW2ldO1xuICB9XHRcbiAgdGhpcy5zYW1wbGVzQWxsT2Zmc2V0ICs9IHNhbXBsZXMubGVuZ3RoOyBcbiAgY29uc29sZS5sb2coXCJzYW1wbGVzOiBcIiArIHRoaXMuc2FtcGxlc0FsbE9mZnNldCwgc2FtcGxlc1tzYW1wbGVzLmxlbmd0aC0xXSk7XG59XG5cbk1pY3JvcGhvbmUucHJvdG90eXBlLnBsYXlXYXYgPSBmdW5jdGlvbigpIHtcbiAgdmFyIHNhbXBsZXMgPSB0aGlzLnNhbXBsZXNBbGwuc3ViYXJyYXkoMCwgdGhpcy5zYW1wbGVzQWxsT2Zmc2V0KTtcbiAgdmFyIGRhdGF2aWV3ID0gdGhpcy5lbmNvZGVXYXYoc2FtcGxlcywgMSwgdGhpcy5hdWRpb0NvbnRleHQuc2FtcGxlUmF0ZSk7XHRcbiAgdmFyIGF1ZGlvQmxvYiA9IG5ldyBCbG9iKFtkYXRhdmlld10sIHsgdHlwZTogJ2F1ZGlvL2wxNicgfSk7XG4gIHZhciB1cmwgPSB3aW5kb3cuVVJMLmNyZWF0ZU9iamVjdFVSTChhdWRpb0Jsb2IpO1xuICB2YXIgYXVkaW8gPSBuZXcgQXVkaW8oKTtcbiAgYXVkaW8uc3JjID0gdXJsO1xuICBhdWRpby5wbGF5KCk7XG59XG5cbk1pY3JvcGhvbmUucHJvdG90eXBlLmVuY29kZVdhdiA9IGZ1bmN0aW9uIChzYW1wbGVzLCBudW1DaGFubmVscywgc2FtcGxlUmF0ZSkge1x0XG4gIGNvbnNvbGUubG9nKFwiI3NhbXBsZXM6IFwiICsgc2FtcGxlcy5sZW5ndGgpO1x0XG4gIHZhciBidWZmZXIgPSBuZXcgQXJyYXlCdWZmZXIoNDQgKyBzYW1wbGVzLmxlbmd0aCAqIDIpO1xuICB2YXIgdmlldyA9IG5ldyBEYXRhVmlldyhidWZmZXIpO1xuXG4gIC8qIFJJRkYgaWRlbnRpZmllciAqL1xuICB0aGlzLndyaXRlU3RyaW5nKHZpZXcsIDAsICdSSUZGJyk7XG4gIC8qIFJJRkYgY2h1bmsgbGVuZ3RoICovXG4gIHZpZXcuc2V0VWludDMyKDQsIDM2ICsgc2FtcGxlcy5sZW5ndGggKiAyLCB0cnVlKTtcbiAgLyogUklGRiB0eXBlICovXG4gIHRoaXMud3JpdGVTdHJpbmcodmlldywgOCwgJ1dBVkUnKTtcbiAgLyogZm9ybWF0IGNodW5rIGlkZW50aWZpZXIgKi9cbiAgdGhpcy53cml0ZVN0cmluZyh2aWV3LCAxMiwgJ2ZtdCAnKTtcbiAgLyogZm9ybWF0IGNodW5rIGxlbmd0aCAqL1xuICB2aWV3LnNldFVpbnQzMigxNiwgMTYsIHRydWUpO1xuICAvKiBzYW1wbGUgZm9ybWF0IChyYXcpICovXG4gIHZpZXcuc2V0VWludDE2KDIwLCAxLCB0cnVlKTtcbiAgLyogY2hhbm5lbCBjb3VudCAqL1xuICB2aWV3LnNldFVpbnQxNigyMiwgbnVtQ2hhbm5lbHMsIHRydWUpO1xuICAvKiBzYW1wbGUgcmF0ZSAqL1xuICB2aWV3LnNldFVpbnQzMigyNCwgc2FtcGxlUmF0ZSwgdHJ1ZSk7XG4gIC8qIGJ5dGUgcmF0ZSAoc2FtcGxlIHJhdGUgKiBibG9jayBhbGlnbikgKi9cbiAgdmlldy5zZXRVaW50MzIoMjgsIHNhbXBsZVJhdGUgKiA0LCB0cnVlKTtcbiAgLyogYmxvY2sgYWxpZ24gKGNoYW5uZWwgY291bnQgKiBieXRlcyBwZXIgc2FtcGxlKSAqL1xuICB2aWV3LnNldFVpbnQxNigzMiwgbnVtQ2hhbm5lbHMgKiAyLCB0cnVlKTtcbiAgLyogYml0cyBwZXIgc2FtcGxlICovXG4gIHZpZXcuc2V0VWludDE2KDM0LCAxNiwgdHJ1ZSk7XG4gIC8qIGRhdGEgY2h1bmsgaWRlbnRpZmllciAqL1xuICB0aGlzLndyaXRlU3RyaW5nKHZpZXcsIDM2LCAnZGF0YScpO1xuICAvKiBkYXRhIGNodW5rIGxlbmd0aCAqL1xuICB2aWV3LnNldFVpbnQzMig0MCwgc2FtcGxlcy5sZW5ndGggKiAyLCB0cnVlKTtcblxuICB0aGlzLmZsb2F0VG8xNkJpdFBDTSh2aWV3LCA0NCwgc2FtcGxlcyk7XG5cbiAgcmV0dXJuIHZpZXc7XG59XG5cbk1pY3JvcGhvbmUucHJvdG90eXBlLndyaXRlU3RyaW5nID0gZnVuY3Rpb24odmlldywgb2Zmc2V0LCBzdHJpbmcpe1xuICBmb3IgKHZhciBpID0gMDsgaSA8IHN0cmluZy5sZW5ndGg7IGkrKyl7XG4gICAgdmlldy5zZXRVaW50OChvZmZzZXQgKyBpLCBzdHJpbmcuY2hhckNvZGVBdChpKSk7XG4gIH1cbn1cblxuTWljcm9waG9uZS5wcm90b3R5cGUuZmxvYXRUbzE2Qml0UENNID0gZnVuY3Rpb24ob3V0cHV0LCBvZmZzZXQsIGlucHV0KXtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBpbnB1dC5sZW5ndGg7IGkrKywgb2Zmc2V0Kz0yKXtcbiAgICB2YXIgcyA9IE1hdGgubWF4KC0xLCBNYXRoLm1pbigxLCBpbnB1dFtpXSkpO1xuICAgIG91dHB1dC5zZXRJbnQxNihvZmZzZXQsIHMgPCAwID8gcyAqIDB4ODAwMCA6IHMgKiAweDdGRkYsIHRydWUpO1xuICB9XG59XG4iLCIvKipcbiAqIENvcHlyaWdodCAyMDE1IElCTSBDb3JwLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiAgICAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKi9cblxuJ3VzZSBzdHJpY3QnO1xudmFyIFN0cmVhbSA9IHJlcXVpcmUoJ3N0cmVhbScpO1xudmFyIHV0aWwgPSByZXF1aXJlKCd1dGlsJyk7XG52YXIgZGVmYXVsdHMgPSByZXF1aXJlKCdsb2Rhc2gvZGVmYXVsdHMnKTtcbnZhciBwaWNrID0gcmVxdWlyZSgnbG9kYXNoL3BpY2snKTtcbnZhciBNaWNyb3Bob25lID0gcmVxdWlyZSgnLi9taWNyb3Bob25lJyk7XG52YXIgcXMgPSByZXF1aXJlKCdxdWVyeXN0cmluZycpO1xudmFyIFJlY29nbml6ZVN0cmVhbSA9IHJlcXVpcmUoJ3dhdHNvbi1kZXZlbG9wZXItY2xvdWQvc2VydmljZXMvc3BlZWNoX3RvX3RleHQvcmVjb2duaXplX3N0cmVhbScpO1xudmFyIGdldFVzZXJNZWRpYSA9IHJlcXVpcmUoJ2dldHVzZXJtZWRpYScpO1xudmFyIE1pY1N0cmVhbSA9IHJlcXVpcmUoJy4vbWljcm9waG9uZS1zdHJlYW0nKTtcblxuXG52YXIgUEFSQU1TX0FMTE9XRUQgPSBbJ2NvbnRpbnVvdXMnLCAnbWF4X2FsdGVybmF0aXZlcycsICd0aW1lc3RhbXBzJywgJ3dvcmRfY29uZmlkZW5jZScsICdpbmFjdGl2aXR5X3RpbWVvdXQnLFxuICAgICdtb2RlbCcsICdjb250ZW50LXR5cGUnLCAnaW50ZXJpbV9yZXN1bHRzJywgJ2tleXdvcmRzJywgJ2tleXdvcmRzX3RocmVzaG9sZCcsICd3b3JkX2FsdGVybmF0aXZlc190aHJlc2hvbGQnIF07XG5cbi8qKlxuICogSUJNIFdhdHNvbiBTcGVlY2ggdG8gVGV4dCBjbGllbnRcbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gb3B0cyBvcHRpb25zXG4gKiBAcGFyYW0ge1N0cmluZ30gb3B0cy50b2tlbiBBdXRoIFRva2VuIGZvciBTVFQgc2VydmljZS4gTXVzdCBiZSBnZW5lcmF0ZWQgc2VydmVyLXNpZGUuXG4gKiBAcGFyYW0ge0RPTUVsZW1lbnR9IFtvcHRzLmZpbGVdIE9wdGlvbmFsIEZpbGUgSW5wdXQgRE9NIEVsZW1lbnQgLSBxaWxsIGNhdXNlICNzdGFydCgpIHRvIHVwbG9hZCB0aGUgZmlsZSBpbnN0ZWFkIG9mIHJlcXVlc3QgbWljcm9waG9uZSBwZXJtaXNzaW9uXG4gKiBAcGFyYW0ge0Jvb2xlYW59IFtvcHRzLnBsYXlGaWxlPXRydWVdIElmIGEgZmlsZSBpcyBiZWluZyB1cGxvYWRlZCwgc2hvdWxkIHdlIGFsc28gcGxheSBpdCB0aHJvdWdoIHRoZSBzcGVha2Vycz9cbiAqIEBjb25zdHJ1Y3RvclxuICovXG5mdW5jdGlvbiBXYXRzb25TcGVlY2hUb1RleHQob3B0cykge1xuICAgIFN0cmVhbS5SZWFkYWJsZS5jYWxsKHRoaXMpO1xuXG4gICAgb3B0cyA9IGRlZmF1bHRzKG9wdHMsIHtcbiAgICAgICAgYnVmZmVyU2l6ZTogODE5MixcbiAgICAgICAgbW9kZWw6ICdlbi1VU19Ccm9hZGJhbmRNb2RlbCcsXG4gICAgICAgIGZpbGU6IG51bGwsXG4gICAgICAgIHVybDogXCJodHRwczovL3N0cmVhbS53YXRzb25wbGF0Zm9ybS5uZXQvc3BlZWNoLXRvLXRleHQvYXBpXCJcbiAgICB9KTtcbiAgICBpZiAoIW9wdHMudG9rZW4pIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiV2F0c29uU3BlZWNoVG9UZXh0OiBtaXNzaW5nIHJlcXVpcmVkIHBhcmFtZXRlcjogb3B0cy50b2tlblwiKTtcbiAgICB9XG5cbiAgICB2YXIgc2VsZiA9IHRoaXM7XG5cbiAgICAvKipcbiAgICAgKiBAZXZlbnQgUmVjb2duaXplU3RyZWFtI2Vycm9yXG4gICAgICovXG4gICAgZnVuY3Rpb24gZW1pdEVycm9yKG1zZywgZnJhbWUsIGVycikge1xuICAgICAgICBpZiAoZXJyKSB7XG4gICAgICAgICAgICBlcnIubWVzc2FnZSA9IG1zZyArICcgJyArIGVyci5tZXNzYWdlO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZXJyID0gbmV3IEVycm9yKG1zZyk7XG4gICAgICAgIH1cbiAgICAgICAgZXJyLnJhdyA9IGZyYW1lO1xuICAgICAgICBzZWxmLmVtaXQoJ2Vycm9yJywgZXJyKTtcbiAgICB9XG5cbiAgICB2YXIgcmVjb2duaXplU3RyZWFtO1xuXG4gICAgdmFyIG1pY3JvcGhvbmVTdHJlYW07XG5cbiAgICBmdW5jdGlvbiBoYW5kbGVNaWNyb3Bob25lKGNhbGxiYWNrKSB7XG4gICAgICAgIGlmIChvcHRzLm1vZGVsLmluZGV4T2YoJ05hcnJvd2JhbmQnKSA+IC0xKSB7XG4gICAgICAgICAgICB2YXIgZXJyID0gbmV3IEVycm9yKCdNaWNyb3Bob25lIHRyYW5zY3JpcHRpb24gY2Fubm90IGFjY29tb2RhdGUgbmFycm93YmFuZCBtb2RlbHMsICcrXG4gICAgICAgICAgICAgICAgJ3BsZWFzZSBzZWxlY3QgYW5vdGhlcicpO1xuICAgICAgICAgICAgY2FsbGJhY2soZXJyLCBudWxsKTtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuXG5cbiAgICAgICAgdmFyIG9wdGlvbnMgPSB7XG4gICAgICAgICAgICB0b2tlbjogb3B0cy50b2tlbixcbiAgICAgICAgICAgIG1vZGVsOiBvcHRzLm1vZGVsLFxuICAgICAgICAgICAgdXJsOiBvcHRzLnVybCxcbiAgICAgICAgICAgICdjb250ZW50LXR5cGUnOiAnYXVkaW8vbDE2O3JhdGU9MTYwMDAnLFxuICAgICAgICAgICAgJ2ludGVyaW1fcmVzdWx0cyc6IHRydWUsXG4gICAgICAgICAgICAnY29udGludW91cyc6IHRydWUsXG4gICAgICAgICAgICAnd29yZF9jb25maWRlbmNlJzogdHJ1ZSxcbiAgICAgICAgICAgICd0aW1lc3RhbXBzJzogdHJ1ZSxcbiAgICAgICAgICAgICdtYXhfYWx0ZXJuYXRpdmVzJzogMyxcbiAgICAgICAgICAgICdpbmFjdGl2aXR5X3RpbWVvdXQnOiA2MDBcbiAgICAgICAgfTtcblxuICAgICAgICByZWNvZ25pemVTdHJlYW0gPSBuZXcgUmVjb2duaXplU3RyZWFtKG9wdGlvbnMpO1xuXG4gICAgICAgIHJlY29nbml6ZVN0cmVhbS5zZXRFbmNvZGluZygndXRmOCcpOyAvLyB0byBnZXQgc3RyaW5ncyBpbnN0ZWFkIG9mIEJ1ZmZlcnMgZnJvbSBgZGF0YWAgZXZlbnRzXG5cbiAgICAgICAgWydkYXRhJywgJ3Jlc3VsdHMnLCAnY29ubmVjdGlvbi1jbG9zZSddLmZvckVhY2goZnVuY3Rpb24oZXZlbnROYW1lKSB7XG4gICAgICAgICAgICByZWNvZ25pemVTdHJlYW0ub24oZXZlbnROYW1lLCBjb25zb2xlLmxvZy5iaW5kKGNvbnNvbGUsIGV2ZW50TmFtZSArICcgZXZlbnQ6ICcpKTtcbiAgICAgICAgfSk7XG4gICAgICAgIHJlY29nbml6ZVN0cmVhbS5vbignZXJyb3InLCBmdW5jdGlvbihlKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhlLm1lc3NhZ2UsIGUuc3RhY2spO1xuICAgICAgICB9KTtcblxuICAgICAgICBnZXRVc2VyTWVkaWEoeyB2aWRlbzogZmFsc2UsIGF1ZGlvOiB0cnVlIH0sIGZ1bmN0aW9uKGVyciwgc3RyZWFtKSB7XG4gICAgICAgICAgICBtaWNyb3Bob25lU3RyZWFtID0gbmV3IE1pY1N0cmVhbShzdHJlYW0sIHtidWZmZXJTaXplOiBvcHRzLmJ1ZmZlclNpemV9KTtcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgbWljcm9waG9uZVN0cmVhbS5waXBlKHJlY29nbml6ZVN0cmVhbSk7XG4gICAgICAgICAgICB9IGNhdGNoKGV4KSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coZXgubWVzc2FnZSwgZXguc3RhY2spXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfSk7XG5cbiAgICAgICAgcmVjb2duaXplU3RyZWFtLm9uKCdyZXN1bHRzJywgc2VsZi5lbWl0LmJpbmQoc2VsZiwgJ3Jlc3VsdHMnKSlcbiAgICAgICAgcmVjb2duaXplU3RyZWFtLm9uKCdkYXRhJywgZnVuY3Rpb24oY2h1bmspIHtcbiAgICAgICAgICAgIHNlbGYucHVzaChjaHVuayk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIHZhciBydW5uaW5nID0gZmFsc2U7XG4gICAgZnVuY3Rpb24gaGFuZGxlRmlsZVVwbG9hZChmaWxlKSB7XG4gICAgICAgIHJ1bm5pbmcgPSB0cnVlO1xuICAgICAgICBzZWxmLm9uKCdoYXJkc29ja2V0c3RvcCcsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgcnVubmluZyA9IGZhbHNlO1xuICAgICAgICB9KTtcblxuICAgICAgICAvLyBSZWFkIGZpcnN0IDQgYnl0ZXMgdG8gZGV0ZXJtaW5lIGhlYWRlclxuICAgICAgICB2YXIgYmxvYlRvVGV4dCA9IG5ldyBCbG9iKFtmaWxlXSkuc2xpY2UoMCwgNCk7XG4gICAgICAgIHZhciByID0gbmV3IEZpbGVSZWFkZXIoKTtcbiAgICAgICAgci5yZWFkQXNUZXh0KGJsb2JUb1RleHQpO1xuICAgICAgICByLm9ubG9hZCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdmFyIGNvbnRlbnRUeXBlLCBhdWRpbztcbiAgICAgICAgICAgIGlmIChyLnJlc3VsdCA9PT0gJ2ZMYUMnKSB7XG4gICAgICAgICAgICAgICAgY29udGVudFR5cGUgPSAnYXVkaW8vZmxhYyc7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ05vdGljZTogYnJvd3NlcnMgZG8gbm90IHN1cHBvcnQgcGxheWluZyBGTEFDIGF1ZGlvLCBzbyBubyBhdWRpbyB3aWxsIGFjY29tcGFueSB0aGUgdHJhbnNjcmlwdGlvbicpO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChyLnJlc3VsdCA9PT0gJ1JJRkYnKSB7XG4gICAgICAgICAgICAgICAgY29udGVudFR5cGUgPSAnYXVkaW8vd2F2JztcbiAgICAgICAgICAgICAgICBhdWRpbyA9IG5ldyBBdWRpbygpO1xuICAgICAgICAgICAgICAgIGF1ZGlvLnNyYyA9IFVSTC5jcmVhdGVPYmplY3RVUkwobmV3IEJsb2IoW2ZpbGVdLCB7dHlwZTogJ2F1ZGlvL3dhdid9KSk7XG4gICAgICAgICAgICAgICAgYXVkaW8ucGxheSgpO1xuICAgICAgICAgICAgICAgIHNlbGYub24oJ2hhcmRzb2NrZXRzdG9wJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgIGF1ZGlvLnBhdXNlKCk7XG4gICAgICAgICAgICAgICAgICAgIGF1ZGlvLmN1cnJlbnRUaW1lID0gMDtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoci5yZXN1bHQgPT09ICdPZ2dTJykge1xuICAgICAgICAgICAgICAgIGNvbnRlbnRUeXBlID0gJ2F1ZGlvL29nZzsgY29kZWNzPW9wdXMnO1xuICAgICAgICAgICAgICAgIGF1ZGlvID0gbmV3IEF1ZGlvKCk7XG4gICAgICAgICAgICAgICAgYXVkaW8uc3JjID0gVVJMLmNyZWF0ZU9iamVjdFVSTChuZXcgQmxvYihbZmlsZV0sIHt0eXBlOiAnYXVkaW8vb2dnOyBjb2RlY3M9b3B1cyd9KSk7XG4gICAgICAgICAgICAgICAgYXVkaW8ucGxheSgpO1xuICAgICAgICAgICAgICAgIHNlbGYub24oJ2hhcmRzb2NrZXRzdG9wJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgIGF1ZGlvLnBhdXNlKCk7XG4gICAgICAgICAgICAgICAgICAgIGF1ZGlvLmN1cnJlbnRUaW1lID0gMDtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ2hlYWRlcicsIHIucmVzdWx0LnRvU3RyaW5nKCkpO1xuICAgICAgICAgICAgICAgIGVtaXRFcnJvcignT25seSBXQVYgb3IgRkxBQyBvciBPcHVzIGZpbGVzIGNhbiBiZSB0cmFuc2NyaWJlZCwgcGxlYXNlIHRyeSBhbm90aGVyIGZpbGUgZm9ybWF0Jyk7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBmdW5jdGlvbiBmaWxlQmxvY2soX29mZnNldCwgbGVuZ3RoLCBfZmlsZSwgcmVhZENodW5rKSB7XG4gICAgICAgICAgICAgICAgdmFyIHIgPSBuZXcgRmlsZVJlYWRlcigpO1xuICAgICAgICAgICAgICAgIHZhciBibG9iID0gX2ZpbGUuc2xpY2UoX29mZnNldCwgbGVuZ3RoICsgX29mZnNldCk7XG4gICAgICAgICAgICAgICAgci5vbmxvYWQgPSByZWFkQ2h1bms7XG4gICAgICAgICAgICAgICAgci5yZWFkQXNBcnJheUJ1ZmZlcihibG9iKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgZnVuY3Rpb24gb25GaWxlUHJvZ3Jlc3Mob3B0aW9ucywgb25kYXRhLCBydW5uaW5nLCBvbmVycm9yLCBvbmVuZCwgc2FtcGxpbmdSYXRlKSB7XG4gICAgICAgICAgICAgICAgdmFyIGZpbGUgICAgICAgPSBvcHRpb25zLmZpbGU7XG4gICAgICAgICAgICAgICAgdmFyIGZpbGVTaXplICAgPSBmaWxlLnNpemU7XG4gICAgICAgICAgICAgICAgdmFyIGNodW5rU2l6ZSAgPSBvcHRpb25zLmJ1ZmZlclNpemUgfHwgMTYwMDA7ICAvLyBpbiBieXRlc1xuICAgICAgICAgICAgICAgIHZhciBvZmZzZXQgICAgID0gMDtcbiAgICAgICAgICAgICAgICB2YXIgcmVhZENodW5rID0gZnVuY3Rpb24oZXZ0KSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChvZmZzZXQgPj0gZmlsZVNpemUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdEb25lIHJlYWRpbmcgZmlsZScpO1xuICAgICAgICAgICAgICAgICAgICAgICAgb25lbmQoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBpZighcnVubmluZygpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgaWYgKGV2dC50YXJnZXQuZXJyb3IgPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGJ1ZmZlciA9IGV2dC50YXJnZXQucmVzdWx0O1xuICAgICAgICAgICAgICAgICAgICAgICAgb2Zmc2V0ICs9IGJ1ZmZlci5ieXRlTGVuZ3RoO1xuICAgICAgICAgICAgICAgICAgICAgICAgLy9jb25zb2xlLmxvZygnc2VuZGluZzogJyArIGxlbik7XG4gICAgICAgICAgICAgICAgICAgICAgICBvbmRhdGEoYnVmZmVyKTsgLy8gY2FsbGJhY2sgZm9yIGhhbmRsaW5nIHJlYWQgY2h1bmtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBlcnJvck1lc3NhZ2UgPSBldnQudGFyZ2V0LmVycm9yO1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ1JlYWQgZXJyb3I6ICcgKyBlcnJvck1lc3NhZ2UpO1xuICAgICAgICAgICAgICAgICAgICAgICAgb25lcnJvcihlcnJvck1lc3NhZ2UpO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIC8vIHVzZSB0aGlzIHRpbWVvdXQgdG8gcGFjZSB0aGUgZGF0YSB1cGxvYWQgZm9yIHRoZSBwbGF5U2FtcGxlIGNhc2UsXG4gICAgICAgICAgICAgICAgICAgIC8vIHRoZSBpZGVhIGlzIHRoYXQgdGhlIGh5cHMgZG8gbm90IGFycml2ZSBiZWZvcmUgdGhlIGF1ZGlvIGlzIHBsYXllZCBiYWNrXG4gICAgICAgICAgICAgICAgICAgIC8vIHRvZG86IHVwbG9hZCB0aGUgZmlsZSBhdCBmdWxsLXNwZWVkIGFuZCBpbnN0ZWFkIHVzZSB0aGUgd29yZCB0aW1pbmdzIHRvIGNvbnRyb2wgd2hlbiB0aGV5IGFwcGVhclxuICAgICAgICAgICAgICAgICAgICBpZiAoc2FtcGxpbmdSYXRlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZygnc2FtcGxpbmdSYXRlOiAnICtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vICBzYW1wbGluZ1JhdGUgKyAnIHRpbWVvdXQ6ICcgKyAoY2h1bmtTaXplICogMTAwMCkgLyAoc2FtcGxpbmdSYXRlICogMikpO1xuICAgICAgICAgICAgICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmaWxlQmxvY2sob2Zmc2V0LCBjaHVua1NpemUsIGZpbGUsIHJlYWRDaHVuayk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9LCAoY2h1bmtTaXplICogMTAwMCkgLyAoc2FtcGxpbmdSYXRlICogMikpO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgZmlsZUJsb2NrKG9mZnNldCwgY2h1bmtTaXplLCBmaWxlLCByZWFkQ2h1bmspO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICBmaWxlQmxvY2sob2Zmc2V0LCBjaHVua1NpemUsIGZpbGUsIHJlYWRDaHVuayk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGZ1bmN0aW9uIGNhbGxiYWNrKHNvY2tldCkge1xuICAgICAgICAgICAgICAgIHZhciBibG9iID0gbmV3IEJsb2IoW2ZpbGVdKTtcbiAgICAgICAgICAgICAgICB2YXIgcGFyc2VPcHRpb25zID0ge1xuICAgICAgICAgICAgICAgICAgICBmaWxlOiBibG9iXG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICBvbkZpbGVQcm9ncmVzcyhwYXJzZU9wdGlvbnMsXG4gICAgICAgICAgICAgICAgICAgIC8vIE9uIGRhdGEgY2h1bmtcbiAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24gb25EYXRhKGNodW5rKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzb2NrZXQuc2VuZChjaHVuayk7XG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uIGlzUnVubmluZygpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmKHJ1bm5pbmcpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAvLyBPbiBmaWxlIHJlYWQgZXJyb3JcbiAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24oZXZ0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnRXJyb3IgcmVhZGluZyBmaWxlOiAnLCBldnQubWVzc2FnZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBlbWl0RXJyb3IoZXZ0Lm1lc3NhZ2UpO1xuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAvLyBPbiBsb2FkIGVuZFxuICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJ1bm5pbmcgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNvY2tldC5zZW5kKEpTT04uc3RyaW5naWZ5KHsnYWN0aW9uJzogJ3N0b3AnfSkpO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGZ1bmN0aW9uIG9uZW5kKCkge1xuXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHNlbGYub24oJ3Byb2dyZXNzJywgZnVuY3Rpb24oZXZ0LCBkYXRhKSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ3Byb2dyZXNzOiAnLCBkYXRhKTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBjb25zb2xlLmxvZygnY29udGVudFR5cGUnLCBjb250ZW50VHlwZSk7XG5cbiAgICAgICAgICAgIHZhciBvcHRpb25zID0ge1xuICAgICAgICAgICAgICAgIHRva2VuOiBvcHRzLnRva2VuLFxuICAgICAgICAgICAgICAgIG1vZGVsOiBvcHRzLm1vZGVsXG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgb3B0aW9ucy5tZXNzYWdlID0gZGVmYXVsdHMocGljayhvcHRzLCBQQVJBTVNfQUxMT1dFRCksIHtcbiAgICAgICAgICAgICAgICAnYWN0aW9uJzogJ3N0YXJ0JyxcbiAgICAgICAgICAgICAgICAnY29udGVudC10eXBlJzogY29udGVudFR5cGUsXG4gICAgICAgICAgICAgICAgJ2ludGVyaW1fcmVzdWx0cyc6IHRydWUsXG4gICAgICAgICAgICAgICAgJ2NvbnRpbnVvdXMnOiB0cnVlLFxuICAgICAgICAgICAgICAgICd3b3JkX2NvbmZpZGVuY2UnOiB0cnVlLFxuICAgICAgICAgICAgICAgICd0aW1lc3RhbXBzJzogdHJ1ZSxcbiAgICAgICAgICAgICAgICAnbWF4X2FsdGVybmF0aXZlcyc6IDMsXG4gICAgICAgICAgICAgICAgJ2luYWN0aXZpdHlfdGltZW91dCc6IDYwMFxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIGZ1bmN0aW9uIG9uT3BlbigpIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnU29ja2V0IG9wZW5lZCcpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBmdW5jdGlvbiBvbkxpc3RlbmluZyhzb2NrZXQpIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnU29ja2V0IGxpc3RlbmluZycpO1xuICAgICAgICAgICAgICAgIGNhbGxiYWNrKHNvY2tldCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGZ1bmN0aW9uIG9uTWVzc2FnZShtc2cpIHtcblxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBmdW5jdGlvbiBvbkVycm9yKGV2dCkge1xuICAgICAgICAgICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKCdjdXJyZW50bHlEaXNwbGF5aW5nJywgJ2ZhbHNlJyk7XG4gICAgICAgICAgICAgICAgb25lbmQoZXZ0KTtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnU29ja2V0IGVycjogJywgZXZ0LmNvZGUpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBmdW5jdGlvbiBvbkNsb3NlKGV2dCkge1xuICAgICAgICAgICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKCdjdXJyZW50bHlEaXNwbGF5aW5nJywgJ2ZhbHNlJyk7XG4gICAgICAgICAgICAgICAgb25lbmQoZXZ0KTtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnU29ja2V0IGNsb3Npbmc6ICcsIGV2dCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGluaXRTb2NrZXQob3B0aW9ucywgb25PcGVuLCBvbkxpc3RlbmluZywgb25NZXNzYWdlLCBvbkVycm9yLCBvbkNsb3NlKTtcbiAgICAgICAgfTtcbiAgICB9XG5cblxuICAgIHRoaXMuc3RhcnQgPSBmdW5jdGlvbiBzdGFydCgpIHtcbiAgICAgICAgaWYgKG9wdHMuZmlsZSkge1xuICAgICAgICAgICAgaGFuZGxlRmlsZVVwbG9hZChvcHRzLmZpbGUpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaGFuZGxlTWljcm9waG9uZShmdW5jdGlvbihlcnIpIHtcbiAgICAgICAgICAgICAgICBpZiAoZXJyKSB7XG4gICAgICAgICAgICAgICAgICAgIHNlbGYuZW1pdCgnZXJyb3InLCBlcnIpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIG1pY3JvcGhvbmVTdHJlYW0ucmVjb3JkKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9O1xuXG4gICAgdGhpcy5zdG9wID0gZnVuY3Rpb24gc3RvcCgpIHtcbiAgICAgICAgY29uc29sZS5sb2coJ3N0b3BwaW5nJyk7XG4gICAgICAgIG1pY3JvcGhvbmVTdHJlYW0uc3RvcCgpO1xuICAgIH07XG59XG51dGlsLmluaGVyaXRzKFdhdHNvblNwZWVjaFRvVGV4dCwgU3RyZWFtLlJlYWRhYmxlKTtcblxuV2F0c29uU3BlZWNoVG9UZXh0LnByb3RvdHlwZS5fcmVhZCA9IGZ1bmN0aW9uKCkge307IC8vIGZsb3cgY29udHJvbCBpcyBub3QgaW1wbGVtZW50ZWQsIGF0IGxlYXN0IG5vdCBhdCB0aGlzIGxldmVsXG5cblxubW9kdWxlLmV4cG9ydHMgPSBXYXRzb25TcGVlY2hUb1RleHQ7XG4iXX0=
