'use strict';
const sh = require('shelljs');
const chalk = require('chalk');

const { userInputPrompt } = require('./deploy/get-user-input');
const { setupHerokuApp } = require('./deploy/setup-heroku-app');
const {
    createScratchOrg,
    setupScratchOrg
} = require('./deploy/setup-salesforce-scratch-org');
const {
    setupDefaultDeveloperOrg
} = require('./deploy/setup-salesforce-non-scratch-org');
const {
    createCertificate,
    prepareSfMetadata
} = require('./deploy/prepare-sf-metadata');

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
sh.env.HEROKU_URL = '';
sh.env.SF_CLIENT_SECRET = '';
sh.env.SLACK_APP_TOKEN = '';
sh.env.SALESFORCE_ENV_TYPE = '';

(async () => {
    try {
        // Run the commands in the rest of this script from the root directory
        sh.cd(sh.env.PROJECT_ROOT_DIR);
        // Ask user to input values needed for the deploy
        await getUserInput();
        log('');
        // Salesforce Org Setup
        if (sh.env.SALESFORCE_ENV_TYPE == 'Scratch Org') {
            await createScratchOrg();
            await setupScratchOrg();
        } else {
            await setupDefaultDeveloperOrg();
        }
        const resultcert = await createCertificate();
        await prepareSfMetadata(resultcert.pubkey);
        // Heroku Setup
        await setupHerokuApp();
    } catch (err) {
        log(chalk.bold.red(`*** ERROR: ${err}`));
    }
})();

async function getUserInput() {
    log('');
    log(chalk.bold('*** Please provide the following information: '));
    const response = await userInputPrompt();
    sh.env.SF_DEV_HUB = response.devhub ?? '';
    sh.env.SF_SCRATCH_ORG = response.scratchorg ?? '';
    sh.env.SF_LOGIN_URL =
        response['sf-login-url'] ?? 'https://test.salesforce.com';
    sh.env.HEROKU_APP_NAME = response['heroku-app'];
    sh.env.SLACK_BOT_TOKEN = response['slack-bot-token'];
    sh.env.SLACK_SIGNING_SECRET = response['slack-signing-secret'];
}
