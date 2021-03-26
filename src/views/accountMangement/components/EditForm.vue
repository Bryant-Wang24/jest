<template>
  <el-form
    ref="editForm"
    :rules="editRules"
    label-width="100px"
    style="textAlign:center"
    :model="formData"
  >
    <el-form-item label="选择客户：" prop="customerId">
      <el-select
        v-model="formData.customerId"
        filterable
        placeholder="请选择："
        style="width:480px"
      >
        <WrapOption
          v-for="(item, index) in customerOptions"
          :key="index"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
    </el-form-item>
    <el-form-item label="收款方式：" prop="paymentType">
      <el-select
        v-model="formData.paymentType"
        filterable
        placeholder="请选择："
        style="width:480px"
      >
        <WrapOption
          v-for="item in receType"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
    </el-form-item>
    <el-form-item label="收款账户：" prop="receivableAccountId">
      <el-select
        v-model="formData.receivableAccountId"
        filterable
        placeholder="请选择："
        style="width:480px"
      >
        <WrapOption
          v-for="item in receiveAccountOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
    </el-form-item>
    <el-form-item label="收款金额：" prop="totalAmount">
      <el-input
        v-model="formData.totalAmount"
        style="width:480px"
        oninput="value=value.replace(/[^0-9.]/g,'')"
      >
        <!-- <i slot="suffix" class="el-input__icon el-icon-date" /> -->
        <span slot="suffix" style="padding-right:6px">元</span>
      </el-input>
    </el-form-item>
    <el-form-item label="到账日期：" prop="receiveTime">
      <el-date-picker
        v-model="formData.receiveTime"
        style="width:480px"
        type="date"
        placeholder="选择日期"
        value-format="yyyy-MM-dd"
        :picker-options="pickerOptions"
      />
    </el-form-item>
    <el-form-item label="备注：">
      <el-input
        v-model="formData.remark"
        placeholder="（选填）"
        style="width:480px"
        type="textarea"
      />
    </el-form-item>
  </el-form>
</template>

<script>
import WrapOption from '@/components/base/WrapOption'
export default {
  components: { WrapOption },
  props: {
    receType: {
      type: Array,
      default: () => []
    },
    receiveAccountOptions: {
      type: Array,
      default: () => []
    },
    customerOptions: {
      type: Array,
      default: () => []
    },
    formData: {
      type: Object,
      default: () => {}
    }
  },
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
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now() - 8.64e6 // 如果不包括今天。就是return time.getTime() > Date.now() - 24*3600*1000;
        }
      },
      editRules: {
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
          { validator: validateAmount, trigger: 'blur' }],
        receiveTime: [
          { required: true, message: '请选择到账日期', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    validate(cb) {
      this.$refs['editForm'].validate((valid) => {
        if (valid) {
          cb(valid)
        } else {
          cb(false)
        }
      })
    }
  }

}
</script>

<style lang="scss" scoped>

</style>
