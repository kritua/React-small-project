const externals = require('webpack-node-externals');

const common = {
    server : [
        externals({
            whitelist: /(lib|booker|core)-ui__[a-zA-Z0-9-_\/.]+/
        }),
        '/etc/mob-bet-ru.json'
    ]
};

const config = {
    client : {
        development : '',
        production  : ''
    },
    server : {
        development : common.server,
        production  : common.server
    }
};

module.exports = config[global.webpack.type][global.webpack.env];
