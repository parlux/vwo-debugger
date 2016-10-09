// This is the main app for the devtools panel
//
// You can read up on how this connects to the background page and
// the inspected window here...it's mildly confusing:
// https://developer.chrome.com/extensions/devtools

const Logger = require('./utils/logger')
const BackgroundManager = require('./utils/background-manager')
const VwoExperiments = require('./components/experiments')
const Utils = require('./utils/chrome-ext')

// Setup the connection to the background page
const backgroundPageConnection = BackgroundManager.connect()

// Listen to messages from the background page
backgroundPageConnection.onMessage.addListener(function (message) {
  Logger.info('Page Load Event')
  if (message.action === 'reload') {
    setTimeout(function() {
      run()
    }, 1000)
  }
})

// Componentize me?
const $reload = document.querySelector('#reload')
$reload.addEventListener('click', () => {
  Logger.info('Reload Click Event')
  run()
})

const $clearCookies = document.querySelector('#cookie-clearer')
$clearCookies.addEventListener('click', () => {
  Logger.info('Clearing cookies for ya')
  Utils.executeCodeInInspectedWindow(`
    console.log('Clearing VWO cookies')
    document.cookie.split(';')
      .filter(f => {
        if (f.match(/_vwo/) || f.match(/_vis_opt/)) return true
      })
      .forEach(cookie => {
        const domain = '.kitchenwarehouse.com.au'
        const expires = 'Thu, 01 Jan 1970 00:00:01 GMT'
        document.cookie = cookie.trim() + ';path=/;domain=' + domain + ';expires=' + expires
      })
    window.location.reload()
  `)
})

function run() {
  Logger.info('Refreshing page :D')
  VwoExperiments().init().then(yum => {
    $contentVille.innerHTML = yum
  })
}

const $contentVille = document.querySelector('#accordion')
run()