#!/usr/bin/env node

/**
 * @fileoverview
 * Compiles our icons into static .js files that can be imported in the browser
 * and are tree-shakeable.
 * The static .js files go in icons/{filename}.js.
 * Also generates an icons.js that exports all icons by file-name, but is not tree-shakeable
 */

// Largely inspired by: https://github.com/simple-icons/simple-icons

const exportDir = `${__dirname}/../icons`
const indexFile = `${exportDir}/index.js`
const iconsDir = `${__dirname}/../assets`
const mdIconsMap = `${exportDir}/readme.md`

const fs = require('fs')

const svgs = []
fs.readdir(iconsDir, function (err, items) {
  if (err) {
    console.error(err)
  } else {
    const files = items.filter(file => file.indexOf('.svg') > 0)
    files.forEach((file, i) => {
      const svg = fs.readFileSync(`${iconsDir}/${file}`, 'utf8')
      const fileName = file.split('.')[0]

      const svgTag = svg.replace('<svg ', `<svg class="icon-img ${fileName}-svg" `)

      svgs.push(`['${fileName}'] : \`${svgTag}\``)
      fs.writeFileSync(
        `${exportDir}/${fileName}.js`,
        `module.exports = \`${svgTag}\`\n`
      )
    })

    const md = files.map(f => `|${f.split('.')[0]}|<img src="../assets/${f}?sanitize=true" width="100%" height="44" />|`).join('\n')
    fs.writeFileSync(mdIconsMap, `| Name | icon |\n|---|---|\n${md}`)
  }

  // write our generic index.js

  fs.copyFileSync(`${iconsDir}/style.css`, `${exportDir}/style.css`)

  fs.writeFileSync(indexFile, `
module.exports = {
  ${svgs.join(',')}\n
  }\n`)
})
