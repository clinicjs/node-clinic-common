const caretRight = require('../icons/caret-right')
const button = require('./button.js')
const { toHtml } = require('./helpers.js')

/** @typedef {import('./helpers.js').HtmlContent} HtmlContent */

/**
 * The open pointer is the content node, whose `.nc-dropdown` ancestor carries
 * the dropdown-specific `close()` method.
 * @typedef {HTMLElement & { closest: (selector: '.nc-dropdown') => HTMLElement & { close: () => void } }} DropdownContentElement
 * @typedef {HTMLElement & {
 *   update: (options?: { label?: DropdownOptions['label'], content?: DropdownOptions['content'] }) => void,
 *   open: () => void,
 *   close: () => void
 * }} DropdownElement
 */

/** @type {DropdownContentElement | null} */
let currentlyExpandedDropDown = null

// Closes when the user clicks outside the dropdown content.
document.body.addEventListener('click', /** @param {Event} event */ (event) => {
  const target = /** @type {Element} */ (event.target)
  if (target.closest('.nc-dropdown-content-wrapper') !== currentlyExpandedDropDown) closeCurrentlyExpandedDropDown()
})

/** Close the currently expanded dropdown, if there is one. */
function closeCurrentlyExpandedDropDown () {
  currentlyExpandedDropDown && currentlyExpandedDropDown.closest('.nc-dropdown').close()
}

/**
 * @typedef {Object} DropdownOptions
 * @property {HtmlContent | null} [label]
 * @property {string[]} [classNames]
 * @property {boolean} [disabled]
 * @property {boolean} [expandAbove]
 * @property {HtmlContent | null} [content]
 */
/** @typedef {{ label?: DropdownOptions['label'] | undefined, content?: DropdownOptions['content'] | undefined }} DropdownUpdateOptions */

/**
 * Create a dropdown with a label, toggle button, and content region.
 * @param {DropdownOptions} [options]
 * @returns {HTMLElement & {
 *   update: (options?: DropdownUpdateOptions) => void,
 *   open: () => void,
 *   close: () => void
 * }}
 */
module.exports = ({ label, classNames = [], disabled = false, expandAbove = false, content } = {}) => {
  let ddContent = content
  /** @type {DropdownElement} */
  const wrapper = /** @type {DropdownElement} */ (/** @type {unknown} */ (document.createElement('div')))
  wrapper.classList.add('nc-dropdown', ...classNames)
  wrapper.classList.toggle('direction-up', expandAbove)

  const labelWrapper = document.createElement('div')
  labelWrapper.classList.add('label-wrapper')

  wrapper.appendChild(labelWrapper)

  wrapper.appendChild(button({
    disabled,
    leftIcon: caretRight,
    onClick: e => {
      e.stopPropagation()

      if (wrapper.classList.contains('expanded')) {
        wrapper.close()
      } else {
        wrapper.open()
      }
    }
  }))

  /** @param {DropdownUpdateOptions} [options] @returns {void} */
  wrapper.update = (options = {}) => {
    if (Object.hasOwn(options, 'label')) {
      const { label } = options
      const labelHtml = toHtml(label == null ? '' : label, 'label')
      labelWrapper.innerHTML = ''
      labelWrapper.appendChild(labelHtml)
    }

    if (Object.hasOwn(options, 'content')) {
      ddContent = options.content
      updateContent()
    }
  }

  wrapper.addEventListener('animationend', event => {
    if (event.target !== wrapper) return
    wrapper.classList.toggle('contracted', false)
  })

  /** @type {DropdownContentElement} */
  const contentWrapper = /** @type {DropdownContentElement} */ (document.createElement('div'))
  contentWrapper.classList.add('nc-dropdown-content-wrapper')
  contentWrapper.classList.add('scroll-container')

  /** Close this dropdown. */
  wrapper.close = () => {
    wrapper.classList.remove('expanded')
    wrapper.classList.toggle('contracted', true)
    if (currentlyExpandedDropDown === contentWrapper) currentlyExpandedDropDown = null
  }
  /** Open this dropdown, closing any other open dropdown. */
  wrapper.open = () => {
    closeCurrentlyExpandedDropDown()
    updateContent()
    wrapper.classList.remove('contracted')
    wrapper.classList.add('expanded')

    currentlyExpandedDropDown = contentWrapper
  }

  /** Render the current content into the dropdown region. */
  function updateContent () {
    contentWrapper.innerHTML = ''
    if (ddContent) {
      contentWrapper.appendChild(toHtml(ddContent))
    }
  }

  wrapper.appendChild(contentWrapper)
  wrapper.update({ label })
  return wrapper
}
