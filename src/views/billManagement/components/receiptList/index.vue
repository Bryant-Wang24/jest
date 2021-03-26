<template>
  <div class="recsiptList">
    <ReceiptDialog
      v-if="receiptVisible"
      :receipt-info="receiptInfo"
      :is-confirm="isConfirm"
      :receipt-visible.sync="receiptVisible"
      @getReceiptList="getReceipt"
      @changeDialog="receiptVisible = false"
    />
    <ReceiptFilterForm :search-list.sync="searchList" :project-options="projectOptions" :company-list="companyList" :customer-options="customerOptions" @searchReceipt="searchReceipt" @resetSearch="resetSearch" />

    <div class="btnList">
      <el-button v-if="hasRolePermission('applayReceipt_application')" type="primary" @click="goToApplay(0)">申请收据</el-button>
      <el-radio-group v-model="fastFilterRadio" style="float:right" @change="fastFilterChange">
        <el-radio-button :label="RADIO.ALL">全部</el-radio-button>
        <el-radio-button :label="RADIO.PENDING">待我审核</el-radio-button>
        <el-radio-button :label="RADIO.COMPLETE">我已审核</el-radio-button>
      </el-radio-group>
    </div>

    <TablePager
      ref="TablePager"
      v-loading="loading"
      border
      :data="tableData"
      :total="page.total"
      :to="page.pageSize"
      :current-page="page.pageNum"
      @page="handleCurrentChange"
    >
      <el-table-column
        v-for="item in tableHeader"
        :key="item.key"
        :align="item.align"
        show-overflow-tooltip
        :resizable="false"
        :prop="item.key"
        :label="item.label"
        :width="item.width"
        :formatter="item.formatter"
      />
      <el-table-column :resizable="false" label="操作" width="190px">
        <template slot-scope="scope">
          <div v-if="scope.row.checkState === 'REVIEW'">
            <el-button type="text" @click="goToCat(1, scope.row.id)">查看</el-button>
            <el-button v-show="isApprovalAuth(scope.row.currentApproverId)" type="text" @click="goToCat(0, scope.row.id)">审核</el-button>
          </div>
          <div v-else-if="scope.row.checkState === 'PASSED'">
            <div v-if="scope.row.receiptState === 'NORECEIPT'">
              <el-button
                type="text"
                @click="goToCat(1, scope.row.id)"
              >查看</el-button>
              <el-button
                v-if="hasRolePermission('applayReceipt_confirm')"
                type="text"
                @click="showDialog(true,scope.row)"
              >确认已开据</el-button>
              <el-button v-if="hasRolePermission('applayReceipt_void')" type="text" @click="showCancel(scope.row.id, 'CANCEL')">作废</el-button>
            </div>
            <div v-else-if="scope.row.receiptState === 'RECEIPTED'">
              <el-button
                type="text"
                @click="goToCat(1, scope.row.id)"
              >查看</el-button>
              <el-button v-if="hasRolePermission('applayReceipt_recycle')" type="text" @click="showDialog(false,scope.row)">回收收据</el-button>
              <el-button v-if="hasRolePermission('applayReceipt_void')" type="text" @click="showCancel(scope.row.id, 'CANCEL')">作废</el-button>
            </div>
            <div v-else>
              <el-button type="text" @click="goToCat(1, scope.row.id)">查看</el-button>
            </div>
          </div>
          <div v-else-if="scope.row.checkState === 'REJECTED'">
            <div v-if="scope.row.receiptState === 'NORECEIPT'">
              <el-button type="text" @click="goToCat(1, scope.row.id)">查看</el-button>
              <el-button
                v-if="hasRoleUserPermission('contract_void', scope.row.createBy ? scope.row.createBy.id : null)"
                type="text"
                @click="goToApplay(1, scope.row.id)"
              >修改</el-button>
              <el-button type="text" @click="showCancel(scope.row.id, 'CANCELED')">取消申请</el-button>
            </div>
          </div>
          <div v-else-if="scope.row.checkState === 'CANCELED' && hasRoleUserPermission('applayReceipt_cancel', scope.row.createBy ? scope.row.createBy.id : null)">
            <el-button type="text" @click="goToCat(1, scope.row.id)">查看</el-button>
          </div>
          <div v-else>
            <el-button
              type="text"
              @click="goToCat(1, scope.row.id)"
            >查看</el-button>
          </div>
        </template>
      </el-table-column>
    </TablePager>
  </div>
</template>

<script>
// import { State } from '../minxis/state'
import ReceiptDialog from './receiptDialog'
import ReceiptFilterForm from './ReceiptFilterForm'
// import PaginationPage from '@/components/Pagination/index'
import TablePager from '@/components/base/TablePager'
import { isApprovalAuth } from '@/common/approve'
import { mapGetters, mapState } from 'vuex'
import { CHECK_STATE, RECEIPT_STATE } from '@/common/bill'

const RADIO = {
  ALL: 'ALL',
  PENDING: 'PENDING',
  COMPLETE: 'COMPLETE'
}

