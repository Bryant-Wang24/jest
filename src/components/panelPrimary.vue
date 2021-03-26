<template>
  <div class="pamel">
    <div class="pamel-top">查询</div>
    <div class="pamel-body">
      <div class="inputRow">
        <div class="mySpan">角色名称:</div>
          <el-input class="myInput" v-model="input"></el-input>
      </div>
      <slot></slot>
      <div class="pamel-btn">
        <el-button size="mini" icon="el-icon-search" round>查询</el-button>
        <el-button size="mini" icon="el-icon-refresh" round>重置</el-button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
data(){
  return{
     input:''
  }
}
}
</script>

<style  scoped>
  .pamel {
    border: 1px solid #1ab394;
    border-radius: 4px;
    margin:0px 10px ;
  }
  .pamel-top {
    height: 21px;
    padding: 10px 15px;
    background-color: #26A59A;
    color: #fff;
    text-align: left;
    border-bottom: 1px solid transparent;
    border-top-left-radius: 3px;
    border-top-right-radius: 3px;
  }
  .pamel-body {
    padding: 15px;
    overflow: hidden;
  }
  .pamel-btn {
    float: right;
    margin-top: 20px;
  }
  .myInput {
  width: 20%;
  text-align: left;
}
.inputRow {
}
</style>