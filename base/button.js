module.exports = ({ label, classNames = [], leftIcon = '', rightIcon = '', disabled = false, onClick, title = '' } = {}) => {
  const button = document.createElement('button')
  button.classList.add('nc-button', ...classNames)

  button.disabled = disabled
  button.title = title

  if (onClick) {
    button.addEventListener('click', onClick)
  }
  button.innerHTML = `
    ${leftIcon}
    ${label ? `<span class="label">${label}</span>` : ``}
    ${rightIcon}
    `
  return button
}
