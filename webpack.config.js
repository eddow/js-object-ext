const path = require('path'),
	//TODO importing 'typedoc-webpack-plugin' raises a lot of warnings
	typedoc = require('typedoc-webpack-plugin'),
	{default: DtsBundlePlugin} = require('webpack-dts-bundle');
module.exports = {
	context: path.resolve(__dirname, 'src'),
	entry: "./index.ts",
	mode: "development",
	output: {
		filename: "index.js",
		libraryTarget: "commonjs",
		path: path.resolve(__dirname, 'dist')
	},
	resolve: {
		extensions: [".ts", ".js"]
	},
	plugins: [
		new DtsBundlePlugin({
			name: 'js-object-ext',
			main: 'dist/index.d.ts',
			out: 'index.d.ts',
			removeSource: true
		}),
		new typedoc({
			name: 'js-object-ext',
			out: '../docs',
			mode: 'modules',
    		target: 'es6',
    		exclude: ['**/node_modules/**/*.*', '**/index.ts'],
			includeDeclarations: true
		}, './src')
	],
	module: {
		rules: [{ test: /\.ts$/, loader: "ts-loader" }]
	}
}