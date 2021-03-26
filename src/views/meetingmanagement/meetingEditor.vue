<template>
  <Layout :use-head="false" :use-foot="false" :auto-height="true">
    <div>
      <MainTitle />
    </div>
    <el-form ref="form" :model="form" label-width="120px">
      <el-form-item label="会议室">
        <el-select v-model="form.room" placeholder="请选择活动区域">
          <el-option label="会议室" value="shanghai" />
        </el-select>
      </el-form-item>
      <el-form-item label="计划开始时间">
        <el-col :span="11">
          <el-time-picker v-model="form.date1" placeholder="选择时间" :style="formStyle" />
        </el-col>
      </el-form-item>
      <el-form-item label="计划结束时间">
        <el-col :span="11">
          <el-time-picker v-model="form.date2" placeholder="选择时间" :style="formStyle" />
        </el-col>
      </el-form-item>
      <el-form-item label="会议名称">
        <el-input v-model="form.name" placeholder="请填写会议名称" :style="formStyle" />
      </el-form-item>
      <el-form-item label="会议组织者">
        <el-input v-model="form.person" placeholder="请填写会议组织者" :style="formStyle" />
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="onSubmit">保存</el-button>
        <el-button>取消</el-button>
      </el-form-item>
    </el-form>
  </Layout>
</template>

<script>
import Layout from '@/components/base/Layout'
import MainTitle from '@/components/base/MainTitle'
import TablePager from '@/components/base/TablePager'

export default {
  components: { Layout, MainTitle, TablePager },
  data() {
    return {
      formStyle: { width: '480px' },
      form: {
        room: '',
        date1: '',
        date2: '',
        name: '',
        person: ''
      },
      rules: {
        room: [
          { required: true, message: '请输入活动名称', trigger: 'blur' }
          // { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        date1: [
          { required: true, message: '请选择时间', trigger: 'change' }
        ],
        date2: [
          { type: 'date', required: true, message: '请选择时间', trigger: 'change' }
        ],
        name: [
          { type: 'date', required: true, message: '', trigger: 'change' }
        ],
        person: [
          { type: 'array', required: true, message: '请至少选择一个活动性质', trigger: 'change' }
        ]
      }
    }
  },
  methods: {
    onSubmit() {
      console.log('submit!')
    }
  }
}

// export default {
//   name: 'KeepAlive',
//   components: {},
//   filters: {
//     noChild(val) {
//       return val.map(item => {
//         delete item.childItems
//         return item
//       })
//     },
//     inCompany(val, ruleForm) {
//       return val.filter(item => {
//         return item.id === ruleForm.company.id
//       })
//     }
//   },
//   mixins: [DetailMixins, theUserMixins],
//   data() {
//     const validateCompany = (rule, value, callback) => {
//       console.log(this.ruleForm)
//       if (!this.ruleForm.company.name || !this.ruleForm.company.id) {
//         return callback('请选择归属公司')
//       } else {
//         callback()
//       }
//     }
//     const validateOffice = (rule, value, callback) => {
//       if (!this.ruleForm.office.name || !this.ruleForm.office.id) {
//         return callback('请选择归属部门')
//       } else {
//         callback()
//       }
//     }
//     const validateEmail = (rule, value, callback) => {
//       if (value && !emailRegExp.test(value)) {
//         return callback('请输入正确的邮箱')
//       } else {
//         callback()
//       }
//     }
//     return {
//       //  mixins
//       companyTreeData: [],
//       companyTreeDialogVisible: false,
//       officeTreeData: [],
//       // officeTreeDialogVisible: false,

