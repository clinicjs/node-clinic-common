'use strict'

const streamTemplate = require('stream-template')
const header = require('./header')
const askTray = require('./ask-tray')

const main = (opts = {}) => streamTemplate`
  <!DOCTYPE html>
  <html lang="en" class="grid-layout">
    <head>
      <meta charset="utf8">
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <link rel="shortcut icon" type="image/png" href="${opts.favicon}">
      <title>${opts.title}</title>
      <style>${opts.styles}</style>
      ${opts.head}
    </head>
    <body>
      ${header(opts)}
      ${opts.body}
      ${askTray(opts)}
      <script>${opts.script}</script>
    </body>
  </html>
`

module.exports = main
