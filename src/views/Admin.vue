<template>
  <div>
    <h1>Admin page</h1>

    <div v-for="submission in submissions" :key="submission.id">
      <h1>
        {{ submission.firstName }} {{ submission.lastName }}
        {{ submission.date }}
      </h1>
    </div>
  </div>
</template>

<script>
import api from "../api.js";

export default {
  data() {
    return {
      submissions: [],
    };
  },

  mounted() {
    api.getAll().then((data) => (this.submissions = data.data));
  },
};
</script>
