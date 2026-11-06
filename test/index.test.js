const test = require('node:test')

test('package entry point exposes the shared library functions', function (/** @type {import('node:test').TestContext} */ t) {
  t.plan(2)
  const common = require('..')

  t.assert.strictEqual(common.getLoggingPaths, require('../lib/get-logging-paths.js'))
  t.assert.strictEqual(common.checkForTranspiledCode, require('../lib/source-check.js'))
})
