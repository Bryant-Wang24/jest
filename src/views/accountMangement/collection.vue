<template>
  <Layout :use-head="true" :use-foot="false" :auto-height="true" :layout-style="{minWidth: '1600px'}">
    <!-- <div class="collection"> -->
    <div slot="head" class="pb-20">
      <RowText :background-color="'#FFF'" text="台账记录" :top="0" />
      <TablePager
        ref="TablePager"
        :data="tableData"
        border
        :is-pagination="false"
      >
        <el-table-column
          v-for="item in tableHeader"
          :key="item.key"
          :align="item.align || 'left'"
          show-overflow-tooltip
          :width="item.width"
          :prop="item.key"
          :label="item.label"
          :formatter="item.formatter"
          :resizable="false"
        />
      </TablePager>

      <Tips>注：此处仅可使用“可用余额”对订单进行收款，若要使用押金对订单进行收款，需前往“押金管理”中进行收款操作。</Tips>

    </div>
    <div class="collectionList">
      <el-tabs v-model="activeName" type="card">
        <el-tab-pane class="collection-tab" label="订单收款" name="first">
          <el-form class="searchList" :inline="true">
            <el-form-item label="选择项目">
              <el-select v-model="searchList.projectId" filterable placeholder="可检索">
                <WrapOption
                  v-for="(project) in projectOptions"
                  :key="project.projectId"
                  filterable
                  :label="project.projectName"
                  :value="project.projectId"
                  style="width:300px;"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="客户名称">
              <el-select
                v-model="searchList.customerId"
                disabled
                clearable
                placeholder="请选择"
              >
                <WrapOption
                  v-for="(customer,index) in customerOptions"
                  :key="index"
                  :label="customer.customerName"
                  :value="customer.id"
                />
              </el-select>
            </el-form-item>
            <el-button
              type="primary"
              @click="getOrders"
            >查询</el-button>
          </el-form>
          <TableItem :index="0" />
          <TableItem
            v-for="(item, index) in allTable"
            :key="index"
            :table-data="item"
            @getPayments="getPayments"
          />
          <div v-if="listShow" class="listShow">暂无数据</div>
        </el-tab-pane>
        <el-tab-pane class="collection-tab" label="收款记录" name="second">
          <CollectionRecord :table-data="paymentTableData" :customer-id="customerId" @recall="recall" />
        </el-tab-pane>
      </el-tabs>
    </div>
  <!-- </div> -->
  </Layout>
</template>

