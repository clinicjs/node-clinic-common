'use strict'

const path = require('path')

function wrapper (name) {
  return function getLoggingPaths(options) {
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
      basename = path.basename(options.path, `.clinic-${name}`)
    } else {
      throw new Error('missing either identifier or path value')
    }

    let extra
    if (name === 'bubbleprof') {
      const filename = `${basename}.clinic-${name}-processstat`
      extra = { '/processstat': path.join(dirpath, dirname, filename) }
    } else if (name === 'doctor') {
      const filename = `${basename}.clinic-${name}-stacktrace`
      extra = { '/stacktrace': path.join(dirpath, dirname, filename) }
    } else {
      extra = {}
    }

    const dirname = `${basename}.clinic-${name}`
    const traceEventFilename = `${basename}.clinic-${name}-traceevent`
    const systemInfoFilename = `${basename}.clinic-${name}-systeminfo`

    return {
      '/': path.join(dirpath, dirname),
      '/systeminfo': path.join(dirpath, dirname, systemInfoFilename),
      '/traceevent': path.join(dirpath, dirname, traceEventFilename),
      ...extra
    }
  }
}

module.exports = wrapper
