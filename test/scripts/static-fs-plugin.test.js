/** @type {typeof import('node:test')} */
const test = require('node:test')
const fs = require('node:fs')
const os = require('node:os')
const path = require('node:path')
const staticFsPlugin = require('../../scripts/static-fs-plugin.js')

/**
 * Register the plugin's onLoad handler for direct testing.
 * @returns {(args: { path: string }) => Promise<import('esbuild').OnLoadResult | null | undefined>}
 */
function getOnLoadHandler () {
  /** @type {((args: import('esbuild').OnLoadArgs) => Promise<import('esbuild').OnLoadResult | null | undefined>) | undefined} */
  let callback
  const mockedBuild = {
    onResolve () {},
    onLoad (
      /** @type {import('esbuild').OnLoadOptions} */ _options,
      /** @type {(args: import('esbuild').OnLoadArgs) => Promise<import('esbuild').OnLoadResult | null | undefined>} */ onLoad
    ) { callback = onLoad }
  }
  staticFsPlugin.setup(/** @type {import('esbuild').PluginBuild} */ (/** @type {unknown} */ (mockedBuild)))
  const onLoad = callback
  if (!onLoad) throw new Error('Plugin did not register an onLoad handler')
  return args => onLoad({ path: args.path, namespace: 'file', suffix: '', pluginData: undefined, with: {} })
}

test('inlines a static fs.readFileSync path based on __dirname', async function (/** @type {import('node:test').TestContext} */ t) {
  t.plan(1)
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'clinic-static-fs-'))
  t.after(() => fs.rmSync(root, { recursive: true, force: true }))
  fs.writeFileSync(path.join(root, 'asset.txt'), 'asset contents')
  fs.writeFileSync(path.join(root, 'entry.js'), "const fs = require('fs'); module.exports = fs.readFileSync(__dirname + '/asset.txt', 'utf8')")

  const result = await getOnLoadHandler()({ path: path.join(root, 'entry.js') })
  t.assert.match(String(result?.contents), /module\.exports = "asset contents"/)
})

test('inlines a static fs.readFileSync literal path for node:fs', async function (/** @type {import('node:test').TestContext} */ t) {
  t.plan(1)
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'clinic-static-fs-'))
  t.after(() => fs.rmSync(root, { recursive: true, force: true }))
  fs.writeFileSync(path.join(root, 'asset.txt'), 'literal contents')
  fs.writeFileSync(path.join(root, 'entry.js'), "const $fs = require('node:fs'); module.exports = $fs.readFileSync('asset.txt', 'utf8')")

  const result = await getOnLoadHandler()({ path: path.join(root, 'entry.js') })
  t.assert.match(String(result?.contents), /module\.exports = "literal contents"/)
})

test('inlines static fs.readFile calls as asynchronous callback calls', async function (/** @type {import('node:test').TestContext} */ t) {
  t.plan(1)
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'clinic-static-fs-'))
  t.after(() => fs.rmSync(root, { recursive: true, force: true }))
  fs.writeFileSync(path.join(root, 'asset.txt'), 'async contents')
  fs.writeFileSync(path.join(root, 'entry.js'), "const fs = require('fs'); fs.readFile(__dirname + '/asset.txt', 'utf8', callback)")

  const result = await getOnLoadHandler()({ path: path.join(root, 'entry.js') })
  t.assert.match(String(result?.contents), /queueMicrotask\(\(\) => callback\(null, "async contents"\)\)/)
})

test('inlines static fs.readdirSync calls', async function (/** @type {import('node:test').TestContext} */ t) {
  t.plan(1)
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'clinic-static-fs-'))
  t.after(() => fs.rmSync(root, { recursive: true, force: true }))
  fs.writeFileSync(path.join(root, 'asset.txt'), '')
  fs.writeFileSync(path.join(root, 'entry.js'), "const fs = require('fs'); module.exports = fs.readdirSync(__dirname)")

  const result = await getOnLoadHandler()({ path: path.join(root, 'entry.js') })
  t.assert.match(String(result?.contents), /\["asset\.txt","entry\.js"\]/)
})

test('inlines static fs.readdir calls as asynchronous callback calls', async function (/** @type {import('node:test').TestContext} */ t) {
  t.plan(1)
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'clinic-static-fs-'))
  t.after(() => fs.rmSync(root, { recursive: true, force: true }))
  fs.writeFileSync(path.join(root, 'entry.js'), "const fs = require('fs'); fs.readdir(__dirname, callback)")

  const result = await getOnLoadHandler()({ path: path.join(root, 'entry.js') })
  t.assert.match(String(result?.contents), /queueMicrotask\(\(\) => callback\(null, \["entry\.js"\]\)\)/)
})

test('leaves dynamic filesystem reads untouched', async function (/** @type {import('node:test').TestContext} */ t) {
  t.plan(1)
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'clinic-static-fs-'))
  t.after(() => fs.rmSync(root, { recursive: true, force: true }))
  const source = "const fs = require('fs'); module.exports = fs.readFileSync(window.assetPath, 'utf8'); fs.readFile(window.assetPath, 'utf8', callback); fs.readdirSync(window.directory); fs.readdir(window.directory, callback)"
  const file = path.join(root, 'entry.js')
  fs.writeFileSync(file, source)

  t.assert.strictEqual(await getOnLoadHandler()({ path: file }), undefined)
})

test('leaves files without a filesystem require untouched', async function (/** @type {import('node:test').TestContext} */ t) {
  t.plan(1)
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'clinic-static-fs-'))
  t.after(() => fs.rmSync(root, { recursive: true, force: true }))
  const source = "module.exports = other.readFileSync('asset.txt', 'utf8')"
  const file = path.join(root, 'entry.js')
  fs.writeFileSync(file, source)

  t.assert.strictEqual(await getOnLoadHandler()({ path: file }), undefined)
})
