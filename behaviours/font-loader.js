'use strict'

const WebFont = require('webfontloader')

const init = ({ onLoad, ...opts } = {}) => {
  const timeoutId = setTimeout(() => active('Timeout'), 2000)

  const active = err => {
    clearTimeout(timeoutId)

    if (onLoad) {
      onLoad(err)
    }
  }

  const destroy = () => null

  WebFont.load({
    custom: {
      families: ['Archia:n4,n7', 'Campton:n7', 'Space Mono:n4,n7'],
      urls: ['https://adoring-einstein-015923.netlify.com/assets/css/fonts.css']
    },
    active,
    ...opts
  })

  return {
    destroy
  }
}

module.exports = init
