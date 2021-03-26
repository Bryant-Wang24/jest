<template>
  <Layout :use-head="false" :use-foot="!result.visible" class="applay">
    <!-- <div class="applay"> -->
    <div v-if="!result.visible" class="container">
      <MainTitle :title="isEdit ? '修改发票申请' : '申请发票'" />
      <div v-if="isEdit" class="resultInfo">
        <div class="title">审核未通过</div>
        <div class="tailName"><span>审批人：</span>{{ logs.operatorName }}</div>
        <div class="approvalIdea"><span>审批意见：</span>{{ logs.remark }}</div>
      </div>
      <el-form
        ref="invoiceForm"
        :model="invoiceInfo"
        class="applayForm"
        :rules="invoiceRules"
        label-width="120px"
      >
        <el-form-item label="项目名称:" prop="projectId">
          <el-select
            v-model="invoiceInfo.projectId"
            placeholder="全部"
            filterable
            clearable
            :style="selectStyle"
            @change="getInvoiceDetails(isEdit)"
          >
            <WrapOption
              v-for="project in projectOptions"
              :key="project.projectCode"
              :style="optionStyle"
              :label="project.projectName"
              :value="project.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="选择客户:" prop="customerId">
          <el-select
            v-model="invoiceInfo.customerId"
            placeholder="全部"
            filterable
            clearable
            :style="selectStyle"
            @change="getInvoiceDetails(isEdit)"
          >
            <WrapOption
              v-for="company in customerOptions"
              :key="company.projectCode"
              :style="optionStyle"
              :label="company.customerName"
              :value="company.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="开票单位:" prop="invoiceOffice">
          <el-radio-group
            v-model="invoiceInfo.invoiceOffice"
            @change="getInvoiceDetails(isEdit)"
          >
            <el-radio
              v-for="(item, index) in companyList"
              :key="index"
              :label="item.id"
            >{{ item.companyAbbreviation }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="开票内容:" prop="invoiceContent">
          <el-select
            v-model="invoiceInfo.invoiceContent"
            placeholder="全部"
            :style="selectStyle"
            @change="getInvoiceDetails(isEdit)"
          >
            <WrapOption v-for="item in CONTENT_OPTIONS" :key="item.value" :style="optionStyle" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="开票金额:" required>
          根据您选择的开票信息,系统自动为您匹配可开票的订单与金额,您可按需要进行调整
          <InvoiceInfoTableForm ref="tableForm" :table-form.sync="tableForm" />
        </el-form-item>
        <el-form-item label="开票类型:" prop="invoiceType">
          <el-radio-group v-model="invoiceInfo.invoiceType">
            <el-radio label="VAT_INVOICE">增值税专用发票</el-radio>
            <el-radio label="ORDINARY">普通发票</el-radio>
          </el-radio-group>
        </el-form-item>
        <div class="invoice">
          <div class="title">开票信息</div>
          <el-form class="invoiceForm" :inline="true">
            <el-form-item label="发票抬头：">
              <el-input v-model="invoiceInfo.invoiceTitle" type="text" class="invoiceFormItem" />
            </el-form-item>
            <el-form-item label="纳税人识别号：">
              <el-input v-model="invoiceInfo.taxpayerNumber" type="text" class="invoiceFormItem" />
            </el-form-item><br>
            <el-form-item label="公司注册地址：">
              <el-input v-model="invoiceInfo.companyName" type="text" class="invoiceFormItem" />
            </el-form-item>
            <el-form-item label="公司电话：">
              <el-input v-model="invoiceInfo.companyPhone" type="text" class="invoiceFormItem" />
            </el-form-item><br>
            <el-form-item label="开户行名称：">
              <el-input v-model="invoiceInfo.bankName" type="text" class="invoiceFormItem" />
            </el-form-item>
            <el-form-item label="银行账号：">
              <el-input v-model="invoiceInfo.bankAccount" type="text" class="invoiceFormItem" />
            </el-form-item>
          </el-form>
        </div>
        <el-form-item label="备注:">
          <el-input
            v-model="invoiceInfo.remarks"
            type="textarea"
            style="width:480px"
          />
        </el-form-item>
      </el-form>
    </div>
    <div v-if="!result.visible" slot="foot" class="bottomBtn">
      <div class="amountWrap">
        <div class="amountWraptitle">
          申请开票总额:
          <span class="invoiceTotal">{{ invoiceTotal }}元</span>
        </div>

      </div>
      <el-button type="primary" @click="submitApplay(isEdit)">提交申请</el-button>
      <el-button @click="gotoInvoiceList">返回列表</el-button>
    </div>

    <SubmitResult v-if="result.visible" @back="resultBack" @view="resultView" />
    <!-- </div> -->
  </Layout>
</template>

<script>
import Layout from '@/components/base/Layout'
import MainTitle from '@/components/base/MainTitle'
import SubmitResult from '@/components/submitResult'
import WrapOption from '@/components/base/WrapOption'
import InvoiceInfoTableForm from './InvoiceInfoTableForm'
import { CONTENT_OPTIONS, CONTENT_OPTIONS_TYPE, CONTENT_TYPE } from '@/common/bill'
import { deleteTagsView } from '@/utils/common'
import { mapActions, mapState } from 'vuex'

export default {
  // name: 'ApplayInvoiceForm',
  components: {
    Layout,
    MainTitle,
    SubmitResult,
    InvoiceInfoTableForm,
    WrapOption
  },
  data() {
    return {
      selectStyle: { width: '480px' },
      optionStyle: { width: '480px' },
      CONTENT_OPTIONS,
      CONTENT_OPTIONS_TYPE,
      // tableData: [],
      // isDisabled: false,
      companyObj: {},
      isEdit: false,
      customerInfo: '',
      // collectionVisible: false,
      tableForm: {
        invoiceDetails: []
      },
      invoicedAmount: '',
      invoiceInfo: {
        projectId: '',
        customerId: '',
        // 默认选中国贸
        invoiceOffice: null,
        invoiceAmount: null,
        remarks: '',
        invoiceTitle: '',
        taxpayerNumber: '',
        companyName: '',
        bankName: '',
        invoiceType: '',
        bankAccount: '',
        companyPhone: '',
        invoiceContent: null
      },
      // 本次开票
      // invoiceAmount: '',
      input: '',
      invoiceRules: {
        projectId: [
          { required: true, message: '请选择项目名称', trigger: 'blur' }
        ],
        customerId: [
          { required: true, message: '请选择客户', trigger: 'blur' }
        ],
        invoiceOffice: [
          { required: true, message: '请选择开收据方', trigger: 'blur' }
        ],
        invoiceContent: [
          { required: true, message: '请选择要开票内容', trigger: 'blur' }
        ],
        // invoiceAmount: [
        //   { validator: validateAmount, required: true, trigger: 'blur' }
        // ],
        invoiceType: [
          { required: true, message: '请选择发票类型', trigger: 'blur' }
        ]
      },
      result: {
        visible: false,
        isInvoice: null,
        invoiceId: null
      },
      logs: {
        operatorName: '',
        remark: ''
      },
      invoiceId: null
    }
  },
  computed: {
    invoiceTotal() {
      let invoiceTotal = 0
      for (let i = 0; i < this.tableForm.invoiceDetails.length; i++) {
        const { amount } = this.tableForm.invoiceDetails[i]
        invoiceTotal += (Number(amount) || 0)
      }
      return invoiceTotal.toFixed(2)
    },
    ...mapState({
      projectOptions: state => state.bill.projectOptions,
      customerOptions: state => state.bill.customerOptions,
      companyList: state => state.bill.companyList
    })
  },
  activated() {
    const { invoiceId } = this.$route.query
    if (invoiceId && invoiceId !== this.invoiceId) {
      this.invoiceId = invoiceId

      this.isEdit = !!Number(this.$route.query.isEdit)
      if (this.isEdit) {
        this.getInvoiceInfo()
      }

      // 获取相关options
      this.getProjectOptions()
      this.getCustomerOptions()
      this.getCompanyList()
    }
  },
  created() {
    this.isEdit = !!Number(this.$route.query.isEdit)
    this.invoiceId = this.$route.query.invoiceId
    if (this.isEdit) {
      this.getInvoiceInfo()
    }

    // 获取相关options
    this.getProjectOptions()
    this.getCustomerOptions()
    this.getCompanyList()
  },
  methods: {
    ...mapActions('bill', ['getProjectOptions', 'getCustomerOptions', 'getCompanyList']),
    async submitApplay(isEdit) {
      this.$refs['invoiceForm'].validate(async valid => {
        const tabelFormStatus = await this.validateTableForm()

        if (valid && tabelFormStatus) {
          this.saveInvoice(isEdit)
        } else {
          this.$message.error('请按要求选择及填写')
          return false
        }
      })
    },
    // 校验table填写金额的表单
    validateTableForm() {
      return new Promise((resolve) => {
        this.$refs.tableForm.validate(valid => {
          if (valid) {
            resolve(true)
          } else {
            resolve(false)
          }
        })
      })
    },
    // 申请 / 修改发票
    saveInvoice(isEdit) {
      const invoiceOrderDetails = []

      for (let i = 0; i < this.tableForm.invoiceDetails.length; i++) {
        const row = this.tableForm.invoiceDetails[i]
        const { orderId, amount } = row

        if (amount) {
          invoiceOrderDetails.push({ orderId, amount })
        }
      }

      if (isEdit) {
        // const params = { ...this.invoiceInfo, invoiceAmount: this.invoiceTotal, invoiceOrderDetails }
        const { id, projectId, customerId, invoiceOffice, remarks, invoiceTitle, taxpayerNumber, companyName, bankName, invoiceType, bankAccount, companyPhone, invoiceContent } = this.invoiceInfo
        const params = { id, projectId, customerId, invoiceOffice, invoiceAmount: this.invoiceTotal, remarks, invoiceTitle, taxpayerNumber, companyName, bankName, invoiceType, bankAccount, companyPhone, invoiceContent, invoiceOrderDetails }

        this.$api.billApi.editInvoiceInfo(params).then(() => {
          this.showSubmitResult({ isInvoice: 1, invoiceId: this.invoiceInfo.id })
        })
      } else {
        const params = { ...this.invoiceInfo, invoiceAmount: this.invoiceTotal, invoiceOrderDetails }

        this.$api.billApi.saveInvoiceInfo(params).then(res => {
          this.showSubmitResult({ isInvoice: 1, invoiceId: res.id })
        })
      }
    },
    // 返回发票列表
    gotoInvoiceList() {
      this.$router.push({ name: 'BillManagement' })
    },
    getInvoiceInfo() {
      const { invoiceId } = this.$route.query
      this.$api.billApi.findInvoiceById(invoiceId).then(res => {
        this.invoiceInfo = res
        this.getApprovalLogs(res.approvalFlowId)
        this.getInvoiceDetails()
      })
    },
    getApprovalLogs(id) {
      if (!id) return
      this.$api.approve.getLogs(id).then(res => {
        // console.log('getApprovalLogs', res)
        const logs = res.reverse()
        for (let i = 0; i < logs.length; i++) {
          const log = res[i]
          if (log.action === 'REJECT') {
            this.logs.operatorName = log.operatorName
            this.logs.remark = log.remark
          }
        }
      })
    },
    // 获取订单明细
    getInvoiceDetails(isEdit) {
      const { invoiceId } = this.$route.query
      this.getCustomerInfo()
      const {
        projectId,
        customerId,
        invoiceOffice: companyId,
        invoiceContent
      } = this.invoiceInfo

      if (projectId && customerId && companyId && invoiceContent) {
        const params = { projectId, customerId, companyId }
        invoiceId && (params.invoiceId = invoiceId)

        this.$api.billApi.getInvoiceDetail(params).then(res => {
          const invoiceDetails = res.map(item => {
            const { availableAmountDetail, remainingAmount, amountToBeInvoiced } = item
            const { typeGroupAmount } = availableAmountDetail
            const type = CONTENT_OPTIONS_TYPE[invoiceContent]
            let invoicableAmount = null

            if (type === CONTENT_TYPE.SERVICE) {
              invoicableAmount = Math.min(typeGroupAmount.SERVICE || 0, remainingAmount)
            } else if (type === CONTENT_TYPE.RENT) {
              invoicableAmount = Math.min(typeGroupAmount.RENT || 0, remainingAmount)
            }

            return { ...item, invoicableAmount, amount: isEdit ? null : (amountToBeInvoiced || null) }
          })

          this.tableForm.invoiceDetails = invoiceDetails
        })
      }
    },

    getCustomerInfo() {
      const { customerId } = this.invoiceInfo
      if (!customerId) {
        return false
      }
      this.$api.billApi.getCustomerInfo(customerId).then(res => {
        const { customerInvoice } = res
        const { invoiceTitle, taxCode: taxpayerNumber, companyAddress: companyName, bankName, bankAccount, companyPhone, type: invoiceType } = customerInvoice
        this.invoiceInfo.invoiceTitle = invoiceTitle
        this.invoiceInfo.taxpayerNumber = taxpayerNumber
        this.invoiceInfo.companyName = companyName
        this.invoiceInfo.bankName = bankName
        this.invoiceInfo.bankAccount = bankAccount
        this.invoiceInfo.companyPhone = companyPhone
        this.invoiceInfo.invoiceType = invoiceType
      })
    },
    showSubmitResult({ isInvoice, invoiceId }) {
      this.result.visible = true
      this.result.isInvoice = isInvoice
      this.result.invoiceId = invoiceId
    },
    resultBack() {
      deleteTagsView(this.$route)
      // this.$store.dispatch('tagsView/delView', this.$route)
      this.$router.push({
        name: 'BillManagement',
        query: { activeName: 'invoiceList' }
      })
    },
    resultView() {
      deleteTagsView(this.$route)
      // this.$store.dispatch('tagsView/delView', this.$route)
      this.$router.push({
        name: 'catInvoice',
        query: {
          isCat: 1,
          invoiceId: this.result.invoiceId
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.invoicedAmount {
  display: inline-table;
  ::v-deep .el-form-item__label::before {
    width: 5px;
    height: 5px;
    color: red;
    margin-right: 4px;
    content: "*";
  }
}
.applay {
  // font-family: PingFang SC;
  // margin: 20px;
  // background: #fff;
  // padding: 20px;
  // margin-bottom: 84px;
  .container {
    // margin-bottom: 20px;
    .resultInfo {
      padding: 20px;
      background-color: #fafafa;
      font-size: 14px;
      // display: flex;
      // flex-direction: column;
      // height: 130px;
      // justify-content: space-evenly;
      margin-bottom: 20px;
      .title {
        // margin-bottom: 20px;
        font-size: 18px;
        margin-bottom: 10px;
      }
      .tailName {
        margin-bottom: 5px;
      }
      // .approvalIdea {
      // }
      span {
        color: #666;
      }
    }
    ::v-deep .el-form-item__label {
      width: 120px;
      text-align: right;
    }
    .catDetails {
      // margin-left: 90px;
      cursor: pointer;
    }
    .invoice {
      position: relative;
      padding: 20px;
      margin-left: 116px;
      margin-bottom: 20px;
      background: #fafafa;
      opacity: 1;
      .title {
        margin-bottom: 20px;
        font-weight: bold;
      }
      .invoiceForm {

        display: flex;
        flex-wrap: wrap;
        .invoiceFormItem {
          width: 400px;
        }

      }
      .el-form {
        .el-form-item {
          display: block;
        }
      }
      .el-table__row {
        width: 150px;
        .el-table_1_column_8 {
          width: 120px;
        }
      }
      .el-icon-warning{
        color: #9d9d9d;
        position: absolute;
        right: 60px;
        top: 6px;
      }
    }
    .applayForm {
      margin-left: 40px;
      // margin-bottom: 50px;
    }
  }
  .bottomBtn{
    width: 100%;
    position: fixed;
    left: 0;
    bottom: 0;
    height: 64px;
    padding: 0 56px;
    padding-left: 210px;
    box-sizing: border-box;
    line-height: 64px;
    background: white;
    text-align: center;
    font-size: 14px;
    box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.08);
    z-index: 2;
    .amountWrap {
      position: relative;
    }
    .amountWraptitle{
      position: absolute;
      left: 100px;
      display: flex;
      align-items: center;
      .invoiceTotal{
        margin-left: 10px;
        font-size: 18px;
        color: #ffc58a;
      }
    }
  }
}
</style>
