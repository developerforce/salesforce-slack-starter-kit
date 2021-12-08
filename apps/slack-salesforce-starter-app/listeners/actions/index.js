const { editAccountCallback } = require("./edit-account");

module.exports.register = (app) => {
  app.action("edit_account", editAccountCallback);
};
