<template>
  <el-form ref="searchList" class="searchList" :model="searchList" :inline="true">
    <el-form-item class="row-item">
      <el-form-item label="申请编号：" prop="applyCode">
        <el-input
          v-model="searchList.applyCode"
          placeholder="请输入"
          type="text"
          :style="formItemStyle"
        />
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
      <el-form-item label="发票抬头：" prop="invoiceTitle">
        <el-input
          v-model="searchList.invoiceTitle"
          placeholder="请输入"
          :style="formItemStyle"
          type="text"
        />
      </el-form-item>

    </el-form-item>
    <el-form-item class="row-item">
      <el-form-item label="开票单位：" prop="invoiceOffice">
        <el-select
          v-model="searchList.invoiceOffice"
          placeholder="全部"
          :style="formItemStyle"
        >
          <WrapOption v-for="(item,index) in companyList" :key="index" :style="formItemStyle" :label="item.companyAbbreviation" :value="item.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="发票类型：" prop="invoiceType">
        <el-select
          v-model="searchList.invoiceType"
          placeholder="全部"
          :style="formItemStyle"
        >
          <WrapOption :style="formItemStyle" label="增值税专用发票" value="VAT_INVOICE" />
          <WrapOption :style="formItemStyle" label="普通发票" value="ORDINARY" />
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
            :label="check.value"
            :value="check.label"
          />
        </el-select>
      </el-form-item>
    </el-form-item>

    <el-form-item class="row-item">
      <el-form-item label="开票状态：" prop="invoiceState">
        <el-select
          v-model="searchList.invoiceState"
          placeholder="全部"
          :style="formItemStyle"
        >
          <WrapOption :style="formItemStyle" label="未开票" value="UNBILLED" />
          <WrapOption :style="formItemStyle" label="已开票" value="INVOICED" />
        </el-select>
      </el-form-item>
    </el-form-item>

    <el-form-item class="row-item" style="margin-left:82px;">
      <el-button
        type="primary"
        @click="searchInvoice(false)"
      >查询</el-button>
      <el-button @click="searchInvoice(true)">重置</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import WrapOption from '@/components/base/WrapOption'
import { CHECK_STATE_ARRAY } from '@/common/bill'
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
    }
  },
  data() {
    return {
      CHECK_STATE_ARRAY,
      formItemStyle: { width: '240px' }
    }
  },
  methods: {
    searchInvoice(isReset) {
      if (isReset) {
        this.$refs['searchList'].resetFields()
      }
      this.$emit('searchInvoice', isReset)
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
