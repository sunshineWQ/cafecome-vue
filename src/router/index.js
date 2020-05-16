import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../zujian/Login.vue'
import Home2 from '../zujian/Home2'
import  Welcome  from '../zujian/Welcome.vue'
import  AddAdmins  from '../zujian/admins/AddAdmins.vue'
import  shequ  from '../zujian/admins/jubao.vue'
import  showList  from '../zujian/admins/showList.vue'
import  adminList  from '../zujian/admins/adminList.vue'
import rightList from '../zujian/rights/rightList.vue'
import  rolesList  from '../zujian/rights/roleList.vue'

Vue.use(VueRouter)

export default new VueRouter({
  routes:[
    {path : '/',redirect : '/login'},
    {path : '/login',component : Login},
    {
      path : '/home',
      component: Home2,
      redirect:'/welcome',
      children:[
        {path : '/welcome',component:Welcome},
        {path : '/addadmin',component:AddAdmins},
        {path : '/jubao',component:shequ},
        {path : '/showList',component:showList},
        {path : '/adminList',component:adminList},
        {path : '/rightList',component:rightList},
        {path :'/roleList',component:rolesList}
      
      ]
    }
    
  ]
})
