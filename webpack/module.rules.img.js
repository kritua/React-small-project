const { resolve } = require('path');

let exclude = [];

if(global.webpack.server) {
    exclude = resolve(global.webpack.context, 'app', 'pages', 'html');
}

module.exports =  {
    test: /\.(png|jpe?g|gif|ico|svg|ttf)$/,
    use : [{
        loader : 'url',
        options: {
            limit   : 10240,
            emitFile: global.webpack.client,
            publicPath: (url) => url.replace('./../public', ''),
            outputPath: (url) => `./../public/${url}`,
            name    : global.webpack.production ? '[hash:hex].[ext]' : '[name].[ext]'
        }
    }, {
        loader : 'img',
        options: {
            enabled: global.webpack.production,
            mozjpeg: {
                progressive: true,
                quality: 70
            },
            optipng: {
                optimizationLevel: 5
            }
        }
    }],
    exclude
};
