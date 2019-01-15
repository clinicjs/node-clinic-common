const postcss = require('postcss')
const postcssImport = require('postcss-import')
const { promisify } = require('util')
const readFile = promisify(require('fs').readFile)

const buildCss = ({ stylePath, debug }) => (
  readFile(stylePath, 'utf8')
    .then((css) => postcss([
      postcssImport()
    ]).process(css, {
      from: stylePath,
      map: this.debug ? { inline: true } : false
    }))
    .then((result) => {
      return result.css
    })
)

module.exports = buildCss
