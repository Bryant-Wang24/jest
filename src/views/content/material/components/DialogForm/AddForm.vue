<template>
  <div>
    <div class="title mb-20">文件夹权限默认私密，创建后可对文件夹权限进行配置。</div>
    <el-form ref="ruleForm" :model="form" :rules="rules" label-position="left" label-width="auto">
      <el-form-item label="文件夹名称：" prop="name">
        <el-input v-model="form.name" />
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      form: {
        name: ''
      },
      rules: {
        name: [
          { required: true, message: '请输入名称', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    validate(callback) {
      this.$refs.ruleForm.validate(callback)
    },
    reset() {
      this.$refs.ruleForm.resetFields()
    },
    getFormData() {
      return { ...this.form }
    }
  }
}
</script>

<style lang="scss" scoped>
.title{
  font-size: 14px;
  color:#909399;
  /* line-height: 20px; */
  /* margin-bottom: 30px; */
}
</style>
