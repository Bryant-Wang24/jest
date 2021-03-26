<template>
  <div id="result">
    <div class="container">
      <submitResult :info="data" @back="back" @view="view" />
    </div>
  </div>
</template>

<script>
import submitResult from '@/components/submitResult'
import pageMixin from '@/views/mixins/page'
export default {
  name: 'Result',
  components: { submitResult },
  mixins: [pageMixin],
  data() {
    return {
      data: [],
      id: ''
    }
  },
  mounted() {
    const { data, id } = this.$route.params
    this.data = data
    this.id = id
  },
  methods: {
    back() {
      this.$store.dispatch('tagsView/delView', this.$route)
      this.$router.push({ name: 'Application' })
    },
    view() {
      this.$store.dispatch('tagsView/delView', this.$route)
      this.$router.push({
        path: `CustomerInfo`,
        query: { id: this.id, source: 'view' }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
#result {
  height: calc(100vh - 84px);
  padding: 20px;
  .container {
    position: relative;
    height: 100%;
    padding: 20px;
    margin-bottom: 16px;
    background-color: #ffffff;
  }
}
</style>
