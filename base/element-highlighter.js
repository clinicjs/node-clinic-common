const debounce = require('./debounce.js')

const wrapper = document.createElement('div')
wrapper.classList.add('nc-element-highlighter')

wrapper.innerHTML = `
  <div class="nc-element-highlighter-container">
    <div class="nc-element-highlighter-panel nc-element-highlighter-top"></div>
    <div class="nc-element-highlighter-panel nc-element-highlighter-right"></div>
    <div class="nc-element-highlighter-panel nc-element-highlighter-bottom"></div>
    <div class="nc-element-highlighter-panel nc-element-highlighter-left"></div>
  </div>
  <div class="nc-element-highlighter-border"></div>
`
/** @type {HTMLElement} */
const backdropContainer = /** @type {HTMLElement} */ (wrapper.querySelector('.nc-element-highlighter-container'))
/** @type {HTMLElement} */
const backdropTop = /** @type {HTMLElement} */ (wrapper.querySelector('.nc-element-highlighter-top'))
/** @type {HTMLElement} */
const backdropRight = /** @type {HTMLElement} */ (wrapper.querySelector('.nc-element-highlighter-right'))
/** @type {HTMLElement} */
const backdropBottom = /** @type {HTMLElement} */ (wrapper.querySelector('.nc-element-highlighter-bottom'))
/** @type {HTMLElement} */
const backdropLeft = /** @type {HTMLElement} */ (wrapper.querySelector('.nc-element-highlighter-left'))
/** @type {HTMLElement} */
const backdropBorder = /** @type {HTMLElement} */ (wrapper.querySelector('.nc-element-highlighter-border'))

/**
 * @typedef {Object} ElementHighlighterOptions
 * @property {Element | null} element Element to surround, or null for the viewport center.
 * @property {number} [padding]
 * @property {boolean} [showBorder]
 */

/** @type {ElementHighlighterOptions | null} */
let elOptions = null

/** Recalculate backdrop and border styles for the current target. */
function render () {
  if (!elOptions) {
    return
  }
  const { element, padding = 5, showBorder = true } = elOptions

  wrapper.classList.toggle('show-border', showBorder && element !== null)
  const pos = element
    ? element.getBoundingClientRect()
    : {
        top: document.documentElement.clientHeight / 2,
        left: document.documentElement.clientWidth / 2,
        width: 0,
        height: 0
      }

  backdropContainer.style.cssText = 'opacity:0.6;'
  backdropTop.style.cssText = `transform:translate3d(${pos.left - padding}px, calc(-100vh + ${pos.top - padding}px), 0)`
  backdropRight.style.cssText = `transform:translate3d(${pos.left + pos.width + padding}px, ${pos.top - padding}px, 0)`
  backdropBottom.style.cssText = `transform:translate3d(calc(-100vw + ${pos.left + pos.width + padding}px), ${pos.top + pos.height + padding}px, 0)`
  backdropLeft.style.cssText = `transform:translate3d(calc(-100vw + ${pos.left - padding}px), calc(-100vh + ${pos.top + pos.height + padding}px), 0)`

  if (showBorder) {
    backdropBorder.style.cssText = `left:${pos.left - padding}px;top:${pos.top - padding}px;width:${pos.width + padding * 2}px;height:${pos.height + padding * 2}px;`
  }
}

const debRender = debounce(render, 200)

/** @typedef {{ show: (options: ElementHighlighterOptions) => void, hide: () => void }} ElementHighlighter */

/** @type {ElementHighlighter} */
const elementHighLighter = {
  /** @param {ElementHighlighterOptions} options */
  show: options => {
    document.body.appendChild(wrapper)
    wrapper.classList.add('show')
    elOptions = options
    render()

    window.addEventListener('resize', debRender)
    window.addEventListener('scroll', debRender)
  },

  /** Remove the highlight and stop viewport listeners. */
  hide: () => {
    if (wrapper.parentNode) wrapper.parentNode.removeChild(wrapper)
    elOptions = null
    backdropContainer.style.cssText = 'opacity:0.6;'
    wrapper.classList.remove('show')

    window.removeEventListener('resize', debRender)
    window.removeEventListener('scroll', debRender)
  }
}

module.exports = elementHighLighter
