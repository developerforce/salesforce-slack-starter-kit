const chalk = require("chalk");
const forge = require("node-forge");
const fs = require("fs");
const sh = require("shelljs");

const { getRandom } = require("./util");
const { getSelfSignedCertificate } = require("./generateselfsignedcert");

const log = console.log;

const templateDir = "scripts/templates/slackApp.connectedApp-meta.xml";
const tempDeployFolder = "connectedApps";
const tempDeployFile = `${tempDeployFolder}/slackApp.connectedApp-meta.xml`;

const deployConnectedApp = (pubkey) => {
  log("*** Creating Certificates for Salesforce Connected Apps ***");
  log(
    `${chalk.bold(
      "*** Deploying connected apps to Salesforce Environment"
    )} ${chalk.dim("(step 3 of 3)")}`
  );
  fs.rmSync(tempDeployFolder, { recursive: true, force: true });
  fs.mkdirSync(tempDeployFolder);
  fs.copyFileSync(templateDir, tempDeployFile);
  sh.sed(
    "-i",
    /{CONSUMERKEY}/,
    sh.env.CONSUMERKEY,
    "connectedApps/slackApp.connectedApp-meta.xml"
  );
  sh.sed(
    "-i",
    /{CERTIFICATE}/,
    pubkey,
    "connectedApps/slackApp.connectedApp-meta.xml"
  );
  sh.sed(
    "-i",
    /{USEREMAIL}/,
    sh.env.SF_USERNAME,
    "connectedApps/slackApp.connectedApp-meta.xml"
  );
  sh.sed(
    "-i",
    /{HEROKUINSTANCE}/,
    sh.env.HEROKU_APP_NAME,
    "connectedApps/slackApp.connectedApp-meta.xml"
  );
  sh.exec(
    "sfdx force:source:deploy -p connectedApps/slackApp.connectedApp-meta.xml"
  );
};

// Creates public and Private keys for JWT token flow
const createCertificate = () => {
  const resultcert = { pubkey: "", privatekey: "" };
  const pki = forge.pki;
  const keys = pki.rsa.generateKeyPair(2048);
  const privKey = forge.pki.privateKeyToPem(keys.privateKey);

  const randomkey = getRandom(20) + sh.env.ORGID;
  // Create buffer object, specifying utf8 as encoding
  let bufferObj = Buffer.from(randomkey, "utf8");
  // Encode the Buffer as a base64 string
  sh.env.CONSUMERKEY = bufferObj.toString("base64");

  const cert = getSelfSignedCertificate(pki, keys);
  const pubKey = pki.certificateToPem(cert);
  resultcert.privatekey = privKey;
  resultcert.pubkey = pubKey;
  sh.env.PRIVATE_KEY = privKey;
  return resultcert;
};

module.exports = { deployConnectedApp, createCertificate };
