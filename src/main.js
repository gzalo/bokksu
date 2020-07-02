import Vue from 'vue';
import VueTabulator from 'vue-tabulator';
import App from './App.vue';
import router from './router';
import store from './store';
import filters from './filters';

Vue.config.productionTip = false;
Vue.use(VueTabulator);
Vue.use(filters);

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');
