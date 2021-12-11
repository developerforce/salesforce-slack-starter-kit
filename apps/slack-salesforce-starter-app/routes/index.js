'use strict';
const { oauthcallback } = require('./oauthcallback');

const registerCustomRoutes = () => {
    const routes = [];
    routes.push(oauthcallback);
    return routes;
};

module.exports = { registerCustomRoutes };
