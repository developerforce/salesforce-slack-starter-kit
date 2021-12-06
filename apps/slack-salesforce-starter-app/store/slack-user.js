// Singleton Class to persist the Slack userId throughout the Node.js process
// After OAuth
class SlackUser {
    constructor() {
        this.userId = {}
    }
}

module.exports = new SlackUser()
