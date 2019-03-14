const minusIcon = require('../icons/minus')
const button = require('./button.js')
const { toHtml } = require('./helpers.js')

module.exports = ({ label, classNames = [], disabled = false, onClick, title = '', content = '', isExpanded = false }) => {
  let expanded = false

  const accordion = toHtml(`<div class="${['nc-accordion', ...classNames].join(' ')}"></div>`)

  const btn = button({
    label,
    rightIcon: minusIcon,
    onClick: () => {
      toggleAccordion()
      onClick && onClick(expanded)
    }
  })

  // injecting another minus-svg to build the animated plus symbol
  const verticalLine = toHtml(minusIcon)
  verticalLine.classList.remove('minus-svg')
  verticalLine.classList.add('vertical-line')
  btn.querySelector('.nc-button__inner-container').appendChild(verticalLine)

  accordion.appendChild(btn)
  const contentWrapper = toHtml('<div class="nc-accordion__content-wrapper"></div>')
  const innerContentWrapper = toHtml('<div class="nc-accordion__inner-content-wrapper"></div>')
  innerContentWrapper.appendChild(toHtml(content))
  contentWrapper.appendChild(innerContentWrapper)
  accordion.appendChild(contentWrapper)

  contentWrapper.addEventListener('transitionend', () => {
    if (!expanded) {
      accordion.classList.remove('expanded')
    } else {
      contentWrapper.style.cssText = 'height:auto;'
    }
  })

  function toggleAccordion (isExpanded = !expanded) {
    expanded = isExpanded
    accordion.classList.toggle('show-expand-icon', !expanded)

    if (expanded) {
      accordion.classList.add('expanded')
      contentWrapper.style.cssText = `height:${contentWrapper.scrollHeight}px;`
    } else {
      contentWrapper.style.cssText = `height:${contentWrapper.scrollHeight}px;`
      const justToForceRedraw = contentWrapper.offsetWidth // eslint-disable-line no-unused-vars
      contentWrapper.style.cssText = `height:0px;`
    }
  }

  accordion.toggle = toggleAccordion

  if (isExpanded) {
    toggleAccordion(true)
    contentWrapper.style.cssText = 'height:auto;'
  }
  accordion.classList.toggle('show-expand-icon', !isExpanded)

  return accordion
}
