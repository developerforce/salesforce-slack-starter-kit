const shortcutsListener = require('./shortcuts');

module.exports.registerListeners = (app) => {
    shortcutsListener.register(app);
};