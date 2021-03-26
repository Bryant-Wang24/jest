<template>
  <div class="invoiceList">
    <InvoiceDialog
      v-if="dialogVisible"
      ref="invoice"
      :dialog-visible="dialogVisible"
      :is-flag-obj="isFlagObj"
      :invoice-info="invoiceInfo"
      @handleClose="handleClose"
    />
    <InvoiceFilterForm :search-list.sync="searchList" :project-options="projectOptions" :company-list="companyList" @searchInvoice="searchInvoice" />

    <div class="btnList mb-20">
      <el-button v-if="hasRolePermission('applayForm_application')" type="primary" @click="goToApplay(0)">申请发票</el-button>
      <el-dropdown trigger="click" style="margin:0 10px" @command="handleCommand">
        <el-button>
          批量导出...
        </el-button>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="发票Excel">发票Excel</el-dropdown-item>
          <el-dropdown-item command="发票申请表">发票申请表</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <!-- <el-button type="plain" @click="exportInvoice">导出</el-button> -->
      <el-button v-if="hasRolePermission('applayForm_import')" type="plain" @click="importInvoice">导入发票</el-button>
      <el-button v-if="hasRolePermission('applayForm_pass')" type="plain" @click="batchPass">批量通过</el-button>
      <el-radio-group v-model="fastFilterRadio" style="float:right" @change="fastFilterChange">
        <el-radio-button :label="RADIO.ALL">全部</el-radio-button>
        <el-radio-button :label="RADIO.PENDING">待我审核</el-radio-button>
        <el-radio-button :label="RADIO.COMPLETE">我已审核</el-radio-button>
      </el-radio-group>
    </div>

    <TablePager
      ref="multipleTable"
      v-loading="loading"
      border
      :row-key="rowKey"
      :data="tableData"
      :total="total"
      :to="page.pageSize"
      :current-page="page.pageNum"
      @page="handleCurrentChange"
      @selection-change="handleSelectionChange"
    >
      <el-table-column :resizable="false" type="selection" :reserve-selection="true" width="55" />
      <el-table-column
        v-for="item in tableHeader"
        :key="item.key"
        align="left"
        show-overflow-tooltip
        :resizable="false"
        :prop="item.key"
        :label="item.text"
        :width="item.width"
        :formatter="item.formatter"
      />
      <el-table-column :resizable="false" label="操作" min-width="190" fixed="right">
        <template slot-scope="scope">
          <el-button v-if="hasRoleUserPermission('applayForm_cancel', scope.row.createBy ? scope.row.createBy.id : null)" type="text" @click="goToCat(1,scope.row.id)">查看</el-button>
          <el-button v-if="scope.row.checkState === 'REVIEW'" v-show="isApprovalAuth(scope.row.currentApproverId)" type="text" @click="goToCat(false,scope.row.id)">审核</el-button>
          <el-button
            v-if="hasRoleUserPermission('contract_void', scope.row.createBy ? scope.row.createBy.id : null) &&scope.row.checkState === 'REJECTED'"
            type="text"
            @click="goToApplay(1, scope.row.id)"
          >修改</el-button>
          <el-button v-if="scope.row.checkState === 'REJECTED'" type="text" @click="showCancel(scope.row.id, 'CANCELED')">取消申请</el-button>

          <el-dropdown v-if="isShowMore(scope.row)" trigger="click" placement="bottom">
            <span class="el-dropdown-link">更多</span>
            <el-dropdown-menu slot="dropdown">

              <el-dropdown-item @click.native="toBillEdit(scope.row.id)">
                <!-- <el-button v-if="scope.row.checkState === 'PASSED'" type="text" @click="toBillEdit(scope.row.id)">查看申请表</el-button> -->
                <el-button v-if="isShowApplyBtn(scope.row)" type="text" style="display:block;">查看申请表</el-button>
              </el-dropdown-item>
              <el-dropdown-item @click.native="confirmInvoice(scope.row)">
                <el-button
                  v-if="isShowConfirm(scope.row)"
                  type="text"
                  style="display:block;"
                >确认已开票</el-button>
              </el-dropdown-item>
              <el-dropdown-item @click.native="showCancel(scope.row.id, 'CANCEL')">
                <el-button v-if="isShowCancel(scope.row)" type="text">作废</el-button>
              </el-dropdown-item>

            </el-dropdown-menu>
          </el-dropdown>
        </template>
      </el-table-column>
    </TablePager>
  </div>
