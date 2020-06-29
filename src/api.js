const apiURL = "http://127.0.0.1:3000/";
import axios from "axios";

export default {
  store: (formData) => {
    axios
      .post(apiURL + "submissions", formData)
      .then((data) => console.log(data.data));
  },

  getAll: (data) => {
    return axios.get(apiURL + "submissions");
  },

  storeFile: (formData) => {
    axios
      .post(apiURL + "submissions", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((data) => console.log(data.data))
      .catch((error) => console.log(error));
  },
};
