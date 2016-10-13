// This is the main app for the devtools panel
//
// You can read up on how this connects to the background page and
// the inspected window here...it's mildly confusing:
// https://developer.chrome.com/extensions/devtools

const Logger = require('./utils/logger')
const BackgroundManager = require('./utils/background-manager')
const VwoExperiments = require('./components/experiments')
const Utils = require('./utils/chrome-ext')
const BrowserActions = require('./constants/browser-events')

// Setup the connection to the background page
const backgroundPageConnection = BackgroundManager.connect()
backgroundPageConnection.on(BrowserActions.LOAD, run)
backgroundPageConnection.on(BrowserActions.NAVIGATE, clear)

// Run when conversion happens
chrome.devtools.network.onRequestFinished.addListener(function (request) {
  var vwoConversionGifUrl = 'http://dev.visualwebsiteoptimizer.com/c.gif'

  if (request.request.url.indexOf(vwoConversionGifUrl) === 0) {
    run()
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

// This needs to move to experiments
function clear() {
  $contentVille.innerHTML = "Loading..."
}

// I think just contentVille lives here.
function run() {
  Logger.info('Running :D')
  VwoExperiments().init().then(yum => {
    $contentVille.innerHTML = yum

    const $switchee = document.querySelectorAll('.goal.btn')
    const expId = $switchee[0].dataset.expId
    const variationId = $switchee[0].dataset.variationId

    // Memory leak?
    // This upadates the cookie to put you in an experiment
    $switchee[0].addEventListener('click', () => {
      Utils.executeCodeInInspectedWindow(`
        console.log('Magic cookie hacking!')
        var today = new Date()
        document.cookie = '_vis_opt_exp_${expId}_combi=${variationId};path=/;domain=.kitchenwarehouse.com.au;expires=Thu, 01 Jan ' + (today.getFullYear() + 1) + ' 00:00:00 GMT'
        window.location.reload()
      `)
    })
  })
}

const $contentVille = document.querySelector('#accordion')
run()