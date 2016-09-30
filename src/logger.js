// This one acts in the context of the panel in the Dev Tools
//
// Can use
// chrome.devtools.*
// chrome.runtime.*

const actions = require('./constants')

var Logger = {
  info: function(...args) {
    const strArgs = args.map(arg => {
      return JSON.stringify(arg)
    })

    chrome.runtime.sendMessage({
      tabId: chrome.devtools.inspectedWindow.tabId,
      code: "console.log(" + strArgs + ")",
      action: actions.CODE
    })

    return strArgs
  }
}

module.exports = Logger