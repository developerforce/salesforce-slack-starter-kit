'use strict';
const {
    authorizationScreen,
    authorizationSuccessScreen
} = require('../../user-interface/app-home');

const appHomeOpenedCallback = async ({ client, event, context }) => {
    if (event.tab !== 'home') {
        // Ignore the `app_home_opened` event for everything
        // except for home screen as we don't support a conversational UI
        return;
    }
    try {
        if (context.hasAuthorized) {
            const conn = context.sfconnection;
            const currentuser = await conn.identity();
            await client.views.publish({
                // Use the user ID associated with the event
                user_id: event.user,
                view: authorizationSuccessScreen(currentuser.username)
            });
        } else {
            // Call views.publish with the built-in client
            await client.views.publish({
                user_id: event.user,
                view: authorizationScreen(
                    `${process.env.HEROKU_URL}/oauthstart/${event.user}`
                )
            });
        }
    } catch (error) {
        // eslint-disable-next-line no-console
        console.error(error);
    }
};

module.exports = { appHomeOpenedCallback };
