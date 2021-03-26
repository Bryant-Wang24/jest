<template>
  <Layout :use-head="false" :use-foot="false" :auto-height="true">
    <!-- <div id="handoverSlipMgmt_index"> -->
    <MainTitle title="资料交接" />
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="交接单列表" name="list"><HandoverSlipList v-if="activeName === 'list'" /></el-tab-pane>
      <el-tab-pane v-if="hasRolePermission('handoverSlipMgmt_add')" label="添加交接单" name="add"><AddHandoverSlip v-if="activeName === 'add'" /></el-tab-pane>
    </el-tabs>
    <!-- </div> -->
  </Layout>
</template>

<script>
import AddHandoverSlip from './addHandoverSlip'
import HandoverSlipList from './handoverSlipList'
import MainTitle from '@/components/base/MainTitle'
import Layout from '@/components/base/Layout'
export default {
  name: 'Index',
  components: {
    Layout,
    AddHandoverSlip,
    HandoverSlipList,
    MainTitle
  },
  data() {
    return {
      activeName: 'list'
    }
  },
  mounted() {
  },
  methods: {
    handleClick(tab, event) {
      console.log(tab, event)
    },
    handleSelect(key, keyPath) {
      this.$router.push(key)
    }
  }
}
</script>
<style lang="scss" scoped>
// #handoverSlipMgmt_index{
//     background: #fff;
//     margin: 15px;
//     padding: 24px;
// }
</style>
