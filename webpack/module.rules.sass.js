const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
	test: /\.(scss|sass)$/,
	use: ExtractTextPlugin.extract({
		fallback: 'style-loader',
		use: [{
			loader: 'css-loader',
			options: {
				localIdentName: '[local]-[hash:hex:5]'
			}
		}, {
			loader: 'sass-loader'
		}, {
			loader: 'sass-resources-loader',
			options: {
				resources: [
					'./src/pages/application/sass/mixins.scss',
					'./src/pages/application/sass/vars.scss'
				]
			}
		}]
	})
};
