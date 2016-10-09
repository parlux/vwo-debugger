const VwoService = require('./services/vwo')

const experimentsComponent = (experiments) => {
  const state = {}

  return {
    fetchExperiments: () => {
      state.experiments = VwoService.fetchData()
    },

    render: () => {
      return `<p>Hello</p>`
    }
  }
}

module.exports = experimentsComponent