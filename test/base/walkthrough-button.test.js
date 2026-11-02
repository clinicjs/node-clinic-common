/** @type {typeof import('node:test').test} */
const test = require('node:test')
const { installDom } = require('../../test-support/dom.js')

test('walkthrough button returns its button and player', function (/** @type {import("node:test").TestContext} */ t) {
  t.plan(3)
  installDom(t)
  const WalkthroughPlayer = require('../../base/walkthrough-player.js')
  const createWalkthroughButton = require('../../base/walkthrough-button.js')
  const walkthrough = createWalkthroughButton({
    steps: [{ attachTo: '#intro', msg: 'Welcome' }],
    label: 'Guide',
    title: 'Open guide'
  })

  t.assert.ok(walkthrough.button.classList.contains('walkthrough-button'))
  t.assert.strictEqual(walkthrough.button.title, 'Open guide')
  t.assert.ok(walkthrough.WtPlayer instanceof WalkthroughPlayer)
})

test('walkthrough button starts its player when clicked', async function (/** @type {import("node:test").TestContext} */ t) {
  t.plan(1)
  t.mock.timers.enable({ apis: ['setTimeout'] })
  const { document } = installDom(t)
  const intro = document.createElement('div')
  intro.id = 'intro'
  intro.getBoundingClientRect = () => /** @type {DOMRect} */ (/** @type {unknown} */ ({ left: 30, top: 30, width: 20, height: 20 }))
  document.body.appendChild(intro)
  const createWalkthroughButton = require('../../base/walkthrough-button.js')
  const walkthrough = createWalkthroughButton({
    steps: [{ attachTo: '#intro', msg: 'Welcome' }]
  })

  walkthrough.button.click()
  t.assert.strictEqual(walkthrough.WtPlayer.currentStepIndex, 0)
  t.mock.timers.tick(300)
  walkthrough.WtPlayer.end()
})
