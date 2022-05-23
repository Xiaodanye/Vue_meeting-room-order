import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../components/Home.vue'
import Rooms from '../components/room/Rooms.vue'
import Order from '../components/room/Order.vue'
import Departments from '../components/department/Departments.vue'
import DepHistory from '../components/department/DepHistory.vue'
import Approved from '../components/approve/Approved.vue'
import NotApproved from '../components/approve/NotApproved.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    component: Home,
    redirect: '/order',
    children: [
      { path: '/order', component: Order },
      { path: '/rooms', component: Rooms },
      { path: '/department', component: Departments },
      { path: '/depHistory', component: DepHistory },
      { path: '/approved', component: Approved },
      { path: '/notApproved', component: NotApproved }
    ]
  }
]

const router = new VueRouter({
  routes
})

export default router
