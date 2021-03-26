<template>
  <Layout :use-head="false" :use-foot="false" :auto-height="true">
    <!-- <div class="account"> -->
    <MainTitle title="台账管理" />
    <el-tabs v-model="activeName" class="tabs" @tab-click="handleClick">
      <el-tab-pane label="台账列表" name="accoutList">
        <AccountList v-if="activeName === 'accoutList'" />
      </el-tab-pane>
      <el-tab-pane v-if="hasRolePermission('AccountManage_enterForm')" label="录入台账" name="enterForm">
        <EnterForm v-if="activeName === 'enterForm'" />
      </el-tab-pane>
      <el-tab-pane v-if="hasRolePermission('AccountManage_import')" label="批量导入" name="import">
        <BatchImport v-if="activeName === 'import'" />
      </el-tab-pane>
    </el-tabs>
  <!-- </div> -->
  </Layout>
</template>

<script>
import Layout from '@/components/base/Layout'
import MainTitle from '@/components/base/MainTitle'
import AccountList from './components/accountList'
import EnterForm from './components/enterForm'
import BatchImport from './components/batchImport'
export default {
  components: {
    // MainMenu
    Layout,
    AccountList,
    EnterForm,
    BatchImport,
    MainTitle
  },
  data() {
    return {
      activeName: 'accoutList'
    }
  },
  methods: {
    handleClick() {}
  }
}
</script>

<style lang='scss' scoped>
.account {
  .title{
    margin-bottom: 20px;
    font-weight: bold;
    font-size: 18px;
  }
  margin: 20px;
  background: #fff;
  padding: 20px;
}
</style>
