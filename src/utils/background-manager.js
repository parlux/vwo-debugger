const chromeExtUtils = require('../utils/chrome-ext')
const Logger = require('../utils/logger')
const BackgroundPageConnection = require('../models/background-page-connection')

const BackgroundManager = {
  connect: function () {
    const connection = chromeExtUtils.connectToBackgroundPage('vwo-debugger')
    return new BackgroundPageConnection(connection)

  }
}

module.exports = BackgroundManager
