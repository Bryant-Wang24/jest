<template>
  <el-form ref="form" label-position="top" :rules="rules" :model="form">
    <el-form-item label="拒绝原因：" prop="text">
      <el-input
        v-model="form.text"
        type="textarea"
        :rows="3"
        resize="none"
      />
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  data() {
    return {
      form: {
        text: ''
      },
      rules: {
        text: [{ required: true, message: '请输入审批意见', trigger: 'blur' }]
      }
    }
  },
  methods: {
    reset() {
      this.$refs.form.resetFields()
    },
    validate() {
      return new Promise((resolve, reject) => {
        this.$refs.form.validate((valid) => {
          if (valid) {
            resolve({
              text: this.form.text
            })
          } else {
            reject()
            return false
          }
        })
      })
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
