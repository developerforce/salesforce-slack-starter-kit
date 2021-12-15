'use strict';

const Salesforce = require('../salesforcelib/connect');
const SalesforceUserAuth = require('../salesforcelib/user-user-oauth');
const config = require('../config/config');
const {
    querySlackAuthentication
} = require('../salesforcelib/query/slack-authentication');
const NodeCache = require('node-cache');

const sf = new Salesforce(config.salesforce);
// Cache to Store access and refresh tokens per user
const tokenCache = new NodeCache({ stdTTL: 600 });
// Cache to Store connection object per user
const connectionCache = new NodeCache({ stdTTL: 600 });

const authWithSalesforce = async ({ payload, context, next, client }) => {
    let slackUserId;
    // For all events Slack returns the users Id as user.id
    if (payload.user.id) {
        slackUserId = payload.user.id;
    } else {
        // For Home Event a Special Case
        slackUserId = payload.user;
    }
    try {
        let sfAuth = {};
        let intUserConnection = {};
        let sfUserConnection = {};
        // Cache access and refresh tokens after first query for 10 min
        if (tokenCache.has(slackUserId)) {
            sfAuth = tokenCache.get(slackUserId);
            context.hasAuthorized = true;
        } else {
            // Query for Slack Authentication records to see if user has authorized the app
            // as a Integration user
            intUserConnection = await sf.connect();
            const result = await querySlackAuthentication(
                intUserConnection,
                slackUserId
            );
            if (result.records.length === 0) {
                context.hasAuthorized = false;
            } else {
                // User has authorized Salesforce before, authenticate with current tokens
                sfAuth = result.records[0];
                context.hasAuthorized = true;
                tokenCache.set(slackUserId, sfAuth);
            }
        }
        if (context.hasAuthorized === true) {
            // Cache connection object for 10 minutes in the app
            if (connectionCache.has(slackUserId)) {
                sfUserConnection = connectionCache.get(slackUserId);
            } else {
                // Construct token object
                const token = {
                    accessToken: sfAuth.Access_Token__c,
                    refreshToken: sfAuth.Refresh_Token__c
                };
                const sfUserAuth = new SalesforceUserAuth(
                    config.salesforce,
                    intUserConnection.instanceUrl,
                    token
                );
                sfUserConnection = await sfUserAuth.connect();
            }
            context.sfconnection = sfUserConnection;
            connectionCache.set(slackUserId, sfUserConnection);
        }
    } catch (e) {
        console.log(e);
        throw new Error(e.message);
    }
    await next();
};

module.exports = { authWithSalesforce };
