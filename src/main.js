import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
// 导入全局样式
import '../src/assets/css/global.css'
// 导入阿里字体图标
import '../src/assets/fonts/iconfont.css'
// 导入axios
import axios from 'axios'


//配置请求的根路径
axios.defaults.baseURL='http://47.115.124.102:8888/api/private/v1/'
//设置请求拦截器
axios.interceptors.request.use(config => {
  config.headers.Authorization = window.sessionStorage.getItem('token') //设置响应头
  return config
}, err => {
  console.log(err)
})
Vue.prototype.$http=axios
Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
