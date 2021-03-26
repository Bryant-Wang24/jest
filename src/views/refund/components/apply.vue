<template>
  <div style="background:white;padding-top:20px">
    <el-form
      ref="ruleForm"
      :model="ruleForm"
      :rules="rules"
      label-width="100px"
      class="demo-ruleForm"
    >
      <el-form-item label="项目名称：" prop="project_id">
        <el-select v-model="ruleForm.project_id" filterable placeholder="请选择项目名称" :disabled="routerName==='refundEditNew'" style="width:480px" @change="get_projectName">
          <WrapOption
            v-for="(item, index) of projectList"
            :key="index"
            style="width:480px"
            :label="item.projectName"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="选择客户：" prop="company_id">
        <el-select v-model="ruleForm.company_id" filterable :disabled="routerName==='refundEditNew'" placeholder="请选择客户" style="width:480px" @change="get_company_id">
          <WrapOption
            v-for="(item, index) of companyList"
            :key="index"
            style="width:480px"
            :label="item.customerName"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item v-if="ruleForm.company_id" prop="name">
        <div class="form_ul">
          <div class="ul_title">账户信息</div>
          <div class="li">
            <div class="name">账户名称：</div>
            <div class="input">
              <el-input v-model="from.invoiceTitle" />
            </div>
          </div>
          <div class="li">
            <div class="name">银行账号：</div>
            <div class="input">
              <el-input v-model="from.bankAccount" />
            </div>
          </div>
          <div class="li">
            <div class="name">开户行：</div>
            <div class="input">
              <el-input v-model="from.bankName" />
            </div>
          </div>
        </div>
      </el-form-item>
      <el-form-item label="退款类型：" prop="refund_type">
        <el-radio-group v-model="ruleForm.refund_type">
          <el-radio label="DEPOSIT_REFUND">押金退还</el-radio>
          <!-- <el-radio label="ORDER_REFUND">订单退款</el-radio> -->
        </el-radio-group>
      </el-form-item>
      <el-form-item label="退款条目：" class="tips_num">
        <el-button :disabled="!btnShow" @click="get_depositList">选择明细</el-button>
        <div v-if="!btnShow" style="color:red">此客户的订单存在应收款项未收款，请先完成收款</div>
      </el-form-item>
      <el-form-item v-if="deposit_list.length>0" style="width:90%">
        <table-page :table-data="deposit_list" :table-header="tableHeader">
          <el-table-column label="操作" width="100">
            <template slot-scope="scope">
              <el-button type="text" @click="delete_id(scope.$index)">删除</el-button>
            </template>
          </el-table-column>
        </table-page>
      </el-form-item>
      <el-form-item label="退款总额：">{{ (Number(gmAmount)+Number(wyAmount)).toFixed(2) }}元
        <span v-if="!isBaiMa" style="color:#666666">
          （国贸：￥{{ gmAmount||0 }} / 物业：￥{{ wyAmount||0 }}）
        </span>
      </el-form-item>
      <el-form-item label="上传附件：">
        <div>
          <div slot="tip" class="tip_title">
            只能上传jpg/png/jpeg格式的图片
          </div>
          <el-upload
            class="upload-demo"
            :action="`${base.hall}a/api/ossImage/upload`"
            :data="enclosure"
            :on-success="uploadImgSuccess"
            :before-upload="uploadBefore"
            :on-error="uploadImgError"
            :on-remove="remove"
            :before-remove="beforeRemove"
            accept=".jpg, .jpeg, .png"
            :file-list="fileList"
          >
            <el-button :loading="btnLoading">上传图片</el-button>
          </el-upload>
        </div>
      </el-form-item>
      <el-form-item label="备注：">
        <el-input v-model="ruleForm.remark" type="textarea" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" :disabled="!btnShow" @click="submit">提交申请</el-button>
      </el-form-item>
    </el-form>
    <dialog-page
      :dialog-show="dialogShow"
      title="选择明细"
      width="70%"
      @handleCancel="handleCancel"
    >
      <div class="title">所属项目：{{ projectName }}</div>
      <el-table ref="moviesTable" :row-key="getRowKeys" :data="depositData" border style="width:100%" @selection-change="handleSelectionChange" @row-click="clickRow">
        <el-table-column type="selection" width="55" :reserve-selection="true" :selectable="checkSelectable" />
        <el-table-column label="押金编号" prop="code" :show-overflow-tooltip="true" />
        <el-table-column label="客户名称" prop="customerName" :show-overflow-tooltip="true" />
        <el-table-column label="押金类别">
          <template slot-scope="scope">
            <div>{{ TYPE[scope.row.depositType] }}</div>
          </template>
        </el-table-column>
        <el-table-column label="收款账户" prop="paymentName" :show-overflow-tooltip="true" />
        <el-table-column label="已收金额" prop="receiveAmount" align="right" />
        <el-table-column label="已用金额" prop="usedAmount" align="right" />
        <el-table-column label="可退金额" :prop="routerName!=='refundEditNew'?'availableAmount':'refundAmount'" align="right" />
        <el-table-column label="备注" prop="remark" :show-overflow-tooltip="true" />
      </el-table>
      <div class="footBtn">
        <el-button type="primary" :loading="okLoading" @click="get_changeList">确定</el-button>
        <el-button @click="dialogShow = false">取消</el-button>
      </div>
    </dialog-page>
    <el-dialog :visible.sync="dialogVisible">
      <img width="100%" :src="dialogImageUrl" alt="">
    </el-dialog>
  </div>
