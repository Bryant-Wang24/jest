<template>
  <el-form
    ref="ruleForm"
    v-bind="$attrs"
    :inline="inline"
    :label-width="labelWidth"
    class="ruleForm"
    :style="formStyle"
    v-on="$listeners"
  >
    <slot />
    <div class="block" :style="{ 'margin-left': labelWidth }">
      <slot name="block" />
    </div>
  </el-form>
</template>

<script>
export default {
  props: {
    labelWidth: {
      type: String,
      default: '160px'
    },
    inline: {
      type: Boolean,
      default: true
    },
    formItemWidth: {
      type: String,
      default: '40%'
    },
    formItemContentWidth: {
      type: String,
      default: '60%'
    }
  },
  computed: {
    formStyle() {
      return {
        '--formItemWidth': this.formItemWidth,
        '--formItemContentWidth': this.formItemContentWidth
      }
    }
  },
  methods: {
    validate(callback) {
      this.$refs.ruleForm.validate(callback)
    },
    validateField(callback) {
      this.$refs.ruleForm.validateField(callback)
    },
    resetFields(callback) {
      this.$refs.ruleForm.resetFields(callback)
    },
    clearValidate(callback) {
      this.$refs.ruleForm.clearValidate(callback)
    }
  }
}
</script>

<style lang="scss" scoped>
.ruleForm {
  width: 100%;
  ::v-deep.el-form-item {
    width: var(--formItemWidth);
  }
  ::v-deep.el-form-item__content {
    width: var(--formItemContentWidth);
  }
  .block {
    display: block;
  }
}
</style>
