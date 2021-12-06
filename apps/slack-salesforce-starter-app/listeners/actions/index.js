const { appHomeAuhtorizeButtonCallback } = require('./app-home-authorize-btn')

module.exports.register = (app) => {
    app.action('authorize-with-salesforce', appHomeAuhtorizeButtonCallback)
}
