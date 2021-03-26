<template>
  <el-form ref="form" label-position="top" :model="form">
    <el-form-item label="审批意见：" prop="text">
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
      }
    }
  },
  methods: {
    reset() {
      this.$refs.form.resetFields()
    },
    validate() {
      return Promise.resolve({ text: this.form.text })
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
