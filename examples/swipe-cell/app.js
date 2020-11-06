const swipe = new VueSwipe().initDirective()
const triggerPercentage = 0.15
Vue.component('demo', {
  template: `
  <main class="page-main">
    <div class="swipe-cell">
      <div class="swipe-cell__wrapper" :style="cellStyle">
        <div ref="left" class="swipe-cell__left">
          <div>选择</div>
        </div>
        <div class="swipe-cell__main" v-swipe="{onSwiping, onSwiped}">内容</div>
        <div ref="right" class="swipe-cell__right">
          <div>删除</div>
        </div>
      </div>
    </div>
  </main>
  `,
  data() {
    return {
      opened: false,
      swiping: false,
      offset: 0,
      swipedOffset: 0,
    }
  },
  directives: {
    swipe,
  },
  computed: {
    cellStyle() {
      return {
        transform: `translate3d(${this.offset}px, 0, 0)`,
        transitionDuration: this.swiping ? '0s' : '.6s',
      }
    },
    computedLeftWidth() {
      return this.getWidthByRef('left')
    },
    computedRightWidth() {
      return this.getWidthByRef('right')
    },
  },
  methods: {
    getWidthByRef(ref) {
      if (this.$refs[ref]) {
        const rect = this.$refs[ref].getBoundingClientRect()
        return rect.width
      }
      return 0
    },
    open(position) {
      const offset =
        position === 'left' ? this.computedLeftWidth : -this.computedRightWidth;
      this.opened = true;
      this.offset = offset;
    },
    close() {
      this.offset = 0;
      if (this.opened) {
        this.opened = false;
      }
    },
    toggle(direction) {
      const offset = Math.abs(this.offset);
      const { computedLeftWidth, computedRightWidth } = this;
      const threshold = this.opened ? 1 - triggerPercentage : triggerPercentage;
      if (
        computedRightWidth &&
        direction === 'right' &&
        offset > computedRightWidth * threshold
      ) {
        this.open('right');
      } else if (
        computedLeftWidth &&
        direction === 'left' &&
        offset > computedLeftWidth * threshold
      ) {
        this.open('left');
      } else {
        this.close();
      }
    },
    onSwiping(orientation, delta) {
      if (orientation === 'horizontal') {
        this.swiping = true
        this.offset = range(
          this.swipedOffset + delta,
          -this.computedRightWidth,
          this.computedLeftWidth
        )
      }
    },
    onSwiped() {
      if (this.swiping) {
        this.toggle(this.offset > 0 ? 'left' : 'right');
        this.swiping = false;
        this.swipedOffset = this.offset
      }
    },
  },
})

function range(num, min, max) {
  return Math.min(Math.max(num, min), max)
}
