/** @type {typeof import('node:test')} */
const test = require('node:test')
const fs = require('fs')
const os = require('os')
const path = require('path')
const buildJs = require('../../scripts/build-js.js')

/**
 * Collect a readable stream as text.
 * @param {import('stream').Readable} stream
 * @returns {Promise<string>}
 */
async function collect (stream) {
  return new Promise((resolve, reject) => {
    let bundle = ''
    stream.on('data', /** @param {Buffer} chunk */ chunk => { bundle += chunk })
    stream.on('end', () => resolve(bundle))
    stream.on('error', reject)
  })
}

test('buildJs bundles assets and inlines supplied environment values', async function (/** @type {import('node:test').TestContext} */ t) {
  t.plan(4)
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'clinic-js-'))
  t.after(() => fs.rmSync(root, { recursive: true, force: true }))
  const fakeDataPath = path.join(root, 'fake-data.js')
  fs.writeFileSync(fakeDataPath, 'module.exports = {}')
  fs.writeFileSync(path.join(root, 'asset.txt'), 'asset contents')
  fs.writeFileSync(path.join(root, 'entry.js'), `
    const fs = require('fs')
    module.exports = {
      debug: process.env.DEBUG_MODE,
      custom: process.env.CUSTOM_VALUE,
      asset: fs.readFileSync(__dirname + '/asset.txt', 'utf8')
    }
  `)

  let beforeBundleCalled = false
  const bundle = await collect(buildJs({
    basedir: root,
    debug: true,
    fakeDataPath,
    scriptPath: './entry.js',
    beforeBundle: () => { beforeBundleCalled = true },
    env: { CUSTOM_VALUE: 'from options' }
  }))

  t.assert.ok(beforeBundleCalled)
  t.assert.match(bundle, /debug: true/)
  t.assert.match(bundle, /from options/)
  t.assert.match(bundle, /asset contents/)
})

test('buildJs works without a beforeBundle hook', async function (/** @type {import('node:test').TestContext} */ t) {
  t.plan(1)
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'clinic-js-'))
  t.after(() => fs.rmSync(root, { recursive: true, force: true }))
  const entryPath = path.join(root, 'entry.js')
  const fakeDataPath = path.join(root, 'fake-data.js')
  fs.writeFileSync(entryPath, 'module.exports = process.env.DEBUG_MODE')
  fs.writeFileSync(fakeDataPath, 'module.exports = {}')

  const bundle = await collect(buildJs({
    basedir: root,
    debug: false,
    fakeDataPath,
    scriptPath: './entry.js'
  }))
  t.assert.match(bundle, /module\.exports = false/)
})

test('buildJs inlines static fs.readFile contents', async function (/** @type {import('node:test').TestContext} */ t) {
  t.plan(2)
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'clinic-js-read-file-'))
  t.after(() => fs.rmSync(root, { recursive: true, force: true }))
  fs.writeFileSync(path.join(root, 'asset.txt'), 'async asset contents')
  fs.writeFileSync(path.join(root, 'entry.js'), `
    const fs = require('fs')
    function onRead (err, contents) { window.assetContents = contents }
    fs.readFile(__dirname + '/asset.txt', 'utf8', onRead)
  `)

  const bundle = await collect(buildJs({
    basedir: root,
    debug: false,
    scriptPath: './entry.js'
  }))

  t.assert.match(bundle, /async asset contents/)
  t.assert.match(bundle, /queueMicrotask/)
})
