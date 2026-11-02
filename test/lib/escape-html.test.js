const test = require('node:test')
const escapeHtml = require('../../lib/escape-html.js')

test('escapeHtml escapes text and attribute metacharacters', function (/** @type {import('node:test').TestContext} */ t) {
  t.plan(2)
  t.assert.strictEqual(escapeHtml('&<>"' + "'"), '&amp;&lt;&gt;&quot;&#39;')
  t.assert.strictEqual(escapeHtml(null), '')
})
