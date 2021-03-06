import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'
import Waveform from '../views/WaveForm.vue'

Vue.use(VueRouter)

  const routes: Array<RouteConfig> = [
  {
    path: '/',
    name: 'Home',
    component: Waveform
  },
  {
    path: '/WaveForm',
    name: 'WaveForm',
    component: () => import(/* webpackChunkName: "about" */ '../views/WaveForm.vue')
  },
  {
    path: '/MicCheck',
    name: 'MicCheck',
    component: () => import('@/views/MicCheck.vue')
  }
]

const router = new VueRouter({
  routes
})

export default router
