/**
 * @typedef {Object} LinkOptions
 * @property {string} [label]
 * @property {string[]} [classNames]
 * @property {string} [leftIcon] HTML for an optional left icon.
 * @property {string} [rightIcon] HTML for an optional right icon.
 * @property {string} [href]
 * @property {string} [title]
 * @property {string} [target]
 */

/**
 * Create an anchor element.
 * @param {LinkOptions} [options]
 * @returns {HTMLAnchorElement}
 */
module.exports = ({ label, classNames = [], leftIcon = '', rightIcon = '', href, title = '', target = '' } = {}) => {
  const link = document.createElement('a')
  link.classList.add('nc-link', ...classNames)
  if (href != null && href !== '') link.setAttribute('href', href)
  link.setAttribute('target', target)
  if (target === '_blank') link.setAttribute('rel', 'noopener noreferrer')

  if (title) link.title = title

  link.innerHTML = `
    ${leftIcon}
    ${label ? `<span class="label">${label}</span>` : ''}
    ${rightIcon}
    `
  return link
}
