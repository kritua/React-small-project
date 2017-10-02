const { resolve } = require('path');

module.exports =  {
    test    : /\.jsx?$/,
    include : [
        resolve(global.webpack.context, 'app'),
        resolve(global.webpack.context, 'server'),
        resolve(global.webpack.context, 'configs'),
        /(:?dev|node)_modules\/(?:lib|booker|core)-ui__/
    ],
    exclude : [
        resolve(global.webpack.context, 'server', 'build')
    ],
    use: [{
        loader  : 'babel',
        options : {
            forceEnv      : `${global.webpack.env}:${global.webpack.type}`,
            cacheDirectory: global.webpack.development
        }
    }]
};
