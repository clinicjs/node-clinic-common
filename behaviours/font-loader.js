'use strict'

const WebFont = require('webfontloader')

const init = ({ onLoad } = {}) => {
  const timeoutId = setTimeout(() => active(), 2000)

  const active = () => {
    clearTimeout(timeoutId)

    if (onLoad) {
      onLoad()
    }
  }

  const destroy = () => null

  WebFont.load({
    custom: {
      families: ['Archia:n4,n7', 'Campton:n7', 'Space Mono:n4,n7'],
      urls: ['https://adoring-einstein-015923.netlify.com/assets/css/fonts.css']
    },
    active
  })

  return {
    destroy
  }
}

module.exports = init
