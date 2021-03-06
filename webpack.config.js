const webpack = require('webpack');
const path = require('path');

module.exports = {
  context: path.join(__dirname, 'src/scripts'),
  entry: {
    colours: './colours.js',
    options: './options.js'
  },
  output: {
    path: path.join(__dirname, 'build/scripts'),
    filename: '[name].js'
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        options: {
          babelrc: false,
          presets: [
            'babili'
          ],
          plugins: [
            'transform-class-properties',
            'syntax-jsx',
            ['inferno', { 'imports': true }]
          ]
        }
      },
      {
        test: /\.svg$/,
        loader: 'raw-loader'
      }
    ]
  },
  resolve: {
    modules: [
      path.join(__dirname, 'src/scripts'),
      'node_modules'
    ]
  },
  plugins: [
    new webpack.optimize.CommonsChunkPlugin('vendor')
  ]
};
