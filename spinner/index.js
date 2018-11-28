if (window) {
  window.addEventListener('load', e => document.body.classList.add('content-ready'))
}

module.exports = {
  show: (msg = 'Loading file') => {
    document.documentElement.style.setProperty('--loading-message', `"${msg}"`)
    document.body.classList.remove('content-ready')
  },
  hide: () => { document.body.classList.add('content-ready') }
}
