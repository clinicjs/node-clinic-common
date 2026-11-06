/** @type {typeof import('node:test').test} */
const test = require('node:test')
const { installDom } = require('../../test-support/dom.js')

test('collapsible container toggles its expanded state and height', function (/** @type {import("node:test").TestContext} */ t) {
  t.plan(5)
  const { document, window } = installDom(t)
  const createContainer = require('../../base/collapsible-container.js')
  const container = createContainer({ content: 'Details', classNames: ['help'] })
  Object.defineProperties(container, {
    offsetParent: { configurable: true, value: document.body },
    scrollHeight: { configurable: true, value: 40 }
  })

  container.toggle(true)
  t.assert.ok(container.classList.contains('expanded'))
  t.assert.strictEqual(container.style.height, '40px')

  container.toggle(false)
  t.assert.strictEqual(container.style.height, '0px')
  t.assert.ok(container.classList.contains('expanded'))
  container.dispatchEvent(new window.Event('transitionend'))
  t.assert.ok(!container.classList.contains('expanded'))
})

test('collapsible container handles transition end and starts expanded', function (/** @type {import("node:test").TestContext} */ t) {
  t.plan(4)
  const { window } = installDom(t)
  const createContainer = require('../../base/collapsible-container.js')
  const container = createContainer({ isExpanded: true })

  t.assert.strictEqual(container.style.height, 'auto')
  container.dispatchEvent(new window.Event('transitionend'))
  t.assert.strictEqual(container.style.height, 'auto')

  Object.defineProperty(container, 'offsetParent', { configurable: true, value: null })
  container.toggle(false)
  t.assert.ok(!container.classList.contains('expanded'))
  container.toggle()
  t.assert.ok(container.classList.contains('expanded'))
})

test('collapsible container ignores bubbled transitions and unrelated properties', function (/** @type {import("node:test").TestContext} */ t) {
  t.plan(3)
  const { document, window } = installDom(t)
  const createContainer = require('../../base/collapsible-container.js')
  const container = createContainer({ content: 'Details' })
  Object.defineProperty(container, 'offsetParent', { configurable: true, value: document.body })
  container.toggle(true)
  container.toggle(false)
  const bubbledTransition = new window.Event('transitionend', { bubbles: true })
  Object.defineProperty(bubbledTransition, 'propertyName', { value: 'height' })
  document.body.appendChild(container)
  const child = window.document.createElement('span')
  container.appendChild(child)
  child.dispatchEvent(bubbledTransition)
  t.assert.ok(container.classList.contains('expanded'))
  const unrelatedTransition = new window.Event('transitionend')
  Object.defineProperty(unrelatedTransition, 'propertyName', { value: 'opacity' })
  container.dispatchEvent(unrelatedTransition)
  t.assert.ok(container.classList.contains('expanded'))
  const heightTransition = new window.Event('transitionend')
  Object.defineProperty(heightTransition, 'propertyName', { value: 'height' })
  container.dispatchEvent(heightTransition)
  t.assert.ok(!container.classList.contains('expanded'))
})
