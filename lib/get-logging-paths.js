'use strict'

const path = require('path')

function getLoggingPaths (toolName, options) {
  let dirpath, basename
  if (options.hasOwnProperty('identifier') && options.identifier) {
    if (options.hasOwnProperty('path') && options.path) {
      dirpath = options.path
    } else {
      dirpath = ''
    }
    basename = options.identifier.toString()
  } else if (options.hasOwnProperty('path') && options.path) {
    dirpath = path.dirname(options.path)
    basename = path.basename(options.path, `.${toolName}`)
  } else {
    throw new Error('missing either identifier or path value')
  }

  const dirname = `${basename}.${toolName}`
  const traceEventFilename = `${basename}.${toolName}-traceevent`
  const systemInfoFilename = `${basename}.${toolName}-systeminfo`
  const processsStatFilename = `${basename}.${toolName}-processstat`

  return {
    '/': path.join(dirpath, dirname),
    '/systeminfo': path.join(dirpath, dirname, systemInfoFilename),
    '/traceevent': path.join(dirpath, dirname, traceEventFilename),
    '/processstat': path.join(dirpath, dirname, processsStatFilename)
  }
}

module.exports = getLoggingPaths
