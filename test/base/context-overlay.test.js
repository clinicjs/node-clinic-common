/** @type {typeof import('node:test').test} */
const test = require('node:test')
const { installDom } = require('../../test-support/dom.js')

test('context overlay attaches, displays content, and detaches', function (/** @type {import("node:test").TestContext} */ t) {
  t.plan(10)
  const { document } = installDom(t)
  const ContextOverlay = require('../../base/context-overlay.js')
  const overlay = new ContextOverlay()

  overlay.show({
    targetRect: { left: 40, top: 30, width: 100, height: 40 },
    classNames: ['tip'],
    msg: 'Help text',
    showArrow: true
  })

  t.assert.strictEqual(Array.from(document.body.children).includes(overlay.overlayEl), true)
  t.assert.ok(overlay.overlayEl.classList.contains('tip'))
  t.assert.strictEqual(overlay.isDisplayed, true)
  t.assert.deepStrictEqual([overlay.overlayEl.style.left, overlay.overlayEl.style.top], ['90px', '80px'])
  t.assert.deepStrictEqual(overlay.getPosition(), {
    ttLeft: 90,
    ttTop: 80,
    verticalAlign: 'bottom',
    target: { x: 40, y: 30, width: 100, height: 40 }
  })

  overlay.show({ targetRect: { left: 10, top: 10, width: 20, height: 20 } })
  t.assert.strictEqual(Array.from(document.body.children).filter(child => child === overlay.overlayEl).length, 1)
  t.assert.strictEqual(overlay.overlayInnerEl.children.length, 0)

  overlay.hide()
  t.assert.strictEqual(overlay.isDisplayed, false)
  t.assert.strictEqual(overlay.getPosition(), null)
  overlay.hide()
  t.assert.strictEqual(document.body.children.length, 0)
})

test('context overlay centers without a target and repositions after resize', function (/** @type {import("node:test").TestContext} */ t) {
  t.plan(6)
  t.mock.timers.enable({ apis: ['setTimeout'] })
  const { document, window } = installDom(t)
  Object.defineProperty(document.documentElement, 'clientWidth', { configurable: true, value: 1200 })
  Object.defineProperty(document.documentElement, 'clientHeight', { configurable: true, value: 800 })
  Object.defineProperty(window, 'innerHeight', { configurable: true, value: 800 })
  const ContextOverlay = require('../../base/context-overlay.js')
  const overlay = new ContextOverlay()

  overlay.show({ classNames: [], outerRect: null })
  t.assert.ok(overlay.overlayEl.classList.contains('arrowBottom') === false)
  t.assert.strictEqual(overlay.overlayEl.style.left, '600px')

  overlay.updateContent()
  t.assert.strictEqual(overlay.overlayInnerEl.style.width, '200px')
  overlay.updateContent({ msg: 'Centered' })
  t.assert.strictEqual(overlay.overlayInnerEl.style.maxWidth, 'none')
  Object.defineProperty(document.documentElement, 'clientWidth', { configurable: true, value: 1400 })
  window.dispatchEvent(new window.Event('resize'))
  t.mock.timers.tick(200)
  t.assert.strictEqual(overlay.overlayEl.style.left, '700px')
  t.assert.strictEqual(overlay.isDisplayed, true)
  overlay.hide()
})