<script>
import Layout from '@/components/base/Layout'
import TablePager from '@/components/base/TablePager'
import Tips from '@/components/base/Tips'
import TableItem from './components/tableItem'
import RowText from '@/components/rowText'
import CollectionRecord from './components/CollectionRecord'
import WrapOption from '@/components/base/WrapOption'
const PAYEE_TYPE = { // 收款方式
  ORDER_PAYMENT_PLAN_ITEM: 'ORDER_PAYMENT_PLAN_ITEM', // 订单付款计划项
  DEPOSIT: 'DEPOSIT ' // 押金
}
export default {
  components: {
    Layout,
    TablePager,
    Tips,
    WrapOption,
    TableItem,
    RowText,
    CollectionRecord
  },
  data() {
    return {
      activeName: 'first',
      tableHeader: [
        { key: 'code', label: '台账编号', width: 200 },
        { key: 'customerName', label: '客户名称', width: 200 },
        { key: 'shortAccountName', label: '收款账户', width: 100 },
        { key: 'totalAmount', label: '收款总额', width: 120, align: 'right',
          formatter: (row) => {
            const { totalAmount } = row
            return `￥${totalAmount}`
          }
        },
        { key: 'usedAmount', label: '已用金额', width: 120, align: 'right',
          formatter: (row) => {
            const { usedAmount } = row
            return `￥${usedAmount}`
          }
        },
        { key: 'availableAmount', label: '可用余额', width: 120, align: 'right',
          formatter: (row) => {
            const { availableAmount } = row
            return `￥${availableAmount}`
          }
        },
        { key: 'depositAmount', label: '押金总额', width: 120, align: 'right',
          formatter: (row) => {
            const { depositAmount } = row
            return `￥${depositAmount}`
          }
        },
        { key: 'receiveTime', label: '到账日期', width: 200 },
        { key: 'remark', label: '备注' }
      ],
      searchList: {
        projectId: '',
        inOrderStatus: ['UNPAID', 'PARTIALLY_PAID'],
        orderType: 'NORMAL',
        customerId: '',
        accountId: '',
        page: {
          pageSize: '',
          pageNum: 1
        }
      },
      projectOptions: [],
      customerOptions: [],
      // tableData: [{ code: '123' }],
      tableData: [],
      allTable: [],
      listShow: false,
      paymentTableData: [], // 收款记录数据
      customerId: null // 当前台账客户id

    }
  },
  created() {
    this.getCustomer()
    this.getAccountInfo()
    // this.getProject()
  },

  methods: {
    // 撤回收款
    recall(id) {
      this.$api.account.recallPayment(id).then(res => {
        this.getAccountInfo()
        if (this.searchList.projectId) {
          this.getOrders()
        }
        this.$message.success('操作成功')
      })
    },
    getProject() {
      // const params = {}
      // this.$api.account.getProjectList(params).then(res => {
      //   this.projectOptions = res
      // })
      this.$api.account.getProjectList({ contractCustomerId: this.customerId }).then(res => {
        this.projectOptions = res.sort((a, b) => { return b.projectId - a.projectId })
      })
    },
    getCustomer() {
      const params = {
        customerSimple: { customerRequest: { state: 'APPROVED' }}
      }
      this.$api.account.getCustomerList(params).then(res => {
        this.customerOptions = res.reduce((acc, cur) => {
          if (cur) {
            acc.push(cur)
            return acc
          }
        }, [])
      })
    },
    getAccountInfo() {
      const { accountId } = this.$route.query
      this.$api.account.findAccountById(accountId).then(res => {
        this.customerId = res.customerId
        this.searchList.customerId = res.customerId
        this.searchList.accountId = res.receivableAccountId
        this.tableData = [res]
        this.getProject()
      })
      this.$api.account.getPaymentLog(accountId, { payeeType: PAYEE_TYPE.ORDER_PAYMENT_PLAN_ITEM }).then(res => {
        this.paymentTableData = res
      })
    },
    // isAuto 是否自动查询
    getOrders(isAuto = true) {
      const obj = JSON.stringify(this.searchList)
      const searchList = JSON.parse(obj)
      searchList['contractCustomerId'] = searchList.customerId
      delete searchList.customerId
      if (this.searchList.projectId !== '') {
        this.$api.account.getOrderList(searchList).then(res => {
          this.allTable = res.list && res.list.filter(item => { return item.paymentPlanGroups !== [] })
          if (this.allTable.length === 0) {
            this.listShow = true
            isAuto && this.$message.info('未查询到应收款的订单')
          } else {
            this.listShow = false
          }
        })
      } else {
        this.$message.warning('请选择项目')
      }
    },
    getPayments(item) {
      const params = {
        paymentPlanItemId: item.id,
        amount: item.num,
        standingBookId: this.$route.query.accountId
      }
      this.$api.account.getPayments(params).then(() => {
        this.$message.success('收款成功')
        item.num = ''
        this.getOrders(false)
        this.getAccountInfo()
      })
    }
  }
}
</script>

<style lang='scss' scoped>
.collection {

  .title {
    font-size: 18px;
    color: #000;
    margin-bottom: 20px;
    font-weight: 700;
  }
  .topList {
    margin: 20px;
    padding: 20px;
    background: #fff;
    .topnav {
      margin-bottom: 10px;
    }
  }
  .collectionList {
    margin: 20px;
    padding: 20px;
    background: #fff;
    .collection-tab {
      padding: 5px 20px 0 20px;
      .listShow {
        text-align: center;
        line-height: 30px;
        font-size: 14px;
        color: #666666;
        margin-top: 20px;
      }
    }
    .searchList {
      ::v-deep .el-form-item {
        width: 350px;
      }
      ::v-deep .el-input {
        width: 280px;
      }
    }
  }
}
</style>
