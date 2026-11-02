/** @type {typeof import('node:test')} */
const test = require('node:test')
const { installDom } = require('../../test-support/dom.js')

test('spinner adds, updates, and removes its loading indicator', /** @param {import('node:test').TestContext} t */ function (t) {
  t.plan(11)
  const { document, window } = installDom(t)
  const spinner = require('../../spinner/index.js')
  window.dispatchEvent(new window.Event('load'))
  t.assert.ok(document.body.classList.contains('content-ready'))

  const container = document.createElement('main')
  const loading = spinner.attachTo(container)
  loading.show()
  const spinnerElement = /** @type {HTMLElement} */ (document.body.children[0])

  t.assert.ok(container.classList.contains('_loading_spinner_container'))
  t.assert.ok(spinnerElement.classList.contains('_loading_spinner_'))
  t.assert.match(spinnerElement.style.cssText, /Loading file/)

  loading.show('Reading profile')
  t.assert.strictEqual(document.body.children.length, 1)
  t.assert.match(spinnerElement.style.cssText, /Reading profile/)

  loading.show('Reading "profile"\nnext\fend')
  t.assert.ok(spinnerElement.style.cssText.includes('Reading \\"profile\\"\\a next\\c end'))

  loading.hide()
  t.assert.strictEqual(document.body.children.length, 0)
  t.assert.ok(!container.classList.contains('_loading_spinner_container'))
  loading.hide()
  t.assert.strictEqual(document.body.children.length, 0)

  const neverShown = spinner.attachTo(container)
  neverShown.hide()
  t.assert.strictEqual(document.body.children.length, 0)
})

test('spinner keeps a shared container marked loading until every spinner hides', /** @param {import('node:test').TestContext} t */ function (t) {
  t.plan(3)
  const { document } = installDom(t)
  const spinner = require('../../spinner/index.js')
  const container = document.createElement('main')
  const first = spinner.attachTo(container)
  const second = spinner.attachTo(container)
  first.show()
  second.show()
  first.hide()
  t.assert.ok(container.classList.contains('_loading_spinner_container'))
  second.hide()
  t.assert.ok(!container.classList.contains('_loading_spinner_container'))
  t.assert.strictEqual(document.body.children.length, 0)
})
