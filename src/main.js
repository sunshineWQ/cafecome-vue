import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
import './assets/css/global.css'
import axios from 'axios'
axios.defaults.baseURL="http://localhost:8811/"  //其余地址就会在之后扩展

//设置拦截请求，将请求带上token
axios.interceptors.request.use(config =>{
  //添加请求规则，怎么验证
  config.headers['Authorization']=window.sessionStorage.getItem('token')
  return config
})
Vue.prototype.$http=axios   //$http：axios的别名，注意起名会出错
Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
