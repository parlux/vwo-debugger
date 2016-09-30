// This is the main app for the devtools panel
//
// You can read up on how this connects to the background page and
// the inspected window here...it's mildly confusing:
// https://developer.chrome.com/extensions/devtools

const logger = require('./utils/logger')
const chromeUtils = require('./utils/chrome-utils')

// Setup the connection to the background page
chromeUtils.connectToBackgroundPage('vwo-debugger')

logger.info('init!!!')