//       id: '',
//       disabledForm: false,
//       ruleForm: {
//         company: {
//           id: '',
//           name: ''
//         },
//         roleList: [],
//         office: {
//           id: '',
//           name: ''
//         },
//         loginName: '',
//         name: '',
//         mobile: '',
//         loginFlag: '0',
//         channel: 'MOBILE',
//         status: '',
//         no: '',
//         phone: '',
//         email: '',
//         gender: 0,
//         userType: '3',
//         photo: '',
//         qrCode: '',
//         remarks: '',
//         password: '',
//         confirmPwd: ''
//       },
//       rules: {
//         company: [
//           { required: true, validator: validateCompany, trigger: 'change' }
//         ],
//         office: [
//           { required: true, validator: validateOffice, trigger: 'change' }
//         ],
//         email: [
//           { validator: validateEmail, trigger: 'change' }
//         ],
//         name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
//         no: [{ required: true, message: '请输入工号', trigger: 'blur' }],
//         loginName: [
//           { required: true, message: '请输入登录名', trigger: 'blur' }
//         ],
//         roleList: [
//           { required: true, type: 'array', message: '请选择至少一个角色', trigger: 'change' }
//         ]
//       }
//     }
//   },
//   computed: {
//     noCompany() {
//       return !(this.ruleForm.company.name && this.ruleForm.company.id)
//     },
//     disabledOffice() {
//       return this.disabledForm || this.noCompany
//     }
//   },
//   methods: {
//     initDataFn() {
//       this.getOfficeTreeData()
//       this.getRoleByUserId()
//     },
//     submitForm(formName) {
//       this.$refs[formName].validate(valid => {
//         if (valid) {
//           const params = this.formatParam()
//           this.loading = true
//           if (this.id) {
//             params.id = this.id
//             this.updateUser(params)
//           } else {
//             this.creatUser(params)
//           }
//         } else {
//           console.log('error submit!!')
//           return false
//         }
//       })
//     },
//     formatParam() {
//       const params = {
//         company: {
//           id: this.ruleForm.company.id
//         },
//         roleList: this.ruleForm.roleList,
//         office: {
//           id: this.ruleForm.office.id
//         },
//         loginName: this.ruleForm.loginName,
//         name: this.ruleForm.name,
//         mobile: this.ruleForm.mobile,
//         loginFlag: this.ruleForm.loginFlag,
//         channel: this.ruleForm.channel,
//         status: this.ruleForm.status,
//         no: this.ruleForm.no,
//         phone: this.ruleForm.phone,
//         email: this.ruleForm.email,
//         gender: this.ruleForm.gender,
//         userType: this.ruleForm.userType,
//         photo: this.ruleForm.photo,
//         qrCode: this.ruleForm.qrCode,
//         remarks: this.ruleForm.remarks,
//         password: this.ruleForm.password
//       }
//       params.roleList = params.roleList.map(item => {
//         return { id: item }
//       })
//       return params
//     },
//     creatUser(params) {
//       api.systemManagement.creatUser(params).then(res => {
//         if (res.resultCode === 0) {
//           this.$message.success('新增用户成功')
//           this.closeTabByChangeData()
//         }
//         this.loading = false
//       })
//     },
//     updateUser(params) {
//       api.systemManagement.updateUser(params).then(res => {
//         if (res.resultCode === 0) {
//           this.$message.success('修改用户成功')
//           this.closeTabByChangeData()
//         }
//         this.loading = false
//       })
//     },
//     closeTabByChangeData() {
//       this.$refs.closeTabsButton.closeTabByChangeData()
//     },
//     getInfoById() {
//       console.log(api.systemManagement)
//       api.systemManagement.userInfo(this.id).then(res => {
//         if (res.resultCode === 0) {
//           this.resetForm('ruleForm')
//           this.ruleForm = Object.assign(this.ruleForm, res.data)
//           this.ruleForm.roleList = this.ruleForm.roleList.map(item => {
//             return item.id
//           })
//         }
//       })
//     },
//     getOfficeTreeData() {
//       api.systemManagement.officeTreeData().then(res => {
//         this.companyTreeData = JSON.parse(JSON.stringify(res))
//         this.officeTreeData = JSON.parse(JSON.stringify(res))
//       })
//     },
//     getCompanyCurrentNode(row) {
//       const { name, id } = row
//       this.ruleForm.company = { name, id }
//       this.ruleForm.office.id = ''
//       this.ruleForm.office.name = ''
//       this.toggleCompanyTreeDialog(false)
//     },
//     toggleCompanyTreeDialog(isOpen) {
//       this.companyTreeDialogVisible = !!isOpen
//     },
//     back() {
//       this.$router.push({
//         name: 'SystemManagementUser'
//       })
//     }

//   }
// }
</script>

<style lang="scss" scoped></style>
