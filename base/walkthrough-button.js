const Wt = require('./walkthrough-player')
const button = require('./button.js')
const helpIcon = require('../icons/circle-question')

module.exports = ({ steps, onProgress, label = 'How does this work', title }) => {
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
      title,
      classNames: ['walkthrough-button'],
      onClick: () => wt.start()
    }),
    WtPlayer: wt
  }
}
