/* eslint-disable no-underscore-dangle */
/* eslint-disable no-param-reassign */
/* eslint-disable no-unused-vars */

function fixData() {
  const allElements = require('../data/backups_envase/2020-11-14.json');

  const elements = allElements.slice(-64); // Keep last 64 submissions

  for (let i = 0; i < elements.length; i += 1) {
    elements[i]._id = elements[i]._id.$oid;
    elements[i].date = elements[i].date.$date;
    // console.log(`copy ${elements[i].fileName} C:\\Users\\Gzalo\\Desktop\\github\\bokksu\\public\\upload\\`);
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
