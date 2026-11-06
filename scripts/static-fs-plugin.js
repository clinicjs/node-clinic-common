const fs = require('node:fs/promises')
const path = require('node:path')

/** @type {import('esbuild').Plugin} */
module.exports = {
  name: 'clinic-static-fs',
  setup (build) {
    build.onResolve({ filter: /^(?:node:)?fs$/ }, () => ({ path: 'fs-shim', namespace: 'clinic-static-fs' }))
    build.onLoad({ filter: /.*/, namespace: 'clinic-static-fs' }, () => ({
      contents: `
        const unsupported = () => { throw new Error('Dynamic fs calls are unavailable in browser bundles') }
        module.exports = { readFileSync: unsupported, readFile: unsupported, readdirSync: unsupported, readdir: unsupported }
      `,
      loader: 'js'
    }))
    build.onLoad({ filter: /\.[cm]?js$/ }, async args => {
      const source = await fs.readFile(args.path, 'utf8')
      const aliases = [...source.matchAll(/\b(?:const|let|var)\s+([\w$]+)\s*=\s*require\(\s*(['"])(?:node:)?fs\2\s*\)/g)].map(match => /** @type {string} */ (match[1]))
      const transformed = await inlineReads(source, aliases, args.path)
      if (transformed === source) return undefined
      return { contents: transformed, loader: 'js', resolveDir: path.dirname(args.path) }
    })
  }
}

/**
 * Inline static UTF-8 reads and directory listings from fs modules.
 * @param {string} source
 * @param {string[]} aliases
 * @param {string} filename
 * @returns {Promise<string>}
 */
async function inlineReads (source, aliases, filename) {
  let output = source
  for (const alias of aliases) {
    const name = alias.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    const prefix = `(?<![\\w$])${name}\\.`
    output = await replaceCalls(output, new RegExp(`${prefix}readFileSync\\(\\s*([^,]+?),\\s*(['"])([^'"]+)\\2\\s*\\)`, 'g'), async match => {
      const resolved = resolveStaticPath(/** @type {string} */ (match[1]).trim(), filename)
      return resolved ? JSON.stringify(await fs.readFile(resolved, /** @type {BufferEncoding} */ (match[3]))) : match[0]
    })
    output = await replaceCalls(output, new RegExp(`${prefix}readFile\\(\\s*([^,]+?),\\s*(['"])([^'"]+)\\2\\s*,\\s*([\\w$]+)\\s*\\)`, 'g'), async match => {
      const resolved = resolveStaticPath(/** @type {string} */ (match[1]).trim(), filename)
      if (!resolved) return match[0]
      const content = await fs.readFile(resolved, /** @type {BufferEncoding} */ (match[3]))
      return `queueMicrotask(() => ${/** @type {string} */ (match[4])}(null, ${JSON.stringify(content)}))`
    })
    output = await replaceCalls(output, new RegExp(`${prefix}readdirSync\\(\\s*([^,]+?)\\s*\\)`, 'g'), async match => {
      const resolved = resolveStaticPath(/** @type {string} */ (match[1]).trim(), filename)
      return resolved ? JSON.stringify(await fs.readdir(resolved)) : match[0]
    })
    output = await replaceCalls(output, new RegExp(`${prefix}readdir\\(\\s*([^,]+?),\\s*([\\w$]+)\\s*\\)`, 'g'), async match => {
      const resolved = resolveStaticPath(/** @type {string} */ (match[1]).trim(), filename)
      if (!resolved) return match[0]
      const names = await fs.readdir(resolved)
      return `queueMicrotask(() => ${/** @type {string} */ (match[2])}(null, ${JSON.stringify(names)}))`
    })
  }
  return output
}

/**
 * @param {string} source
 * @param {RegExp} pattern
 * @param {(match: RegExpMatchArray) => Promise<string>} replace
 * @returns {Promise<string>}
 */
async function replaceCalls (source, pattern, replace) {
  const matches = [...source.matchAll(pattern)]
  if (matches.length === 0) return source
  let result = ''
  let offset = 0
  for (const match of matches) {
    const start = /** @type {number} */ (match.index)
    result += source.slice(offset, start) + await replace(match)
    offset = start + match[0].length
  }
  return result + source.slice(offset)
}

/**
 * @param {string} expression
 * @param {string} filename
 * @returns {string | undefined}
 */
function resolveStaticPath (expression, filename) {
  const dirname = path.dirname(filename)
  if (expression === '__dirname') return dirname
  const directoryRelative = expression.match(/^__dirname\s*\+\s*(['"])([^'"\\]*)\1$/)
  if (directoryRelative) return path.join(dirname, /** @type {string} */ (directoryRelative[2]))
  const literal = expression.match(/^(['"])([^'"\\]*)\1$/)
  if (literal) return path.resolve(dirname, /** @type {string} */ (literal[2]))
  return undefined
}
