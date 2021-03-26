<template>
  <el-button
    v-bind="$attrs"
    v-on="$listeners"
    @click="handleClick"
  >
    <slot />
  </el-button>
</template>

<script>
export default {
  props: {
    beforeClose: { // promise函数
      type: Function,
      default: null
    }
  },
  methods: {
    handleClick() {
      if (!this.beforeClose) {
        return this.closeTab()
      }

      const before = this.beforeClose()

      if (before && before.then) { // 传入的beforeClose为promise
        before.then(() => {
          this.closeTab()
        }).catch(() => {
          // 啥都不干
        })
      } else if (before !== false) {
        this.closeTab()
      } else {
        return
      }
    },
    closeTabByChangeData(status = true) {
      this.$store.commit('global/toggleRefreshStatus', status)
      this.closeTab()
    },
    closeTab() {
      this.$store.dispatch('tagsView/delView', this.$route).then(() => {
        this.$emit('close')
      })
    }
  }
}
</script>
