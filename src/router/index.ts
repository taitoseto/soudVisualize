import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'
import Waveform from '../views/Waveform.vue'

Vue.use(VueRouter)

  const routes: Array<RouteConfig> = [
  {
    path: '/',
    name: 'Home',
    component: Waveform
  },
  {
    path: '/Waveform',
    name: 'Waveform',
    component: () => import(/* webpackChunkName: "about" */ '../views/Waveform.vue')
  }
]

const router = new VueRouter({
  routes
})

export default router
