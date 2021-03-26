<template>
  <!-- <div id="depositList"> -->
  <Layout id="depositList" :use-head="false" :use-foot="false" :auto-height="true">
    <MainTitle title="押金管理" />
    <el-tabs v-model="activeName">
      <!-- 押金列表部分 -->
      <el-tab-pane label="押金列表" name="first">
        <div id="deposit_div">
          <!-- 查询部分 -->
          <FilterForm ref="FilterForm" :project-options="projectOptions" :customer-options="customerOptions" :account-options="accountOptions" @onSubmit="onSubmit" @onReset="onReset" />

          <!-- 押金列表部分 -->
          <TablePager
            ref="TablePager"
            v-loading="loading"
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
            <el-table-column
              :resizable="false"
              label="操作"
              width="200"
              fixed="right"
            >
              <template slot-scope="scope">
                <span style="margin: 0 5px">
                  <el-button type="text" size="small" @click.native.prevent="lookOver(scope)">查看</el-button>
                </span>
                <el-tooltip v-if="isShowCredit(scope.row.billingState)" class="item" effect="dark" :content="tooltipContent(scope)" placement="top" :disabled="!((scope.row.turnAmount > 0 || scope.row.refundAmount > 0))">
                  <span style="margin: 0 5px">
                    <el-button
                      :disabled="(scope.row.turnAmount>0 || scope.row.refundAmount>0)?true:false"
                      type="text"
                      size="small"
                      @click.native.prevent="doEntry(scope)"
                    >
                      入账
                    </el-button>
                  </span>
                </el-tooltip>
                <el-tooltip v-if="isShowTransfer(scope.row.billingState)" class="item" effect="dark" :content="tooltipContent(scope)" placement="top" :disabled="!((scope.row.turnAmount > 0 || scope.row.refundAmount > 0))">
                  <span style="margin: 0 5px">
                    <el-button
                      :disabled="(scope.row.turnAmount>0 || scope.row.refundAmount>0)?true:false"
                      type="text"
                      size="small"
                      @click.native.prevent="doTransfer(scope)"
                    >
                      转款
                    </el-button>
                  </span>
                </el-tooltip>
                <el-tooltip v-if="isShowPay(scope.row.billingState)" class="item" effect="dark" :content="tooltipContent(scope)" placement="top" :disabled="!((scope.row.turnAmount > 0 || scope.row.refundAmount > 0))">
                  <span style="margin: 0 5px">
                    <el-button
                      :disabled="(scope.row.turnAmount>0 || scope.row.refundAmount>0)?true:false"
                      type="text"
                      size="small"
                      @click.native.prevent="collectionPro(scope)"
                    >
                      订单收款
                    </el-button>
                  </span>
                </el-tooltip>
                <span v-if="isShowDelete(scope.row.billingState, scope.row.createBy ? scope.row.createBy.id : null)" style="margin: 0 5px">
                  <el-button type="text" size="small" @click.native.prevent="deleteRow(scope)">删除</el-button>
                </span>
              </template>
            </el-table-column>
          </TablePager>

          <!-- dialog弹窗 -->
          <el-dialog :title="dialog.title" :visible.sync="dialog.visible" width="70%">
            <!-- 查看 -->
            <template v-if="dialog.type === DIALOG_TYPE.VIEW">
              <DepositDetail :reverse="reverse" :look-over-info="dialog.lookOverInfo" :record-table-data="dialog.recordTableData" :entry-records="dialog.entryRecords" :activities="dialog.activities" @recall="recall" />
              <div slot="footer" class="dialog-footer">
                <el-button @click="dialog.visible = false">关 闭</el-button>
              </div>
            </template>

            <!-- 入账 -->
            <template v-if="dialog.type === DIALOG_TYPE.ENTRY">
              <EntryDialog :look-over-info="dialog.lookOverInfo" :entry-table-data.sync="dialog.entryTableData" />
              <div slot="footer" class="dialog-footer">
                <el-button @click="dialog.visible = false">取 消</el-button>
                <el-button type="primary" @click="enterEntry">确 定</el-button>
              </div>
            </template>

            <!-- 转款 -->
            <template v-if="dialog.type === DIALOG_TYPE.TRANSFER">
              <TransferDialog ref="TransferDialog" :look-over-info="dialog.lookOverInfo" :project-options="projectOptions" />
              <div slot="footer" class="dialog-footer">
                <el-button @click="dialog.visible = false">取 消</el-button>
                <el-button type="primary" @click="transferSubmit('TransferDialog')">确 定</el-button>
              </div>
            </template>
          </el-dialog>

        </div>
      </el-tab-pane>
      <!-- 添加押金部分 -->
      <el-tab-pane v-if="hasRolePermission('DepositList_add')" label="添加押金" name="second">
        <AddDeposit :project-options="projectOptions" :customer-options="customerOptions" :account-options="accountOptions" @onSubmit="onSubmit" />
      </el-tab-pane>
    </el-tabs>
  </Layout>
  <!-- </div> -->
