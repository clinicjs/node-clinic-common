/** @type {typeof import('node:test').test} */
const test = require('node:test')
const { installDom } = require('../../test-support/dom.js')

/** @param {Document} document */
function registerTargets (document) {
  for (const [id, left] of /** @type {Array<[string, number]>} */ ([['one', 10], ['two', 100]])) {
    const target = document.createElement('div')
    target.id = id
    target.getBoundingClientRect = () => /** @type {DOMRect} */ (/** @type {unknown} */ ({ left, top: 30, width: 20, height: 20 }))
    document.body.appendChild(target)
  }
}

test('walkthrough player builds controls for its steps', function (/** @type {import("node:test").TestContext} */ t) {
  t.plan(3)
  installDom(t)
  const WalkthroughPlayer = require('../../base/walkthrough-player.js')
  const player = new WalkthroughPlayer({
    steps: [{ attachTo: '#one', msg: 'First' }, { attachTo: '#two', msg: 'Second' }]
  })

  t.assert.strictEqual(player.steps.length, 2)
  t.assert.strictEqual(/** @type {HTMLDivElement} */ (/** @type {unknown} */ (player.stepsWrapper)).children.length, 2)
  t.assert.ok(player.wrapper.classList.contains('nc-walkthrough-wrapper'))
})

test('walkthrough player navigates steps, enables previous, and reports progress', async function (/** @type {import("node:test").TestContext} */ t) {
  t.plan(10)
  t.mock.timers.enable({ apis: ['setTimeout'] })
  const { document } = installDom(t)
  registerTargets(document)
  const WalkthroughPlayer = require('../../base/walkthrough-player.js')
  const progress = /** @type {Array<number | undefined>} */([])
  const player = new WalkthroughPlayer({
    steps: [{ attachTo: '#one', msg: 'First' }, { attachTo: '#two', msg: 'Second' }],
    showBackdrop: true,
    onProgress: index => progress.push(index)
  })

  player.start()
  t.assert.strictEqual(player.currentStepIndex, 0)
  t.assert.strictEqual(/** @type {HTMLButtonElement} */ (/** @type {unknown} */ (player.prevBtn)).disabled, true)
  const overlay = /** @type {HTMLElement} */ (/** @type {unknown} */ (Array.from(document.body.children).find(child => child.classList.contains('nc-context-overlay'))))
  t.assert.strictEqual(overlay.style.left, '20px')
  t.mock.timers.tick(300)

  player.next()
  t.assert.strictEqual(player.currentStepIndex, 1)
  t.assert.strictEqual(/** @type {HTMLButtonElement} */ (/** @type {unknown} */ (player.prevBtn)).disabled, false)
  t.assert.strictEqual(overlay.style.left, '110px')
  t.mock.timers.tick(300)

  player.prev()
  t.assert.strictEqual(player.currentStepIndex, 0)
  t.assert.strictEqual(/** @type {HTMLButtonElement} */ (/** @type {unknown} */ (player.prevBtn)).disabled, true)
  player.skipTo(1)
  t.assert.strictEqual(player.currentStepIndex, 1)
  t.mock.timers.tick(300)

  const browserWindow = /** @type {Window & typeof globalThis} */ (document.defaultView)
  player.wrapper.dispatchEvent(new browserWindow.KeyboardEvent('keyup', { code: 'Escape' }))
  t.assert.deepStrictEqual(progress, [0, 1, 0, 1, undefined])
})

