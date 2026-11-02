/** @type {typeof import('node:test').test} */
const test = require('node:test')
const { installDom } = require('../../test-support/dom.js')

test('checkbox applies options and attaches change handler', function (/** @type {import("node:test").TestContext} */ t) {
  t.plan(6)
  const { window } = installDom(t)
  const createCheckbox = require('../../base/checkbox.js')
  let changes = 0
  const onChange = () => { changes++ }
  const checkbox = createCheckbox({
    classNames: ['wide'],
    checked: true,
    disabled: true,
    indeterminate: true,
    onChange
  })
  const input = /** @type {HTMLInputElement} */ (/** @type {unknown} */ (checkbox.querySelector('input')))

  t.assert.ok(checkbox.classList.contains('nc-checkbox'))
  t.assert.ok(checkbox.classList.contains('wide'))
  t.assert.strictEqual(input.disabled, true)
  t.assert.strictEqual(input.checked, true)
  t.assert.strictEqual(input.indeterminate, true)
  input.dispatchEvent(new window.Event('change', { bubbles: true }))
  t.assert.strictEqual(changes, 1)
})

test('checkbox renders optional labels and supports missing change handler', function (/** @type {import("node:test").TestContext} */ t) {
  t.plan(3)
  const { window } = installDom(t)
  const createCheckbox = require('../../base/checkbox.js')
  const checkbox = createCheckbox({ leftLabel: 'Before', rightLabel: 'After' })

  t.assert.match(checkbox.innerHTML, /checkbox-copy-label">Before/)
  t.assert.match(checkbox.innerHTML, /checkbox-copy-label">After/)
  const input = /** @type {HTMLInputElement} */ (/** @type {unknown} */ (checkbox.querySelector('input')))
  input.dispatchEvent(new window.Event('change', { bubbles: true }))
  t.assert.strictEqual(input.checked, false)
})
