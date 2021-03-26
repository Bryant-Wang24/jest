<template>
  <el-popconfirm
    :title="title"
    :confirm-button-text="confirmText"
    :cancel-button-text="cancelText"
    :style="{
      marginLeft: left,
      marginRight: right
    }"
    @onConfirm="onConfirm"
    @onCancel="onCancel"
  >
    <el-button slot="reference" :type="type" :plain="plain" :round="round" :circle="circle" :size="size" :loading="loading" :disabled="disabled">
      <slot />
    </el-button>
  </el-popconfirm>
</template>

<script>
export default {
  props: {
    left: {
      type: String,
      default: '10px'
    },
    right: {
      type: String,
      default: '10px'
    },
    title: {
      type: String,
      default: '确定删除吗？'
    },
    disabled: {
      type: Boolean,
      default: () => {
        return false
      }
    },
    loading: {
      type: Boolean,
      default: () => {
        return false
      }
    },
    plain: {
      type: Boolean,
      default: () => {
        return false
      }
    },
    round: {
      type: Boolean,
      default: () => {
        return false
      }
    },
    circle: {
      type: Boolean,
      default: () => {
        return false
      }
    },
    size: {
      type: String,
      default: () => {
        return
      }
    },
    type: {
      type: String,
      default: 'text'
    },
    confirmText: {
      type: String,
      default: '确定'
    },
    cancelText: {
      type: String,
      default: '取消'
    },
    icon: {
      type: String,
      default: 'el-icon-question'
    },
    iconColor: {
      type: String,
      default: '#f90'
    },
    hideIcon: {
      type: Boolean,
      default: () => false
    }
  },
  methods: {
    onConfirm() {
      this.$emit('onConfirm')
    },
    onCancel() {
      this.$emit('onCancel')
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
