'use strict'

const styleSheetUrl = 'https://clinicjs.org/assets/css/fonts.css'

const allFonts = /** @type {const} */ ([
  'Archia:n4',
  'Archia:n7',
  'Campton:n7',
  'Space Mono:n4',
  'Space Mono:n7'
])

/** @typedef {typeof allFonts[number]} FontIdentifier */

/**
 * Parse a family and variant identifier into a CSS FontFace descriptor.
 * @param {FontIdentifier} font Built-in font identifier in `Family:variant` form.
 * @returns {{ identifier: FontIdentifier, family: string, variant: string, descriptor: string }} Parsed font data.
 */
const parseFont = font => {
  const separatorIndex = font.indexOf(':')
  const family = font.slice(0, separatorIndex)
  const variant = font.slice(separatorIndex + 1)
  const weight = variant === 'n7' ? 700 : 400
  return {
    identifier: font,
    family,
    variant,
    descriptor: `${weight} 16px "${family}"`
  }
}
const parsedFonts = allFonts.map(parseFont)

/**
 * @typedef {Object} FontLoaderOptions
 * @property {() => void} [onLoad] Called when at least one font loads.
 * @property {() => void} [onTimeout] Called when the configured timeout expires.
 * @property {() => void} [onLoadAfterTimeout] Called when critical fonts load after timeout.
 * @property {number} [timeout=2000] Timeout in milliseconds.
 * @property {ReadonlyArray<FontIdentifier>} [criticalFonts] Built-in critical font identifiers to wait for.
 */

/**
 * Start loading the stylesheet and fonts.
 * @param {FontLoaderOptions} [opts]
 * @returns {{ destroy: () => void }} Handle that cancels pending work and removes the stylesheet.
 */
const init = (opts = {}) => {
  const {
    onLoad,
    onTimeout,
    onLoadAfterTimeout,
    timeout = 2000,
    criticalFonts = allFonts
  } = opts

  let didTimeout = false
  let didLoad = false
  let didLoadAfterTimeout = false
  let didStartLoading = false
  let isDestroyed = false
  /** @type {Set<FontIdentifier>} */
  const loadedFonts = new Set()
  const stylesheet = document.createElement('link')
  stylesheet.rel = 'stylesheet'
  stylesheet.href = styleSheetUrl

  const maybeLoadAfterTimeout = () => {
    if (isDestroyed || !didTimeout || didLoadAfterTimeout || !onLoadAfterTimeout) return

    const allCriticalFontsLoaded = criticalFonts.every(font => loadedFonts.has(font))
    if (allCriticalFontsLoaded) {
      didLoadAfterTimeout = true
      onLoadAfterTimeout()
    }
  }

  const timeoutId = setTimeout(() => {
    didTimeout = true
    if (onTimeout) onTimeout()
    maybeLoadAfterTimeout()
  }, timeout)

  const loadFonts = () => parsedFonts.forEach(async font => {
    let loadedFaces
    try {
      loadedFaces = await document.fonts.load(font.descriptor)
    } catch {
      return
    }

    if (isDestroyed || loadedFaces.length === 0) return
    loadedFonts.add(font.identifier)
    maybeLoadAfterTimeout()
    if (!didLoad) {
      didLoad = true
      clearTimeout(timeoutId)
      if (onLoad) onLoad()
    }
  })

  stylesheet.onload = () => {
    if (isDestroyed || didStartLoading) return
    didStartLoading = true

    loadFonts()
  }

  document.head.appendChild(stylesheet)

  return {
    destroy: () => {
      isDestroyed = true
      clearTimeout(timeoutId)
      stylesheet.onload = null
      stylesheet.onerror = null
      stylesheet.remove()
    }
  }
}

module.exports = init
