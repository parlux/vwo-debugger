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

	const Logger = __webpack_require__(7)
	const BackgroundManager = __webpack_require__(10)
	const VwoService = __webpack_require__(11)

	// Setup the connection to the background page
	BackgroundManager.connect()

	Logger.info('init!!!')

	VwoService.fetchExperiments()
	  .then(function(experiments) {
	    Logger.info('experiments', experiments)
	  })



/***/ },
/* 1 */,
/* 2 */,
/* 3 */
/***/ function(module, exports) {

	const actions = {
	  'CODE': 'code',
	  'FILE': 'file'
	}

	module.exports = actions


/***/ },
/* 4 */,
/* 5 */,
/* 6 */,
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	const actions = __webpack_require__(3)
	const ChromeExt = __webpack_require__(9)

	const logger = {
	  info: function (...args) {
	    const strArgs = args.map(arg => {
	      return JSON.stringify(arg)
	    })

	    ChromeExt.executeCodeInInspectedWindow(
	      `console.log('VWO Debugger:::', ${strArgs})`
	    )
	  }
	}

	module.exports = logger


/***/ },
/* 8 */,
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	// This is the adapter for the chrome extension
	// None of the other modules should know or care
	// about the specific chrome extension methods

	const actions = __webpack_require__(3)

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
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	const chromeExtUtils = __webpack_require__(9)

	const BackgroundManager = {
	  connect: function () {
	    return chromeExtUtils.connectToBackgroundPage('vwo-debugger')
	  }
	}

	module.exports = BackgroundManager


/***/ },
/* 11 */
/***/ function(module, exports) {

	const VwoService = {
	  fetchExperiments: () => {
	    return new Promise((resolve, reject) => {
	      chrome.devtools.inspectedWindow.eval("_vwo_exp", function (experiments, isException) {
	        if (isException) reject('Failed to load experiments')

	        resolve(experiments)
	      })
	    })
	  }
	}

	module.exports = VwoService

/***/ }
/******/ ]);