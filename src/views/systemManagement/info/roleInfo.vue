<template>
  <Layout :use-head="false" :use-foot="true">
    <div class="roleInfo">
      <MainTitle />
      <InlineForm
        ref="ruleForm"
        :disabled="disabledForm"
        :model="ruleForm"
        :rules="rules"
      >
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

        <el-form-item label="角色名称" prop="name">
          <el-input v-model="ruleForm.name" />
        </el-form-item>

        <el-form-item label="英文名称" prop="enname">
          <el-input v-model="ruleForm.enname" />
        </el-form-item>

        <el-form-item label="角色类型" prop="roleType">
          <el-select v-model="ruleForm.roleType">
            <el-option
              v-for="item in roleTypeList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
          <div class="tip">工作流组用户组类型（任务分配：assignment、管理角色：security-role、普通角色：user）</div>
        </el-form-item>

        <el-form-item label="是否系统数据" prop="sysData">
          <el-radio-group v-model="ruleForm.sysData">
            <el-radio label="1">是</el-radio>
            <el-radio label="0">否</el-radio>
          </el-radio-group>
          <div class="tip">
            <div>"是"代表此数据只有超级管理员能进行修改</div>
            <div>"否"则表示拥有角色修改人员的权限都能进行修改</div>
          </div>
        </el-form-item>

        <el-form-item label="是否可用" prop="useable">
          <el-radio-group v-model="ruleForm.useable">
            <el-radio label="1">是</el-radio>
            <el-radio label="0">否</el-radio>
          </el-radio-group>
          <div class="tip">
            <div>"是"代表此数据可用，</div>
            <div>"否"则表示此数据不可用</div>
          </div>
        </el-form-item>

        <el-form-item label="数据范围" prop="dataScope">
          <el-select v-model="ruleForm.dataScope">
            <el-option
              v-for="item in dataScopeList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
          <div class="tip">特殊情况下，设置为"按明细设置",可进行跨机构授权</div>
        </el-form-item>

        <el-form-item label="备注">
          <el-input v-model="ruleForm.remarks" />
        </el-form-item>

        <el-form-item label="等级范围" prop="level">
          <el-input v-model="ruleForm.level" />
        </el-form-item>

        <el-form-item v-if="!disabledForm" slot="block">
          <el-button
            type="primary"
            :loading="loading"
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
      @getCurrentNode="getCurrentNode"
    />
    <CloseTabsButton ref="closeTabsButton" slot="foot" @close="back">返回</CloseTabsButton>
  </Layout>
</template>

<script>
import DetailMixins from '@/mixins/ems/DetailMixins'
import theRoleMixins from '@/views/systemManagement/mixins/role'
import api from '@/api/index'
export default {
  name: 'KeepAlive',
  components: {},
  mixins: [DetailMixins, theRoleMixins],
  data() {
    var checkOffice = (rule, value, callback) => {
      if (!this.ruleForm.office.id || !this.ruleForm.office.name) {
        return callback(new Error('请选择归属机构'))
      } else {
        callback()
      }
    }
    return {
      disabledForm: false,
      ruleForm: {
        office: {
          id: '',
          name: ''
        },
        name: '',
        enname: '',
        roleType: 'assignment',
        sysData: '1',
        dataScope: '8',
        remarks: '',
        useable: '1',
        level: ''
      },
      rules: {
        office: [{ required: true, validator: checkOffice, trigger: 'change' }],
        name: [{ required: true, message: '请输入角色名称', trigger: 'blur' }],
        enname: [{ required: true, message: '请输入角色英文名称', trigger: 'blur' }],
        roleType: [{ required: true, message: '请选择角色类型', trigger: 'change' }],
        sysData: [{ required: true, message: '请选择系统数据', trigger: 'blur' }],
        useable: [{ required: true, message: '清选择是否可用', trigger: 'blur' }],
        dataScope: [{ required: true, message: '请选择数据范围', trigger: 'blur' }],
        level: [{ required: true, message: '请输入等级范围', trigger: 'blur' }]
      },
      id: '',
      loading: false,
      submitBtn: ''
    }
  },
  methods: {
    initDataFn() {
      this.getOfficeTreeData()
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          const params = this.getFormData()
          this.loading = true
          if (this.id) {
            this.updateRole(params)
          } else {
            this.creatRole(params)
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    getFormData() {
      const result = JSON.parse(JSON.stringify(this.ruleForm))
      delete result.office.name
      return result
    },
    updateRole(params) {
      api.systemManagement.updateRole(params, this.id).then(res => {
        if (res.resultCode === 0) {
          this.$message.success('修改角色成功')
          this.closeTabByChangeData()
        }
        this.loading = false
      })
    },
    creatRole(params) {
      api.systemManagement.creatRole(params).then(res => {
        if (res.resultCode === 0) {
          this.$message.success('创建角色成功')
          this.closeTabByChangeData()
        }
        this.loading = false
      })
    },
    closeTabByChangeData() {
      this.$refs.closeTabsButton.closeTabByChangeData()
    },
    back() {
      this.$router.push({
        name: 'SystemManagementRole'
      })
    },
    getInfoById() {
      api.systemManagement.roleInfo(this.id).then(res => {
        if (res.resultCode === 0) {
          this.resetForm('ruleForm')
          this.$nextTick(() => {
            this.ruleForm = this.formatInfo(this.ruleForm, res.data)
          })
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  .roleInfo{
    .tip{
      color: #909399;
      font-size: 14px;
      line-height: 18px;
    }
  }
</style>
