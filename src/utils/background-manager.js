const chromeExtUtils = require('../utils/chrome-ext')

const BackgroundManager = {
  connect: function () {
    return chromeExtUtils.connectToBackgroundPage('vwo-debugger')
  }
}

module.exports = BackgroundManager
