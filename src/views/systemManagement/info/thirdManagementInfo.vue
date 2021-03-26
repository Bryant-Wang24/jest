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
        <el-form-item label="归属公司" prop="company">
          <el-input
            v-model="ruleForm.company.label"
            readonly
            @focus="toggleCompanyTreeDialog"
          >
            <el-button
              v-if="!disabledForm"
              slot="append"
              icon="el-icon-search"
              @click="toggleCompanyTreeDialog"
            />
          </el-input>
        </el-form-item>

        <el-form-item label="归属部门" prop="office">
          <el-input
            v-model="ruleForm.office.label"
            readonly
            @focus="toggleOfficeTreeDialog"
          >
            <el-button
              v-if="!disabledForm"
              slot="append"
              icon="el-icon-search"
              @click="toggleOfficeTreeDialog"
            />
          </el-input>
        </el-form-item>

        <el-form-item label="头像" prop="photo">
          <el-input v-model="ruleForm.photo" />
        </el-form-item>

        <el-form-item label="工号" prop="no">
          <el-input v-model="ruleForm.no" />
        </el-form-item>

        <el-form-item label="姓名" prop="name">
          <el-input v-model="ruleForm.name" />
        </el-form-item>

        <el-form-item label="性别" prop="gender">
          <el-radio-group v-model="ruleForm.gender">
            <el-radio label="0">男</el-radio>
            <el-radio label="1">女</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="密码" prop="pwd">
          <el-input v-model="ruleForm.pwd" show-password placeholder="若不修改密码，请留空" />
        </el-form-item>

        <el-form-item label="确认密码" prop="confirmPwd">
          <el-input v-model="ruleForm.confirmPwd" show-password />
        </el-form-item>

        <el-form-item label="登录名" prop="loginName">
          <el-input v-model="ruleForm.loginName" />
        </el-form-item>

        <el-form-item label="手机" prop="mobile">
          <el-input v-model="ruleForm.mobile" />
        </el-form-item>

        <el-form-item label="固定电话" prop="phone">
          <el-input v-model="ruleForm.phone" />
        </el-form-item>

        <el-form-item label="是否允许登录" prop="loginFlag">
          <el-radio-group v-model="ruleForm.loginFlag">
            <el-radio label="0">是</el-radio>
            <el-radio label="1">否</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="用户类型" prop="userType">
          <el-radio-group v-model="ruleForm.userType">
            <el-radio label="0">系统管理</el-radio>
            <el-radio label="1">部门经理</el-radio>
            <el-radio label="2">普通用户</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="用户角色" prop="roleList">
          <el-select v-model="ruleForm.roleList" multiple placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="备注" prop="remarks">
          <el-input v-model="ruleForm.remarks" />
        </el-form-item>

        <el-form-item label="创建时间" prop="name">
          <el-input v-model="ruleForm.name" />
        </el-form-item>

        <el-form-item label="最后登录" prop="name">
          <el-input v-model="ruleForm.name" />
        </el-form-item>

        <el-form-item v-if="!disabledForm" slot="block">
          <el-button
            type="primary"
            @click="submitForm('ruleForm')"
          >立即创建</el-button>
          <el-button @click="resetForm('ruleForm')">重置</el-button>
        </el-form-item>
      </InlineForm>

      <DialogTree
        title="选择公司"
        :visible.sync="companyTreeDialogVisible"
        :data="companyTreeData"
        @getCurrentNode="getCompanyCurrentNode"
      />

      <DialogTree
        title="选择部门"
        :visible.sync="officeTreeDialogVisible"
        :data="officeTreeData"
        @getCurrentNode="getOfficeCurrentNode"
      />
    </div>
    <CloseTabsButton slot="foot" @close="back">返回</CloseTabsButton>
  </Layout>
</template>

