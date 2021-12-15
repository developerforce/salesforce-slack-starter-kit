'use strict';
const { authorization_screen } = require('../../user-interface/app-home');
const slack_user = require('../../store/slack-user');
const {
    authorization_success_screen
} = require('../../user-interface/app-home');

const appHomeOpenedCallback = async ({ client, event, body, context }) => {
    if (event.tab !== 'home') {
        // Ignore the `app_home_opened` event for everything
        // except for home screen as we don't support a conversational UI
        return;
    }
    try {
        slack_user.userId = event.user;
        if (context.hasAuthorized) {
            const conn = context.sfconnection;
            const currentuser = await conn.identity();
            await client.views.publish({
                // Use the user ID associated with the event
                user_id: slack_user.userId,
                view: authorization_success_screen(currentuser.username)
            });
        } else {
            // Call views.publish with the built-in client
            await client.views.publish({
                // Use the user ID associated with the event
                user_id: event.user,
                view: authorization_screen(buildOAuthURL())
            });
        }
    } catch (error) {
        // eslint-disable-next-line no-console
        console.error(error);
    }
};

// Returns OAuth URL to start Web based OAuth 2.0 flow
const buildOAuthURL = () => {
    let auth_url = `${process.env.SF_LOGIN_URL}/services/oauth2/authorize`;
    auth_url += `?client_id=${process.env.SF_CLIENT_ID}`;
    auth_url += `&redirect_uri=${process.env.SF_REDIRECT_URL}`;
    auth_url += '&response_type=code';
    return auth_url;
};

module.exports = { appHomeOpenedCallback };
