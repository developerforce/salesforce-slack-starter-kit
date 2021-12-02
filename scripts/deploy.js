"use strict";

const sh = require("shelljs");
const chalk = require("chalk");

const { userInputPrompt } = require("./deploy/getuserinput");
const { setupherokuapp } = require("./deploy/setupherokuapp");
const {
  salesforcescratchorgsetup
} = require("./deploy/setupsalesforceorg");
const {
  createCertificate,
  deployConnectedApp
} = require("./deploy/deployconnectedapp");

const log = console.log;

sh.env.PROJECT_ROOT_DIR = sh
  .exec("git rev-parse --show-toplevel")
  .toString()
  .replace(/\n+$/, "");

sh.env.CURRENT_BRANCH = sh
  .exec("git branch --show-current", {
    silent: true
  })
  .toString()
  .replace(/\n+$/, "");

sh.env.SF_USERNAME = "";
sh.env.SF_PASSWORD = "";
sh.env.SF_LOGIN_URL = "";
sh.env.ORGID = "";
sh.env.CONSUMERKEY = "";
sh.env.PRIVATE_KEY = "";
sh.env.HEROKU_APP_NAME = "";
sh.env.SLACK_BOT_TOKEN = "";
sh.env.SLACK_SIGNING_SECRET = "";

(async () => {
  try {
    // Run the commands in the rest of this script from the root directory
    sh.cd(sh.env.PROJECT_ROOT_DIR);
    // Ask user to input values needed for the deploy
    await getuserinput();
    log("");
    log("*** Starting the salesforce and heroku app setup ***");
    if (!sh.env.SF_PASSWORD) {
      // jwt-bearer flow
      log("*** Creating Salesforce org ***");
      salesforcescratchorgsetup();
      log("*** Generating Certificates for Connected App");
      const resultcert = createCertificate();
      log("*** Creating Connected app");
      deployConnectedApp(resultcert.pubkey);
    }
    log("*** Create Heroku App with necessary configs");
    setupherokuapp();
  } catch (err) {
    log(chalk.bold.red(`*** ERROR: ${err}`));
  }
})();

async function getuserinput() {
  log("");
  log(chalk.bold("*** Please provide the following information: "));
  const response = await userInputPrompt();
  sh.env.SF_DEV_HUB = response.devhub ?? "";
  sh.env.SF_SCRATCH_ORG = response.scratchorg ?? "";
  sh.env.SF_USERNAME = response["sf-username"];
  sh.env.SF_PASSWORD = response["sf-password"] ?? "";
  sh.env.SF_LOGIN_URL =
    response["sf-login-url"] ?? "https://test.salesforce.com";
  sh.env.HEROKU_APP_NAME = response["heroku-app"];
  sh.env.SLACK_BOT_TOKEN = response["slack-bot-token"];
  sh.env.SLACK_SIGNING_SECRET = response["slack-signing-secret"];
}