<script>
import Layout from '@/components/base/Layout'
import InlineForm from '@/components/base/InlineForm'
import MainTitle from '@/components/base/MainTitle'
import DialogTree from '@/components/base/DialogTree'
import CloseTabsButton from '@/components/base/CloseTabsButton'
import api from '@/api/index'
import companyMixins from '@/mixins/ems/company'
import officeMixins from '@/mixins/ems/office'
export default {
  name: 'KeepAlive',
  components: {
    Layout,
    InlineForm,
    MainTitle,
    DialogTree,
    CloseTabsButton
  },
  mixins: [companyMixins, officeMixins],
  data() {
    const validateCompany = (rule, value, callback) => {
      if (!this.ruleForm.company.label || !this.ruleForm.company.id) {
        callback('请选择归属公司')
      } else {
        callback()
      }
    }
    const validateOffice = (rule, value, callback) => {
      if (!this.ruleForm.office.label || !this.ruleForm.office.id) {
        callback('请选择归属部门')
      } else {
        callback()
      }
    }
    const validateConfirmPwd = (rule, value, callback) => {
      if (!value) {
        callback('请输入确认密码')
      } else {
        if (this.ruleForm.pwd === this.ruleForm.confirmPwd) {
          callback()
        } else {
          callback('请输入相同的密码')
        }
      }
    }
    return {
      //  mixins
      // companyTreeData: [],
      // companyTreeDialogVisible: false,
      // officeTreeData: [],
      // officeTreeDialogVisible: false,

      id: '',
      disabledForm: false,
      ruleForm: {
        company: {
          id: '',
          label: ''
        },
        roleList: [],
        office: {
          id: '',
          label: ''
        },
        loginName: '',
        name: '',
        mobile: '',
        loginFlag: '0',
        channel: '',
        status: '',
        no: '',
        phone: '',
        email: '',
        gender: '0',
        userType: '0',
        photo: '',
        qrCode: '',
        remarks: '',
        pwd: '',
        confirmPwd: ''
      },
      rules: {
        company: [
          { required: true, validator: validateCompany, trigger: 'blur' }
        ],
        office: [
          { required: true, validator: validateOffice, trigger: 'blur' }
        ],
        name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
        no: [{ required: true, message: '请输入工号', trigger: 'blur' }],
        loginName: [
          { required: true, message: '请输入登录名', trigger: 'blur' }
        ],
        pwd: [{ required: true, message: '请输入密码', trigger: 'blur' }],
        confirmPwd: [
          { required: true, validator: validateConfirmPwd, trigger: 'blur' }
        ]
      },
      options: [
        {
          value: '选项1',
          label: '黄金糕'
        },
        {
          value: '选项2',
          label: '双皮奶'
        },
        {
          value: '选项3',
          label: '蚵仔煎'
        },
        {
          value: '选项4',
          label: '龙须面'
        },
        {
          value: '选项5',
          label: '北京烤鸭'
        }
      ]
    }
  },
  created() {
    this.disabledForm = !!this.$route.meta.disabledForm
  },

  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          console.log('submit!')
          const params = this.formatParam()
          if (this.id) {
            params.id = this.id
            this.updateUser(params)
          } else {
            this.creatUser(params)
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    creatUser(params) {
      api.systemManagement.creatUser(params).then(res => {})
    },
    updateUser(params) {
      api.systemManagement.updateUser(params).then(res => {})
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
    formatParam() {
      const params = Object.assign({}, this.ruleForm)
      delete params.company.label
      delete params.office.label
      return params
    },
    back() {
      this.$router.push({
        name: 'SystemManagementThirdManagement'
      })
    },
    getCompanyCurrentNode(row) {
      this.ruleForm.company = row
      this.$refs.ruleForm.validateField('company')
      this.toggleCompanyTreeDialog(false)
    },

    getOfficeCurrentNode(row) {
      this.ruleForm.office = row
      this.$refs.ruleForm.validateField('office')
      this.toggleOfficeTreeDialog(false)
    }

  }
}
</script>

<style lang="scss" scoped></style>
