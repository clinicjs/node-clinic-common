'use strict'

/// <reference path="../types/stream-template.d.ts" />

const streamTemplate = require('stream-template')
const header = require('./header')
const escapeHtml = require('../lib/escape-html.js')

// head, styles, body, and script are intentional raw fragments and must be trusted.
/**
 * @typedef {import('stream-template').Interpolation} TemplateValue
 * @typedef {NonNullable<Parameters<typeof header>[0]> & {
 *   htmlClass?: string,
 *   bodyClass?: string,
 *   favicon?: string,
 *   title?: string,
 *   styles?: TemplateValue,
 *   head?: TemplateValue,
 *   body?: TemplateValue,
 *   script?: TemplateValue,
 *   data?: string
 * }} MainTemplateOptions
 */

/**
 * Render a complete HTML document as a readable stream.
 * @param {MainTemplateOptions} [opts]
 * @returns {import('node:stream').Readable}
 */
const main = (opts = {}) => streamTemplate`
  <!DOCTYPE html>
  <html lang="en" class="${escapeHtml(opts.htmlClass)}">
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <link rel="shortcut icon" type="image/png" href="${escapeHtml(opts.favicon)}">
      <title>${escapeHtml(opts.title)}</title>
      <style>${opts.styles}</style>
      ${opts.head}
    </head>
    <body class="${escapeHtml(opts.bodyClass)}">
      ${header(opts)}
      ${opts.body}
      ${opts.data ? streamTemplate`
        <script type="application/json" id="clinic-data">${String(opts.data).replace(/</g, '\\u003c')}</script>
      ` : ''}
      <script>${opts.script}</script>
    </body>
  </html>
`

module.exports = main
