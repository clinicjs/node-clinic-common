'use strict'

/// <reference path="../types/stream-template.d.ts" />

const streamTemplate = require('stream-template')
const escapeHtml = require('../lib/escape-html.js')

// headerLogo is an intentional raw SVG/HTML fragment; only pass trusted markup.
/**
 * @typedef {Object} HeaderTemplateOptions
 * @property {string} [headerLogoUrl] URL for the logo link.
 * @property {string} [headerLogoTitle] Accessible/title text for the logo link.
 * @property {import('stream-template').Interpolation} [headerLogo] Trusted HTML/SVG markup or a stream/promise producing it.
 * @property {string} [headerText] Header label.
 * @property {string | number} [toolVersion] Version shown in the header.
 * @property {string | number} [elapsedTime] Optional elapsed-time label.
 */

/**
 * Render the common header as a readable stream.
 * @param {HeaderTemplateOptions} [opts]
 * @returns {import('node:stream').Readable}
 */
const header = (opts = {}) => {
  /** @type {string | import('node:stream').Readable} */
  let elapsedTimeSpan = ''
  if (opts.elapsedTime) {
    elapsedTimeSpan = streamTemplate`
      <span>
        <div class="nc-header__elapsed-time">
        Elapsed Time: <strong>${escapeHtml(opts.elapsedTime)}</strong>
        </div>
      </span>
    `
  }
  return streamTemplate`
  <div class="nc-header">
    <a
      class="nc-header__logo"
      href="${escapeHtml(opts.headerLogoUrl)}"
      title="${escapeHtml(opts.headerLogoTitle)}"
      target="_blank"
      rel="noopener noreferrer"
    >
      ${opts.headerLogo}
      <span>
        <div class="nc-header__logo-text">${escapeHtml(opts.headerText)}</div>
        <div class="nc-header__tool-version">v${escapeHtml(opts.toolVersion)}</div>
      </span>
      ${elapsedTimeSpan}
    </a>
    <div class="nc-header__inner"></div>
  </div>
`
}

module.exports = header
