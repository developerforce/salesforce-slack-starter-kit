'use strict';
const sh = require('shelljs');
const chalk = require('chalk');
const fs = require('fs');
const log = console.log;

const setupherokuapp = () => {
    log('');
    log(
        `${chalk.bold('*** Setting up Heroku app')} ${chalk.dim(
            '(step 2 of 3)'
        )}`
    );
    // Check user is correctly logged into Heroku
    const whoAmI = sh.exec('heroku whoami', { silent: true });
    if (whoAmI.stderr) {
        throw new Error(
            'Not logged into Heroku. Run heroku login to authenticate yourself.'
        );
    }
    // Check app name is not already used
    const appNameCheck = sh.exec(`heroku apps:info ${sh.env.HEROKU_APP_NAME}`, {
        silent: true
    });
    if (appNameCheck.stdout.includes(sh.env.HEROKU_APP_NAME)) {
        throw new Error(`App name already in use: ${sh.env.HEROKU_APP_NAME}`);
    }
    sh.cd('apps/slack-salesforce-starter-app');

    log(`*** Creating Heroku app ${chalk.bold(sh.env.HEROKU_APP_NAME)}`);
    const appData = JSON.parse(
        sh.exec(
            `heroku apps:create ${sh.env.HEROKU_APP_NAME} --json --buildpack https://github.com/lstoll/heroku-buildpack-monorepo.git`,
            { silent: true }
        )
    );
    sh.env.HEROKU_APP_NAME = appData.name;
    sh.env.HEROKU_URL = appData.web_url;
    sh.env.SF_REDIRECT_URL = `https://${sh.env.HEROKU_APP_NAME}.herokuapp.com/oauthcallback`;

    log('*** Adding Node.js Buildpack');
    sh.exec(
        `heroku buildpacks:add -a ${sh.env.HEROKU_APP_NAME} heroku/nodejs`,
        {
            silent: true
        }
    );

    log('*** Writing .env file for local development');
    fs.writeFileSync('.env', ''); // empty the .env file for fresh write
    const stream = fs.createWriteStream('.env', { flags: 'a' });
    // env variables for Slack Auth
    stream.write(
        'SLACK_SIGNING_SECRET=' + sh.env.SLACK_SIGNING_SECRET + '\r\n'
    );
    stream.write('SLACK_BOT_TOKEN=' + sh.env.SLACK_BOT_TOKEN + '\r\n');
    // env variables for Salesforce Auth
    stream.write('SF_USERNAME=' + sh.env.SF_USERNAME + '\r\n');
    stream.write('SF_LOGIN_URL=' + sh.env.SF_LOGIN_URL + '\r\n');
    stream.write('SF_REDIRECT_URL=' + sh.env.SF_REDIRECT_URL + '\r\n');
    stream.write('SF_CLIENT_ID=' + sh.env.CONSUMERKEY + '\r\n');
    stream.write('SF_CLIENT_SECRET=' + sh.env.SF_CLIENT_SECRET + '\r\n');
    if (sh.env.SF_PASSWORD) {
        // username-password flow
        stream.write('SF_PASSWORD=' + sh.env.SF_PASSWORD + '\r\n');
    } else {
        // jwt-bearer flow
        stream.write(
            'PRIVATE_KEY=' +
                '"' +
                sh.env.PRIVATE_KEY.replace(/(\r\n|\r|\n)/g, '\\n') +
                '"'
        );
    }
    stream.close();

    log('*** Pushing app to Heroku');
    log('*** Setting remote configuration parameters');
    if (!sh.env.SF_PASSWORD) {
        // jwt-bearer flow
        sh.exec(
            `heroku config:set PRIVATE_KEY="${sh.env.PRIVATE_KEY}" -a ${sh.env.HEROKU_APP_NAME}`,
            { silent: true }
        );
    }
    sh.exec(
        `heroku config:set APP_BASE=apps/slack-salesforce-starter-app -a ${sh.env.HEROKU_APP_NAME}`
    );
    sh.exec(
        `heroku config:set SF_USERNAME=${sh.env.SF_USERNAME} -a ${sh.env.HEROKU_APP_NAME}`
    );
    if (sh.env.PASSWORD) {
        // username-password flow
        sh.exec(
            `heroku config:set SF_PASSWORD=${sh.env.SF_PASSWORD} -a ${sh.env.HEROKU_APP_NAME}`
        );
    }
    sh.exec(
        `heroku config:set SF_LOGIN_URL=${sh.env.SF_LOGIN_URL} -a ${sh.env.HEROKU_APP_NAME}`
    );
    sh.exec(
        `heroku config:set SLACK_BOT_TOKEN=${sh.env.SLACK_BOT_TOKEN} -a ${sh.env.HEROKU_APP_NAME}`,
        { silent: true }
    );
    sh.exec(
        `heroku config:set SLACK_SIGNING_SECRET=${sh.env.SLACK_SIGNING_SECRET} -a ${sh.env.HEROKU_APP_NAME}`,
        { silent: true }
    );
    sh.exec(
        `heroku config:set SF_CLIENT_ID=${sh.env.CONSUMERKEY} -a ${sh.env.HEROKU_APP_NAME}`,
        { silent: true }
    );
    sh.exec(
        `heroku config:set SF_CLIENT_SECRET=${sh.env.SF_CLIENT_SECRET} -a ${sh.env.HEROKU_APP_NAME}`,
        { silent: true }
    );
    sh.exec(
        `heroku config:set SF_REDIRECT_URL=${sh.env.SF_REDIRECT_URL} -a ${sh.env.HEROKU_APP_NAME}`,
        { silent: true }
    );
    sh.cd('../../');
    sh.exec(
        `git push git@heroku.com:${sh.env.HEROKU_APP_NAME}.git ${sh.env.CURRENT_BRANCH}:main`
    );

    log(
        chalk.green(
            `*** ✔ Done deploying Heroku app ${chalk.bold(
                sh.env.HEROKU_APP_NAME
            )}`
        )
    );
};

module.exports = { setupherokuapp };
