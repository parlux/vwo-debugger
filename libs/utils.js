//Create a port with background page for continous message communication
var backgroundPageConnection = chrome.runtime.connect({
    name: "vwo-debugger-page"
});

// Listen to messages from the background page
backgroundPageConnection.onMessage.addListener(function (message) {
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
