const path                  = require('path');
const webpack               = require('webpack');
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
        new webpack.NamedChunksPlugin((chunk) => {
            if (chunk.name) {
                return chunk.name;
            }
            return chunk.modules.map(m => path.relative(m.context, m.request)).join("_");
        }),
        new webpack.optimize.CommonsChunkPlugin({
            name    : 'vendors',
            minChunks: Infinity
        }),
        new webpack.optimize.CommonsChunkPlugin({
            name: 'runtime'
        }),
        new NameAllModulesPlugin(),
        new webpack.optimize.OccurrenceOrderPlugin()
    ]
};

module.exports = config[global.webpack.env];
