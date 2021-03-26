<template>
  <div class="setBasicInfo">
    <el-form ref="form" :model="form" :rules="rules" label-position="top" label-width="100px" class="demo-ruleForm">
      <el-form-item label="审批流名称：" prop="name">
        <el-input v-model="form.name" />
      </el-form-item>
      <el-form-item label="说明：" prop="desc">
        <el-input v-model="form.desc" type="textarea" :rows="2" resize="none" />
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  props: {
    info: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data() {
    return {
      form: {
        name: '',
        desc: ''
      },
      rules: {
        name: [{ required: true, message: '请输入审批流名称', trigger: 'blur' }]
      }
    }
  },
  watch: {
    info: {
      handler(v) {
        this.form = { ...v }
      },
      immediate: true,
      deep: true
    }
  },
  methods: {
    // validate() {
    //   this.$refs['form'].validate((valid) => {
    //     if ()
    //   })
    // }
  }
}
</script>

<style lang="scss" scoped>

</style>
