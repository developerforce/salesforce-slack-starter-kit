"use strict";

require("dotenv").config();

const salesforce = {
  clientId: process.env.SF_CLIENT_ID,
  privateKey: process.env.PRIVATE_KEY,
  loginUrl: process.env.SF_LOGIN_URL,
  username: process.env.SF_USERNAME
};

// TODO Support Local Development using Socket Mode
// For now we focus on listening events directly in Heroku
const slack = {
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  port: process.env.PORT || 3000
  //socketMode: true,
  //appToken: process.env.SLACK_APP_TOKEN
};

module.exports = {
  salesforce,
  slack
};
