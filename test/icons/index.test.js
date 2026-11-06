/** @type {typeof import('node:test')} */
const test = require('node:test')
const fs = require('fs')
const path = require('path')

test('individual icon modules export SVG markup', function (/** @type {import('node:test').TestContext} */ t) {
  t.plan(3)
  const iconsDir = path.join(__dirname, '../../icons')
  const iconFiles = fs.readdirSync(iconsDir).filter(file => file.endsWith('.js') && file !== 'index.js')
  const icons = iconFiles.map(file => require(path.join(iconsDir, file)))

  t.assert.ok(icons.length > 0)
  t.assert.ok(icons.every(icon => typeof icon === 'string' && icon.includes('<svg')))
  /** @type {Record<string, string>} */
  const iconIndex = /** @type {Record<string, string>} */ (require('../../icons/index.js'))
  t.assert.ok(iconFiles.every(file => iconIndex[path.basename(file, '.js')] === require(path.join(iconsDir, file))))
})

test('icon index exports named icon markup', function (/** @type {import('node:test').TestContext} */ t) {
  t.plan(3)
  const icons = require('../../icons/index.js')
  const iconFiles = fs.readdirSync(path.join(__dirname, '../../icons')).filter(file => file.endsWith('.js') && file !== 'index.js')

  t.assert.ok(Object.keys(icons).length > 0)
  t.assert.ok(Object.values(icons).every(icon => icon.includes('<svg')))
  t.assert.deepStrictEqual(Object.keys(icons).sort(), iconFiles.map(file => path.basename(file, '.js')).sort())
})
