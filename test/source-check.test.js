const test = require('tap').test
const path = require('path')
const checkForTranspiledCode = require('../lib/source-check.js')

test('test file - plain Javascript no source map', function (t) {
  const filename = path.join('test', 'fixtures', 'plain-no-sourcemap.js')
  t.strictEqual(checkForTranspiledCode(filename), false)
  t.end()
})

test('test file - plain Javascript with source map', function (t) {
  const filename = path.join('test', 'fixtures', 'plain-with-sourcemap.js')
  t.strictEqual(checkForTranspiledCode(filename), true)
  t.end()
})

test('test file - transpiled Javascript no source map', function (t) {
  const filename = path.join('test', 'fixtures', 'transpiled-no-sourcemap.js')
  t.strictEqual(checkForTranspiledCode(filename), true)
  t.end()
})

test('test file - transpiled Javascript with source map', function (t) {
  const filename = path.join('test', 'fixtures', 'transpiled-with-sourcemap.js')
  t.strictEqual(checkForTranspiledCode(filename), true)
  t.end()
})
