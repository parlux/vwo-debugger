class Experiment {
  constructor(data) {
    this.id = data.experiment.id
    this.cookies = data.cookies
    this.name = data.experiment.name
  }

  combiCookie() {
    return this.cookies[`_vis_opt_exp_${this.id}_combi`]
  }

  isActive() {
    return (this.combiCookie()) ? true : false
  }
}

module.exports = Experiment