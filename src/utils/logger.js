const actions = require('../constants/actions')
const chromeUtils = require('../utils/chrome-utils')

const logger = {
  info: function (...args) {
    const strArgs = args.map(arg => {
      return JSON.stringify(arg)
    })

    chromeUtils.sendToInspectedWindow({
      code: `console.log('VWO Debugger:::', ${strArgs})`,
      action: actions.CODE
    })
  }
}

module.exports = logger
