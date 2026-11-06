#!/usr/bin/env node

/**
 * Run the SVG build and report failures through stderr and the process exit code.
 * @param {() => void | Promise<void>} [build] Build function, defaulting to the SVG builder.
 * @returns {Promise<void>} Resolves after the build settles and any error is handled.
 */
function runBuild (build = require('./build-svgs.js')) {
  return Promise.resolve().then(build).catch((/** @type {unknown} */ error) => {
    console.error(error)
    process.exitCode = 1
  })
}

module.exports = runBuild
runBuild()
