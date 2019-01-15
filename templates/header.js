'use strict'

const streamTemplate = require('stream-template')
const speechBubble = require('../icons/speech-bubble')

const header = (opts = {}) => streamTemplate`
  <div id="banner">
    <a
      id="main-logo"
      href="${opts.headerLogoUrl}"
      title="${opts.headerLogoTitle}"
      target="_blank"
      rel="noopener noreferrer"
    >
      ${opts.headerLogo}
      <span>${opts.headerText}</span>
    </a>
    <div id="banner-inner">
      <a
        id="company-logo"
        href="https://nearform.com"
        title="NearForm"
        target="_blank"
        rel="noopener noreferrer"
      >
        ${opts.nearFormLogo}
      </a>
      <button class="nc-button" data-nc-ask-button>
        <span class="nc-icon nc-button__icon">
          ${speechBubble}
        </span>
        <span class="nc-button__text">Ask an expert</span>
      </button>
    </div>
  </div>
`

module.exports = header
