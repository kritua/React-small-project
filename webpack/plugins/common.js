const webpack               = require('webpack');
const ThemePlugin           = require('theme-webpack-plugin');
const ExtractTextPlugin     = require('extract-text-webpack-plugin');

module.exports = [
    new ThemePlugin(/((booker|lib|core)+-ui__[\w_-]+)\/?/g, ['betslip', 'mobile']),
    new webpack.DefinePlugin({
        __CLIENT__              : global.webpack.client,
        __SERVER__              : global.webpack.server,
        __PRODUCTION__          : global.webpack.production,
        __DEVELOPMENT__         : global.webpack.development,
        'process.env.NODE_ENV'  : JSON.stringify(global.webpack.env),
        'process.env.CONFIG'    : JSON.stringify(global.webpack.config)
    }),
    new ExtractTextPlugin({
        filename : '[contenthash].css',
        allChunks   : global.webpack.client,
        disable     : global.webpack.server || global.webpack.development
    })
];
