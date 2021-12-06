const shortcutsListener = require('./shortcuts');
const eventsListener = require('./events');
const actionListener = require('./actions');

module.exports.registerListeners = (app) => {
    shortcutsListener.register(app);
    eventsListener.register(app);
    actionListener.register(app);
};
