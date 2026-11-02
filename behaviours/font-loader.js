'use strict'

const styleSheetUrl = 'https://clinicjs.org/assets/css/fonts.css'
const allFonts = [
  'Archia:n4',
  'Archia:n7',
  'Campton:n7',
  'Space Mono:n4',
  'Space Mono:n7'
]

const parseFont = font => {
  const [family, variant] = font.split(':')
  const weight = variant === 'n7' ? 700 : 400
  return {
    family,
    variant,
    descriptor: `${weight} 16px "${family}"`
  }
}
const parsedFonts = allFonts.map(parseFont)

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
  let isDestroyed = false
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
    if (isDestroyed) return
    didTimeout = true
    if (onTimeout) onTimeout()
    maybeLoadAfterTimeout()
  }, timeout)

  const loadFonts = () => Promise.all(parsedFonts.map(async font => {
    try {
      const loadedFaces = await document.fonts.load(font.descriptor)
      if (isDestroyed) return false
      if (loadedFaces.length > 0) {
        loadedFonts.add(`${font.family}:${font.variant}`)
        maybeLoadAfterTimeout()
        return true
      }
    } catch {}

    return false
  }))

  stylesheet.onload = () => {
    loadFonts().then(results => {
      if (isDestroyed) return
      const anyFontsLoaded = results.some(Boolean)
      if (anyFontsLoaded && !didLoad) {
        didLoad = true
        clearTimeout(timeoutId)
        if (onLoad) onLoad()
      }
    })
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
