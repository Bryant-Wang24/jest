<template>
  <div id="invoice">
    <el-form ref="form" :model="form" label-width="160px" class="demo-ruleForm">
      <el-row>
        <el-col :span="8">
          <el-form-item
            label="默认开票类型"
            prop="type"
            :rules="[
              { required: true, message: '请选择开票类型', trigger: 'change' }
            ]"
          >
            <el-radio-group v-model="form.type">
              <el-radio
                v-for="item in type"
                :key="item.value"
                :label="item.value"
              >{{ item.label }}</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="发票抬头" prop="invoiceTitle">
            <el-input v-model="form.invoiceTitle" placeholder="请输入" />
          </el-form-item>
          <el-form-item
            label="公司注册地址"
            prop="companyAddress"
            :rules="[
              {
                required: (form.type === type[0].value),
                message: '请填写公司注册地址',
                trigger: 'blur'
              }
            ]"
          >
            <el-input v-model.trim="form.companyAddress" placeholder="请输入" />
          </el-form-item>
          <el-form-item
            label="开户行名称"
            prop="bankName"
            :rules="[
              {
                required: (form.type === type[0].value),
                message: '请填写开户行名称',
                trigger: 'blur'
              }
            ]"
          >
            <el-input v-model.trim="form.bankName" placeholder="请输入" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item style="height:36px;" />
          <el-form-item
            label="纳税人识别号"
            prop="taxCode"
            :rules="[
              { required: true,
                validator: validateTaxCode,
                trigger: 'blur'
              }
            ]"
          >
            <el-input
              v-model.trim="form.taxCode"
              maxlength="18"
              show-word-limit
              placeholder="请输入"
              @input="handleChangeTaxCode"
            />
          </el-form-item>
          <el-form-item
            label="公司电话"
            prop="companyPhone"
            :rules="[
              {
                required: (form.type === type[0].value),
                message: '请填写公司电话',
                trigger: 'blur'
              }
            ]"
          >
            <el-input v-model.trim="form.companyPhone" placeholder="请输入" />
          </el-form-item>
          <el-form-item
            label="银行账号"
            prop="bankAccount"
            :rules="[
              {
                required: (form.type === type[0].value),
                message: '请填写银行账号',
                trigger: 'blur'
              }
            ]"
          >
            <el-input v-model.trim="form.bankAccount" placeholder="请输入" />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script>
import { INVOICE_TYPE } from '@/common/customerMsg'
import { mapGetters, mapMutations } from 'vuex'
export default {
  name: 'Invoice',
  props: {
    model: {
      // 当有model时为编辑
      type: Object,
      default: null
    }
  },
  data() {
    return {
      type: INVOICE_TYPE,
      form: {
        constructCompanyId: null,
        id: null,
        type: INVOICE_TYPE[0].value,
        invoiceTitle: '',
        companyAddress: '',
        bankName: '',
        taxCode: '',
        companyPhone: '',
        bankAccount: ''
      }
    }
  },
  computed: {
    ...mapGetters({
      gettertaxCode: 'taxCode'
    })
  },
  watch: {
    model(formData) {
      // console.log('iiiiiiiiiiiiiiiiiiii', formData)
      this.form = { ...formData }
    },
    gettertaxCode: {
      handler(value) {
        this.form.taxCode = value
      },
      immediate: true
    }
  },
  mounted() {
    console.log('iiiiiiiiiiiiiiiiiiii', this.model)
  },
  methods: {
    handleChangeTaxCode(value) {
      // trim
      if (value.includes(' ')) {
        return
      }
      console.log('handleChangeTaxCode')
      this.setTaxCode(value)
    },
    async getTaxCodeIsExist(value) {
      // 接口
      const res = await this.$api.customerMsg.checkTaxCode(value)
      if (res) {
        return true
      }
      return false
    },
    async validateTaxCode(rule, value, callback) {
      console.log('发票')
      if (value.length !== 18) {
        console.log(value.length)
        callback(new Error('请输入18位统一社会信用代码'))
      } else if (await this.getTaxCodeIsExist({ id: this.form.constructCompanyId, taxCode: value })) {
        // 通过接口检查是否已存在
        callback(new Error('统一社会信用代码已存在'))
      } else {
        callback()
      }
    },
    ...mapMutations('customerMsg', {
      setTaxCode: 'SET_TAXCODE'
    })
  }
}
</script>
<style lang="scss" scoped>
#invoice {
  padding: 20px 0;
}
</style>
