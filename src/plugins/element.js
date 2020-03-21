import Vue from 'vue'
//注意Message弹框提示组件（这个是全局挂载）
import {Button,form,FormItem,input,Message,Container,Header,Aside,Main,Menu,MenuItem,Submenu,Breadcrumb,BreadcrumbItem,
        Card,Row,Col,Table,TableColumn,Switch,Tooltip,Pagination,Dialog,MessageBox,Tag,Tree,Select,Option,Cascader,Alert,
        Tabs,TabPane,Steps,Step,CheckboxGroup,checkbox,Upload} from 'element-ui'

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
Vue.use(Tag)
Vue.use(Tree)
Vue.use(Select)
Vue.use(Option)
Vue.use(Cascader)
Vue.use(Alert)
Vue.use(Tabs)
Vue.use(TabPane)
Vue.use(Steps)
Vue.use(Step)
Vue.use(CheckboxGroup)
Vue.use(checkbox)
Vue.use(Upload)
//这样就可通过this访问到$message
Vue.prototype.$message=Message
Vue.prototype.$confirm=MessageBox.confirm