</template>
<script>
import base from '@/api/base'
import { isBaiMa } from '@/api/base'
import DialogPage from '@/components/dialog/dialog'
import WrapOption from '@/components/base/WrapOption'
import TablePage from '@/components/table/table'
import { TYPE } from '@/common/deposit'
export default {
  components: { TablePage, DialogPage, WrapOption },
  data() {
    return {
      isBaiMa,
      TYPE,
      rules: {
        project_id: [
          { required: true, message: '请选择项目名称', trigger: 'change' }
        ],
        company_id: [
          { required: true, message: '请选择客户', trigger: 'change' }
        ],
        refund_type: [
          { required: true, message: '请选择退款类型', trigger: 'change' }
        ]

      },
      accountId: '',
      btnLoading: false,
      okLoading: false,
      base: base, // 默认路劲
      dialogShow: false,
      projectName: '',
      projectList: [],
      companyList: [],
      depositData: [],
      changeList: [],
      deposit_list: [], // 确认押金数据
      dialogVisible: false,
      dialogImageUrl: '',
      ruleForm: {
        project_id: '',
        company_id: '',
        refund_type: 'DEPOSIT_REFUND',
        remark: '',
        deposit_list: []
      },
      enclosure: {
        dataId: '',
        type: 'REFUND_ATTACHMENT'
      },
      deposit_ids: [], // 押金明细记录ids
      fileList: [],
      tableHeader: [
        { key: 'code', text: '押金编号', minWidth: '120' },
        { key: 'customerName', text: '客户名称' },
        { key: 'depositName', text: '押金类别' },
        { key: 'paymentName', text: '收款账户' },
        { key: 'receiveAmountK', text: '已收金额', align: 'right', width: '120' },
        { key: 'usedAmountK', text: '已用金额', align: 'right', width: '120' },
        { key: 'availableAmountK', text: '可退金额', align: 'right', width: '120' }
      ],
      from: {
        bankAccount: '', // 账号
        invoiceTitle: '', // 账号名称
        bankName: '' // 开户行
      },
      gmAmount: 0,
      wyAmount: 0,
      routerName: '',
      getRowKeys(row) {
        return row.id
      },
      checkSelectable(row) {
        return row.availableAmount !== 0 || row.show
      },
      idObj: {}, // 编辑时获取明细id集合
      btnShow: true

    }
  },

  created() {
    this.routerName = this.$route.name
    // if (this.routerName === 'refundEditNew') {
    //   this.get_orderState()
    // }
    // this.get_projectList()
    // this.get_getlist()
  },
  methods: {
    // 获取图片路径
    push_img_url(id, type) {
      this.$api.siteList.tupianID(id).then(res => {
        if ('data' in res) {
          if (type === '1') {
            this.accountImage.push({
              url: res.data.address,
              name: res.data.name,
              response: {
                data: [res.data],
                resultCode: 0
              }
            })
          }
        } else {
          return []
        }
      })
    },
    // 查看退款详情
    get_refundapplyNew() {
      const json = {
        id: this.$route.params.id
      }
      this.$api.refund.refundapplyNew(json).then(res => {
        if (res) {
          var list = res.deposits
          // if (!('gmCertificateIds' in res.refundApply)) {
          //   res.refundApply['gmCertificateIds'] = null
          // }
          // if (!('wyCertificateIds' in res.refundApply)) {
          //   res.refundApply['wyCertificateIds'] = null
          // }
          this.accountImage = []
          if (res.refundApply.accountImageIds !== null && res.refundApply.accountImageIds !== '') {
            var accountImageIds = res.refundApply.accountImageIds.split(',')
            res['account_image'] = accountImageIds
            // this.accountImage = []
            this.fileList = []
            for (var i in accountImageIds) {
              this.push_img_url(accountImageIds[i], '1')
            }
            this.fileList = this.accountImage
          }

          this.from = {
            applier: res.refundApply.applier,
            refundType: res.refundApply.refundType,
            refundStatus: res.refundApply.refundStatus,
            companyName: res.refundApply.companyName,
            applyNumber: res.refundApply.applyNumber,
            projectName: res.refundApply.projectName,
            createBy: res.refundApply.createBy,
            bankAccount: res.refundApply.accountNumber,
            invoiceTitle: res.refundApply.accountTitle,
            bankName: res.refundApply.bankBranch
          }
          this.ruleForm = {
            project_id: res.refundApply.projectId,
            company_id: res.refundApply.companyId,
            refund_type: res.refundApply.refundType
          }
          this.projectName = res.refundApply.projectName
          this.deposit_list = []
          this.deposit_list = this.get_deposit_list(list, 'edit')
          this.get_orderState()
        }
      })
    },
    from_null() {
      this.from.invoiceTitle = ''
      this.from.bankAccount = ''
      this.from.bankName = ''
    },
    style_display() {
      return (this.ruleForm.project_id === '' && this.ruleForm.company_id === '') ? 'true' : 'fasle'
    },

    // 项目列表
    get_projectList() {
      this.$api.refund.projectData().then(res => {
        if (res) this.projectList = res
      })
    },
    // 客户列表
    get_getlist() {
      this.$api.depositMsg.getCustomerList().then(res => {
        if (res) this.companyList = res
      })
    },
    // 选择客户
    get_company_id(val) {
      for (var i in this.companyList) {
        if (this.companyList[i].id === val) {
          this.accountId = this.companyList[i].invoiceId
          this.from.bankName = this.companyList[i].bankName
          this.from.bankAccount = this.companyList[i].bankAccount
          this.from.invoiceTitle = this.companyList[i].invoiceTitle
          this.get_orderState()
          return
        }
      }
    },
    // 获取项目名称
    get_projectName(val) {
      for (var i in this.projectList) {
        if (this.projectList[i].id === val) {
          this.projectName = this.projectList[i].projectName
          this.get_orderState()
          return
        }
      }
    },
    // 退款申请-收款金额校验接口
    get_orderState() {
      if ('project_id' in this.ruleForm && 'company_id' in this.ruleForm) {
        const json = {
          projectId: this.ruleForm.project_id,
          customerId: this.ruleForm.company_id
        }
        this.$api.refund.orderState(json).then(res => {
          this.btnShow = res
          console.log(this.btnShow)
        })
      }
    },
    // 通过项目和客户查询押金列表
    get_depositList() {
      this.dialogShow = true
      this.$api.refund.depositList({ projectId: this.ruleForm.project_id, customerId: this.ruleForm.company_id }).then(res => {
        for (var s in res) {
          if (this.routerName === 'refundEditNew' && res[s].id in this.idObj) {
            res[s]['show'] = true
          } else {
            res[s]['show'] = false
          }
          res[s]['paymentName'] = '【' + res[s].accountNameAs + '】' + res[s].accountName
        }
        this.depositData = res
        this.$refs.moviesTable.clearSelection()
        if (Number(this.depositData.length) === 0) return false
        var arr = JSON.stringify(this.deposit_list)
        var list = JSON.parse(arr)
        this.changeList = []
        for (var n in res) {
          for (var m in list) {
            if (res[n].id === list[m].id) {
              this.$refs.moviesTable.toggleRowSelection(this.depositData[n], true)
            }
          }
        }
      })
    },
    clickRow(row) {
      if (this.routerName !== 'refundEditNew') {
        if (row.availableAmount !== 0) {
          this.$refs.moviesTable.toggleRowSelection(row)
        } else {
          this.$message.warning('不可勾选,可退金额为0')
        }
      }
    },
    // 选中的数据
    handleSelectionChange(val) {
      this.changeList = val
    },
    delete_id(index) {
      this.deposit_list.splice(index, 1)
      this.gmAmount = 0
      this.wyAmount = 0
      if (Number(this.deposit_list.length) === 0) return false
      for (var i in this.deposit_list) {
        if (this.deposit_list[i].accountId === 1004) {
          this.gmAmount = Number(this.gmAmount) + this.deposit_list[i].availableAmount
        } else if (this.deposit_list[i].accountId === 1005) {
          this.wyAmount = Number(this.wyAmount) + this.deposit_list[i].availableAmount
        }
      }
    },
    get_changeList() {
      var arr = JSON.stringify(this.changeList)
      var list = JSON.parse(arr)
      this.deposit_list = this.get_deposit_list(list, 'change')
      this.dialogShow = false
    },
    get_deposit_list(list, type) {
      this.gmAmount = 0
      this.wyAmount = 0
      for (var i in list) {
        if (type === 'edit') {
          this.idObj[list[i].id] = list[i].id
        }

        if (list[i].accountId === 1004) {
          if (this.routerName !== 'refundEditNew') {
            list[i]['availableAmountK'] = '￥' + list[i].availableAmount
            this.gmAmount = Number(this.gmAmount) + list[i].availableAmount
          } else {
            if (type === 'edit') {
              list[i]['availableAmountK'] = '￥' + list[i].turnAmount
              this.gmAmount = Number(this.gmAmount) + list[i].turnAmount
            } else {
              list[i]['availableAmountK'] = '￥' + list[i].refundAmount
              this.gmAmount = Number(this.gmAmount) + list[i].refundAmount
            }
          }
          // this.gmAmount = Number(this.gmAmount) + this.routerName !== 'refundEditNew' ? list[i].availableAmount : type === 'edit' ? list[i].turnAmount : list[i].refundAmount
        } else if (list[i].accountId === 1005) {
          if (this.routerName !== 'refundEditNew') {
            list[i]['availableAmountK'] = '￥' + list[i].availableAmount
            this.wyAmount = Number(this.wyAmount) + list[i].availableAmount
          } else {
            if (type === 'edit') {
              list[i]['availableAmountK'] = '￥' + list[i].turnAmount
              this.wyAmount = Number(this.wyAmount) + list[i].turnAmount
            } else {
              list[i]['availableAmountK'] = '￥' + list[i].refundAmount
              this.wyAmount = Number(this.wyAmount) + list[i].refundAmount
            }
          }
          // this.wyAmount = Number(this.wyAmount) + this.routerName !== 'refundEditNew' ? list[i].availableAmount : type === 'edit' ? list[i].turnAmount : list[i].refundAmount
        }
        list[i]['paymentName'] = '【' + list[i].accountNameAs + '】' + list[i].accountName
        list[i]['receiveAmountK'] = '￥' + list[i].receiveAmount
        list[i]['usedAmountK'] = '￥' + list[i].usedAmount
        // list[i]['availableAmountK'] = '￥' + type === 'edit' ? list[i].turnAmount : list[i].refundAmount
        list[i]['depositName'] = list[i].depositType === 'ADVANCE_PAYMENT' ? '预付款' : list[i].depositType === 'DEPOSIT' ? '押金' : list[i].depositType === 'CONSTRUCTION_BOND' ? '施工证保证金' : '商铺押金'
      }
      return list
    },
    handleCancel() {
      this.dialogShow = false
    },
    // 上传图片成功
    uploadImgSuccess(response, file, fileList) {
      if (response.data !== 'null' && Number(response.resultCode) === 0) {
        this.$message.success(response.message)
        this.btnLoading = false
      } else {
        this.$message.error('上传失败，请重试')
        this.btnLoading = false
      }
      this.fileList = []
      for (const i in fileList) {
        if (Number(fileList[i].response.resultCode) === 0) {
          this.fileList.push(fileList[i])
        }
      }
    },
    // 删除图片
    remove(file, fileList) {
      // console.log(file)
      // console.log(fileList)
      // this.fileList = fileList
    },
    beforeRemove(file, fileList) {
      this.$api.customerMsg.deleteImage(file.response.data[0].imageId).then(res => {
        if (Number(res.resultCode) === 0) {
          this.fileList = fileList
          this.$message.success(res.message)
        }
      })
    },
    // 上传图片失败
    uploadImgError() {
      this.btnLoading = false
      this.$message.error('上传失败，请重试')
    },
    // 执照上传前
    uploadBefore(file) {
      this.btnLoading = true
      var testmsg = file.name.substring(file.name.lastIndexOf('.') + 1)
      const extension = testmsg === 'png'
      const extension2 = testmsg === 'jpg'
      const extension3 = testmsg === 'jpeg'
      if (!extension && !extension2 && !extension3) {
        this.btnLoading = false
        this.$message.error('只能上传jpg/png/jpeg格式的图片')
        return false
      }
      this.enclosure.dataId = Date.now()
    },
    // 提交申请
    submit() {
      var accountImageIds = ''
      var fileList = this.fileList
      console.log(fileList)
      for (var i in fileList) {
        accountImageIds += fileList[i].response.data[0].imageId + ','
      }
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          if (this.deposit_list.length === 0) return this.$message.warning('请选择退款条目明细')
          if (this.fileList.length === 0) return this.$message.warning('请选择上传附件')
          const refundApply = {
            accountImageIds: accountImageIds.substring(0, accountImageIds.length - 1),
            projectId: this.ruleForm.project_id,
            companyId: this.ruleForm.company_id,
            refundType: this.ruleForm.refund_type,
            accountId: this.accountId,
            accountTitle: this.from.invoiceTitle,
            accountNumber: this.from.bankAccount,
            bankBranch: this.from.bankName,
            remark: this.ruleForm.remark,
            gmAmount: this.gmAmount,
            wyAmount: this.wyAmount,
            refundAmount: (Number(this.gmAmount) + Number(this.wyAmount)).toFixed(2)
          }
          const ehRefundDeposits = []

          for (var i in this.deposit_list) {
            ehRefundDeposits.push({
              applyNumber: this.from.applyNumber,
              ehRefundApplyId: this.$route.params.id,
              refundStatus: this.from.refundStatus,
              refundAmount: this.routerName !== 'refundEditNew' ? this.deposit_list[i].availableAmount : this.deposit_list[i].refundAmount,
              ehDepositId: this.deposit_list[i].id
            })
          }
          if (this.routerName === 'refundEditNew') {
            refundApply['id'] = this.$route.params.id
            refundApply['createBy'] = { id: this.from.createBy.id }
            refundApply['applier'] = { id: this.from.applier.id }
            refundApply['applyDate'] = null
            refundApply['gmRemark'] = null
            refundApply['wyRemark'] = null
            refundApply['delFlag'] = null
            refundApply['createDate'] = null
            refundApply['updateBy'] = null
            refundApply['updateDate'] = null
            refundApply['approvalFlow'] = null
            refundApply['approvalFlowId'] = null
            refundApply['currentApproverId'] = null
            refundApply['projectName'] = this.from.projectName
            refundApply['companyName'] = this.from.companyName
            refundApply['gmCertificateIds'] = ''
            refundApply['wyCertificateIds'] = ''
            refundApply['applyNumber'] = this.from.applyNumber
            refundApply['refundStatus'] = this.from.refundStatus
            refundApply['refundType'] = this.from.refundType
          }
          this.okLoading = true
          const json = {
            refundApply: refundApply,
            ehRefundDeposits: ehRefundDeposits
          }

          if (this.routerName === 'refundEditNew') {
            this.get_refundapplyEdit(json)
          } else {
            this.get_refundapplyAdd(json)
          }
        }
      })
    },
    get_refundapplyAdd(json) {
      this.$api.refund.refundapplyAdd(json).then(res => {
        if (res) {
          this.okLoading = false
          this.$message.success('提交申请成功')
          this.$emit('click_activeName')
          this.ruleForm = {}
          this.$refs.ruleForm.resetFields()
          this.deposit_list = []
          this.changeList = []
          this.fileList = []
          this.$refs.moviesTable.clearSelection()
          this.ruleForm.refund_type = 'DEPOSIT_REFUND'
        }
      })
    },
    get_refundapplyEdit(json) {
      this.$api.refund.refundapplyEdit(json).then(res => {
        if (res) {
          this.okLoading = false
          this.$message.success('修改申请成功')
          this.ruleForm = {}
          this.$refs.ruleForm.resetFields()
          // this.$refs.moviesTable.clearSelection()
          this.deposit_list = []
          this.changeList = []
          this.fileList = []
          this.ruleForm.refund_type = 'DEPOSIT_REFUND'
          this.$router.push({
            name: 'refund'
          })
        }
      })
    }

  }
}
</script>
<style lang="scss" scoped>

