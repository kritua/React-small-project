const { resolve } = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const browsers = [
    'Chrome >= 50',
    'Firefox >= 50',
    'Opera >= 40'
];

const use = [{
    loader: global.webpack.development ? 'style' : MiniCssExtractPlugin.loader
}, {
    loader : global.webpack.client ? 'css' : 'css/locals',
    options: {
        context         : global.webpack.context,
        modules         : true,
        sourceMap       : global.webpack.development,
        minimize        : global.webpack.production,
        localIdentName  : global.webpack.production ? '[hash:hex]' : '[local]-[hash:hex:5]'
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
            require('stylelint')({
                ignoreFiles: resolve(global.webpack.context, 'blocks/bootstrap/**/*.css'),
                configBasedir: global.webpack.context
            }),
            require('postcss-nested'),
            require('autoprefixer')({ browsers })
        ]
    }
}];

if(global.webpack.server) {
    delete use.shift();
}

module.exports = {
    test: /\.pcss$/,
    use: use,
};
