const VwoService = require('../services/vwo')
const Experiment  = require('./experiment')
const Logger = require('../utils/logger')

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