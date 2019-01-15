'use strict'

const close = require('../../icons/close')

const tray = opts => `
  <div class="nc-tray-backdrop"></div>
  <div class="nc-tray">
    <div class="nc-tray__inner">
      <h3>${opts.title}</h3>
      <p>You can get to an expert by running this command:</p>
      <pre class="nc-code">${opts.command}</pre>
      <p>You'll be prompted to login/signup and we will contact you for details about how we can help you with your file analysis.</p>
    </div>
    <button class="nc-button nc-tray__close" type="button">
      <span class="nc-tray__close-icon nc-icon">${close}</span>
    </button>
  </div>
`

module.exports = tray
