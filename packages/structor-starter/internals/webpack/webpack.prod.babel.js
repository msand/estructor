// Important modules this config uses
const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = require('./webpack.base.babel')({
	// In production, we skip all hot-reloading stuff
	entry: [
		path.join(process.cwd(), 'app/index.js'),
	],

	// Utilize long-term caching by adding content hashes (not compilation hashes) to compiled assets
	output: {
		filename: '[name].[chunkhash].js',
		chunkFilename: '[name].[chunkhash].chunk.js',
	},

	babelQuery: {
		presets: [
			[
				'es2015',
				{
					modules: false
				}
			],
			'react',
			'stage-0',
		]
	},

	plugins: [
		new webpack.optimize.CommonsChunkPlugin({
			name: 'vendor',
			children: true,
			minChunks: 2,
			async: true,
		}),

		// Minify and optimize the index.html
		new HtmlWebpackPlugin({
			template: 'app/index.html',
			minify: {
				removeComments: true,
				collapseWhitespace: true,
				removeRedundantAttributes: true,
				useShortDoctype: true,
				removeEmptyAttributes: true,
				removeStyleLinkTypeAttributes: true,
				keepClosingSlash: true,
				minifyJS: true,
				minifyCSS: true,
				minifyURLs: true,
			},
			inject: true,
		}),
	],
});
