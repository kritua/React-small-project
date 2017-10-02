const { resolve } = require('path');

module.exports = {
    modules : [
        resolve(global.webpack.context, 'app'),
        resolve(global.webpack.context, 'dev_modules'),
        'node_modules'
    ],
    alias : {
        app     : resolve(global.webpack.context, 'app'),
        block   : resolve(global.webpack.context, 'app', 'blocks'),
        page    : resolve(global.webpack.context, 'app', 'pages'),
        config  : resolve(global.webpack.context, 'configs', 'config')
    },
    enforceExtension : false,
    extensions : [
        '.js',
        '.pcss',
        '.json',
        '.jsx'
    ]
};
