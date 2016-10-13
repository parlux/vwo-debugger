// This is the main app for the devtools panel. Chrome automatically
// creates a background.html page for this to execute.
//
// You can read up on how this connects to the devtools page and
// the inspected window here:
// https://developer.chrome.com/extensions/devtools

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
    // If it's the main tab window, frameId will equal 0
    if (details.frameId === 0) {
      devToolsConnection.postMessage({ action: 'load' })
    }
  }

  var navigateListener = function(details) {
    if (details.frameId === 0) {
      devToolsConnection.postMessage({ action: 'navigate' })
    }
  }

  // Listens to messages sent from the devtools panel
  chrome.runtime.onMessage.addListener(devToolsListener);
  chrome.webNavigation.onBeforeNavigate.addListener(navigateListener);
  chrome.webNavigation.onCompleted.addListener(loadListener);

  // Remove listeners
  devToolsConnection.onDisconnect.addListener(function () {
    chrome.runtime.onMessage.removeListener(devToolsListener);
    chrome.webNavigation.onBeforeNavigate.removeListener(navigateListener);
    chrome.webNavigation.onCompleted.removeListener(loadListener);
  })
});
