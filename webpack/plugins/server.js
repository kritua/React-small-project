const DaemonCommandPlugin = require('daemon-command-webpack-plugin');
const CompressionPlugin   = require("compression-webpack-plugin");

const common = require('./common');

const config = {
    development : [
        ...common,
        new DaemonCommandPlugin('start:dev', {
            manager: 'npm',
            marker : true
        })
    ],
    production  : [
        ...common,
        new CompressionPlugin({
            test     : /\.(png|xml|webapp)$/,
            algorithm: "gzip",
            minRatio : 0
        }),
    ]
};

module.exports = config[global.webpack.env];
