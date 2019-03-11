const Wt = require('./walkthrough-player')
const button = require('./button.js')
const helpIcon = require('../icons/circle-question')

module.exports = (steps, onProgress, label = 'How does this work') => {
  const wt = new Wt({
    steps,
    onProgress,
    showBackdrop: true,
    showControls: true
  })

  return {
    button: button({
      label,
      rightIcon: helpIcon,
      classNames: ['walkthrough-button', 'secondary-btn', 'nc-animation-pulse'],
      onClick: () => wt.start()
    }),
    WtPlayer: wt
  }
}
