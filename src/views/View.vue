<template>
  <div>
    <Viewer :data="submission" v-if="submission" />
  </div>
</template>

<script>
import api from '../api';
import Viewer from '../components/Viewer.vue';

export default {
  props: ['id'],
  components: { Viewer },

  data() {
    return {
      submission: null,
    };
  },

  mounted() {
    api.getId(this.id).then((data) => {
      this.submission = data.data;
      document.title = `${this.submission.firstName} ${this.submission.lastName}`;
    });
  },
};
</script>
