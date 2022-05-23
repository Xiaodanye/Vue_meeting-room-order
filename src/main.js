import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './plugins/element.js'
import './assets/css/global.css'
import './assets/fonts/iconfont.css'

import moment from 'moment'
import 'nprogress/nprogress.css'

Vue.prototype.$moment = moment
Vue.prototype.$moment.suppressDeprecationWarnings = true

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
