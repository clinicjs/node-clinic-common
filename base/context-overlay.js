const { toHtml } = require('./helpers.js')
const debounce = require('./debounce.js')

/** @typedef {import('./helpers.js').HtmlContent} HtmlContent */

const VERTICAL_ALIGNMENT = /** @type {const} */ ({
  TOP: 'top',
  BOTTOM: 'bottom',
  CENTER: 'center'
})

/** @typedef {typeof VERTICAL_ALIGNMENT[keyof typeof VERTICAL_ALIGNMENT]} VerticalAlignment */
/** @typedef {{ left: number, top: number, width: number, height: number }} OverlayRect */
/** @typedef {{ x?: number, y?: number, width?: number, height?: number }} OverlayOffset */
/**
 * @typedef {Object} ContextOverlayOptions
 * @property {Element | null} [targetElement]
 * @property {OverlayRect} [targetRect]
 * @property {OverlayOffset} [offset]
 * @property {{ x: number }} [pointerCoords]
 * @property {VerticalAlignment} [verticalAlign]
 * @property {boolean} [showArrow]
 * @property {string[]} [classNames]
 * @property {HtmlContent | null} [msg]
 * @property {{ left?: number, right: number, width: number } | null} [outerRect]
 */
/** @typedef {Omit<Partial<ContextOverlayOptions>, 'msg'> & { msg?: HtmlContent | null | undefined }} ContextOverlayUpdateOptions */
/** @typedef {{ ttLeft: number, ttTop: number, verticalAlign: VerticalAlignment, target: { x: number, y: number, width: number, height: number } }} OverlayPosition */

/**
 * A positioned overlay that can follow a target element or rectangle.
 */
class Overlay {
  /** Create the overlay DOM nodes. */
  constructor () {
    /** @type {HTMLElement} */
    this.overlayEl = document.createElement('div')

    /** @type {HTMLElement} */
    this.overlayInnerEl = document.createElement('div')
    this.overlayInnerEl.classList.add('nc-context-overlay-inner')

    this.overlayEl.appendChild(this.overlayInnerEl)

    /** @type {HTMLElement} */
    this.overlayArrow = document.createElement('div')
    this.overlayArrow.classList.add('nc-context-overlay-arrow')
    this.overlayEl.appendChild(this.overlayArrow)

    /** @type {ContextOverlayOptions | null} */
    this.options = null
    /** @type {OverlayPosition | null} */
    this.position = null
    /** @type {boolean} */
    this.isDisplayed = false

    this._debRender = debounce(this._render, 200).bind(this)
  }

  /** Recalculate position and content after a viewport change. */
  _render () {
    this.updatePosition()
    this.updateContent()
  }

  /**
   * @param {ContextOverlayOptions} options
   * @returns {void}
   */
  show (options) {
    if (!this.isDisplayed) {
      document.body.appendChild(this.overlayEl)
    }
    this.options = options

    this.updatePosition()
    this.updateContent()

    if (!this.isDisplayed) {
      window.addEventListener('resize', this._debRender)
      window.addEventListener('scroll', this._debRender)
    }

    this.isDisplayed = true
  }

  /**
   * Hide and detach the overlay.
   * @returns {void}
   */
  hide () {
    this.isDisplayed = false
    this.position = null
    if (this.overlayEl.parentNode) this.overlayEl.parentNode.removeChild(this.overlayEl)
    this.overlayInnerEl.innerHTML = ''
    this.overlayEl.style.cssText = ''
    this.overlayInnerEl.style.cssText = ''
    this.overlayEl.classList.remove('show')

    window.removeEventListener('resize', this._debRender)
    window.removeEventListener('scroll', this._debRender)
  }

  /** @returns {OverlayPosition | null} */
  getPosition () { return this.position }

  /**
   * @param {ContextOverlayUpdateOptions} [options]
   * @returns {OverlayPosition}
   */
  updatePosition (options) {
    const currentOptions = /** @type {ContextOverlayOptions} */ (this.options)
    Object.assign(currentOptions, options)
    this.overlayEl.classList.toggle('showArrow', currentOptions.showArrow)
    this.overlayEl.className = ['nc-context-overlay', 'show', ...currentOptions.classNames || []].join(' ')

    const position = this._getTargetPosition(currentOptions)
    this.position = position
    const { ttLeft, ttTop } = position
    this.overlayEl.style.cssText = `left:${ttLeft}px; top:${ttTop}px;`
    return position
  }

