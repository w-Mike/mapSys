import VueRouter from 'vue-router'
import Vue from 'vue'
import UploadForm from "@/view/uploadform"
import MapContent from "@/view/mapContent"
Vue.use(VueRouter)

const routes = [
  {
    name:'home',
    path:'/',
    component:MapContent
  },
  {
    name:'upload',
    path:'/upload',
    component:UploadForm
  },
]
const router =  new VueRouter({
  routes,
})
// router.beforeEach((to, from, next)=>{
//   next()
// })
export default router

