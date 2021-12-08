const { searchAccountCallback } = require("./search-account");

module.exports.register = (app) => {
  app.command("/searchaccount", searchAccountCallback);
};
