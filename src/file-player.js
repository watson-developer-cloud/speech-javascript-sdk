function getContentType(file) {
    return new Promise(function(resolve, reject) {
        var blobToText = new Blob([file]).slice(0, 4);
        var r = new FileReader();
        r.readAsText(blobToText);
        r.onload = function() {
            if (r.result === 'fLaC') {
                resolve('audio/flac');
            } else if (r.result === 'RIFF') {
                resolve('audio/wav');
            } else if (r.result === 'OggS') {
                resolve('audio/ogg; codecs=opus');
            } else {
                reject(new Error('Unable to determine content type from file header; only wav, flac, and ogg/opus are supported.'))
            }
        };
    });
}

function FilePlayer(file, contentType) {
    var output = new Audio();
    if (output.canPlayType(contentType)) {
        output.src = URL.createObjectURL(new Blob([file], {type: contentType}));
        output.play();
    } else {
        // if we emit an error, it prevents the promise from returning the actual result
        // however, most browsers do not support flac, so this is a reasonably scenario
        throw new Error('Current browser is unable to play back ' + contentType);
    }
    this.stop = function stop() {
        output.pause();
        output.currentTime = 0;
    }
}

function playFile(file) {
    return getContentType(file).then(function(contentType) {
        return new FilePlayer(file, contentType);
    });
}

module.exports = FilePlayer;
module.exports.getContentType = getContentType;
module.exports.playFile = playFile;
