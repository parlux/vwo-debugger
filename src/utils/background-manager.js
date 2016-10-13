const chromeExtUtils = require('../utils/chrome-ext')
const Logger = require('../utils/logger')
const BackgroundPageConnection = require('../models/background-page-connection')

const BackgroundManager = {
  connect: function () {
    const connection = chromeExtUtils.connectToBackgroundPage('vwo-debugger')
    return new BackgroundPageConnection(connection)
  },

  // setupListeners: function (connection) {
  //   // Listen to messages from the background page
  //   connection.onMessage.addListener(function (message) {
  //     switch (message.action) {
  //       case 'reload':
  //         Logger.info('Page Load Event')
  //         run()
  //         break
  //       case 'navigate':
  //         Logger.info('Page navigation start')
  //         break
  //     }
  //   })
  // }
}

module.exports = BackgroundManager
