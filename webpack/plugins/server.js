const DaemonCommandPlugin = require('daemon-command-webpack-plugin');
const CompressionPlugin   = require("compression-webpack-plugin");
const brotliCompress      = require('iltorb').compress;

const common = require('./common');

const config = {
    development : [
        ...common,
        new DaemonCommandPlugin('start:dev', {
            manager: 'yarn',
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
        new CompressionPlugin({
            asset    : "[path].br",
            test     : /\.(png|xml|webapp)$/,
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
