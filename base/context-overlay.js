const { toHtml } = require('./helpers.js')
const debounce = require('lodash.debounce')

class Overlay {
  constructor () {
    this.overlayEl = document.createElement('div')
    this.overlayEl.classList.add('nc-context-overlay')

    this.overlayInnerEl = document.createElement('div')
    this.overlayInnerEl.classList.add('nc-context-overlay-inner')

    this.overlayEl.appendChild(this.overlayInnerEl)

    this.overlayArrow = document.createElement('div')
    this.overlayArrow.classList.add('nc-context-overlay-arrow')
    this.overlayEl.appendChild(this.overlayArrow)

    this.overlayArrow.addEventListener('animationend', () => {
      this.overlayArrow.classList.remove('fade-in')
    })

    this.options = null
    this.position = null

    this._debRender = debounce(this._render, 200).bind(this)
  }

  show (options) {
    document.body.appendChild(this.overlayEl)

    this.options = options
    this.overlayEl.classList.add('show', ...options.classNames || [])
    this._render()

    window.addEventListener('resize', this._debRender)
    window.addEventListener('scroll', this._debRender)
  }

  hide () {
    document.body.removeChild(this.overlayEl)
    this.overlayInnerEl.innerHTML = ''
    this.overlayEl.style.cssText = ''
    this.overlayInnerEl.style.cssText = ''
    this.overlayEl.classList.remove('show')

    window.removeEventListener('resize', this._debRender)
    window.removeEventListener('scroll', this._debRender)
  }

  getPosition () { return this.position }

  _render () {
    if (!this.overlayEl.classList.contains('show')) return

    this.overlayEl.classList.toggle('showArrow', this.options.showArrow)

    let {
      msg,
      targetElement,
      targetRect,
      outerRect = document.body.getBoundingClientRect(),
      offset,
      pointerCoords,
      verticalAlign = 'bottom'
    } = this.options

    let target = targetRect || (targetElement && targetElement.getBoundingClientRect())
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

    let msgHtmlNode = toHtml(msg)

    const arrowHeight = verticalAlign !== 'center' && this.options.showArrow ? 10 : 0

    if (offset) {
      x += offset.x || 0
      y += offset.y || 0
      width += offset.width || 0
      height += offset.height || 0
    }

    let ttLeft = x + width / 2

    // if the element is in the lower half of the screen than align the overlay to the top side
    let ttTop = y + (verticalAlign === 'bottom' ? height + arrowHeight : -arrowHeight)

    this.overlayArrow.classList.add('fade-in')

    this.overlayEl.classList.toggle('arrowTop', verticalAlign === 'bottom')
    this.overlayEl.classList.toggle('arrowBottom', verticalAlign === 'top')

    if (pointerCoords) {
      // centering on the mouse pointer horizontally
      ttLeft = x + pointerCoords.x
    }

    const oldWidth = this.overlayInnerEl.style.width
    this.overlayInnerEl.style.width = 'auto'

    this.overlayInnerEl.innerHTML = ''
    this.overlayInnerEl.appendChild(msgHtmlNode)

    this.overlayEl.style.cssText = `left:${ttLeft}px; top:${ttTop}px;`
    // calculating the actual overlay width
    const ttWidth = msgHtmlNode.offsetWidth
    const ttHeight = msgHtmlNode.offsetHeight

    this.overlayInnerEl.style.width = oldWidth

    const justToForceRedraw = this.overlayInnerEl.offsetWidth // eslint-disable-line no-unused-vars

    // positioning the overlay content
    // making sure that it doesn't go over the element right edge
    const alignRight = ttLeft + ttWidth - (x + width)
    let deltaX = Math.max(alignRight, ttWidth / 2)

    // then checking it doesn't overflow the element left edge
    deltaX = (ttLeft - deltaX < x) ? ttLeft - x : deltaX

    // then checking the outer element right edge
    if (outerRect) {
      deltaX = (ttLeft - deltaX + ttWidth > outerRect.right) ? alignRight : deltaX
    }

    const maxWidth = outerRect ? outerRect.width + 'px' : 'auto'
    const top = verticalAlign === 'top' ? -ttHeight : 0
    this.overlayInnerEl.style.cssText = `left:-${deltaX}px; max-width:${maxWidth}; top:${top}px; height:${ttHeight}px; width:${ttWidth}px`

    // making a note of the position
    this.position = {
      left: ttLeft - deltaX,
      top: ttTop - top,
      height: ttHeight,
      width: ttWidth
    }
  }
}

module.exports = Overlay
