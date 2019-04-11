'use strict'

const streamTemplate = require('stream-template')
const close = require('../icons/close')

const askTray = opts => streamTemplate`
  <div class="nc-tray-backdrop" data-nc-ask-tray-backdrop></div>
  <div class="nc-tray nc-light-on-dark">
    <div class="nc-tray__inner">
      <h3>Ask an expert</h3>
      <p>You can get to an expert by running this command:</p>
      <pre class="nc-code">clinic ask ${opts.uploadId}</pre>
      <p>
        You'll be prompted to login/signup and we will contact you for details
        about how we can help you with your file analysis.
      </p>
    </div>
    <button class="nc-button nc-tray__close" data-nc-ask-tray-close>
      <span class="nc-tray__close-icon nc-icon">${close}</span>
    </button>
  </div>
`

module.exports = askTray
