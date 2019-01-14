'use strict'

const styles = require('./styles')
const button = require('./button')

const CLASS = {
  BUTTON_NOTIFIED: 'is-notified'
}

const defaultOpts = {
  // The element to append the tray to
  trayContainer: document.body,
  // Button options
  button: {
    text: 'Ask an expert'
  },
  // Style options. A simple map of variable key: values
  styleVars: {
    'colour-accent-primary': '#2165E5'
  }
}

const init = (userOpts = {}) => {
  if (!userOpts.buttonContainer) {
    throw new Error('Please specify a buttonContainer element')
  }

  // Merge options with defaults
  const opts = Object.assign({}, defaultOpts, userOpts)

  // Create new elements
  const $style = document.createElement('style')
  const $wrapper = document.createElement('div')

  // Add styles to <style> element with options
  $style.innerHTML = styles(opts.styleVars)
  // Add button to wrapper element
  $wrapper.innerHTML += button(opts.button)

  // Get button element
  const $button = $wrapper.querySelector('button')

  const notifyButton = () => $button.classList.add(CLASS.BUTTON_NOTIFIED)

  const unNotifyButton = () => {
    clearTimeout(buttonNotificationTimeoutId)
    $button.classList.remove(CLASS.BUTTON_NOTIFIED)
  }

  // Handles clicking of button or tray background
  const handleToggleClick = e => {
    e.preventDefault()
    toggleTray()
  }

  // Opens closes tray
  const toggleTray = () => {
    unNotifyButton()
    console.log('Open tray')
  }

  // Destroys created elements and cleans up event listeners
  const destroy = () => {
    $button.removeEventListener('click', handleToggleClick)
    $wrapper.remove()
    $style.remove()
  }

  // Append button and wrapper to given container
  opts.buttonContainer.appendChild($wrapper)
  // Output styles in head
  document.head.appendChild($style)

  // Bind event listeners
  $button.addEventListener('click', handleToggleClick)

  // Notify button
  const buttonNotificationTimeoutId = setTimeout(
    () => window.requestAnimationFrame(notifyButton),
    4000
  )

  return {
    toggleTray,
    destroy
  }
}

module.exports = init
