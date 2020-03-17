// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import fastClick from 'fastclick'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
// import vSelect from 'vue-select'
// import store from './store/index'
import './assets/styles/reset.css'
import './assets/styles/border.css'
import './assets/styles/iconfont.css'
import router from './router'

Vue.use(ElementUI);
Vue.config.productionTip = false;
fastClick.attach(document.body);
// Vue.prototype.formatDate = function (date) {
//     let y = date.getFullYear();
//     let m = date.getMonth() + 1;
//     m = m < 10 ? '0' +m : m;
//     let  d = date.getDate();
//     d = d < 10 ? ('0' + d) :d;
//     return y + '-' + m + '-' + d
// };

// Vue.component('v-select', vSelect)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  // store,
  components: { App },
  template: '<App/>'
});
