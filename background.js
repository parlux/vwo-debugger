// Chrome automatically creates a background.html page for this to execute.
// This can access the inspected page via executeScript
//
// Can use:
// chrome.tabs.*
// chrome.runtime.*

chrome.runtime.onConnect.addListener(function (devToolsConnection) {
  var devToolsListener = function (message, sender, sendResponse) {
    switch (message.action) {
      case 'code':
        chrome.tabs.executeScript(message.tabId, {code: message.code})
        break
      case 'file':
        chrome.tabs.executeScript(message.tabId, {file: message.file})
        break
      default:
        console.error('Message must have a valid action')
    }
  }

  // Runs when dom content is loaded
  var loadListener = function(details) {
    if (details.frameId === 0) {
      // Send message to devtools panel
      devToolsConnection.postMessage({ action: 'reload' })
    }
  }

  // Listens to messages sent from the devtools panel
  chrome.runtime.onMessage.addListener(devToolsListener);
  chrome.webNavigation.onDOMContentLoaded.addListener(loadListener);

  // Remove listeners
  devToolsConnection.onDisconnect.addListener(function () {
    chrome.runtime.onMessage.removeListener(devToolsListener);
    chrome.webNavigation.onDOMContentLoaded.removeListener(loadListener);
  })
});
