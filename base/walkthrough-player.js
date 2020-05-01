const button = require('./button.js')
const helpers = require('./helpers.js')
const ContextOverlay = require('./context-overlay.js')
const elHighlighter = require('./element-highlighter.js')

const chevronRight = require('../icons/chevron-right')
const chevronLeft = require('../icons/chevron-left')
const close = require('../icons/close')

const WtOverlay = new ContextOverlay()

class WalkthroughPlayer {
  constructor ({ steps = [], showBackdrop = false, showControls = true, onProgress }) {
    this.steps = steps
    this.showBackdrop = showBackdrop
    this.onProgress = onProgress
    this.currentStepIndex = undefined

    this.visible = false

    this.distanceFromElement = 5

    this.wrapper = document.createElement('div')
    this.wrapper.classList.add('nc-walkthrough-wrapper')

    this.content = document.createElement('div')
    this.content.classList.add('nc-walkthrough-content')

    this.wrapper.appendChild(this.content)

    this.wrapper.addEventListener('keyup', (event) => {
      if (event.code === 'Escape') {
        this.end()
      }
    })

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
        this.stepsWrapper.appendChild(helpers.toHtml('<span class="step"/>'))
      })
      this.controls.appendChild(this.stepsWrapper)

      this.nextBtn = button({
        classNames: ['nextBtn'],
        rightIcon: chevronRight,
        label: 'Next',
        onClick: e => this.next()
      })
      this.controls.appendChild(this.nextBtn)

      this.doneBtn = button({
        classNames: ['doneBtn'],
        label: 'Done!',
        onClick: e => this.end()
      })
      this.controls.appendChild(this.doneBtn)

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
    this.visible = false
    WtOverlay.hide()
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

    const isDone = this.currentStepIndex === this.steps.length - 1

    this.wrapper.classList.toggle('done', isDone)

    if (this.currentStepIndex === 0) {
      this.prevBtn.style.visible = 'hidden'
    }

    if (this.showControls) {
      this.prev.setAttribute('disabled', this.currentStepIndex <= 0 ? true : null)
    }

    this.onProgress && this.onProgress(this.currentStepIndex)

    const step = this.steps[this.currentStepIndex]

    WtOverlay.show({
      classNames: ['wt-container', this.visible ? 'zoom-out' : ''],
      offset: { y: -this.distanceFromElement, height: this.distanceFromElement * 2 },
      targetElement: document.querySelector(step.attachTo),
      showArrow: true
    })

    setTimeout(() => {
      this.content.innerHTML = ''
      this.content.appendChild(helpers.toHtml(step.msg))
      this.prevBtn.style.visibility = this.currentStepIndex === 0 ? 'hidden' : 'visible'

      WtOverlay.updateContent({
        msg: this.wrapper,
        classNames: ['wt-container', 'zoom-in', `wt-step-${this.currentStepIndex}`]
      })
      if (isDone) {
        this.doneBtn.focus()
      } else {
        this.nextBtn.focus()
      }
    }, 300)

    Array.from(this.stepsWrapper.children).forEach((c, i) => {
      c.classList.toggle('current', i === this.currentStepIndex)
    })

    if (this.showBackdrop) this._showBackDrop()

    this.visible = true
  }
}

module.exports = WalkthroughPlayer
