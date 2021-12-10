'use strict';

const { whoamiresponse } = require('../../user-interface/modals');

const whoamiCallback = async ({ shortcut, ack, client, context }) => {
    try {
        await ack();
        const conn = context.sfconnection;
        const currentuser = await conn.identity();
        // Call the views.open method using one of the built-in WebClients
        await client.views.open({
            trigger_id: shortcut.trigger_id,
            view: whoamiresponse(conn.instanceUrl, currentuser.username)
        });
    } catch (error) {
        // eslint-disable-next-line no-console
        console.error(error);
    }
};

module.exports = { whoamiCallback };
