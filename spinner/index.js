/** @type {Map<Element, number>} Number of attached spinners per container. */
const activeContainers = new Map()
const escapeCssString = require('../lib/escape-css-string.js')

if (typeof window !== 'undefined') {
  window.addEventListener('load', _event => document.body.classList.add('content-ready'))
}

/**
 * @typedef {Object} SpinnerHandle
 * @property {(message?: string) => void} show Show the spinner and optionally set its message.
 * @property {() => void} hide Hide the spinner and release its container.
 */

module.exports = {
  /**
   * Create a spinner associated with a container element.
   * @param {Element} [container=document.body]
   * @returns {SpinnerHandle}
   */
  attachTo: (container = document.body) => {
    const spinner = document.createElement('div')
    let attached = false

    /** @param {string} msg */
    const updateSpinner = msg => {
      const { top, left, width, height } = container.getBoundingClientRect()

      spinner.style.cssText = `
        top:${top}px;
        left:${left}px;
        height:${height}px;
        width:${width}px;
        --loading-message: "${escapeCssString(msg)}";
      `
    }
    return {
      show: (msg = 'Loading file...') => {
        if (attached) {
          updateSpinner(msg)
          return
        }
        const activeCount = activeContainers.get(container) || 0
        if (activeCount === 0) container.classList.add('_loading_spinner_container')
        activeContainers.set(container, activeCount + 1)
        spinner.classList.add('_loading_spinner_')

        updateSpinner(msg)
        document.body.appendChild(spinner)

        attached = true
      },
      hide: () => {
        if (!attached) return
        if (spinner.parentNode) spinner.parentNode.removeChild(spinner)
        const activeCount = /** @type {number} */ (activeContainers.get(container)) - 1
        if (activeCount === 0) {
          activeContainers.delete(container)
          container.classList.remove('_loading_spinner_container')
        } else {
          activeContainers.set(container, activeCount)
        }
        attached = false
      }
    }
  }
}
