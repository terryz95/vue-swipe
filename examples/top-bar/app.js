Vue.component('demo', {
  template: `
  <main class="page-main" v-swipe.v="{onStart, onSwipingNegative, onSwipingPositive, onSwipedNegative, onSwipedPositive}">
    <section class="top-bar" :class="topBarCls" :style="topBarStyle">Top Bar</section>
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
      swiping: false,
      topBarMaxHeight: 48,
      topBarHeight: 0
    }
  },
  computed: {
    topBarCls() {
      return {
        swiping: this.swiping
      }
    },
    topBarStyle() {
      return {
        height: `${this.topBarHeight}px`
      }
    }
  },
  methods: {
    onStart(swiping) {
      this.fromTop = document.documentElement.scrollTop === 0
      this.swiping = swiping
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
    onSwipedNegative(offset, swiping) {
      if (this.fromTop) {
        this.topBarHeight = 0
      }
      this.swiping = swiping
    },
    onSwipedPositive(offset, swiping) {
      if (this.fromTop) {
        this.topBarHeight = this.topBarMaxHeight
      }
      this.swiping = swiping
    },
  },
})