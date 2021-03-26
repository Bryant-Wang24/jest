<template>
  <div class="tableList">
    <FilterForm ref="FilterForm" :project-options="projectOptions" :company-options="companyOptions" @onSubmit="onSubmit" @onReset="onReset" />
    <div class="refund_new">
      <el-radio-group v-model="filterRadio" @change="fastFilterChange">
        <el-radio-button :label="RADIO.ALL">全部</el-radio-button>
        <el-radio-button :label="RADIO.PENDING_REVIEW">待我审核</el-radio-button>
        <el-radio-button :label="RADIO.COMPLETE">我已审核</el-radio-button>
        <el-radio-button :label="RADIO.PENDING_REFUND">待我退款</el-radio-button>
      </el-radio-group>

      <TablePager
        ref="TablePager"
        v-loading="tableLoading"
        :data="tableData"
        :total="total"
        :to="pageSize"
        :current-page="pageNum"
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
        <el-table-column label="操作" fixed="right">
          <template slot-scope="scope">
            <el-button type="text" @click="clickBtn(scope.row, '查看')">查看</el-button>
            <el-button
              v-if="scope.row.refundStatus==='APPROVING' && isApprovalAuth(scope.row.currentApproverId)"
              type="text"
              @click="clickBtn(scope.row, '审批')"
            >审批</el-button>
            <el-button
              v-if="scope.row.refundStatus==='REJECTED' && hasRoleUserPermission('refund_edit', scope.row.applier ? scope.row.applier.id : null)"
              type="text"
              @click="clickBtn(scope.row, '编辑')"
            >编辑</el-button>
            <!-- <el-button
              v-if="scope.row.refundStatus!=='WAITING_REFUND'"
              size="mini"
              type="text"
              @click="clickBtn(scope.row, '呈批件')" -->
            <el-button
              v-if="scope.row.refundStatus!=='INVALID_REFUND' && !isBaiMa"
              type="text"
              @click="clickBtn(scope.row, '呈批件')"
            >查看呈批件</el-button>
            <el-button
              v-if="(scope.row.refundStatus==='FOR_REFUND' || scope.row.refundStatus=== 'REJECTED')&& hasRoleUserPermission('refund_void', scope.row.applier ? scope.row.applier.id : null)"
              type="text"
              @click="clickBtn(scope.row, '作废')"
            >作废</el-button>
            <el-button
              v-if="(scope.row.refundStatus==='FOR_REFUND' || scope.row.refundStatus==='WAITING_REFUND') && hasRolePermission('refund_handle') && hasOperated(scope.row)"
              type="text"
              @click="clickBtn(scope.row, '处理退款')"
            >处理退款</el-button>

          </template>
        </el-table-column>
      </TablePager>

    </div>
    <DialogPage :dialog-show="dialogShow" width="62.5%" :title="dialogTitle" @handleCancel="dialogShow = false">
      <SeePage :wy-certificate-ids="wyCertificateIds" :gm-certificate-ids="gmCertificateIds" :refundapply="refundapply" :state="state" :imgs="accountImage" @dialogShowFalse="dialogShow = false" @determine="determine" />
    </DialogPage>
  </div>
</template>
<script>
import { isBaiMa } from '@/api/base'
import { isApprovalAuth } from '@/common/approve'
import { REFUND_STATUS, REFUND_STATUS_TEXT, RADIO } from '@/common/refund'
// import TablePage from '@/components/table/table'
// import PaginationPage from '@/components/Pagination/index'
import SeePage from './see'
import DialogPage from '@/components/dialog/dialog'
// import FilterForm from '@/components/FilterForm/FilterForm'
import FilterForm from './FilterForm'
import TablePager from '@/components/base/TablePager'
import { mapGetters, mapState } from 'vuex'
import { TYPE } from '@/common/deposit'

