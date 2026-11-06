/**
 * @typedef {Object} ButtonOptions
 * @property {string | undefined} [label] Button text.
 * @property {string[]} [classNames] Additional CSS classes.
 * @property {string} [leftIcon] HTML for an optional left icon.
 * @property {string} [rightIcon] HTML for an optional right icon.
 * @property {boolean} [disabled]
 * @property {string | undefined} [title]
 * @property {(event: MouseEvent) => void} [onClick]
 */

/**
 * Create a button element.
 * @param {ButtonOptions} [options]
 * @returns {HTMLButtonElement & { update: (options?: ButtonOptions) => void }}
 */
module.exports = (options = {}) => {
  /** @type {HTMLButtonElement & { update: (options?: ButtonOptions) => void }} */
  const button = /** @type {HTMLButtonElement & { update: (options?: ButtonOptions) => void }} */ (document.createElement('button'))
  let btnOptions = { ...options }
  /** @type {((event: MouseEvent) => void) | null | undefined} */
  let clickHandler = null

  /** @param {ButtonOptions} [options] */
  button.update = (options) => {
    btnOptions = Object.assign({}, btnOptions, options)
    _render(btnOptions)
  }

  /** @param {ButtonOptions} options */
  function _render ({ label, classNames = [], leftIcon = '', rightIcon = '', disabled = false, onClick, title = '' }) {
    button.disabled = disabled
    button.title = title
    button.className = ['nc-button', ...classNames].join(' ')

    if (clickHandler !== onClick) {
      if (clickHandler) button.removeEventListener('click', clickHandler)
      if (onClick) button.addEventListener('click', onClick)
      clickHandler = onClick
    }

    button.innerHTML = `
      <span class='nc-button__inner-container'>
      ${leftIcon}
      ${label ? `<span class="nc-button__label">${label}</span>` : ''}
      ${rightIcon}
      </span>
      `
  }

  button.update(options)
  return button
}
