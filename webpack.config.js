// browserify output is slightly smaller, but webpack wins after minification & gzipping
const webpack = require('webpack');

module.exports = {
  entry: './index.js',
  output: {
    path: __dirname + '/dist',
    filename: 'watson-speech.js',
    library: 'WatsonSpeech',
    libraryTarget: 'umd',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
      {
        test: /index.js$/,
        use: {
          loader: 'transform-loader?envify',
        }
      },
    ],
  },
  mode: 'development',
  resolve: {
    alias: {
      'stream': 'stream-browserify',
      'Buffer': 'buffer',
      'process': 'process/browser.js',
    }
  },
  plugins: [
    new webpack.ProvidePlugin({
      process: 'process/browser.js',
      Buffer: ['buffer', 'Buffer'],
    }),
  ]
};
