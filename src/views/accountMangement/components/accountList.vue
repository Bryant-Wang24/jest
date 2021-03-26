<template>
  <div class="accountContain">

    <FilterForm ref="FilterForm" :customer-options="customerOptions" :receive-account-options="receiveAccountOptions" :surplus-options="surplusOptions" @searchAccount="searchAccount" @reset="reset" />

    <div v-loading="loading" class="accountList">
      <TablePager
        ref="TablePager"
        :data="tableData"
        :total="page.total"
        :to="page.pageSize"
        :current-page="page.pageNum"
        border
        @page="handleCurrentChange"
      >
        <el-table-column
          v-for="item in tableHeader"
          :key="item.key"
          show-overflow-tooltip
          :resizable="false"
          :prop="item.key"
          :label="item.text"
          :formatter="item.formatter"
          :width="item.width"
          :align="item.align || 'left'"
        />
        <el-table-column :resizable="false" label="操作" fixed="right" :width="260">
          <template slot-scope="scope">
            <el-button type="text" @click="catDialog(scope.row)">查看</el-button>
            <el-button
              v-if="scope.row.totalAmount === scope.row.availableAmount && hasRoleUserPermission('AccountManage_edit', scope.row.createBy ? scope.row.createBy.id : null)"
              type="text"
              @click="editDialog(scope.row)"
            >修改</el-button>
            <el-button
              v-if="hasRolePermission('AccountManage_pay')"
              type="text"
              @click="goToCollection(scope.row.id)"
            >订单收款</el-button>
            <el-button
              v-if="scope.row.totalAmount === scope.row.availableAmount && hasRoleUserPermission('AccountManage_delete', scope.row.createBy ? scope.row.createBy.id : null)"
              type="text"
              @click="deleteAccount(scope.row)"
            >删除</el-button>
          </template>
        </el-table-column>
      </TablePager>
    </div>

    <el-dialog :title="dialogTitle" :visible.sync="dialogForm" class="editForm">
      <!-- 编辑弹框 -->
      <EditForm v-if="isEdit && dialogForm" ref="editForm" :form-data.sync="formData" :receive-account-options="receiveAccountOptions" :customer-options="customerOptions" :rece-type="receType" />
      <!-- 台账详情弹框 -->
      <AccountDetail v-else-if="dialogForm" :form-data="formData" :record-data="recordData" :activities="activities" />
      <!-- 底部操作区 -->
      <div v-show="isEdit" slot="footer" class="dialog-footer" style="text-align:center">
        <el-button type="primary" @click="editAccount">确 定</el-button>
        <el-button @click="dialogForm = false">取 消</el-button>
      </div>
      <div v-show="!isEdit" slot="footer" class="dialog-footer" style="text-align:center">
        <el-button @click="dialogForm = false">关闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { ACTION, SURPLUS_OPTIONS, TYPE, RECE_TYPE } from '@/common/account'
import { deepClone } from '@/utils/index'
import FilterForm from './FilterForm'
import TablePager from '@/components/base/TablePager'
import AccountDetail from './AccountDetail'
import EditForm from './EditForm'

