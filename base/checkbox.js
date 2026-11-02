const checkboxCheckedIcon = require('../icons/checkbox-checked')
const checkboxUncheckedIcon = require('../icons/checkbox-unchecked')
const checkboxIndeterminedIcon = require('../icons/checkbox-indetermined')

/**
 * @typedef {Object} CheckboxOptions
 * @property {string} [leftLabel]
 * @property {string} [rightLabel]
 * @property {string[]} [classNames]
 * @property {boolean} [checked]
 * @property {boolean} [disabled]
 * @property {boolean} [indeterminate]
 * @property {(event: Event) => void} [onChange]
 */

/**
 * Create a checkbox wrapped in its label element.
 * @param {CheckboxOptions} [options]
 * @returns {HTMLLabelElement}
 */
module.exports = ({ leftLabel, rightLabel, classNames = [], checked = false, disabled = false, indeterminate = false, onChange } = {}) => {
  const wrappingLabel = document.createElement('label')
  wrappingLabel.classList.add('nc-checkbox', ...classNames)

  wrappingLabel.innerHTML = `
        <input type="checkbox"
          ${disabled ? 'disabled' : ''}
          ${checked ? 'checked' : ''}
        >
        ${leftLabel ? `
        <span class="copy-wrapper">
          <span class="checkbox-copy-label">${leftLabel}</span>
        </span>` : ''}

        <span class="icon-wrapper">
          ${checkboxCheckedIcon}
          ${checkboxUncheckedIcon}
          ${checkboxIndeterminedIcon}
        </span>
        ${rightLabel ? `
        <span class="copy-wrapper">
          <span class="checkbox-copy-label">${rightLabel}</span>
        </span>` : ''}
    `

  /** @type {HTMLInputElement} */
  const input = /** @type {HTMLInputElement} */ (wrappingLabel.querySelector('input'))
  input.indeterminate = indeterminate

  if (onChange) {
    input.addEventListener('change', onChange)
  }
  return wrappingLabel
}
