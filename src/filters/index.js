import dateFilter from './dateFilter';

export default {
  install(Vue) {
    Vue.filter('dateFilter', dateFilter);
  },
};
