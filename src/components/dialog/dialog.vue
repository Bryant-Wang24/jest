<template>
  <el-dialog
    :title="title"
    :width="width"
    :visible.sync="dialogShow"
    :close-on-click-modal="false"
    :before-close="handleClose"
  >
    <slot />
  </el-dialog>
</template>
<script>
export default {
  props: {
    'dialogShow': {
      type: Boolean,
      default: false
    },
    'title': {
      type: String,
      default: ''
    },
    'width': {
      type: String,
      default: ''
    }
  },
  methods: {
    handleClose() {
      this.$emit('handleCancel')
    }
  }
}
</script>
<style lang="scss" scoped>
.el-dialog__wrapper{
  .el-dialog{
    max-height:75%;
    overflow: auto;
  }
}
</style>
