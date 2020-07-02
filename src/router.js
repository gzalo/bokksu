import Vue from 'vue';
import Router from 'vue-router';
import Home from './views/Home.vue';
import Admin from './views/Admin.vue';
import View from './views/View.vue';

Vue.use(Router);

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
    },
    {
      path: '/admin',
      name: 'admin',
      component: Admin,
    },
    {
      path: '/view/:id',
      name: 'view',
      component: View,
      props: true,
    },
  ],
});
