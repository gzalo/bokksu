import Vue from 'vue';
import Router from 'vue-router';
import Home from './views/Home.vue';
import Admin from './views/Admin.vue';
import Admin2 from './views/Admin2.vue';
import View from './views/View.vue';
import Multiview from './views/Multiview.vue';
import OldViewer from './views/OldViewer.vue';

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
      path: '/admin2',
      name: 'admin2',
      component: Admin2,
    },
    {
      path: '/view/:id',
      name: 'view',
      component: View,
      props: true,
    },
    {
      path: '/multiview/:ids',
      name: 'multiview',
      component: Multiview,
      props: true,
    },
    {
      path: '/oldviewer',
      name: 'oldviewer',
      component: OldViewer,
    },
  ],
});
