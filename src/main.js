import Vue from 'vue';
import VueTabulator from 'vue-tabulator';
import VueI18n from 'vue-i18n';
import VueMeta from 'vue-meta';
import App from './App.vue';
import router from './router';
import store from './store';
import filters from './filters';

Vue.config.productionTip = false;
Vue.use(VueTabulator);
Vue.use(filters);
Vue.use(VueI18n);
Vue.use(VueMeta, {
  // optional pluginOptions
  refreshOnceOnNavigation: true,
});

const messages = {
  es: {
    downloadTemplate: 'Descargá la plantilla de tu tema',
    downloadTemplateShort: 'Descargar plantilla',
    download: 'Descargar',
    selectCommission: 'Seleccioná comisión, completá tus datos',
    firstName: 'Nombre',
    lastName: 'Apellido',
    uploadYourSubmission: 'Subí tu entrega',
    uploadYourSubmissionShort: 'Subí una entrega',
    resolution: 'Resolución',
    highQuality: 'de alta calidad',
    weightLessThan: 'Peso menor a',
    selectFile: 'Seleccionar archivo',
    upload: 'Guardar',
    correctlyUploaded: 'Tu entrega se subió correctamente',
    viewLink: 'Podrás verla en este link',
    olderTerms: 'Cuatrimestres anteriores',
    viewer: 'Visor de entregas',
    multipleViewer: 'Visor múltiple',
    commission: 'Comisión',
    leftClick: 'Click izquierdo',
    mouseWheel: 'Ruedita',
    rightWheel: 'Click derecho',
    rotation: 'Rotación',
    zoom: 'Zoom',
    camera: 'Cámara',
    noFileSelected: 'Ningún archivo seleccionado',
    weightLessThanError: 'Tu archivo debe pesar menos de 8 MB.',
    selectTheme: 'Elegí el tema',
    theme: 'Tema',
    title: 'Nivel 1 · Envase · Cátedra Belluccia',
    adminTitle: 'Administración de entregas',
    terms1: 'Cada usuario mantiene los derechos de autor de cada archivo subido. ',
    terms2: 'Los mismos son propiedad de cada usuario, y no podrán ser utilizados de ninguna forma excepto teniendo un permiso explícito del autor.',
    uploadDate: 'Fecha de subida',
    admin2Title: 'Previsualización múltiple',
    viewSelected: 'Visualizar entregas seleccionadas',
    allCommissions: 'Todas',
    allThemes: 'Todos',
    submission: 'entrega',
    submissions: 'entregas',
    sourceCode: 'Código fuente',
  },
  en: {
    downloadTemplate: 'Download the template of your theme',
    downloadTemplateShort: 'Download template',
    download: 'Download',
    selectCommission: 'Select class, complete fields',
    firstName: 'First name',
    lastName: 'Last name',
    uploadYourSubmission: 'Upload your work',
    uploadYourSubmissionShort: 'Upload work',
    resolution: 'Resolution',
    highQuality: 'high quality',
    weightLessThan: 'Size less than',
    selectFile: 'Select file',
    upload: 'Save',
    correctlyUploaded: 'Your work was uploaded successfully',
    viewLink: 'You can view it here',
    olderTerms: 'Previous quarters',
    viewer: 'View submissions',
    multipleViewer: 'Multi-viewer',
    commission: 'Class',
    leftClick: 'Left click',
    mouseWheel: 'Wheel',
    rightWheel: 'Right click',
    rotation: 'Rotation',
    zoom: 'Zoom',
    camera: 'Camera',
    noFileSelected: 'No file selected',
    weightLessThanError: 'File size must be less than 8 MB.',
    selectTheme: 'Select a theme',
    theme: 'Theme',
    title: 'Bokksu - 3d package viewer',
    adminTitle: 'Submission administrator',
    terms1: 'Each user maintains copyright over their uploaded files.',
    terms2: "Files are owned by each user, and can't be used in any way without explicit permission from the author.",
    uploadDate: 'Upload date',
    admin2Title: 'Multiple upload visualizer',
    viewSelected: 'View selected submissions',
    allCommissions: 'All',
    allThemes: 'All',
    submission: 'submission',
    submissions: 'submissions',
    sourceCode: 'Source code',
  },
};

const i18n = new VueI18n({
  locale: localStorage.getItem('lang') || 'es',
  messages,
});

new Vue({
  router,
  store,
  i18n,
  render: (h) => h(App),
}).$mount('#app');
