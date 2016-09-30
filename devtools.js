// Can use
// chrome.devtools.*
// chrome.extension.*

// Create a tab in the devtools area
chrome.devtools.panels.create(
  'VWO',
  'vwo-logo.png',
  'devtools/panel.html',
  function() {} // code runs on panel create
)
