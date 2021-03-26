<template>
  <Layout class="shopAddPage" :use-head="false" :use-foot="false" :auto-height="true">
    <!-- <div class="content_new"> -->
    <div class="table">
      <div class="table_title">{{ projectName }}</div>
      <table-components :table-data="tableData" @operation="operation" />
      <pagination-page
        :total="total"
        :to="pageSize"
        :current-page="pageNum"
        @handleCurrentChange="handleCurrentChange"
      />
    </div>
    <dialog-page :dialog-show="dialogShow" width="41.67%" title="收款记录" @handleCancel="handleCancel">
      <div>
        <table-page
          :table-loading="tableLoading"
          :table-data="recordList"
          :table-header="tableHeader"
        />
        <div class="footBtn">
          <el-button @click="handleCancel">确定</el-button>
        </div>
      </div>
    </dialog-page>

    <!-- </div> -->
  </Layout>
</template>
<script>
import Layout from '@/components/base/Layout'
import DialogPage from '@/components/dialog/dialog'
import TablePage from '@/components/table/table'
import PaginationPage from '@/components/Pagination/index'
import TableComponents from '@/views/shop/components/table'
import pageMixin from '@/views/mixins/page'
import moment from 'moment'
export default {
  // name: 'Sale',
  components: { Layout, PaginationPage, TableComponents, DialogPage, TablePage },
  mixins: [pageMixin],
  data() {
    return {
      // obj: {
      //   overflow: 'auto',
      //   height: document.documentElement.clientHeight - 125 + 'px'
      // },
      search: '',
      pageNum: 1,
      pageSize: 10,
      total: 0,
      keyword: '',
      projectId: '',
      projectName: '',
      tableData: [],
      dialogShow: false,
      tableLoading: false,
      recordList: [],
      tableHeader: [
        { key: 'createDate', text: '收款时间', minWidth: '160' },
        { key: 'operatorName', text: '操作人', minWidth: '100' },
        { key: 'amount', text: '收款金额', minWidth: '120', align: 'right' },
        { key: 'payerNo', text: '来源台账/押金', minWidth: '160' }
      ]

    }
  },
  watch: {
    // $route() {
    //   this.get_router_id()
    // }
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      const { projectName } = this.$route.query
      const { id } = this.$route.params
      this.projectName = projectName
      this.projectId = id

      this.getOrderList()
    },
    judgeTime(data) {
      if (!data) return 0
      var date = data.toString()
      var year = date.substring(0, 4)
      var month = date.substring(4, 6)
      var day = date.substring(6, 8)
      var d1 = new Date(year + '/' + month + '/' + day)
      var dd = new Date()
      var y = dd.getFullYear()
      var m = dd.getMonth() + 1
      var d = dd.getDate()
      var d2 = new Date(y + '/' + m + '/' + d)
      var iday = parseInt(d2 - d1) / 1000 / 60 / 60 / 24
      return iday
    },
    handleCancel() {
      this.dialogShow = false
    },
    // 分页
    handleCurrentChange(val) {
      this.pageNum = val
      this.getOrderList()
    },
    // 列表数据
    getOrderList() {
      const json = {
        projectId: this.projectId,
        page: {
          pageNum: this.pageNum,
          pageSize: this.pageSize
        }
      }
      this.$api.shop.paymentPlansList(json).then(res => {
        if (res) {
          var arr = res.list
          for (var i in arr) {
            var order_children = []
            var paymentPlanGroups = arr[i].paymentPlanGroups
            for (var j in paymentPlanGroups) {
              var items = paymentPlanGroups[j].items
              for (var n in items) {
                // debugger
                var num = this.judgeTime(items[n]?.payDate?.replace(/-|T|:/g, ''))
                var overdue = (Number(items[n].amount) * 0.004 * num).toFixed(2)
                order_children.push({
                  order: items[n].order,
                  id: items[n].id,
                  amount: items[n].amount,
                  visible: false,
                  payDate_num: num,
                  proportion: 0.4,
                  payState_name: items[n].payState === 'UNPAID' ? '未付款' : items[n].payState === 'PARTIAL_PAID' ? '部分付款' : '已付款',
                  payState: items[n].payState,
                  payIdNum: items[n].payIdNum,
                  name: items[n].name,
                  paidAmount: items[n].paidAmount,
                  receivableBalance: items[n].receivableBalance,
                  payDate: items[n].payDate ? moment(items[n].payDate).format('YYYY-MM-DD') : '',
                  remarks: items[n].remarks,
                  payDate_nums: num,
                  overdue: overdue
                })
              }
            }
            arr[i]['order_children'] = order_children.sort((a, b) => {
              return Number(a.order) - Number(b.order)
            })
          }
          this.tableData = arr
          this.total = res.endRow
          this.pageNum = res.pageNum
          this.pageSize = res.pageSize
        }
      })
    },
    // 表格数据
    operation(val) {
      console.log(val)
      switch (val.type) {
        case '订单编号':
          this.$router.push({ name: 'saleDetails', params: { id: val.data.id }, query: { entrance: 'shop' }})
          break
        case '收款记录':
          this.dialogShow = true
          this.get_paymentPlansListId(val.data.id)
          break
      }
    },
    get_paymentPlansListId(id) {
      this.tableLoading = true
      this.$api.shop.paymentPlansListId({ id: id }).then(res => {
        if (res) {
          this.tableLoading = false
          var list = res
          this.recordList = list
        }
      })
    }

  }
}
</script>
<style lang="scss" scoped>
@import "~@/styles/custom-theme.scss";
.table_new{
  ::v-deep .el-table{
    border-top:1px solid #E7EAEC;
    border-left:1px solid #E7EAEC;
    th,td{
      border-right:1px solid #E7EAEC;
    }
  }
}
.footBtn{
  width: 100%;
  text-align: center;
}

.table {
  width: 100%;
  padding: 20px;
  box-sizing: border-box;
  background: white;
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
