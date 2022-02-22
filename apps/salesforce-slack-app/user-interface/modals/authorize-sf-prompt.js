'use strict';
const { Modal, Blocks } = require('slack-block-builder');

const authorizeSalesforcePrompt = (teamId, appId) => {
    return Modal({ title: 'Salesforce Slack App', close: 'Close' })
        .blocks(
            Blocks.Section({
                text: `*This shortcut requires you to link your Slack to your Salesforce Account.*\n\n Navigate to <slack://app?team=${teamId}&id=${appId}&tab=home|App Home> and click *Authorize with Salesforce* button to connect your Salesforce Account`
            })
        )
        .buildToJSON();
};

module.exports = { authorizeSalesforcePrompt };
