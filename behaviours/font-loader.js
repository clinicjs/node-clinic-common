'use strict'

const WebFont = require('webfontloader')

const styleSheetUrl = 'https://clinicjs.org/assets/css/fonts.css'
const allFonts = [
  'Archia:n4',
  'Archia:n7',
  'Campton:n7',
  'Space Mono:n4',
  'Space Mono:n7'
]

const init = (opts = {}) => {
  const {
    onLoad,
    onTimeout,
    onLoadAfterTimeout,
    timeout = 2000,
    criticalFonts = allFonts
  } = opts

  // Flag loaded state
  let isLoading = true
  // Keep track of loaded fonts
  const loadedFonts = []

  // Ensure timeout is triggered if all fonts fail to load
  const timeoutId = setTimeout(() => {
    isLoading = false

    if (onTimeout) {
      onTimeout()
    }

    maybeLoadAfterTimeout()
  }, timeout)

  // Check loaded fonts array against given critical fonts
  const maybeLoadAfterTimeout = () => {
    // If loaded already, exit
    if (isLoading) {
      return
    }

    // Create array of difference between loaded fonts and critical fonts
    const loadedCriticalFonts = loadedFonts.filter(
      item => criticalFonts.indexOf(item) > -1
    )

    // Call onLoadAfterTimeout if all critical fonts have loaded
    if (criticalFonts.length === loadedCriticalFonts.length && onLoadAfterTimeout) {
      isLoading = false

      onLoadAfterTimeout()
    }
  }

  // On all font load
  const active = () => {
    isLoading = false
    clearTimeout(timeoutId)

    if (onLoad) {
      onLoad()
    }
  }

  // On individual font load
  const fontactive = (font, variant) => {
    loadedFonts.push(`${font}:${variant}`)
    maybeLoadAfterTimeout()
  }

  // Noop
  const destroy = () => null

  const webFontOpts = Object.assign({
    custom: {
      families: allFonts,
      urls: [styleSheetUrl]
    },
    active,
    fontactive
  }, opts)

  // Kick things off
  WebFont.load(webFontOpts)

  return {
    destroy
  }
}

module.exports = init
