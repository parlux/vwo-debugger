const VwoService = require('../services/vwo')
const Experiment  = require('./experiment')

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