'use strict';

const jsforce = require('jsforce');

class SalesforceUserAuth {
    constructor(config, instanceUrl, token) {
        this.config = config;
        this.instanceUrl = instanceUrl;
        this.token = token;
    }

    async connect() {
        try {
            this.conn = new jsforce.Connection({
                oauth2: {
                    loginUrl: this.config.loginUrl,
                    clientId: this.config.clientId,
                    clientSecret: this.config.clientSecret,
                    redirectUri: this.config.redirectUrl
                },
                instanceUrl: this.instanceUrl,
                accessToken: this.token.accessToken,
                refreshToken: this.token.refreshToken
            });
            await this.conn.oauth2.refreshToken(this.token.refreshToken);
            return this.conn;
        } catch (e) {
            throw new Error(
                `Can't establish connection with Salesforce, reason: ${e.message}`
            );
        }
    }
}

module.exports = SalesforceUserAuth;
