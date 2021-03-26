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
            v-model="ruleForm.company.name"
            readonly
            @focus="toggleCompanyTreeDialog"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="toggleCompanyTreeDialog"
            />
          </el-input>
        </el-form-item>

        <el-form-item label="归属部门" prop="office">
          <el-input
            v-model="ruleForm.office.name"
            :disabled="disabledOffice"
            readonly
            @focus="toggleOfficeTreeDialog"
          >
            <el-button
              slot="append"
              :disabled="disabledOffice"
              icon="el-icon-search"
              @click="toggleOfficeTreeDialog"
            />
          </el-input>
        </el-form-item>

        <!-- <el-form-item label="头像" prop="photo">
          <el-input v-model="ruleForm.photo" />
        </el-form-item> -->

        <el-form-item label="工号" prop="no">
          <el-input v-model="ruleForm.no" />
        </el-form-item>

        <el-form-item label="姓名" prop="name">
          <el-input v-model="ruleForm.name" />
        </el-form-item>

        <el-form-item label="登录名" prop="loginName">
          <el-input v-model="ruleForm.loginName" />
        </el-form-item>

        <el-form-item label="性别" prop="gender">
          <el-radio-group v-model="ruleForm.gender">
            <el-radio :label="0">男</el-radio>
            <el-radio :label="1">女</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="密码" prop="password">
          <el-input v-model="ruleForm.password" show-password placeholder="若不修改密码，请留空" />
        </el-form-item>

        <el-form-item label="确认密码" prop="confirmPwd">
          <el-input v-model="ruleForm.confirmPwd" show-password />
        </el-form-item>

        <el-form-item label="手机" prop="mobile">
          <el-input v-model="ruleForm.mobile" />
        </el-form-item>

        <el-form-item label="邮箱" prop="email">
          <el-input v-model="ruleForm.email" />
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
            <el-radio label="1">系统管理</el-radio>
            <el-radio label="2">部门经理</el-radio>
            <el-radio label="3">普通用户</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="用户角色" prop="roleList">
          <el-select v-model="ruleForm.roleList" multiple clearable filterable placeholder="请选择">
            <el-option
              v-for="item in roleList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="备注" prop="remarks">
          <el-input v-model="ruleForm.remarks" />
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

      <DialogTree
        title="选择公司"
        :visible.sync="companyTreeDialogVisible"
        :data="companyTreeData | noChild"
        @getCurrentNode="getCompanyCurrentNode"
      />

      <DialogTree
        title="选择部门"
        :visible.sync="officeTreeDialogVisible"
        :data="officeTreeData | inCompany(ruleForm)"
        @getCurrentNode="getCurrentNode"
      />
    </div>
    <CloseTabsButton ref="closeTabsButton" slot="foot" @close="back">返回</CloseTabsButton>
  </Layout>
</template>

<script>
import api from '@/api/index'
import DetailMixins from '@/mixins/ems/DetailMixins'
import theUserMixins from '@/views/systemManagement/mixins/user'
import { emailRegExp } from '@/utils/regExp'