export default {
  components: { FilterForm, DialogPage, SeePage, TablePager },
  data() {
    return {
      isBaiMa,
      RADIO,
      filterRadio: RADIO.ALL,
      isApprovalAuth,
      accountImage: [],
      gmCertificateIds: [],
      wyCertificateIds: [],
      refundApplyId: null, //
      state: '', // 0--查看，1--退款处理
      dialogTitle: '',
      tableLoading: false,
      dialogShow: false,
      tableData: [],
      project_name: '',
      company_name: '',
      refund_status: '',
      applier: '',
      pageNum: 1,
      pageSize: 10,
      total: 0,
      refundapply: {},
      projectOptions: [],
      companyOptions: []
    }
  },
  computed: {
    tableHeader() {
      let tableHeader = []
      if (isBaiMa) {
        tableHeader = [
          { key: 'applyNumber', text: '申请编号', width: 120 },
          { key: 'projectName', text: '项目名称', width: 180 },
          { key: 'companyName', text: '退款客户', width: 240 },
          { key: 'gmAmountName', text: '退款金额', width: 120, align: 'right' },
          // { key: 'wyAmountName', text: '物业退款金额', width: 120, align: 'right' },
          { key: 'refund_status_name', text: '退款状态', width: 100 },
          { key: 'remark', text: '备注' },
          { key: 'applier.name', text: '申请人', width: 120 },
          { key: 'applyDate', text: '申请时间', width: 160 }
        ]
      } else {
        tableHeader = [
          { key: 'applyNumber', text: '申请编号', width: 120 },
          { key: 'projectName', text: '项目名称', width: 180 },
          { key: 'companyName', text: '退款客户', width: 240 },
          { key: 'gmAmountName', text: '国贸退款金额', width: 120, align: 'right' },
          { key: 'wyAmountName', text: '物业退款金额', width: 120, align: 'right' },
          { key: 'refund_status_name', text: '退款状态', width: 100 },
          { key: 'remark', text: '备注' },
          { key: 'applier.name', text: '申请人', width: 120 },
          { key: 'applyDate', text: '申请时间', width: 160 }
        ]
      }
      return tableHeader
    },
    isGM() { // 是否国贸
      const userInfo = this.userInfo
      const refundTokenRoles = this.refundTokenRoles
      return this.isRefundRole(userInfo, refundTokenRoles, '国贸退款凭证')
    },
    isWY() { // 是否物业
      const userInfo = this.userInfo
      const refundTokenRoles = this.refundTokenRoles
      return this.isRefundRole(userInfo, refundTokenRoles, '物业退款凭证')
    },
    ...mapState({ refundTokenRoles: state => state.refund.refundTokenRoles }),
    ...mapGetters({ userInfo: 'userInfo' })
  },
  mounted() {
    this.initPage()
  },
  methods: {
    initPage() {
      this.getCustomerList()
      this.getProjectList()
      this.getRefundapplyPage()
    },
    fastFilterChange() {
      this.getRefundapplyPage()
    },
    hasOperated(row) {
      const { gmCertificateIds, wyCertificateIds, gmAmount, wyAmount } = row
      if (this.isGM && this.isWY) {
        return (gmAmount > 0 && !gmCertificateIds) || (wyAmount > 0 && !wyCertificateIds)
      }
      if (this.isGM) {
        return gmAmount > 0 && !gmCertificateIds
      }
      if (this.isWY) {
        return wyAmount > 0 && !wyCertificateIds
      }

      return false
    },
    // 根据字典配置判断是否显示凭证区域
    isRefundRole(userInfo, refundTokenRoles, label) {
      // const { roleList } = userInfo
      // const roleNames = roleList.map(t => t.enname)
      // const roles = []
      // refundTokenRoles.forEach(el => {
      //   if (el.label === label) {
      //     roles.push(el.value)
      //   }
      // })
      // const map = [...roleNames, ...roles]
      // return new Set(map).size !== map.length
      const { roleList } = userInfo
      const roleNames = roleList.map(t => t.enname)
      let dictRoleEnname = null
      refundTokenRoles.forEach(el => {
        if (el.label === label) {
          dictRoleEnname = el.value
        }
      })
      return roleNames.includes(dictRoleEnname)
    },
    getCustomerList() {
      this.$api.depositMsg.getCustomerList().then(res => {
        this.companyOptions = res
      })
    },
    // 场地销售列表
    getProjectList() {
      this.$api.refund.projectData({}).then(res => {
        if (res) {
          this.projectOptions = res
        }
      })
    },
    // 国贸、物业提交
    determine(val) {
      var deposits = []
      const { projectId, refundAmount, companyId, projectName, companyName, accountId, refund_type: refundType, refundStatus, accountNumber, accountTitle, bankBranch, gmAmount, wyAmount } = this.refundapply
      for (var i in this.refundapply.deposits) {
        deposits.push({
          id: this.refundapply.deposits[i].id
        })
      }
      const params = {
        refundApply: {
          projectId,
          refundAmount,
          companyId,
          projectName,
          companyName,
          accountId,
          refundType,
          refundStatus,
          accountNumber,
          accountTitle,
          bankBranch,
          id: this.refundApplyId,
          gmCertificateIds: val.gmCertificateIds,
          wyCertificateIds: val.wyCertificateIds,
          wyRemark: val.wyRemark,
          gmRemark: val.gmRemark,
          gmAmount,
          wyAmount
        },
        deposits: deposits
      }

      this.$api.refund.refundapplyRetreat(params).then(res => {
        if (res === true) {
          this.$message.success('操作成功')
          this.dialogShow = false
          this.getRefundapplyPage()
        }
      })
    },
    handleCurrentChange(page) {
      this.pageNum = page.currentPage
      this.getRefundapplyPage()
    },
    // 获取筛选表单值
    getFilterFormData() {
      return this.$refs.FilterForm.initParams()
    },
    // 分页查询
    getRefundapplyPage() {
      const params = {
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        ...this.getFilterFormData()
      }
      // params['refundStatuses'] = (this.refund_status === '全部' || this.refund_status === '') ? null : [this.refund_status]
      // params['companyId'] = this.company_name || null
      // params['projectId'] = this.project_name || null
      // params['applier'] = this.applier || null

      switch (this.filterRadio) {
        case RADIO.PENDING_REVIEW:
          params.currentPendingApproverId = this.userInfo.id
          break

        case RADIO.COMPLETE:
          params.approvedApprovalNodeUserId = this.userInfo.id
          break

        case RADIO.PENDING_REFUND:
          if (this.isGM && this.isWY) {
            params.minGmAmount = 0.01
            params.minWyAmount = 0.01
            params.hasGmCertificates = false
            params.hasWyCertificates = false
            params.refundStatuses = [REFUND_STATUS.FOR_REFUND]
          } else if (this.isGM) {
            params.minGmAmount = 0.01
            params.hasGmCertificates = false
            params.refundStatuses = [REFUND_STATUS.FOR_REFUND]
          } else if (this.isWY) {
            params.minWyAmount = 0.01
            params.hasWyCertificates = false
            params.refundStatuses = [REFUND_STATUS.FOR_REFUND]
          } else {
            // 非国贸财务 非物业财务 清空整个列表 不用调用接口请求
            this.tableLoading = false
            this.tableData = []
            this.total = 0
            return
          }
          break
        default:
          break
      }

      this.tableLoading = true

      this.$api.refund.refundapplyPage(params).then(res => {
        if (res) {
          var list = res.list
          for (var i in list) {
            // list[i]['refund_status_name'] = list[i].refundStatus === REFUND_STATUS['FOR_REFUND'] ? '待退款' : list[i].refundStatus === REFUND_STATUS['WAITING_REFUND'] ? '退款中' : list[i].refundStatus === 'INVALID_REFUND' ? '已作废' : list[i].refundStatus === 'APPROVING' ? '审核中' : list[i].refundStatus === 'REJECTED' ? '审核拒绝' : '已退款'
            list[i]['refund_status_name'] = REFUND_STATUS_TEXT[list[i].refundStatus]
            list[i]['gmAmountName'] = '￥' + list[i].gmAmount
            list[i]['wyAmountName'] = '￥' + list[i].wyAmount
          }
          this.tableLoading = false
          this.tableData = res.list
          this.total = res.total
        }
      })
    },
    // 表格操作
    clickBtn(res, type) {
      switch (type) {
        case '查看':
          this.state = '0'
          this.dialogTitle = '查看'
          this.refundapply = {}
          this.getRefundapplyNew(res.id)
          this.dialogShow = true
          break
        case '呈批件':
          this.$router.push({
            name: 'refundEdit',
            params: { id: res.id }
          })
          break
        case '编辑':
          this.$router.push({
            name: 'refundEditNew',
            params: { id: res.id }
          })
          break
        case '审批':
          this.$router.push({
            name: 'refundAudit',
            params: { id: res.id }
          })
          break
        case '作废':
          this.$confirm(
            '此操作将作废退款申请编号为' + res.applyNumber + ', 是否继续?',
            '提示',
            {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }
          )
            .then(() => {
              this.refundapplyVoid(res)
            })
            .catch(() => {

            })
          break
        case '处理退款':
          this.refundApplyId = res.id
          this.dialogTitle = '退款处理'
          this.state = '1'
          this.refundapply = {}
          this.getRefundapplyNew(res.id)
          this.dialogShow = true
          break
      }
    },
    // 作废
    refundapplyVoid(json) {
      this.$api.refund.refundapplyVoid({ id: json.id }).then(res => {
        if (res) {
          this.$message.success('操作成功')
          this.getRefundapplyPage()
        }
      })
    },
    // 获取图片路径
    pushImgUrl(id, type) {
      this.$api.siteList.tupianID(id).then(res => {
        if (res.data !== 'null') {
          if (type === '1') {
            this.accountImage.push({
              id,
              url: res.data.address
            })
          } else if (type === '2') {
            this.gmCertificateIds.push({
              id,
              url: res.data.address
            })
          } else {
            this.wyCertificateIds.push({
              id,
              url: res.data.address
            })
          }
        } else {
          return false
        }
      })
    },
    initImages(res) {
      const { refundApply } = res
      const { accountImageIds, gmCertificateIds, wyCertificateIds } = refundApply
      this.accountImage = []
      if (accountImageIds !== null && accountImageIds !== '') {
        var _accountImageIds = accountImageIds.split(',')
        for (var i in _accountImageIds) {
          this.pushImgUrl(_accountImageIds[i], '1')
        }
      }
      this.gmCertificateIds = []
      if (gmCertificateIds !== null && gmCertificateIds !== '') {
        var _gmCertificateIds = gmCertificateIds.split(',')
        for (var j in _gmCertificateIds) {
          this.pushImgUrl(_gmCertificateIds[j], '2')
        }
      }
      this.wyCertificateIds = []
      if (wyCertificateIds !== null && wyCertificateIds !== '') {
        var _wyCertificateIds = wyCertificateIds.split(',')
        for (var k in _wyCertificateIds) {
          this.pushImgUrl(_wyCertificateIds[k], '3')
        }
      }
      return res
    },
    // 查看退款详情
    getRefundapplyNew(id) {
      const json = { id }
      this.$api.refund.refundapplyNew(json).then(res => {
        if (res) {
          const { deposits, refundApply } = res

          // var list = res.deposits
          if (!Reflect.has(refundApply, 'gmCertificateIds')) {
            refundApply['gmCertificateIds'] = null
          }
          if (!Reflect.has(refundApply, 'wyCertificateIds')) {
            refundApply['wyCertificateIds'] = null
          }

          // if (!('gmCertificateIds' in res.refundApply)) {
          //   res.refundApply['gmCertificateIds'] = null
          // }
          // if (!('wyCertificateIds' in res.refundApply)) {
          //   res.refundApply['wyCertificateIds'] = null
          // }

          // const accountNameAss = []
          let styleNum = 0

          // for (const n in deposits) {
          //   const { accountNameAs, depositType } = deposits[n]
          //   deposits[n]['paymentName'] = accountNameAs
          //   deposits[n]['depositName'] = TYPE[depositType]
          //   accountNameAss.push(accountNameAs)
          // }
          // if (accountNameAss.includes('国贸') && accountNameAss.includes('物业')) {
          //   styleNum = 3
          // } else if (accountNameAss.includes('国贸')) {
          //   styleNum = 1
          // } else if (accountNameAss.includes('物业')) {
          //   styleNum = 2
          // }

          const accountIds = []
          for (let n = 0; n < deposits.length; n++) {
            const deposit = deposits[n]
            const { accountId, depositType, accountNameAs } = deposit
            deposits[n]['paymentName'] = accountNameAs
            deposits[n]['depositName'] = TYPE[depositType]
            accountIds.push(accountId)
          }
          if (accountIds.includes(1004) && accountIds.includes(1005)) {
            styleNum = 3
          } else if (accountIds.includes(1004)) {
            styleNum = 1
          } else if (accountIds.includes(1005)) {
            styleNum = 2
          }
          // let string = ''
          // for (const n in deposits) {
          //   // list[n]['paymentName'] = '【' + list[n].accountNameAs + '】' + list[n].accountName
          //   // list[n]['depositName'] = list[n].depositType === 'ADVANCE_PAYMENT' ? '预付款' : list[n].depositType === 'DEPOSIT' ? '押金' : list[n].depositType === 'CONSTRUCTION_BOND' ? '施工证保证金' : '商铺押金'
          //   string += deposits[n].accountNameAs
          // }
          // let styleNum = 0
          // if (string.includes('国贸')) {
          //   styleNum = 1
          // }
          // if (string.includes('物业')) {
          //   styleNum = 2
          // }
          // if (string.includes('国贸') && string.includes('物业')) {
          //   styleNum = 3
          // }
          this.initImages(res)
          // this.accountImage = []
          // if (res.refundApply.accountImageIds !== null && res.refundApply.accountImageIds !== '') {
          //   var accountImageIds = res.refundApply.accountImageIds.split(',')
          //   res['account_image'] = accountImageIds
          //   // this.accountImage = []
          //   for (var i in accountImageIds) {
          //     this.pushImgUrl(accountImageIds[i], '1')
          //   }
          // }
          // this.gmCertificateIds = []
          // if (res.refundApply.gmCertificateIds !== null && res.refundApply.gmCertificateIds !== '') {
          //   var gmCertificateIds = res.refundApply.gmCertificateIds.split(',')
          //   res['gm_certificate'] = gmCertificateIds
          //   // this.gmCertificateIds = []
          //   for (var j in gmCertificateIds) {
          //     this.pushImgUrl(gmCertificateIds[j], '2')
          //   }
          // }
          // this.wyCertificateIds = []
          // if (res.refundApply.wyCertificateIds !== null && res.refundApply.wyCertificateIds !== '') {
          //   var wyCertificateIds = res.refundApply.wyCertificateIds.split(',')
          //   res['wy_certificate'] = wyCertificateIds
          //   // this.wyCertificateIds = []
          //   for (var k in wyCertificateIds) {
          //     this.pushImgUrl(wyCertificateIds[k], '3')
          //   }
          // }
          const { refundStatus, applyNumber, refundAmount, projectId, companyId, projectName, companyName, refundType: refund_type, accountTitle, accountNumber, bankBranch, remark, gmAmount, wyAmount, accountId, wyRemark, gmRemark } = refundApply
          const json = {
            styleNum,
            refundStatusName: REFUND_STATUS_TEXT[refundStatus],
            refund_type,
            refundApply,
            deposits,
            applyNumber,
            refundAmount,
            projectId,
            companyId,
            projectName,
            companyName,
            refundStatus,
            accountTitle,
            accountNumber,
            bankBranch,
            remark,
            gmAmount,
            wyAmount,
            accountId,
            wyRemark,
            gmRemark
          }
          this.refundapply = json
        }
      })
    },

    // 查询
    onSubmit() {
      this.pageNum = 1
      // this.pageSize = 10
      this.getRefundapplyPage()
    },
    // 重置
    onReset() {
      this.pageNum = 1
      this.onSubmit()
    }
  }
}
</script>
<style lang="scss" scoped>

.tableList{
  width: 100%;
  padding-top: 10px;
  .refund_new{
    width: 100%;
    box-sizing: border-box;
    text-align: right;

  }
}
</style>
