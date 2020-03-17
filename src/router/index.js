import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/pages/home/Home'
import Pod from '@/pages/pod/Pod'
import PodOffline from '@/pages/pod_offline/Pod'
Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      path: '/pod',
      name: 'Pod',
      component: Pod
    },
    {
      path: '/pod-offline',
      name: 'PodOffline',
      component: PodOffline
    },

  ]
})
