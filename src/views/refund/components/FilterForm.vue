<template>
  <el-form :inline="true" label-width="82px">
    <el-form-item class="row-item">
      <el-form-item label="选择项目：">
        <el-select v-model="filterForm.projectId" filterable placeholder="请选择（可检索）" style="width: 240px">
          <WrapOption
            v-for="item in projectOptions"
            :key="item.value"
            style="width: 240px"
            :label="item.projectName"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="退款客户：">
        <el-select v-model="filterForm.companyId" filterable placeholder="请选择（可检索）" style="width: 240px">
          <WrapOption
            v-for="item in companyOptions"
            :key="item.value"
            style="width: 240px"
            :label="item.customerName"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="退款状态：">
        <el-select v-model="filterForm.refundStatuses" placeholder="请选择" style="width: 240px">
          <WrapOption
            v-for="item in REFUND_STATUS_OPTIONS"
            :key="item.value"
            style="width: 240px"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
    </el-form-item>

    <el-form-item class="row-item">
      <el-form-item label="申请人：">
        <el-input v-model="filterForm.applier" placeholder="请输入" style="width: 240px" />
      </el-form-item>
    </el-form-item>

    <el-form-item class="row-item" style="margin-left:82px;">
      <el-form-item>
        <el-button type="primary" @click="onSubmit">查询</el-button>
        <el-button @click="onReset">重置</el-button>
      </el-form-item>
    </el-form-item>
  </el-form>
</template>

<script>
import WrapOption from '@/components/base/WrapOption'
import { REFUND_STATUS_OPTIONS, REFUND_STATUS } from '@/common/refund'
export default {
  components: { WrapOption },
  props: {
    projectOptions: {
      type: Array,
      default: () => []
    },
    companyOptions: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      REFUND_STATUS_OPTIONS,
      filterForm: {
        applier: null,
        companyId: null,
        projectId: null,
        refundStatuses: REFUND_STATUS.ALL
      }
    }
  },
  methods: {
    initParams() {
      const { applier, companyId, projectId, refundStatuses } = this.filterForm
      return { applier, companyId, projectId, refundStatuses: refundStatuses === REFUND_STATUS.ALL ? null : [refundStatuses] }
    },
    onSubmit() {
      this.$emit('onSubmit', this.initParams())
    },
    onReset() {
      this.filterForm = {
        applier: null,
        companyId: null,
        projectId: null,
        refundStatuses: REFUND_STATUS.ALL
      }
      this.$emit('onReset', this.initParams())
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
