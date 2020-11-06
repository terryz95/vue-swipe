let installed = false
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
  constructor(options = {threshold: 0}) {
    this._startX = 0
    this._startY = 0
    this._threshold = options.threshold
    this.orientation = '' // horizontal / vertcal 水平竖直
    this.offsetX = 0
    this.offsetY = 0
    this.deltaX = 0
    this.deltaY = 0
    this._cbs = {}

    this.initDirective = this.initDirective.bind(this)
    this._swipeStart = this._swipeStart.bind(this)
    this._swipeMove = this._swipeMove.bind(this)
    this._swipeEnd = this._swipeEnd.bind(this)
  }
  _reset() {
    this.orientation = ''
    this.deltaX = 0
    this.deltaY = 0
    this.offsetX = 0
    this.offsetY = 0
  }
  _swipeStart(event) {
    this._reset()
    this._startX = event.touches[0].clientX
    this._startY = event.touches[0].clientY
    this._cbs.onStart && this._cbs.onStart()
  }
  _swipeMove(event) {
    event.preventDefault()
    const touch = event.touches[0]
    this.deltaX = touch.clientX - this._startX
    this.deltaY = touch.clientY - this._startY
    this.offsetX = Math.abs(this.deltaX)
    this.offsetY = Math.abs(this.deltaY)
    if (!this.orientation) {
      this.orientation = getOrientation(
        this.offsetX,
        this.offsetY,
        this._threshold
      )
    }
    if (this._cbs.onSwiping) {
      if (this.orientation === 'horizontal') {
        this._cbs.onSwiping(this.orientation, this.deltaX, this.offsetX, event)
      } else if (this.orientation === 'vertical') {
        this._cbs.onSwiping(this.orientation, this.deltaY, this.offsetY, event)
      }
    }
  }
  _swipeEnd(event) {
    if (this._cbs.onSwiped) {
      if (this.orientation === 'horizontal') {
        this._cbs.onSwiped(this.orientation, this.deltaX, this.offsetX, event)
      } else if (this.orientation === 'vertical') {
        this._cbs.onSwiped(this.orientation, this.deltaY, this.offsetY, event)
      }
    }
    this._reset()
  }
  initDirective() {
    let that = this
    return {
      inserted(el, binding) {
        const { value = {} } = binding
        that._cbs = value
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

export const VueSwipeInstaller = (threshold = 0) => (Vue) => {
  if (installed) return
  installed = true
  try {
    Vue.directive('swipe', new VueSwipe(threshold).initDirective())
  } catch(e) {}
}
