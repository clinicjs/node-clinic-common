const debounce = require('lodash.debounce')

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
const backdropContainer = wrapper.querySelector('.nc-element-highlighter-container')
const backdropTop = wrapper.querySelector('.nc-element-highlighter-top')
const backdropRight = wrapper.querySelector('.nc-element-highlighter-right')
const backdropBottom = wrapper.querySelector('.nc-element-highlighter-bottom')
const backdropLeft = wrapper.querySelector('.nc-element-highlighter-left')
const backdropBorder = wrapper.querySelector('.nc-element-highlighter-border')

let elOptions = null

function render () {
  if (!elOptions) {
    elementHighLighter.hide()
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

const elementHighLighter = {
  show: options => {
    document.body.appendChild(wrapper)
    wrapper.classList.add('show')
    elOptions = options
    render()

    window.addEventListener('resize', debRender)
    window.addEventListener('scroll', debRender)
  },

  hide: () => {
    document.body.removeChild(wrapper)
    backdropContainer.style.cssText = 'opacity:0.6;'
    wrapper.classList.remove('show')

    window.removeEventListener('resize', debRender)
    window.removeEventListener('scroll', debRender)
  }
}

module.exports = elementHighLighter
