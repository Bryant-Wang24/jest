<template>
  <div class="dashboard-container">
    <div class="title">管理中心</div>
    <!-- <Tinymce /> -->
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import pageMixin from '@/views/mixins/page'
// import Tinymce from '@/components/Tinymce'

export default {
  name: 'Dashboard',
  // components: { Tinymce },
  mixins: [pageMixin],
  data() {
    return {
      currentRole: 'adminDashboard'
    }
  },
  computed: {
    ...mapGetters([
      'roles'
    ])
  },
  created() {
  },
  mounted() {
  },
  methods: {
  }
}
</script>

<style lang="scss" scoped>
 $width:100%;
.dashboard-container {
  width: 100%;
  min-height: calc(100vh - 84px);
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 60px;

}
</style>
