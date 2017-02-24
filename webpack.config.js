// browserify output is slightly smaller, but webpack wins after minification & gzipping
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
