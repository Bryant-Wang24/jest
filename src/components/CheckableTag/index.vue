<template>
  <span class="tag" :class="{'checked': checked}" @click="onChange">
    <slot />
  </span>
</template>

<script>
export default {
  props: {
    tagKey: {
      type: [String, Number, Boolean],
      default: () => {
        return null
      }
    },
    checked: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    onChange() {
      this.$emit('onChange', this.tagKey, !this.checked)
    }
  }
}
</script>

<style lang="scss" scoped>
@import "~@/styles/custom-theme.scss";
.tag {
  display: inline-block;
  height: auto;
  line-height: 20px;
  padding: 0 7px;
  font-size: 12px;
  user-select: none;
  cursor: pointer;
  transition: all .3s;
  // &:active {
  //   background-color: #024540;
  // }
  &:not(.checked) {
    &:hover {
      color: $--custom--color--primary;
    }
  }
}
.checked {
  background-color: $--custom--color--primary;
  color: #fff;
  &:hover {
    opacity: .8;
    // background-color: #098077;
  }
  // &:active {
  //   background-color: #024540;
  // }
}
</style>
