import Vue from 'vue'
import Router from 'vue-router'
import main from '@/components/main'
import login from '@/components/login'
import user from '@/components/user'
import order from '@/components/order'
import concat from '@/components/concat'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'main',
      component: main,
      children:[
          {path:'/',component:order},
          {path:'/user',component:user},
          {path:'/order',component:order},
          {path:'/concat',component:concat}
      ]
    },
    {
      path: '/login/:type',
      name: 'login',
      component: login
    }
  ]
})
