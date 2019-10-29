module.exports = ({ label, classNames = [], leftIcon = '', rightIcon = '', href, title = '', target = '' } = {}) => {
  const link = document.createElement('a')
  link.classList.add('nc-link', ...classNames)
  link.setAttribute('href', href)
  link.setAttribute('target', target)

  if (title) link.title = title

  link.innerHTML = `
    ${leftIcon}
    ${label ? `<span class="label">${label}</span>` : ''}
    ${rightIcon}
    `
  return link
}
