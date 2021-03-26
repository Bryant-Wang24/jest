<template>
  <Layout :use-head="false" :use-foot="false" :auto-height="true">
    <!-- <div class="content_new"> -->
    <!-- <div class="table"> -->
    <MainTitle title="下载中心" />
    <el-tabs ref="tab_value" v-model="activeName">
      <el-tab-pane label="下载申请列表" name="0">
        <TableList ref="table_list" />
      </el-tab-pane>
      <el-tab-pane label="下载记录" name="1">
        <ApplyPage ref="apply" />
      </el-tab-pane>
    </el-tabs>
    <!-- </div> -->
    <!-- </div> -->
  </Layout>
</template>
<script>
import Layout from '@/components/base/Layout'
import TableList from './components/list'
import ApplyPage from './components/apply'
import MainTitle from '@/components/base/MainTitle'

export default {
  components: { Layout, TableList, ApplyPage, MainTitle },
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
          this.$refs.table_list.getApplicationList()
          this.$refs.table_list.getApplicantList()
          // this.$refs.table_list.get_operatorList()
          break
        case '1':
          this.$refs.apply.get_operationLog()
          this.$refs.apply.get_operatorList()
          // this.$refs.apply.deposit_list = []
          // this.$refs.apply.get_projectList()
          // this.$refs.apply.get_getlist()
          break
      }
    }
  },
  created() {
    this.activeName = '0'
  },
  methods: {

  }

}
</script>
<style lang="scss" scoped>
// .table {
//   margin-top: 16px;
//   width: 100%;
//   padding: 24px;
//   box-sizing: border-box;
//   background: white;
//   .table_add {
//     width: 100%;
//   }
// }

// .tabs_new {
//     width: 100%;
//     overflow: hidden;
//     position: relative;
//     ::v-deep .el-tabs__header {
//       width: 100%;
//       height: 40px;
//       background: white;
//       // z-index: 10;
//       position: absolute;
//       left: 0;
//       top: 0;
//     }
//     ::v-deep .el-tabs__content {
//       // z-index: 9;
//       position: absolute;
//       width: 100%;
//       left: 0;
//       top: 55px;
//       // height: 250px;
//       overflow: auto;
//       box-sizing: border-box;
//       // .table_new{
//       //   padding: 0 24px;
//       //   box-sizing: border-box;
//       //   .el-radio-group{
//       //     .table_new{
//       //       padding: 0;
//       //     }
//       //   }
//       // }
//     }

// }
</style>
