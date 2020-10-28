Vue.component('demo', {
  template: `
  <main class="page-main">
    <div class="bottom-drawer" ref="drawer" :class="drawerCls" :style="drawerStyle">
      <div class="bottom-drawer__trigger" v-swipe="{ onStart, onSwipingNegative, onSwipingPositive, onSwipedNegative, onSwipedPositive }"></div>
    </div>
  </main>
  `,
  data() {
    return {
      expand: false,
      swiping: false,
      maxHeight: 480,
      minHeight: 64,
      drawerHeight: 64,
    }
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
    onStart(swiping) {
      this.swiping = swiping
    },
    onSwipingNegative(offset) {
      if (!this.expand && this.drawerHeight < this.maxHeight) {
        this.drawerHeight = this.minHeight - offset
      }
    },
    onSwipingPositive(offset) {
      if (this.expand && this.drawerHeight > this.minHeight) {
        this.drawerHeight = this.maxHeight - offset
      }
    },
    onSwipedNegative(offset, swiping) {
      if (!this.expand) {
        if (Math.abs(offset) > 24) {
          this.drawerHeight = this.maxHeight
          this.expand = true
        } else {
          this.drawerHeight = this.minHeight
        }
      }
      this.swiping = swiping
    },
    onSwipedPositive(offset, swiping) {
      if (this.expand) {
        if (Math.abs(offset) > 24) {
          this.drawerHeight = this.minHeight
          this.expand = false
        } else {
          this.drawerHeight = this.maxHeight
        }
      }
      this.swiping = swiping
    },
  },
})
