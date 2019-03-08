const Wt = require('./walkthrough-player')
const button = require('./button.js')
const helpIcon = require('../icons/circle-question')

module.exports = (steps, onProgress) => {
  const wt = new Wt({
    steps,
    onProgress,
    showBackdrop: true,
    showControls: true
  })
  const hdtwButton = button({
    label: 'How does this work',
    rightIcon: helpIcon,
    classNames: ['how-does-ot-work', 'secondary-btn', 'nc-animation-pulse'],
    onClick: () => wt.start()
  })
  return {
    button: hdtwButton,
    WtPlayer: wt
  }
}
