// Singleton Class to persist the Slack userId throughout the Node.js process
class SlackUser {
    constructor() {
        this.userId = {}
    }
}

module.exports = new SlackUser()
