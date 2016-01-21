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
