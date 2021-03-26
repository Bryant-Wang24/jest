<template>
  <div :style="MainTitleStyle" class="MainTitle">
    <div class="MainTitle-title">
      <slot>{{ MainTitle }}</slot>
      <span class="MainTitle-title-desc">
        <slot name="label">{{ label }}</slot>
      </span>
    </div>
    <slot name="content" />
  </div>
</template>

<script>
export default {
  props: {
    // title的margin-top值
    top: {
      type: Number,
      default: 0
    },
    // title的margin-bottom值
    bottom: {
      type: Number,
      default: 20
    },
    title: {
      type: String,
      default: ''
    },
    label: {
      type: String,
      default: ''
    }
  },
  computed: {
    MainTitleStyle() {
      return {
        'margin-top': `${this.top}px`,
        'margin-bottom': `${this.bottom}px`
      }
    },
    MainTitle() {
      let result = ''
      if (this.title) {
        result = this.title
      } else {
        result = this.$route.meta?.title || ''
      }
      return result
    }
  }
}
</script>

<style lang="scss" scoped>
.MainTitle {
  display: flex;
  justify-content: space-between;
  align-items: center;
  min-height: 36px;
  &-title {
    font-size: 18px;
    font-weight: bold;
    &-desc {
      font-size: 14px;
      font-weight: normal;
      color: #909399;
      padding-left: 10px;
    }
  }
}
</style>
