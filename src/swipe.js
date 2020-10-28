import { pxTransfer, isEmpty, isMultiTouch } from './helpers'

export default {
  inserted(el, binding) {
    const { value = {}, modifiers } = binding
    let {
      threshold = { negative: 0, positive: 0 },
      onStart, // 手指触及时
      onSwipingNegative, // 手指向上或向左滑动中
      onSwipingPositive, // 手指向下或向右滑动中
      onSwipedNegative, // 手指向上或向左滑动结束
      onSwipedPositive, // 手指向下或向右滑动结束
    } = value

    let startPosX = null,
      startPosY = null,
      offset = 0,
      thresholdN = threshold.negative ? pxTransfer(threshold.negative) : 0,
      thresholdP = threshold.positive ? pxTransfer(threshold.positive) : 0,
      _modifiers = isEmpty(modifiers) ? { v: true } : modifiers

    function swipeStart(event) {
      if (isMultiTouch(event.targetTouches)) return
      startPosX = event.targetTouches[0].screenX
      startPosY = event.targetTouches[0].screenY
      onStart && onStart(true, event)
    }
    function swipeMove(event) {
      if (isMultiTouch(event.targetTouches)) return
      const _x = event.targetTouches[0].screenX
      const _y = event.targetTouches[0].screenY
      if (_modifiers.v) {
        // 竖直滑动过程中
        offset = _y - startPosY
      } else if (_modifiers.h) {
        // 水平滑动过程中
        offset = _x - startPosX
      }
      // 如果滑动距离超过阈值
      if (offset < 0 && Math.abs(offset) >= thresholdN && onSwipingNegative) {
        onSwipingNegative(offset, true, event)
      }
      if (offset > 0 && Math.abs(offset) >= thresholdP && onSwipingPositive) {
        onSwipingPositive(offset, true, event)
      }
    }
    function swipeEnd(event) {
      // 如果滑动距离超过阈值
      if (offset < 0 && Math.abs(offset) >= thresholdN && onSwipedNegative) {
        onSwipedNegative(offset, false, event)
      }
      if (offset > 0 && Math.abs(offset) >= thresholdP && onSwipedPositive) {
        onSwipedPositive(offset, false, event)
      }
      startPosX = null
      startPosY = null
      offset = 0
    }
    el.touchstart = swipeStart
    el.touchmove = swipeMove
    el.touchend = swipeEnd
    el.addEventListener('touchstart', swipeStart)
    el.addEventListener('touchmove', swipeMove)
    el.addEventListener('touchend', swipeEnd)
  },
  unbind(el) {
    ;['touchstart', 'touchmove', 'touchend'].forEach((directive) => {
      el.removeEventListener(directive, el[directive])
      delete el[directive]
    })
  },
}
