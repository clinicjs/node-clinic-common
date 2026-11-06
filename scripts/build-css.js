const postcss = require('postcss')
const postcssImport = require('postcss-import')
const { promisify } = require('node:util')
const readFile = promisify(require('node:fs').readFile)

/**
 * @typedef {object} BuildCssOptions
 * @property {string} stylePath Path to the entry stylesheet.
 * @property {boolean} [debug] Whether to include an inline source map.
 */

/**
 * Inline stylesheet imports and optionally include a source map.
 * @param {BuildCssOptions} options
 * @returns {Promise<string>} The processed CSS.
 */
const buildCss = async ({ stylePath, debug }) => {
  const css = await readFile(stylePath, 'utf8')
  const result = await postcss([postcssImport()])
    .process(css, {
      from: stylePath,
      map: debug ? { inline: true } : false
    })

  return result.css
}
module.exports = buildCss
