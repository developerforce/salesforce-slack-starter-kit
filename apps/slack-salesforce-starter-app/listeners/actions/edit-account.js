const { Modal, Blocks, Elements, } = require("slack-block-builder");

const editAccountCallback = async ({ ack, client, body }) => {
    await ack();
    const [action] = body.actions;
    const [zipCode, accountId, accountName] = action?.value.split(':');
    const modal = Modal()
        .title('Edit Account')
        .blocks(
            Blocks.Section()
                .text(`*Account Name: * ${accountName}`),
            Blocks.Input()
                .label('Zip Code')
                .blockId('block_1')
                .element(
                    Elements.TextInput()
                        .placeholder('37415')
                        .actionId('update_account_zip_input')
                        .focusOnLoad()
                        .initialValue(zipCode)
                ),
        )
        .submit('Update Account')
        .callbackId('update_account_zip')
        .privateMetaData(JSON.stringify({'accountId': accountId, 'channelId': body.channel.id}))
        .buildToJSON();

    const result = await client.views.open({
        trigger_id: body.trigger_id,
        view: modal
    });

}

module.exports = { editAccountCallback }