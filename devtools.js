// Can use
// chrome.devtools.*
// chrome.extension.*

// Create a tab in the devtools area
chrome.devtools.panels.create("VWO", "toast.png", "panels/panel.html", function(panel) {});