const swipe = new VueSwipe().initDirective()
const fullOffset = 480 - 64
const triggerLen = 48
Vue.component('demo', {
  template: `
  <main class="page-main" @touchmove="preventMainSwipe">
    <div class="bottom-drawer" ref="drawer" :style="drawerStyle">
      <div class="bottom-drawer__trigger" v-swipe="{ onSwiping, onSwiped }"></div>
    </div>
  </main>
  `,
  data() {
    return {
      expand: false,
      swiping: false,
      offset: fullOffset,
    }
  },
  directives: {
    swipe,
  },
  computed: {
    drawerStyle() {
      return {
        transform: `translate3d(0, ${this.offset}px, 0)`,
        transitionDuration: this.swiping ? '0s' : `.3s`
      }
    },
  },
  methods: {
    preventMainSwipe(event) {
      event.preventDefault()
    },
    open() {
      this.offset = 0
      if (!this.expand) {
        this.expand = true;
      }
    },
    close() {
      this.offset = fullOffset;
      if (this.expand) {
        this.expand = false;
      }
    },
    onSwiping(orientation, delta) {
      if (orientation === 'vertical') {
        this.swiping = true
        this.offset = range(
          this.expand ? delta : fullOffset + delta,
          0,
          fullOffset
        )
      }
    },
    onSwiped(orientation, delta, offset) {
      if (this.swiping) {
        this.swiping = false
        if (this.expand) {
          if (this.offset > 0 && offset > triggerLen) {
            this.close()
          } else {
            this.open()
          }
        } else {
          if (this.offset < fullOffset && offset > triggerLen) {
            this.open()
          } else {
            this.close()
          }
        }      
      }
    },
  },
})

function range(num, min, max) {
  return Math.min(Math.max(num, min), max)
}
