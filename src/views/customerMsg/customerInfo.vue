<template>
  <div id="customerInfo">
    <div class="container">
      <!-- title -->
      <MainTitle title="查看客户" />
      <RowText :text="'公司信息'" />
      <CompanyInfo :form="companyFormInfo" />

      <RowText :text="'联系人信息'" />
      <ContactInfo :table-data="contactFormInfo" />

      <RowText :text="'发票信息'" />
      <InvoiceInfo :form="invoiceFromInfo" />
      <!-- 审批流组件 -->
      <ApprovalLine v-if="approveId" ref="approve" :approve-id="approveId" />
      <!-- 页面底部按钮 -->
      <div class="bottom">
        <!-- <el-button @click="hangleBack">返回</el-button> -->
        <CloseTabsButton @close="hangleBack">返回</CloseTabsButton>
        <ApprovalBtn v-if="source === 'review' && state === 'SUBMITTED'" :approve-id="approveId" :visible.sync="approveVisible" @refresh="refresh" />
      </div>
    </div>
    <!-- dialog -->
    <el-dialog
      :visible.sync="dialog.dialogShow"
      :title="dialogTitle"
      width="30%"
      :before-close="dialogClose"
      :destroy-on-close="true"
    >
      <div class="content">
        <div
          class="contentLabel"
          :class="dialog.contentType === 0 ? 'leftRequiredIcon' : ''"
        >
          {{ contentLabel }}
        </div>
        <el-input
          v-model="dialog.text"
          type="textarea"
          :rows="3"
          resize="none"
          :placeholder="dialog.contentType === 1 ? '(选填)' : ''"
        />
        <div class="errorText">{{ dialog.errorText }}</div>
      </div>
      <div slot="footer">
        <el-button @click="handleDialogCancel">取消</el-button>
        <el-button type="primary" @click="handleDialogOk">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import moment from 'moment'
import RowText from '@/components/rowText'
import CompanyInfo from './components/company/info'
import ContactInfo from './components/contact/info'
import InvoiceInfo from './components/invoice/info'
import pageMixin from '@/views/mixins/page'
import ApprovalBtn from '@/components/ApprovalOperate'
import ApprovalLine from '@/components/ApprovalLine'
import MainTitle from '@/components/base/MainTitle'
import CloseTabsButton from '@/components/base/CloseTabsButton'

