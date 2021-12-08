const shortcutsListener = require("./shortcuts");
const commandsListener = require("./commands");
const registerActionsListener = require("./actions");
const registerViewsListener = require("./views");

module.exports.registerListeners = (app) => {
  shortcutsListener.register(app);
  commandsListener.register(app);
  registerActionsListener.register(app);
  registerViewsListener.register(app);
};
