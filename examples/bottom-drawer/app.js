Vue.component('demo', {
  template: `
  <main class="page-main">
    <div class="bottom-drawer" ref="drawer" :style="drawerStyle">
      <div class="bottom-drawer__trigger" v-swipe="{ onSwipingNegative, onSwipingPositive, onSwipedNegative, onSwipedPositive }"></div>
    </div>
  </main>
  `,
  data() {
    return {
      expand: false,
      maxHeight: 480,
      minHeight: 64,
      drawerHeight: 64,
    }
  },
  computed: {
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
    onSwipedNegative(offset) {
      if (!this.expand) {
        if (Math.abs(offset) > 24) {
          this.drawerHeight = this.maxHeight
          this.expand = true
        } else {
          this.drawerHeight = this.minHeight
        }
      }
      console.log(this.expand)
    },
    onSwipedPositive(offset) {
      if (this.expand) {
        if (Math.abs(offset) > 24) {
          this.drawerHeight = this.minHeight
          this.expand = false
        } else {
          this.drawerHeight = this.maxHeight
        }
      }
      console.log(this.expand)
    },
  },
})
