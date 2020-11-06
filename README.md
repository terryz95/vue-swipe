# vue-swipe
一个滑动手势的Vue自定义指令(A custom directive of Vue for the swipe gesture)
## 说明
`vue-swipe`只做了两件事
1. 给dom绑定Touch事件
2. 在事件回调中提供通用参数：判定的滑动方向、偏移量等

如果需要做特殊交互需要结合这些参数单独实现。
[examples](https://github.com/terryz95/vue-swipe/tree/main/examples)中给出了两个经常出现的例子。[Demo](https://terryz95.github.io/vue-swipe/)
## 用法
### 引入
```javascript
/** 局部注册 **/
// component.vue
import VueSwipe from 'vue-swipe'
const swipe = new VueSwipe(
  // options (threshold)
).initDirective()
export default {
  //...
  directives: {
    swipe
  }
  //...
}

/** 全局注册 **/
import Vue from 'vue'
import { VueSwipeInstaller } from 'vue-swipe'
Vue.use(VueSwipeInstaller(
  // options (threshold)
))
```
### 使用
```vue
<template>
	<div>
		<!-- other dom -->
		<div v-swipe="{ onStart, onSwiping, onSwiped }"></div>
		<!-- other dom -->
	</div>
</template>
<script>
export default {
	methods: {
		onStart() {
			// TODO when swipe start
		}
  	onSwiping(orientation, delta, offset, event) {
      console.log(orientation) // 'horizontal' | 'vertical'
      console.log(delta) // 带符号的偏移量
      console.log(offset) // 偏移量的绝对值
      console.log(event) // TouchEvent
    },
    onSwiped(orientation, delta, offset, event) {
      // 同onSwiping
    },
	}
}
</script>
```
