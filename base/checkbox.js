const checkboxCheckedIcon = require('../icons/checkbox-checked')
const checkboxUncheckedIcon = require('../icons/checkbox-unchecked')
const checkboxIndeterminedIcon = require('../icons/checkbox-indetermined')

module.exports = ({ leftLabel, rightLabel, classNames = [], checked = false, disabled = false, indeterminate = false, onChange } = {}) => {
  const wrappingLabel = document.createElement('label')
  wrappingLabel.classList.add('nc-checkbox', ...classNames)
  /* eslint-disable multiline-ternary */
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
  /* eslint-enable multiline-ternary */
  const input = wrappingLabel.querySelector('input')
  input.indeterminate = indeterminate

  if (onChange) {
    input.addEventListener('change', onChange)
  }
  return wrappingLabel
}
