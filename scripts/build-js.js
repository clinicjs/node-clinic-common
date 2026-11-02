const esbuild = require('esbuild')
const path = require('node:path')
const { Readable } = require('node:stream')
const staticFsPlugin = require('./static-fs-plugin')

const eventsPath = require.resolve('events/')

/** @typedef {import('esbuild').Plugin} EsbuildPlugin */

/**
 * The subset of the old bundler hook used to provide a virtual module.
 * @typedef {object} BuildJsBundler
 * @property {(options: { source: string, file: string }) => BuildJsBundler} require
 */

/**
 * @typedef {object} BuildJsOptions
 * @property {string} basedir Base directory used to resolve bundle modules.
 * @property {boolean} debug Whether to include debug source maps and set DEBUG_MODE.
 * @property {string} [fakeDataPath] Deprecated and unused by esbuild; files ending in `.json` are loaded as JSON based on their extension.
 * @property {string} scriptPath Entry module path, relative to basedir or absolute.
 * @property {(bundler: BuildJsBundler) => void} [beforeBundle] Hook for supplying a virtual module.
 * @property {Record<string, string | number | boolean | undefined>} [env] Compile-time environment values.
 */

/**
 * Bundle a browser entry, inlining static file reads and environment values.
 * @param {BuildJsOptions} options
 * @returns {import('node:stream').Readable} Bundle output as a readable stream.
 */
const buildJs = ({ basedir, debug, scriptPath, beforeBundle, env = {} }) => {
  const defines = Object.fromEntries(
    Object.entries({ DEBUG_MODE: debug, ...env }).map(([key, value]) => [
      `process.env.${key}`,
      JSON.stringify(value) ?? 'undefined'
    ])
  )
  /** @type {Map<string, string>} */
  const injectedFiles = new Map()
  /** @type {BuildJsBundler} */
  const bundler = {
    require: ({ source, file }) => {
      injectedFiles.set(path.resolve(basedir, file), source)
      return bundler
    }
  }
  if (beforeBundle) beforeBundle(bundler)

  /** @type {EsbuildPlugin} */
  const injectedFilesPlugin = {
    name: 'clinic-injected-files',
    setup (build) {
      build.onLoad({ filter: /.*/ }, args => {
        const filePath = path.resolve(args.path)
        const contents = injectedFiles.get(filePath)
        if (contents === undefined) return undefined

        return {
          contents,
          loader: filePath.endsWith('.json') ? 'json' : 'js',
          resolveDir: path.dirname(filePath)
        }
      })
    }
  }

  /** @type {EsbuildPlugin} */
  const eventsPlugin = {
    name: 'clinic-events',
    setup (build) {
      build.onResolve({ filter: /^events$/ }, () => ({ path: eventsPath }))
    }
  }

  const stream = Readable.from((async function * () {
    const result = await esbuild.build({
      absWorkingDir: path.resolve(basedir),
      entryPoints: [scriptPath],
      bundle: true,
      platform: 'browser',
      format: 'iife',
      write: false,
      sourcemap: debug ? 'inline' : false,
      define: defines,
      plugins: [injectedFilesPlugin, eventsPlugin, staticFsPlugin]
    })

    for (const outputFile of result.outputFiles) {
      yield Buffer.from(outputFile.contents)
    }
  })())

  return stream
}

module.exports = buildJs
