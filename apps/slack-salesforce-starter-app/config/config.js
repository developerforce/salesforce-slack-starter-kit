'use strict'

require('dotenv').config()

const salesforce = {
    clientId: process.env.SF_CLIENT_ID,
    clientSecret: process.env.SF_CLIENT_SECRET,
    redirectUrl: process.env.SF_REDIRECT_URL,
    privateKey: process.env.PRIVATE_KEY,
    loginUrl: process.env.SF_LOGIN_URL,
    username: process.env.SF_USERNAME,
    password: process.env.SF_PASSWORD,
}

// For Local Development using Socket Mode uncomment socketMode and appToken
// Also make sure in your Slack app at api.slack.com, socketMode is enabled
// and you have created an App Token
const slack = {
    token: process.env.SLACK_BOT_TOKEN,
    signingSecret: process.env.SLACK_SIGNING_SECRET,
    port: process.env.PORT || 3000,
    //socketMode: true,
    //appToken: process.env.SLACK_APP_TOKEN
}

module.exports = {
    salesforce,
    slack,
}
