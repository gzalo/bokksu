import axios from 'axios';

const apiURL = 'http://127.0.0.1:3000/';

export default {
  store: (formData) => {
    axios.post(`${apiURL}submissions`, formData).then((data) => console.log(data.data));
  },

  getAll: () => axios.get(`${apiURL}submissions`),

  getId: (id) => axios.get(`${apiURL}submissions/${id}`),

  storeFile: (formData) =>
    axios.post(`${apiURL}submissions`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
};
