<template>
  <div class="catInvoice">
    <!-- <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path:'/BillManagement/bill/receiptList'}">收据列表</el-breadcrumb-item>
      <el-breadcrumb-item>查看收据</el-breadcrumb-item>
    </el-breadcrumb> -->
    <MainTitle title="查看发票" />
    <!-- <rowText text="查看收据" class="rowText" /> -->
    <div class="invoiceInfo">
      <RowText text="基本信息" class="rowText" />
      <div class="baseInfo">
        <div v-for="(item,index) in baseInvoiceInfoList" :key="index" class="itemInfo">
          <div class="key">{{ item.label }}</div>
          <div class="value">{{ item.value }}</div>
        </div>
      </div>
    </div>
    <div class="invoiceInfo diviline">
      <div class="baseInfo" style="margin-bottom:0;">
        <div class="itemInfo">
          <div class="key">开收据金额：</div>
          <div class="value">￥{{ receiptInfo.receiptAmount }}</div>
        </div>
        <div class="itemInfo">
          <div class="key">收据状态：</div>
          <div class="value">{{ RECEIPT_STATE[receiptInfo.receiptState] || '-' }}</div>
        </div>
      </div>
      <div class="openTable" style="margin-bottom:20px;">
        <div class="key" style="font-size:14px;color:#666666;margin-bottom:20px;">收款明细:</div>
        <TableItem ref="tableData" :is-receipt-cat="false" :is-invoice="false" :table-data="tableData" />
      </div>
      <!-- <div class="approval">
        <div class="appTitle">审批流程</div>
        <approval-process />
      </div> -->
      <!-- 审批流组件 -->
      <ApprovalLine ref="approve" :approve-id="approveId" />

    </div>
    <!-- <div v-if="isCat" class="bottombtn">
      <el-button class="bottomBtn" @click="gotoReceiptList">返回</el-button>
    </div> -->
    <div class="bottombtn">
      <el-button class="bottomBtn" @click="gotoReceiptList">返回</el-button>
      <ApprovalBtn v-if="!isCat" :approve-id="approveId" :visible.sync="approveVisible" @refresh="refresh" />
      <!-- <el-button class="bottomBtn" @click="showPop(false)">拒绝申请</el-button>
      <el-button class="bottomBtn" type="primary" @click="showPop(true)">审核通过</el-button> -->
    </div>
    <el-dialog
      :title="title"
      :visible.sync="auditpop"
      width="30%"
    >
      <el-form v-if="isPass" v-model="formData">
        <el-form-item label="审批意见：">
          <el-input v-model="formData.reason" type="textarea" placeholder="选填" />
        </el-form-item>
      </el-form>
      <el-form v-else ref="advanceForm" :rules="advanceRules" :model="formData">
        <el-form-item label="拒绝原因：" prop="reason">
          <el-input v-model.trim="formData.reason" type="textarea" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="auditpop = false">取 消</el-button>
        <el-button type="primary" @click="trailApplay(isPass)">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import TableItem from './tableItem'
