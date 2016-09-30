/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	const actions = {
	  'CODE': 'code',
	  'FILE': 'file'
	}

	// This one acts in the context of the panel in the Dev Tools
	//
	// Can use
	// chrome.devtools.*
	// chrome.runtime.*

	//Create a port with background page for continous message communication
	var backgroundPageConnection = chrome.runtime.connect({
	  name: "vwo-debugger-page"
	});

	// Listen to messages from the background page
	backgroundPageConnection.onMessage.addListener(function (message) {
	  // Fuck - run is global function from panel...gross right?
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

	// This one acts in the context of the panel in the Dev Tools
	//
	// Can use
	// chrome.devtools.*
	// chrome.runtime.*

	// const Logger = {
	//   info(...args) {
	//     const strArgs = args.map(arg => {
	//       return JSON.stringify(arg)
	//     })
	//
	//     chrome.runtime.sendMessage({
	//       tabId: chrome.devtools.inspectedWindow.tabId,
	//       code: `console.log(${strArgs})`,
	//       action: actions.CODE
	//     })
	//   }
	// }

	Logger = __webpack_require__(1);
	// document.body.innerHTML += 'hi'
	// document.body.innerHTML += JSON.stringify(cats.info('ahah'))

	// This one acts in the context of the panel in the Dev Tools
	//
	// Can use
	// chrome.devtools.*
	// chrome.runtime.*

	const obj1 = { foo: 'sauce' }
	const arr1 = ['hello', 1, obj1]
	const str1 = 'boo'

	Logger.info(str1)
	Logger.info(arr1)
	Logger.info(obj1)

	Logger.info('----')

	Logger.info('mmm', obj1, arr1)

	// const clearButton = document.querySelector('#clearVWOCookies')
	//
	// clearButton.addEventListener('click', clearVWOCookies)
	//
	// function clearVWOCookies() {
	//   utils.injectScript("inserted-scripts/clear-vwo-cookies.js")
	// }
	//
	// let experiments = {}
	// let extras = {}
	//
	// // Run when conversion happens
	// chrome.devtools.network.onRequestFinished.addListener(function (request) {
	//   var vwoConversionGifUrl = 'http://dev.visualwebsiteoptimizer.com/c.gif'
	//
	//   if (request.request.url.indexOf(vwoConversionGifUrl) === 0) {
	//     run()
	//   }
	// })
	//
	// function getVWOExp() {
	//   utils.log('get vwo experiment')
	//   return new Promise((resolve, reject) => {
	//     chrome.devtools.inspectedWindow.eval("_vwo_exp", function (result, isException) {
	//       if (isException) reject()
	//
	//       utils.log(`result: ${result}`)
	//       for (var expId in result) {
	//         utils.log(result)
	//         experiments[expId] = {}
	//
	//         for (var expId2 in result) {
	//           var exp = result[expId]
	//           experiments[expId].name = exp.name
	//           experiments[expId].goals = exp.goals
	//           experiments[expId].combinations = exp.comb_n
	//           experiments[expId].segmentCode = exp.segment_code
	//           experiments[expId].urlRegex = exp.urlRegex
	//           experiments[expId].urlExclude = exp.exclude_url
	//         }
	//       }
	//
	//       resolve()
	//     })
	//   })
	// }
	//
	// function getVWOCookies() {
	//   utils.log('get vwo cookies')
	//   return new Promise((resolve, reject) => {
	//     chrome.devtools.inspectedWindow.eval("document.cookie", (result, isException) => {
	//       if (isException) reject()
	//
	//       const cookies = {}
	//       result.split(';').forEach(cookie => {
	//         cookies[cookie.trim().split('=')[0]] = cookie.trim().split('=')[1]
	//       })
	//
	//       // This needs to run per experiment
	//       for (let expId in experiments) {
	//         experiments[expId].conversions = []
	//         let combi = cookies[`_vis_opt_exp_${expId}_combi`]
	//         experiments[expId].combination = experiments[expId].combinations[combi]
	//
	//         for (goalId in experiments[expId].goals) {
	//           let goal = cookies[`_vis_opt_exp_${expId}_goal_${goalId}`]
	//           if (goal === '1') {
	//             experiments[expId].conversions.push(goalId)
	//           }
	//         }
	//       }
	//
	//       resolve()
	//     })
	//   })
	// }
	//
	// function getUrl() {
	//   utils.log('get url')
	//   return new Promise((resolve, reject) => {
	//     chrome.devtools.inspectedWindow.eval("window.location.href", (result, isException) => {
	//       if (isException) reject()
	//
	//       extras.currentUrl = result
	//       resolve(result)
	//     })
	//   })
	// }
	//
	// function getAllSegments() {
	//   utils.log('get all segments')
	//   return new Promise((resolve, reject) => {
	//
	//     const promises = []
	//     for (const expId in experiments) {
	//       const experiment = experiments[expId]
	//       promises.push(getSegment(experiment.segmentCode, expId))
	//     }
	//
	//     Promise.all(promises).then(values => {
	//       values.forEach(result => {
	//         experiments[result.expId].segmentMatch = result.segmentMatch
	//       })
	//       resolve()
	//     })
	//   })
	// }
	//
	// function getSegment(code, expId) {
	//   utils.log('get segment')
	//   return new Promise((resolve, reject) => {
	//     chrome.devtools.inspectedWindow.eval(code, (result, isException) => {
	//       if (isException) reject()
	//
	//       resolve({expId: expId, segmentMatch: result})
	//     })
	//   })
	// }
	//
	// function run() {
	//   extras = {}
	//   experiments = {}
	//   utils.log('run start')
	//   getVWOExp()
	//     .then(getVWOCookies)
	//     .then(getUrl)
	//     .then(getAllSegments)
	//     .then(() => {
	//       document.querySelector('#foo').innerHTML = ''
	//
	//       utils.log('foobar')
	//
	//       for (const expId in experiments) {
	//         const experiment = experiments[expId]
	//         const variation = experiment.combination ? experiment.combination : 'you\'re not part of test'
	//         const inExperiment = experiment.combination ? 'yes' : 'no'
	//         const conversions = `[ ${experiment.conversions.join(', ')} ]`
	//         const goals = `[ ${Object.keys(experiment.goals).join(', ')} ]`
	//         let validUrl = false
	//         let currentUrl = extras.currentUrl
	//         if (extras.currentUrl[extras.currentUrl.length - 1] === '/') {
	//           currentUrl = extras.currentUrl.substr(0, extras.currentUrl.length - 1)
	//         }
	//         const match1 = currentUrl.replace(/www\./, '').match(experiment.urlRegex)
	//         const match2 = currentUrl.match(experiment.urlRegex)
	//         if (match1 || match2) validUrl = true
	//         if (experiment.urlExclude && currentUrl.match(experiment.urlExclude)) validUrl = false
	//         document.querySelector('#foo').innerHTML += `
	//           <h4 title="id=${expId}">Name: ${experiment.name}</h4>
	//           <dl>
	//             <dt>segment criteria</dt>
	//             <dd>${experiment.segmentCode}</dd>
	//           </dl>
	//           <dl class="${experiment.segmentMatch}">
	//             <dt>are you currently in the segment?</dt>
	//             <dd>${experiment.segmentMatch}</dd>
	//           </dl>
	//           <dl class="${inExperiment}">
	//             <dt>are you in the experiment?</dt>
	//             <dd>${inExperiment}</dd>
	//           </dl>
	//           <dl class="${validUrl}">
	//             <dt>is this url part of the experiment?</dt>
	//             <dd>${validUrl} (${experiment.urlRegex})</dd>
	//           </dl>
	//           <dl>
	//             <dt>variation</dt>
	//             <dd>${variation}</dd>
	//           </dl>
	//           <dl>
	//             <dt>experiment goals</dt>
	//             <dd>${goals}</dd>
	//           </dl>
	//           <dl>
	//             <dt>your conversions</dt>
	//             <dd>${conversions}</dd>
	//           </dl>
	//         `
	//       }
	//     })
	// }
	//
	// run()
	//
	//


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	// This one acts in the context of the panel in the Dev Tools
	//
	// Can use
	// chrome.devtools.*
	// chrome.runtime.*

	const actions = __webpack_require__(2)

	var Logger = {
	  info: function(...args) {
	    const strArgs = args.map(arg => {
	      return JSON.stringify(arg)
	    })

	    chrome.runtime.sendMessage({
	      tabId: chrome.devtools.inspectedWindow.tabId,
	      code: "console.log(" + strArgs + ")",
	      action: actions.CODE
	    })

	    return strArgs
	  }
	}

	module.exports = Logger

/***/ },
/* 2 */
/***/ function(module, exports) {

	const actions = {
	  'CODE': 'code',
	  'FILE': 'file'
	}

	module.exports = actions

/***/ }
/******/ ]);