'use strict';
const appHomeAuthorizeButtonCallback = async ({ body, ack, client }) => {
    try {
        await ack();
    } catch (error) {
        // eslint-disable-next-line no-console
        console.error(error);
    }
};

module.exports = { appHomeAuthorizeButtonCallback };
