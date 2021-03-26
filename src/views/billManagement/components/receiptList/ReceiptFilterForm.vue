<template>
  <el-form ref="searchList" class="searchList" :model="searchList" :inline="true">
    <el-form-item class="row-item">
      <el-form-item label="申请编号：" prop="applyCode">
        <el-input v-model="searchList.applyCode" placeholder="请输入" type="text" style="width:240px" />
      </el-form-item>
      <el-form-item label="项目名称：" prop="projectName">
        <el-select
          v-model="searchList.projectName"
          placeholder="全部"
          filterable
          clearable
          :style="formItemStyle"
        >
          <WrapOption
            v-for="project in projectOptions"
            :key="project.projectCode"
            :style="formItemStyle"
            :label="project.projectName"
            :value="project.projectName"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="客户名称：" prop="customer">
        <el-select
          v-model="searchList.customer"
          placeholder="全部"
          filterable
          clearable
          :style="formItemStyle"
        >
          <WrapOption
            v-for="company in customerOptions"
            :key="company.id"
            :style="formItemStyle"
            :label="company.customerName"
            :value="company.id"
          />
        </el-select>
      </el-form-item>
    </el-form-item>
    <el-form-item class="row-item">
      <el-form-item label="开收据方：" prop="receiptOffice">
        <el-select
          v-model="searchList.receiptOffice"
          placeholder="全部"
          :style="formItemStyle"
        >
          <WrapOption v-for="(item,index) in companyList" :key="index" :style="formItemStyle" :label="item.companyAbbreviation" :value="item.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="审核状态：" prop="checkState">
        <el-select
          v-model="searchList.checkState"
          placeholder="全部"
          :style="formItemStyle"
        >
          <WrapOption
            v-for="(check, index) in CHECK_STATE_ARRAY"
            :key="index"
            :style="formItemStyle"
            :value="check.label"
            :label="check.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="收据状态：" prop="receiptState">
        <el-select
          v-model="searchList.receiptState"
          placeholder="全部"
          :style="formItemStyle"
        >
          <WrapOption v-for="item in RECEIPT_STATE_OPTIONS" :key="item.value" :style="formItemStyle" :value="item.value" :label="item.label" />
        </el-select>
      </el-form-item>
    </el-form-item>
    <el-form-item class="row-item" style="margin-left:82px;">
      <el-form-item class="searchBtn">
        <el-button type="primary" @click="searchReceipt">查询</el-button>
        <el-button @click="resetSearch">重置</el-button>
      </el-form-item>
    </el-form-item>
  </el-form>
</template>

<script>
import WrapOption from '@/components/base/WrapOption'
import { CHECK_STATE_ARRAY, RECEIPT_STATE_OPTIONS } from '@/common/bill'
export default {
  components: { WrapOption },
  props: {
    searchList: {
      type: Object,
      default: () => {}
    },
    projectOptions: {
      type: Array,
      default: () => []
    },
    companyList: {
      type: Array,
      default: () => []
    },
    customerOptions: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      CHECK_STATE_ARRAY,
      RECEIPT_STATE_OPTIONS,
      formItemStyle: { width: '240px' }
    }
  },
  methods: {
    searchReceipt() {
      this.$emit('searchReceipt')
    },
    resetSearch() {
      this.$refs['searchList'].resetFields()
      this.$emit('resetSearch')
    }
  }
}
</script>

<style lang="scss" scoped>
.el-form-item {
  margin-right: 60px;
}
.row-item {
  width: 100%;
  margin-right: 0;
}
</style>
