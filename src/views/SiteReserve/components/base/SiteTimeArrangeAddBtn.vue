<template>
  <div class="siteTimeArrange-addForm">
    <!-- <el-button type="primary" icon="el-icon-plus" size="mini" @click="addSiteList" /> -->
    <span v-show="icon" class="icon"><i :class="icon" /></span>
    <span class="addSiteBtn" @click="confirm">
      <slot>{{ btnText }}</slot>
    </span>
    <!-- <el-button type="text" @click="addSiteList"><i class="el-icon-circle-plus-outline" /> 添加场地</el-button> -->
    <span class="siteSpanS">多个场地时间安排不一致时可另外添加场地</span>
  </div>
</template>

<script>
export default {
  props: {
    text: {
      type: String,
      default: ''
    },
    icon: {
      type: String,
      default: 'el-icon-plus'
    },
    label: {
      type: String,
      default: '多个场地时间安排不一致时可另外添加场地'
    }
  },
  computed: {
    btnText() {
      return this.text || '添加场地'
    }
  },
  methods: {
    confirm() {
      this.$emit('confirm')
    }
  }
}
</script>

<style lang="scss" scoped>
@import "~@/styles/custom-theme.scss";
.siteTimeArrange-addForm {
  // margin-left: 100px;
  .icon {
    display: inline-block;
    width: 20px;
    height: 20px;
    text-align: center;
    line-height: 20px;
    margin-right: 4px;
    // padding: 2px;
    background-color: $--custom--color--primary;
    color: #fff;
    cursor: pointer;
  }
  .addSiteBtn {
    margin-right: 10px;
    color: $--custom--color--primary;
    cursor: pointer;
  }
}
</style>
