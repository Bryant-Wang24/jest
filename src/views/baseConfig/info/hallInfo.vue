<template>
  <Layout :use-head="false" :use-foot="true">
    <div>
      <MainTitle />
      <InlineForm
        ref="ruleForm"
        :disabled="disabledForm"
        :model="ruleForm"
        :rules="rules"
      >
        <el-form-item label="展馆" prop="exhall">
          <el-input v-model="ruleForm.exhall" />
        </el-form-item>

        <el-form-item label="展馆地址" prop="address">
          <el-input v-model="ruleForm.address" />
        </el-form-item>

        <el-form-item label="联系人" prop="linkman">
          <el-input v-model="ruleForm.linkman" />
        </el-form-item>

        <el-form-item label="电话" prop="phone">
          <el-input v-model.number="ruleForm.phone" />
        </el-form-item>

        <el-form-item label="打印模板" prop="printModel">
          <el-select v-model="ruleForm.printModel">
            <el-option
              v-for="item in printModelList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="备注" prop="remarks">
          <el-input v-model="ruleForm.remarks" type="textarea" autosize />
        </el-form-item>

        <el-form-item v-if="!disabledForm" slot="block">
          <el-button :loading="loading" type="primary" @click="submitForm('ruleForm')">{{
            submitBtn
          }}</el-button>
          <el-button @click="resetForm('ruleForm')">重置</el-button>
        </el-form-item>
      </InlineForm>
    </div>
    <CloseTabsButton
      ref="closeTabsButton"
      slot="foot"
      @close="back"
    >返回</CloseTabsButton>
  </Layout>
</template>

<script>
import api from '@/api/index'
import DetailMixins from '@/mixins/ems/DetailMixins'

export default {
  name: 'KeepAlive',
  mixins: [DetailMixins],
  data() {
    return {
      id: '',
      disabledForm: false,
      ruleForm: {
        exhall: '',
        address: '',
        linkman: '',
        phone: '',
        printModel: 'SHEN_ZHEN_PRINT',
        remarks: ''
      },
      rules: {
        exhall: [{ required: true, message: '请输入展馆名称', trigger: 'blur' }]
      },
      printModelList: [
        {
          value: 'SHEN_ZHEN_PRINT',
          label: '深圳打印模板'
        },
        {
          value: 'NAN_NING_PRINT',
          label: '南宁打印模板'
        },
        {
          value: 'QING_DAO_PRINT',
          label: '青岛打印模板'
        },
        {
          value: 'BAI_MA_PRINT',
          label: '白马打印模板'
        }
      ],
      loading: false
    }
  },
  methods: {
    // mixins DetailMixins
    initDataFn() {
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          const params = this.getFormData()
          this.loading = true
          if (this.id) {
            params.id = this.id
            this.updateRow(params)
          } else {
            this.creatRow(params)
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    creatRow(params) {
      api.baseConfig.creatHall(params).then(res => {
        if (res.resultCode === 0) {
          this.$message.success('新增展馆成功')
          this.closeTabByChangeData()
        }
        this.loading = false
      })
    },
    updateRow(params) {
      api.baseConfig.updateHall(params, this.id).then(res => {
        if (res.resultCode === 0) {
          this.$message.success('修改展馆成功')
          this.closeTabByChangeData()
        }
        this.loading = false
      })
    },
    getFormData() {
      const result = JSON.parse(JSON.stringify(this.ruleForm))
      return result
    },
    closeTabByChangeData() {
      this.$refs.closeTabsButton.closeTabByChangeData()
    },
    getInfoById() {
      api.baseConfig.hallInfo(this.id).then(res => {
        if (res.resultCode === 0) {
          this.resetForm('ruleForm')
          this.$nextTick(() => {
            this.ruleForm = this.formatInfo(this.ruleForm, res.data)
          })
        }
      })
    },
    back() {
      this.$router.push({
        name: 'BaseConfigHall'
      })
    }
  }
}
</script>

<style lang="scss" scoped></style>
