'use strict'

const CLASS = {
  BUTTON_NOTIFIED: 'is-notified',
  TRAY_VISIBLE: 'is-tray-visible',
  TRAY_ACTIVE: 'is-tray-active'
}

const timeoutFrame = (cb, duration) => setTimeout(
  () => window.requestAnimationFrame(cb),
  duration
)

const init = () => {
  // Get DOM node refs
  const $body = document.body
  const $button = document.querySelector('[data-nc-ask-button]')
  const $trayBackdrop = document.querySelector('[data-nc-ask-tray-backdrop]')
  const $trayClose = document.querySelector('[data-nc-ask-tray-close]')

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
  }

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
