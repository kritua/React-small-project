let config = {};

if(typeof window === 'undefined') {
    if(process.env.NODE_ENV !== 'development') {
        try {
            config = require('/etc/mob-bet-ru.json');
        } catch (e) {
            console.error("Can't resolve application config:", e);
        }
    } else {
        try {
            config = require('./development.json');
        } catch(e) {
            console.error('Do you have "development" config?', e);
        }
    }
} else {
    config = window.__config;
}

module.exports = config;
