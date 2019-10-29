const { toHtml } = require('./helpers.js')
const debounce = require('lodash.debounce')

class Overlay {
  constructor () {
    this.overlayEl = document.createElement('div')

    this.overlayInnerEl = document.createElement('div')
    this.overlayInnerEl.classList.add('nc-context-overlay-inner')

    this.overlayEl.appendChild(this.overlayInnerEl)

    this.overlayArrow = document.createElement('div')
    this.overlayArrow.classList.add('nc-context-overlay-arrow')
    this.overlayEl.appendChild(this.overlayArrow)

    this.options = null
    this.position = null
    this.isDisplayed = false

    this._debRender = debounce(this._render, 200).bind(this)
  }

  _render () {
    this.updatePosition()
    this.updateContent()
  }

  show (options) {
    if (!this.isDisplayed) {
      document.body.appendChild(this.overlayEl)
    }
    this.options = options

    this.updatePosition()
    if (options.msg) {
      this.updateContent()
    }

    if (!this.isDisplayed) {
      window.addEventListener('resize', this._debRender)
      window.addEventListener('scroll', this._debRender)
    }

    this.isDisplayed = true
  }

  hide () {
    this.isDisplayed = false
    document.body.removeChild(this.overlayEl)
    this.overlayInnerEl.innerHTML = ''
    this.overlayEl.style.cssText = ''
    this.overlayInnerEl.style.cssText = ''
    this.overlayEl.classList.remove('show')

    window.removeEventListener('resize', this._debRender)
    window.removeEventListener('scroll', this._debRender)
  }

  getPosition () { return this.position }

  updatePosition (options) {
    Object.assign(this.options, options)
    this.overlayEl.classList.toggle('showArrow', this.options.showArrow)
    this.overlayEl.className = ['nc-context-overlay', 'show', ...this.options.classNames || []].join(' ')

    const { ttLeft, ttTop } = this._getTargetPosition(this.options)
    this.overlayEl.style.cssText = `left:${ttLeft}px; top:${ttTop}px;`
  }

  updateContent (options) {
    Object.assign(this.options, options)

    this.overlayEl.classList.toggle('showArrow', this.options.showArrow)
    this.overlayEl.className = ['nc-context-overlay', 'show', ...this.options.classNames || []].join(' ')

    const { ttLeft, ttTop, target, verticalAlign } = this._getTargetPosition(this.options)

    const oldWidth = this.overlayInnerEl.style.width
    this.overlayInnerEl.style.width = 'auto'

    const msgHtmlNode = this.options.msg && toHtml(this.options.msg)

    if (msgHtmlNode) {
      this.overlayInnerEl.innerHTML = ''
      this.overlayInnerEl.appendChild(msgHtmlNode)
    }

    // calculating the actual overlay width
    const ttWidth = msgHtmlNode ? msgHtmlNode.offsetWidth : 200
    const ttHeight = msgHtmlNode ? msgHtmlNode.offsetHeight : 100

    this.overlayInnerEl.style.width = oldWidth

    const justToForceRedraw = this.overlayInnerEl.offsetWidth // eslint-disable-line no-unused-vars

    // positioning the overlay content
    // making sure that it doesn't go over the element right edge
    const alignRight = ttLeft + ttWidth - (target.x + target.width)
    let deltaX = Math.max(alignRight, ttWidth / 2)

    // then checking it doesn't overflow the element left edge
    deltaX = (ttLeft - deltaX < target.x) ? ttLeft - target.x : deltaX

    const {
      outerRect = document.body.getBoundingClientRect()
    } = this.options

    // then checking the outer element right edge
    if (outerRect) {
      deltaX = (ttLeft - deltaX + ttWidth > outerRect.right) ? alignRight : deltaX
    }

    // in the edge case where the content overflows the vieport to the left
    if (deltaX > ttLeft) {
      deltaX = ttLeft
    }

    const maxWidth = outerRect ? outerRect.width + 'px' : 'auto'
    let top = verticalAlign === 'top' ? -ttHeight : 0

    if (verticalAlign === 'center') {
      top = -ttHeight / 2
    }

    // if the content overflows the paget top then we push the content downwards
    if (ttTop + top < 0) {
      // the arrow points to a no longer valid position, let's hide it
      this.overlayEl.classList.remove('arrowBottom', 'arrowTop')
      top = 5 - ttTop
    }

    this.overlayInnerEl.style.cssText = `left:-${deltaX}px; max-width:${maxWidth}; top:${top}px; height:${ttHeight}px; width:${ttWidth}px`
  }

  _getTargetPosition (options) {
    let {
      targetElement,
      targetRect,
      offset,
      pointerCoords,
      verticalAlign = 'bottom'
    } = this.options

    let target = targetRect || (targetElement && targetElement.getBoundingClientRect())

    // if there's no target then center align the content
    if (!target) {
      verticalAlign = 'center'
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

    if (verticalAlign !== 'center' && y + height > window.innerHeight / 2) {
      verticalAlign = 'top'
    }

    const arrowHeight = verticalAlign !== 'center' && this.options.showArrow ? 10 : 0

    if (offset) {
      x += offset.x || 0
      y += offset.y || 0
      width += offset.width || 0
      height += offset.height || 0
    }

    let ttLeft = x + width / 2

    // if the element is in the lower half of the screen than align the overlay to the top side
    const ttTop = y + (verticalAlign === 'bottom' ? height + arrowHeight : -arrowHeight)

    this.overlayEl.classList.toggle('arrowTop', verticalAlign === 'bottom')
    this.overlayEl.classList.toggle('arrowBottom', verticalAlign === 'top')

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
