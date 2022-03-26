'use strict';

const {
    whoAmIResponse,
    authorize_sf_prompt
} = require('../../user-interface/modals');

const whoamiCallback = async ({ shortcut, ack, client, context }) => {
    try {
        await ack();
        if (context.hasAuthorized) {
            const conn = context.sfconnection;
            const currentuser = await conn.identity();
            // Call the views.open method using one of the built-in WebClients
            await client.views.open({
                trigger_id: shortcut.trigger_id,
                view: whoAmIResponse(conn.instanceUrl, currentuser.username)
            });
        } else {
            // Get BotInfo
            const botInfo = await client.bots.info({ bot: context.botId });
            // Open a Modal with message to navigate to App Home for authorization
            await client.views.open({
                trigger_id: shortcut.trigger_id,
                view: authorize_sf_prompt(context.teamId, botInfo.bot.app_id)
            });
        }
    } catch (error) {
        // eslint-disable-next-line no-console
        console.error(error);
    }
};

module.exports = { whoamiCallback };
