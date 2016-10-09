const Logger = require('../utils/logger')

const ExperimentComponent = () => {
  const props = {}

  const methods = {
    init: (data) => {
      methods.setProps(data)
      return methods.render()
    },

    setProps: (data) => {
      Logger.info(data)
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
    },

    render: () => {
      let expList = ''
      let titleClass = ''
      let title = props.name
      if (props.inExperiment) {
        titleClass = 'bg-success'
        expList = `
           <p>You are currently seeing <code>${props.variation}</code></p>
        `
      } else if (props.segment_eligble === false) {
        title += ' <small class="text-danger">Segment not matching</small>'
        expList = `
           <p>segment_code: <pre>${props.segment_code}</pre></p>
           <p>segment_code_v2: <pre>${props.segment_code_v2}</pre></p>
        `
      } else if (props.segment_eligble && !props.ready && !props.timedout) {
        title += ' <small class="text-danger">URL not matching</small>'
        expList = `
           <p>Your url is not matching!!!</p>
           <p>url regex: <pre>${props.urlRegex}</pre></p>
           <p>url exclude: <pre>Regex: ${props.exclude_url}</pre></p>
        `
      } else {
        title += 'Something has gone wrong :('
      }
      return `
       <div class="panel panel-default">
         <div class="panel-heading ${titleClass}" id="headingOne">
           <h4 class="panel-title">
             <a class='collapsed' role="button" data-toggle="collapse" href="#collapse${props.id}">
                ${title}
             </a>
           </h4>
         </div>
         <div id="collapse${props.id}" class="panel-collapse collapse" role="tabpanel">
           <div class="panel-body">${expList}</div>
         </div>
       </div>
     `
    }
  }

  return methods
}

module.exports = ExperimentComponent