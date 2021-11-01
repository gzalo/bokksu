<template>
  <div class="fondo mb-5">
    <div class="container">
      <a href="/"><img class="logo-catedra my-4" src="/img/logo.svg" alt=""/></a>
      <h2>{{ $t('adminTitle') }}</h2>
      <p id="contador" class="light-text"></p>
      <VueTabulator v-model="submissions" :options="options" @row-click="rowClick" />
      <footer class="light-text">{{ $t('terms1') }}<br />{{ $t('terms2') }}</footer>
    </div>
  </div>
</template>

<script>
import moment from 'moment-timezone';
import api from '../api';
import templates from '../templates';
import commissions from '../commissions';

const getClase = (date) => {
  if (date.isBefore('2021-09-24T03:00:00Z')) {
    return 1;
  }
  if (date.isBefore('2021-10-01T03:00:00Z')) {
    return 2;
  }
  if (date.isBefore('2021-10-08T03:00:00Z')) {
    return 3;
  }
  if (date.isBefore('2021-10-15T03:00:00Z')) {
    return 4;
  }
  if (date.isBefore('2021-10-22T03:00:00Z')) {
    return 5;
  }
  return 9;
};

const dateValues = {
  '': 'Todos',
  1: '1. Jueves 23',
  2: '2. Jueves 30',
  3: '3. Jueves 7',
  4: '4. Preentrega',
  5: '5. Entrega Final',
  9: 'Otra clase',
};

// eslint-disable-next-line no-unused-vars

// eslint-disable-next-line no-unused-vars
const customDateFilter = (headerValue, rowValue, rowData, filterParams) => {
  if (headerValue instanceof Array) return true;

  const date = moment.utc(rowValue).tz('America/Argentina/Buenos_Aires');
  const clase = getClase(date);
  return clase === parseInt(headerValue, 10);
};

/* eslint-disable func-names */
/* eslint-disable space-before-function-paren */

export default {
  // eslint-disable-next-line object-shorthand
  data: function() {
    const submissionText = this.$t('submission');
    const submissionsText = this.$t('submissions');
    const lang = this.$i18n.locale;

    const commissionValues = { '': lang === 'es' ? 'Todas' : 'All' };
    for (let i = 0; i < commissions.length; i += 1) {
      const name = commissions[i].id;
      const id = commissions[i].name;
      commissionValues[name] = id;
    }

    const themeValues = { '': lang === 'es' ? 'Todos' : 'All' };
    for (let i = 0; i < templates.length; i += 1) {
      const name = templates[i].id;
      const id = templates[i].name;
      themeValues[name] = id;
    }

    return {
      submissions: [],
      options: {
        locale: 'es',
        langs: {
          es: {
            headerFilters: {
              default: this.$i18n.locale === 'es' ? 'Filtrar...' : 'Filter...',
            },
          },
        },
        index: '_id',
        layout: 'fitColumns',
        dataFiltered(filters, rows) {
          const rowNumber = rows.length;
          document.querySelector('#contador').innerHTML = `${rowNumber} ${rowNumber === 1 ? submissionText : submissionsText}`;
        },
        columns: [
          {
            title: this.$t('firstName'),
            field: 'firstName',
            sorter: 'string',
            editor: false,
          },
          {
            title: this.$t('lastName'),
            field: 'lastName',
            sorter: 'string',
            editor: false,
          },
          {
            title: this.$t('commission'),
            field: 'commission',
            sorter: 'string',
            width: 200,
            headerFilter: 'select',
            headerFilterParams: commissionValues,
            formatter(cell) {
              return commissions.find((commission) => commission.id.toString() === cell.getValue()).name;
            },
          },
          {
            title: this.$t('theme'),
            field: 'theme',
            sorter: 'string',
            headerFilter: 'select',
            headerFilterParams: themeValues,
            formatter(cell) {
              const tem = templates.find((template) => template.id.toString() === cell.getValue());
              return lang === 'es' ? tem.name : tem.nameEn;
            },
          },
          {
            title: this.$t('uploadDate'),
            field: 'date',
            sorter: 'datetime',
            // eslint-disable-next-line no-unused-vars
            formatter: (cell, formatterParams, onRendered) => {
              const date = moment.utc(cell.getValue()).tz('America/Argentina/Buenos_Aires');

              const title = date.format('DD/MM/YYYY HH:mm');
              const clase = getClase(date);
              return `<span class='date-common date-${clase}' title='${title}'>${lang === 'en' ? 'Other class' : dateValues[clase]}</span>`;
            },
            sorterParams: { format: 'YYYY-MM-DD[T]HH:mm:ss.SSS[Z]Z' },
            headerFilter: 'select',
            headerFilterParams: dateValues,
            headerFilterFunc: customDateFilter,
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

.tabulator-header-filter input {
  padding-left: 0.6rem !important;
  border-radius: 0.25rem;
  border-color: transparent;
}
</style>

<style scoped>
.container {
  max-width: 1280px;
  margin-bottom: 8rem;
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
}
</style>

<style>
body {
  background-color: #24243c;
}
.tabulator-col-title {
  display: inline;
}

.tabulator-arrow {
  position: initial !important;
}

.light-text {
  font-size: 0.9rem;
  margin-top: 1rem;
  color: rgba(255, 255, 255, 0.753);
  letter-spacing: 0.6px;
}

.date-common {
  padding: 0.3rem 0.8rem;
  letter-spacing: 1px;
  margin-top: 0.6rem;
  text-transform: uppercase;
  font-size: 76%;
  border-radius: 99px;
  font-weight: bold;
}

.date-0 {
  background-color: rgba(0, 21, 43, 0.21);
  border: 2px solid rgba(80, 124, 228, 0.418);
  color: #7192e0;
}

.date-1 {
  background-color: rgba(218, 61, 147, 0);
  border: 2px solid rgba(61, 194, 218, 0.356);
  color: #33b5be;
}

.date-2 {
  background-color: rgba(218, 61, 147, 0);
  border: 2px solid rgba(252, 133, 64, 0.473);
  color: rgb(230, 121, 59);
}

.date-9 {
  border: 2px solid rgba(218, 106, 61, 0.473);
}

.date-3 {
  background-color: rgba(218, 61, 147, 0);
  border: 2px solid rgba(218, 61, 147, 0.473);
  color: #f7389a;
}

.date-4 {
  background-color: rgba(0, 21, 43, 0.21);
  border: 2px solid rgba(228, 80, 100, 0.534);
  color: #fc405c;
}
</style>
