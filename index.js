// IBM Watson Speech JavaScript SDK
// Copyright IBM (Apache-2.0)

'use strict';

/**
 * @namespace WatsonSpeech
 */

/**
 * Version - for public releases, this should have the version number, e.g 'v1.0.0'
 */
exports.version = process.env.TRAVIS_BRANCH;

/**
 * SpeechToText
 * @type {*|exports|module.exports}
 */
exports.SpeechToText = require('./speech-to-text');

exports.TextToSpeech = require('./text-to-speech');
