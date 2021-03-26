<template>
  <div class="enter">
    <el-form ref="enterForm" :model="formData" label-width="80px" :rules="enterRules">
      <el-form-item label="选择客户" prop="customerId">
        <el-select
          v-model="formData.customerId"
          filterable
          placeholder="请选择"
          @change="getChange(formData.customerId)"
        >
          <WrapOption
            v-for="(item, index) in options"
            :key="index"
            style="width: 480px"
            :value="String(item.id)"
            :label="`${item.customerName} (客户编号：${item.idNum})`"
          >{{ item.customerName }} <span style="{font-size:12px;color:#666;}">(客户编号：{{ item.idNum }})</span>
          </WrapOption></el-select>
      </el-form-item>
      <el-form-item label="收款方式" prop="paymentType">
        <el-select
          v-model="formData.paymentType"
          filterable
          placeholder="请选择"
        >
          <WrapOption
            v-for="item in receType"
            :key="item.value"
            style="width: 480px"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="收款账户" prop="receivableAccountId">
        <el-radio
          v-for="(item, index) in radioOptions"
          :key="index"
          v-model="formData.receivableAccountId"
          class="receAccount"
          :label="item.value"
        >{{ item.label }}</el-radio>
      </el-form-item>
      <el-form-item label="收款金额" prop="totalAmount">
        <el-input
          v-model="formData.totalAmount"
          style="width:320px"
          oninput="value=value.replace(/[^0-9.]/g,'')"
        /> 元
      </el-form-item>
      <el-form-item label="到账日期" prop="receiveTime">
        <el-col :span="18">
          <el-date-picker v-model="formData.receiveTime" value-format="yyyy-MM-dd" type="date" placeholder="选择日期" :picker-options="pickerOptions" /> <a class="checkDate divideLine" @click="checkToday">今天</a><i style="marginLeft:8px;color:#D9D9D9">|</i><a class="checkDate" @click="checkYestoday">昨天</a>
        </el-col>
      </el-form-item>
      <el-form-item label="备注">
        <el-input
          v-model="formData.remark"
          style="width:480px"
          type="textarea"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="enterAccount">提交</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import WrapOption from '@/components/base/WrapOption'
import { mapActions, mapState } from 'vuex'
// import { RECE_TYPE } from '@/common/account'
export default {
  components: { WrapOption },
  data() {
    var validateAmount = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入金额'))
      } else if (value === '0') {
        callback(new Error('金额不能为0'))
      } else if (value < 0) {
        callback(new Error('金额不能小于0！'))
      } else {
        callback()
      }
    }
    return {
      customerParams: {
        customerSimple: {
          constructCompany: {
            companyName: ''
          },
          customerRequest: { state: 'APPROVED' }
        }
      },
      radioOptions: [
      ],
      // receType: RECE_TYPE,
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now() - 8.64e6// 如果不包括今天。就是return time.getTime() > Date.now() - 24*3600*1000;
        }
      },
      enterRules: {
        customerId: [
          { required: true, message: '请选择客户名称', trigger: 'blur' }
        ],
        paymentType: [
          { required: true, message: '请选择收款方式', trigger: 'blur' }
        ],
        receivableAccountId: [
          { required: true, message: '请选择收款账户', trigger: 'blur' }
        ],
        totalAmount: [
          { validator: validateAmount, trigger: 'blur' }
        ],
        receiveTime: [
          { required: true, message: '请选择到账日期', trigger: 'change' }
        ]
      },
      customerList: [],
      formData: {
        customerId: '',
        paymentType: '',
        receivableAccountId: '',
        totalAmount: '',
        receiveTime: '',
        remark: ''
      },

      options: []
    }
  },
  computed: {
    ...mapState({
      receType: state => state.account.receType
    })
  },
  watch: {
    receType: {
      handler(receType) {
        this.formData.paymentType = receType[0]?.value || '' // 默认选中第一个收款方式
      }
    }
  },
  created() {
    this.getReceType()
    this.getCustomerList()
    this.getChange()
  },
  methods: {
    ...mapActions('account', ['getReceType']),
    getChange(value) {
      const name = ''
      this.$api.account.getReceAccount(name).then((res) => {
        const arr = []
        res.forEach((item) => {
          const option = {}
          if (item.name && item.abbreviation) {
            Object.defineProperty(option, 'value', {
              // value: item.number
              value: item.id
            })

            Object.defineProperty(option, 'label', {
              value: `【${item.abbreviation}】${item.name}`
            })
            arr.push(option)
          }
        })
        this.radioOptions = arr.length === 0 ? this.radioOptions : arr
      })
    },
    enterAccount() {
      this.$refs['enterForm'].validate((valid) => {
        if (valid) {
          this.formData.receivableAccountId = String(this.formData.receivableAccountId)
          this.$api.account.enterAccount(this.formData).then((res) => {
            this.$refs.enterForm.resetFields()
            this.$message.success('台账录入成功')
          }).catch((err) => {
            console.log(err)
            this.$message.error('台账录入失败')
          })
        } else {
          return false
        }
      })
    },
    getCustomerList() {
      this.$api.account.findCustomerAccount(this.customerParams).then((res) => {
        this.customerList = res
        this.options = res
      })
    },
    checkToday() {
      const date = new Date()
      const myTime = date.toLocaleDateString().replace(/\//g, '-')
      this.formData.receiveTime = myTime
    },
    checkYestoday() {
      const oldDate = Date.now() - 24 * 3600 * 1000
      const date = new Date(oldDate)
      const yy = date.getFullYear()
      const mm = date.getMonth() + 1
      const dd = date.getDate()
      const yestoday = `${yy}-${mm}-${dd}`
      this.formData.receiveTime = yestoday
    }
  }
}
</script>

<style lang='scss' scoped>
.enter {
  padding: 10px 20px 0;
  .checkDate{
    color:#0045FF;
    margin-left:10px;
  }
  .receAccount {
    width: 100%;
  }
  ::v-deep .el-input {
    width: 480px;
  }
  ::v-deep .el-select {
    width: 480px;
  }
  ::v-deep .el-textarea {
    width: 280px;
  }
}
</style>
