/** @type {typeof import('node:test')} */
const test = require('node:test')
const initFontLoader = require('../../behaviours/font-loader.js')

/**
 * @typedef {{ tagName: string, rel: string, href: string, onload: (() => void) | null, onerror: (() => void) | null, parentNode: FakeFontHead | null, remove: () => void }} FakeStylesheet
 * @typedef {{ children: FakeStylesheet[], appendChild: (element: FakeStylesheet) => void, removeChild: (element: FakeStylesheet) => void }} FakeFontHead
 * @typedef {{ head: FakeFontHead, createElement: (tagName: string) => FakeStylesheet, fonts: { load: (descriptor: string) => Promise<unknown[]> } }} FakeFontDocument
 */

/**
 * @param {(descriptor: string) => Promise<unknown[]>} loadFont
 * @returns {FakeFontDocument}
 */
function installFontDom (loadFont) {
  /** @type {FakeFontHead} */
  const head = {
    children: [],
    appendChild (element) {
      this.children.push(element)
      element.parentNode = this
    },
    removeChild (element) {
      this.children.splice(this.children.indexOf(element), 1)
      element.parentNode = null
    }
  }
  /** @type {FakeFontDocument} */
  const document = {
    head,
    createElement: (tagName) => {
      /** @type {FakeStylesheet} */
      const stylesheet = {
        tagName,
        rel: '',
        href: '',
        onload: null,
        onerror: null,
        parentNode: null,
        remove () {
          if (this.parentNode) this.parentNode.removeChild(this)
        }
      }
      return stylesheet
    },
    fonts: { load: loadFont }
  }
  global.document = /** @type {Document} */ (/** @type {unknown} */ (document))
  return document
}

/** @param {FakeFontDocument} document */
function getStylesheet (document) {
  return /** @type {FakeStylesheet} */ (document.head.children[0])
}

/** @param {FakeFontDocument} document */
function fireStylesheetLoad (document) {
  /** @type {() => void} */ (getStylesheet(document).onload)()
}

test('font loader reports successful loads and destroys its stylesheet', /** @param {import('node:test').TestContext} t */ async function (t) {
  t.plan(5)
  t.mock.timers.enable({ apis: ['setTimeout'] })
  const document = installFontDom(async () => [{}])
  let loadCount = 0
  let timeoutCount = 0
  const loader = initFontLoader({
    timeout: 100,
    onLoad: () => { loadCount++ },
    onTimeout: () => { timeoutCount++ }
  })
  const stylesheet = getStylesheet(document)

  t.assert.strictEqual(stylesheet.rel, 'stylesheet')
  fireStylesheetLoad(document)
  await new Promise(resolve => setImmediate(resolve))
  t.assert.strictEqual(loadCount, 1)
  t.mock.timers.tick(100)
  t.assert.strictEqual(timeoutCount, 0)

  loader.destroy()
  t.assert.strictEqual(document.head.children.length, 0)
  t.assert.strictEqual(stylesheet.onload, null)
})

test('font loader reports timeout and critical fonts that load afterward', /** @param {import('node:test').TestContext} t */ async function (t) {
  t.plan(2)
  t.mock.timers.enable({ apis: ['setTimeout'] })
  /** @type {((faces: unknown[]) => void) | undefined} */
  let resolveCriticalFont
  const document = installFontDom(descriptor => {
    if (descriptor === '400 16px "Archia"') {
      return new Promise(resolve => { resolveCriticalFont = resolve })
    }
    return Promise.resolve([])
  })
  /** @type {string[]} */
  const callbacks = []
  const loader = initFontLoader({
    timeout: 5,
    criticalFonts: ['Archia:n4'],
    onTimeout: () => callbacks.push('timeout'),
    onLoadAfterTimeout: () => callbacks.push('after timeout'),
    onLoad: () => callbacks.push('load')
  })

  fireStylesheetLoad(document)
  t.mock.timers.tick(5)
  t.assert.deepStrictEqual(callbacks, ['timeout'])

  const resolveFont = /** @type {(faces: unknown[]) => void} */ (resolveCriticalFont)
  resolveFont([{}])
  await new Promise(resolve => setImmediate(resolve))
  t.assert.deepStrictEqual(callbacks, ['timeout', 'after timeout', 'load'])
  loader.destroy()
})

test('font loader destroy cancels timeout callbacks', /** @param {import('node:test').TestContext} t */ async function (t) {
  t.plan(2)
  t.mock.timers.enable({ apis: ['setTimeout'] })
  const document = installFontDom(async () => [])
  let timedOut = false
  const loader = initFontLoader({ timeout: 5, onTimeout: () => { timedOut = true } })

  loader.destroy()
  t.mock.timers.tick(5)
  t.assert.strictEqual(document.head.children.length, 0)
  t.assert.strictEqual(timedOut, false)
})

test('font loader still completes when a non-critical font fails', /** @param {import('node:test').TestContext} t */ async function (t) {
  t.plan(2)
  t.mock.timers.enable({ apis: ['setTimeout'] })
  const document = installFontDom(descriptor => {
    if (descriptor === '700 16px "Campton"') return Promise.reject(new Error('font unavailable'))
    return Promise.resolve([{}])
  })
  /** @type {string[]} */
  const callbacks = []
  const loader = initFontLoader({
    timeout: 50,
    criticalFonts: ['Archia:n4'],
    onLoad: () => callbacks.push('load'),
    onTimeout: () => callbacks.push('timeout')
  })

  fireStylesheetLoad(document)
  await new Promise(resolve => setImmediate(resolve))
  t.mock.timers.tick(50)
  t.assert.deepStrictEqual(callbacks, ['load'])
  t.assert.strictEqual(document.head.children.length, 1)
  loader.destroy()
})

