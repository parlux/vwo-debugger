// This one acts in the context of the panel in the Dev Tools
//
// Can use
// chrome.devtools.*
// chrome.runtime.*

const clearButton = document.querySelector('#clearVWOCookies')

clearButton.addEventListener('click', clearVWOCookies)

function clearVWOCookies() {
  utils.injectScript("inserted-scripts/clear-vwo-cookies.js")
}

// Need to re-run on a page reload
// Should prob move this to a background listener on page load!
// chrome.devtools.network.onNavigated.addListener(function () {
//   setTimeout(function () {
//     chrome.devtools.inspectedWindow.eval("_vwo_exp", OMG)
//   }, 3000) // ~ until vwo is initialised...ugh
// })


let experiments = {}

// Run when conversion happens
chrome.devtools.network.onRequestFinished.addListener(function (request) {
  var vwoConversionGifUrl = 'http://dev.visualwebsiteoptimizer.com/c.gif'

  if (request.request.url.indexOf(vwoConversionGifUrl) === 0) {
    run()
  }
})

function getVWOExp() {
  return new Promise((resolve, reject) => {
    chrome.devtools.inspectedWindow.eval("_vwo_exp", function(result, isException) {
      if (isException) reject()

      // This needs to be grouped under the experiment
      for (expId in result) {
        experiments[expId] = {}

        for (var expId in result) {
          var exp = result[expId]
          experiments[expId].name = exp.name
          experiments[expId].goals = exp.goals
          experiments[expId].combinations = exp.comb_n
          experiments[expId].activePage = exp.combination_chosen ? true : false
        }
      }

      resolve()
    })
  })
}

function getVWOCookies() {
  return new Promise((resolve, reject) => {
    chrome.devtools.inspectedWindow.eval("document.cookie", (result, isException) => {
      if (isException) reject()

      const cookies = {}
      result.split(';').forEach(cookie => {
        cookies[cookie.trim().split('=')[0]] = cookie.trim().split('=')[1]
      })

      // This needs to run per experiment
      for (let expId in experiments) {
        experiments[expId].conversions = []
        let combi = cookies[`_vis_opt_exp_${expId}_combi`]
        experiments[expId].combination = experiments[expId].combinations[combi]

        for (goalId in experiments[expId].goals) {
          let goal = cookies[`_vis_opt_exp_${expId}_goal_${goalId}`]
          if (goal === '1') {
            experiments[expId].conversions.push(goalId)
          }
        }
      }

      resolve()
    })
  })
}

function run() {
  experiments = {}
  getVWOExp()
    .then(getVWOCookies)
    .then(() => {
      utils.log(experiments)
    })
}

run()


