const browserify = require('browserify')
const brfs = require('brfs')
const envify = require('loose-envify/custom')

/** @typedef {import('browserify').Bundler} BrowserifyBundler */

/**
 * @typedef {object} BuildJsOptions
 * @property {string} basedir Base directory used to resolve bundle modules.
 * @property {boolean} debug Whether to include debug source maps and set DEBUG_MODE.
 * @property {string} fakeDataPath File excluded from parsing by Browserify.
 * @property {string} scriptPath Entry module path, relative to basedir or absolute.
 * @property {(bundler: BrowserifyBundler) => void} [beforeBundle] Hook called before the entry is added.
 * @property {Record<string, string | number | boolean>} [env] Additional compile-time environment values.
 */

/**
 * Bundle a browser entry, inlining file reads and environment values.
 * @param {BuildJsOptions} options
 * @returns {import('node:stream').Readable} Browserify's bundle stream.
 */
const buildJs = ({ basedir, debug, fakeDataPath, scriptPath, beforeBundle, env = {} }) => {
  const b = browserify({
    basedir,
    debug,
    noParse: [fakeDataPath]
  })

  if (beforeBundle) {
    beforeBundle(b)
  }

  return b
    .add(scriptPath)
    .transform(brfs)
    .transform(envify({
      DEBUG_MODE: debug,
      ...env
    }))
    .bundle()
}

module.exports = buildJs
