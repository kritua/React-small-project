module.exports = {
    maxAssetSize        : 500000,
    maxEntrypointSize   : 4000000,
    hints               : global.webpack.development ? false : 'warning'
};
