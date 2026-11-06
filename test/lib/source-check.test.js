const test = require('node:test')
const path = require('path')
const fs = require('fs')
const os = require('os')
const checkForTranspiledCode = require('../../lib/source-check.js')

test('test file - plain Javascript no source map', function (/** @type {import('node:test').TestContext} */ t) {
  t.plan(1)
  const filename = path.join(__dirname, '../fixtures/plain-no-sourcemap.js')
  t.assert.strictEqual(checkForTranspiledCode(filename), false)
})

test('test file - plain Javascript with source map', function (/** @type {import('node:test').TestContext} */ t) {
  t.plan(1)
  const filename = path.join(__dirname, '../fixtures/plain-with-sourcemap.js')
  t.assert.strictEqual(checkForTranspiledCode(filename), true)
})

test('test file - transpiled Javascript no source map', function (/** @type {import('node:test').TestContext} */ t) {
  t.plan(1)
  const filename = path.join(__dirname, '../fixtures/transpiled-no-sourcemap.js')
  t.assert.strictEqual(checkForTranspiledCode(filename), true)
})

test('test file - transpiled Javascript with source map', function (/** @type {import('node:test').TestContext} */ t) {
  t.plan(1)
  const filename = path.join(__dirname, '../fixtures/transpiled-with-sourcemap.js')
  t.assert.strictEqual(checkForTranspiledCode(filename), true)
})

test('source without named functions is not classified as transpiled', function (/** @type {import('node:test').TestContext} */ t) {
  t.plan(2)
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'clinic-source-check-'))
  t.after(() => fs.rmSync(root, { recursive: true, force: true }))
  const filename = path.join(root, 'plain.js')
  fs.writeFileSync(filename, 'const add = (a, b) => a + b')
  t.assert.strictEqual(checkForTranspiledCode(filename), false)
  fs.writeFileSync(filename, '')
  t.assert.strictEqual(checkForTranspiledCode(filename), false)
})
