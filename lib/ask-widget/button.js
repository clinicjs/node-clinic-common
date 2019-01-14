'use strict'

const speechBubble = require('../../icons/speech-bubble')

const button = opts => `
  <button class="nc-button">
    <span class="nc-button__icon">
      ${speechBubble}
    </span>
    <span class="nc-button__text">${opts.text}</span>
  </button>
`

module.exports = button
