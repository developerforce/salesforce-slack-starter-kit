const sh = require('shelljs');
const chalk = require('chalk');
const log = console.log;

/*
 * Create a scratch org, push source to it, apply permset, and save user login details
 */

const salesforceScratchOrgSetup = () => {
    log('');
    log(
        `${chalk.bold('*** Setting up Salesforce App')} ${chalk.dim(
            '(step 1 of 3)'
        )}`
    );
    log('*** Creating scratch org');
    const scratchOrgResult = JSON.parse(
        sh.exec(
            `sfdx force:org:create -s -f config/project-scratch-def.json -a ${sh.env.SF_SCRATCH_ORG} -d 30 -v ${sh.env.SF_DEV_HUB} --json`,
            { silent: true }
        )
    );
    // Check error creating scratch org
    if (!scratchOrgResult.result || !scratchOrgResult.result.orgId) {
        throw new Error(
            'Scratch org creation failed ' + JSON.stringify(scratchOrgResult)
        );
    }
    const userData = JSON.parse(
        sh.exec('sfdx force:org:display --json', { silent: true })
    );
    sh.env.SF_USERNAME = userData.result.username;
    sh.env.ORGID = userData.result.id;

    // push code to scratch org
    log('*** Deploying Salesforce metadata for Slack app');
    const deployResult = JSON.parse(
        sh.exec(
            `sfdx force:source:push -u ${userData.result.username} -w 10 --json`,
            { silent: true }
        )
    );

    if (!deployResult.result) {
        throw new Error(
            'Source deployment failed ' + JSON.stringify(deployResult)
        );
    }

    // Assign permission set to user
    const assignPermissionset = JSON.parse(
        sh.exec(
            `sfdx force:user:permset:assign --permsetname Salesforce_Slack_App_Admin -u ${userData.result.username} --json`,
            { silent: true }
        )
    );

    if (!assignPermissionset.result.successes) {
        throw new Error(
            'Permission set assignment failed ' +
                JSON.stringify(assignPermissionset)
        );
    }

    log(chalk.green('*** ✔ Done with the Salesforce scratch org setup'));
};

module.exports = { salesforceScratchOrgSetup };
