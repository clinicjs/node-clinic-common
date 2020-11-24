'use strict'

const streamTemplate = require('stream-template')
const header = require('./header')
/* eslint-disable multiline-ternary */
const main = (opts = {}) => streamTemplate`
  <!DOCTYPE html>
  <html lang="en" class="${opts.htmlClass}">
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <link rel="shortcut icon" type="image/png" href="${opts.favicon}">
      <title>${opts.title}</title>
      <style>${opts.styles}</style>
      ${opts.head}
    </head>
    <body class="${opts.bodyClass}">
      ${header(opts)}
      ${opts.body}
      ${opts.data ? streamTemplate`
        <script type="application/json" id="clinic-data">${opts.data}</script>
      ` : ''}
      <script>${opts.script}</script>
    </body>
  </html>
`
/* eslint-enable multiline-ternary */
module.exports = main
