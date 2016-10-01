const VwoService = {
  fetchExperiments: () => {
    return new Promise((resolve, reject) => {
      chrome.devtools.inspectedWindow.eval("_vwo_exp", function (experiments, isException) {
        if (isException) reject('Failed to load experiments')

        resolve({ experiments: experiments })
      })
    })
  },

  fetchCookies: () => {
    return new Promise((resolve, reject) => {
      chrome.devtools.inspectedWindow.eval("document.cookie", function (cookies, isException) {
        if (isException) reject('Failed to load cookies')

        resolve({ cookies: cookies })
      })
    })
  },

  fetchBrowserLocation: () => {
    return new Promise((resolve, reject) => {
      chrome.devtools.inspectedWindow.eval("window.location", function (location, isException) {
        if (isException) reject('Failed to load url')

        resolve({ location: location })
      })
    })
  }
}

module.exports = VwoService