'use strict';

const sh = require('shelljs');
const chalk = require('chalk');

const { userInputPrompt } = require('./deploy/get-user-input');
const { setupHerokuApp } = require('./deploy/setup-heroku-app');
const { salesforceScratchOrgSetup } = require('./deploy/setup-salesforce-org');
const {
    createCertificate,
    deployConnectedApp
} = require('./deploy/deploy-connected-app');

const log = console.log;

sh.env.PROJECT_ROOT_DIR = sh
    .exec('git rev-parse --show-toplevel')
    .toString()
    .replace(/\n+$/, '');

sh.env.CURRENT_BRANCH = sh
    .exec('git branch --show-current', {
        silent: true
    })
    .toString()
    .replace(/\n+$/, '');

sh.env.SF_USERNAME = '';
sh.env.SF_LOGIN_URL = '';
sh.env.ORGID = '';
sh.env.CONSUMERKEY = '';
sh.env.PRIVATE_KEY = '';
sh.env.HEROKU_APP_NAME = '';
sh.env.SLACK_BOT_TOKEN = '';
sh.env.SLACK_SIGNING_SECRET = '';
sh.env.SF_REDIRECT_URL = '';
sh.env.SF_CLIENT_SECRET = '';
sh.env.SLACK_APP_TOKEN = '';

(async () => {
    try {
        // Run the commands in the rest of this script from the root directory
        sh.cd(sh.env.PROJECT_ROOT_DIR);
        // Ask user to input values needed for the deploy
        await getuserinput();
        log('');
        log('*** Starting the salesforce and heroku app setup ***');
        // jwt-bearer flow
        salesforceScratchOrgSetup();
        log('*** Generating Certificates for Connected App');
        const resultcert = await createCertificate();
        log('*** Creating Connected app');
        await deployConnectedApp(resultcert.pubkey);
        log('*** Create Heroku App with necessary configs');
        setupHerokuApp();
    } catch (err) {
        log(chalk.bold.red(`*** ERROR: ${err}`));
    }
})();

async function getuserinput() {
    log('');
    log(chalk.bold('*** Please provide the following information: '));
    const response = await userInputPrompt();
    sh.env.SF_DEV_HUB = response.devhub ?? '';
    sh.env.SF_SCRATCH_ORG = response.scratchorg ?? '';
    sh.env.SF_USERNAME = response['sf-username'];
    sh.env.SF_LOGIN_URL =
        response['sf-login-url'] ?? 'https://test.salesforce.com';
    sh.env.HEROKU_APP_NAME = response['heroku-app'];
    sh.env.SLACK_BOT_TOKEN = response['slack-bot-token'];
    sh.env.SLACK_SIGNING_SECRET = response['slack-signing-secret'];
}
