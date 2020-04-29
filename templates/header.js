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
      <span class="nc-header__logo-text">${opts.headerText}</span>
    </a>
    <div class="nc-header__inner">
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
