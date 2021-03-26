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

        <el-form-item label="键值" prop="key">
          <el-input v-model="ruleForm.key" />
        </el-form-item>

        <el-form-item label="数值" prop="value">
          <el-input v-model="ruleForm.value" />
        </el-form-item>

        <el-form-item label="展会" prop="exhibitionId">
          <el-select v-model="ruleForm.exhibitionId" clearable filterable>
            <el-option
              v-for="item in exhibitionList"
              :key="item.id"
              :label="item.exhibitionName"
              :value="item.id"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="用法" prop="usage">
          <el-input v-model="ruleForm.usage" />
        </el-form-item>

        <el-form-item label="归属机构" prop="office">
          <el-input
            v-model="ruleForm.office.name"
            readonly
            @focus="toggleOfficeTreeDialog"
          >
            <el-button
              slot="append"
              type="primary"
              icon="el-icon-search"
              @click="toggleOfficeTreeDialog"
            />
          </el-input>
        </el-form-item>

        <el-form-item label="备注" prop="remarks">
          <el-input
            v-model="ruleForm.remarks"
            type="textarea"
            autosize
          />
        </el-form-item>

        <el-form-item v-if="!disabledForm" slot="block">
          <el-button
            type="primary"
            @click="submitForm('ruleForm')"
          >{{ submitBtn }}</el-button>
          <el-button @click="resetForm('ruleForm')">重置</el-button>
        </el-form-item>
      </InlineForm>

    </div>
    <DialogTree
      title="选择机构"
      :show-checkbox="false"
      :visible.sync="officeTreeDialogVisible"
      :data="officeTreeData"
      @getCurrentNode="getOfficeNode"
    />
    <CloseTabsButton ref="closeTabsButton" slot="foot" @close="back">返回</CloseTabsButton>
  </Layout>
</template>

<script>
import api from '@/api/index'
import DetailMixins from '@/mixins/ems/DetailMixins'
import officeMixins from '@/mixins/ems/office'
import exhibitionMixins from '@/mixins/ems/exhibition'

export default {
  name: 'KeepAlive',
  mixins: [DetailMixins, officeMixins, exhibitionMixins],
  data() {
    return {
      exhibitionList: [],
      id: '',
      disabledForm: false,
      ruleForm: {
        key: '',
        value: '',
        exhibitionId: '',
        usage: '',
        companyId: '',
        remarks: '',
        office: {
          id: '',
          name: ''
        }
      },
      rules: {
        key: [{ required: true, message: '请输入键值', trigger: 'blur' }],
        value: [{ required: true, message: '请输入数值', trigger: 'blur' }],
        exhibitionId: [{ required: true, message: '请选择展会', trigger: 'blur' }]
      }

    }
  },
  methods: {
    // mixins DetailMixins
    initDataFn() {
      this.getOfficeTreeData()
      this.getExhibitionData()
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          const params = this.getFormData()
          if (this.id) {
            params.id = this.id
            this.updateSysConfig(params)
          } else {
            this.creatSysConfig(params)
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    creatSysConfig(params) {
      api.systemManagement.creatSysConfig(params).then(res => {
        if (res.resultCode === 0) {
          this.$message.success('新增系统配置成功')
          this.closeTabByChangeData()
        }
        this.loading = false
      })
    },
    updateSysConfig(params) {
      api.systemManagement.updateSysConfig(params, this.id).then(res => {
        if (res.resultCode === 0) {
          this.$message.success('修改系统配置成功')
          this.closeTabByChangeData()
        }
        this.loading = false
      })
    },
    getFormData() {
      const result = JSON.parse(JSON.stringify(this.ruleForm))
      delete result.office
      return result
    },
    getOfficeNode(row) {
      const { name, id } = row
      this.ruleForm.office = { name, id }
      this.ruleForm.companyId = id
      this.toggleOfficeTreeDialog(false)
    },
    closeTabByChangeData() {
      this.$refs.closeTabsButton.closeTabByChangeData()
    },
    getInfoById() {
      api.systemManagement.sysConfigInfo(this.id).then(res => {
        if (res.resultCode === 0) {
          this.resetForm('ruleForm')
          this.$nextTick(() => {
            this.ruleForm = Object.assign(this.ruleForm, res.data)
          })
        }
      })
    },
    back() {
      this.$router.push({
        name: 'SystemManagementSysConfig'
      })
    }
  }
}
</script>

<style lang="scss" scoped></style>
