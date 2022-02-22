'use strict';

const { HomeTab, Blocks } = require('slack-block-builder');

const authorizationSuccessScreen = (username) => {
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

module.exports = { authorizationSuccessScreen };
