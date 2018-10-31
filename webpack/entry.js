const common = {
    client : ['@babel/polyfill', './app'],
    server : './server'
};

const config = {
    client : {
        development : common.client,
        production  : {
            main    : common.client,
            vendors : [
                'react',
                'react-dom',
                'history',
                'hook-fetcher',
                'hook-redux',
                'react-helmet',
                'react-redux',
                'redux-saga',
                'redux',
                'react-router-async',
                'redux-thunk',
                'core-js'
            ]
        }
    },
    server : {
        development : common.server,
        production  : common.server
    }
};

module.exports = config[global.webpack.type][global.webpack.env];
