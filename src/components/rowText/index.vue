<template>
  <div class="rowTitle" :style="rowTextStyle">
    <div class="text_border" />
    <span class="text" :style="{ 'border-color': borderColor }">{{
      text
    }}</span>
    <slot />
  </div>
</template>

<script>
import styles from '@/styles/custom-theme.scss'
export default {
  name: 'RightPanel',
  props: {
    // margin-top值
    top: {
      type: Number,
      default: 20
    },
    // margin-bottom值
    bottom: {
      type: Number,
      default: 20
    },
    text: {
      default: '',
      type: String
    },
    borderColor: {
      default: styles.theme,
      type: String
    },
    backgroundColor: {
      default: '#FAFAFA',
      type: String
    }
  },
  data() {
    return {}
  },
  computed: {
    rowTextStyle() {
      return {
        'margin-top': `${this.top}px`,
        'margin-bottom': `${this.bottom}px`,
        'background-color': this.backgroundColor
      }
    }
  },
  methods: {}
}
</script>

<style lang="scss" scoped>
@import "~@/styles/custom-theme.scss";
.rowTitle {
  width: 100%;
  padding: 0 4px;
  position: relative;
  min-height: 40px;
  background-color: #fafafa;
  border-radius: 4px;
  .text {
    padding-left: 12px;
    line-height: 40px;
    font-size: 16px;
  }
  .text_border{
    width: 4px;
    background: $--custom--color--primary;
    height: 40%;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    margin: auto 4px auto;
  }
}
</style>
