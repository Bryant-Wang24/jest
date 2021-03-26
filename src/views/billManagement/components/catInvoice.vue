<template>
  <div class="catInvoice">
    <MainTitle title="查看发票" />
    <div class="invoiceInfo">
      <RowText text="基础信息" class="rowText" />
      <div class="baseInfo">
        <div v-for="(item,index) in baseInvoiceInfoList" :key="index" class="itemInfo">
          <div class="key">{{ item.label }}</div>
          <div class="value">{{ item.value }}</div>
        </div>
      </div>
    </div>
    <div class="invoiceInfo">
      <RowText class="rowText" text="开票信息" />
      <div class="baseInfo">
        <div v-for="(item,index) in invoiceInfoList" :key="index" class="itemInfo">
          <div class="key">{{ item.label }}</div>
          <div class="value">{{ item.value }}</div>
        </div>
      </div>

      <div v-if="invoiceInfo.invoiceState =='INVOICED'" class="baseInfo topLine">
        <div v-for="(item, index) in hallInvoiceInfoList" :key="index" class="itemInfo">
          <div class="key">{{ item.label }}</div>
          <div class="value">{{ item.value }}</div>
        </div>
      </div>
    </div>
    <div class="invoiceInfo">
      <RowText class="rowText" text="相关合同/服务单" />
      <div class="openTable">
        <TableItem :is-invoice="true" :table-data="orderData" :files-info="filesInfo" :invoice-info="invoiceInfo" />
      </div>
      <RowText class="rowText" text="实收款记录" />
      <div class="openTable">
        <ActualRecord :invoice-info="invoiceInfo" :actual-record-data="actualRecordData" />
      </div>
      <!-- 审批流组件 -->
      <ApprovalLine v-if="approveId" ref="approve" :approve-id="approveId" />
      <div class="bottomBtn">
        <el-button @click="gotoInvoiceList">返回</el-button>
        <ApprovalBtn v-if="!isCat" :approve-id="approveId" :visible.sync="approveVisible" @refresh="refresh" />
      </div>
    </div>
  </div>
</template>

<script>
import TableItem from './tableItem'
import ActualRecord from './actualRecord'
import RowText from '@/components/rowText'
import ApprovalBtn from '@/components/ApprovalOperate'
import ApprovalLine from '@/components/ApprovalLine'
import MainTitle from '@/components/base/MainTitle'
import { CHECK_STATE, INVOICE_STATE, CONTENT_OPTIONS_TYPE_ZH } from '@/common/bill'
import { INVOICE_TYPE_OBJECT } from '@/common/customerMsg'
import { deleteTagsView } from '@/utils/common'
import { mapState } from 'vuex'
import { isNumber } from '@/utils/validate'

const invoiceObj = {
  UNBILLED: '未开票',
  INVOICED: '已开票',
  NULL: '-'
}

