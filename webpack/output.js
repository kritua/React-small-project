const { resolve } = require('path');
const config = require('./../configs/config');

const result = {
    client : {
        development : {
            path            : resolve(global.webpack.context, 'public'),
            publicPath      : `http://${config['server.host']}:${config['dev-server.port']}/`,
            chunkFilename   : '[name].js',
            filename        : '[name].js'
        },
        production  : {
            path            : resolve(global.webpack.context, 'public'),
            filename        : '[name].[chunkhash].js',
            publicPath      : '/'
        }
    },
    server : {
        development : {
            path            : resolve(global.webpack.context, 'server', 'build'),
            filename        : 'index.js',
            publicPath      : `http://${config['server.host']}:${config['dev-server.port']}/build/`,
            libraryTarget   : 'commonjs2'
        },
        production  : {
            path            : resolve(global.webpack.context, 'server', 'build'),
            filename        : 'index.js',
            publicPath      : '/build/',
            libraryTarget   : 'commonjs2'
        }
    }
};

module.exports = result[global.webpack.type][global.webpack.env];
