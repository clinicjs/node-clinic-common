'use strict'

const path = require('path')

function has (object, property) {
  return Object.prototype.hasOwnProperty.call(object, property)
}

function wrapper (toolName, toolSpecificFiles) {
  if (!toolSpecificFiles) {
    if (toolName === 'doctor') {
      toolSpecificFiles = ['/traceevent', '/processstat']
    } else if (toolName === 'bubbleprof') {
      toolSpecificFiles = ['/traceevent', '/stacktrace']
    } else {
      toolSpecificFiles = []
    }
  }

  return function getLoggingPaths (options) {
    let dirpath, basename
    if (has(options, 'identifier') && options.identifier) {
      if (has(options, 'path') && options.path) {
        dirpath = options.path
      } else {
        dirpath = ''
      }
      basename = options.identifier.toString()
    } else if (has(options, 'path') && options.path) {
      dirpath = path.dirname(options.path)
      basename = path.basename(options.path, `.clinic-${toolName}`)
    } else {
      throw new Error('missing either identifier or path value')
    }

    const dirname = `${basename}.clinic-${toolName}`
    const systemInfoFilename = `${basename}.clinic-${toolName}-systeminfo`

    const loggingPaths = {
      '/': path.join(dirpath, dirname),
      '/systeminfo': path.join(dirpath, dirname, systemInfoFilename)
    }
    toolSpecificFiles.forEach((name) => {
      const cleanName = name.replace(/^\/|\/$/g, '')
      const filename = `${basename}.clinic-${toolName}-${cleanName}`
      loggingPaths[name] = path.join(dirpath, dirname, filename)
    })

    return loggingPaths
  }
}

module.exports = wrapper
