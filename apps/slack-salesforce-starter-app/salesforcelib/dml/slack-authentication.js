const upsert = async (connection, slackUserId, salesforceUserId) => {
    try {
        result = await connection.sobject('Slack_Authentication__c').upsert(
            {
                Access_Token__c: connection.accessToken,
                Refresh_Token__c: connection.refreshToken,
                Slack_User_ID__c: slackUserId,
                User__c: salesforceUserId
            },
            'Slack_User_ID__c'
        );
        if (!result.success) {
            throw (
                'failed to map Slack user to Salesforce user' +
                JSON.stringify(result)
            );
        }
        return result;
    } catch (e) {
        throw 'failed to map Slack user to Salesforce user' + e.message;
    }
};

module.exports = { upsert };
