'use strict'

/// <reference path="../types/jsdom.d.ts" />

const { JSDOM } = require('jsdom')

/**
 * Install a fresh jsdom document and window on `global`.
 * When a test context is supplied, register cleanup that closes the window and
 * restores the previous globals after the test.
 * @param {{ after: (callback: () => void) => void }} [testContext]
 * @returns {{ document: import('jsdom').DOMWindow['document'], window: import('jsdom').DOMWindow, dom: import('jsdom').JSDOM }}
 */
function installDom (testContext) {
  const hadDocument = Object.hasOwn(global, 'document')
  const previousDocument = global.document
  const hadWindow = Object.hasOwn(global, 'window')
  const previousWindow = global.window
  const dom = new JSDOM('<!doctype html><html><head></head><body></body></html>')

  global.document = dom.window.document
  global.window = /** @type {Window & typeof globalThis} */ (/** @type {unknown} */ (dom.window))

  if (testContext) {
    testContext.after(() => {
      dom.window.close()
      if (hadDocument) global.document = previousDocument
      else delete (/** @type {{ document?: Document }} */ (global)).document
      if (hadWindow) global.window = previousWindow
      else delete (/** @type {{ window?: Window & typeof globalThis }} */ (global)).window
    })
  }

  return { document: dom.window.document, window: dom.window, dom }
}

module.exports = { installDom }
