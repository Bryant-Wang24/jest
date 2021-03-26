<template>
  <div class="container">
    <div class="step" style="width: 0px">
      <div>
        <div class="dot">0</div>
      </div>
      <div class="info">发起人</div>
    </div>
    <div v-for="item in 3" :key="item" class="step">
      <div class="line">
        <div class="dot">{{ item }}</div>
      </div>
      <div class="info">审批人</div>
    </div>
  </div>
</template>

<script>
export default {}
</script>

<style lang='scss' scoped>
@import "~@/styles/custom-theme.scss";
.container {
  margin-top: 20px;
  position: relative;
  //  height: 4px;
  //  background: pink;
  display: flex;
  .step {
    left: 20px;
    position: relative;
    .info {
      position: absolute;
      margin-top: 10px;
      right: -40px;
      width: 50px;
    }
    .dot {
      position: absolute;
      top: -8px;
      left: -8px;
      height: 16px;
      width: 16px;
      border-radius: 50px;
      border: 1px solid $--custom--color--primary;
      //  float: right;
    }
    .line {
      width: 200px;

      border: 1px solid $--custom--color--primary;
      .dot {
        height: 8px;
        width: 8px;
        border-radius: 50px;
        background: blue;
        float: right;
      }
    }
  }
}
</style>
