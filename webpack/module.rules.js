const { resolve } = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const common = [
    require('./module.rules.pcss'),
    require('./module.rules.img'),
    require('./module.rules.babel'),
    {
        enforce : 'pre',
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
                // failOnWarning: global.webpack.production,
                // failOnError  : global.webpack.production,
                // emitError    : global.webpack.production,
                // emitWarning  : global.webpack.production,
                cache        : global.webpack.development
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
        include : [
            resolve(global.webpack.context, 'app', 'blocks', 'bootstrap'),
        ],
        use: ExtractTextPlugin.extract([/*{
            loader : 'style'
        }, */{
            loader : 'css/locals',
            options: {
                context         : global.webpack.context,
                modules         : true,
                sourceMap       : global.webpack.development,
                minimize        : global.webpack.production,
                localIdentName  : global.webpack.production ? '[hash:hex]' : '[local]'
            }
        }])
    }
];

const config = {
    client : {
        development : [
            ...common
        ],
        production  : [
            ...common
        ]
    },
    server : {
        development : [
            ...common
        ],
        production  : [
            ...common
        ]
    }
};

module.exports = config[global.webpack.type][global.webpack.env];
