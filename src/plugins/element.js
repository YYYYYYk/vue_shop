import Vue from 'vue'
//注意Message弹框提示组件（这个是全局挂载）
import {Button,form,FormItem,input,Message} from 'element-ui'

Vue.use(Button)
Vue.use(form)
Vue.use(FormItem)
Vue.use(input)
//这样就可通过this访问到$message
Vue.prototype.$message=Message
