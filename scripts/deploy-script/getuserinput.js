const { prompt } = require("enquirer");
const {
  validateAppName,
  getDefaultDevHub,
  generateUniqueAppName
} = require("./util");

const userInputPrompt = async () => {
  return (response = await prompt([
    {
      type: "input",
      name: "devhub",
      message: "Existing SFDX DevHub Alias",
      initial: getDefaultDevHub
    },
    {
      type: "input",
      name: "scratchorg",
      message: "SFDX Scratch Org Alias",
      initial: "scratchorg"
    },
    {
      type: "input",
      name: "heroku-app",
      message: "Heroku App Name",
      initial: generateUniqueAppName,
      validate: validateAppName
    },
    {
      type: "password",
      name: "slack-bot-token",
      message: "Slack Bot Token"
    },
    {
      type: "password",
      name: "slack-signing-secret",
      message: "Slack Signing Secret"
    }
  ]));
};

module.exports = {
  userInputPrompt
};
