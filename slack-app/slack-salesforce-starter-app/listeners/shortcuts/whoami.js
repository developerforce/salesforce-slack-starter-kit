const Salesforce = require("../../salesforcelib/connect");
const config = require("../../config/config");
const { whoamiresponse } = require("../../user-interface/modals");

const sf = new Salesforce(config.salesforce);

const whoamiCallback = async ({ shortcut, ack, client }) => {
  try {
    await ack();
    const conn = await sf.connect();
    const currentuser = await conn.identity();
    // Call the views.open method using one of the built-in WebClients
    const result = await client.views.open({
      trigger_id: shortcut.trigger_id,
      view: whoamiresponse(conn.instanceUrl, currentuser.username)
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
  }
};

module.exports = { whoamiCallback };
