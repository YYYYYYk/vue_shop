import Vue from 'vue'
import VueRouter from 'vue-router'
// import Login from '../components/login.vue'
//懒加载路由写法
const Login=()=>import(/* webpackChunkName:"login_home_welcome" */'../components/login.vue')
// import Home from '../components/Home.vue'
const Home=()=>import(/* webpackChunkName:"login_home_welcome" */'../components/Home.vue')
// import welcome from '../components/Welcome.vue'
const welcome=()=>import(/* webpackChunkName:"login_home_welcome" */'../components/Welcome.vue')

// import User from '../components/user/User.vue'
// import Rights from '../components/power/Rights.vue'
// import Roles from '../components/power/Roles.vue'
const User=()=>import(/* webpackChunkName:"User_Rights_Roles" */'../components/user/User.vue')
const Rights=()=>import(/* webpackChunkName:"User_Rights_Roles" */'../components/power/Rights.vue')
const Roles=()=>import(/* webpackChunkName:"User_Rights_Roles" */'../components/power/Roles.vue')

// import Categories from '../components/goods/Categories.vue'
// import Params from '../components/goods/Params.vue'
const Categories=()=>import(/* webpackChunkName:"Categories_Params" */'../components/goods/Categories.vue')
const Params=()=>import(/* webpackChunkName:"Categories_Params" */'../components/goods/Params.vue')

// import Goods from '../components/goods/List.vue'
// import Add from '../components/goods/Add.vue'
const Goods=()=>import(/* webpackChunkName:"Goods_Add" */'../components/goods/List.vue')
const Add=()=>import(/* webpackChunkName:"Goods_Add" */'../components/goods/Add.vue')

// import Order from '../components/order/Order.vue'
// import Report from '../components/report/Report.vue'
const Order=()=>import(/* webpackChunkName:"Order_Report" */'../components/order/Order.vue')
const Report=()=>import(/* webpackChunkName:"Order_Report" */'../components/report/Report.vue')

Vue.use(VueRouter)

const routes = [
  // 定义路由重定向规则(redirect)
  {path:'/',redirect:'/login'},
  {path:'/login',component:Login},
  {path:'/home',component:Home,redirect:'/welcome',
    children:[
    {path:'/welcome',component:welcome},
    {path:'/users',component:User},
    {path:'/rights',component:Rights},
    {path:'/roles',component:Roles},
    {path:'/categories',component:Categories},
    {path:'/params',component:Params},
    {path:'/goods',component:Goods},
    {path:'/goods/add',component:Add},
    {path:'/orders',component:Order},
    {path:'/reports',component:Report}
  ]}
]

const router = new VueRouter({
  routes
})

//挂载路由导航守卫
router.beforeEach((to, from, next) => {
  if(to.path==='/login') return next()
  const tokenStr=window.sessionStorage.getItem('token')
  if(!tokenStr) return next('/login')
  next(); 
  
})

export default router
