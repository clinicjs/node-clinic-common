/** @type {typeof import('node:test').test} */
const test = require('node:test')
const helpers = require('../../base/helpers.js')
const { installDom } = require('../../test-support/dom.js')

test('toHtml creates a span for text and applies a default class', function (/** @type {import("node:test").TestContext} */ t) {
  t.plan(2)
  installDom(t)

  const node = helpers.toHtml('message', 'default')
  t.assert.strictEqual(node.className, 'default')
  t.assert.strictEqual(node.textContent, 'message')
})

test('toHtml returns the basic tag and class parsed from markup', function (/** @type {import("node:test").TestContext} */ t) {
  t.plan(2)
  installDom(t)

  const element = helpers.toHtml('<div class="from-markup">content</div>')
  t.assert.strictEqual(element.tagName, 'DIV')
  t.assert.strictEqual(element.className, 'from-markup')
})

test('toHtml converts function results and preserves element classes', function (/** @type {import("node:test").TestContext} */ t) {
  t.plan(3)
  installDom(t)
  const node = helpers.toHtml(() => 'from function')
  t.assert.strictEqual(node.textContent, 'from function')
  t.assert.strictEqual(helpers.toHtml(() => 'with class', 'custom').className, 'custom')

  const element = /** @type {HTMLElement} */ (/** @type {unknown} */ ({ nodeType: 1, className: 'existing', classList: { length: 1 } }))
  t.assert.strictEqual(helpers.toHtml(element, 'default').className, 'existing')
})

test('toHtml rejects non-elements and unsupported values', function (/** @type {import("node:test").TestContext} */ t) {
  t.plan(2)
  t.assert.throws(() => helpers.toHtml(/** @type {HTMLElement} */ (/** @type {unknown} */ ({ nodeType: 3 }))), TypeError)
  t.assert.throws(() => helpers.toHtml(/** @type {HTMLElement} */ (/** @type {unknown} */ (42))), TypeError)
})
