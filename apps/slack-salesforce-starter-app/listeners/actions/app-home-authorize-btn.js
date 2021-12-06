const appHomeAuhtorizeButtonCallback = async ({ body, ack, client }) => {
    try {
        await ack();
    } catch (error) {
        // eslint-disable-next-line no-console
        console.error(error);
    }
};

module.exports = { appHomeAuhtorizeButtonCallback };