export default {
  components: {
    ReceiptDialog,
    // PaginationPage,
    ReceiptFilterForm,
    TablePager
  },
  // mixins: [State],
  data() {
    return {
      RADIO,
      fastFilterRadio: RADIO.ALL,
      loading: false,
      isApprovalAuth, // 审批流权限判断
      tableHeader: [
        { key: 'applyCode', label: '申请编号', width: 150 },
        { key: 'projectName', label: '项目名称' },
        { key: 'customer', label: '客户名称' },
        { key: 'receiptOffice', label: '开收据方', width: 80,
          formatter: (row) => {
            const { receiptOffice } = row
            return this.formatInvoiceOffice(receiptOffice) || '-'
          }
        },
        { key: 'receiptAmount', label: '开收据金额', width: 100, align: 'right',
          formatter: (row) => {
            const { receiptAmount } = row
            return `￥${receiptAmount}`
          }
        },
        { key: 'checkState', label: '审核状态', width: 90,
          formatter: (row) => {
            const { checkState } = row
            return CHECK_STATE[checkState] || '-'
          }
        },
        { key: 'receiptState', label: '收据状态', width: 90,
          formatter: (row) => {
            const { receiptState } = row
            return RECEIPT_STATE[receiptState] || '-'
          }
        },
        { key: 'createName', label: '申请人', width: 100 },
        { key: 'createDate', label: '申请时间', width: 180 }
      ],
      page: {
        pageSize: 10,
        pageNum: 1,
        total: 0
      },
      searchList: {
        applyCode: '',
        projectName: '',
        customer: '',
        receiptOffice: null,
        checkState: null,
        receiptState: null

        // applyName:"",
        // applyTime:"",
        // receiptAmount:""
      },
      tableData: [],
      receiptVisible: false,
      // companyList: [],
      // projectOptions: [],
      // customerOptions: [],
      receiptInfo: '',
      isConfirm: false
    }
  },
  computed: {
    ...mapState({
      projectOptions: state => state.bill.projectOptions,
      customerOptions: state => state.bill.customerOptions,
      companyList: state => state.bill.companyList
    }),
    ...mapGetters({
      userInfo: 'userInfo'
    })
  },
  created() {
    // 获取收据列表
    this.getReceipt()
  },
  methods: {
    fastFilterChange() {
      this.getReceipt()
    },
    handleCurrentChange(page) {
      // console.log(num)
      this.page.pageNum = page.currentPage
      this.getReceipt()
    },
    goToApplay(isEdit, receiptId) {
      switch (isEdit) {
        case 0:

          this.$router.push({
            name: 'ApplayReceiptForm',
            query: { isEdit, receiptId }
          })
          break
        case 1:

          this.$router.push({
            name: 'EditReceiptForm',
            query: { isEdit, receiptId }
          })
          break

        default:
          break
      }
      // this.$router.push({
      //   name: 'ApplayReceiptForm',
      //   query: {
      //     isEdit,
      //     receiptId
      //   }
      // })
    },
    goToCat(isCat, receiptId) {
      this.$router.push({
        name: 'catReceipt',
        query: {
          isCat,
          receiptId
        }
      })
    },
    showDialog(isConfirm, receipt) {
      this.receiptVisible = true
      this.receiptInfo = receipt
      this.isConfirm = isConfirm
    },
    confirmReceipt(id) {
      // this.receiptVisible = true;
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.trailInvoice(id)
        this.getReceipt()
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
      }).catch(() => {
      })
    },
    getReceipt() {
      this.loading = true
      const { pageNum, pageSize } = this.page
      const params = { ...this.searchList, pageNum, pageSize }
      const { id } = this.userInfo
      switch (this.fastFilterRadio) {
        case RADIO.PENDING:
          params.currentPendingApproverId = id
          // params.checkState = 'REVIEW'
          break

        case RADIO.COMPLETE:
          params.approvedApprovalNodeUserId = id
          break

        default:
          break
      }
      this.$api.billApi.getReceiptList(params).then((res) => {
        this.page.total = res.total ? res.total : 0
        this.tableData = res.list ? res.list : []
        this.loading = false
        // this.tableData= [{}]
      }).catch(err => {
        this.$message.error(err.statusText)
      })
    },
    // 作废收据
    cancelReceipt(id) {
      this.$api.billApi.trailReceiptCancel(id).then(() => {
        this.getReceipt()
      }).catch(err => {
        this.$message.error(err.statusText)
      })
    },
    // 作废/取消弹窗
    showCancel(id, type) {
      const html = {
        'CANCELED': '是否确定取消该申请?',
        'CANCEL': '此操作将永久作废该条收据, 是否继续?'
      }
      this.$confirm(html[type], '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        switch (type) {
          case 'CANCEL':
            this.$api.billApi.trailReceiptCancel(id).then(res => {
              this.getReceipt()
              this.$message({ type: 'success', message: '操作成功!' })
            })
            break
          case 'CANCELED':
            this.$api.billApi.cancelReceipt(id).then(res => {
              this.getReceipt()
              this.$message({ type: 'success', message: '操作成功!' })
            })
            break

          default:
            break
        }
        // this.cancelReceipt(id)
        // this.$message({
        //   type: 'success',
        //   message: '作废成功!'
        // })
      }).catch(() => {
      })
    },
    searchReceipt() {
      this.page.pageSize = 10
      this.page.pageNum = 1
      this.getReceipt()
    },
    resetSearch() {
      this.page.pageSize = 10
      this.page.pageNum = 1
      this.getReceipt()
    },

    formatInvoiceOffice: function(office) {
      let company = ''
      if (this.companyList.length !== 0) {
        this.companyList.map(item => {
          if (item.id === Number(office)) {
            company = item.companyAbbreviation
          }
        })
      }
      return company
    }
  }
}
</script>

<style lang='scss' scoped>
.recsiptList {
    margin-top: 10px;
   .remarks {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .searchList {
    display: flex;
    flex-wrap: wrap;
    // ::v-deep .el-form-item {
    //   width: 28%;
    //   margin-right: 20px;
    // }
    // .searchBtn{
    //   // text-align: right;
    //   // flex-wrap: nowrap;
    //   // flex: 1;
    // }
  }
  .btnList {
    margin: 20px 0;
  }
  .bottomPage {
    margin-top: 10px;
    display: flex;
    justify-content: space-between;
  }
}
// .searchList {
//   ::v-deep .el-form-item {
//     margin-right: 20px;
//   }
// }
</style>
