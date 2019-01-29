const path = require('path');

module.exports = {
  entry: {
    'shai': __dirname + '/src/index.ts',
    'validator': __dirname + '/src/validator/index.ts',
    'maker': __dirname + '/src/maker/index.ts'
  },
  // devtool: 'source-map',
  mode: 'development',
  output: {
    path: __dirname,
    filename: '[name].js',
    library: '[name]',
    libraryTarget: 'umd',
    umdNamedDefine: true,
    globalObject: "this"
  },
  module: {
    rules: [
      {
        test: /.ts$/,
        loader: 'awesome-typescript-loader'
      }
    ]
  },
  resolve: {
    modules: [path.resolve('./node_modules'), path.resolve('./src')],
    extensions: ['.ts', '.js']
  }
};
