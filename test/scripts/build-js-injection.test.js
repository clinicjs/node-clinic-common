/** @type {typeof import('node:test')} */
const test = require('node:test')
const fs = require('node:fs')
const os = require('node:os')
const path = require('node:path')
const buildJs = require('../../scripts/build-js.js')

/**
 * Collect a readable stream as text.
 * @param {import('node:stream').Readable} stream
 * @returns {Promise<string>}
 */
async function collect (stream) {
  return new Promise((resolve, reject) => {
    /** @type {Buffer[]} */
    const chunks = []
    stream.on('data', /** @param {Buffer} chunk */ chunk => chunks.push(chunk))
    stream.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')))
    stream.on('error', reject)
  })
}

test('buildJs injects virtual modules and resolves browser environment through beforeBundle', async function (/** @type {import('node:test').TestContext} */ t) {
  t.plan(5)
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'clinic-js-injection-'))
  t.after(() => fs.rmSync(root, { recursive: true, force: true }))

  const jsonPath = path.join(root, 'data.json')
  const jsPath = path.join(root, 'runtime-data.js')
  const jsxPath = path.join(root, 'runtime-data.jsx')
  fs.writeFileSync(jsonPath, '{}')
  fs.writeFileSync(jsPath, 'module.exports = null')
  fs.writeFileSync(jsxPath, 'module.exports = "jsx value"')
  fs.writeFileSync(path.join(root, 'entry.js'), `
    const EventEmitter = require('events')
    module.exports = {
      json: require('./data.json').answer,
      javascript: require('./runtime-data.js'),
      jsx: require('./runtime-data.jsx'),
      unset: process.env.NOT_SET,
      emitter: new EventEmitter()
    }
  `)

  const bundle = await collect(buildJs({
    basedir: root,
    debug: false,
    fakeDataPath: jsonPath,
    scriptPath: './entry.js',
    beforeBundle (bundler) {
      const chainedBundler = bundler.require({ source: JSON.stringify({ answer: 42 }), file: jsonPath })
      t.assert.strictEqual(chainedBundler, bundler)
      chainedBundler.require({ source: 'module.exports = "runtime value"', file: jsPath })
    },
    env: { NOT_SET: undefined }
  }))

  t.assert.match(bundle, /42/)
  t.assert.match(bundle, /runtime value/)
  t.assert.match(bundle, /jsx value/)
  t.assert.match(bundle, /unset: (?:undefined|void 0)/)
})
