/** @type {typeof import('node:test')} */
const test = require('node:test')
const { installDom } = require('../test-support/dom.js')

test('DOM setup uses jsdom selectors, events, and HTML parsing', /** @param {import('node:test').TestContext} t */ function (t) {
  t.plan(4)
  const { document, window } = installDom(t)
  document.body.innerHTML = '<button class="action">Run</button>'
  const button = /** @type {HTMLButtonElement} */ (document.querySelector('.action'))
  let clicks = 0
  button.addEventListener('click', () => { clicks++ })
  button.dispatchEvent(new window.MouseEvent('click', { bubbles: true }))

  t.assert.strictEqual(button.tagName, 'BUTTON')
  t.assert.strictEqual(button.parentNode, document.body)
  t.assert.strictEqual(clicks, 1)
  t.assert.strictEqual(new window.DOMParser().parseFromString('plain text', 'text/html').body.firstElementChild, null)
})

test('DOM setup restores preexisting globals', /** @param {import('node:test').TestContext} t */ function (t) {
  t.plan(4)
  const hadDocument = Object.hasOwn(global, 'document')
  const previousDocument = global.document
  const hadWindow = Object.hasOwn(global, 'window')
  const previousWindow = global.window
  t.after(() => {
    if (hadDocument) global.document = previousDocument
    else delete (/** @type {{ document?: Document }} */ (global)).document
    if (hadWindow) global.window = previousWindow
    else delete (/** @type {{ window?: Window & typeof globalThis }} */ (global)).window
  })

  const document = /** @type {Document} */ (/** @type {unknown} */ ({}))
  const window = /** @type {Window & typeof globalThis} */ (/** @type {unknown} */ ({}))
  global.document = document
  global.window = window
  /** @type {(() => void) | undefined} */
  let restore
  const dom = installDom({ after: callback => { restore = callback } })
  t.assert.notStrictEqual(dom.document, document)
  t.assert.notStrictEqual(dom.window, window)
  const restoreCallback = /** @type {() => void} */ (restore)
  restoreCallback()
  t.assert.strictEqual(global.document, document)
  t.assert.strictEqual(global.window, window)
})
