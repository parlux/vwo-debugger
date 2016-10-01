const VwoService = {
  fetchExperiments: () => {
    return new Promise((resolve, reject) => {
      chrome.devtools.inspectedWindow.eval("_vwo_exp", function (experiments, isException) {
        if (isException) reject('Failed to load experiments')

        resolve(experiments)
      })
    })
  }
}

module.exports = VwoService