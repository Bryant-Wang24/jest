<template>
  <!-- <div class="table"> -->
  <Layout :use-head="false" :use-foot="false" :auto-height="true">
    <MainTitle title="退款管理" />
    <el-tabs
      ref="tab_value"
      v-model="activeName"
      class="tabs_new"
    >
      <el-tab-pane label="退款申请列表" name="0">
        <RefundList ref="table_list" />
      </el-tab-pane>
      <el-tab-pane v-if="hasRolePermission('refund_application')" label="申请退款" name="1">
        <ApplyPage ref="apply" @click_activeName="click_activeName" />
      </el-tab-pane>
    </el-tabs>
  </Layout>
  <!-- </div> -->
</template>
<script>
import Layout from '@/components/base/Layout'
import pageMixin from '@/views/mixins/page'
import RefundList from './components/RefundList.vue'
import ApplyPage from './components/apply'
import MainTitle from '@/components/base/MainTitle'
export default {
  components: { RefundList, ApplyPage, MainTitle, Layout },
  mixins: [pageMixin],
  data() {
    return {
      activeName: '',
      height: document.documentElement.clientHeight
    }
  },
  watch: {
    activeName(val) {
      switch (val) {
        case '0':
          // this.$refs.table_list.get_refundapplyPage()
          // this.$refs.table_list.get_customerList()
          // this.$refs.table_list.get_projectList()
          this.$refs.table_list.initPage()
          break
        case '1':
          this.$refs.apply.fileList = []
          this.$refs.apply.ruleForm = {
            refund_type: 'DEPOSIT_REFUND'
          }
          this.$refs.apply.gmAmount = 0
          this.$refs.apply.wyAmount = 0
          this.$refs.apply.from_null()
          this.$refs.apply.$refs.ruleForm.resetFields()
          this.$refs.apply.deposit_list = []
          this.$refs.apply.get_projectList()
          this.$refs.apply.get_getlist()
          break
      }
    }
  },
  created() {
    this.activeName = '0'
  },
  methods: {
    click_activeName() {
      this.activeName = '0'
    }
  }

}
</script>
<style lang="scss" scoped>
</style>
