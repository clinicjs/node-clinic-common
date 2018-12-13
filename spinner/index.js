if (window) {
  window.addEventListener('load', e => document.body.classList.add('content-ready'))
}

module.exports = {
  attachTo: (container = document.body) => {
    const spinner = document.createElement('div')
    let attached = false

    const updateSpinner = msg => {
      const { top, left, width, height } = container.getBoundingClientRect()

      spinner.style.cssText = `
        top:${top}px;
        left:${left}px;
        height:${height}px;
        width:${width}px;
        --loading-message: "${msg}";
      `
    }
    return {
      show: (msg = 'Loading file...') => {
        if (attached) {
          updateSpinner(msg)
          return
        }
        container.classList.add('_loading_spinner_container')
        spinner.classList.add('_loading_spinner_')

        updateSpinner(msg)
        document.body.appendChild(spinner)

        attached = true
      },
      hide: () => {
        document.body.removeChild(spinner)
        container.classList.remove('_loading_spinner_container')
        attached = false
      }
    }
  }
}
