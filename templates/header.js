'use strict'

const streamTemplate = require('stream-template')

const header = (opts = {}) => {
  let elapsedTimeSpan = ''
  if (opts.elapsedTime) {
    elapsedTimeSpan = streamTemplate`
      <span>
        <div class="nc-header__elapsed-time">
          Elapsed Time: <strong>${opts.elapsedTime}</strong>
        </div>
      </span>
    `
  }
  return streamTemplate`
  <div class="nc-header">
    <a
      class="nc-header__logo"
      href="${opts.headerLogoUrl}"
      title="${opts.headerLogoTitle}"
      target="_blank"
      rel="noopener noreferrer"
    >
      ${opts.headerLogo}
      <span>
        <div class="nc-header__logo-text">${opts.headerText}</div>
        <div class="nc-header__tool-version">v${opts.toolVersion}</div>
      </span>
      ${elapsedTimeSpan}
    </a>
    <div class="nc-header__inner"></div>
  </div>
`
}

module.exports = header
