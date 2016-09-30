// This one acts in the context of the panel in the Dev Tools
//
// Can use
// chrome.devtools.*
// chrome.runtime.*

const Logger = {
  info(...args) {
    const strArgs = args.map(arg => {
      return JSON.stringify(arg)
    })

    chrome.runtime.sendMessage({
      tabId: chrome.devtools.inspectedWindow.tabId,
      code: `console.log(${strArgs})`,
      action: actions.CODE
    })
  }
}
