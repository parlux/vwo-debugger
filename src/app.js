// This is the main app for the devtools panel
//
// You can read up on how this connects to the background page and
// the inspected window here...it's mildly confusing:
// https://developer.chrome.com/extensions/devtools

const Logger = require('./utils/logger')
const BackgroundManager = require('./utils/background-manager')
const VwoService = require('./services/vwo')

// Setup the connection to the background page
BackgroundManager.connect()

Logger.info('init!!!')

VwoService.fetchData().then(data => {
  Logger.info(data)
})
