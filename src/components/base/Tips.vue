<template>
  <span class="tips" :style="style">
    <slot />
  </span>
</template>

<script>
export default {
  props: {
    inline: {
      type: Boolean,
      default: false
    },
    color: {
      type: String,
      default: '#909399'
    },
    fontSize: {
      type: String,
      default: '14px'
    }
  },
  computed: {
    style() {
      return {
        display: this.inline ? 'inherit' : 'block',
        color: this.color,
        fontSize: this.fontSize
      }
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
