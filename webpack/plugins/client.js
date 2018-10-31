const path                  = require('path');
const webpack               = require('webpack');
const CleanPlugin           = require('clean-webpack-plugin');
const CompressionPlugin     = require("compression-webpack-plugin");
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
        new NameAllModulesPlugin(),
        new webpack.optimize.OccurrenceOrderPlugin(),
        new CompressionPlugin({
            test     : /\.(js|css|png|ttf)$/,
            algorithm: "gzip",
            minRatio : 0
        }),
    ]
};

module.exports = config[global.webpack.env];
