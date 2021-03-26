<template>
  <div class="userInFo">
    <el-form
      v-for="(item,index) in userInFoForm"
      :key="index"
      ref="el-userInFoForm"
      :model="item"
      label-width="160px"
      class="demo-ruleForm"
    >
      <el-row>
        <el-col :span="10">
          <el-form-item label="联系人:">
            <el-input v-model="userInFoForm[index].contact" placeholder="请输入" />
          </el-form-item>
          <el-form-item label="联系电话:">
            <el-input v-model="userInFoForm[index].phone" placeholder="请输入" />
          </el-form-item>
          <el-form-item label="邮箱:">
            <el-input v-model="userInFoForm[index].email" placeholder="请输入" />
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="联系地址:">
            <el-input v-model="userInFoForm[index].address" placeholder="请输入" />
          </el-form-item>
          <el-form-item label="职务:">
            <el-input v-model="userInFoForm[index].job" placeholder="请输入" />
          </el-form-item>
          <el-form-item label="传真:">
            <el-input v-model="userInFoForm[index].fax" placeholder="请输入" />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script>
export default {
  props: {
    userInFoForm: {
      type: Array,
      default: () => []
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
