const { Modal, Blocks } = require('slack-block-builder');

const whoamiresponse = (instanceurl, username) => {
    return Modal({ title: 'Salesforce Slack App', close: 'Close' })
        .blocks(
            Blocks.Section({
                text: `Successfully connected to salesforce instance ${instanceurl}. Authenticated with user ${username}`
            })
        )
        .buildToJSON();
};

module.exports = { whoamiresponse };
