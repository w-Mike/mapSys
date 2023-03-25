import Vue from 'vue'
import App from './App.vue'
import router from '@/router'
import dayjs from 'dayjs'
import element from "@/utils/elplugin"
import "@/assets/theme/index.css"


const eventBus = new Vue()
Vue.use(element)

Vue.config.productionTip = false
Vue.prototype.$dayjs = dayjs
Vue.prototype.$eventBus= eventBus

new Vue({
  render: h => h(App),
  router,
}).$mount('#app')
