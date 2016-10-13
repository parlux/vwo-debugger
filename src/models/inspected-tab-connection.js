const BrowserActions = require('../constants/browser-events')

class BackgroundPageConnection {
  constructor() {
    this.callbacks = {}

    chrome.devtools.network.onRequestFinished.addListener(this.onNetworkRequest.bind(this))
  }

  onNetworkRequest(request) {
    if (this.callbacks[BrowserActions.NETWORK_REQUEST]) {
      this.callbacks[BrowserActions.NETWORK_REQUEST].call(this, request)
    }
  }

  on(action, cb) {
    this.callbacks[action] = cb
  }
}

module.exports = BackgroundPageConnection
