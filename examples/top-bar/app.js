Vue.component('demo', {
  template: `
  <main class="page-main" v-swipe.v="{onStart, onSwipingNegative, onSwipingPositive, onSwipedNegative, onSwipedPositive}">
    <section class="top-bar" :style="topBarStyle">Top Bar</section>
    <section class="page-content">
      <van-cell-group>
        <van-cell v-for="n in 15" :key="n" :title="'单元格' + n" value="内容" label="描述信息" />
      </van-cell-group>
    </section>
  </main>
  `,
  data() {
    return {
      fromTop: false,
      topBarMaxHeight: 48,
      topBarHeight: 0
    }
  },
  computed: {
    topBarStyle() {
      return {
        height: `${this.topBarHeight}px`
      }
    }
  },
  methods: {
    onStart() {
      this.fromTop = document.documentElement.scrollTop === 0
    },
    onSwipingNegative(offset) {
      if (this.fromTop && this.topBarHeight === this.topBarMaxHeight) {
        this.topBarHeight = Math.abs(offset) < this.topBarMaxHeight ? Math.abs(offset) : 0
      }
    },
    onSwipingPositive(offset) {
      if (this.fromTop && this.topBarHeight < this.topBarMaxHeight) {
        this.topBarHeight = Math.abs(offset) > this.topBarMaxHeight ? this.topBarMaxHeight : Math.abs(offset)
      }
    },
    onSwipedNegative() {
      if (this.fromTop) {
        this.topBarHeight = 0
      }
    },
    onSwipedPositive() {
      if (this.fromTop) {
        this.topBarHeight = this.topBarMaxHeight
      }
    },
  },
})