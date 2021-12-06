const { App, LogLevel } = require('@slack/bolt');
const config = require('./config/config');
const { registerListeners } = require('./listeners');
const { registerCustomRoutes } = require('./routes');
const SlackWebClient = require('./store/bolt-web-client');

let logLevel;
switch (process.env.LOG_LEVEL) {
    case 'debug':
        logLevel = LogLevel.DEBUG;
        break;
    case 'info':
        logLevel = LogLevel.INFO;
        break;
    case 'warn':
        logLevel = LogLevel.WARN;
        break;
    case 'error':
        logLevel = LogLevel.ERROR;
        break;
    default:
        logLevel = LogLevel.INFO;
}

// Initializes your app with your bot token and signing secret
const app = new App({
    ...config.slack,
    customRoutes: registerCustomRoutes(),
    logLevel
});

// Register Listeners
registerListeners(app);

// Assign Slack WebClient
SlackWebClient.client = app.client;

// Asynchronous function to start the app
(async () => {
    try {
        // Start your app
        await app.start(process.env.PORT || 3000);
        console.log('⚡️ Bolt app is running!');
    } catch (error) {
        console.error('Unable to start App', error);
        process.exit(1);
    }
})();
