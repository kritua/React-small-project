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
					'./app/pages/application/sass/mixins.scss',
					'./app/pages/application/sass/vars.scss'
				]
			}
		}]
	})
};
