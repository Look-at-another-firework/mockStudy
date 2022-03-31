import Vue from 'vue'
import App from './App.vue'

Vue.config.productionTip = false

// 引入mock文件
import "./mock"; // mock 方式，正式发布时，注释掉该处即可

new Vue({
  render: h => h(App),
}).$mount('#app')
