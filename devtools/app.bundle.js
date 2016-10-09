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

	// This is the main app for the devtools panel
	//
	// You can read up on how this connects to the background page and
	// the inspected window here...it's mildly confusing:
	// https://developer.chrome.com/extensions/devtools

	const Logger = __webpack_require__(1)
	const BackgroundManager = __webpack_require__(4)
	const VwoExperiments = __webpack_require__(6)

	// Setup the connection to the background page
	BackgroundManager.connect()

	// Componentize me?
	const $reload = document.getElementById('reload')
	$reload.addEventListener("click", function() {
	  VwoExperiments().render()
	})

	VwoExperiments().render()

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	const actions = __webpack_require__(2)
	const ChromeExt = __webpack_require__(3)

	const logger = {
	  info: function (...args) {
	    const strArgs = args.map(arg => {
	      return JSON.stringify(arg)
	    })

	    ChromeExt.executeCodeInInspectedWindow(
	      `console.log('VWO Debugger::', ${strArgs})`
	    )
	  }
	}

	module.exports = logger


/***/ },
/* 2 */
/***/ function(module, exports) {

	const actions = {
	  'CODE': 'code',
	  'FILE': 'file'
	}

	module.exports = actions


/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	// This is the adapter for the chrome extension
	// None of the other modules should know or care
	// about the specific chrome extension methods

	const actions = __webpack_require__(2)

	const ChromeExt = {
	  // Establish a long running connection with the
	  // background page
	  connectToBackgroundPage: (name) => {
	    return chrome.runtime.connect({
	      name
	    })
	  },

	  // Sends message to background page, which then
	  // forward the request to the tabId specified here
	  executeCodeInInspectedWindow: (code) => {
	    chrome.runtime.sendMessage({
	      tabId: chrome.devtools.inspectedWindow.tabId,
	      code: code,
	      action: actions.CODE
	    })
	  }
	}

	module.exports = ChromeExt


/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	const chromeExtUtils = __webpack_require__(3)

	const BackgroundManager = {
	  connect: function () {
	    return chromeExtUtils.connectToBackgroundPage('vwo-debugger')
	  }
	}

	module.exports = BackgroundManager


/***/ },
/* 5 */
/***/ function(module, exports) {

	const VwoService = {
	  fetchExperiments: () => {
	    return new Promise((resolve, reject) => {
	      chrome.devtools.inspectedWindow.eval("_vwo_exp", function (experiments, isException) {
	        if (isException) reject('Failed to load experiments')

	        resolve({ experiments: experiments })
	      })
	    })
	  },

	  fetchCookies: () => {
	    return new Promise((resolve, reject) => {
	      chrome.devtools.inspectedWindow.eval("document.cookie", function (cookiesString, isException) {
	        if (isException) reject('Failed to load cookies')

	        const cookies = {}

	        cookiesString.split(';')
	          .filter(cookie => {
	            return cookie.match(/_vwo_/) || cookie.match(/_vis_opt_/)
	          })
	          .forEach(cookie => {
	            const foo = cookie.split('=')
	            cookies[foo[0].trim()] = foo[1].trim()
	          })

	        resolve({ vwoCookies: cookies })
	      })
	    })
	  },

	  fetchBrowserLocation: () => {
	    return new Promise((resolve, reject) => {
	      chrome.devtools.inspectedWindow.eval("window.location", function (location, isException) {
	        if (isException) reject('Failed to load url')

	        resolve({ location: location })
	      })
	    })
	  },

	  fetchData: () => {
	    return new Promise((resolve, reject) => {
	      const promises = [
	        VwoService.fetchExperiments(),
	        VwoService.fetchCookies(),
	        VwoService.fetchBrowserLocation()
	      ]

	      Promise.all(promises).then(values => {
	        const data = values.reduce((combiner, val) => {
	          Object.assign(combiner, val)
	          return combiner
	        })

	        resolve(data)
	      })
	    })
	  }
	}

	module.exports = VwoService

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	const VwoService = __webpack_require__(5)
	const Logger = __webpack_require__(1)

	const experimentsComponent = (experiments) => {
	  const state = {}

	  return {
	    fetchExperiments: () => {
	      state.experiments = VwoService.fetchData()
	    },

	    render: () => {
	      Logger.info('ahhh')
	      const $contentVille = document.querySelector('#accordion')

	      VwoService.fetchData().then(data => {

	        for (let experimentId in data.experiments) {
	          const experiment = data.experiments[experimentId]
	          Logger.info(experimentId, experiment)

	          const combiCookie = data.vwoCookies[`_vis_opt_exp_${experimentId}_combi`]
	          const combiName = experiment.comb_n[combiCookie]

	          $contentVille.innerHTML += `
	            <div class="panel panel-default">
	              <div class="panel-heading" role="tab" id="headingOne">
	                <h4 class="panel-title">
	                  <a class='collapsed' role="button" data-toggle="collapse" href="#collapse${experimentId}">
	                     ${experiment.name} 
	                  </a>
	                </h4>
	              </div>
	              <div id="collapse${experimentId}" class="panel-collapse collapse" role="tabpanel">
	                <div class="panel-body">
	                  <ul>
	                      <li>id: ${experimentId}</li>
	                      <li>cookie: ${combiName}</li>
	                      <li>urlRegex: ${experiment.urlRegex}</li>
	                      <li>in segment?: ${experiment.segment_eligble}</li>
	                      <li>valid url?: ${experiment.ready}</li>
	                  </ul>
	                </div>
	              </div>
	            </div>
	          `
	        }
	      })
	    }
	  }
	}

	module.exports = experimentsComponent

/***/ }
/******/ ]);