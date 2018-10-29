const { resolve } = require('path');

module.exports = {
    test    : /\.jsx?$/,
        include : [
        resolve(global.webpack.context, 'app'),
        resolve(global.webpack.context, 'server'),
        resolve(global.webpack.context, 'configs')
    ],
        exclude : resolve(global.webpack.context, 'server', 'build'),
        use: {
        loader: 'babel',
            options: {
            presets: [
                ['@babel/preset-env', {
                    targets: global.webpack.client ? { browsers: 'last 2 versions' } : { node: '6' }
                }],
                '@babel/preset-react'
            ],
                plugins: [
                ['@babel/plugin-proposal-decorators', { legacy: true }],
                ['@babel/plugin-proposal-class-properties', { loose: true }],
                ['@babel/plugin-proposal-object-rest-spread']
            ]
        }
    }
};
