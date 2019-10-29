module.exports = (options = {}) => {
  const button = document.createElement('button')
  const btnOptions = options

  if (btnOptions.onClick) {
    button.addEventListener('click', btnOptions.onClick)
  }

  button.update = (options) => {
    _render(Object.assign({}, btnOptions, options))
  }

  function _render ({ label, classNames = [], leftIcon = '', rightIcon = '', disabled = false, onClick, title = '' }) {
    button.disabled = disabled
    button.title = title
    button.className = ['nc-button', ...(options.classNames || [])].join(' ')

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
