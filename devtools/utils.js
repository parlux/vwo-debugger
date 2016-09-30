// This one acts in the context of the panel in the Dev Tools
//
// Can use
// chrome.devtools.*
// chrome.runtime.*

//Create a port with background page for continous message communication
var backgroundPageConnection = chrome.runtime.connect({
    name: "vwo-debugger-page"
});

// Listen to messages from the background page
backgroundPageConnection.onMessage.addListener(function (message) {
  // Fuck - run is global function from panel...gross right?
  if (message.action === 'reload' && run) {
    run()
  }
})

utils = {
  injectScript: function(scriptPath) {
    chrome.runtime.sendMessage({
      tabId: chrome.devtools.inspectedWindow.tabId,
      file: scriptPath
    });
  },

  log: function(message) {
    const cmd = `console.log(${JSON.stringify(message)})`
    chrome.devtools.inspectedWindow.eval(cmd)
  }
}
