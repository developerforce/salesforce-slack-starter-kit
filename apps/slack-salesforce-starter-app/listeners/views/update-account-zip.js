const config = require("../../config/config");
const Salesforce = require("../../salesforcelib/connect");

const sf = new Salesforce(config.salesforce);

const updateAccountZipCallback = async ({ ack, body, view, client }) => {
    await ack();
    const zipcode = view['state']['values']['block_1']['update_account_zip_input']['value'];
    const metadata = JSON.parse(body.view.private_metadata);
    // Single record update
    const conn = await sf.connect();
    await conn.sobject("Account").update({ 
        Id : metadata.accountId,
        ShippingPostalCode : zipcode
    });
    await client.chat.postMessage({
        text: 'Account update success',
        channel: metadata.channelId,
        blocks: [
            {
                type: 'section',
                text: {
                    type: 'mrkdwn',
                    text: 'Account record updated successfully 🎉 !!!!'
                }
            }
        ]
    });
}

module.exports = {updateAccountZipCallback}