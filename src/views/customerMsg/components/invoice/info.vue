<template>
  <div class="info">
    <el-row>
      <el-col :span="8">
        <div class="formItem">
          <div class="label">默认开票类型：</div>
          <div class="value">
            <el-radio-group v-model="form.type">
              <el-radio
                v-for="item in types"
                :key="item.value"
                :disabled="item.value !== form.type"
                :label="item.value"
              >{{ item.label }}</el-radio>
              <!-- <el-radio disabled :label="0">备选项</el-radio>
              <el-radio disabled :label="1">备选项</el-radio> -->
            </el-radio-group>
          </div>
        </div>
        <div class="formItem">
          <div class="label">发票抬头：</div>
          <div class="value">{{ form.invoiceTitle }}</div>
        </div>
        <div class="formItem">
          <div class="label">公司注册地址：</div>
          <div class="value">{{ form.companyAddress }}</div>
        </div>
        <div class="formItem">
          <div class="label">开户行名称：</div>
          <div class="value">{{ form.bankName }}</div>
        </div>
      </el-col>
      <el-col :span="8">
        <div class="formItem">
          <div class="label">纳税人识别号</div>
          <div class="value">{{ form.taxCode }}</div>
        </div>
        <div class="formItem">
          <div class="label">公司电话</div>
          <div class="value">{{ form.companyPhone }}</div>
        </div>
        <div class="formItem">
          <div class="label">银行账号</div>
          <div class="value">{{ form.bankAccount }}</div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
// const types = [
//   { label: 0, value: '增值税专用发票' },
//   { label: 1, value: '普通发票' }
// ]
import { INVOICE_TYPE } from '@/common/customerMsg'
export default {
  props: {
    form: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data() {
    return {
      types: INVOICE_TYPE
      // form: {
      //   type: 1,
      //   header: '123',
      //   address: 'asdasda',
      //   bankName: 'asdasd',
      //   number: '123123231',
      //   tel: '12312312321',
      //   bankNumber: '啊实打实的'
      // }
    }
  },
  computed: {
    // type: function() {
    //   return type[this.form.type]
    // }
  },
  mounted() {
    console.log('form', this.form)
  },
  methods: {}
}
</script>
<style lang="scss" scoped>
.info {
  padding: 20px 0;
  font-size: 14px;
}
.formItem {
  display: flex;
  margin-bottom: 14px;
  .label {
    width: 160px;
    margin-right: 10px;
    text-align: right;
    color: #666;
  }
  .value {
    flex: 1;
    word-wrap: break-word;
    img {
      margin-right: 6px;
    }
  }
}
</style>
