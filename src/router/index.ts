import { createRouter, createWebHistory } from "vue-router";
import LoginVue from '../views/Login.vue'
import Home from '../views/Home.vue'
import Evaluation from '../views/evaluate/Evaluation.vue'
import Approval from '../views/Approval.vue'
import Report from '../views/Report.vue'
import test from '../views/test.vue'
import detail1 from '../views/evaluate/detail1.vue'
 
let routes= [
      {
    path: '/login',
    name: 'login',
    component: LoginVue
  },
  {
    path: '/',
    redirect: '/login'
  },

  {
    path: '/home',
    name: 'home',
    component: Home,
    redirect: '/home/createTrust',
    children: [
      { 
        path: '/home/createTrust', 
        component: () => import('../views/CreateTrust.vue')  
      },
      { 
        path: '/home/createTrust/selectFacility', 
        name: 'selectFacility',
        component: () => import('../views/SelectFacility.vue')  
      },
      { 
        path: '/home/createTrust/selectShop', 
        name: 'selectShop',
        component: () => import('../views/SelectShop.vue')  
      },
      {
        name: 'searchTrust',
        path: '/home/searchTrust', 
        meta: { keepAlive: true, isBack: true},
        component: () => import('../views/SearchTrust.vue') ,
      },
      {
        path: '/home/result',
        name: 'result',
        component: () => import('../views/Results.vue') ,
      },


      {
        path: '/evaluation',
        name: 'evaluation',
        component:  () => import('../views/evaluate/Evaluation.vue') ,
   
      },
      {
        path: '/approval',
        name: 'approval',
        component: Approval
      },
      {
        path: '/report',
        name: 'report',
        component: Report
      },
      {
        path: '/detail1',
        name: 'detail1',
        component: () => import('../views/evaluate/detail1.vue'),
      }
    ]
  },
  
  {
    path: '/test',
    name: 'test',
    component: test
  },
]
// 路由
const router = createRouter({
    history: createWebHistory(),
    routes
})




// 导出
export default router
