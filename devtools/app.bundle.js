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
	const Utils = __webpack_require__(3)

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

	function run() {
	  Logger.info('Refreshing page :D')
	  VwoExperiments().init().then(yum => {
	    $contentVille.innerHTML = yum

	    // Memory leak?
	    const $switchee = document.querySelectorAll('.goal.btn')
	    const expId = $switchee[0].dataset.expId
	    const variationId = $switchee[0].dataset.variationId
	    Logger.info('Swtichee', expId, variationId)
	    $switchee[0].addEventListener('click', () => {
	      // document.cookie = '_vis_opt_exp_32_combi=1;path=/;domain=.kitchenwarehouse.com.au;expires=Thu, 01 Jan 2017 00:00:00 GMT'
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
	const Experiment  = __webpack_require__(7)

	const ExperimentsComponent = () => {
	  const methods = {
	    init: () => {
	      return methods.fetchVwoData()
	        .then(methods.render)
	    },

	    fetchVwoData: () => {
	      return VwoService.fetchData()
	    },

	    render: (vwoData) => {
	      const $contentVille = document.querySelector('#accordion')

	      let foo = ''

	      for(let experimentId in vwoData.experiments) {
	        const experiment = Object.assign({ id: experimentId }, vwoData.experiments[experimentId])
	        foo += Experiment().init({ experiment, cookies: vwoData.vwoCookies, location: vwoData.location })
	      }

	      return foo
	    }
	  }

	  return methods
	}

	module.exports = ExperimentsComponent

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	const Logger = __webpack_require__(1)

	const ExperimentComponent = () => {
	  const props = {}

	  const methods = {
	    init: (data) => {
	      methods.setProps(data)
	      return methods.render()
	    },

	    setProps: (data) => {
	      Logger.info(data)
	      props.id = data.experiment.id
	      props.combiCookie = data.cookies[`_vis_opt_exp_${props.id}_combi`]
	      props.inExperiment = props.combiCookie ? true : false
	      props.variation = data.experiment.comb_n[props.combiCookie]
	      props.segment_eligble = data.experiment.segment_eligble
	      props.segment_code = data.experiment.segment_code
	      props.segment_code_v2 = data.experiment.segment_code_v2
	      props.urlRegex = data.experiment.urlRegex
	      props.exclude_url = data.experiment.exclude_url
	      props.name = data.experiment.name
	      props.ready = data.experiment.ready
	      props.timedout = data.experiment.timedout
	      props.comb_n = data.experiment.comb_n

	      props.goals = data.experiment.goals
	      for (let goalId in props.goals) {
	        if (data.cookies[`_vis_opt_exp_${props.id}_goal_${goalId}`] === '1') {
	          props.goals[goalId].converted = true
	        } else {
	          props.goals[goalId].converted = false
	        }
	      }
	    },

	    render: () => {
	      // Utils.executeCodeInInspectedWindow(`
	      //   console.log('Clearing VWO cookies')
	      //   document.cookie.split(';')
	      //     .filter(f => {
	      //       if (f.match(/_vwo/) || f.match(/_vis_opt/)) return true
	      //     })
	      //     .forEach(cookie => {
	      //       const domain = '.kitchenwarehouse.com.au'
	      //       const expires = 'Thu, 01 Jan 1970 00:00:01 GMT'
	      //       document.cookie = cookie.trim() + ';path=/;domain=' + domain + ';expires=' + expires
	      //     })
	      //   window.location.reload()
	      // `)

	      let expList = ''
	      let titleClass = ''
	      let title = props.name

	      if (props.inExperiment) {
	        titleClass = 'bg-success'
	        expList = '<p>Variations: '
	        const variations = []
	        for (let combId in props.comb_n) {
	          if (props.combiCookie === combId) {
	            variations.push(`<span class="goal bg-success">${props.comb_n[combId]}</span>`)
	          } else {
	            variations.push(`<button data-exp-id="${props.id}" data-variation-id="${combId}" class="btn btn-sm goal">${props.comb_n[combId]}</button>`)
	          }
	        }
	        expList += variations.join(' ')
	        expList += '</p><p>Goals: '

	        const goals = []
	        for(let goalId in props.goals) {
	          if(props.goals[goalId].converted) {
	            goals.push(`<span class="goal bg-success">${goalId}</span>`)
	          } else {
	            goals.push(`<span class="goal">${goalId}</span>`)
	          }
	        }
	        expList += goals.join(' ')
	        expList += '</p>'

	      }



	      else if (props.segment_eligble === false) {
	        title += ' <small class="text-danger">Segment not matching</small>'
	        expList = `
	           <p>segment_code: <pre>${props.segment_code}</pre></p>
	           <p>segment_code_v2: <pre>${props.segment_code_v2}</pre></p>
	        `
	      }



	      else if (props.segment_eligble && !props.ready && !props.timedout) {
	        title += ' <small class="text-danger">URL not matching</small>'
	        expList = `
	           <p>Your url is not matching!!!</p>
	           <p>url regex: <pre>${props.urlRegex}</pre></p>
	           <p>url exclude: <pre>Regex: ${props.exclude_url}</pre></p>
	        `
	      }



	      else {
	        title += 'Something has gone wrong :('
	      }





	      return `
	       <div class="panel panel-default">
	         <div class="panel-heading ${titleClass}" id="headingOne">
	           <h4 class="panel-title">
	             <a class='collapsed' role="button" data-toggle="collapse" href="#collapse${props.id}">
	                ${title}
	             </a>
	           </h4>
	         </div>
	         <div id="collapse${props.id}" class="panel-collapse collapse in" role="tabpanel">
	           <div class="panel-body">${expList}</div>
	         </div>
	       </div>
	     `
	    }
	  }

	  return methods
	}

	module.exports = ExperimentComponent

/***/ }
/******/ ]);