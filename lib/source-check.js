'use strict'

const fs = require('fs')

function checkForTranspiledCode (filename) {
  const readFile = fs.readFileSync(filename, 'utf8')
  const regex = /function\s+(\w+)/g
  let matchedObj
  let isTranspiled = false

  // Check for a source map
  isTranspiled = readFile.includes('//# sourceMappingURL=')

  while ((matchedObj = regex.exec(readFile)) !== null) {
    // Loop through results and check length of fn name
    matchedObj.forEach((match, groupIndex) => {
      if (groupIndex !== 0 && match.length < 3) {
        isTranspiled = true
      }
    })
  }
  return isTranspiled
}

module.exports = checkForTranspiledCode
