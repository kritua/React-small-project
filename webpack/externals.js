const nodeExternals = require('webpack-node-externals');

const common = {
    client: '',
    server: nodeExternals()
};

module.exports = common[global.webpack.type];
