class BackgroundPageConnection {
  constructor(backgroundPageConnection) {
    this.callbacks = {}
    backgroundPageConnection.onMessage.addListener(this.onIncomingMessage.bind(this))
  }

  onIncomingMessage(message) {
    if (this.callbacks[message.action]) this.callbacks[message.action].call(this)
  }

  on(action, cb) {
    this.callbacks[action] = cb
  }
}

module.exports = BackgroundPageConnection
