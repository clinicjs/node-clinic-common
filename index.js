'use strict'

const getLoggingPaths = require('./lib/get-logging-paths')
const checkForTranspiledCode = require('./lib/source-check')
const workers = require('./lib/workers')

module.exports = {
  getLoggingPaths,
  checkForTranspiledCode,
  workers
}
