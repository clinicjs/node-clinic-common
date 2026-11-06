/** @type {typeof import('node:test').test} */
const test = require('node:test')
const { installDom } = require('../../test-support/dom.js')

test('base entry point exports its public components', function (/** @type {import("node:test").TestContext} */ t) {
  t.plan(11)
  installDom(t)
  const base = require('../../base/index.js')
  const expected = {
    button: require('../../base/button.js'),
    checkbox: require('../../base/checkbox.js'),
    dropdown: require('../../base/drop-down.js'),
    helpers: require('../../base/helpers.js'),
    ContextOverlay: require('../../base/context-overlay.js'),
    Walkthrough: require('../../base/walkthrough-player.js'),
    link: require('../../base/link.js'),
    walkthroughButton: require('../../base/walkthrough-button.js'),
    accordion: require('../../base/accordion.js'),
    collapsibleContainer: require('../../base/collapsible-container.js')
  }

  t.assert.deepStrictEqual(Object.keys(base), Object.keys(expected))
  for (const key of /** @type {Array<keyof typeof expected>} */ (Object.keys(expected))) {
    t.assert.strictEqual(base[key], expected[key], `${key} export`)
  }
})
