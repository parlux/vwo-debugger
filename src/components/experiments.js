const VwoService = require('../services/vwo')
const Logger = require('../utils/logger')

const experimentsComponent = (experiments) => {
  const state = {}

  return {
    fetchExperiments: () => {
      state.experiments = VwoService.fetchData()
    },

    render: () => {
      Logger.info('ahhh')
      const $contentVille = document.querySelector('#accordion')

      VwoService.fetchData().then(data => {

        for (let experimentId in data.experiments) {
          const experiment = data.experiments[experimentId]
          Logger.info(experimentId, experiment)

          const combiCookie = data.vwoCookies[`_vis_opt_exp_${experimentId}_combi`]
          const combiName = experiment.comb_n[combiCookie]

          $contentVille.innerHTML += `
            <div class="panel panel-default">
              <div class="panel-heading" role="tab" id="headingOne">
                <h4 class="panel-title">
                  <a class='collapsed' role="button" data-toggle="collapse" href="#collapse${experimentId}">
                     ${experiment.name} 
                  </a>
                </h4>
              </div>
              <div id="collapse${experimentId}" class="panel-collapse collapse" role="tabpanel">
                <div class="panel-body">
                  <ul>
                      <li>id: ${experimentId}</li>
                      <li>cookie: ${combiName}</li>
                      <li>urlRegex: ${experiment.urlRegex}</li>
                      <li>in segment?: ${experiment.segment_eligble}</li>
                      <li>valid url?: ${experiment.ready}</li>
                  </ul>
                </div>
              </div>
            </div>
          `
        }
      })
    }
  }
}

module.exports = experimentsComponent