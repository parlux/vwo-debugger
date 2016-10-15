class Experiment {
  constructor(data) {
    this.id = data.experiment.id
    this.cookies = data.cookies
    this.name = data.experiment.name
    this.type =data.experiment.type
    this.goals = this.goalsArray(data.experiment.goals)
  }

  combiCookie() {
    return this.cookies[`_vis_opt_exp_${this.id}_combi`]
  }

  goalCookie(goalId) {
    return this.cookies[`_vis_opt_exp_${this.id}_goal_${goalId}`] === '1'
  }

  isActive() {
    return (this.combiCookie()) ? true : false
  }

  variations() {
    if (this.type === 'TRACK') return []
  }

  goalsArray(goals) {
    const goalsArray = []
    for (let goalId in goals) {
      const goal = goals[goalId]
      goal.converted = this.goalCookie(goalId)
      goal.id = goalId
      goalsArray.push(goal)
    }
    return goalsArray
  }
}

module.exports = Experiment