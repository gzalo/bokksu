import axios from 'axios';

const apiURL = process.env.VUE_APP_BASE_API_PATH || 'https://bokksu-backend.cgi-bin.workers.dev/';

export default {
  getAll: () => axios.get(`${apiURL}submissions`),

  getId: (id) => axios.get(`${apiURL}submissions/${id}`),

  storeFile: (formData) =>
    axios.post(`${apiURL}submissions`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
};
