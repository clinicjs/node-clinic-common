'use strict'

const styles = require('./styles')
const createButton = require('./button')
const createTray = require('./tray')

const CLASS = {
  BUTTON_NOTIFIED: 'is-notified',
  TRAY_VISIBLE: 'is-tray-visible',
  TRAY_ACTIVE: 'is-tray-active'
}

const getUploadIdFromLocation = () =>
  window.location.href.split('/').pop().split('.html').shift()

const timeoutFrame = (cb, duration) => setTimeout(
  () => window.requestAnimationFrame(cb),
  duration
)

const defaultOpts = {
  // The element to append the tray to
  trayContainer: document.body,
  // Button options
  button: {
    text: 'Ask an expert'
  },
  // Tray options
  tray: {
    title: 'Ask an expert',
    command: `clinic ask ${getUploadIdFromLocation()}`
  },
  // Style options. A simple map of variable key: values
  styleVars: {
    'colourText': 'white',
    'colourCode': '#E9F100',
    'colourNotificationDot': '#2165E5',
    'colourTrayBackdrop': 'rgba(0, 0, 0, 0.6)',
    'colourTray': '#292d39'
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
  const $buttonWrapper = document.createElement('div')
  const $trayWrapper = document.createElement('div')

  // Add styles to <style> element with options
  $style.innerHTML = styles(opts.styleVars)
  // Add button to wrapper element
  $buttonWrapper.innerHTML += createButton(opts.button)
  // Add tray to wrapper element
  $trayWrapper.innerHTML += createTray(opts.tray)

  // Get DOM node refs
  const $body = document.body
  const $button = $buttonWrapper.querySelector('button')
  const $trayBackdrop = $trayWrapper.querySelector('div')
  const $trayClose = $trayWrapper.querySelector('button')

  const notifyButton = () => $button.classList.add(CLASS.BUTTON_NOTIFIED)

  const unNotifyButton = () => {
    clearTimeout(buttonNotificationTimeoutId)
    $button.classList.remove(CLASS.BUTTON_NOTIFIED)
  }

  // Check tray state
  const isTrayToggled = () => $body.classList.contains(CLASS.TRAY_VISIBLE)

  // Opens closes tray
  const toggleTray = () => {
    unNotifyButton()

    if (!isTrayToggled()) {
      $body.classList.add(CLASS.TRAY_VISIBLE)
      timeoutFrame(() => $body.classList.add(CLASS.TRAY_ACTIVE), 100)
    } else {
      const removeVisibleClass = () => {
        $body.classList.remove(CLASS.TRAY_VISIBLE)
        $trayBackdrop.removeEventListener('transitionend', removeVisibleClass)
      }

      $trayBackdrop.addEventListener('transitionend', removeVisibleClass)
      $body.classList.remove(CLASS.TRAY_ACTIVE)
    }
  }

  // Handles clicking of button or tray background
  const handleToggleClick = e => {
    e.preventDefault()
    toggleTray()
  }

  // Handles esc keyup event
  const handleWindowKeyUp = e => {
    if (e.keyCode === 27 && isTrayToggled()) {
      toggleTray()
    }
  }

  // Destroys created elements and cleans up event listeners
  const destroy = () => {
    $button.removeEventListener('click', handleToggleClick)
    $trayBackdrop.removeEventListener('click', handleToggleClick)
    $trayClose.removeEventListener('click', handleToggleClick)
    window.removeEventListener('keyup', handleWindowKeyUp)
    $buttonWrapper.remove()
    $style.remove()
  }

  // Append button and wrapper to given container
  opts.buttonContainer.appendChild($buttonWrapper)
  // Append tray and wrapper to given container
  opts.trayContainer.appendChild($trayWrapper)
  // Output styles in head
  document.head.appendChild($style)

  // Bind event listeners
  $button.addEventListener('click', handleToggleClick)
  $trayBackdrop.addEventListener('click', handleToggleClick)
  $trayClose.addEventListener('click', handleToggleClick)
  window.addEventListener('keyup', handleWindowKeyUp)

  // Notify button
  const buttonNotificationTimeoutId = timeoutFrame(notifyButton, 4000)

  return {
    toggleTray,
    destroy
  }
}

module.exports = init
