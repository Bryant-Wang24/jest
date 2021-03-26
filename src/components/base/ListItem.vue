<template>
  <div class="ListItem">
    <div v-for="(item, index) in list" :key="index" class="item">
      <div class="label" :style="labelStyle">{{ item.label }}</div>
      <div class="value">{{ item.value }}</div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    list: {
      type: Array,
      default: () => []
    },
    labelWidth: {
      type: [String, Number],
      default: 160
    }
  },
  computed: {
    labelStyle() {
      return {
        width: this.labelWidth + 'px'
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.item {
  display: flex;
  margin-bottom: 14px;
  .label {
    margin-right: 10px;
    text-align: right;
    color: #666;
  }
  .value {
    flex: 1;
    color: #000;
  }
}

</style>
