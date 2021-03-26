<template>
  <div class="invoice">
    <div class="title">开票信息</div>
    <el-form class="invoiceForm" :inline="true">
      <el-form-item label="发票抬头">
        <input type="text" size="mini">
      </el-form-item>
      <el-form-item label="纳税人识别号">
        <input type="text" size="mini">
      </el-form-item><br>
      <el-form-item label="公司注册地址">
        <input type="text" size="mini">
      </el-form-item>
      <el-form-item label="公司电话">
        <input type="text" size="mini">
      </el-form-item><br>
      <el-form-item label="开户行名称">
        <input type="text" size="mini">
      </el-form-item>
      <el-form-item label="银行账号">
        <input type="text" size="mini">
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  props: {
    invoiceInfo: {
      type: Object,
      default() {
        return {}
      }
    }
  }
}
</script>

<style lang='scss' scoped>
.invoice{
width: 1231px;
height: 200px;
background: #FAFAFA;
opacity: 1;
.invoiceForm{
    width: 80%;
    ::v-deep .el-form-item{
        margin-left: 110px;
    }
    ::v-deep .el-form-item__label{
        width: 96px;
    }
}
}
</style>
