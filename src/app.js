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

const $contentVille = document.querySelector('#accordion')

function onLoad() {
  VwoService.fetchData().then(data => {

    for(let experimentId in data.experiments) {
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
            </ul>
          </div>
        </div>
      </div>
    `
    }

    Logger.info(data)
  })
}

onLoad()