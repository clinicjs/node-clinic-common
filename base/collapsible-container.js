const { toHtml } = require('./helpers.js')

/** @typedef {import('./helpers.js').HtmlContent} HtmlContent */

/**
 * @typedef {Object} CollapsibleContainerOptions
 * @property {HtmlContent} [content]
 * @property {string[]} [classNames]
 * @property {boolean} [isExpanded]
 */

/**
 * Create a height-animated content container.
 * @param {CollapsibleContainerOptions} options
 * @returns {HTMLElement & { toggle: (isExpanded?: boolean) => void }}
 */
module.exports = ({ content = '', classNames = [], isExpanded = false }) => {
  let expanded = false

  /** @type {HTMLElement & { toggle: (isExpanded?: boolean) => void }} */
  const contentWrapper = /** @type {HTMLElement & { toggle: (isExpanded?: boolean) => void }} */ (toHtml(`<div class="${['nc-collapsible-container', ...classNames].join(' ')}"></div>`))

  const innerContentWrapper = toHtml('<div class="nc-collapsible-container__inner-content-wrapper"></div>')
  innerContentWrapper.appendChild(toHtml(content))
  contentWrapper.appendChild(innerContentWrapper)

  contentWrapper.addEventListener('transitionend', onTransitionEnd)

  /** @param {TransitionEvent} [event] */
  function onTransitionEnd (event) {
    if (event && (event.target !== contentWrapper || (event.propertyName && event.propertyName !== 'height'))) return
    if (!expanded) {
      contentWrapper.classList.remove('expanded')
    } else {
      contentWrapper.style.cssText = 'height:auto;'
    }
  }
  /** @param {boolean} [isExpanded] */
  function toggle (isExpanded = !expanded) {
    expanded = isExpanded

    if (expanded) {
      contentWrapper.classList.add('expanded')
      contentWrapper.style.cssText = `height:${contentWrapper.scrollHeight}px;`
    } else {
      contentWrapper.style.cssText = `height:${contentWrapper.scrollHeight}px;`
      void contentWrapper.offsetWidth // eslint-disable-line no-void -- force a layout read before collapsing
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
