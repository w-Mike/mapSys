import VueRouter from 'vue-router'
import Vue from 'vue'

import UpdocView from "@/view/updocView.vue"
import FilesView from "@/view/filesView.vue"
import FacsView from "@/view/facsView"
Vue.use(VueRouter)

const changePush = VueRouter.prototype.push;
VueRouter.prototype.push = function push(location) {
  return changePush.call(this, location).catch(err => err);
}

const routes = [
  {
    name:'updoc',
    path:'/updoc',
    component: UpdocView
  },
  {
    name:"files",
    path:'/files',
    component: FilesView
  },{
    name:"facs",
    path:"/facs",
    component: FacsView,
  }
]
const router =  new VueRouter({
  routes,
})
// router.beforeEach((to, from, next)=>{
//   next()
// })
export default router

