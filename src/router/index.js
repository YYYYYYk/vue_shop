import Vue from 'vue'
import VueRouter from 'vue-router'
import login from '../components/login.vue'
import Home from '../components/Home.vue'
import welcome from '../components/Welcome.vue'
import User from '../components/user/User.vue'
import Rights from '../components/power/Rights.vue'
import Roles from '../components/power/Roles.vue'

Vue.use(VueRouter)

const routes = [
  // 定义路由重定向规则(redirect)
  {path:'/',redirect:'/login'},
  {path:'/login',component:login},
  {path:'/home',component:Home,redirect:'/welcome',
    children:[
    {path:'/welcome',component:welcome},
    {path:'/users',component:User},
    {path:'/rights',component:Rights},
    {path:'/roles',component:Roles}
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
