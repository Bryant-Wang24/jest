<template>
  <Layout id="sale" :use-head="false" :use-foot="false" :auto-height="true">
    <div class="table">
      <div class="table_title">
        {{ projectName }}
        <warning v-if="state_show(state)" />
      </div>
      <div class="table_add">
        <div class="btn">
          <el-button
            v-if="hasRolePermission('sale_add')"
            :disabled="state_show(state)"
            type="primary"
            @click="orderAdd"
          >创建订单</el-button>
          <!-- <el-button>场地时间安排</el-button> -->
        </div>
        <div class="search">
          <el-input
            v-model="keyword"

            prefix-icon="el-icon-search"
            placeholder="输入明细项名称或订单编号"
          />
          <el-button @click="get_orderList">查询</el-button>
          <el-button @click="reset">重置</el-button>
        </div>
      </div>
      <table-components :table-data="tableData" @operation="operation" />
      <pagination-page
        :total="total"
        :to="pageSize"
        :current-page="pageNum"
        @handleCurrentChange="handleCurrentChange"
      />
    </div>
    <DialogPage
      :dialog-show="dialogShow"
      width="600px"
      title=""
      @handleCancel="handleCancel"
    >
      <div class="delete">
        <div class="delete_title">确定删除此订单吗？</div>
        <div class="delete_tip">删除订单后此订单所生成的合同将全部清除，无法恢复</div>
        <div class="footBtn1">
          <el-button @click="handleCancel">取消</el-button>
          <el-button
            type="primary"
            @click="submitFrom"
          >确定</el-button>
        </div>
      </div>
    </DialogPage>
  </Layout>
</template>
<script>
import Layout from '@/components/base/Layout'
import DialogPage from '@/components/dialog/dialog'
import PaginationPage from '@/components/Pagination/index'
import TableComponents from '@/views/sale/components/table'
// import { color } from 'echarts/lib/export'
export default {
  name: 'Sale',
  components: { PaginationPage, TableComponents, DialogPage, Layout },
  data() {
    return {
      delete_id: '',
      dialogShow: false,
      search: '',
      pageNum: 1,
      pageSize: 10,
      total: 0,
      keyword: '',
      projectId: '',
      projectName: '',
      tableData: [],
      entrance: '', // （siteMarket--场地销售、shop--商铺管理）进入订单页面
      state: ''
    }
  },
  watch: {
    $route() {
      this.get_router_id()
    }
  },
  created() {
    this.get_router_id()
    this.get_orderList()
    this.set_getSiteMarketID()
  },
  methods: {
    //
    handleCancel() {
      this.dialogShow = false
    },
    state_show(val) {
      return val === 'RESCINDED'
    },
    // 项目详情
    set_getSiteMarketID() {
      this.$api.siteMarketList.getSiteMarketID(this.$route.params.id).then(res => {
        if (res) {
          this.state = res.state
        }
      })
    },
    //
    // 获取项目id
    get_router_id() {
      this.entrance = this.$route.query.entrance
      this.projectName = this.$route.params.type !== ':type' ? this.$route.params.type : '名字空了'
      this.projectId = this.$route.params.id !== ':id' ? this.$route.params.id : 1000
      // console.log(this.projectId)
    },
    // 重置
    reset() {
      this.keyword = ''
      this.pageNum = 1
      this.get_orderList()
    },
    // 创建订单
    orderAdd() {
      this.$router.push({ name: 'SaleAdd', params: { id: this.projectId, type: this.projectName }, query: { entrance: this.entrance }})
    },
    // 分页
    handleCurrentChange(val) {
      this.pageNum = val
      this.get_orderList()
    },
    // 列表数据
    get_orderList() {
      const json = {
        projectId: this.projectId,
        pageNum: this.pageNum,
        pageSize: this.pageSize
      }
      this.keyword !== '' ? (json['keyword'] = this.keyword) : ''
      this.$api.sale.orderList(json).then(res => {
        if (res) {
          this.tableData = res.list
          this.total = res.endRow
          this.pageNum = res.pageNum
          this.pageSize = res.pageSize
        }
      })
    },
    // 表格数据
    operation(val) {
      switch (val.type) {
        case '订单详情':
          this.$router.push({ name: 'saleDetails', params: { id: val.data.id }, query: { entrance: this.entrance }})
          break
        case '修改订单':
          this.$router.push({ name: 'saleEdit', params: { id: val.data.id, type: this.projectName }, query: { entrance: this.entrance, projectId: val.data.projectId }})
          break
        case '删除订单':
          this.delete_id = val.data.id
          this.dialogShow = true
          // this.$confirm('此操作将永久删除的订单明细的数据, 是否继续?', '提示', {
          //   confirmButtonText: '确定',
          //   cancelButtonText: '取消',
          //   type: 'warning'
          // })
          //   .then(() => {
          //     this.get_ordersDelete({ id: val.data.id })
          //   })
          //   .catch(() => {

          //   })
          break
      }
    },
    submitFrom() {
      this.get_ordersDelete({ id: this.delete_id })
    },
    get_ordersDelete(json) {
      this.$api.sale.ordersDelete(json).then(res => {
        if (res) {
          this.dialogShow = false
          this.$message.success('删除成功！')
          this.get_orderList()
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
@import "~@/styles/custom-theme.scss";
.delete{
  width: 100%;
  div{
    width: 100%;
    text-align: center;
    display: inline-table;
  }
  .delete_title{
    font-size: 16px;
    color: #000000;
    font-weight: 400;
    line-height: 32px;
  }
  .delete_tip{
    font-size: 12px;
    color: #999999;
    padding-bottom: 50px;
    border-bottom: 1px solid #E5E5E5;
  }
  .footBtn1{
    padding-top: 20px;
  }
}
.table {
  .pagination {
    margin-top: 24px;
  }
  .table_title {
    width: 100%;
    color: #000000;
    font-weight: 500;
    font-size: 18px;
    line-height: 25px;
    margin-bottom: 20px;
  }
  .table_add {
    width: 100%;
    display: flex;
    justify-content: space-between;
    .search {
      display: flex;
      justify-content: space-between;
      .el-input {
        width: 320px;
        margin-right: 10px;
      }
    }
  }
}
.form_new {
  .form_title {
    width: 100%;
    background: #fafafa;
    padding: 9px 4px 9px 15px;
    box-sizing: border-box;
    display: inline-table;
    height: 22px;
    line-height: 22px;
    position: relative;
    margin-bottom: 24px;
    .title_border {
      width: 4px;
      height: 16px;
      background: $--custom--color--primary;
      position: absolute;
      left: 5px;
      top: 11px;
    }
  }
  .el-form {
    width: 100%;
    display: inline-table;
    .el-form-item {
      width: 50%;
      float: left;
      ::v-deep .el-form-item__label {
        color: #000000;
        font-size: 14px;
        font-weight: 400;
      }
    }
  }
}
.footBtn {
  width: 100%;
  margin-top: 73px;
  display: inline-block;
  text-align: center;
  button {
    width: 96px;
  }
}
</style>
