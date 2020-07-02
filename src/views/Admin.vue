<template>
  <div class="container">
    <h1>Administración</h1>

    <VueTabulator v-model="submissions" :options="options" @row-click="rowClick" />
  </div>
</template>

<script>
import moment from 'moment';
import api from '../api';

export default {
  data() {
    return {
      submissions: [],
      options: {
        index: '_id',
        columns: [
          {
            title: 'Nombre',
            field: 'firstName',
            sorter: 'string',
            editor: false,
            width: 200,
          },
          {
            title: 'Apellido',
            field: 'lastName',
            sorter: 'string',
            editor: false,
            width: 200,
          },
          {
            title: 'Comisión',
            field: 'commission',
            sorter: 'string',
            editor: false,
            headerFilter: true,
            width: 160,
          },
          {
            title: 'Tema',
            field: 'theme',
            sorter: 'string',
            editor: false,
            headerFilter: true,
            width: 160,
          },
          {
            title: 'Fecha de subida',
            field: 'date',
            sorter: 'datetime',
            formatter: 'datetime',
            editor: false,
            width: 200,
          },
        ],
      },
    };
  },

  mounted() {
    window.moment = moment;
    api.getAll().then((data) => {
      this.submissions = data.data;
    });
  },

  methods: {
    rowClick(e, row) {
      const id = row.getIndex();
      this.$router.push({ name: 'view', params: { id } });
    },
  },
};
</script>

<style lang="scss">
@import '~vue-tabulator/dist/scss/bootstrap/tabulator_bootstrap4';

h1 {
  font-size: 2rem;
}
</style>
