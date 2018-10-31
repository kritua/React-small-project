const { resolve } = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = [
    require('./module.rules.pcss'),
    require('./module.rules.img'),
    require('./module.rules.babel'),
    {
        test    : /\.jsx?$/,
        exclude : [
            resolve(global.webpack.context, 'bin'),
            resolve(global.webpack.context, 'configs'),
            resolve(global.webpack.context, 'git-hooks'),
            resolve(global.webpack.context, 'public'),
            resolve(global.webpack.context, 'server', 'build'),
            resolve(global.webpack.context, 'webpack')
        ],
        use: [{
            loader  : 'eslint',
            options : {
                cache: global.webpack.development
            }
        }]
    }, {
        test    : /\.(webapp|ico)$/,
        include : [
            resolve(global.webpack.context, 'app', 'pages', 'html'),
        ],
        use: [{
            loader  : 'file',
            options : {
                name      : global.webpack.production ? '[hash:hex].[ext]' : '[name].[ext]',
                publicPath: (url) => url.replace('./../../public', ''),
                outputPath: (url) => `./../../public/${url}`,
                emitFile  : global.webpack.server,
            }
        }]
    }, {
        test    : /\.(png|jpe?g|gif|svg|xml|woff|woff2|eot)$/,
        include : [
            resolve(global.webpack.context, 'app', 'pages', 'html'),
            resolve(global.webpack.context, 'app', 'blocks', 'fonts')
        ],
        use: [{
            loader  : 'file',
            options : {
                name      : '[name].[ext]',
                publicPath: (url) => url.replace('./../../public', ''),
                outputPath: (url) => `./../../public/${url}`,
                emitFile  : global.webpack.server
            }
        }]
    }, {
        test    : /\.css$/,
        use: MiniCssExtractPlugin.loader
    }
];