export default {
  components: {
    TablePager,
    FilterForm,
    AccountDetail,
    EditForm
  },
  data() {
    return {
      ACTION,
      loading: false,
      TYPE,
      reverse: true,
      recordData: [],
      activities: [],
      dialogTitle: '修改台账',
      dialogForm: false,
      isEdit: true,
      page: {
        pageNum: 1,
        pageSize: 10,
        total: 0
      },
      formData: {
        id: '',
        customerId: '',
        paymentType: '',
        receivableAccountId: '',
        totalAmount: '',
        receiveTime: '',
        remark: ''
      },
      tableHeader: [
        {
          key: 'code',
          text: '台账编号',
          width: 200
        },
        {
          key: 'customerName',
          text: '客户名称',
          width: 200
        },
        {
          key: 'shortAccountName',
          text: '收款账户',
          width: 100
        },
        {
          key: 'totalAmount',
          text: '收款总额',
          width: 100,
          align: 'right',
          formatter: (row) => {
            return `￥${row.totalAmount}`
          }
        },
        {
          key: 'availableAmount',
          text: '可用余额',
          width: 100,
          align: 'right',
          formatter: (row) => {
            return `￥${row.availableAmount}`
          }
        },
        {
          key: 'receiveTime',
          text: '到账日期',
          width: 100
        },
        {
          key: 'remark',
          text: '备注'
        },
        {
          key: 'name',
          text: '录入人',
          width: 100,
          formatter: (row) => {
            return row.createBy ? row.createBy.name : ''
          }
        },
        {
          key: 'createDate',
          text: '录入时间',
          width: 180
        }
      ],
      tableData: [],
      customerParams: {
        customerSimple: {
          constructCompany: {
            companyName: ''
          },
          customerRequest: { state: 'APPROVED' }
        }
      },
      customerOptions: [],
      surplusOptions: SURPLUS_OPTIONS,
      receiveAccountOptions: [],
      receType: RECE_TYPE
    }
  },
  mounted() {
    this.getAccountList()
    this.getCustomerList()
    this.getReceiveAccountOptions()
  },

  methods: {
    getFilterFromParams() {
      return this.$refs.FilterForm.getSearchList()
    },
    getAccountList() {
      this.loading = true
      const { pageNum, pageSize } = this.page
      const params = {
        ...this.getFilterFromParams(),
        pageNum,
        pageSize
      }

      this.$api.account.getAccountList(params).then((res) => {
        this.tableData = res.list
        this.page.total = res.total
        setTimeout(() => {
          this.loading = false
        }, 300)
      })
    },
    editDialog(account) {
      const _account = deepClone(account)
      this.dialogTitle = '修改台账'
      this.isEdit = true
      this.formData = _account
      this.dialogForm = true
    },
    catDialog(account) {
      this.dialogTitle = '查看详情'
      this.isEdit = false
      this.formData = account
      this.dialogForm = true
      this.getOperatinLog(account.id)
      this.getUsageRecord(account.id)
    },
    editAccount() {
      this.$refs['editForm'].validate((valid) => {
        if (valid) {
          this.editAccountInfo()
        } else {
          this.$message.error('请按要求填写内容')
          return false
        }
      })
    },
    editAccountInfo() {
      const accountId = this.formData.id
      const accountInfo = {
        customerId: this.formData.customerId,
        paymentType: this.formData.paymentType,
        receivableAccountId: this.formData.receivableAccountId,
        totalAmount: this.formData.totalAmount,
        receiveTime: this.formData.receiveTime,
        remark: this.formData.remark
      }
      this.$api.account.editAccount(accountId, accountInfo).then((res) => {
        this.$message.success('台账修改成功')
        this.getAccountList()
      })
      this.dialogForm = false
    },
    deleteAccount(account) {
      const accountId = account.id
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.$api.account.deleteAccount(accountId).then(() => {
            this.getAccountList()
            this.$message.success('删除成功')
          })
        })
        .catch(() => {
        })
    },
    handleCurrentChange(page) {
      this.page.pageNum = page.currentPage
      this.getAccountList()
    },
    searchAccount() {
      // 查询时默认初始化页码为1
      this.page.pageNum = 1
      this.getAccountList()
    },
    getCustomerList() {
      this.$api.account.findCustomerAccount(this.customerParams).then((res) => {
        this.customerList = res

        const customerOptions = this.customerList.map((item, index) => {
          return {
            label: item.customerName,
            value: item.id
          }
        })
        this.customerOptions = customerOptions
      })
    },
    getReceiveAccountOptions() {
      const name = ''
      this.$api.account.getReceAccount(name).then((res) => {
        const receiveAccountOptions = res.map((item) => {
          if (item.name && item.abbreviation) {
            return {
              value: item.id,
              label: item.abbreviation
            }
          }
        })
        this.receiveAccountOptions = receiveAccountOptions
      })
    },
    goToCollection(accountId) {
      this.$router.push({
        name: 'collection',
        query: {
          accountId
        }
      })
    },
    reset() {
      this.page.pageNum = 1
      this.getAccountList()
    },
    getOperatinLog(id) {
      this.$api.account.getOperationLog(id).then(res => {
        this.activities = deepClone(res).map(item => {
          item.timestamp = item.createDate
          return item
        }).reverse()
      })
    },
    // 台账使用记录
    getUsageRecord(id) {
      this.$api.account.getPaymentLog(id).then(res => {
        this.recordData = res
      })
    }
  }
}
</script>

<style lang='scss' scoped>
.rowText {
  margin: 20px 0;
}
.accountContain {
  // padding: 0 20px;
  .pagination{
    margin-top: 20px;
  }
  .editForm{
    ::v-deep .el-form{
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
    }
  }
  .remarks {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .catAccount {
    .accountInfo {
      .title {
        font-size: 16px;
        margin-bottom: 30px;
        color: #000;
        padding-left: 10px;
        border-left: 4px solid black;
      }
      .accountBase {
        display: flex;
        flex-wrap: wrap;
        .name {
          margin-left: 10px;
          margin-top: 10px;
          width: 48%;
          font-size: 14px;
          color: #666;
          span {
            color: #000;
          }
        }
      }
    }
    .opreateRecords{
       .title {
        font-size: 16px;
        margin: 30px 0px;
        color: #000;
        padding-left: 10px;
        border-left: 4px solid black;
      }
    }
    .operateLog {
      .content {
        display: flex;
        flex-direction: column;
        .title {
          margin-bottom: 10px;
        }
        .text {
          color: #666;
          line-height: 24px;
        }
      }
      // .logTitle {
      //   font-size: 16px;
      //   margin: 30px 0px;
      //   color: #000;
      //   padding-left: 10px;
      //   border-left: 4px solid black;
      // }
    }
    .log{

font-size: 14px;
font-family: PingFang SC;
font-weight: 400;
line-height: 20px;
color: #666666;
opacity: 1;
.title{
  color:#000000;
  margin-bottom:10px;
}
    }
  }
  .bottomPage {
    margin-top: 10px;
    display: flex;
    justify-content: space-between;
  }
}
</style>
