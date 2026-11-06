const test = require('node:test')
const escapeCssString = require('../../lib/escape-css-string.js')

test('escapeCssString escapes quotes, backslashes, and CSS line breaks', function (/** @type {import('node:test').TestContext} */ t) {
  t.plan(1)
  t.assert.strictEqual(escapeCssString('say "hi"\\\nnext\rend\f'), 'say \\"hi\\"\\\\\\a next\\d end\\c ')
})
