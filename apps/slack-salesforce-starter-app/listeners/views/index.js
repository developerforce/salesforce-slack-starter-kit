const { updateAccountZipCallback } = require("./update-account-zip");

module.exports.register = (app) => {
  app.view("update_account_zip", updateAccountZipCallback);
};