export default {
  name: 'KeepAlive',
  components: {},
  filters: {
    noChild(val) {
      return val.map(item => {
        delete item.childItems
        return item
      })
    },
    inCompany(val, ruleForm) {
      return val.filter(item => {
        return item.id === ruleForm.company.id
      })
    }
  },
  mixins: [DetailMixins, theUserMixins],
  data() {
    const validateCompany = (rule, value, callback) => {
      console.log(this.ruleForm)
      if (!this.ruleForm.company.name || !this.ruleForm.company.id) {
        return callback('请选择归属公司')
      } else {
        callback()
      }
    }
    const validateOffice = (rule, value, callback) => {
      if (!this.ruleForm.office.name || !this.ruleForm.office.id) {
        return callback('请选择归属部门')
      } else {
        callback()
      }
    }
    const validateEmail = (rule, value, callback) => {
      if (value && !emailRegExp.test(value)) {
        return callback('请输入正确的邮箱')
      } else {
        callback()
      }
    }
    return {
      //  mixins
      companyTreeData: [],
      companyTreeDialogVisible: false,
      officeTreeData: [],
      // officeTreeDialogVisible: false,

      id: '',
      disabledForm: false,
      ruleForm: {
        company: {
          id: '',
          name: ''
        },
        roleList: [],
        office: {
          id: '',
          name: ''
        },
        loginName: '',
        name: '',
        mobile: '',
        loginFlag: '0',
        channel: 'MOBILE',
        status: '',
        no: '',
        phone: '',
        email: '',
        gender: 0,
        userType: '3',
        photo: '',
        qrCode: '',
        remarks: '',
        password: '',
        confirmPwd: ''
      },
      rules: {
        company: [
          { required: true, validator: validateCompany, trigger: 'change' }
        ],
        office: [
          { required: true, validator: validateOffice, trigger: 'change' }
        ],
        email: [
          { validator: validateEmail, trigger: 'change' }
        ],
        name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
        no: [{ required: true, message: '请输入工号', trigger: 'blur' }],
        loginName: [
          { required: true, message: '请输入登录名', trigger: 'blur' }
        ],
        roleList: [
          { required: true, type: 'array', message: '请选择至少一个角色', trigger: 'change' }
        ]
      }
    }
  },
  computed: {
    noCompany() {
      return !(this.ruleForm.company.name && this.ruleForm.company.id)
    },
    disabledOffice() {
      return this.disabledForm || this.noCompany
    }
  },
  methods: {
    initDataFn() {
      this.getOfficeTreeData()
      this.getRoleByUserId()
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          const params = this.formatParam()
          this.loading = true
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
    formatParam() {
      const params = {
        company: {
          id: this.ruleForm.company.id
        },
        roleList: this.ruleForm.roleList,
        office: {
          id: this.ruleForm.office.id
        },
        loginName: this.ruleForm.loginName,
        name: this.ruleForm.name,
        mobile: this.ruleForm.mobile,
        loginFlag: this.ruleForm.loginFlag,
        channel: this.ruleForm.channel,
        status: this.ruleForm.status,
        no: this.ruleForm.no,
        phone: this.ruleForm.phone,
        email: this.ruleForm.email,
        gender: this.ruleForm.gender,
        userType: this.ruleForm.userType,
        photo: this.ruleForm.photo,
        qrCode: this.ruleForm.qrCode,
        remarks: this.ruleForm.remarks,
        password: this.ruleForm.password
      }
      params.roleList = params.roleList.map(item => {
        return { id: item }
      })
      return params
    },
    creatUser(params) {
      api.systemManagement.creatUser(params).then(res => {
        if (res.resultCode === 0) {
          this.$message.success('新增用户成功')
          this.closeTabByChangeData()
        }
        this.loading = false
      })
    },
    updateUser(params) {
      api.systemManagement.updateUser(params).then(res => {
        if (res.resultCode === 0) {
          this.$message.success('修改用户成功')
          this.closeTabByChangeData()
        }
        this.loading = false
      })
    },
    closeTabByChangeData() {
      this.$refs.closeTabsButton.closeTabByChangeData()
    },
    getInfoById() {
      console.log(api.systemManagement)
      api.systemManagement.userInfo(this.id).then(res => {
        if (res.resultCode === 0) {
          this.resetForm('ruleForm')
          this.ruleForm = Object.assign(this.ruleForm, res.data)
          this.ruleForm.roleList = this.ruleForm.roleList.map(item => {
            return item.id
          })
        }
      })
    },
    getOfficeTreeData() {
      api.systemManagement.officeTreeData().then(res => {
        this.companyTreeData = JSON.parse(JSON.stringify(res))
        this.officeTreeData = JSON.parse(JSON.stringify(res))
      })
    },
    getCompanyCurrentNode(row) {
      const { name, id } = row
      this.ruleForm.company = { name, id }
      this.ruleForm.office.id = ''
      this.ruleForm.office.name = ''
      this.toggleCompanyTreeDialog(false)
    },
    toggleCompanyTreeDialog(isOpen) {
      this.companyTreeDialogVisible = !!isOpen
    },
    back() {
      this.$router.push({
        name: 'SystemManagementUser'
      })
    }

  }
}
</script>

<style lang="scss" scoped></style>
