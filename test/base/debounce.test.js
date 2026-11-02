/** @type {typeof import('node:test').test} */
const test = require('node:test')
const debounce = require('../../base/debounce.js')

test('debounce waits for a quiet period and calls with the latest arguments and receiver', function (/** @type {import("node:test").TestContext} */ t) {
  t.plan(3)
  t.mock.timers.enable({ apis: ['setTimeout'] })
  const receiver = {}
  const calls = /** @type {Array<{ receiver: typeof receiver, value: string }>} */([])
  const debounced = debounce(/** @this {typeof receiver} @param {string} value */ function (value) {
    calls.push({ receiver: this, value })
  }, 10)

  debounced.call(receiver, 'first')
  t.mock.timers.tick(9)
  t.assert.deepStrictEqual(calls, [])
  debounced.call(receiver, 'latest')

  t.mock.timers.tick(9)
  t.assert.deepStrictEqual(calls, [])
  t.mock.timers.tick(1)
  t.assert.deepStrictEqual(calls, [{ receiver, value: 'latest' }])
})
