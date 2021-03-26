<template>
  <ElOption
    v-bind="$attrs"
    v-on="$listeners"
  >
    <slot />
  </ElOption>
</template>

<script>
export default {

}
</script>

<style lang="scss" scoped>
.el-select-dropdown__item {
  min-height: 34px;
  height: auto;
  white-space: initial;
  overflow: initial;
  text-overflow: initial;
  line-height: 24px;
  padding: 6px 20px;
}
</style>
