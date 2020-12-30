/* eslint-disable no-underscore-dangle */
/* eslint-disable no-param-reassign */
/* eslint-disable no-unused-vars */

function fixData() {
  const elements = require('../data/backups_envase/2020-11-14.json');

  for (let i = 0; i < elements.length; i += 1) {
    elements[i]._id = elements[i]._id.$oid;
    elements[i].date = elements[i].date.$date;
  }
  return elements;
}

export default {
  store: (_formData) => {
    // eslint-disable-next-line no-alert
    alert('El guardado ha sido desactivado');
  },

  getAll: async () => ({ data: fixData() }),

  // eslint-disable-next-line no-underscore-dangle
  getId: async (id) => ({ data: fixData().find((x) => x._id === id) }),

  storeFile: (_formData) => {
    // eslint-disable-next-line no-alert
    alert('El guardado ha sido desactivado');
  },
};
