const Logger = require('../utils/logger')
const BrowserActions = require('../constants/browser-events')

class BackgroundPageConnection {
  constructor(backgroundPageConnection) {
    this.callbacks = {}

    // Add listener
    backgroundPageConnection.onMessage.addListener(this.onIncomingMessage.bind(this))
  }

  // Prob need a whitelist for these actions...
  onIncomingMessage(message) {
    if (this.callbacks[message.action]) {
      Logger.info('Something should happen here', message.action)
      this.callbacks[message.action].call(this)
    }
  }

  // So what, this sets the callback?
  on(action, cb) {
    this.callbacks[action] = cb
  }
}

module.exports = BackgroundPageConnection
