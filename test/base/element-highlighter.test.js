/** @type {typeof import('node:test').test} */
const test = require('node:test')
const { installDom } = require('../../test-support/dom.js')

test('element highlighter renders a target and hides it', function (/** @type {import("node:test").TestContext} */ t) {
  t.plan(3)
  const { document } = installDom(t)
  const highlighter = require('../../base/element-highlighter.js')
  const element = document.createElement('div')
  element.getBoundingClientRect = () => /** @type {DOMRect} */ (/** @type {unknown} */ ({ left: 20, top: 30, width: 100, height: 40 }))

  highlighter.show({ element, padding: 8 })
  const wrapper = /** @type {HTMLElement} */ (/** @type {unknown} */ (document.body.children[0]))
  t.assert.ok(wrapper.classList.contains('show'))
  const border = /** @type {HTMLElement} */ (/** @type {unknown} */ (wrapper.querySelector('.nc-element-highlighter-border'))).style
  t.assert.deepStrictEqual([border.left, border.top, border.width, border.height], ['12px', '22px', '116px', '56px'])

  highlighter.hide()
  t.assert.ok(!wrapper.classList.contains('show'))
})

test('element highlighter recomputes its center after resize', function (/** @type {import("node:test").TestContext} */ t) {
  t.plan(4)
  t.mock.timers.enable({ apis: ['setTimeout'] })
  const { document, window } = installDom(t)
  Object.defineProperty(document.documentElement, 'clientWidth', { configurable: true, value: 1200 })
  Object.defineProperty(document.documentElement, 'clientHeight', { configurable: true, value: 800 })
  const highlighter = require('../../base/element-highlighter.js')

  highlighter.show({ element: null, padding: 2, showBorder: false })
  const wrapper = /** @type {HTMLElement} */ (/** @type {unknown} */ (document.body.children[0]))
  t.assert.ok(!wrapper.classList.contains('show-border'))
  t.assert.match(/** @type {HTMLElement} */ (/** @type {unknown} */ (wrapper.querySelector('.nc-element-highlighter-top'))).style.transform, /598px/)
  Object.defineProperty(document.documentElement, 'clientWidth', { configurable: true, value: 1400 })
  window.dispatchEvent(new window.Event('resize'))
  t.mock.timers.tick(200)
  t.assert.match(/** @type {HTMLElement} */ (/** @type {unknown} */ (wrapper.querySelector('.nc-element-highlighter-top'))).style.transform, /698px/)
  highlighter.hide()
  t.assert.strictEqual(document.body.children.length, 0)
})

test('element highlighter ignores a pending resize after hide', function (/** @type {import("node:test").TestContext} */ t) {
  t.plan(2)
  t.mock.timers.enable({ apis: ['setTimeout'] })
  const { document, window } = installDom(t)
  const highlighter = require('../../base/element-highlighter.js')
  let left = 20
  const element = /** @type {Element} */ (/** @type {unknown} */ ({ getBoundingClientRect: () => ({ left, top: 30, width: 100, height: 40 }) }))

  highlighter.show({ element })
  const wrapper = /** @type {HTMLElement} */ (/** @type {unknown} */ (document.body.children[0]))
  const border = /** @type {HTMLElement} */ (/** @type {unknown} */ (wrapper.querySelector('.nc-element-highlighter-border')))
  const initialStyle = border.style.cssText
  window.dispatchEvent(new window.Event('resize'))
  left = 200
  highlighter.hide()
  t.mock.timers.tick(200)

  t.assert.strictEqual(border.style.cssText, initialStyle)
  t.assert.strictEqual(document.body.children.length, 0)
})

test('element highlighter can be hidden before show and more than once', function (/** @type {import("node:test").TestContext} */ t) {
  t.plan(1)
  const { document } = installDom(t)
  const highlighter = require('../../base/element-highlighter.js')
  highlighter.hide()
  highlighter.show({ element: null })
  highlighter.hide()
  highlighter.hide()
  t.assert.strictEqual(document.body.children.length, 0)
})
