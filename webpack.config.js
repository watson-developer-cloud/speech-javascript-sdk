// note: this isn't used at the moment
// browserify output is slightly smaller, but they're within 1kb of eachother after minifying and gzipping
module.exports = {
  entry: './index.js',
  output: {
    path: __dirname + '/dist',
    filename: 'watson-speech.js',
    library: 'WatsonSpeech',
    libraryTarget: 'umd'
  },
  module: {
    loaders: [{ test: /index.js$/, loader: 'envify-loader' }]
  }
};
