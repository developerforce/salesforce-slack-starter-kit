const sh = require("shelljs");
const chalk = require("chalk");
const log = console.log;

/*
 * Create a scratch org, push source to it, apply permset, and save user login details
 */

const salesforcescratchorgsetup = () => {
  log("");
  log(
    `${chalk.bold("*** Setting up Salesforce App")} ${chalk.dim(
      "(step 1 of 3)"
    )}`
  );
  log("*** Creating scratch org");
  const scratchOrgResult = sh.exec(
    `sfdx force:org:create -s -f config/project-scratch-def.json -a ${sh.env.SF_SCRATCH_ORG} -d 30 -v ${sh.env.SF_DEV_HUB} --json`,
    { silent: true }
  );
  // Check error creating scratch org
  if (scratchOrgResult.stderr) {
    throw new Error(scratchOrgResult.stderr);
  }
  log("*** Fetching user data");
  const userData = JSON.parse(
    sh.exec("sfdx force:org:display --json", { silent: true })
  );
  sh.env.SF_USERNAME = userData.result.username;
  sh.env.ORGID = userData.result.id;

  log(chalk.green("*** ✔ Done with the Salesforce scratch org setup"));
};

module.exports = { salesforcescratchorgsetup };
