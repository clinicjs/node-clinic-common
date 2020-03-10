const test = require('tap').test
const path = require('path')
const checkForTranspiledCode = require('../lib/source-check.js')

test('test file - plain Javascript no source map', function (t) {
  const filename = path.join('test', 'fixtures', 'plain-js-no-sourcemap.js')
  checkForTranspiledCode(filename)
})

test('test file - plain Javascript with source map', function (t) {
})

test('test file - transpiled Javascript no source map', function (t) {
})

test('test file - transpiled Javascript with source map', function (t) {
})
