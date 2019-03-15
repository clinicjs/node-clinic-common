const minusIcon = require('../icons/minus')
const button = require('./button.js')
const container = require('./collapsible-container.js')
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

  const collapsibleContainer = container({ content })
  accordion.appendChild(collapsibleContainer)

  if (isExpanded) {
    toggleAccordion(true)
  }

  accordion.classList.toggle('show-expand-icon', !isExpanded)

  function toggleAccordion (isExpanded = !expanded) {
    expanded = isExpanded
    accordion.classList.toggle('show-expand-icon', !expanded)

    collapsibleContainer.toggle(expanded)
    accordion.classList.toggle('expanded', expanded)
  }

  accordion.toggle = toggleAccordion

  return accordion
}
