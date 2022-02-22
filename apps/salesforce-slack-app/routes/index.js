'use strict';
const { oauthStart } = require('./oauth-start');
const { oauthCallback } = require('./oauth-callback');

const registerCustomRoutes = () => {
    const routes = [];
    routes.push(oauthStart);
    routes.push(oauthCallback);
    return routes;
};

module.exports = { registerCustomRoutes };
