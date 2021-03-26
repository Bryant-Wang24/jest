<template>
  <Layout :use-head="false" :use-foot="false" :auto-height="true">
    <!-- <div class="bill"> -->
    <MainTitle title="票据管理" />
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="发票申请列表" name="invoiceList"><invoiceList v-if="activeName === 'invoiceList'" /></el-tab-pane>
      <el-tab-pane label="收据申请列表" name="receiptList"><receiptList v-if="activeName === 'receiptList'" /></el-tab-pane>
    </el-tabs>
    <!-- <main-menu :menu-list="menuList" />
    <router-view /> -->
    <!-- </div> -->
  </Layout>
</template>

<script>
import { mapActions } from 'vuex'
import Layout from '@/components/base/Layout'
import invoiceList from './components/invoiceList'
import receiptList from './components/receiptList'
import MainTitle from '@/components/base/MainTitle'
export default {
  components: {
    // MainMenu
    Layout,
    invoiceList,
    receiptList,
    MainTitle
  },
  data() {
    return {
      activeName: 'invoiceList'
    }
  },
  mounted() {
    const { activeName } = this.$route.query
    if (activeName) {
      this.activeName = activeName
    }
    this.initBill()
  },
  methods: {
    initBill() {
      this.getProjectOptions()
      this.getCustomerOptions()
      this.getCompanyList()
    },
    handleClick(tab, event) {
      // this.activeName = tab.name
    },
    ...mapActions('bill', ['getProjectOptions', 'getCustomerOptions', 'getCompanyList'])
  }

}
</script>

<style lang='scss' scoped>
</style>
