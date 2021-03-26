<template>
  <div>
    <div class="layout" :style="layoutStyle">
      <div v-if="useHead" ref="head" class="layout-header">
        <slot name="head" />
      </div>
      <div class="layout-containr" :style="reactLayoutContainrStyle">
        <slot />
      </div>
    </div>
    <div v-if="useFoot" ref="foot" class="foot">
      <div class="foot-fixed">
        <slot name="foot" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    useHead: {
      type: Boolean,
      default: true
    },
    useFoot: {
      type: Boolean,
      default: false
    },
    autoHeight: {
      type: Boolean,
      default: false
    },
    layoutContainrStyle: {
      type: Object,
      default: () => {}
    },
    layoutStyle: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      layoutContainrStyleData: {}
    }
  },
  computed: {
    reactLayoutContainrStyle() {
      return { ...this.layoutContainrStyleData, ...this.layoutContainrStyle }
    }
  },
  mounted() {
    if (this.autoHeight) {
      this.initContainrStyle()
    }
  },
  methods: {
    initContainrStyle() {
      this.$nextTick(() => {
        const head = this.$refs?.head?.clientHeight ? this.$refs?.head?.clientHeight + 20 : 0
        const foot = this.$refs?.foot?.clientHeight || 0

        this.$set(this.layoutContainrStyleData, 'minHeight', `calc(100vh - ${head + foot + 84 + 20 + 20}px)`)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
$gap: 20px;
$footHeiht: 64px;
.layout {
  padding: $gap;
  &-header {
    padding: $gap;
    // el-form-item有margin-bottom撑开
    padding-bottom: 0;
    background: #fff;
    margin-bottom: $gap;
  }
  &-containr {
    padding: $gap;
    background: #fff;
  }
}
.foot {
  width: 100%;
  height: $footHeiht;
  &-fixed {
    width: 100%;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
    height: $footHeiht;
    background: #fff;
    position: fixed;
    bottom: 0;
    left: 0;
    padding: 0 56px 0 200px;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 3;
  }
}
</style>
