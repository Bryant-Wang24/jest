<template>
  <div class="invoice">
    <el-form
      ref="ruleForm"
      :rules="rules"
      :model="invoice"
      label-width="150px"
      label-position="right"
      class="demo-ruleForm"
      :class="{'ruleForm_editNew':type==='editNew'}"
    >
      <el-form-item label="默认开票类型：" prop="type" style="width:100%">
        <el-radio-group v-if="type!=='editNew'" v-model="invoice.type" @change="get_type">
          <el-radio v-for="(item,index) of radioList" :key="index" :label="item.label">{{ item.title }}</el-radio>
        </el-radio-group>
        <div v-else class="img_span">{{ invoice.type==='ORDINARY' ? '普通发票' : '增值税专用发票' }}</div>
      </el-form-item>
      <el-form-item label="发票抬头：">
        <el-input v-if="type!=='editNew'" v-model.trim="invoice.invoiceTitle" />
        <div v-else class="img_span">{{ invoice.invoiceTitle||'-' }}</div>
      </el-form-item>
      <el-form-item label="纳税人识别号：" prop="taxCode">
        <el-input v-if="type!=='editNew'" v-model.trim="invoice.taxCode" maxlength="18" show-word-limit @input="handleChangeTaxCode" />
        <div v-else class="img_span">{{ invoice.taxCode||'-' }}</div>
      </el-form-item>
      <el-form-item label="公司注册地址：" prop="companyAddress" :rules="[{ required: (invoice.type === 'VAT_INVOICE'), message: '请输入公司注册地址', trigger: 'blur' }]">
        <el-input v-if="type!=='editNew'" v-model.trim="invoice.companyAddress" />
        <div v-else class="img_span">{{ invoice.companyAddress||'-' }}</div>
      </el-form-item>
      <el-form-item label="公司电话：" prop="companyPhone" :rules="[{ required: (invoice.type === 'VAT_INVOICE'), message: '请填写公司电话', trigger: 'blur' }]">
        <el-input v-if="type!=='editNew'" v-model.trim="invoice.companyPhone" />
        <div v-else class="img_span">{{ invoice.companyPhone||'-' }}</div>
      </el-form-item>
      <el-form-item label="开户行名称：" prop="bankName" :rules="[{ required: (invoice.type === 'VAT_INVOICE'), message: '请输入开户行名称', trigger: 'blur' }]">
        <el-input v-if="type!=='editNew'" v-model.trim="invoice.bankName" />
        <div v-else class="img_span">{{ invoice.bankName||'-' }}</div>
      </el-form-item>
      <el-form-item label="银行账号：" prop="bankAccount" :rules="[{ required: (invoice.type === 'VAT_INVOICE'), message: '请输入银行账号', trigger: 'blur' }]">
        <el-input v-if="type!=='editNew'" v-model.trim="invoice.bankAccount" />
        <div v-else class="img_span">{{ invoice.bankAccount||'-' }}</div>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import { mapGetters, mapMutations } from 'vuex'
export default {
  props: {
    invoice: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data() {
    return {
      id: this.$route.params.id,
      type: this.$route.params.type,
      labelPosition: 'right',
      radioList: [
        { label: 'VAT_INVOICE', title: '增值税专用发票' },
        { label: 'ORDINARY', title: '普通发票' }
      ],
      // invoice: {
      // type: '',
      // invoiceTitle: '',
      // taxCode: '',
      // companyAddress: '',
      // bankName: '',
      // bankAccount: ''
      // },
      rules: {
        type: [
          { required: true, message: '请选择发票类型', trigger: 'change' }
        ],
        // invoiceTitle: [{ required: (invoice.type !== 'ORDINARY'), message: '请输入发票抬头', trigger: 'blur' }],
        companyAddress: [
          { required: true, message: '请输入公司注册地址', trigger: 'blur' }
        ],
        // companyPhone: [
        //   { required: true, validator: this.checkPhonemessage, trigger: 'blur' }
        // ],
        bankName: [
          { required: true, message: '请输入开户行名称', trigger: 'blur' }
        ],
        bankAccount: [
          { required: true, message: '请输入银行账号', trigger: 'blur' }
        ],
        taxCode: [{ required: true, validator: this.validateTaxCode, trigger: 'blur' }]

      }
    }
  },
  computed: {
    ...mapGetters({
      gettertaxCode: 'taxCode'
    })
  },
  watch: {
    gettertaxCode: {
      handler(value) {
        this.invoice.taxCode = value
      },
      immediate: true
    }
  },
  // beforeDestroy() {
  //   this.setTaxCode('')
  // },
  methods: {
    get_type() {
      // this.invoice = {}
      // this.$refs.ruleForm.resetFields()
    },
    handleChangeTaxCode(value) {
      // trim
      if (value.includes(' ')) {
        return
      }
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
      if (value.length !== 18) {
        callback(new Error('请输入18位统一社会信用代码'))
      } else if (await this.getTaxCodeIsExist({ id: this.id, taxCode: value })) {
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
.invoice{
  width: 100%;
  display: inline-table;
  padding: 0 96px 20px 96px;
  box-sizing: border-box;
  .el-form {
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    .el-form-item {
      width: 46%;
      // float: left;
      ::v-deep .el-form-item__label {
        color: #000000;
        font-size: 14px;
        font-weight: 400;
      }
    }
  }
  .ruleForm_editNew{
    .el-form-item {
      margin-bottom: 10px;
      ::v-deep .el-form-item__content {
        display: flex;
        flex-wrap:wrap;
        .el-radio-group{
          margin-top: 8px;
        }
        .img_span{
          line-height: 32px;
        }
      }
    }
  }
}
</style>
