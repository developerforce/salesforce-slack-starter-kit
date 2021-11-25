"use strict";
const sh = require("shelljs");
const chalk = require("chalk");
const log = console.log;

const setupherokuapp = () => {
  log("");
  log(
    `${chalk.bold("*** Setting up Heroku app")} ${chalk.dim("(step 2 of 3)")}`
  );
  sh.cd("slack-app/slack-salesforce-starter-app");

  log(`*** Creating Heroku app ${chalk.bold(sh.env.HEROKU_APP_NAME)}`);
  const appData = JSON.parse(
    sh.exec(
      `heroku apps:create ${sh.env.HEROKU_APP_NAME} --json --buildpack https://github.com/lstoll/heroku-buildpack-monorepo.git`,
      { silent: true }
    )
  );
  sh.env.HEROKU_APP_NAME = appData.name;
  sh.env.HEROKU_URL = appData.web_url;

  log("*** Adding Node.js Buildpack");
  sh.exec(`heroku buildpacks:add -a ${sh.env.HEROKU_APP_NAME} heroku/nodejs`, {
    silent: true
  });

  log("*** Writing .env file for local development");
  sh.echo("SF_OAUTH_FLOW=" + sh.env.SF_OAUTH_FLOW).toEnd(".env");
  sh.echo("SF_USERNAME=" + sh.env.SF_USERNAME).toEnd(".env");
  sh.echo("SF_LOGIN_URL=" + sh.env.SF_LOGIN_URL).toEnd(".env");
  if (sh.env.SF_OAUTH_FLOW === "username-password") {
    sh.echo("SF_PASSWORD=" + sh.env.SF_PASSWORD).toEnd(".env");
  } else if (sh.env.SF_OAUTH_FLOW === "jwt-bearer") {
    sh.echo("PRIVATE_KEY=" + sh.env.PRIVATE_KEY).toEnd(".env");
  }

  log("*** Pushing app to Heroku");
  log("*** Setting remote configuration parameters");
  if (sh.env.SF_OAUTH_FLOW === "jwt-bearer") {
    sh.exec(
      `heroku config:set PRIVATE_KEY="${sh.env.PRIVATEKEY}" -a ${sh.env.HEROKU_APP_NAME}`,
      { silent: true }
    );
  }
  sh.exec(
    `heroku config:set APP_BASE=slack-app/slack-salesforce-starter-app -a ${sh.env.HEROKU_APP_NAME}`
  );
  sh.exec(
    `heroku config:set SF_OAUTH_FLOW=${sh.env.SF_OAUTH_FLOW} -a ${sh.env.HEROKU_APP_NAME}`
  );
  sh.exec(
    `heroku config:set SF_USERNAME=${sh.env.SF_USERNAME} -a ${sh.env.HEROKU_APP_NAME}`
  );
  if (sh.env.SF_OAUTH_FLOW === "username-password") {
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
  sh.cd("../../");
  sh.exec(
    `git push git@heroku.com:${sh.env.HEROKU_APP_NAME}.git ${sh.env.CURRENT_BRANCH}:main`
  );

  log(
    chalk.green(
      `*** ✔ Done deploying Heroku app ${chalk.bold(sh.env.HEROKU_APP_NAME)}`
    )
  );
};

module.exports = { setupherokuapp };
