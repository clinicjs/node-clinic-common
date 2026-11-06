'use strict'

const fs = require('node:fs')

/**
 * Checks whether a JavaScript file appears to contain transpiled code.
 * A source map comment or short named functions are treated as evidence of
 * transpilation; this is a heuristic, not a parser-based classification.
 * @param {import('node:fs').PathLike} filename Path to the JavaScript file to inspect.
 * @returns {boolean} Whether the file appears to be transpiled.
 * @throws {Error} If the file cannot be read.
 */
function checkForTranspiledCode (filename) {
  const readFile = fs.readFileSync(filename, 'utf8')
  const regex = /function\s+(\w+)/g
  let matchedObj
  let isTranspiled = readFile.includes('//# sourceMappingURL=')

  // Check for a source map
  if (!isTranspiled) {
    let foundNamedFunction = false
    isTranspiled = true
    // Loop through results and check length of fn name
    while ((matchedObj = regex.exec(readFile)) !== null) {
      foundNamedFunction = true
      const functionName = /** @type {string} */ (matchedObj[1])
      if (functionName.length > 3) {
        isTranspiled = false
        break
      }
    }
    // With no named functions there is no minified-name evidence of transpilation.
    if (!foundNamedFunction) isTranspiled = false
  }
  return isTranspiled
}

module.exports = checkForTranspiledCode