export default {
  components: {
    ActualRecord,
    TableItem,
    RowText,
    ApprovalBtn,
    ApprovalLine,
    MainTitle
  },
  data() {
    return {
      invoiceObj,

      reverse: true,
      invoiceInfo: {},
      isCat: false,

      formData: {
        id: '',
        reason: ''
      },
      advanceRules: {
        reason: [
          { required: true, message: '请填写拒绝原因', trigger: 'blur' }
        ]
      },
      orderData: [],
      filesInfo: {}, // 项目文件相关信息
      approveId: null, // 审批流
      approveVisible: false, // 审批流按钮组件必传参数
      // 实收款记录
      actualRecordData: []
    }
  },
  computed: {
    baseInvoiceInfoList() {
      const { projectName, applyCode, invoiceOffice, customerName, createName, createDate, checkState, remarks } = this.invoiceInfo
      const baseInvoiceInfoList = [
        { label: '项目名称：', value: projectName || '-' },
        { label: '申请编号：', value: applyCode || '-' },
        { label: '开票单位：', value: this.formatInvoiceOffice(invoiceOffice) || '-' },
        { label: '客户名称：', value: customerName || '-' },
        { label: '申请人：', value: createName || '-' },
        { label: '申请时间：', value: createDate || '-' },
        { label: '审核状态：', value: CHECK_STATE[checkState] || '-' },
        { label: '备注：', value: remarks || '-' }
      ]
      return baseInvoiceInfoList
    },
    invoiceInfoList() {
      const { invoiceState, invoiceType, invoiceContent, invoiceAmount, invoiceTitle, taxpayerNumber, companyName, companyPhone, bankName, bankAccount } = this.invoiceInfo
      const invoiceInfoList = [
        { label: '开票状态：', value: INVOICE_STATE[invoiceState] || '-' },
        { label: '开票类型：', value: INVOICE_TYPE_OBJECT[invoiceType] || '-' },
        { label: '开票内容：', value: CONTENT_OPTIONS_TYPE_ZH[invoiceContent] || '-' },
        { label: '开票金额：', value: invoiceAmount || '-' },
        { label: '发票抬头：', value: invoiceTitle || '-' },
        { label: '纳税人识别号：', value: taxpayerNumber || '-' },
        { label: '公司注册地址：', value: companyName || '-' },
        { label: '公司电话：', value: companyPhone || '-' },
        { label: '开户行名称：', value: bankName || '-' },
        { label: '银行账号：', value: bankAccount || '-' }
      ]
      return invoiceInfoList
    },
    // 已开票信息数据
    hallInvoiceInfoList() {
      const { hallInvoice } = this.invoiceInfo
      const { invoiceNo, invoiceDate, noTaxPrice } = hallInvoice || {}
      const hallInvoiceInfoList = [
        { label: '发票号码：', value: invoiceNo || '-' },
        { label: '开票日期：', value: invoiceDate || '-' },
        { label: '不含税价格：', value: isNumber(noTaxPrice) ? noTaxPrice : '-' }
      ]
      return hallInvoiceInfoList
    },
    ...mapState({
      companyList: state => state.bill.companyList
    })

  },
  created() {
    this.isCat = !!Number(this.$route.query.isCat)
    this.getInvoiceInfo()
  },
  methods: {
    refresh() {
      this.isCat = true
      this.$message.success('操作成功')
      this.$router.push({ name: 'BillManagement', query: {
        activeName: 'invoiceList'
      }})
    },
    // 通过id获取发票信息
    getInvoiceInfo() {
      const { invoiceId } = this.$route.query
      this.$api.billApi.findInvoiceById(invoiceId).then(res => {
        // console.log(res)
        this.approveId = res.approvalFlowId
        this.invoiceInfo = res
        this.getOrderList(res)
        this.payments(res)
      })
    },
    // 返回发票列表
    gotoInvoiceList() {
      deleteTagsView(this.$route)
      this.$router.push({ name: 'BillManagement', query: {
        activeName: 'invoiceList'
      }})
    },
    // 获取合同列表
    getOrderList(invoice) {
      // const params = {
      //   projectId: invoice.projectId, customerId: invoice.customerId,
      //   pageSize: '', pageNum: ''
      // }
      // if (params.projectId === undefined || params.customerId === undefined) {
      //   this.orderData = []
      //   return false
      // }
      // this.$api.billApi.getOrderList(params).then(res => {
      //   this.orderData = res.list
      // })
      const { projectId, customerId } = invoice
      const params = { projectId, customerId }
      this.$api.billApi.getProjectFiles(params).then(res => {
        const { orderContractInfos, projectAbbreviation, projectName } = res
        this.orderData = orderContractInfos || []
        this.filesInfo = { projectAbbreviation, projectName }
      })
    },
    // 获取实收款记录
    payments(invoice) {
      const { projectId, customerId } = invoice
      const params = { payeeType: 'ORDER_PAYMENT_PLAN_ITEM', projectId, customerId, state: 'FINISHED' }
      this.$api.billApi.payments(params).then(res => {
        this.actualRecordData = res
      })
    },
    // 获取对应的开收据公司
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
@import "~@/styles/custom-theme.scss";
.catInvoice {
  margin: 20px;
  background: #fff;
  padding: 20px;
  margin-bottom: 84px;
  .title {
    // margin: 20px 0px;
    font-weight: bold;
    font-size: 18px;
    margin-bottom: 20px;
  }
  .invoiceInfo {
    .openTable {
      margin-bottom: 20px;
    }
    .title {
      font-size: 16px;
      font-family: PingFang SC;
      font-weight: 400;
      border-left: 4px solid $--custom--color--primary;
      padding-left: 6px;
    }
    .topLine{
      border-top: 1px solid #f1f1f1;
      padding: 10px;
    }
    .baseInfo {
      display: flex;
      flex-wrap: wrap;
      margin-bottom: 20px;
      .itemInfo {
        display: flex;
        margin-bottom: 10px;
        font-size: 14px;
        width: 33%;
        font-family: PingFang SC;
        font-weight: 400;
        .key {
          color: #666666;
          width:105px;
          text-align: right;
        }
        .value {
          flex: 1;
          color: #000000;
          word-break: break-all;
        }
      }
    }
    .approval {
      .appTitle {
        margin: 20px 0px;

        font-size: 18px;
        font-family: PingFang SC;
        font-weight: 400;
      }
    }
  }
  .bottomBtn{
    width: 100%;
    position: fixed;
    left: 0;
    bottom: 0;
    height: 64px;
    padding: 0 56px;
    padding-left: 200px;
    box-sizing: border-box;
    line-height: 64px;
    background: white;
    text-align: center;
    font-size: 14px;
    box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.08);
    z-index: 2;
  }
}
</style>
