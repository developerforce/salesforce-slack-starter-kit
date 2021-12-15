'use strict';

const querySlackAuthentication = async (connection, slackUserId) => {
    try {
        const result = await connection.query(
            `Select Id,Refresh_Token__c,Access_Token__c,Slack_User_ID__c,User__c FROM Slack_Authentication__c WHERE Slack_User_ID__c = \'${slackUserId}\'`
        );
        return result;
    } catch (e) {
        throw new Error(e.message);
    }
};

module.exports = { querySlackAuthentication };