test('walkthrough controls invoke navigation, done, and close actions', async function (/** @type {import("node:test").TestContext} */ t) {
  t.plan(4)
  t.mock.timers.enable({ apis: ['setTimeout'] })
  const { document } = installDom(t)
  registerTargets(document)
  const WalkthroughPlayer = require('../../base/walkthrough-player.js')
  const steps = [{ attachTo: '#one', msg: 'First' }, { attachTo: '#two', msg: 'Second' }]
  const player = new WalkthroughPlayer({ steps, showBackdrop: true })

  player.start()
  t.mock.timers.tick(300)
  const nextBtn = /** @type {HTMLButtonElement} */ (/** @type {unknown} */ (player.nextBtn))
  nextBtn.click()
  t.assert.strictEqual(player.currentStepIndex, 1)
  t.mock.timers.tick(300)
  const prevBtn = /** @type {HTMLButtonElement} */ (/** @type {unknown} */ (player.prevBtn))
  prevBtn.click()
  t.assert.strictEqual(player.currentStepIndex, 0)
  t.mock.timers.tick(300)
  const doneBtn = /** @type {HTMLButtonElement} */ (/** @type {unknown} */ (player.doneBtn))
  doneBtn.click()
  t.assert.strictEqual(player.currentStepIndex, undefined)

  const secondPlayer = new WalkthroughPlayer({ steps, showBackdrop: true })
  secondPlayer.start()
  t.mock.timers.tick(300)
  const closeBtn = /** @type {HTMLButtonElement} */ (/** @type {unknown} */ (secondPlayer.wrapper.children[1]))
  closeBtn.click()
  t.assert.strictEqual(secondPlayer.currentStepIndex, undefined)
})

test('walkthrough can render without controls or a backdrop', async function (/** @type {import("node:test").TestContext} */ t) {
  t.plan(3)
  t.mock.timers.enable({ apis: ['setTimeout'] })
  const { document } = installDom(t)
  registerTargets(document)
  const WalkthroughPlayer = require('../../base/walkthrough-player.js')
  const player = new WalkthroughPlayer({
    steps: [{ attachTo: '#one', msg: 'First' }],
    showControls: false
  })

  player.start()
  t.assert.strictEqual(player.currentStepIndex, 0)
  t.mock.timers.tick(300)
  t.assert.strictEqual(player.content.children.length, 1)
  player.end()
  t.assert.strictEqual(player.currentStepIndex, undefined)
})

test('walkthrough cancels a pending render when it ends early', function (/** @type {import("node:test").TestContext} */ t) {
  t.plan(3)
  t.mock.timers.enable({ apis: ['setTimeout'] })
  const { document } = installDom(t)
  registerTargets(document)
  const WalkthroughPlayer = require('../../base/walkthrough-player.js')
  const player = new WalkthroughPlayer({ steps: [{ attachTo: '#one', msg: 'First' }] })

  player.start()
  player.end()
  t.assert.strictEqual(player.currentStepIndex, undefined)
  t.assert.strictEqual(document.querySelector('.nc-context-overlay'), null)

  t.mock.timers.tick(300)
  t.assert.strictEqual(player.content.children.length, 0)
})

test('walkthrough players replace an active player without cross-ending', function (/** @type {import("node:test").TestContext} */ t) {
  t.plan(3)
  t.mock.timers.enable({ apis: ['setTimeout'] })
  const { document } = installDom(t)
  registerTargets(document)
  const WalkthroughPlayer = require('../../base/walkthrough-player.js')
  const steps = [{ attachTo: '#one', msg: 'First' }]
  const first = new WalkthroughPlayer({ steps })
  const second = new WalkthroughPlayer({ steps })

  first.start()
  t.mock.timers.tick(300)
  second.start()
  t.mock.timers.tick(300)
  first.end()
  t.assert.strictEqual(Array.from(document.body.children).filter(child => child.classList.contains('nc-context-overlay')).length, 1)
  t.assert.strictEqual(second.currentStepIndex, 0)
  second.end()
  t.assert.strictEqual(document.querySelector('.nc-context-overlay'), null)
})

test('walkthrough rejects an empty step list', function (/** @type {import("node:test").TestContext} */ t) {
  t.plan(1)
  installDom(t)
  const WalkthroughPlayer = require('../../base/walkthrough-player.js')
  t.assert.throws(() => new WalkthroughPlayer({ steps: [] }), { name: 'RangeError' })
})
