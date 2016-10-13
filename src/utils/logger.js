const actions = require('../constants/actions')
const ChromeExt = require('../utils/chrome-ext')

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
