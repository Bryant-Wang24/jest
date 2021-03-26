<template>
  <div class="ehShopDomain">
    <el-form
      ref="ehShopDomain"
      :rules="rules"
      :model="ehShopDomain"
      label-width="150px"
      label-position="right"
      class="demo-ruleForm"
    >
      <el-form-item label="经营品牌：" prop="brand">
        <el-input v-model="ehShopDomain.brand" />
      </el-form-item>
      <el-form-item label="经营范围：" prop="businessScope">
        <el-input v-model="ehShopDomain.businessScope" />
      </el-form-item>
      <el-form-item label="经营品种：" prop="businessType">
        <el-input v-model="ehShopDomain.businessType" />
      </el-form-item>
      <el-form-item v-if="siteType!==SITE_TYPE_ENUM.FOOD" label="经营时间：" :prop="siteType!==SITE_TYPE_ENUM.FOOD ? 'businessTime':''">
        <!-- <el-form-item label="经营时间：" :prop="'businessTime'"> -->
        <el-input v-model="ehShopDomain.businessTime" />
      </el-form-item>
      <el-form-item label="备注：">
        <el-input v-model="ehShopDomain.remarks" type="textarea" />
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import { SITE_TYPE_ENUM } from '@/common/site'
export default {
  props: {
    isEdit: {
      type: Boolean,
      default: false
    },
    ehShopDomain: {
      type: Object,
      default: () => {
        return {}
      }
    },
    siteType: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      SITE_TYPE_ENUM,
      rules: {
        brand: [
          { required: true, message: '请输入经营品牌', trigger: 'blur' }
        ],
        businessScope: [
          { required: true, message: '请输入经营范围', trigger: 'blur' }
        ],
        businessTime: [
          { required: true, message: '请输入经营时间', trigger: 'blur' }
        ],
        businessType: [
          { required: true, message: '请输入经营品种', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    // isShow() {
    //   if (this.isEdit) {
    //     return this.hasRolePermission('shopEdit_save')
    //   }
    //   return true
    // }
  },
  methods: {
    // determine(val) {
    //   this.$emit('set_determine', val)
    // }
    validate() {
      return new Promise((resolve, reject) => {
        this.$refs.ehShopDomain.validate((valid) => {
          if (valid) {
            resolve()
          } else {
            reject()
          }
        })
      })
    }
  }

}
</script>
<style lang="scss" scoped>
.el-cascader{
  width: 100%;
}
.ehShopDomain{
  width: 100%;
  display: inline-table;

  box-sizing: border-box;
  .el-form {
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    .el-form-item {
      width: 45%;
      margin-right: 10%;
    }
  }
}
</style>
