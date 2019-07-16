const { resolve } = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const browsers = [
    'Chrome >= 50',
    'Firefox >= 50',
    'Explorer >= 10',
    'Edge >= 12',
    'iOS >= 8',
    'Safari >= 8',
    'ExplorerMobile >= 10',
    'Opera >= 40'
];

const use = [{
    loader : 'style'
}, {
    loader : global.webpack.client ? 'css' : 'css/locals',
    options: {
        context         : global.webpack.context,
        modules         : true,
        sourceMap       : global.webpack.development,
        minimize        : global.webpack.production,
        localIdentName  : global.webpack.production ? '[hash:hex]' : '[local]'
    }
}, {
    loader : 'postcss',
    options: {
        plugins: [
            require('doiuse')({
                browsers,
                ignore: [
                    'flexbox',
                    'viewport-units',
                    'css-appearance',
                    'will-change',
                    'pointer-events',
                    'font-unicode-range',
                    'outline',
                    'css-media-resolution',
                    'object-fit',
                    '::-webkit-media-controls-start-playback-button'
                ]
            }),
            require('stylehacks')({
                browsers,
                lint     : true,
                sourcemap: true
            }),
            require('stylelint')({
                ignoreFiles: resolve(global.webpack.context, 'blocks/bootstrap/**/*.css'),
                configBasedir: global.webpack.context
            }),
            require('postcss-nested')
        ]
    }
}];

if(global.webpack.server || global.webpack.production) {
    delete use.shift();
}

module.exports = {
    test    : /\.pcss$/,
    use     : ExtractTextPlugin.extract({ use }),
    include : [
        resolve(global.webpack.context, 'app'),
        resolve(global.webpack.context, 'dev_modules'),
        resolve(global.webpack.context, 'node_modules')
    ]
};
