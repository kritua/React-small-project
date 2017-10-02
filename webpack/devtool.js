const config = {
    client : {
        development : 'inline-source-map',
        production  : false
    },
    server : {
        development : false,
        production  : false
    }
};

module.exports = config[global.webpack.type][global.webpack.env];
