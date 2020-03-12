'use strict'

const fs = require('fs')

function checkForTranspiledCode (filename) {
  const readFile = fs.readFileSync(filename, 'utf8')
  const regex = /function\s+(\w+)/g
  let matchedObj
  let isTranspiled = false

  // Check for a source map
  isTranspiled = readFile.includes('//# sourceMappingURL=')

  // Loop through results and check length of fn name
  while ((matchedObj = regex.exec(readFile)) !== null) {
    if (matchedObj[1].length < 3) {
      isTranspiled = true
    }
  }
  return isTranspiled
}

module.exports = checkForTranspiledCode
