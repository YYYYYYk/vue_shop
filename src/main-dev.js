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
//导入进度条加载样式
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
//导入依赖中的插件
import TreeTable from 'vue-table-with-tree-grid'
//导入副文本编辑器及样式
import VueQuillEditor from 'vue-quill-editor'
import 'quill/dist/quill.core.css' // import styles
import 'quill/dist/quill.snow.css' // for snow theme
import 'quill/dist/quill.bubble.css' // for bubble theme




//配置请求的根路径
axios.defaults.baseURL='http://47.115.124.102:8888/api/private/v1/'
//设置request拦截器，请求时显示进度条
axios.interceptors.request.use(config => {
  NProgress.start()
  config.headers.Authorization = window.sessionStorage.getItem('token') //设置响应头
  return config
}, err => {
  console.log(err)
})
//在response拦截器中，响应时隐藏进度条
axios.interceptors.response.use(config=>{
  NProgress.done()
  return config
})
Vue.prototype.$http=axios
Vue.config.productionTip = false
//全局注册组件
Vue.component('tree-table',TreeTable)
//这个是也是全局注册,use参数是个install方法,里面可有多个Vue.component
Vue.use(VueQuillEditor)


Vue.filter('dateFormat',function(originVal){
  const dt=new Date(originVal)

  const y=dt.getFullYear()
  const m=(dt.getMonth()+1+'').padStart(2,'0')
  const d=(dt.getDate()+'').padStart(2,'0')

  const hh=(dt.getHours()+'').padStart(2,'0')
  const mm=(dt.getMinutes()+'').padStart(2,'0')
  const ss=(dt.getSeconds()+'').padStart(2,'0')

  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
})



new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
