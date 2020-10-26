import swipe from './swipe'
export default function install(Vue) {
  if (install.installed) return
  install.installed = true
  Vue.directive('swipe', swipe)
}
