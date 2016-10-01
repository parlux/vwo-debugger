// This is the adapter for the chrome extension
// None of the other modules should know or care
// about the specific chrome extension methods

const actions = require('../constants/actions')

const ChromeExt = {
  // Establish a long running connection with the
  // background page
  connectToBackgroundPage: (name) => {
    return chrome.runtime.connect({
      name
    })
  },

  // Sends message to background page, which then
  // forward the request to the tabId specified here
  executeCodeInInspectedWindow: (code) => {
    chrome.runtime.sendMessage({
      tabId: chrome.devtools.inspectedWindow.tabId,
      code: code,
      action: actions.CODE
    })
  }
}

module.exports = ChromeExt
