<template>
  <el-tooltip class="el-tooltip-xiao" effect="dark" placement="top-start">
    <!-- <el-button class="el-tooltip1">!</el-button> -->
    <div slot="content" class="tips-content">
      <div class="rule-box">
        项目已撤销
      </div>
    </div>
    <i class="el-icon-warning" />
  </el-tooltip>
</template>

<script>
export default {}
</script>

<style lang="scss" scoped>
.el-tooltip-xiao {
  background-color: #999;
}
.el-icon-warning {
  background-color: #fff;
  color: #999;
}
.el-table .cell {
  color: #999;
}
</style>
