const chalk = require('chalk');
const forge = require('node-forge');
const fs = require('fs');
const sh = require('shelljs');

const { getRandom } = require('./util');
const { getSelfSignedCertificate } = require('./generateselfsignedcert');

const log = console.log;

const templateDir = 'scripts/templates/slackApp.connectedApp-meta.xml';
const tempDeployFolder = 'connectedApps';
const tempDeployFile = `${tempDeployFolder}/slackApp.connectedApp-meta.xml`;

const deployConnectedApp = async (pubkey) => {
    log('*** Creating Certificate for Salesforce Connected Apps ***');
    log(
        `${chalk.bold(
            '*** Deploying connected app to Salesforce Environment'
        )} ${chalk.dim('(step 3 of 3)')}`
    );
    fs.rmSync(tempDeployFolder, { recursive: true, force: true });
    fs.mkdirSync(tempDeployFolder);
    fs.copyFileSync(templateDir, tempDeployFile);
    sh.sed(
        '-i',
        /{CONSUMERKEY}/,
        sh.env.CONSUMERKEY,
        'connectedApps/slackApp.connectedApp-meta.xml'
    );
    sh.sed(
        '-i',
        /{CERTIFICATE}/,
        pubkey,
        'connectedApps/slackApp.connectedApp-meta.xml'
    );
    sh.sed(
        '-i',
        /{USEREMAIL}/,
        sh.env.SF_USERNAME,
        'connectedApps/slackApp.connectedApp-meta.xml'
    );
    sh.sed(
        '-i',
        /{HEROKUINSTANCE}/,
        sh.env.HEROKU_APP_NAME,
        'connectedApps/slackApp.connectedApp-meta.xml'
    );
    sh.sed(
        '-i',
        /{SECRET}/,
        sh.env.SF_CLIENT_SECRET,
        'connectedApps/slackApp.connectedApp-meta.xml'
    );
    sh.exec(
        'sfdx force:source:deploy -p connectedApps/slackApp.connectedApp-meta.xml -w 10'
    );
};

// Creates public and Private keys for JWT token flow
const createCertificate = async () => {
    const resultcert = { pubkey: '', privatekey: '' };
    const pki = forge.pki;
    const keys = pki.rsa.generateKeyPair(2048);
    const privKey = forge.pki.privateKeyToPem(keys.privateKey);

    const randomkey = getRandom(20) + sh.env.ORGID;
    const clientSecretRandom =
        Math.floor(
            Math.pow(10, 20) +
                Math.random() * (Math.pow(10, 20) - Math.pow(10, 20 - 1) - 1)
        ) + sh.env.ORGID;
    // Create buffer object, specifying utf8 as encoding
    let bufferObj = Buffer.from(randomkey, 'utf8');
    // Encode the Buffer as a base64 string
    sh.env.CONSUMERKEY = bufferObj.toString('base64');
    sh.env.SF_CLIENT_SECRET = clientSecretRandom;

    const cert = getSelfSignedCertificate(pki, keys);
    const pubKey = pki.certificateToPem(cert);
    resultcert.privatekey = privKey;
    resultcert.pubkey = pubKey;
    sh.env.PRIVATE_KEY = privKey;
    return resultcert;
};

module.exports = { deployConnectedApp, createCertificate };
