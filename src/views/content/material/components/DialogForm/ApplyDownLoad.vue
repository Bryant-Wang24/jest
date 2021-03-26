<template>
  <div>
    <div class="title mb-20">已选择{{ chooseNum || 1 }}份文件，需提交下载申请，等待审核通过后才可下载。</div>
    <el-form ref="ruleForm" :model="form" :rules="rules" label-position="left" label-width="auto">
      <el-form-item label="下载用途：" prop="purpose">
        <el-input v-model="form.purpose" type="textarea" :rows="2" />
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  props: {
    chooseNum: {
      type: [Number, String],
      default: 1
    }
  },
  data() {
    return {
      form: {
        purpose: ''
      },
      rules: {
        purpose: [
          { required: true, message: '请输入', trigger: 'blur' }
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
