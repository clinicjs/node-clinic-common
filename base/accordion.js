const minusIcon = require('../icons/minus')
const button = require('./button.js')
const container = require('./collapsible-container.js')
const { toHtml } = require('./helpers.js')

/** @typedef {import('./helpers.js').HtmlContent} HtmlContent */

/**
 * @typedef {Object} AccordionOptions
 * @property {string | undefined} [label]
 * @property {string[]} [classNames]
 * @property {boolean} [disabled]
 * @property {(expanded: boolean) => void} [onClick]
 * @property {string} [title]
 * @property {HtmlContent} [content]
 * @property {boolean} [isExpanded]
 */

/**
 * Create an accordion with a toggle button and collapsible content.
 * @param {AccordionOptions} options
 * @returns {HTMLElement & { toggle: (isExpanded?: boolean) => void }}
 */
module.exports = ({ label, classNames = [], disabled = false, onClick, title = '', content = '', isExpanded = false }) => {
  let expanded = false

  /** @type {HTMLElement & { toggle: (isExpanded?: boolean) => void }} */
  const accordion = /** @type {HTMLElement & { toggle: (isExpanded?: boolean) => void }} */ (toHtml(`<div class="${['nc-accordion', ...classNames].join(' ')}"></div>`))

  const btn = button({
    label,
    rightIcon: minusIcon,
    disabled,
    title,
    onClick: () => {
      toggleAccordion()
      onClick && onClick(expanded)
    }
  })

  // injecting another minus-svg to build the animated plus symbol
  const verticalLine = toHtml(minusIcon)
  verticalLine.classList.remove('minus-svg')
  verticalLine.classList.add('vertical-line')
  /** @type {HTMLElement} */
  const buttonContent = /** @type {HTMLElement} */ (btn.querySelector('.nc-button__inner-container'))
  buttonContent.appendChild(verticalLine)

  accordion.appendChild(btn)

  const collapsibleContainer = /** @type {HTMLElement & { toggle: (isExpanded?: boolean) => void }} */ (container({ content }))
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
