import Vue from 'vue'
import Router from 'vue-router'
import main from '@/components/main'
import login from '@/components/login'
import user from '@/components/user'
import shop from '@/components/shop'
import classify from '@/components/classify'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'main',
      component: main,
      children:[
          {path:'/',component:user},
          {path:'/shop',component:shop},
          {path:'/classify',component:classify}
      ]
    },
    {
      path: '/login',
      name: 'login',
      component: login
    }
  ]
})
