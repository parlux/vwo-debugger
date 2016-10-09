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
      chrome.devtools.inspectedWindow.eval("document.cookie", function (cookiesString, isException) {
        if (isException) reject('Failed to load cookies')

        const cookies = {}

        cookiesString.split(';')
          .filter(cookie => {
            return cookie.match(/_vwo_/) || cookie.match(/_vis_opt_/)
          })
          .forEach(cookie => {
            const foo = cookie.split('=')
            cookies[foo[0].trim()] = foo[1].trim()
          })

        resolve({ vwoCookies: cookies })
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
  },

  fetchData: () => {
    return new Promise((resolve, reject) => {
      const promises = [
        VwoService.fetchExperiments(),
        VwoService.fetchCookies(),
        VwoService.fetchBrowserLocation()
      ]

      Promise.all(promises).then(values => {
        const data = values.reduce((combiner, val) => {
          Object.assign(combiner, val)
          return combiner
        })

        resolve(data)
      })
    })
  }
}

module.exports = VwoService