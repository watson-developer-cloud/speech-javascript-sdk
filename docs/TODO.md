# Todo

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
