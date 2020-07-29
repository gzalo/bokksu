<template>
  <div>
    <Multiviewer :data="submissions" v-if="submissions" />
  </div>
</template>

<script>
import api from '../api';
import Multiviewer from '../components/Multiviewer.vue';

export default {
  props: ['ids'],
  components: { Multiviewer },

  data() {
    return {
      submissions: null,
    };
  },

  async mounted() {
    const ids = this.ids.split(',');
    const requests = await Promise.all(ids.map((id) => api.getId(id)));
    this.submissions = requests.map((request) => request.data);
  },
};
</script>