</template>

<script>
import NP from 'number-precision'
// import EntryRecord from './components/EntryRecord'
import pageMixin from '@/views/mixins/page'
// import RowText from '@/components/rowText'
// import DepositUseRecord from './components/DepositUseRecord'
import DepositDetail from './components/DepositDetail'
import AddDeposit from './components/AddDeposit'
import TransferDialog from './components/TransferDialog'
import EntryDialog from './components/EntryDialog'
import { ACTION, TYPE, STATE_OBJECT, isShowCredit, isShowTransfer, isShowPay, isShowDelete } from '@/common/deposit'
import MainTitle from '@/components/base/MainTitle'
import FilterForm from './components/FilterForm'
import TablePager from '@/components/base/TablePager'
import Layout from '@/components/base/Layout'

const DIALOG_TYPE = {
  VIEW: 'VIEW',
  ENTRY: 'ENTRY',
  TRANSFER: 'TRANSFER'
}

export default {
  name: 'DepositList',
  components: {
    Layout,
    // RowText,
    FilterForm,
    // EntryRecord,
    // DepositUseRecord,
    TablePager,
    DepositDetail,
    EntryDialog,
    MainTitle,
    AddDeposit,
    TransferDialog
  },
  mixins: [pageMixin],
  data() {
    return {
      loading: false,
      activeName: 'first', // tab切换
      projectOptions: [], // 项目名称数组
      customerOptions: [], // 客户名称数组
      accountOptions: [], // 收款账户
      tableHeader: [
        { key: 'code', text: '押金编号', width: 140 },
        { key: 'projectName', text: '项目名称', width: 180 },
        { key: 'customerName', text: '客户名称', width: 180 },
        {
          text: '押金类别',
          width: 120,
          formatter: (row) => {
            return TYPE[row.depositType] || ''
          }
        },
        { key: 'accountNameAs', text: '收款账户', width: 100 },
        {
          key: 'totalAmount',
          text: '应收金额',
          width: 120,
          align: 'right',
          formatter: (row) => {
            return `￥${row.totalAmount}`
          }
        },
        {
          key: 'receiveAmount',
          text: '已收金额',
          width: 120,
          align: 'right',
          formatter: (row) => {
            return `￥${row.receiveAmount}`
          }
        },
        {
          key: 'availableAmount',
          text: '可用金额',
          width: 120,
          align: 'right',
          formatter: (row) => {
            return `￥${row.availableAmount}`
          }
        },
        { key: 'remark', text: '备注', width: 120 },
        {
          key: 'billingState',
          text: '入账状态',
          width: 120,
          formatter: (row) => {
            return STATE_OBJECT[row.billingState] || ''
          }
        },
        { key: 'createBy.name', text: '创建人', width: 120 },
        { key: 'createDate', text: '创建时间', width: 160 }
      ],
      tableData: [],
      isShowCredit,
      isShowTransfer,
      isShowPay,
      isShowDelete,
      page: {
        pageSize: 10,
        pageNum: 1,
        totle: 0
      },
      DIALOG_TYPE,
      dialog: {
        type: '',
        title: '',
        visible: false,
        lookOverInfo: {}, // 押金信息
        recordTableData: [], // 使用记录
        entryRecords: [], // 入账记录
        activities: [],
        entryTableData: [] // 入账列表
      },
      reverse: true,
      deposit: {}, // 押金信息\
      currentDialogId: null, // 当前获取dialog数据的id
      ACTION
    }
  },
  mounted() {
    this.onSubmit()
    this.getProject()
    this.getCustomer()
    this.getAccountInfo()
  },
  methods: {
    // 入账撤回
    recall(paymentId) {
      this.$api.depositMsg.recall(paymentId).then(res => {
        this.onSubmit()
        this.getDepositRec(this.currentDialogId)
        this.$message.success('撤回成功')
      })
    },
    // 获取项目名称
    getProject() {
      const params = {}
      this.$api.depositMsg.getProjectList(params).then(res => {
        if (res.length > 0) {
          this.projectOptions = res
          // this.formData.projectOptions = res
          // this.addFormData.projectOptions = res
        }
      })
    },
    // 获取客户名称
    getCustomer() {
      // 过滤掉未审核的客户
      const params = {
        customerSimple: { customerRequest: { state: 'APPROVED' }}
      }
      this.$api.depositMsg.getCustomerList(params).then(res => {
        if (res.length > 0) {
          this.customerOptions = res
          // this.addFormData.customerOptions = res
          // 请求成功把客户名称数组存在缓存中方便别的页面调用
          sessionStorage.setItem('customerOptions', JSON.stringify(res))
        }
      })
    },
    // 获取收款账户信息
    getAccountInfo() {
      const params = {}
      this.$api.depositMsg.getAccountList(params).then(res => {
        // this.accountOptions = res.filter(v => v.number === 'GZPOLY_GM' | v.number === 'GZPOLY_WY' | v.number === 'GZPOLY_GMSP')
        this.accountOptions = res
      })
    },
    getFilterFromParams() {
      return this.$refs.FilterForm.getFilterForm()
    },
    // 查询
    onSubmit() {
      // 这里调用一下重置函数方法
      const params = {
        ...this.getFilterFromParams(),
        pageNum: this.page.pageNum,
        pageSize: this.page.pageSize
      }
      this.loading = true
      this.$api.depositMsg.getDepositList(params).then(res => {
        this.loading = false
        this.tableData = res.list
        this.page.pageNum = res.pageNum
        this.page.total = res.total
      })
    },
    // 设置pageNum
    handleCurrentChange(page) {
      this.page.pageNum = page.currentPage
      this.onSubmit()
    },
    // 重置
    onReset() {
      this.page.pageNum = 1
      this.onSubmit()
    },
    // 设置tooltip content
    tooltipContent({ row }) {
      const refundAmount = row.refundAmount || 0
      const turnAmount = row.turnAmount || 0

      if (refundAmount) return `押金已申请退款，退款编号：${row.refundCode}`
      if (turnAmount) return '押金已转款'
    },
    // 查看
    lookOver({ row }) {
      this.dialog.recordTableData = []
      this.dialog.activities = []
      this.currentDialogId = row.id

      this.dialog.title = '查看详情'
      this.dialog.type = DIALOG_TYPE.VIEW
      this.dialog.visible = true
      this.getDepositRec(row.id)
      // // 判断当前创建人有没有值
      // if (row.createBy) {
      //   this.createByName = row.createBy.name
      // }
      // this.customerCode = row.customerCode
    },
    // 获取押金使用记录 / 入账记录 / 操作日志
    getDepositRec(id) {
      this.$api.depositMsg.getDepositRecord(id).then(res => {
        const depositOperations = res.depositOperations
        const deposit = res.deposit
        // 这里《使用记录》先拼接《操作记录》里面的转款，后面再拼接《收款记录》的数据
        this.dialog.recordTableData = []
        for (let i = 0; i < depositOperations.length; i++) {
          const row = depositOperations[i]
          if (row.action === ACTION.TURN_DEPOSIT) {
            this.dialog.recordTableData.push({ ...row, payeeNo: row.receiverNo, operatorName: row.createBy.name })
          }
        }
        // 押金信息 弹窗用
        this.dialog.lookOverInfo = deposit
        // 操作日志
        this.dialog.activities = depositOperations
        // 押金信息
        this.deposit = deposit
        this.$api.depositMsg.getDepostitPayment(id).then(res => {
          this.dialog.recordTableData = [...this.dialog.recordTableData, ...res] || []
        })
      }).catch(err => { console.log(err) })
      // 入账记录
      this.$api.depositMsg.getDepositEntryRecord(id).then(res => {
        this.dialog.entryRecords = res || []
      })
    },
    // 入账
    async doEntry(scope) {
      this.dialog.title = '押金入账'
      this.dialog.type = DIALOG_TYPE.ENTRY
      this.dialog.lookOverInfo = scope.row
      this.dialog.entryTableData = await this.requestBook(scope)
      this.dialog.visible = true
    },
    // 分页查询台账
    requestBook(scope) {
      const params = {
        customerId: scope.row.customerId,
        receiveTime: '',
        pageNum: 1,
        pageSize: '',
        isDepositEntry: true,
        receivableAccountId: scope.row.accountId
      }
      return new Promise((resolve) => {
        this.$api.depositMsg.getBookList(params).then(res => {
          for (let i = 0; i < res.list.length; i++) {
            res.list[i].thisTimeAmount = ''
          }
          resolve([...res.list])
        }).catch(() => {
          resolve([])
        })
      })
    },
    // 确定入账
    enterEntry() {
      const payments = []
      let sum = 0
      const { totalAmount, receiveAmount, id: depositId } = this.dialog.lookOverInfo
      const surplusRece = NP.minus(totalAmount, receiveAmount) // 剩余应收

      for (let i = 0; i < this.dialog.entryTableData.length; i++) {
        const row = this.dialog.entryTableData[i]
        if (row.thisTimeAmount > 0) {
          payments.push({
            standingBookId: row.id,
            amount: row.thisTimeAmount
          })
          sum = sum + Number(row.thisTimeAmount)
        }
      }
      // 比较当前输入框总金额与剩余应收金额
      if (sum <= surplusRece) {
        // 判断当前台账id数组和金额数组长度，大于零才能提交，不然只关闭弹窗
        if (payments.length > 0) {
          const params = {
            depositId,
            payments
          }
          this.$api.depositMsg.doDepositEntry(params).then(res => {
            this.$message({ message: '入账成功！', type: 'success' })
            this.dialog.visible = false
            this.onSubmit()
          })
        } else {
          this.dialog.visible = false
        }
      } else {
        this.$message({ message: '本次入账金额不能大于剩余应收金额！', type: 'warning' })
      }
    },
    // 转款
    doTransfer(scope) {
      this.dialog.title = '押金转款'
      this.dialog.type = DIALOG_TYPE.TRANSFER
      this.dialog.lookOverInfo = scope.row
      this.dialog.visible = true
    },
    // 转款提交
    transferSubmit(transfer) {
      this.$refs[transfer].validate().then(formData => {
        const { amount } = formData
        const { id, code } = this.dialog.lookOverInfo
        // 判断押金金额是否大于0，大于0才能转款
        if (amount > 0) {
          const params = { id, code, ...formData }
          this.$api.depositMsg.transferDeposit(params).then(res => {
            this.$message({ type: 'success', message: '转款成功!' })
            this.dialog.visible = false
            this.onSubmit()
          })
        } else {
          this.$message({ message: '押金金额大于0元才能转款！', type: 'warning' })
        }
      }).catch(() => { return false })
    },
    // 收款处理
    collectionPro(scope) {
      // 跳转到收款处理页面时缓存当前查询参数
      // sessionStorage.setItem('queryParams', JSON.stringify({
      //   'projectId': this.projectValue,
      //   'customerId': this.customerValue,
      //   'billingStates': this.stateValue,
      //   'accountId': this.accountValue,
      //   'pageNum': this.pageNum
      //   // 'pageSize': this.pageSize
      // }))
      this.$router.push({ name: 'CollectionPro', query: { id: scope.row.id }})
    },
    // 删除
    deleteRow(scope) {
      this.$confirm('此操作将删除该条记录, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$api.depositMsg.deleteDeposit(scope.row.id).then(() => {
          this.$message({ type: 'success', message: '删除成功!' })
          this.onSubmit()
        })
      }).catch(() => {
        this.$message({ type: 'info', message: '已取消删除' })
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import "~@/styles/custom-theme.scss";
  #depositList {
    // background: #fff;
    // margin: 15px;
    // padding: 20px;
    // font-style: PingFang SC;
    .top_title {
      font-size: 18px;
      font-weight: bold;
      margin-bottom: 20px;
    }
    #deposit_div{
      padding-top: 10px;
      .block{
        margin-top: 20px;
        .block_tips{
          font-size: 14px;
          color: #000000;
          line-height: 28px;
          float: left;
        }
      }
      ::v-deep .el-dialog__footer{
        text-align: center;
      }
      .info_space{
        overflow: hidden;
        .title_div{
          position: relative;
          background: #FAFAFA;
          height: 40px;
          margin-bottom: 20px;
          span{
              padding-left: 10px;
              line-height: 40px;
          }
          .title_line{
              position: absolute;
              left: 0;
              top: 12px;
              width: 4px;
              height: 16px;
              background: $--custom--color--primary;
          }
        }
        .info_list_div{
          .info_list{
            li{
              list-style: none;
              float: left;
              width: 50%;
              font-size: 14px;
              line-height: 20px;
              color: #666666;
              span{
                color: #000000;
              }
            }
          }
          .el-form-item{
            width: 100%;
          }
        }
        .info_list_div{
          .info_list_div_time{
            padding-left: 130px;
            box-sizing: border-box;
            ::v-deep .el-timeline-item__wrapper{
              .operation_div{
                margin-top: -13px;
                position: relative;
                .operation_peo{
                  line-height: 20px;
                  margin-top: 4px;
                  color: #000000;
                }
                .operation_desc{
                  line-height: 20px;
                  margin-top: 4px;
                  color: #999999;
                }
                .operation_desc_time{
                  line-height: 20px;
                  margin-top: 4px;
                  color: #000000;
                  position: absolute;
                  top: -4px;
                  left: -175px;
                }
              }
            }
          }
        }
      }
    }
  }
</style>
