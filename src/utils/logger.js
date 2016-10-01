const actions = require('../constants/actions')
const ChromeExt = require('../utils/chrome-ext')

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
