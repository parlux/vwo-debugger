// This is the main app for the devtools panel
//
// You can read up on how this connects to the background page and
// the inspected window here...it's mildly confusing:
// https://developer.chrome.com/extensions/devtools

const Logger = require('./utils/logger')
const BackgroundManager = require('./utils/background-manager')
const VwoExperiments = require('./components/experiments')

// Setup the connection to the background page
BackgroundManager.connect()

// Componentize me?
const $reload = document.getElementById('reload')
$reload.addEventListener("click", function() {
  VwoExperiments().init()
})

const $contentVille = document.querySelector('#accordion')
VwoExperiments().init().then(yum => {
  $contentVille.innerHTML = yum
})

