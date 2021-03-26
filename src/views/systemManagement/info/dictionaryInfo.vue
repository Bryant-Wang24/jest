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
        <el-form-item label="键值" prop="value">
          <el-input v-model="ruleForm.value" />
        </el-form-item>

        <el-form-item label="标签" prop="label">
          <el-input v-model="ruleForm.label" />
        </el-form-item>

        <el-form-item label="类型" prop="type">
          <el-input v-model="ruleForm.type" />
        </el-form-item>

        <el-form-item label="排序" prop="sort">
          <el-input v-model.number="ruleForm.sort" />
        </el-form-item>

        <el-form-item label="是否必填" prop="surety">
          <el-radio-group v-model="ruleForm.surety">
            <el-radio :label="0">是</el-radio>
            <el-radio :label="1">否</el-radio>
          </el-radio-group>
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

        <el-form-item label="imageId" prop="imageId">
          <el-input v-model="ruleForm.imageId" />
        </el-form-item>

        <el-form-item label="parentId" prop="parentId">
          <el-input v-model="ruleForm.parentId" />
        </el-form-item>

        <el-form-item label="描述" prop="description">
          <el-input v-model="ruleForm.description" />
        </el-form-item>

        <el-form-item label="备注" prop="remarks">
          <el-input v-model="ruleForm.remarks" type="textarea" autosize />
        </el-form-item>

        <el-form-item v-if="!disabledForm" slot="block">
          <el-button type="primary" @click="submitForm('ruleForm')">{{
            submitBtn
          }}</el-button>
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
import officeMixins from '@/mixins/ems/office'

export default {
  name: 'KeepAlive',
  mixins: [DetailMixins, officeMixins],
  data() {
    var checkOffice = (rule, value, callback) => {
      if (!this.ruleForm.office.id || !this.ruleForm.office.name) {
        return callback(new Error('请选择归属机构'))
      } else {
        callback()
      }
    }
    return {
      exhibitionList: [],
      id: '',
      disabledForm: false,
      ruleForm: {
        label: '',
        value: '',
        type: '',
        description: '',
        sort: '',
        surety: 0,
        remarks: '',
        office: {
          id: '',
          name: ''
        },
        imageId: '',
        parentId: ''
      },
      rules: {
        label: [{ required: true, message: '请输入标签', trigger: 'blur' }],
        type: [{ required: true, message: '请输入类型', trigger: 'blur' }],
        key: [{ required: true, message: '请输入键值', trigger: 'blur' }],
        sort: [
          { required: true, message: '请输入排序' },
          { type: 'number', message: '排序必须为数字值' }
        ],
        surety: [{ required: true, message: '', trigger: 'blur' }],
        value: [{ required: true, message: '请输入键值', trigger: 'blur' }],
        office: [{ required: true, validator: checkOffice, trigger: 'change' }]
      }
    }
  },
  methods: {
    // mixins DetailMixins
    initDataFn() {
      this.getOfficeTreeData()
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          const params = this.getFormData()
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
      api.systemManagement.creatDictionary(params).then(res => {
        if (res.resultCode === 0) {
          this.$message.success('新增字典成功')
          this.closeTabByChangeData()
        }
        this.loading = false
      })
    },
    updateRow(params) {
      api.systemManagement.updateDictionary(params, this.id).then(res => {
        if (res.resultCode === 0) {
          this.$message.success('修改字典成功')
          this.closeTabByChangeData()
        }
        this.loading = false
      })
    },
    getFormData() {
      const result = JSON.parse(JSON.stringify(this.ruleForm))
      delete result.office
      result.office = {
        id: this.ruleForm.office.id
      }
      result.sort = Number(result.sort)
      return result
    },
    getOfficeNode(row) {
      const { name, id } = row
      this.ruleForm.office = { name, id }
      this.toggleOfficeTreeDialog(false)
    },
    closeTabByChangeData() {
      this.$refs.closeTabsButton.closeTabByChangeData()
    },
    getInfoById() {
      api.systemManagement.dictionaryInfo(this.id).then(res => {
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
        name: 'SystemManagementDictionary'
      })
    }
  }
}
</script>

<style lang="scss" scoped></style>
