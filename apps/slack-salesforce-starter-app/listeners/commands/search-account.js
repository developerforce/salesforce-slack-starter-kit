const config = require("../../config/config");
const Salesforce = require("../../salesforcelib/connect");
const { Message, Blocks, Elements, } = require("slack-block-builder");

const sf = new Salesforce(config.salesforce);

const searchAccountCallback = async ({ command, client, ack }) => {
    // Acknowledge command request
    await ack();
    const conn = await sf.connect();
    // Query Accounts
    const result = await conn.query("SELECT Id, Name, ShippingAddress, ShippingCity, ShippingCountry, ShippingPostalCode, ShippingState, ShippingStreet FROM Account LIMIT 5");
    const accounts = result.records;
    // Construct Message Blocks
    const blocks = [];
    for (let i = 0; i < accounts.length; i++) {
        blocks.push(Blocks.Section().text(`*<fakeLink.toHotelPage.com|${accounts[i].Name}>*\n`));
        blocks.push(Blocks.Section().text(`*Address* : ${accounts[i].ShippingStreet},${accounts[i].ShippingCity}, ${accounts[i].ShippingState}- ${accounts[i].ShippingPostalCode}, ${accounts[i].ShippingCountry}\n`));
        blocks.push(
            Blocks.Actions()
                .elements(
                    Elements.Button({ text: 'Show Details', actionId: 'edit_account' })
                        .primary()
                        .value(accounts[i].ShippingPostalCode + ':' + accounts[i].Id + ':' + accounts[i].Name)
                )
        );
        blocks.push(Blocks.Divider());
    }
    const message = Message({ channel: command.channel_id, text: 'Account Search Results' })
        .blocks(
            Blocks.Section({ text: `We found *${accounts.length} Accounts* with search term ${command.text}` }),
            Blocks.Divider(),
            blocks
        ).buildToObject();
    // Send Message to Slack
    await client.chat.postMessage(message);
}

module.exports = { searchAccountCallback };