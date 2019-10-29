const { toHtml } = require('./helpers.js')

module.exports = ({ content = '', classNames = [], isExpanded = false }) => {
  let expanded = false

  const contentWrapper = toHtml(`<div class="${['nc-collapsible-container', ...classNames].join(' ')}"></div>`)

  const innerContentWrapper = toHtml('<div class="nc-collapsible-container__inner-content-wrapper"></div>')
  innerContentWrapper.appendChild(toHtml(content))
  contentWrapper.appendChild(innerContentWrapper)

  contentWrapper.addEventListener('transitionend', onTransitionEnd)

  function onTransitionEnd () {
    if (!expanded) {
      contentWrapper.classList.remove('expanded')
    } else {
      contentWrapper.style.cssText = 'height:auto;'
    }
  }
  function toggle (isExpanded = !expanded) {
    expanded = isExpanded

    if (expanded) {
      contentWrapper.classList.add('expanded')
      contentWrapper.style.cssText = `height:${contentWrapper.scrollHeight}px;`
    } else {
      contentWrapper.style.cssText = `height:${contentWrapper.scrollHeight}px;`
      const justToForceRedraw = contentWrapper.offsetWidth // eslint-disable-line no-unused-vars
      contentWrapper.style.cssText = 'height:0px;'
    }

    // if the element is not visible when expanded then the transitionend event doesn't get triggered
    if (contentWrapper.offsetParent === null) {
      onTransitionEnd()
    }
  }

  contentWrapper.toggle = toggle

  if (isExpanded) {
    toggle(true)
    contentWrapper.style.cssText = 'height:auto;'
  }

  return contentWrapper
}
