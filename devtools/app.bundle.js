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
	const InspectedTabManager = __webpack_require__(6)
	const VwoExperiments = __webpack_require__(9)
	const Utils = __webpack_require__(3)
	const BrowserActions = __webpack_require__(8)

	const backgroundPageConnection = BackgroundManager.connect()
	backgroundPageConnection.on(BrowserActions.LOAD, renderApp)
	backgroundPageConnection.on(BrowserActions.NAVIGATE, clear)

	const inspectedTabConnection = InspectedTabManager.connect()
	inspectedTabConnection.on(BrowserActions.NETWORK_REQUEST, (request) => {
	  const vwoConversionUrl = 'http://dev.visualwebsiteoptimizer.com/c.gif'
	  if (request.request.url.includes(vwoConversionUrl)) renderApp()
	})

	// const $clearCookies = document.querySelector('#cookie-clearer')
	// $clearCookies.addEventListener('click', () => {
	//   Logger.info('Clearing cookies for ya')
	//   Utils.executeCodeInInspectedWindow(`
	//     console.log('Clearing VWO cookies')
	//     document.cookie.split(';')
	//       .filter(f => {
	//         if (f.match(/_vwo/) || f.match(/_vis_opt/)) return true
	//       })
	//       .forEach(cookie => {
	//         const domain = '.kitchenwarehouse.com.au'
	//         const expires = 'Thu, 01 Jan 1970 00:00:01 GMT'
	//         document.cookie = cookie.trim() + ';path=/;domain=' + domain + ';expires=' + expires
	//       })
	//     window.location.reload()
	//   `)
	// })

	// This needs to move to experiments
	function clear() {
	  $contentVille.innerHTML = "Loading..."
	}

	// I think just contentVille lives here.
	function renderApp() {
	  Logger.info('Running :D')
	  $contentVille.innerHTML = "Loading..."
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
	renderApp()

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	const actions = __webpack_require__(2)
	const ChromeExt = __webpack_require__(3)

	const logger = {
	  info: function (...args) {
	    chrome.storage.sync.get({ debug: false }, items => {
	      if (items.debug) {
	        const strArgs = args.map(arg => {
	          return (typeof(arg) === 'function') ? arg.toString() : JSON.stringify(arg)
	        })

	        ChromeExt.executeCodeInInspectedWindow(
	          `console.log('VWO Debugger::', ${strArgs})`
	        )
	      }
	    });
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
	const Logger = __webpack_require__(1)
	const BackgroundPageConnection = __webpack_require__(5)

	const BackgroundManager = {
	  connect: function () {
	    const connection = chromeExtUtils.connectToBackgroundPage('vwo-debugger')
	    return new BackgroundPageConnection(connection)
	  }
	}

	module.exports = BackgroundManager


/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	const Logger = __webpack_require__(1)

	class BackgroundPageConnection {
	  constructor(backgroundPageConnection) {
	    this.callbacks = {}
	    backgroundPageConnection.onMessage.addListener(this.onIncomingMessage.bind(this))
	  }

	  onIncomingMessage(message) {
	    Logger.info('message', message)
	    if (this.callbacks[message.action]) this.callbacks[message.action].call(this)
	  }

	  on(action, cb) {
	    Logger.info('action', action)
	    this.callbacks[action] = cb
	  }
	}

	module.exports = BackgroundPageConnection


/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	const InspectedTabConnection = __webpack_require__(7)

	const InspectedTabManager = {
	  connect: function () {
	    return new InspectedTabConnection()
	  }
	}

	module.exports = InspectedTabManager


/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	const BrowserActions = __webpack_require__(8)

	class BackgroundPageConnection {
	  constructor() {
	    this.callbacks = {}

	    chrome.devtools.network.onRequestFinished.addListener(this.onNetworkRequest.bind(this))
	  }

	  onNetworkRequest(request) {
	    if (this.callbacks[BrowserActions.NETWORK_REQUEST]) {
	      this.callbacks[BrowserActions.NETWORK_REQUEST].call(this, request)
	    }
	  }

	  on(action, cb) {
	    this.callbacks[action] = cb
	  }
	}

	module.exports = BackgroundPageConnection


/***/ },
/* 8 */
/***/ function(module, exports) {

	const browserActions = {
	  'LOAD': 'load',
	  'NAVIGATE': 'navigate',
	  'NETWORK_REQUEST': 'network_request'
	}

	module.exports = browserActions


/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	const VwoService = __webpack_require__(10)
	const Experiment  = __webpack_require__(11)
	const Logger = __webpack_require__(1)

	const ExperimentsComponent = () => {
	  const methods = {
	    init: () => {
	      Logger.info('Experiments#init')
	      return methods.fetchVwoData()
	        .then(methods.render)
	    },

	    fetchVwoData: () => {
	      return VwoService.fetchData()
	    },

	    render: (vwoData) => {
	      Logger.info('Experiments#render')
	      let htmlString = ''

	      for(let experimentId in vwoData.experiments) {
	        const experiment = Object.assign({ id: experimentId }, vwoData.experiments[experimentId])
	        htmlString += Experiment().init({ experiment, cookies: vwoData.vwoCookies, location: vwoData.location })
	      }

	      if (htmlString === '') {
	        return "Looks like there ain't no VWO goals around town"
	      } else {
	        return htmlString
	      }
	    }
	  }

	  return methods
	}

	module.exports = ExperimentsComponent

/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	const Logger = __webpack_require__(1)

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


	  fetchData: () => {
	    return new Promise((resolve, reject) => {
	      const promises = [
	        VwoService.fetchExperiments(),
	        VwoService.fetchCookies(),
	      ]

	      Promise.all(promises).then(values => {
	        Logger.info('All data1')
	        const data = values.reduce((combiner, val) => {
	          Object.assign(combiner, val)
	          return combiner
	        })

	        Logger.info('All data', data)
	        resolve(data)
	      }).catch(function() {
	        resolve({})
	      })
	    })
	  }
	}

	module.exports = VwoService

/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	const Logger = __webpack_require__(1)

	const ExperimentComponent = () => {
	  const props = {}

	  const methods = {
	    init: (data) => {
	      Logger.info('Experiment#init')
	      methods.setProps(data)
	      return methods.render()
	    },

	    setProps: (data) => {
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
	      Logger.info('Render EXPERIMENT')
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
	                ${props.id}: ${title}
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