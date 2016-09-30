const chromeUtils = {
  connectToBackgroundPage: (name) => {
    return chrome.runtime.connect({
      name
    })
  },

  sendToInspectedWindow: (message) => {
    chrome.runtime.sendMessage({
      tabId: chrome.devtools.inspectedWindow.tabId,
      code: message.code,
      action: message.action
    })
  }
}

module.exports = chromeUtils
