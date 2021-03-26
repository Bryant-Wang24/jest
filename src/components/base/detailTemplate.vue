<template>
  <Layout :use-head="false" :use-foot="true">
    <div>
      <MainTitle />
      <rowText text="公司信息" />
      <div>
        <el-button icon="el-icon-plus">添加</el-button>
        <el-button icon="el-icon-delete" type="danger">确认删除组件</el-button>
      </div>
    </div>
    <CloseTabsButton slot="foot" @close="back">返回</CloseTabsButton>
  </Layout>
</template>

<script>
import Layout from '@/components/base/Layout'
import MainTitle from '@/components/base/MainTitle'
import rowText from '@/components/rowText'
import CloseTabsButton from '@/components/base/CloseTabsButton'
export default {
  components: {
    Layout,
    MainTitle,
    rowText,
    CloseTabsButton
  },
  data() {
    return {

    }
  },
  methods: {
    back() {}
  }
}
</script>

<style></style>
