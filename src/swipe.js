import { throttle } from 'lodash-es'
import { vw2px, isEmpty, isMultiTouch } from './helpers'

export default {
  inserted(el, binding) {
    const { value = {}, arg = 0, modifiers } = binding
    let {
      onStart, // 手指触及时
      onSwipingNegative, // 手指向上或向左滑动中
      onSwipingPositive, // 手指向下或向右滑动中
      onSwipedNegative, // 手指向上或向左滑动结束
      onSwipedPositive, // 手指向下或向右滑动结束
    } = value

    if (onSwipingNegative) {
      onSwipingNegative = throttle(onSwipingNegative, 500)
    }
    if (onSwipingPositive) {
      onSwipingPositive = throttle(onSwipingPositive, 500)
    }

    let startPosX = null,
      startPosY = null,
      offset = 0,
      threshold = 0,
      _modifiers = isEmpty(modifiers) ? { v: true } : modifiers

    // format => number(px)
    if (typeof Number(arg) === 'number') {
      threshold = Number(arg)
    } else {
      threshold = vw2px(arg)
    }

    function swipeStart(event) {
      if (isMultiTouch(event.targetTouches)) return
      startPosX = event.targetTouches[0].clientX
      startPosY = event.targetTouches[0].clientY
      onStart && onStart(event)
    }
    function swipeMove(event) {
      if (isMultiTouch(event.targetTouches)) return
      const _x = event.targetTouches[0].clientX
      const _y = event.targetTouches[0].clientY
      if (_modifiers.v) {
        // 竖直滑动过程中
        offset = _y - startPosY
      } else if (_modifiers.h) {
        // 水平滑动过程中
        offset = _x - startPosX
      }
      // 如果滑动距离超过阈值
      if (Math.abs(offset) >= threshold) {
        offset < 0 && onSwipingNegative && onSwipingNegative(offset, event)
        offset > 0 && onSwipingPositive && onSwipingPositive(offset, event)
      }
    }
    function swipeEnd(event) {
      // 如果滑动距离超过阈值
      if (Math.abs(offset) >= threshold) {
        offset < 0 && onSwipedNegative && onSwipedNegative(offset, event)
        offset > 0 && onSwipedPositive && onSwipedPositive(offset, event)
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