  /**
   * @param {ContextOverlayUpdateOptions} [options]
   * @returns {void}
   */
  updateContent (options) {
    const { ttLeft, ttTop, target, verticalAlign } = this.updatePosition(options)

    const oldWidth = this.overlayInnerEl.style.width
    this.overlayInnerEl.style.width = 'auto'

    const currentOptions = /** @type {ContextOverlayOptions} */ (this.options)
    const msgHtmlNode = currentOptions.msg && toHtml(currentOptions.msg)

    this.overlayInnerEl.innerHTML = ''
    if (msgHtmlNode) {
      this.overlayInnerEl.appendChild(msgHtmlNode)
    }

    // calculating the actual overlay width
    const ttWidth = msgHtmlNode ? msgHtmlNode.offsetWidth : 200
    const ttHeight = msgHtmlNode ? msgHtmlNode.offsetHeight : 100

    this.overlayInnerEl.style.width = oldWidth

    void this.overlayInnerEl.offsetWidth // eslint-disable-line no-void -- force a layout read before measuring

    // positioning the overlay content
    // making sure that it doesn't go over the element right edge
    const alignRight = ttLeft + ttWidth - (target.x + target.width)
    let deltaX = Math.max(alignRight, ttWidth / 2)

    // then checking it doesn't overflow the element left edge
    deltaX = (ttLeft - deltaX < target.x) ? ttLeft - target.x : deltaX

    const {
      outerRect = document.body.getBoundingClientRect()
    } = currentOptions

    // then checking the outer element right edge
    if (outerRect) {
      deltaX = (ttLeft - deltaX + ttWidth > outerRect.right) ? alignRight : deltaX
    }

    // in the edge case where the content overflows the vieport to the left
    if (deltaX > ttLeft) {
      deltaX = ttLeft
    }

    const maxWidth = outerRect ? outerRect.width + 'px' : 'none'
    let top = verticalAlign === VERTICAL_ALIGNMENT.TOP ? -ttHeight : 0

    if (verticalAlign === VERTICAL_ALIGNMENT.CENTER) {
      top = -ttHeight / 2
    }

    // if the content overflows the paget top then we push the content downwards
    if (ttTop + top < 0) {
      // the arrow points to a no longer valid position, let's hide it
      this.overlayEl.classList.remove('arrowBottom', 'arrowTop')
      top = 5 - ttTop
    }

    this.overlayInnerEl.style.cssText = `left:${-deltaX}px; max-width:${maxWidth}; top:${top}px; height:${ttHeight}px; width:${ttWidth}px`
  }

  /** @param {ContextOverlayOptions} options @returns {OverlayPosition} */
  _getTargetPosition (options) {
    let {
      targetElement,
      targetRect,
      offset,
      pointerCoords,
      verticalAlign = VERTICAL_ALIGNMENT.BOTTOM
    } = options

    let target = targetRect || (targetElement && targetElement.getBoundingClientRect())

    // if there's no target then center align the content
    if (!target) {
      verticalAlign = VERTICAL_ALIGNMENT.CENTER
      target = {
        left: 0,
        top: document.documentElement.clientHeight / 2,
        width: document.documentElement.clientWidth,
        height: 0
      }
    }

    let {
      left: x,
      top: y,
      width,
      height
    } = target

    if (verticalAlign !== VERTICAL_ALIGNMENT.CENTER && y + height > window.innerHeight / 2) {
      verticalAlign = VERTICAL_ALIGNMENT.TOP
    }

    const arrowHeight = verticalAlign !== VERTICAL_ALIGNMENT.CENTER && options.showArrow ? 10 : 0

    if (offset) {
      x += offset.x || 0
      y += offset.y || 0
      width += offset.width || 0
      height += offset.height || 0
    }

    let ttLeft = x + width / 2

    // if the element is in the lower half of the screen than align the overlay to the top side
    const ttTop = y + (verticalAlign === VERTICAL_ALIGNMENT.BOTTOM ? height + arrowHeight : -arrowHeight)

    this.overlayEl.classList.toggle('arrowTop', verticalAlign === VERTICAL_ALIGNMENT.BOTTOM)
    this.overlayEl.classList.toggle('arrowBottom', verticalAlign === VERTICAL_ALIGNMENT.TOP)

    if (pointerCoords) {
      // centering on the mouse pointer horizontally
      ttLeft = x + pointerCoords.x
    }

    return {
      ttLeft,
      ttTop,
      verticalAlign,
      target: {
        x,
        y,
        width,
        height
      }
    }
  }
}

module.exports = Overlay
