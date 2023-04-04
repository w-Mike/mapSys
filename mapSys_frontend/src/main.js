import Vue from 'vue'
import App from './App.vue'
import router from '@/router'
import dayjs from 'dayjs'
import element from "@/utils/elplugin"
import { Message, MessageBox, Loading } from "element-ui"
import "@/assets/theme/index.css"


const eventBus = new Vue()
Vue.use(element)
Vue.use(Loading)
Vue.use(Loading.directive)

Vue.config.productionTip = false

Vue.prototype.$dayjs = dayjs
Vue.prototype.$eventBus= eventBus
Vue.prototype.$message = Message
Vue.prototype.$confirm = MessageBox.confirm
Vue.prototype.$loading = Loading

new Vue({
  render: h => h(App),
  router,
}).$mount('#app')
