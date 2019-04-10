'use strict'

const streamTemplate = require('stream-template')
const close = require('../icons/close')

const askTray = opts => streamTemplate`
  <div class="nc-tray-backdrop" data-nc-ask-tray-backdrop></div>
  <div class="nc-tray">
    <div class="nc-tray__inner">
      <h3>Ask an expert</h3>
      <p>Need help understanding this output?</p>
      <p>You can make up to 5 free Ask requests per month during early access. This gives you up to an hour of free analysis per month, provided by the world leaders in Node.js.</p>
      <p>Full Terms and Conditions are on the <a href="https://clinicjs.org">Clinic.js</a> site.</p>
      <p>Submit your request by running this command:</p>
      <pre class="nc-code">clinic ask ${opts.uploadId}</pre>
      <p>
        You'll be prompted to login/signup and we'll contact you for details about how we can help with your file analysis.
      </p>
    </div>
    <button class="nc-button nc-tray__close" data-nc-ask-tray-close>
      <span class="nc-tray__close-icon nc-icon">${close}</span>
    </button>
  </div>
`

module.exports = askTray
