<template>
  <div>
    <Viewer :data="submission" />
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
      submission: {},
    };
  },

  mounted() {
    api.getId(this.id).then((data) => {
      this.submission = data.data;
    });
  },
};
</script>
