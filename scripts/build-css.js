const postcss = require('postcss')
const postcssImport = require('postcss-import')
const { promisify } = require('util')
const readFile = promisify(require('fs').readFile)

const buildCss = async ({ stylePath, debug }) => {
  const css = await readFile(stylePath, 'utf8')
  const result = await postcss([postcssImport()])
    .process(css, {
      from: stylePath,
      map: this.debug ? { inline: true } : false
    })

  return result.css
}
module.exports = buildCss
