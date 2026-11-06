'use strict'

const path = require('node:path')

/**
 * Options used to choose the root directory for a tool's log files.
 * A path may be null when an identifier is provided.
 * @typedef {{ identifier: string|number, path?: string|null } | { identifier?: string|number|null, path: string|null }} LoggingPathOptions
 * An identifier or path is required; a path may be null when an identifier is provided.
 */

/** @typedef {Record<string, string>} LoggingPaths */

/**
 * Function returned by {@link wrapper} to build paths for one log collection.
 * @callback GetLoggingPaths
 * @param {LoggingPathOptions} options
 * @returns {LoggingPaths} Mapping from virtual endpoints to filesystem paths.
 */

/**
 * Check whether an object owns a property, including properties with empty values.
 * @param {object} object Object to inspect.
 * @param {PropertyKey} property Property key to look up.
 * @returns {boolean} Whether the property is an own property.
 */
function has (object, property) {
  return Object.prototype.hasOwnProperty.call(object, property)
}

/**
 * Creates a function that maps log endpoints to tool-specific filesystem paths.
 * Doctor and bubbleprof receive their default tool-specific endpoints unless
 * an explicit list is provided.
 * @param {string} toolName Name used in generated `.clinic-<toolName>` paths.
 * @param {string[]|null} [toolSpecificFiles] Additional endpoint names to include.
 * @returns {GetLoggingPaths} Path builder for the named tool.
 */
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

  /**
   * @param {LoggingPathOptions} options Values used to construct the paths.
   * @returns {LoggingPaths} Endpoint-to-path mapping.
   */
  return function getLoggingPaths (options) {
    let dirpath, basename
    if (has(options, 'identifier') && options.identifier !== null && options.identifier !== undefined && options.identifier !== '') {
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

    const loggingPaths = /** @type {LoggingPaths} */ ({
      '/': path.join(dirpath, dirname),
      '/systeminfo': path.join(dirpath, dirname, systemInfoFilename)
    })
    toolSpecificFiles.forEach((name) => {
      const cleanName = name.replace(/^\/|\/$/g, '')
      const filename = `${basename}.clinic-${toolName}-${cleanName}`
      loggingPaths[name] = path.join(dirpath, dirname, filename)
    })

    return loggingPaths
  }
}

module.exports = wrapper
