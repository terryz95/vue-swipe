const swipe = new VueSwipe().initDirective()
const maxHeight = 480
const minHeight = 64
const triggerLen = 48
Vue.component('demo', {
  template: `
  <main class="page-main" @touchmove="preventMainSwipe">
    <div class="bottom-drawer" ref="drawer" :class="drawerCls" :style="drawerStyle">
      <div class="bottom-drawer__trigger" v-swipe="{ onStart, onSwiping, onSwiped }"></div>
    </div>
  </main>
  `,
  data() {
    return {
      expand: false,
      swiping: false,
      drawerHeight: 64,
    }
  },
  directives: {
    swipe,
  },
  computed: {
    drawerCls() {
      return {
        swiping: this.swiping,
      }
    },
    drawerStyle() {
      return {
        height: `${this.drawerHeight}px`,
      }
    },
  },
  mounted() {
    this.drawerHeight = this.$refs.drawer.clientHeight
  },
  methods: {
    preventMainSwipe(event) {
      event.preventDefault()
    },
    onStart(swiping) {
      this.swiping = swiping
    },
    onSwiping(delta, offset) {
      if (this.expand) {
        // 滑动前的状态是展开
        if (delta < 0) {
          // 如果最后结果是向上滑动，则为最大高度
          this.drawerHeight = maxHeight
        } else if (offset > maxHeight - minHeight){
          // 如果最后结果是向下滑动且偏移量大于可滑动范围，则为最小高度
          this.drawerHeight = minHeight
        } else {
          // 在可滑动范围内滑动
          this.drawerHeight = maxHeight - offset
        }
      } else {
        // 滑动前的状态是收起
        if (delta > 0) {
          // 如果最后结果是向下滑动，则为最小高度
          this.drawerHeight = minHeight
        } else if (offset > maxHeight - minHeight){
          // 如果最后结果是向上滑动且偏移量大于可滑动范围，则为最大高度
          this.drawerHeight = maxHeight
        } else {
          // 在可滑动范围内滑动
          this.drawerHeight = minHeight + offset
        }
      }
    },
    onSwiped(delta, offset, swiping) {
      this.swiping = swiping
      if (this.expand) {
        // 展开 -> 收起
        if (delta < 0) return // 屏蔽展开状态时的向上滑动
        if (offset > triggerLen) {
          // 滑动达到触发长度，则收起
          this.drawerHeight = minHeight
          this.expand = false
        } else {
          // 滑动未达到触发长度，则复原
          this.drawerHeight = maxHeight
        }
      } else {
        // 收起 -> 展开
        if (delta > 0) return // 屏蔽收起状态时的向下滑动
        if (offset > triggerLen) {
          // 滑动达到触发长度，则展开
          this.drawerHeight = maxHeight
          this.expand = true
        } else {
          // 滑动未达到触发长度，则复原
          this.drawerHeight = minHeight
        }
      }
    },
  },
})
