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

    const md = files.map(f => `|${f.split('.')[0]}|<img src="https://raw.githubusercontent.com/nearform/node-clinic-common/feature/svg-icons/assets/${f}?sanitize=true" width="100%" height="44" />|`).join('\n')
    fs.writeFileSync(mdIconsMap, `| Name | icon |\n|---|---|\n${md}`)
  }

  const styleInjectFn = `function styleInject (css, { insertAt } = {}) {
    if (!css || typeof document === 'undefined') return
  
    const head = document.head || document.getElementsByTagName('head')[0]
    const style = document.createElement('style')
    style.type = 'text/css'
  
    if (insertAt === 'top') {
      if (head.firstChild) {
        head.insertBefore(style, head.firstChild)
      } else {
        head.appendChild(style)
      }
    } else {
      head.appendChild(style)
    }
  
    if (style.styleSheet) {
      style.styleSheet.cssText = css
    } else {
      style.appendChild(document.createTextNode(css))
    }
  }\n`

  const style = `const style = \`
  /* SVG icons */
  svg.icon-img path {
    /* Default to same fill as adjacent text */
    fill: currentColor;
  }
  
  svg.icon-img {
    /* Default to same size as adjacent text */
    width: 1em;
    height: 1em;
    display: block;
  }\`\n`
  const inject = `styleInject(style, { insertAt: 'top' })\n`

  // write our generic index.js

  fs.writeFileSync(indexFile, `
${styleInjectFn}
${style}
module.exports = {
  injectStyle: () => {${inject}},\n
  ${svgs.join(',')}\n
  }\n`)
})
