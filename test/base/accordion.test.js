/** @type {typeof import('node:test').test} */
const test = require('node:test')
const { installDom } = require('../../test-support/dom.js')

test('accordion toggles and reports expansion changes', function (/** @type {import("node:test").TestContext} */ t) {
  t.plan(3)
  installDom(t)
  const createAccordion = require('../../base/accordion.js')
  const changes = /** @type {boolean[]} */([])
  const accordion = createAccordion({ label: 'Options', content: 'Details', onClick: value => changes.push(value) })

  const toggleButton = /** @type {HTMLButtonElement} */ (/** @type {unknown} */ (accordion.children[0]))
  toggleButton.click()
  toggleButton.click()
  t.assert.ok(accordion.classList.contains('show-expand-icon'))
  t.assert.deepStrictEqual(changes, [true, false])
  t.assert.ok(!accordion.classList.contains('expanded'))
})

test('accordion can start expanded', function (/** @type {import("node:test").TestContext} */ t) {
  t.plan(2)
  installDom(t)
  const createAccordion = require('../../base/accordion.js')
  const accordion = createAccordion({ label: 'Open', isExpanded: true })

  t.assert.ok(accordion.classList.contains('expanded'))
  t.assert.ok(!accordion.classList.contains('show-expand-icon'))
})

test('accordion passes disabled and title options to its button', function (/** @type {import("node:test").TestContext} */ t) {
  t.plan(2)
  installDom(t)
  const createAccordion = require('../../base/accordion.js')
  const accordion = createAccordion({ label: 'Locked', disabled: true, title: 'Unavailable' })
  const toggleButton = /** @type {HTMLButtonElement} */ (/** @type {unknown} */ (accordion.children[0]))
  t.assert.strictEqual(toggleButton.disabled, true)
  t.assert.strictEqual(toggleButton.title, 'Unavailable')
})
