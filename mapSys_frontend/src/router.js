import VueRouter from 'vue-router'
import Vue from 'vue'
import DocsView from "@/view/docsView"
import MapView from "@/view/mapView"
import VecToggle from "@/view/vecToggle.vue"
import facInfo from "@/view/facInfo.vue"
Vue.use(VueRouter)

const changePush = VueRouter.prototype.push;
VueRouter.prototype.push = function push(location) {
  return changePush.call(this, location).catch(err => err);
}

const routes = [
  {
    name:'home',
    path:'/',
    component:MapView,
    children:[
      {
        name:"vectoggle",
        path:"vectoggle",
        component:VecToggle
      },
      {
        name:"facinfo",
        path:"facinfo:fid",
        component:facInfo
      }
    ]

  },
  {
    name:'docs',
    path:'/docs',
    component: DocsView
  },
]
const router =  new VueRouter({
  routes,
})
// router.beforeEach((to, from, next)=>{
//   next()
// })
export default router

