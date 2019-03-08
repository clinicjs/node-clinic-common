const button = require('./button.js')
const helpers = require('./helpers.js')
const overlay = require('./context-overlay.js')
const elHighlighter = require('./element-highlighter.js')

const chevronRight = require('../icons/chevron-right')
const chevronLeft = require('../icons/chevron-left')
const close = require('../icons/close')

class WalkthroughPlayer {
  constructor ({ steps = [], showBackdrop = false, showControls = true, onProgress }) {
    this.steps = steps
    this.showBackdrop = showBackdrop
    this.onProgress = onProgress
    this.currentStepIndex = undefined

    this.distanceFromElement = 5

    this.wrapper = document.createElement('div')
    this.wrapper.classList.add('nc-walkthrough-wrapper')

    this.content = document.createElement('div')
    this.content.classList.add('nc-walkthrough-content')

    this.wrapper.appendChild(this.content)

    if (showControls) {
      this.wrapper.appendChild(button({
        classNames: ['closeBtn'],
        leftIcon: close,
        onClick: () => this.end()
      }))
      this.controls = document.createElement('div')
      this.controls.classList.add('nc-walkthrough-controls')

      this.prevBtn = button({
        leftIcon: chevronLeft,
        onClick: e => this.prev()
      })
      this.controls.appendChild(this.prevBtn)

      this.stepsWrapper = document.createElement('div')
      this.stepsWrapper.classList.add('nc-walkthrough-controls-steps')

      this.steps.forEach(s => {
        this.stepsWrapper.appendChild(helpers.toHtml(`<span class="step"/>`))
      })
      this.controls.appendChild(this.stepsWrapper)

      this.nextBtn = button({
        classNames: ['nextBtn'],
        rightIcon: chevronRight,
        label: 'Next',
        onClick: e => this.next()
      })
      this.controls.appendChild(this.nextBtn)

      this.controls.appendChild(button({
        classNames: ['doneBtn'],
        label: 'Done!',
        onClick: e => this.end()
      }))

      this.wrapper.appendChild(this.controls)
    }
  }

  start () {
    this.currentStepIndex = 0
    this._render()
  }

  next () {
    this.currentStepIndex++
    this._render()
  }

  prev () {
    this.currentStepIndex--
    this._render()
  }

  skipTo (index) {
    this.currentStepIndex = index
    this._render()
  }

  end () {
    overlay.hide()
    this.currentStepIndex = undefined
    this._hideBackDrop()
    this.onProgress && this.onProgress(this.currentStepIndex)
  }

  _showBackDrop () {
    const step = this.steps[this.currentStepIndex]
    elHighlighter.show({
      element: document.querySelector(step.attachTo),
      padding: this.distanceFromElement - 2
    })
  }

  _hideBackDrop () {
    elHighlighter.hide()
  }

  _render () {
    this.currentStepIndex = Math.min(this.currentStepIndex, this.steps.length - 1)
    this.currentStepIndex = Math.max(this.currentStepIndex, 0)

    if (this.currentStepIndex < 0) this.currentStepIndex = 0

    this.onProgress && this.onProgress(this.currentStepIndex)

    this.wrapper.classList.toggle('done', this.currentStepIndex === this.steps.length - 1)
    this.prevBtn.disabled = this.currentStepIndex === 0

    if (this.showControls) {
      this.prev.setAttribute('disabled', this.currentStepIndex <= 0 ? true : null)
    }

    const step = this.steps[this.currentStepIndex]
    this.content.innerHTML = ''
    this.content.appendChild(helpers.toHtml(step.msg))

    overlay.show({
      msg: this.wrapper,
      classNames: ['wt-container'],
      offset: { y: -this.distanceFromElement, height: this.distanceFromElement * 2 },
      targetElement: document.querySelector(step.attachTo),
      showArrow: true
    })

    Array.from(this.stepsWrapper.children).forEach((c, i) => {
      c.classList.toggle('current', i === this.currentStepIndex)
    })

    if (this.showBackdrop) this._showBackDrop()

    this.nextBtn.focus()
  }
}

module.exports = WalkthroughPlayer
