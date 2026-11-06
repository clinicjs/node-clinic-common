/** @type {typeof import('node:test')} */
const test = require('node:test')
const fs = require('fs')
const os = require('os')
const path = require('path')
const { spawnSync } = require('child_process')
const buildSvgs = require('../../scripts/build-svgs.js')

test('build-svgs generates icon modules and styles in its working tree', async function (/** @type {import('node:test').TestContext} */ t) {
  t.plan(8)
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'clinic-svgs-'))
  t.after(() => fs.rmSync(root, { recursive: true, force: true }))
  const assetsDir = path.join(root, 'assets')
  const iconsDir = path.join(root, 'icons')
  fs.mkdirSync(assetsDir)
  fs.mkdirSync(iconsDir)
  fs.writeFileSync(path.join(assetsDir, 'style.css'), '.icons {}')
  const svg = '<svg viewBox="0 0 1 1">\n<path d="M0 0"/>\n</svg>'
  fs.writeFileSync(path.join(assetsDir, 'test.svg'), svg)
  fs.writeFileSync(path.join(assetsDir, 'quoted.svg'), '<svg aria-label="it\'s 100%"></svg>')
  fs.writeFileSync(path.join(assetsDir, 'ignore.txt'), 'not an icon')
  fs.writeFileSync(path.join(assetsDir, 'not-svg.svg.txt'), 'not an icon')
  fs.writeFileSync(path.join(assetsDir, 'multi.part.svg'), '<svg viewBox="0 0 1 1"></svg>')

  await buildSvgs({ assetsDir, exportDir: iconsDir })

  const normalizedSvg = '<svg class="icon-img test-svg" viewBox="0 0 1 1"><path d="M0 0"/></svg>'
  t.assert.strictEqual(require(path.join(iconsDir, 'test.js')), normalizedSvg)
  t.assert.strictEqual(require(path.join(iconsDir, 'index.js')).test, normalizedSvg)
  t.assert.ok(fs.readFileSync(path.join(iconsDir, 'test.css'), 'utf8').includes('data:image/svg+xml;utf8,'))
  t.assert.ok(fs.readFileSync(path.join(iconsDir, 'quoted.css'), 'utf8').includes('%27s%20100%25'))
  t.assert.strictEqual(require(path.join(iconsDir, 'quoted.js')), '<svg class="icon-img quoted-svg" aria-label="it\'s 100%"></svg>')
  t.assert.strictEqual(fs.readFileSync(path.join(iconsDir, 'style.css'), 'utf8'), '.icons {}')
  t.assert.ok(fs.existsSync(path.join(iconsDir, 'multi.part.js')))
  t.assert.ok(!fs.existsSync(path.join(iconsDir, 'not-svg.js')))
})

test('build-svgs reports a missing assets directory', async function (/** @type {import('node:test').TestContext} */ t) {
  t.plan(1)
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'clinic-svgs-'))
  t.after(() => fs.rmSync(root, { recursive: true, force: true }))
  await t.assert.rejects(
    buildSvgs({ assetsDir: path.join(root, 'missing'), exportDir: root }),
    { code: 'ENOENT' }
  )
})

test('build-svgs generates an empty icon index when there are no SVG files', async function (/** @type {import('node:test').TestContext} */ t) {
  t.plan(3)
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'clinic-svgs-'))
  t.after(() => fs.rmSync(root, { recursive: true, force: true }))
  const assetsDir = path.join(root, 'assets')
  const iconsDir = path.join(root, 'icons')
  fs.mkdirSync(assetsDir)
  fs.mkdirSync(iconsDir)
  fs.writeFileSync(path.join(assetsDir, 'style.css'), '.icons {}')
  fs.writeFileSync(path.join(assetsDir, 'notes.txt'), 'No SVGs here')

  await buildSvgs({ assetsDir, exportDir: iconsDir })

  t.assert.match(fs.readFileSync(path.join(iconsDir, 'index.js'), 'utf8'), /module\.exports = \{\s*\n\s*\n/)
  t.assert.deepStrictEqual(require(path.join(iconsDir, 'index.js')), {})
  t.assert.strictEqual(fs.readdirSync(iconsDir).filter(file => file.endsWith('.js') && file !== 'index.js').length, 0)
})

test('build-svgs CLI delegates to the builder', async function (/** @type {import('node:test').TestContext} */ t) {
  t.plan(1)
  const builderPath = require.resolve('../../scripts/build-svgs.js')
  const cliPath = require.resolve('../../scripts/build-svgs-cli.js')
  /** @type {NodeModule & { exports: typeof buildSvgs }} */
  const builderModule = /** @type {NodeModule & { exports: typeof buildSvgs }} */ (require.cache[builderPath])
  const originalBuilder = builderModule.exports
  let calls = 0
  builderModule.exports = () => { calls++; return Promise.resolve() }
  delete require.cache[cliPath]
  t.after(() => {
    builderModule.exports = originalBuilder
  })

  require(cliPath)
  await new Promise(resolve => setImmediate(resolve))
  t.assert.strictEqual(calls, 1)
})

test('build-svgs CLI reports build failures and exits unsuccessfully', async function (/** @type {import('node:test').TestContext} */ t) {
  t.plan(3)
  const runBuild = require('../../scripts/build-svgs-cli.js')
  const originalExitCode = process.exitCode
  const originalConsoleError = console.error
  t.after(() => { process.exitCode = originalExitCode })
  let reportedError
  console.error = error => { reportedError = error }
  t.after(() => { console.error = originalConsoleError })
  const failure = new Error('generation failed')
  await runBuild(() => Promise.reject(failure))
  t.assert.strictEqual(reportedError, failure)
  t.assert.strictEqual(process.exitCode, 1)

  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'clinic-svgs-cli-'))
  t.after(() => fs.rmSync(root, { recursive: true, force: true }))
  const scriptsDir = path.join(root, 'scripts')
  fs.mkdirSync(scriptsDir)
  fs.writeFileSync(path.join(scriptsDir, 'build-svgs.js'), "module.exports = () => Promise.reject(new Error('generation failed'))\n")
  fs.copyFileSync(require.resolve('../../scripts/build-svgs-cli.js'), path.join(scriptsDir, 'build-svgs-cli.js'))

  const result = spawnSync(process.execPath, [path.join(scriptsDir, 'build-svgs-cli.js')], { encoding: 'utf8' })
  t.assert.strictEqual(result.status, 1)
})
