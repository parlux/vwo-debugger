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
      props.comb_n = data.experiment.comb_n

      props.goals = data.experiment.goals
      for (let goalId in props.goals) {
        if (data.cookies[`_vis_opt_exp_${props.id}_goal_${goalId}`] === '1') {
          props.goals[goalId].converted = true
        } else {
          props.goals[goalId].converted = false
        }
      }
    },

    render: () => {
      // Utils.executeCodeInInspectedWindow(`
      //   console.log('Clearing VWO cookies')
      //   document.cookie.split(';')
      //     .filter(f => {
      //       if (f.match(/_vwo/) || f.match(/_vis_opt/)) return true
      //     })
      //     .forEach(cookie => {
      //       const domain = '.kitchenwarehouse.com.au'
      //       const expires = 'Thu, 01 Jan 1970 00:00:01 GMT'
      //       document.cookie = cookie.trim() + ';path=/;domain=' + domain + ';expires=' + expires
      //     })
      //   window.location.reload()
      // `)

      let expList = ''
      let titleClass = ''
      let title = props.name

      if (props.inExperiment) {
        titleClass = 'bg-success'
        expList = '<p>Variations: '
        const variations = []
        for (let combId in props.comb_n) {
          if (props.combiCookie === combId) {
            variations.push(`<span class="goal bg-success">${props.comb_n[combId]}</span>`)
          } else {
            variations.push(`<button data-exp-id="${props.id}" data-variation-id="${combId}" class="btn btn-sm goal">${props.comb_n[combId]}</button>`)
          }
        }
        expList += variations.join(' ')
        expList += '</p><p>Goals: '

        const goals = []
        for(let goalId in props.goals) {
          if(props.goals[goalId].converted) {
            goals.push(`<span class="goal bg-success">${goalId}</span>`)
          } else {
            goals.push(`<span class="goal">${goalId}</span>`)
          }
        }
        expList += goals.join(' ')
        expList += '</p>'

      }



      else if (props.segment_eligble === false) {
        title += ' <small class="text-danger">Segment not matching</small>'
        expList = `
           <p>segment_code: <pre>${props.segment_code}</pre></p>
           <p>segment_code_v2: <pre>${props.segment_code_v2}</pre></p>
        `
      }



      else if (props.segment_eligble && !props.ready && !props.timedout) {
        title += ' <small class="text-danger">URL not matching</small>'
        expList = `
           <p>Your url is not matching!!!</p>
           <p>url regex: <pre>${props.urlRegex}</pre></p>
           <p>url exclude: <pre>Regex: ${props.exclude_url}</pre></p>
        `
      }



      else {
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
         <div id="collapse${props.id}" class="panel-collapse collapse in" role="tabpanel">
           <div class="panel-body">${expList}</div>
         </div>
       </div>
     `
    }
  }

  return methods
}

module.exports = ExperimentComponent