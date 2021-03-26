<template>
  <div id="addDeposit">
    <el-form ref="addFormData" :rules="addRules" :model="addFormData" class="demo-form-inline" label-width="130px">
      <el-form-item label="项目名称：" prop="projectId">
        <el-select v-model="addFormData.projectId" filterable placeholder="请选择" style="width: 480px;">
          <WrapOption
            v-for="item in projectOptions"
            :key="item.value"
            style="width: 480px;"
            :label="item.projectName"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="选择客户：" prop="customerId">
        <el-select v-model="addFormData.customerId" filterable placeholder="请选择" style="width: 480px;">
          <WrapOption
            v-for="item in customerOptions"
            :key="item.value"
            style="width: 480px;"
            :label="`${item.customerName} (客户编号：${item.idNum})`"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="押金类别：" prop="depositType">
        <el-select v-model="addFormData.depositType" filterable placeholder="请选择" style="width: 320px;">
          <WrapOption
            v-for="item in TYPE_OPTIONS"
            :key="item.value"
            style="width: 320px;"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="押金金额：" prop="totalAmount">
        <el-input v-model="addFormData.totalAmount" clearable style="width: 320px;" oninput="value=value.replace(/^\.+|[^\d.]/g,'')" />
        <span>元</span>
      </el-form-item>
      <el-form-item label="收款账户：" prop="accountId">
        <el-radio
          v-for="(item, index) in accountOptions"
          :key="index"
          v-model="addFormData.accountId"
          size="mini"
          style="width:100%"
          :label="item.id"
        >【{{ item.abbreviation }}】{{ item.name }}</el-radio>
      </el-form-item>
      <el-form-item label="备注：">
        <el-input v-model="addFormData.remark" type="textarea" placeholder="（选填）" style="width:480px" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="addSubmitForm('addFormData')">提交</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import WrapOption from '@/components/base/WrapOption'
import { TYPE_OPTIONS } from '@/common/deposit'
export default {
  components: { WrapOption },
  props: {
    projectOptions: {
      type: Array,
      default: () => []
    },
    customerOptions: {
      type: Array,
      default: () => []
    },
    accountOptions: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      TYPE_OPTIONS,
      addFormData: { // 添加押金部分数据
        projectId: '',
        customerId: '',
        depositType: '',
        totalAmount: '',
        accountId: '',
        remark: ''
      },
      addRules: {
        projectId: [
          { required: true, message: '请选择项目名称', trigger: 'blur' }
        ],
        customerId: [
          { required: true, message: '请选择客户', trigger: 'blur' }
        ],
        depositType: [
          { required: true, message: '请选择押金类别', trigger: 'blur' }
        ],
        totalAmount: [
          { required: true, message: '请输入押金金额', trigger: 'blur' }
        ],
        accountId: [
          { required: true, message: '请选择收款账户', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    // 添加押金提交
    addSubmitForm(addFormData) {
      this.$refs[addFormData].validate((valid) => {
        if (valid) {
          // 判断当前押金是否大于0，大于0才能添加押金
          if (this.addFormData.totalAmount > 0) {
            const params = {
              projectId: this.addFormData.projectId,
              customerId: this.addFormData.customerId,
              depositType: this.addFormData.depositType,
              accountId: this.addFormData.accountId,
              totalAmount: this.addFormData.totalAmount,
              remark: this.addFormData.remark
            }
            this.$api.depositMsg.addDeposit(params).then(res => {
              this.$message({
                type: 'success',
                message: '添加押金成功!'
              })
              this.addFormData.projectId = ''
              this.addFormData.customerId = ''
              this.addFormData.depositType = ''
              this.addFormData.accountId = ''
              this.addFormData.totalAmount = ''
              this.addFormData.remark = ''
              // this.onSubmit()
              this.$emit('onSubmit')
            })
          } else {
            this.$message({
              message: '押金金额大于0元才能添加押金！',
              type: 'warning'
            })
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
  }

}
</script>

<style lang="scss" scoped>
#addDeposit{
  padding-top: 25px;
  .el-form-item {
    width: 100%;
    .el-form-item__content{
      position: relative;
      span{
        position: absolute;
        top: 0;
        right: -20px;
      }
    }
  }
}
</style>
