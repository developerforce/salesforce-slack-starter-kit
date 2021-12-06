const { HomeTab, Blocks } = require('slack-block-builder');

const authorization_success_screen = (username) => {
    const homeTab = HomeTab({
        callbackId: 'authorization-salesforce-success',
        privateMetaData: 'authenticated'
    }).blocks(
        Blocks.Header({ text: 'Connected to Salesforce' }),
        Blocks.Divider(),
        Blocks.Section({
            text:
                'You are successfully authenticated to Salesforce with username ' +
                username
        })
    );
    return homeTab.buildToJSON();
};

module.exports = { authorization_success_screen };
