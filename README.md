# Salesforce Slack Starter Kit

Before looking into this project, we recommend you look into [FOYER](https://developer.salesforce.com/blogs/2021/09/introducing-foyer-native-slack-integration-for-the-salesforce-platform) (currently in pilot for ISV). Be sure to check back Salesforce [developer blog](https://developer.salesforce.com/blogs) regularly for announcements on future milestones of FOYER.

If you decide to build your custom, Slack App integrated into Salesforce for some reason. This project can help you get started. 

### Current Limitation

Multiple salesforce org connections to the single slack workspace are not supported. Note that FOYER will support this feature.

# About the Project

The project provides an opinionated minimum scaffold for developers wanting to build Slack Apps using [Bolt SDK](https://api.slack.com/tools/bolt) (Node.js version) and have requirements to integrate the Slack App to Salesforce data.

The app follows the monorepo approach and has a Slack App implemented using Bolt SDK (Node.js) and the Salesforce metadata for managing user mappings and authentication between Salesforce and Slack workspace in one repo. The scaffold provides configuration files to host and run the app on Heroku.

Setting up of the Salesforce and Heroku Instance is automated to cut down number of manual configurations required to set up development environments.

We also configure environment variables required for local development, debugging, and testing.

# App Architecture

The below image shows the systems involved in the application.

![App Architecture](./docs/images/app_architecture.png)

Heroku acts as middleware and hosts the Node.js app that connects to Slack APIs and Salesforce APIs. Heroku App is stateless and does not persists any Salesforce data or metadata.

You will need to allocate an integration user in Salesforce to manage user mappings between Slack and Salesforce. This mapping is securely stored in the Slack Authentication object.

Credentials needed to establish the first-time connection to Salesforce for user mapping between Salesforce and Slack is managed through Heroku environment variables.

## Installation

## Prerequisites

You will need the following to deploy this sample app.

- `git` (download [here](https://git-scm.com/downloads))
- `node` >= 14 (download [here](https://nodejs.org/en/download/))
- Salesforce Dev Hub
  - If you don't have one, [sign up](https://developer.salesforce.com/signup) for a Developer Edition org and then follow the [instructions](https://help.salesforce.com/articleView?id=sfdx_setup_enable_devhub.htm&type=5) to enable Dev Hub.
- `sfdx` CLI >= sfdx-cli/7.129.0 (download [here](https://developer.salesforce.com/tools/sfdxcli))
- Heroku account ([signup](https://signup.heroku.com))
- `heroku` CLI (download [here](https://devcenter.heroku.com/articles/heroku-cli))

## App Deploy and Set up

### Configuring Slack App

1. Open [https://api.slack.com/apps/new](https://api.slack.com/apps/new) and choose "From an app manifest"
2. Choose the workspace you want to install the application to
3. Copy the contents of [manifest.yml](./apps/slack-salesforce-starter-app/manifest.YAML) into the text box that says `*Paste your manifest code here*` and click _Next_
4. Review the configuration and click _Create_
5. Now click _Install to Workspace_ and _Allow_ on the screen that follows. You'll be redirected to the App Configuration dashboard.

### Script to Set up Salesforce Org and Heroku Environment with code and config

The [`scripts/deploy.js`](./scripts/deploy.js) file is what automates all the deploys and
integrates them with various configuration values.

You can choose between one of the options below for establishing an initial salesforce connection (server to server connection without user intervention) for managing user mappings between Salesforce and Slack:

1. [OAuth 2.0 JWT Bearer Flow for Server-to-Server Integration](https://help.salesforce.com/s/articleView?id=sf.remoteaccess_oauth_jwt_flow.htm&type=5). You will need to specify a dev hub, and the script will create a scratch org for you, in which the needed connected app and certificates will be automatically created.
1. [Username Password Flow (SOAP API)](https://developer.salesforce.com/docs/atlas.en-us.api.meta/api/sforce_api_calls_login.htm). You will need to specify your org's username, password and login URL. No connected app is created.

Note that the later should only be used for testing purposes as it's considered insecure.

The script automates the steps below:

- Creation of scratch org for Salesforce development (if using JWT bearer flow).
- Creation, Deployment and set up of Heroku instance. The environment variables are automatically configured to connect to Salesforce.
- Setup and deploy Connected Apps for authorization between Salesforce and Slack App hosted on Heroku (if using JWT bearer flow).
- Deployment of Salesforce metadata for storing user mappings between Salesforce and Slack user

Follow the following instructions to set up your development environment:

```console
$ sfdx auth:web:login -d -a DevHub  # Authenticate using your Dev Hub org credentials (only needed if using JWT bearer flow)
$ heroku login  # Login with your Heroku account (or create one)
$ git clone https://github.com/developerforce/salesforce-slack-starter-kit
$ cd salesforce-slack-starter-kit/scripts
$ npm install
$ cd ..
$ node scripts/deploy.js
```

#### Setting Heroku environment variables for Slack

1. During the set up process, the script will prompt you to enter value for `SLACK_BOT_TOKEN`. To enter this value open your apps configuration page from [this list](https://api.slack.com/apps), click _OAuth & Permissions_ in the left hand menu, then copy the value in _Bot User OAuth Token_ and paste into terminal.

2. The script will prompt you for slack signing secret `SLACK_SIGNING_SECRET`. To enter this value open your apps configuration page from [this list](https://api.slack.com/apps), click _Basic Information_ and scroll to the section _App Credentials_ and click show button and copy the _Signing Secret_ and paste into terminal.

### Set Heroku Instance in your Slack App

This is the last step, you will need to enter the corrent Heroku Instance url in Slack App.

- To enter this value open your apps configuration page from [this list](https://api.slack.com/apps), click _App Manifest_. Find the `request_url` fields in the manifest and modify it to replace `heroku-app` with your actual heroku domain name. Note at the end of this step your url should look like `https://<heroku-domain>.herokuapp.com/slack/events`

### Directory Structure

```bash
├── force-app             # Folder that holds Salesforce metadata types
├── scripts
|   ├── deploy            # Scripts to automate scratch org creation, heroku 
|   |                     #environment 
│   ├── deploy.js         # Automated Deploy script launch file
│   └── templates         # Template for Connected apps setup
├── apps
     ├── slack-salesforce-starter-app # Node.js Slack app
        ├── config              # Configs for Slack app
        |── listeners           # Modules to listen event for actions, 
        |                       # shotcuts and view events in Slack          
        |── middleware          # Middleware for Salesforce 
        |                       # Authentication using OAuth 2.0 Web based flow
        |── routes              # Route for OAuth callback
        |
        ├── app.js              # Main file for Slack app launch
        ├── user-interface      # User Interface folder for Home page 
        |                       # Modals and Messages in Block Kit format
        |                    
        ├── salesforcelib       # Folder for Salesforce related code
              ├── connect.js    # Module to establish Salesforce connection
        ├── manifest.YAML       # Slack app manifest file
        ├── Procfile            # Heroku Procfile for deployment
```

## How to Build and Deploy Code

- For Salesforce metadata synchronization use `sfdx force:source:pull` to retrieve and `sfdx force:source:push` to deploy metadata from orgs to local project folder `force-app`

- For Node.js app for Slack using Bolt SDK use below steps
   - cd into apps/slack-salesforce-starter-ap folder `cd apps/slack-salesforce-starter-app`
   - add git remote to app repo using `heroku git:remote -a <heroku app name>`
   - run `git push heroku main` to push code to Heroku

## Local Development

- For local Development, first make sure to deploy the app on Heroku as listed in the above section.
- Authenticate to Salesforce from the app home page by clicking on `Authorize with Salesforce` button.
- Once successfully authenticated, perform below steps :
    1. Navigate to [config file](apps/slack-salesforce-starter-app/config/config.js), and enable socket mode by uncommenting the socketMode and appToken in config file. 
              
                `
                const slack = {
                  ......
                  port: process.env.PORT || 3000, 
                  socketMode: true,
                  appToken: process.env.SLACK_APP_TOKEN
                };
                `
    2. Generate an App Level Token in the Slack App by navigating to your Slack app at api.slack.com and scrolling to the section App-Level Tokens
    3. Populate the .env file with `SLACK_APP_TOKEN` variable obtained in previous step
    4. cd into apps/slack-salesforce-starter-ap folder `cd apps/slack-salesforce-starter-app`
    5. Run `npm install`
    6. Run `node app.js`

At this point you should see the Node.js app recieving events from Slack directly in VSCode terminal.

## How to Test the Salesforce Connection

To test the app, make sure to run the Global Shortcut command `Whoami` that ships with the app as shown in the below screenshot

![Global shortcut](./docs/images/global_shortcut_who_am_i.png)

Successful connection output

![Successful Output](./docs/images/who_am_i_output.png)

Note: the command can fail the first time you execute it because the heroku app may be sleeping.

## Considerations for Production app

- For production application change the `SF_LOGIN_URL` from 'https://test.salesforce.com' to `https://login.salesforce.com`

- Generate private key and certificates using open SSL as documented in the Salesforce (docs)[https://developer.salesforce.com/docs/atlas.en-us.sfdx_dev.meta/sfdx_dev/sfdx_dev_auth_key_and_cert.htm] and change environment variables in Heroku to use new private key, consumer key and client secret obtained from the connected app in Salesforce.

- Heroku Free Dynos sleep if left ideal. For Production application prefer paid Dynos.

## Troubleshooting

- Connected apps activation takes couple minutes, so in case the app is failing with 400 error for JWT auth, wait for 2 minutes and give a retry.
- If the app is failing, tail Heroku logs to see any errors

## Further Reference

- [Bolt Family of SDKs](https://api.slack.com/tools/bolt)
- [Block Builder](https://www.npmjs.com/package/slack-block-builder)
