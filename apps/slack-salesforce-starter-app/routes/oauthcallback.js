var jsforce = require('jsforce')
const url = require('url')
const slack_user = require('../store/slack-user')
const fs = require('fs')
const path = require('path')

const fetchOAuthToken = async (req, res) => {
    const oauth2 = new jsforce.OAuth2({
        // you can change loginUrl to connect to sandbox or prerelease env.
        loginUrl: process.env.SF_LOGIN_URL,
        clientId: process.env.SF_CLIENT_ID,
        clientSecret: process.env.SF_CLIENT_SECRET,
        redirectUri: process.env.SF_REDIRECT_URL,
    })
    var conn = new jsforce.Connection({ oauth2: oauth2 })
    var code = url.parse(req.url, true).query.code
    try {
        const result = await conn.authorize(code)
        res.writeHead(200, { 'Content-Type': 'text/html' })
        res.end(
            fs.readFileSync(
                path.resolve(__dirname, '../routes/oauthsuccess.html')
            ),
            'utf-8'
        )
        console.log(result)
        console.log('after' + slack_user.userId)
    } catch (e) {
        res.writeHead(500)
        res.end(JSON.stringify(e), 'utf-8')
    }
}

const oauthcallback = {
    path: '/oauthcallback',
    method: ['GET'],
    handler: fetchOAuthToken,
}

module.exports = { oauthcallback }
