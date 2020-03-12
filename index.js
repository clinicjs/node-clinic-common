'use strict'

const getLoggingPaths = require('./lib/get-logging-paths')
const checkForTranspiledCode = require('./lib/source-check')

module.exports = {
  getLoggingPaths,
  checkForTranspiledCode
}