</template>

<script>
import { isApprovalAuth, batchPass } from '@/common/approve'
import InvoiceDialog from './invoiceDialog'
import InvoiceFilterForm from './InvoiceFilterForm'
import TablePager from '@/components/base/TablePager'
import base from '@/api/base'
import { CHECK_STATE, RADIO, isShowApplyBtn, isShowConfirm, isShowCancel, isShowMore, INVOICE_STATE, CONTENT_OPTIONS_TYPE_ZH } from '@/common/bill'
import { mapGetters, mapState } from 'vuex'
import { INVOICE_TYPE_OBJECT } from '@/common/customerMsg'

export default {
  components: {
    InvoiceDialog,
    TablePager,
    InvoiceFilterForm
  },
  data() {
    return {
      isShowApplyBtn,
      isShowConfirm,
      isShowCancel,
      isShowMore,
      RADIO,
      INVOICE_STATE,
      fastFilterRadio: RADIO.ALL,
      loading: false,
      isApprovalAuth,
      base: base,
      tableHeader: [
        { key: 'applyCode', text: '申请编号', width: 160 },
        { key: 'projectName', text: '项目名称', width: 160 },
        { key: 'invoiceTitle', text: '发票抬头', width: 200 },
        { key: 'invoiceType', text: '发票类型', width: 140,
          formatter: (row) => {
            const { invoiceType } = row
            return INVOICE_TYPE_OBJECT[invoiceType] || '-'
          }
        },
        { key: 'invoiceOffice', text: '开票单位',
          formatter: (row) => {
            const { invoiceOffice } = row
            let company = ''
            if (this.companyList.length !== 0) {
              this.companyList.map(item => {
                if (item.id === invoiceOffice) {
                  company = item.companyAbbreviation
                }
              })
            }
            return company
          }
        },
        { key: 'invoiceContent', text: '开票内容', width: 120,
          formatter: (row) => {
            const { invoiceContent } = row
            return CONTENT_OPTIONS_TYPE_ZH[invoiceContent] || '-'
          }
        },
        { key: 'invoiceAmount', text: '开票金额', width: 120, align: 'right',
          formatter: (row) => {
            const { invoiceAmount } = row
            return `￥${invoiceAmount}`
          }
        },
        { key: 'checkState', text: '审核状态',
          formatter: (row) => {
            const { checkState } = row
            return CHECK_STATE[checkState]
          }
        },
        { key: 'invoiceState', text: '开票状态',
          formatter: (row) => {
            const { invoiceState } = row
            return INVOICE_STATE[invoiceState] || '-'
          }
        },
        { key: 'createName', text: '申请人', width: 140 },
        { key: 'createDate', text: '申请时间', width: 190 }
      ],
      searchList: {
        applyCode: '',
        projectName: '',
        invoiceTitle: '',
        invoiceOffice: null,
        invoiceType: null,
        checkState: null,
        invoiceState: null
      },
      page: {
        pageSize: 10,
        pageNum: 1
      },
      // projectOptions: [],
      // customerOptions: [],
      // companyList: [],
      total: 0,
      tableData: [],
      dialogVisible: false,
      isFlagObj: {
        isApplay: true,
        dialogTitle: '确认已开票',
        info: {
          isRight: true,
          message: 'isFlagObj'
        },
        multipleSelection: [],
        // selectionIds: [],
        exportIds: []
      },
      // checkArr: CHECK_STATE_ARRAY,
      getRowKeys: '',
      invoiceInfo: '',
      multipleSelection: []
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
  watch: {
    searchList: function() {
      this.setSelect()
    },
    page: function() {
      this.setSelect()
    }
  },
  created() {
    this.getInvoiceList()
  },
  methods: {
    fastFilterChange() {
      this.$refs.multipleTable.clearSelection()
      this.multipleSelection = []
      this.getInvoiceList()
    },
    // 批量导出
    handleCommand(command) {
      this.exportInvoice(command)
    },
    toBillEdit(id) {
      this.$router.push({
        name: 'billEdit',
        params: {
          id: id
        }
      })
    },
    handleClose() {
      this.dialogVisible = false
      this.getInvoiceList()
    },
    handleCurrentChange({ currentPage }) {
      this.page.pageNum = currentPage
      this.getInvoiceList()
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
      // this.selectionIds = val.reduce((acc, cur) => {
      //   acc.push(`ids=${cur.id}`)
      //   return acc
      // }, [])
      this.exportIds = val.reduce((acc, cur) => {
        acc.push(cur.id)
        return acc
      }, [])
    },
    goToApplay(isEdit, invoiceId) {
      switch (isEdit) {
        case 0:

          this.$router.push({
            name: 'ApplayInvoiceForm',
            query: { isEdit, invoiceId }
          })
          break
        case 1:

          this.$router.push({
            name: 'EditInvoiceForm',
            query: { isEdit, invoiceId }
          })
          break

        default:
          break
      }
    },
    goToCat(isCat, invoiceId) {
      this.$router.push({
        name: 'catInvoice',
        query: { isCat, invoiceId }
      })
    },
    confirmInvoice(invoice) {
      this.dialogVisible = true
      this.isFlagObj.isApplay = true
      this.isFlagObj.dialogTitle = '确认已开票'
      const invoiceContent_name = invoice.invoiceContent === 'RENT' ? '租金 ' : invoice.invoiceContent === 'EXHIBITION' ? '展览服务费' : invoice.invoiceContent === 'MEETING' ? '会议服务费' : invoice.invoiceContent === 'LIGHT' ? '灯箱服务费' : '有偿服务费'
      invoice['invoiceContent_name'] = invoiceContent_name
      this.invoiceInfo = invoice
    },
    importInvoice() {
      this.invoiceInfo = {}
      this.dialogVisible = true
      this.isFlagObj.isApplay = false
      this.isFlagObj.info.isRight = true
      this.isFlagObj.dialogTitle = '导入发票'
      // this.$refs.invoice['isError'] = '0'
    },
    dialogChange(val) {
      this.dialogVisible = false
    },
    getInvoiceList() {
      this.loading = true
      const params = { ...this.searchList, ...this.page }
      const { id } = this.userInfo
      switch (this.fastFilterRadio) {
        case RADIO.PENDING:
          params.currentPendingApproverId = id
          break

        case RADIO.COMPLETE:
          params.approvedApprovalNodeUserId = id
          break

        default:
          break
      }
      this.$api.billApi.getInvoiceList(params).then((res) => {
        this.loading = false
        this.tableData = res.list ? res.list : this.tableData
        this.total = res.total
      })
    },
    exportInvoice(command) {
      if (Number(this.multipleSelection.length) === 0) return this.$message.warning('请选择至少一条的数据')
      let ids = ''
      const _ids = []
      for (var i in this.multipleSelection) {
        if (this.multipleSelection[i].checkState !== 'PASSED') return this.$message.warning('申请编号为' + this.multipleSelection[i].applyCode + '的审核状态必须已通过')
        ids += this.multipleSelection[i].id + ','
        _ids.push(this.multipleSelection[i].id)
      }
      switch (command) {
        case '发票Excel':
          window.location.href =
        `http://${window.location.host}${base.hall}api/hall/rest/invoice/export?ids=${ids.substring(0, ids.length - 1)}`
          break
        case '发票申请表':
          this.$api.billApi.downloadApplications(_ids)
          break
      }
    },
    batchPass() {
      if (Number(this.multipleSelection.length) === 0) {
        this.$message.warning('未选中任何数据')
        return false
      } else if (this.multipleSelection.filter((item) => item.checkState !== 'REVIEW').length) {
        const arr = this.multipleSelection.reduce((acc, cur) => {
          if (cur.checkState !== 'REVIEW') {
            acc.push(cur)
          }
          return acc
        }, [])
        // this.$message.error(`申请编号${arr['0'].applyCode}${arr['0'].checkState}不能执行该操作`)
        this.$message.error(`申请编号${arr['0'].applyCode} ${CHECK_STATE[arr['0'].checkState]}不能执行该操作`)
      } else if (this.multipleSelection.some(t => !isApprovalAuth(t.currentApproverId))) {
        const val = this.multipleSelection.find(t => {
          return !isApprovalAuth(t.currentApproverId)
        })
        this.$message.error(`申请编号${val.applyCode} 无权限执行该操作`)
        return
      } else {
        this.$confirm('确认批量通过?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          const params = this.multipleSelection.map(t => {
            return {
              approvalFlowId: t.approvalFlowId,
              currentApproverId: t.currentApproverId
            }
          })
          batchPass(params).then(() => {
            this.$refs.multipleTable.clearSelection()
            this.multipleSelection = []
            this.getInvoiceList()
            this.$message({
              type: 'success',
              message: '批量通过成功!'
            })
          })
          // this.multipleSelection.map(item => {
          //   item.checkState = 'PASSED'
          // })
          // this.$message({
          //   type: 'success',
          //   message: '批量通过成功!'
          // })
        }).catch(() => {
        })
      }
    },
    searchInvoice() {
      this.page = {
        pageNum: 1,
        pageSize: 12
      }
      this.getInvoiceList()
    },
    rowKey(row) {
      return row.id
    },
    setSelect() {
      for (let i = 0; i < this.multipleSelection.length; i++) {
        this.$refs.multipleTable.toggleRowSelection(
          this.multipleSelection[i],
          true
        )
      }
    },
    // batchPassInvoice() {
    //   this.$api.billApi.batchPass(this.selectionIds.join('&')).then(res => {
    //     this.selectionIds = []
    //     this.getInvoiceList()
    //   })
    // },
    // 作废发票
    cancelInvoice(id) {
      this.$api.billApi.trailInvoiceCancel(id).then(() => {
        this.getInvoiceList()
      }).catch(err => {
        this.$message.error(err.statusText)
      })
    },
    // 转化公司账户名称
    formatInvoiceOffice(office) {
      // const officeObj = {
      //   CBD: '国贸开票',
      //   PROPERTY: '物业开票'
      // }
      let company = ''
      if (this.companyList.length !== 0) {
        this.companyList.map(item => {
          if (item.id === office) {
            company = item.companyAbbreviation
          }
        })
      }
      return company
    },
    // 作废、取消弹窗
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
            this.$api.billApi.trailInvoiceCancel(id).then(res => {
              this.getInvoiceList()
              this.$message({ type: 'success', message: '操作成功!' })
            })
            break
          case 'CANCELED':
            this.$api.billApi.cancelInvoice(id).then(res => {
              this.getInvoiceList()
              this.$message({ type: 'success', message: '操作成功!' })
            })
            break

          default:
            break
        }
      }).catch(() => {
      })
    },
    // 弹窗隐藏
    changeDialog(isConfirm) {
      this.dialogVisible = false
      if (isConfirm) {
        // console.log('isconfirm', isConfirm)
        setTimeout(() => {
          this.getInvoiceList()
        }, 200)
      }
    }
  }
}
</script>

<style lang='scss' scoped>
@import "~@/styles/custom-theme.scss";
.invoiceList {
  margin-top: 10px;
  .remarks {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  // .searchList {
  //   display:flex;
  //   flex-wrap: wrap;
  //   // ::v-deep .el-form-item {
  //   //   width: 29%;
  //   // }
  //   .operateBtn{
  //     // justify-content: center;
  //     // flex:1;
  //     text-align: right;
  //   }
  // }
  // .btnList {
  //   margin: 20px 0;
  // }
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
// .row-item {
//   width: 100%;
//   margin-right: 0;
// }
.el-dropdown {
  margin-left: 10px;
  .el-dropdown-link {
    cursor: pointer;
    color: $--custom--color--primary;
  }
}
</style>
