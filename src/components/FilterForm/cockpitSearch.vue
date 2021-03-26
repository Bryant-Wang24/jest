<template>
  <div class="cockpitSearch">
    <div class="block">
      <span>年份：</span>
      <el-date-picker
        v-model="year"
        value-format="yyyy"
        type="year"
        placeholder="选择年"
        style="margin-right:20px"
      />
      <el-button v-loading.fullscreen.lock="fullscreenLoading" type="primary" @click="onSubmit">查询</el-button>
    </div>

  </div>
</template>

<script>
export default {
  data() {
    return {
      year: `${new Date().getFullYear()}`,
      fullscreenLoading: false
    }
  },
  methods: {
    onSubmit() {
      if (!this.year) {
        this.year = `${new Date().getFullYear()}`
      }
      this.$emit('submit', this.year)
      this.fullscreenLoading = true
      setTimeout(() => {
        this.fullscreenLoading = false
      }, 500)
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
