'use strict';

const jsforce = require('jsforce');
const { getToken } = require('sf-jwt-token');
const config = require('../config/config');

class Salesforce {
    constructor(config) {
        this.config = config;
    }

    async connect() {
        try {
            if (this.config.password) {
                // username-password flow
                console.log(
                    'Connecting to Salesforce using username-password flow'
                );
                this.conn = new jsforce.Connection({
                    loginUrl: this.config.loginUrl,
                    version: apiVersion
                });

                await this.conn.login(
                    this.config.username,
                    this.config.password
                );
            } else {
                // jwt-bearer flow
                console.log('Connecting to Salesforce using jwt-bearer flow');
                this.conn = new jsforce.Connection({version: config.apiVersion});

                // Get JWT Token
                const jwtResponse = await getToken({
                    iss: this.config.clientId,
                    sub: this.config.username,
                    aud: this.config.loginUrl,
                    privateKey: this.config.privateKey
                });

                // Initialize connection
                this.conn.initialize({
                    instanceUrl: jwtResponse.instance_url,
                    accessToken: jwtResponse.access_token
                });
            }
            return this.conn;
        } catch (e) {
            throw new Error(
                `Can't establish connection with Salesforce, reason: ${e.message}`
            );
        }
    }
}

module.exports = Salesforce;
