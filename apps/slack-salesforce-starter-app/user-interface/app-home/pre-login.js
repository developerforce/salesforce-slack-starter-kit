const { HomeTab, Actions, Elements, Blocks } = require('slack-block-builder')

const authorization_screen = (authurl) => {
    const homeTab = HomeTab({
        callbackId: 'authorize-salesforce',
        privateMetaData: 'pre-login',
    }).blocks(
        Blocks.Header({ text: 'Connect to Salesforce' }),
        Blocks.Divider(),
        Blocks.Section({
            text: 'To get started with the Travel Approval app authorize with Salesforce',
        }),
        Actions({ blockId: 'sf-login' }).elements(
            Elements.Button({ text: 'Authorize with Salesforce' })
                .value('authorize-with-salesforce')
                .actionId('authorize-with-salesforce')
                .url(authurl)
                .primary(true)
        )
    )
    return homeTab.buildToJSON()
}

module.exports = { authorization_screen }