moment.locale('zh-cn')
export default {
  // 页面状态两种 source[view,review]
  name: 'CustomerInfo',
  components: { CompanyInfo, InvoiceInfo, ContactInfo, RowText, ApprovalBtn, ApprovalLine, MainTitle, CloseTabsButton },
  mixins: [pageMixin],
  data() {
    return {
      approveId: null, // 审批流
      approveVisible: false, // 审批流按钮组件必传参数
      state: '',
      /**
       * @param {string} source
       * @description 用于区分当前页面操作类型，view-查看，review-审核
       */
      source: '',
      id: null,
      dialog: {
        dialogShow: false,
        title: '',
        contentType: 0, // 0拒绝，1审核
        text: '', // 拒绝原因 or 审核意见
        errorText: '' // 错误提示
      },
      companyFormInfo: {},
      contactFormInfo: [],
      invoiceFromInfo: {},
      approveList: []
    }
  },
  computed: {
    showBtn() {
      return this.source === 'review'
    },
    contentLabel() {
      return this.dialog.contentType === 0 ? '拒绝原因：' : '审批意见：'
    },
    dialogTitle() {
      return this.dialog.contentType === 0 ? '拒绝申请' : '审核通过确认'
    }
  },
  created() {
    const { id, source } = this.$route.query
    this.id = id
    this.source = source || 'view'
    console.log('this.source', this.$route.query)
    // 获取表单数据
    this.getCustomInfoFormId(id)
    // 获取审核进度
    // this.getApproveInfo(id)
  },
  methods: {
    refresh() {
      this.$message.success('操作成功')
      this.$refs.approve.refresh()
      this.getCustomInfoFormId(this.id)
    },
    getCustomInfoFormId(id) {
      // 根据id获取用户数据
      this.$api.customerMsg.getCustomInfoFormId(id).then(res => {
        // if (res.success) {
        const { constructBusinessInfo, constructCompany, constructInfos, customerInvoice, businessLicense, attachments: form_attachments, customerRequest } = res
        const {
          country,
          registerAddress,
          legalPerson,
          registerCapital,
          industry,
          businessScope,
          website,
          region,
          registerAddressEN,
          businessTime,
          companyNature,
          scale,
          briefIntroduction,
          activeState,
          postcode,
          province,
          city
        } = constructBusinessInfo
        const {
          id,
          companyName,
          taxCode,
          customerType,
          starLevel,
          abbreviation,
          nameEN,
          remarks
        } = constructCompany
        const companyInfoFormData = {
          id,
          companyName,
          taxCode,
          customerType,
          country,
          registerAddress,
          legalPerson,
          registerCapital,
          industry,
          businessScope,
          starLevel,
          website,
          abbreviation,
          nameEN,
          region,
          registerAddressEN,
          businessTime,
          companyNature,
          scale,
          briefIntroduction,
          activeState,
          postcode,
          remarks,
          businessLicense, // 营业执照数据
          form_attachments, // 附件资料
          province,
          city
        }
        //
        const contactFormData = constructInfos
        //
        const invoiceFormData = { ...customerInvoice }
        this.companyFormInfo = companyInfoFormData
        this.contactFormInfo = contactFormData
        this.invoiceFromInfo = invoiceFormData

        // 审批流
        this.approveId = customerRequest.approvalFlowId
        this.state = customerRequest.state
        // }
      })
    },
    hangleBack() {
      const { name } = this.$route
      switch (name) {
        case 'ManagementCustomerInfo':
          this.$router.push({ name: 'Management' })
          break
        case 'ApplicationCustomerInfo':
          this.$router.push({ name: 'Application' })
          break
        default:
          break
      }
      // this.$router.push({ name: 'Application' })
    },
    handleReject() {
      // this.dialog.title = '拒绝原因'
      this.dialog.contentType = 0
      this.dialog.dialogShow = true
    },
    handlePass() {
      // this.dialog.title = '审核通过确认'
      this.dialog.contentType = 1
      this.dialog.dialogShow = true
    },
    dialogClose(done) {
      this.dialog.errorText = ''
      done()
    },
    handleDialogCancel() {
      this.dialog.errorText = ''
      this.dialog.dialogShow = false
    },
    handleDialogOk() {
      const { contentType, text } = this.dialog
      const { id: userId } = this.$store.state.user.user
      const params = {
        constructCompanyId: this.id, // 客户表单id
        userId, // 审核人id
        reason: text // 拒因、备注
      }
      if (contentType === 0) {
        // 拒绝申请
        console.log(this.dialog.text)
        if (!text) {
          this.dialog.errorText = '请填写拒绝原因'
        } else {
          // 拒绝
          this.$api.customerMsg.rejectApplication(params).then(res => {
            if (res) {
              this.dialog.dialogShow = false
              this.getCustomInfoFormId(this.id)
              this.source = 'view'
              this.$message({
                message: '已拒绝',
                type: 'success',
                duration: 1000,
                onClose: () => {

                }
              })
            } else {
              this.$message.error('请求失败，请重试')
            }
          })
        }
      } else if (contentType === 1) {
        // 审核通过
        console.log(this.dialog.text)
        this.$api.customerMsg.passApplication(params).then(res => {
          if (res) {
            this.dialog.dialogShow = false
            this.getCustomInfoFormId(this.id)
            this.source = 'view'
            this.$message({
              message: '审核通过',
              type: 'success',
              duration: 1000,
              onClose: () => {

              }
            })
          } else {
            this.$message.error('请求失败，请重试')
          }
        })
      }
    },
    initDate(date) {
      return moment(date).format('YYYY-MM-DD HH:mm:ss')
    }
  }
}
</script>
<style lang="scss" scoped>
#customerInfo {
  //   height: calc(100vh - 84px);
  margin-bottom: 64px;
  padding: 20px;
  .container {
    position: relative;
    height: 100%;
    padding: 20px;
    // margin-bottom: 20px;
    background-color: #ffffff;
    .title {
      font-size: 18px;
      font-weight: bold;
      margin-bottom: 20px;
    }
    .approve {
      width: 100%;
      margin: 0 auto;
      padding: 20px;
      background: #fafafa;
      margin-top: 20px;
      .approveTitle {
        font-size: 18px;
        font-weight: bold;
        margin-bottom: 20px;
      }
    }
  }
  .bottom {
    // width: 100%;
    // height: 72px;
    // display: flex;
    // justify-content: center;
    // align-items: center;
    // // line-height: 72px;
    // // text-align: center;
    // background-color: #fff;
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
  .content {
    .contentLabel {
      font-weight: bold;
      margin-bottom: 20px;
    }
  }
  .footBtn {
    margin-top: 20px;
    width: 100%;
    text-align: right;
  }
}

.description {
  padding: 10px 0;
}
.leftRequiredIcon::before {
  content: '*';
  color: #f56c6c;
  margin-right: 4px;
}

.errorText {
  position: absolute;
  color: #f56c6c;
  font-size: 12px;
  line-height: 1;
  padding-top: 4px;
}
</style>
