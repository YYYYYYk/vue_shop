import Vue from 'vue'
//注意Message弹框提示组件（这个是全局挂载）
import {Button,form,FormItem,input,Message,Container,Header,Aside,Main,Menu,MenuItem,Submenu,Breadcrumb,BreadcrumbItem,
        Card,Row,Col,Table,TableColumn,Switch,Tooltip,Pagination,Dialog} from 'element-ui'

Vue.use(Button)
Vue.use(form)
Vue.use(FormItem)
Vue.use(input)
Vue.use(Container)
Vue.use(Header)
Vue.use(Aside)
Vue.use(Main)
Vue.use(Menu)
Vue.use(MenuItem)
Vue.use(Submenu)
Vue.use(Breadcrumb)
Vue.use(BreadcrumbItem)
Vue.use(Card)
Vue.use(Row)
Vue.use(Col)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Switch)
Vue.use(Tooltip)
Vue.use(Pagination)
Vue.use(Dialog)
//这样就可通过this访问到$message
Vue.prototype.$message=Message
