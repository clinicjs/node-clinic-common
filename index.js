'use strict'

const getLoggingPaths = require('./lib/get-logging-paths')
const checkForTranspiledCode = require('./lib/source-check')

/** @typedef {{getLoggingPaths: typeof getLoggingPaths, checkForTranspiledCode: typeof checkForTranspiledCode}} ClinicCommonExports */

/** @type {ClinicCommonExports} */
module.exports = {
  getLoggingPaths,
  checkForTranspiledCode
}