test('context overlay uses target elements, offsets, and viewport bounds', function (/** @type {import("node:test").TestContext} */ t) {
  t.plan(4)
  installDom(t)
  const ContextOverlay = require('../../base/context-overlay.js')
  const overlay = new ContextOverlay()
  const targetElement = /** @type {Element} */ (/** @type {unknown} */ ({
    getBoundingClientRect: () => ({ left: 750, top: 30, width: 30, height: 20 })
  }))

  overlay.show({
    targetElement,
    offset: { x: 10, y: 5, width: 5, height: 3 },
    showArrow: true,
    outerRect: /** @type {{ left: number, top: number, width: number, height: number, right: number, bottom: number }} */ ({ left: 0, top: 0, width: 100, height: 800, right: 100, bottom: 800 }),
    msg: 'Near right edge'
  })

  t.assert.strictEqual(overlay.overlayEl.style.left, '777.5px')
  t.assert.strictEqual(overlay.overlayInnerEl.style.maxWidth, '100px')
  overlay.updatePosition({ offset: { x: 0, y: 0, width: 0, height: 0 } })
  t.assert.strictEqual(/** @type {NonNullable<ReturnType<ContextOverlay['getPosition']>>} */ (overlay.getPosition()).ttLeft, 765)
  overlay.updateContent({ targetRect: { left: 100, top: 40, width: 40, height: 10 } })
  t.assert.deepStrictEqual(/** @type {NonNullable<ReturnType<ContextOverlay['getPosition']>>} */ (overlay.getPosition()).target, { x: 100, y: 40, width: 40, height: 10 })
  overlay.hide()
})

test('context overlay keeps top-aligned content inside the viewport', function (/** @type {import("node:test").TestContext} */ t) {
  t.plan(2)
  installDom(t)
  const ContextOverlay = require('../../base/context-overlay.js')
  const overlay = new ContextOverlay()

  overlay.show({
    targetRect: { left: 40, top: 0, width: 40, height: 10 },
    verticalAlign: 'top',
    showArrow: true,
    outerRect: null,
    msg: 'Top edge'
  })

  t.assert.strictEqual(overlay.overlayInnerEl.style.top, '15px')
  t.assert.ok(!overlay.overlayEl.classList.contains('arrowTop'))
  overlay.hide()
})

test('context overlay switches to top alignment for lower targets', function (/** @type {import("node:test").TestContext} */ t) {
  t.plan(1)
  const { window } = installDom(t)
  Object.defineProperty(window, 'innerHeight', { configurable: true, value: 800 })
  const ContextOverlay = require('../../base/context-overlay.js')
  const overlay = new ContextOverlay()

  overlay.show({
    targetRect: { left: 40, top: 700, width: 40, height: 20 },
    msg: 'Lower target'
  })

  t.assert.ok(overlay.overlayEl.classList.contains('arrowBottom'))
  overlay.hide()
})

test('context overlay clamps pointer-aligned content at a negative target edge', function (/** @type {import("node:test").TestContext} */ t) {
  t.plan(2)
  installDom(t)
  const ContextOverlay = require('../../base/context-overlay.js')
  const overlay = new ContextOverlay()

  overlay.show({
    targetRect: { left: -100, top: 400, width: 100, height: 20 },
    verticalAlign: 'center',
    pointerCoords: { x: 20 },
    outerRect: null,
    msg: 'Pointer'
  })

  t.assert.strictEqual(overlay.overlayInnerEl.style.left, '80px')
  t.assert.ok(!overlay.overlayEl.classList.contains('showArrow'))
  overlay.hide()
})

test('context overlay clamps wide content at the target left edge', function (/** @type {import("node:test").TestContext} */ t) {
  t.plan(1)
  const { document } = installDom(t)
  const ContextOverlay = require('../../base/context-overlay.js')
  const overlay = new ContextOverlay()
  const message = document.createElement('span')
  Object.defineProperties(message, {
    offsetWidth: { configurable: true, value: 200 },
    offsetHeight: { configurable: true, value: 20 }
  })

  overlay.show({
    targetRect: { left: 100, top: 400, width: 40, height: 20 },
    verticalAlign: 'center',
    outerRect: /** @type {{ left: number, top: number, width: number, height: number, right: number, bottom: number }} */ ({ left: 0, top: 0, width: 1000, height: 800, right: 1000, bottom: 800 }),
    msg: message
  })
  t.assert.strictEqual(overlay.overlayInnerEl.style.left, '-20px')
  overlay.hide()
})
