<template>
  <div>
    <el-form ref="ruleForm" :model="form" :rules="rules" label-position="left" label-width="auto">
      <el-form-item label="文件夹名称：" prop="name">
        <el-input v-model="form.name" />
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { getFileName, getFileType } from '@/utils/common'
import { TYPE } from '@/common/material'
export default {
  props: {
    currentEditNode: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      form: {
        name: '',
        suffix: ''
      },
      rules: {
        name: [
          { required: true, message: '请输入名称', trigger: 'blur' }
        ]
      }
    }
  },
  watch: {
    currentEditNode: {
      handler(node) {
        const { name, type } = node
        if (type === TYPE['FILE']) {
          this.form.name = getFileName(name)
          this.form.suffix = getFileType(name)
        } else {
          this.form.name = name
        }
      },
      immediate: true,
      deep: true
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
      // const { name, type } = this.form
      return { ...this.form }
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
