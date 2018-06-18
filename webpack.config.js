const path = require("path"),
    mode = require('yargs').argv.mode;

module.exports = {
    mode: 'none',
    watch: mode === 'development',
	// devtool: 'source-map',
    entry: {
        'shai': './src/index.ts',
        'validator': './src/validator.ts'
    },
    output: {
        filename: '[name].js',
        library: "[name]",
        libraryTarget: "umd",
        path: path.resolve(__dirname)
    },
    module: {
        unknownContextCritical : false,
        rules: [
            {
                test: /\.ts$/,
                exclude: /node_modules/, 
                loader: 'awesome-typescript-loader'
            }
        ]
    },
    resolve: {
		modules: [
          'node_modules', path.resolve(__dirname, '/src')
        ],
        extensions: ['.ts','.js','.json']
    }
}