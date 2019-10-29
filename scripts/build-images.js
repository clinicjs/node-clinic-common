/**
 * @fileoverview
 * Compiles images into static .js files that can be imported in the browser
 * and are tree-shakeable.
 * The static .js files go in assets/images/{filename}.js
 */

const fs = require('fs')
const chalk = require('chalk')

function exportFile (file, exportDir) {
  const fileNameArr = file.split('/').splice(-1)[0].split('.')
  fileNameArr.pop()
  const fileName = fileNameArr.join('.')
  console.log(chalk.bgGreen(' Exporting: '), chalk.green(`${fileName}`), chalk.green('✓'))

  // reading the file
  const imageAsBase64 = fs.readFileSync(`${file}`, 'base64')

  const exportContent = `module.exports = \`data:image/png;base64, ${imageAsBase64}\`\n`

  fs.writeFileSync(
    `${exportDir}/${fileName}.js`,
    exportContent
  )
}

module.exports = {
  path: (sourceDir, exportDir) => {
    fs.readdir(sourceDir, function (err, items) {
      if (err) {
        console.error(err)
      } else {
        const files = items.filter(file => {
        // filtering out non img files
          return file.indexOf('.png') > 0 ||
                file.indexOf('.jpg') > 0 ||
                file.indexOf('.jpeg') > 0 ||
                file.indexOf('.gif') > 0
        })
        files.forEach((file, i) => {
          exportFile(`${sourceDir}/${file}`, exportDir)
        })
      }
    })
  },
  file: exportFile
}
