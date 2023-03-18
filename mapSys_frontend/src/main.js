import Vue from 'vue'
import App from './App.vue'
import store from '@/store'
import router from '@/router'
import dayjs from 'dayjs'

import "@/utils/bootstrapimport"

Vue.config.productionTip = false
Vue.prototype.$store = store
Vue.prototype.$dayjs = dayjs

new Vue({
  render: h => h(App),
  router,
}).$mount('#app')
