const swipe = new VueSwipe().initDirective()
const maxHeight = 480
const minHeight = 64
const triggerLen = 24
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
      let distance = 0
      console.log(delta < 0 ? '往上划' : '往下划')
      let distance1 = delta < 0 ? minHeight + offset : minHeight
      let distance2 = delta > 0 ? maxHeight - offset : maxHeight
      // if (delta < 0) {
      //   distance = minHeight 
      //   console.log(distance)
      //   if (distance > maxHeight) {
      //     console.log('1111')
      //     this.drawerHeight = maxHeight
      //   } else {
      //     console.log('2222')
      //     this.drawerHeight = distance
      //   }
      // } else {
      //   distance = maxHeight - delta
      //   console.log(distance)
      //   if (distance < minHeight) {
      //     console.log('3333')
      //     this.drawerHeight = minHeight
      //   } else {
      //     console.log('4444')
      //     this.drawerHeight = distance
      //   }
      // }
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
