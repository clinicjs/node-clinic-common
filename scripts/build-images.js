/**
 * @fileoverview
 * Compiles images into static .js files that can be imported in the browser
 * and are tree-shakeable.
 * The static .js files go in assets/images/{filename}.js
 */

const fs = require('node:fs')
const path = require('node:path')

/** @type {Map<string, string>} */
const mimeTypes = new Map([
  ['.png', 'image/png'],
  ['.jpg', 'image/jpeg'],
  ['.jpeg', 'image/jpeg'],
  ['.gif', 'image/gif']
])

/**
 * Write one image as a JavaScript module containing its data URL.
 * @param {string} file Source image path.
 * @param {string} exportDir Destination directory for the module.
 * @returns {void}
 * @throws {TypeError} If the file extension is not supported.
 * @throws {NodeJS.ErrnoException} If reading or writing a file fails.
 */
function exportFile (file, exportDir) {
  const extension = path.extname(file).toLowerCase()
  const mimeType = mimeTypes.get(extension)
  if (!mimeType) throw new TypeError(`Unsupported image format: ${extension || '(none)'}`)

  const fileName = path.basename(file, path.extname(file))
  console.log('\u001b[42m Exporting: \u001b[0m', `\u001b[32m${fileName}\u001b[0m`, '\u001b[32m✓\u001b[0m')

  // reading the file
  const imageAsBase64 = fs.readFileSync(`${file}`, 'base64')

  const exportContent = `module.exports = \`data:${mimeType};base64, ${imageAsBase64}\`\n`

  fs.writeFileSync(
    `${exportDir}/${fileName}.js`,
    exportContent
  )
}

module.exports = {
  /**
   * Export supported image files in a directory.
   * @param {string} sourceDir Directory containing source images.
   * @param {string} exportDir Destination directory for generated modules.
   * @returns {Promise<void>} Resolves when directory entries have been processed.
   * @throws {NodeJS.ErrnoException} If reading the directory or writing a module fails.
   */
  path: async (sourceDir, exportDir) => {
    /** @type {import('node:fs').Dirent[]} */
    const entries = await fs.promises.readdir(sourceDir, { withFileTypes: true })
    entries
      .filter(entry => entry.isFile() && mimeTypes.has(path.extname(entry.name).toLowerCase()))
      .forEach(entry => exportFile(path.join(sourceDir, entry.name), exportDir))
  },
  /** @type {(file: string, exportDir: string) => void} */
  file: exportFile
}
