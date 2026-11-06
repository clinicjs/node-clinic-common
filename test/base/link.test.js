/** @type {typeof import('node:test').test} */
const test = require('node:test')
const { installDom } = require('../../test-support/dom.js')

test('link renders attributes, classes, and label', function (/** @type {import("node:test").TestContext} */ t) {
  t.plan(5)
  installDom(t)
  const createLink = require('../../base/link.js')
  const link = createLink({
    label: 'Clinic',
    href: '/clinic',
    target: '_blank',
    title: 'Open Clinic',
    classNames: ['external']
  })

  t.assert.strictEqual(link.getAttribute('href'), '/clinic')
  t.assert.strictEqual(link.getAttribute('target'), '_blank')
  t.assert.strictEqual(link.title, 'Open Clinic')
  t.assert.match(link.innerHTML, /<span class="label">Clinic<\/span>/)
  t.assert.ok(link.classList.contains('external'))
})

test('link supports empty optional fields', function (/** @type {import("node:test").TestContext} */ t) {
  t.plan(4)
  installDom(t)
  const createLink = require('../../base/link.js')
  const link = createLink()

  t.assert.strictEqual(link.title, '')
  t.assert.strictEqual(link.hasAttribute('href'), false)
  t.assert.strictEqual(link.getAttribute('target'), '')
  t.assert.strictEqual(link.hasAttribute('rel'), false)
})

test('link protects new-window links from opener access', function (/** @type {import("node:test").TestContext} */ t) {
  t.plan(1)
  installDom(t)
  const createLink = require('../../base/link.js')
  const link = createLink({ href: '/clinic', target: '_blank' })
  t.assert.strictEqual(link.getAttribute('rel'), 'noopener noreferrer')
})
