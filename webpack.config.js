var webpack = require("webpack"),
	path = require("path"),
	externals = require('webpack-node-externals'),
	{default: DtsBundlePlugin} = require('webpack-dts-bundle');

module.exports = {
	mode: 'development',	//This is meant to be bundled afterward anyway
	context: path.resolve(__dirname, 'src'),
	entry: {
		'js-object-ext': ['./index.ts'],
	},
	output: {
		filename: '[name].js',
		path: path.resolve(__dirname, "dist"),
		libraryTarget: 'umd',
		library: 'js-object-ext',
		umdNamedDefine: true
	},
	plugins: [
		new DtsBundlePlugin({
			name: 'js-object-ext',
			main: 'dist/index.d.ts',
			out: 'js-object-ext.d.ts',
			removeSource: true
		})
	],
	externals: [
		externals()
	],
	devtool: 'source-map',
	module: {
		rules: [{
			test: /\.ts$/,
			exclude: /node_modules/,
			loader: 'ts-loader'
		}, {
			enforce: 'pre',
			test: /\.ts$/,
			exclude: /node_modules/,
			use: "source-map-loader"
		}]
	},
	resolve: {
		extensions: [".ts", ".js"]
	}
};