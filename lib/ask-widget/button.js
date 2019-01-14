'use strict'

const speechBubble = require('../../icons/speech-bubble')

const button = opts => `
  <button class="nc-button">
    <span class="nc-button__icon">
      ${speechBubble}
    </span>
    ${opts.text}
  </button>
`

module.exports = button
