const button = require('./button.js')
const helpers = require('./helpers.js')
const ContextOverlay = require('./context-overlay.js')
const elHighlighter = require('./element-highlighter.js')

/** @typedef {import('./helpers.js').HtmlContent} HtmlContent */

const chevronRight = require('../icons/chevron-right')
const chevronLeft = require('../icons/chevron-left')
const close = require('../icons/close')

const WtOverlay = new ContextOverlay()
/** @type {WalkthroughPlayer | null} */
let activePlayer = null

/**
 * @typedef {Object} WalkthroughStep
 * @property {string} attachTo CSS selector for the element associated with this step.
 * @property {HtmlContent} msg Content to display for the step.
 */

/**
 * @typedef {Object} WalkthroughPlayerOptions
 * @property {WalkthroughStep[]} [steps]
 * @property {boolean} [showBackdrop]
 * @property {boolean} [showControls]
 * @property {((stepIndex: number | undefined) => void) | undefined} [onProgress]
 */

/** Controls the context overlay and navigation for a sequence of walkthrough steps. */
class WalkthroughPlayer {
  /** @param {WalkthroughPlayerOptions} options */
  constructor ({ steps = [], showBackdrop = false, showControls = true, onProgress }) {
    if (steps.length === 0) throw new RangeError('A walkthrough must have at least one step')
    this.steps = steps
    this.showBackdrop = showBackdrop
    this.showControls = showControls
    this.onProgress = onProgress
    /** @type {number | undefined} */
    this.currentStepIndex = undefined
    /** @type {ReturnType<typeof setTimeout> | null} */
    this.renderTimeout = null

    this.visible = false

    this.distanceFromElement = 5

    this.wrapper = document.createElement('div')
    this.wrapper.classList.add('nc-walkthrough-wrapper')

    this.content = document.createElement('div')
    this.content.classList.add('nc-walkthrough-content')

    this.wrapper.appendChild(this.content)

    this.wrapper.addEventListener('keyup', /** @param {KeyboardEvent} event */ (event) => {
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
        onClick: () => this.prev()
      })
      this.controls.appendChild(this.prevBtn)

      const stepsWrapper = document.createElement('div')
      this.stepsWrapper = stepsWrapper
      stepsWrapper.classList.add('nc-walkthrough-controls-steps')

      this.steps.forEach(() => {
        stepsWrapper.appendChild(helpers.toHtml('<span class="step"/>'))
      })
      this.controls.appendChild(stepsWrapper)

      this.nextBtn = button({
        classNames: ['nextBtn'],
        rightIcon: chevronRight,
        label: 'Next',
        onClick: () => this.next()
      })
      this.controls.appendChild(this.nextBtn)

      this.doneBtn = button({
        classNames: ['doneBtn'],
        label: 'Done!',
        onClick: () => this.end()
      })
      this.controls.appendChild(this.doneBtn)

      this.wrapper.appendChild(this.controls)
    }
  }

  /** Start or restart at the first step. @returns {void} */
  start () {
    if (activePlayer && activePlayer !== this) activePlayer.end()
    activePlayer = this
    this.currentStepIndex = 0
    this._render()
  }

  /** Advance to the next step, clamped to the final step. @returns {void} */
  next () {
    this.currentStepIndex = /** @type {number} */ (this.currentStepIndex) + 1
    this._render()
  }

  /** Return to the previous step, clamped to the first step. @returns {void} */
  prev () {
    this.currentStepIndex = /** @type {number} */ (this.currentStepIndex) - 1
    this._render()
  }

  /** @param {number} index Step index to display. @returns {void} */
  skipTo (index) {
    this.currentStepIndex = index
    this._render()
  }

  /** End the walkthrough and release its overlay/backdrop. @returns {void} */
  end () {
    if (this.renderTimeout !== null) {
      clearTimeout(this.renderTimeout)
      this.renderTimeout = null
    }
    this.visible = false
    if (activePlayer === this) {
      activePlayer = null
      WtOverlay.hide()
      if (this.showBackdrop) this._hideBackDrop()
    }
    this.currentStepIndex = undefined
    this.onProgress && this.onProgress(this.currentStepIndex)
  }

  /** Highlight the target for the current step. */
  _showBackDrop () {
    const step = /** @type {WalkthroughStep} */ (this.steps[/** @type {number} */ (this.currentStepIndex)])
    elHighlighter.show({
      element: document.querySelector(step.attachTo),
      padding: this.distanceFromElement - 2
    })
  }

  /** Remove the walkthrough target highlight. */
  _hideBackDrop () {
    elHighlighter.hide()
  }

  /** Render the current step and schedule its overlay content update. */
  _render () {
    this.currentStepIndex = Math.min(/** @type {number} */ (this.currentStepIndex), this.steps.length - 1)
    this.currentStepIndex = Math.max(/** @type {number} */ (this.currentStepIndex), 0)
    const currentStepIndex = /** @type {number} */ (this.currentStepIndex)

    const isDone = currentStepIndex === this.steps.length - 1

    this.wrapper.classList.toggle('done', isDone)

    if (this.showControls) {
      const prevBtn = /** @type {HTMLButtonElement} */ (this.prevBtn)
      if (this.currentStepIndex === 0) {
        prevBtn.style.visibility = 'hidden'
      }
      prevBtn.disabled = currentStepIndex <= 0
    }

    this.onProgress && this.onProgress(this.currentStepIndex)

    const step = /** @type {WalkthroughStep} */ (this.steps[currentStepIndex])

    WtOverlay.show({
      classNames: ['wt-container', this.visible ? 'zoom-out' : ''],
      offset: { y: -this.distanceFromElement, height: this.distanceFromElement * 2 },
      targetElement: document.querySelector(step.attachTo),
      showArrow: true
    })

    if (this.renderTimeout !== null) clearTimeout(this.renderTimeout)
    this.renderTimeout = setTimeout(() => {
      this.renderTimeout = null
      this.content.innerHTML = ''
      this.content.appendChild(helpers.toHtml(step.msg))
      if (this.showControls) {
        const prevBtn = /** @type {HTMLButtonElement} */ (this.prevBtn)
        prevBtn.style.visibility = currentStepIndex === 0 ? 'hidden' : 'visible'
      }

      WtOverlay.updateContent({
        msg: this.wrapper,
        classNames: ['wt-container', 'zoom-in', `wt-step-${currentStepIndex}`]
      })
      if (this.showControls) {
        if (isDone) {
          /** @type {HTMLButtonElement} */ (this.doneBtn).focus()
        } else {
          /** @type {HTMLButtonElement} */ (this.nextBtn).focus()
        }
      }
    }, 300)

    Array.from(this.stepsWrapper ? this.stepsWrapper.children : []).forEach((c, i) => {
      c.classList.toggle('current', i === this.currentStepIndex)
    })

    if (this.showBackdrop) this._showBackDrop()

    this.visible = true
  }
}

module.exports = WalkthroughPlayer
