#!/usr/bin/env node

/**
 * @fileoverview
 * Compiles our icons into static .js files that can be imported in the browser
 * and are tree-shakeable.
 * The static .js files go in icons/{filename}.js.
 * Also generates an icons.js that exports all icons by file-name, but is not tree-shakeable
 */

// Largely inspired by: https://github.com/simple-icons/simple-icons

const indexFile = `${__dirname}/../icons.js`
const iconsDir = `${__dirname}/../assets`
const exportDir = `${__dirname}/../icons`
const mdIconsMap = `${exportDir}/icons.md`

const fs = require('fs')

const svgs = {}
const svgContent = []
fs.readdir(iconsDir, function (err, items) {
  if (err) {
    console.error(err)
  } else {
    const files = items.filter(file => file.indexOf('.svg') > 0)
    files.forEach((file, i) => {
      const svg = fs.readFileSync(`${iconsDir}/${file}`, 'utf8')
      const fileName = file.split('.')[0]
      svgs[fileName] = svg
      svgContent.push({ file, svg })
      fs.writeFileSync(
        `${exportDir}/${fileName}.js`,
        `module.exports = \`${svg}\`\n`
      )
    })

    fs.writeFileSync(mdIconsMap, svgContent.map(f => f.svg).join('\n'))
  }

  // write our generic index.js
  fs.writeFileSync(indexFile, `module.exports = ${JSON.stringify(svgs)}\n`)
})
