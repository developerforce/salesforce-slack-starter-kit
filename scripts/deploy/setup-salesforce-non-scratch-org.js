const sh = require('shelljs');
const chalk = require('chalk');
const log = console.log;
const { assignPermissionset } = require('./util');

// Deploy source to developer org and apply permset
const setupDefaultNonScratchOrg = async () => {
    log('');
    log(
        `${chalk.bold('*** Setting up Salesforce App')} ${chalk.dim(
            '(step 1 of 2)'
        )}`
    );
    const userData = JSON.parse(
        sh.exec('sfdx force:org:display --json', { silent: true })
    );
    sh.env.SF_USERNAME = userData.result.username;
    sh.env.ORGID = userData.result.id;
    log('*** Deploying Salesforce metadata');
    const deployResult = JSON.parse(
        sh.exec(
            `sfdx force:source:deploy -u ${sh.env.SF_USERNAME} -p force-app/main/default -w 10 --json`,
            { silent: true }
        )
    );

    if (!deployResult.result || deployResult.result.error) {
        throw new Error(
            'Source deployment failed ' + JSON.stringify(deployResult)
        );
    }

    // Assign permission set to user
    await assignPermissionset();

    log(chalk.green('*** ✔ Done with the Salesforce org setup'));
};

module.exports = { setupDefaultNonScratchOrg };