// import ApprovalProcess from './approvalProcess'
import RowText from '@/components/rowText'
import MainTitle from '@/components/base/MainTitle'
import ApprovalBtn from '@/components/ApprovalOperate'
import ApprovalLine from '@/components/ApprovalLine'
import { mapState } from 'vuex'
import { CHECK_STATE, RECEIPT_STATE } from '@/common/bill'
// import InvoiceInfo from './invoiceInfo'
export default {
  components: {
    TableItem,
    // ApprovalProcess,
    RowText,
    ApprovalBtn,
    ApprovalLine,
    MainTitle
  },
  data() {
    return {
      CHECK_STATE,
      RECEIPT_STATE,
      approveId: null, // 审批流
      approveVisible: false, // 审批流按钮组件必传参数
      formData: {
        reason: ''
      },
      isPass: '',
      tableData: [],
      auditpop: false,
      title: '拒绝申请',
      isCat: 1,
      reverse: true,
      receiptInfo: {},
      activities: [
        {
          content: '活动按期开始',
          timestamp: '2018-04-15'
        },
        {
          content: '通过审核',
          timestamp: '2018-04-13'
        },
        {
          content: '创建成功',
          timestamp: '2018-04-11'
        }
      ],
      advanceRules: {
        reason: [
          { required: true, message: '请填写拒绝原因', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    baseInvoiceInfoList() {
      const { projectName, applyCode, receiptOffice, customer, createName, createDate, checkState, remarks } = this.receiptInfo
      const baseInvoiceInfoList = [
        { label: '项目名称：', value: projectName || '-' },
        { label: '申请编号：', value: applyCode || '-' },
        { label: '开收据方：', value: this.formatInvoiceOffice(receiptOffice) || '-' },
        { label: '客户名称：', value: customer || '-' },
        { label: '申请人：', value: createName || '-' },
        { label: '申请时间：', value: createDate || '-' },
        { label: '审核状态：', value: CHECK_STATE[checkState] || '-' },
        { label: '备注：', value: remarks || '-' }
      ]
      return baseInvoiceInfoList
    },
    ...mapState({
      companyList: state => state.bill.companyList
    })
  },
  created() {
    // this.isCat = this.$route.params.isCat
    // this.receiptInfo = this.$route.params.receipt ? this.$route.params.receipt : {}
    this.isCat = !!Number(this.$route.query.isCat)

    this.receiptId = this.$route.query.receiptId
    // 获取收据信息
    this.getReceipt(this.$route.query.receiptId)
  },
  methods: {
    refresh() {
      this.isCat = true
      this.$message.success('操作成功')
      this.$router.push({ name: 'BillManagement', query: {
        activeName: 'receiptList'
      }})
      // this.$refs.approve.refresh()
      // this.getReceipt(this.$route.query.receiptId)
    },
    getReceipt(receiptId) {
      // const id = this.$route.params.receipt.id
      this.$api.billApi.getReceiptById(receiptId).then(res => {
        this.approveId = res.approvalFlow?.id
        this.tableData = res.deposits
        this.receiptInfo = res.receiptApply
        console.log('deposit', res)
      }).catch(err => {
        this.$message.error(err.statusText)
      })
    },
    showPop(isPass) {
      this.title = isPass ? '审核通过确认' : '拒绝申请'
      this.isPass = isPass
      this.auditpop = true
      console.log('showpop', this.isPass)
    },
    // 拒绝请求
    rejectApplay() {
      const id = this.$route.query.receiptId
      const params = `id=${id}&reason=${this.formData.reason}`
      this.$api.billApi.trailReceiptReject(params).then(res => {
        console.log('res', res)
      }).catch(err => {
        this.$message.error(err.statusText)
      })
    },
    // 通过请求
    passApplay() {
      const id = this.$route.query.receiptId
      const params = `id=${id}&reason=${this.formData.reason}`
      this.$api.billApi.trailReceiptPass(params).then(res => {
        console.log('res', res)
      }).catch(err => {
        this.$message.error(err.statusText)
      })
    },
    trailApplay() {
      if (this.isPass) {
        this.passApplay()
        this.isCat = true
        this.auditpop = false
      } else {
        this.$refs['advanceForm'].validate((valid) => {
          if (valid) {
            this.rejectApplay()
            this.isCat = true
            this.auditpop = false
          } else {
            this.$message.error('请按要求填写')
            return false
          }
        })
      }

      this.getReceipt(this.$route.query.receiptId)
    },
    gotoReceiptList() {
      this.$router.push({ name: 'BillManagement', query: {
        activeName: 'receiptList'
      }})
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
    margin: 20px 0px;
    font-size: 18px;
  }
  .diviline{
    border-top: 1px solid #D9D9D9;
    padding-top: 20px;
    width: 100%;
  }
  .invoiceInfo {
    .rowText {
      margin-bottom: 20px;
    }
    .title {
      font-size: 16px;
      font-family: PingFang SC;
      font-weight: 400;
      border-left: 4px solid $--custom--color--primary;
      padding-left: 6px;
    }
    .baseInfo {
      display: flex;
      flex-wrap: wrap;
      margin-bottom: 10px;
      .itemInfo {
        display: flex;
        margin-bottom: 10px;
        font-size: 14px;
        width: 33%;
        font-family: PingFang SC;
        font-weight: 400;
        .key {
          color: #666666;
          //  width:105px;
          text-align: right;
        }
        .value {
          color: #000000;
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
  .bottombtn{
    // margin-top: 50px;
    // text-align: center;
    // // border-top: 1px solid #D9D9D9;
    // padding-top: 10px;
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
