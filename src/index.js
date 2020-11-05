function getOrientation(x, y, threshold) {
  if (x > y && x > threshold) {
    return 'horizontal'
  }

  if (y > x && y > threshold) {
    return 'vertical'
  }

  return ''
}
export default class VueSwipe {
  constructor(threshold = 0) {
    this._orientation = '' // horizontal / vertcal 水平竖直
    this.offsetX = 0
    this.offsetY = 0
    this._startX = 0
    this._startY = 0
    this._threshold = threshold
    this.deltaX = 0
    this.deltaY = 0
    this.cbs = {}
    this.swiping = false

    this.initDirective = this.initDirective.bind(this)
    this._swipeStart = this._swipeStart.bind(this)
    this._swipeMove = this._swipeMove.bind(this)
    this._swipeEnd = this._swipeEnd.bind(this)
  }
  _reset() {
    this._orientation = ''
    this.deltaX = 0
    this.deltaY = 0
    this.offsetX = 0
    this.offsetY = 0
  }
  _swipeStart(event) {
    this._reset()
    this.swiping = true
    this._startX = event.touches[0].clientX
    this._startY = event.touches[0].clientY
    this.cbs.onStart && this.cbs.onStart(this.swiping)
  }
  _swipeMove(event) {
    event.preventDefault()
    const touch = event.touches[0]
    this.deltaX = touch.clientX - this._startX
    this.deltaY = touch.clientY - this._startY
    this.offsetX = Math.abs(this.deltaX)
    this.offsetY = Math.abs(this.deltaY)
    if (!this._orientation) {
      this._orientation = getOrientation(
        this.offsetX,
        this.offsetY,
        this._threshold
      )
    }
    if (this.cbs.onSwiping) {
      if (this._orientation === 'horizontal') {
        this.cbs.onSwiping(this.deltaX, this.offsetX, this.swiping, event)
      } else if (this._orientation === 'vertical') {
        this.cbs.onSwiping(this.deltaY, this.offsetY, this.swiping, event)
      }
    }
  }
  _swipeEnd(event) {
    this.swiping = false
    if (this.cbs.onSwiped) {
      if (this._orientation === 'horizontal') {
        this.cbs.onSwiped(this.deltaX, this.offsetX, this.swiping, event)
      } else if (this._orientation === 'vertical') {
        this.cbs.onSwiped(this.deltaY, this.offsetY, this.swiping, event)
      }
    }
    this._reset()
  }
  initDirective() {
    let that = this
    return {
      inserted(el, binding) {
        const { value = {} } = binding
        that.cbs = value
        el.addEventListener('touchstart', that._swipeStart)
        el.addEventListener('touchmove', that._swipeMove)
        el.addEventListener('touchend', that._swipeEnd)
      },
      unbind(el) {
        el.removeEventListener('touchstart', that._swipeStart)
        el.removeEventListener('touchmove', that._swipeMove)
        el.removeEventListener('touchend', that._swipeEnd)
      },
    }
  }
}
