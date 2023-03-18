import VueRouter from 'vue-router'
import Vue from 'vue'
import Files from '@/view/files'
import UploadForm from "@/view/uploadform"
Vue.use(VueRouter)

const routes = [
  {
    name:'upload',
    path:'/upload',
    component:UploadForm
  },
  {
    name:'files',
    path:'/files',
    component:Files,
  },
  {
    name:'map',
    path:'/',
  }
]
const router =  new VueRouter({
  routes,
})
// router.beforeEach((to, from, next)=>{
//   next()
// })
export default router