.tip_title{
  font-size: 14px;
  line-height: 32px;
  color: #999999;
  margin-bottom: 8px;
}
.table_new{
  padding: 0;
  // border: 1px solid #dfe6ec;
  // border-bottom: 0;
  // border-right: 0;
  ::v-deep .el-table{
    border-top: 1px solid #dfe6ec;
    border-left: 1px solid #dfe6ec;
    th,td{
      border-right: 1px solid #dfe6ec;
    }
  }
}
.form_ul{
  width: 400px;
  padding: 20px 16px;
  background: #fafafa;
  box-sizing: border-box;
  .ul_title{
    width: 100%;
    line-height: 32px;
    font-size: 16px;
    margin-bottom: 10px;
  }
  .li{
    width: 100%;
    display: flex;
    .name{
      width: 25%;
      text-align: right;
      line-height: 32px;
      margin-bottom: 12px;
    }
    .input{
      flex: 1;
    }
  }
}
.gutter {
    width: 0;
}
.footBtn {
  width: 100%;
  margin-top: 24px;
  text-align: center;
  .el-button {
    width: 96px;
  }
}
.el-form {
  width: 100%;
  display: inline-table;
  padding: 0 24px;
  box-sizing: border-box;
  .el-form-item {
    width: 40%;
  }
}
.el-button--text{
  color: #0045FF;
}
</style>
