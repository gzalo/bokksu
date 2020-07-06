<template>
  <div class="fondo">
    <div class="container">
      <a href="/"><img class="logo-catedra my-4" src="/img/Logo-Belluccia-150x150.png" alt=""/></a>
      <h2>Administración de entregas</h2>

      <VueTabulator v-model="submissions" :options="options" @row-click="rowClick" />
    </div>
  </div>
</template>

<script>
import moment from 'moment';
import api from '../api';
import templates from '../templates';
import commissions from '../commissions';

const commissionValues = { '': 'Todas' };
for (let i = 0; i < commissions.length; i += 1) {
  const name = commissions[i].id;
  const id = commissions[i].name;
  commissionValues[name] = id;
}

const themeValues = { '': 'Todos' };
for (let i = 0; i < templates.length; i += 1) {
  const name = templates[i].id;
  const id = templates[i].name;
  themeValues[name] = id;
}

export default {
  data() {
    return {
      submissions: [],
      options: {
        index: '_id',
        layout: 'fitColumns',
        columns: [
          {
            title: 'Nombre',
            field: 'firstName',
            sorter: 'string',
            editor: false,
          },
          {
            title: 'Apellido',
            field: 'lastName',
            sorter: 'string',
            editor: false,
          },
          {
            title: 'Comisión',
            field: 'commission',
            sorter: 'string',
            headerFilter: 'select',
            headerFilterParams: commissionValues,
            formatter(cell) {
              return commissions.find((commission) => commission.id.toString() === cell.getValue()).name;
            },
          },
          {
            title: 'Tema',
            field: 'theme',
            sorter: 'string',
            headerFilter: 'select',
            headerFilterParams: themeValues,
            formatter(cell) {
              return templates.find((template) => template.id.toString() === cell.getValue()).name;
            },
          },
          {
            title: 'Fecha de subida',
            field: 'date',
            sorter: 'datetime',
            formatter: 'datetime',
            editor: false,
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
      // this.$router.push({ name: 'view', params: { id } });
      const routeData = this.$router.resolve({ name: 'view', params: { id } });
      window.open(routeData.href, '_blank');
    },
  },
};
</script>

<style lang="scss">
@import '~vue-tabulator/dist/scss/bootstrap/tabulator_bootstrap4';

.tabulator-row {
  border-bottom: 1px solid #ffffff36;
  transition: all 0.2s;
}

.tabulator-row.tabulator-selectable:hover {
  background-color: rgba(131, 126, 158, 0.11);
}

.tabulator-header {
  padding: 1.3rem 2rem;
}

.tabulator .tabulator-header {
  background-color: #2f2f4b;
  border: none;
}

.tabulator .tabulator-header .tabulator-col {
  background-color: transparent !important;
}

.tabulator-cell {
  font-size: 1rem;
  letter-spacing: 0.7px;
  padding-left: 2.8rem !important;
  padding-right: 2.8rem !important;
  padding-top: 1.1rem !important;
  height: 60px !important;
}

.tabulator-col-title {
  font-weight: 300;
  letter-spacing: 0.6px;
  font-size: 0.9rem;
}

.tabulator-arrow {
  border-radius: 5px;
  top: 23px !important;
}

.tabulator-header-filter {
  margin-top: 0.8rem !important;
}
</style>

<style scoped>
.container {
  max-width: 1280px;
}

h2 {
  font-size: 1.4rem;
  font-weight: 300;
  color: white;
  margin-top: 2.5rem;
  margin-bottom: 3rem;
  letter-spacing: 0.4px;
}

.fondo {
  background-color: #24243c;
  color: white;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
}
</style>

<style>
.tabulator-col-title {
  display: inline;
}

.tabulator-arrow {
  position: initial !important;
}
</style>