test('font loader ignores duplicate stylesheet load events', /** @param {import('node:test').TestContext} t */ async function (t) {
  t.plan(2)
  t.mock.timers.enable({ apis: ['setTimeout'] })
  let fontLoadCount = 0
  let onLoadCount = 0
  const document = installFontDom(async () => {
    fontLoadCount++
    return [{}]
  })
  const loader = initFontLoader({ timeout: 5, onLoad: () => { onLoadCount++ } })

  fireStylesheetLoad(document)
  await new Promise(resolve => setImmediate(resolve))
  fireStylesheetLoad(document)
  await new Promise(resolve => setImmediate(resolve))
  t.assert.strictEqual(fontLoadCount, 5)
  t.assert.strictEqual(onLoadCount, 1)
  loader.destroy()
})

test('font loader allows optional callbacks to be omitted', /** @param {import('node:test').TestContext} t */ async function (t) {
  t.plan(1)
  /** @type {string[]} */
  const descriptors = []
  const document = installFontDom(async descriptor => {
    descriptors.push(descriptor)
    return [{}]
  })
  const loader = initFontLoader()

  fireStylesheetLoad(document)
  await new Promise(resolve => setImmediate(resolve))
  t.assert.deepStrictEqual(descriptors, [
    '400 16px "Archia"',
    '700 16px "Archia"',
    '700 16px "Campton"',
    '400 16px "Space Mono"',
    '700 16px "Space Mono"'
  ])
  loader.destroy()
})

test('font loader ignores font results that arrive after destroy', /** @param {import('node:test').TestContext} t */ async function (t) {
  t.plan(2)
  /** @type {Array<(faces: unknown[]) => void>} */
  const resolveFonts = []
  const document = installFontDom(() => new Promise(resolve => { resolveFonts.push(resolve) }))
  let loaded = false
  const loader = initFontLoader({ onLoad: () => { loaded = true } })
  fireStylesheetLoad(document)
  loader.destroy()

  resolveFonts.forEach(resolve => resolve([{}]))
  await new Promise(resolve => setImmediate(resolve))
  t.assert.strictEqual(loaded, false)
  t.assert.strictEqual(document.head.children.length, 0)
})

test('font loader handles an empty critical-font list after timeout', /** @param {import('node:test').TestContext} t */ async function (t) {
  t.plan(2)
  t.mock.timers.enable({ apis: ['setTimeout'] })
  const document = installFontDom(async () => [])
  /** @type {string[]} */
  const callbacks = []
  const loader = initFontLoader({
    timeout: 5,
    criticalFonts: [],
    onTimeout: () => callbacks.push('timeout'),
    onLoadAfterTimeout: () => callbacks.push('after timeout')
  })

  t.mock.timers.tick(5)
  t.assert.deepStrictEqual(callbacks, ['timeout', 'after timeout'])
  t.assert.strictEqual(document.head.children.length, 1)
  loader.destroy()
})

test('font loader stops timeout follow-up work after its callback destroys it', /** @param {import('node:test').TestContext} t */ async function (t) {
  t.plan(1)
  t.mock.timers.enable({ apis: ['setTimeout'] })
  /** @type {Array<(faces: unknown[]) => void>} */
  const resolveFonts = []
  const document = installFontDom(() => new Promise(resolve => { resolveFonts.push(resolve) }))
  const loader = initFontLoader({
    timeout: 5,
    criticalFonts: ['Archia:n4'],
    onLoadAfterTimeout: () => loader.destroy()
  })

  fireStylesheetLoad(document)
  t.mock.timers.tick(5)
  resolveFonts.forEach(resolve => resolve([{}]))
  await new Promise(resolve => setImmediate(resolve))
  t.assert.strictEqual(document.head.children.length, 0)
})

test('font loader reports a successful font without waiting for unrelated font requests', /** @param {import('node:test').TestContext} t */ async function (t) {
  t.plan(1)
  /** @type {string[]} */
  const callbacks = []
  const document = installFontDom(descriptor => {
    if (descriptor === '400 16px "Archia"') return new Promise(() => {})
    if (descriptor === '700 16px "Campton"') return Promise.resolve([{}])
    return Promise.resolve([])
  })
  const loader = initFontLoader({ onLoad: () => callbacks.push('load') })
  fireStylesheetLoad(document)
  await new Promise(resolve => setImmediate(resolve))
  t.assert.deepStrictEqual(callbacks, ['load'])
  loader.destroy()
})

test('font loader does not invoke timeout follow-up after the timeout callback destroys it', /** @param {import('node:test').TestContext} t */ async function (t) {
  t.plan(1)
  t.mock.timers.enable({ apis: ['setTimeout'] })
  installFontDom(async () => [])
  /** @type {string[]} */
  const callbacks = []
  const loader = initFontLoader({
    timeout: 5,
    criticalFonts: [],
    onTimeout: () => {
      callbacks.push('timeout')
      loader.destroy()
    },
    onLoadAfterTimeout: () => callbacks.push('after timeout')
  })

  t.mock.timers.tick(5)
  t.assert.deepStrictEqual(callbacks, ['timeout'])
})
