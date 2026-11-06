/**
 * @fileoverview
 * Compiles our icons into static .js files that can be imported in the browser
 * and are tree-shakeable.
 * The static .js files go in icons/{filename}.js.
 * Also generates an icons.js that exports all icons by file-name, but is not tree-shakeable
 */

// Largely inspired by: https://github.com/simple-icons/simple-icons
const path = require('node:path')
const fs = require('node:fs')

/**
 * @typedef {object} BuildSvgsOptions
 * @property {string} [assetsDir] Directory containing SVG files and style.css.
 * @property {string} [exportDir] Directory to receive generated icon modules and styles.
 */

/**
 * Compile SVG assets into individual modules, styles, a readme, and an index.
 * The export directory must already exist.
 * @param {BuildSvgsOptions} [options]
 * @returns {Promise<void>} Resolves after all generated files have been written.
 * @throws {NodeJS.ErrnoException} If an input or output filesystem operation fails.
 */
async function buildSvgs ({ assetsDir = path.join(__dirname, '../assets'), exportDir = path.join(__dirname, '../icons') } = {}) {
  const indexFile = path.join(exportDir, 'index.js')
  const mdIconsMap = path.join(exportDir, 'readme.md')
  /** @type {string[]} */
  const svgs = []

  /** @type {string[]} */
  const items = await fs.promises.readdir(assetsDir)
  /** @type {string[]} */
  const files = items.filter(file => path.extname(file).toLowerCase() === '.svg')
  files.forEach(file => {
    // reading the file and removing any line break
    const svg = fs.readFileSync(path.join(assetsDir, file), 'utf8').replace(/(\r\n\t|\n|\r\t)/gm, '')
    const fileName = path.basename(file, path.extname(file))

    const svgTag = svg.replace('<svg ', `<svg class="icon-img ${fileName}-svg" `)

    svgs.push(`[${JSON.stringify(fileName)}]: ${JSON.stringify(svgTag)}`)
    fs.writeFileSync(
      path.join(exportDir, `${fileName}.js`),
      `module.exports = ${JSON.stringify(svgTag)}\n`
    )

    fs.writeFileSync(
      path.join(exportDir, `${fileName}.css`),
      `html { --${fileName}-icon: url('data:image/svg+xml;utf8,${encodeURIComponent(svg).replace(/'/g, '%27')}');}\n`
    )
  })

  const md = files.map(f => `|${path.basename(f, path.extname(f))}|<img src="../assets/${f}?sanitize=true" width="100%" height="44" />|`).join('\n')
  fs.writeFileSync(mdIconsMap, `| Name | icon |\n|---|---|\n${md}`)

  // write our generic index.js
  fs.copyFileSync(path.join(assetsDir, 'style.css'), path.join(exportDir, 'style.css'))

  fs.writeFileSync(indexFile, `
module.exports = {
  ${svgs.join(',')}\n
  }\n`)
}

module.exports = buildSvgs
