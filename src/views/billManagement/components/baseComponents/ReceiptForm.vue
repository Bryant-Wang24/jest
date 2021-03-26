<template>
  <Layout :use-head="false" :use-foot="false" :auto-height="true" class="applay">
    <!-- <div class="applay"> -->
    <div v-if="!result.visible">
      <MainTitle :title="isEdit?'修改收据申请':'申请收据'" />
      <div v-if="isEdit" class="resultInfo">
        <div class="title">审核未通过</div>
        <!-- <div class="tailName"><span>审批人：</span>{{ receiptInfo.updateBy ? receiptInfo.updateBy.name : '' }}</div>
        <div><span>审批意见：</span>{{ receiptInfo.approvalIdea }}</div> -->
        <div class="tailName"><span>审批人：</span>{{ logs.operatorName }}</div>
        <div><span>审批意见：</span>{{ logs.remark }}</div>
      </div>
      <el-form
        ref="receiptForm"
        class="applayForm"
        label-width="110px"
        :model="receiptInfo"
        :rules="receiptRules"
      >
        <el-form-item label="项目名称:" prop="projectId">
          <el-select
            v-model="receiptInfo.projectId"
            placeholder="全部"
            filterable
            clearable
            :style="selectStyle"
            @change="getDeposit"
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
            v-model="receiptInfo.customerId"
            placeholder="全部"
            filterable
            clearable
            :style="selectStyle"
            @change="getDeposit"
          >
            <WrapOption
              v-for="company in customerOptions"
              :key="company.id"
              :style="optionStyle"
              :label="company.customerName"
              :value="Number(company.id)"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="开收据方:" prop="receiptOffice">
          <el-radio-group
            v-model="receiptInfo.receiptOffice"
            @change="getDeposit"
          >
            <el-radio v-for="(item,index) in companyList" :key="index" :label="String(item.id)">{{ item.companyAbbreviation }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="选择押金:" prop="deposits">
          <div class="deposit">
            已选择<span> {{ depositNum }} </span>项，合计：<span>￥{{ receiptInfo.receiptAmount }}</span>
          </div>
          <br>
          <TableItem
            ref="tableData"
            :table-data="tableData"
            :multiple-selection="multipleSelection"
            @handleSelect="handleSelect"
          />
        </el-form-item>
        <el-form-item label="开收据金额:" prop="receiptAmount">
          <span style="color: #ff0000">{{ receiptInfo.receiptAmount }}</span>
        </el-form-item>
        <el-form-item label="备注:">
          <el-input
            v-model="receiptInfo.remarks"
            type="textarea"
            style="width: 480px"
          />
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            @click="submitApplay(isEdit, false)"
          >提交申请</el-button>
          <el-button @click="gotoReceiptList">返回列表</el-button>
        </el-form-item>
      </el-form>
    </div>
    <SubmitResult v-if="result.visible" @back="resultBack" @view="resultView" />
  <!-- </div> -->
  </Layout>
</template>

<script>
// import billApi from '@/api/bill'
import Layout from '@/components/base/Layout'
import NP from 'number-precision'
import TableItem from '../tableItem'
import WrapOption from '@/components/base/WrapOption'
import MainTitle from '@/components/base/MainTitle'
import SubmitResult from '@/components/submitResult'
import { mapActions, mapState } from 'vuex'
// import InvoiceInfo from './invoiceInfo'
export default {
  components: {
    MainTitle,
    TableItem,
    SubmitResult,
    WrapOption,
    Layout
  },
  data() {
    return {
      selectStyle: { width: '480px' },
      optionStyle: { width: '480px' },
      isFirst: false,
      depositArr: [],
      receiptFlag: '',
      depositNum: 0,
      collectionVisible: false,
      isEdit: 0,
      tableData: [],
      receiptId: '',
      receiptInfo: {
        projectId: '',
        customerId: '',
        receiptOffice: '',
        remarks: '',
        deposits: [],
        receiptAmount: 0
      },
      multipleSelection: [],
      receiptRules: {
        projectId: [
          { required: true, message: '请选择项目名称', trigger: 'blur' }
        ],
        customerId: [
          { required: true, message: '请选择客户', trigger: 'blur' }
        ],
        receiptOffice: [
          { required: true, message: '请选择开收据方', trigger: 'blur' }
        ],
        deposits: [
          { type: 'array', required: true, message: '请至少选择一个活动性质', trigger: 'blur' }
        ],
        receiptAmount: [
          { required: true, message: '请输入金额', trigger: 'blur' }
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
      }
    }
  },
  computed: {
    ...mapState({
      projectOptions: state => state.bill.projectOptions,
      customerOptions: state => state.bill.customerOptions,
      companyList: state => state.bill.companyList
    })
  },
  activated() {
    const receiptId = this.$route.query.receiptId
    if (receiptId && receiptId !== this.receiptId) {
      this.isEdit = !!Number(this.$route.query.isEdit)

      this.receiptId = this.$route.query.receiptId
      // 获取收据信息
      if (this.isEdit) {
        this.getReceiptInfo(this.$route.query.receiptId)
      }

      // 获取相关options
      this.getProjectOptions()
      this.getCustomerOptions()
      this.getCompanyList()
    }
  },
  created() {
    this.isEdit = !!Number(this.$route.query.isEdit)

    this.receiptId = this.$route.query.receiptId
    // 获取收据信息
    if (this.isEdit) {
      this.getReceiptInfo(this.$route.query.receiptId)
    }

    // 获取相关options
    this.getProjectOptions()
    this.getCustomerOptions()
    this.getCompanyList()
  },

  methods: {
    ...mapActions('bill', ['getProjectOptions', 'getCustomerOptions', 'getCompanyList']),
    // 申请收据
    submitApplay(isEdit, isInvoice) {
      this.$refs['receiptForm'].validate((valid) => {
        if (valid) {
          if (isEdit) {
            this.editReceipt(isInvoice)
          } else {
            this.saveReceipt(isInvoice)
          }
        } else {
          this.$message.error('请按要求选择')
          return false
        }
      })
    },

    // 收据信息
    getReceiptInfo(receiptId) {
      this.$api.billApi.getReceiptById(receiptId).then((res) => {
        this.depositArr = res.deposits
        this.multipleSelection = res.deposits
        this.receiptInfo = res.receiptApply
        const approvalId = res?.approvalFlow?.id
        this.getAllDeposit()
        this.getApprovalLogs(approvalId)
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
    editReceipt(isInvoice) {
      this.receiptId = this.receiptInfo.id
      const params = this.receiptInfo
      Reflect.deleteProperty(params, 'createBy')
      Reflect.deleteProperty(params, 'createDate')
      Reflect.deleteProperty(params, 'updateBy')
      Reflect.deleteProperty(params, 'updateDate')
      this.$api.billApi.editReceiptInfo(this.receiptInfo).then(() => {
        this.showSubmitResult({ isInvoice, receiptId: this.receiptId })
      })
    },
    saveReceipt(isInvoice) {
      this.$api.billApi.saveReceiptInfo(this.receiptInfo).then((res) => {
        this.showSubmitResult({ isInvoice, receiptId: res.id })
      })
    },
    // 未开收据押金列表
    getDeposit() {
      const receipt = {
        projectId: this.receiptInfo.projectId,
        customerId: this.receiptInfo.customerId,
        state: this.isEdit ? '' : 0,
        companyId: this.receiptInfo.receiptOffice
      }
      if (receipt.projectId && receipt.customerId && receipt.companyId) {
        const templateFlag = `${receipt.projectId}${receipt.customerId}${receipt.companyId}`
        this.isFirst = this.receiptFlag === templateFlag

        // this.multipleSelection = this.isFirst ? this.depositArr : []
        // this.multipleSelection = this.depositArr
        this.$api.billApi.getDepositList(receipt).then((res) => {
          this.$refs['tableData'].$refs.multipleTable.clearSelection()
          this.multipleSelection = []
          // this.multipleSelection = this.isFirst ? this.depositArr : []
          this.tableData = res || []
        })
      }
    },
    // 全部押金列表
    getAllDeposit() {
      const receipt = {
        projectId: this.receiptInfo.projectId,
        customerId: this.receiptInfo.customerId,
        companyId: this.receiptInfo.receiptOffice
      }
      if (receipt.projectId && receipt.customerId && receipt.companyId) {
        this.receiptFlag = `${receipt.projectId}${receipt.customerId}${receipt.companyId}`
        this.$api.billApi.getDepositList(receipt).then((res) => {
          this.tableData = res || []
        })
      }
    },
    handleSelect(val) {
      // 获取押金数量

      this.depositNum = val.length
      // 开票金额
      const amount = val.reduce((acc, cur) => {
        if (cur) {
          acc = NP.plus(acc, NP.minus(cur.receiveAmount, cur.turnAmount, cur.usedAmount))
          // acc = acc + cur.receiveAmount - cur.turnAmount - cur.usedAmount
          return acc
        }
      }, 0)
      this.receiptInfo.receiptAmount = amount || 0

      // 押金id
      // this.$set(this.receiptInfo, 'deposits', val.reduce((acc, cur) => {
      //   if (cur) {
      //     acc.push(cur.id)
      //     return acc
      //   }
      // }, []))
      this.$set(this.receiptInfo, 'deposits', val.map(t => t.id))
    },
    // 返回到收据列表页面
    gotoReceiptList() {
      this.$router.push({ name: 'BillManagement', query: { activeName: 'receiptList' }})
    },
    showSubmitResult({ isInvoice, receiptId }) {
      this.result.visible = true
      this.result.isInvoice = isInvoice
      this.result.receiptId = receiptId
    },
    resultBack() {
      this.$store.dispatch('tagsView/delView', this.$route)
      this.$router.push({ name: 'BillManagement', query: { activeName: 'receiptList' }})
    },
    resultView() {
      this.$store.dispatch('tagsView/delView', this.$route)
      this.$router.push({
        name: 'catReceipt',
        query: {
          isCat: 1,
          receiptId: this.result.receiptId
        }
      })
    }
  }
}
</script>

<style lang='scss' scoped>
.applay {
  // margin: 20px;
  // background: #fff;
  // padding: 20px;
  .resultInfo{
    padding: 20px;
    background-color: #fafafa;
    font-size: 14px;
    // display: flex;
    // flex-direction: column;
    // height: 130px;
    // justify-content: space-evenly;
    margin-bottom:20px;
    .title {
      font-size: 18px;
      margin-bottom: 10px;
    }
    .tailName {
      margin-bottom: 5px;
    }
    span{
      color:#666;
    }
  }
  ::v-deep .el-form-item__label {
    width: 90px;
    text-align: right;
  }
  .pageTitle {
    font-size: 18px;
    font-weight: 700;
    margin-bottom: 20px;
  }
  .deposit {
    margin-bottom: -28px;
    font-size: 14px;
    color: #000000;
    span {
      color: #ff0000;
    }
  }
}
</style>
