const Logger = require('../utils/logger')

class BackgroundPageConnection {
  constructor(backgroundPageConnection) {
    this.backgroundPageConnection = backgroundPageConnection
  }

  on(action, cb) {
    Logger.info('action', action)
    Logger.info('callback', cb)
  }
}

module.exports = BackgroundPageConnection