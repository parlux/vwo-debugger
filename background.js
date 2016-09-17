// Chrome automatically creates a background.html page for this to execute.
// This can access the inspected page via executeScript
//
// Can use:
// chrome.tabs.*
// chrome.runtime.*

function validateMessageFromDevtools(message) {
  if (!message.tabId) throw "No tabId provided for message"
  if (!message.file) throw "No content provided for message"
}

chrome.runtime.onConnect.addListener(function (devToolsConnection) {
  // Listen to page loads and update the extension
  chrome.webNavigation.onDOMContentLoaded.addListener(function (details) {
    if (details.frameId === 0) {
      devToolsConnection.postMessage({ action: 'reload' })
    }
  })

  // assign the listener function to a variable so we can remove it later
  var devToolsListener = function (message, sender, sendResponse) {
    validateMessageFromDevtools(message)
    chrome.tabs.executeScript(message.tabId, {file: message.file});
  }

  // Listens to messages sent from the panel
  chrome.runtime.onMessage.addListener(devToolsListener);

  devToolsConnection.onDisconnect.addListener(function (devToolsConnection) {
    chrome.runtime.onMessage.removeListener(devToolsListener);
  });

});
