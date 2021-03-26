<template>
  <Layout :use-head="false" :use-foot="false">
    <MainTitle title="修改退款申请" />
    <ApplyPage ref="apply" class="apply_page" />
  </Layout>
</template>
<script>
import pageMixin from '@/views/mixins/page'
import ApplyPage from './components/apply'
import Layout from '@/components/base/Layout'
import MainTitle from '@/components/base/MainTitle'
export default {
  components: { ApplyPage, MainTitle, Layout },
  mixins: [pageMixin],
  data() {
    return {

    }
  },
  created() {
    this.$nextTick(() => {
      this.$refs.apply.get_projectList()
      this.$refs.apply.get_getlist()
      this.$refs.apply.get_refundapplyNew()
    })
  },
  methods: {

  }
}
</script>
<style scoped lang="scss">
// .apply_edit_new{
//   width: 100%;
//   padding: 20px;
//   box-sizing: border-box;
//   .apply_page{
//     padding: 20px 0;
//   }
// }
</style>
