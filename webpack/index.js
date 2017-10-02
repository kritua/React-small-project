const { resolve } = require('path');

module.exports = (env = {}) => {
    global.webpack = {
        context     : resolve(__dirname, '..'),
        dir         : __dirname,
        env         : process.env.NODE_ENV || (env.production ? 'production' : 'development'),
        type        : env.server ? 'server' : 'client',
        config      : process.env.CONFIG,
        development : !env.production,
        production  : !!env.production,
        client      : !env.server,
        server      : !!env.server
    };

    const config = {
        context         : global.webpack.context,
        entry           : require('./entry'),
        devtool         : require('./devtool'),
        target          : require('./target'),
        externals       : require('./externals'),
        output          : require('./output'),
        module          : {
            rules : require('./module.rules')
        },
        resolve         : require('./resolve'),
        resolveLoader   : require('./resolveLoader'),
        plugins         : require(`./plugins/${global.webpack.type}`),
        performance     : require('./performance'),
        bail            : global.webpack.production,
        profile         : global.webpack.production
    };

    if(global.webpack.development) {
        config.devServer = require(`./devServer`);
    }

    return config;
};
