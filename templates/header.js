'use strict'

const streamTemplate = require('stream-template')
const speechBubble = require('../icons/speech-bubble')

const header = (opts = {}) => streamTemplate`
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
        <div class="nc-header__tool-version">${opts.toolVersion}</div>
      </span>
    </a>
    <div class="nc-header__inner">
      <a
        class="nc-header__sponsor"
        href="https://nearform.com"
        title="NearForm"
        target="_blank"
        rel="noopener noreferrer"
      >
        ${opts.nearFormLogo}
      </a>
      <button class="nc-ask-button" data-nc-ask-button>
        <span class="nc-icon nc-ask-button__icon">
          ${speechBubble}
        </span>
        <span class="nc-ask-button__text">Ask an expert</span>
      </button>
    </div>
  </div>
`

module.exports = header
