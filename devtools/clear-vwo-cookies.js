console.log('Clearing VWO cookies')

document.cookie.split(';')
  .filter(f => {
    if (f.match(/_vwo/) || f.match(/_vis_opt/)) return true
  })
  .forEach(cookie => {
    const domain = '.kitchenwarehouse.com.au'
    const expires = 'Thu, 01 Jan 1970 00:00:01 GMT'
    document.cookie = `${cookie.trim()};path=/;domain=${domain};expires=${expires}`
  })

window.location.reload()
