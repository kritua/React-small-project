let config = {};

if(typeof window === 'undefined') {
    try {
        config = require('./development.json');
    } catch(e) {
        console.error('Do you have "development" config?', e);
    }
} else {
    config = window.__config;
}

module.exports = config;
