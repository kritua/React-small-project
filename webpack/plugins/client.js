const path                  = require('path');
const webpack               = require('webpack');
const CleanPlugin           = require('clean-webpack-plugin');
const CompressionPlugin     = require("compression-webpack-plugin");
const brotliCompress        = require('iltorb').compress;
const NameAllModulesPlugin  = require('name-all-modules-plugin');

const common = require('./common');

const base = [
    new webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, /en|ru/)
];

const config = {
    development : [
        ...common,
        ...base
    ],
    production  : [
        ...common,
        ...base,
        new webpack.NamedModulesPlugin(),
        new webpack.NamedChunksPlugin((chunk) => {
            if (chunk.name) {
                return chunk.name;
            }
            return chunk.modules.map(m => path.relative(m.context, m.request)).join("_");
        }),
        // new webpack.optimize.ModuleConcatenationPlugin(),
        new CleanPlugin([
            path.resolve(global.webpack.context, 'public')
        ], {
            verbose : global.webpack.development,
            dry     : global.webpack.production
        }),
        new webpack.optimize.CommonsChunkPlugin({
            name    : 'vendors',
            minChunks: Infinity
        }),
        new webpack.optimize.CommonsChunkPlugin({
            name: 'runtime'
        }),
        new NameAllModulesPlugin(),
        new webpack.optimize.OccurrenceOrderPlugin(),
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            },
            sourceMap: false,
            comments: (astNode, comment) => false
        }),
        new CompressionPlugin({
            test     : /\.(js|css|png|ttf)$/,
            algorithm: "gzip",
            minRatio : 0
        }),
        new CompressionPlugin({
            asset    : "[path].br",
            test     : /\.(js|css|png|ttf)$/,
            algorithm: (buffer, options, callback) => {
                brotliCompress(buffer, {
                    mode    : 0,
                    quality : 11,
                    lgwin   : 22,
                    lgblock : 0
                }, callback);
            },
            minRatio : 0
        })
    ]
};

module.exports = config[global.webpack.env];
