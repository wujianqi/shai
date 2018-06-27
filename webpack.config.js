const webpack = require('webpack'),
  path = require('path'),
  CleanWebpackPlugin = require('clean-webpack-plugin');
// const env = require('yargs').argv.env;

module.exports = {
  entry: {
    'shai': __dirname + '/src/index.ts',
    'validator': __dirname + '/src/jsonvalidator.ts',
    'mock': __dirname + '/src/mock.ts'
  },
  // devtool: 'source-map',
  output: {
    path: __dirname,
    filename: '[name].js',
    library: '[name]',
    libraryTarget: 'umd',
    umdNamedDefine: true
  },
  module: {
    loaders: [
      {
        test: /.ts$/,
        loader: 'awesome-typescript-loader'
      }
    ]
  },
  resolve: {
    modules: [path.resolve('./node_modules'), path.resolve('./src')],
    extensions: ['.ts', '.js']
  },
  plugins: [
    new CleanWebpackPlugin(['types/resource'])
  ]
};
