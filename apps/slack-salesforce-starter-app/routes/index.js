const { oauthcallback } = require('./oauthcallback')

const registercustomRoutes = () => {
    const routes = []
    routes.push(oauthcallback)
    return routes
}

module.exports = { registercustomRoutes }
