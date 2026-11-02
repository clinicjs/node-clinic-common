/** @type {typeof import('node:test').test} */
const test = require('node:test')
const { installDom } = require('../../test-support/dom.js')

test('button renders its options and wires enabled click events', function (/** @type {import("node:test").TestContext} */ t) {
  t.plan(5)
  installDom(t)
  const createButton = require('../../base/button.js')
  let clicked = false
  const button = createButton({
    label: 'Continue',
    classNames: ['primary'],
    disabled: false,
    title: 'Next step',
    onClick: () => { clicked = true }
  })

  t.assert.strictEqual(button.disabled, false)
  t.assert.strictEqual(button.title, 'Next step')
  t.assert.ok(button.className.includes('primary'))
  t.assert.ok(button.innerHTML.includes('Continue'))
  button.click()
  t.assert.strictEqual(clicked, true)
})

test('button reflects the disabled option', function (/** @type {import("node:test").TestContext} */ t) {
  t.plan(1)
  installDom(t)
  const createButton = require('../../base/button.js')
  const button = createButton({ disabled: true })

  t.assert.strictEqual(button.disabled, true)
})

test('button update replaces classes and click handlers', function (/** @type {import("node:test").TestContext} */ t) {
  t.plan(4)
  installDom(t)
  const createButton = require('../../base/button.js')
  let firstClicks = 0
  let secondClicks = 0
  const button = createButton({ classNames: ['first'], onClick: () => { firstClicks++ } })
  button.update({ classNames: ['second'], onClick: () => { secondClicks++ } })

  t.assert.ok(button.classList.contains('second'))
  t.assert.ok(!button.classList.contains('first'))
  button.click()
  t.assert.strictEqual(firstClicks, 0)
  t.assert.strictEqual(secondClicks, 1)
})
