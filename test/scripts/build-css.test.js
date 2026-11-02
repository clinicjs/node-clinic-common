/** @type {typeof import('node:test')} */
const test = require('node:test')
const fs = require('fs')
const os = require('os')
const path = require('path')
const buildCss = require('../../scripts/build-css.js')

test('buildCss inlines imports and adds a source map in debug mode', async function (/** @type {import('node:test').TestContext} */ t) {
  t.plan(4)
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'clinic-css-'))
  t.after(() => fs.rmSync(root, { recursive: true, force: true }))
  const stylePath = path.join(root, 'main.css')
  fs.writeFileSync(path.join(root, 'reset.css'), '.reset { margin: 0; }')
  fs.writeFileSync(stylePath, '@import "./reset.css";\n.main { color: red; }')

  const css = await buildCss({ stylePath, debug: true })
  t.assert.match(css, /\.reset\s*\{\s*margin: 0;/)
  t.assert.match(css, /\.main\s*\{\s*color: red;/)
  const sourceMapData = css.match(/sourceMappingURL=data:application\/json;base64,([A-Za-z0-9+/=]+)/)
  t.assert.ok(sourceMapData && JSON.parse(Buffer.from(/** @type {string} */ (sourceMapData[1]), 'base64').toString()).version === 3)

  const productionCss = await buildCss({ stylePath, debug: false })
  t.assert.doesNotMatch(productionCss, /sourceMappingURL/)
})

test('buildCss rejects missing input files', async function (/** @type {import('node:test').TestContext} */ t) {
  t.plan(2)
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'clinic-css-'))
  t.after(() => fs.rmSync(root, { recursive: true, force: true }))
  await t.assert.rejects(buildCss({ stylePath: path.join(root, 'missing.css') }), { code: 'ENOENT' })

  const stylePath = path.join(root, 'main.css')
  fs.writeFileSync(stylePath, '@import "./missing-import.css";')
  await t.assert.rejects(buildCss({ stylePath, debug: false }), /Failed to find/)
})
