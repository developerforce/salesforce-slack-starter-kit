const { whoamiCallback } = require('./whoami');

module.exports.register = (app) => {
    app.shortcut('who_am_i', whoamiCallback);
};
