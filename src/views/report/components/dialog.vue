<template>
  <div>
    <dialog-page :dialog-show="dialogShow" width="31.25%" title="导出报表" @handleCancel="handleCancel">
      <div class="new">
        <div class="new_title">{{ title }}</div>
        <el-form ref="form" size="small" :model="form" :rules="rules" label-width="100px">
          <el-form-item label="项目类型：" prop="projectType">
            <el-select v-model="form.projectType" multiple placeholder="请选择类型">
              <WrapOption v-for="(item,index) of siteTypeOptions" :key="index" :disabled="disabled(item)" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
          <el-form-item :label="show==='0'?'时间：':'年份：'" required style="margin-bottom:0">
            <el-col :span="show==='0'?11:24">
              <el-form-item prop="year">
                <el-date-picker
                  v-model="form.year"
                  type="year"
                  value-format="yyyy"
                  format="yyyy"
                  placeholder="请选择年份"
                />
              </el-form-item>
            </el-col>
            <el-col v-if="show==='0'" :span="12" :offset="1">
              <el-form-item :prop="show==='0' ? 'month' :''">
                <el-select v-model="form.month" placeholder="请选择日期">
                  <WrapOption v-for="(item,index) of monthList" :key="index" :label="item.label" :value="item.value" />
                </el-select>
              </el-form-item>

            </el-col>
          </el-form-item>
          <el-form-item v-if="show==='0'" label="收款单位：" prop="receiptedAccountId">
            <el-select v-model="form.receiptedAccountId" placeholder="请选择收款单位">
              <WrapOption v-for="(item,index) of accountList" :key="index" :label="item.abbreviation" :value="item.id" />
            </el-select>
          </el-form-item>
        </el-form>
        <div class="footbtn">
          <el-button
            type="primary"
            @click="submitForm"
          >导出报表</el-button>
          <el-button
            @click="handleCancel"
          >取消</el-button>
        </div>
      </div>
    </dialog-page>
  </div>
</template>
<script>
import DialogPage from '@/components/dialog/dialog'
import WrapOption from '@/components/base/WrapOption'
export default {
  components: { DialogPage, WrapOption },
  props: {
    currentData: {
      type: Object,
      default: () => {}
    },
    dialogType: {
      type: Object,
      default: () => {}
    },
    siteTypeOptions: {
      type: Array,
      default: () => []
    },

    dialogShow: {
      type: Boolean,
      default: false
    },
    show: {
      type: String,
      default: '0'
    },
    title: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      // disabled: false,
      form: {
        projectType: [],
        receiptedAccountId: '',
        year: '',
        month: ''
      },
      accountList: [],
      monthList: [
        { label: '所有', value: '0' },
        { label: '1月份', value: '01' },
        { label: '2月份', value: '02' },
        { label: '3月份', value: '03' },
        { label: '4月份', value: '04' },
        { label: '5月份', value: '05' },
        { label: '6月份', value: '06' },
        { label: '7月份', value: '07' },
        { label: '8月份', value: '08' },
        { label: '9月份', value: '09' },
        { label: '10月份', value: '10' },
        { label: '11月份', value: '11' },
        { label: '12月份', value: '12' }
      ],
      rules: {
        projectType: [
          { required: true, message: '请选择项目类型', trigger: 'change' }
        ],
        receiptedAccountId: [
          { required: true, message: '请选择收款单位', trigger: 'change' }
        ],
        year: [
          { required: true, message: '请选择', trigger: 'change' }
        ],
        month: [
          { required: true, message: '请选择', trigger: 'change' }
        ]
      }
    }
  },
  computed: {
  },
  watch: {
    dialogShow(val) {
      if (!val) {
        // this.form = {}
        this.$refs.form.resetFields()
      }
    }
  },

  created() {
    this.setAccountList()
  },
  methods: {
    disabled(item) {
      if (this.currentData.type !== this.dialogType.fieldArea) return false
      if (this.form.projectType.length === 0) return false
      const value = this.form.projectType[0]
      const filterItems = this.siteTypeOptions.filter(t => t.value === value)
      const currentType = filterItems[0].type
      return item.type !== currentType
    },
    // 银行账号
    setAccountList() {
      this.$api.priceList.accountList({ number: '' }).then(res => {
        if (res) {
          for (var i in res) {
            if (res[i].number === 'GZPOLY_GM' || res[i].number === 'GZPOLY_WY') {
              this.accountList.push(res[i])
            }
          }
        }
      })
    },
    handleCancel() {
      this.$emit('handleCancel')
    },
    submitForm() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.$emit('submitForm', this.form)
        }
      })
    }
  }
}
</script>
<style scoped lang="scss">
.el-date-editor{
  width: 100%;
}
.el-dialog__wrapper{
  ::v-deep.el-dialog{
    .el-dialog__body{
      padding-top: 0;
    }
  }
}
.new{
  width: 100%;
  .new_title{
    width: 100%;
    font-size: 12px;
    color: #999999;
    line-height: 32px;
    font-weight: 400;
    margin-bottom: 20px;
  }
  .footbtn{
    width: 100%;
    text-align: center;
    .el-botton{
      width: 76px;
    }
  }
}
</style>
