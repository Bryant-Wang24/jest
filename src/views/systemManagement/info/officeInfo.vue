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
        <el-form-item label="上级机构" prop="office">
          <el-input
            v-model="ruleForm.parent.name"
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

        <el-form-item label="归属区域" prop="area">
          <el-input
            v-model="ruleForm.area.name"
            disabled
            readonly
            @focus="toggleOfficeTreeDialog"
          >
            <el-button
              slot="append"
              disabled
              type="primary"
              icon="el-icon-search"
              @click="toggleOfficeTreeDialog"
            />
          </el-input>
        </el-form-item>

        <el-form-item label="机构名称" prop="name">
          <el-input v-model="ruleForm.name" />
        </el-form-item>

        <el-form-item label="机构编码" prop="code">
          <el-input v-model="ruleForm.code" />
        </el-form-item>

        <el-form-item label="机构类型" prop="type">
          <el-select v-model="ruleForm.type" clearable filterable>
            <el-option
              v-for="item in officeTypeList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="机构级别" prop="grade">
          <el-select v-model="ruleForm.grade" clearable filterable>
            <el-option
              v-for="item in officeGradeList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="是否可用" prop="useable">
          <el-radio-group v-model="ruleForm.useable">
            <el-radio label="1">是</el-radio>
            <el-radio label="0">否</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="主负责人" prop="primaryPerson">
          <el-input
            v-model="ruleForm.primaryPerson.name"
            disabled
            readonly
            @focus="toggleOfficeTreeDialog"
          >
            <el-button
              slot="append"
              disabled
              type="primary"
              icon="el-icon-search"
              @click="toggleOfficeTreeDialog"
            />
          </el-input>
        </el-form-item>

        <el-form-item label="副负责人" prop="deputyPerson">
          <el-input
            v-model="ruleForm.deputyPerson.name"
            disabled
            readonly
            @focus="toggleOfficeTreeDialog"
          >
            <el-button
              slot="append"
              disabled
              type="primary"
              icon="el-icon-search"
              @click="toggleOfficeTreeDialog"
            />
          </el-input>
        </el-form-item>

        <el-form-item label="联系地址" prop="address">
          <el-input v-model="ruleForm.address" />
        </el-form-item>

        <el-form-item label="邮政编码" prop="zipCode">
          <el-input v-model.number="ruleForm.zipCode" />
        </el-form-item>

        <el-form-item label="负责人" prop="master">
          <el-input v-model="ruleForm.master" />
        </el-form-item>

        <el-form-item label="电话" prop="phone">
          <el-input v-model="ruleForm.phone" />
        </el-form-item>

        <el-form-item label="传真" prop="fax">
          <el-input v-model="ruleForm.fax" />
        </el-form-item>

        <el-form-item label="邮箱" prop="email">
          <el-input v-model="ruleForm.email" />
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
import theOfficeMixins from '@/views/systemManagement/mixins/office'

export default {
  name: 'KeepAlive',
  mixins: [DetailMixins, theOfficeMixins],
  data() {
    var checkArea = (rule, value, callback) => {
      if (!this.ruleForm.area.id || !this.ruleForm.area.name) {
        return callback(new Error('请选择归属地区'))
      } else {
        callback()
      }
    }
    return {
      exhibitionList: [],
      id: '',
      disabledForm: false,
      ruleForm: {
        area: {
          id: '1',
          name: '中国'
        },
        primaryPerson: {
          id: '',
          name: ''
        },
        deputyPerson: {
          id: '',
          name: ''
        },
        name: '',
        code: '',
        type: '',
        grade: '',
        address: '',
        zipCode: '',
        master: '',
        phone: '',
        fax: '',
        email: '',
        useable: '1',
        parentIds: '0',
        parent: {
          id: '0',
          name: '',
          parentIds: '0,'
        },
        remarks: ''
      },
      rules: {
        name: [{ required: true, message: '请输入机构名称', trigger: 'blur' }],
        area: [{ required: true, validator: checkArea, trigger: 'change' }]
      }
    }
  },
  methods: {
    // mixins DetailMixins
    initDataFn() {
      this.getOfficeTreeData()
      this.getParentData()
    },
    getParentData() {
      const { pId, pIds, pName } = this.$route.query
      if (pId && pIds && pName) {
        this.ruleForm.parent.id = pId
        this.ruleForm.parent.name = pName
        this.ruleForm.parent.parentIds = pIds
      }
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
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
      api.systemManagement.creatOffice(params).then(res => {
        if (res.resultCode === 0) {
          this.$message.success('新增机构成功')
          this.closeTabByChangeData()
        }
        this.loading = false
      })
    },
    updateRow(params) {
      api.systemManagement.updateOffice(params, this.id).then(res => {
        if (res.resultCode === 0) {
          this.$message.success('修改机构成功')
          this.closeTabByChangeData()
        }
        this.loading = false
      })
    },
    getFormData() {
      const result = JSON.parse(JSON.stringify(this.ruleForm))
      delete result.area.name
      delete result.primaryPerson.name
      delete result.deputyPerson.name
      delete result.parent.name
      delete result.parent.parentIds
      const parentIdsArray = this.ruleForm.parent.parentIds.split(',')
      if (!(parentIdsArray[parentIdsArray.length - 1].length > 0)) {
        parentIdsArray.pop()
      }
      parentIdsArray.push(this.ruleForm.parent.id)
      parentIdsArray.push('')
      result.parentIds = parentIdsArray.join()
      return result
    },
    getOfficeNode(row) {
      const { name, id, parentIds } = row
      this.ruleForm.parent = { name, id, parentIds }
      this.toggleOfficeTreeDialog(false)
    },
    closeTabByChangeData() {
      this.$refs.closeTabsButton.closeTabByChangeData()
    },
    getInfoById() {
      api.systemManagement.officeInfo(this.id).then(res => {
        if (res.resultCode === 0) {
          this.resetForm('ruleForm')
          this.$nextTick(() => {
            this.ruleForm = this.formatInfo(this.ruleForm, res.data)
            const parent = res.data.father || {}
            this.ruleForm.parent.id = parent.id
            this.ruleForm.parent.name = parent.name
            this.ruleForm.parent.parentIds = parent.parentIds
          })
        }
      })
    },
    back() {
      this.$router.push({
        name: 'SystemManagementOffice'
      })
    }
  }
}
</script>

<style lang="scss" scoped></style>
