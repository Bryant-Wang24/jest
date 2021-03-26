<template>
  <!-- 查询部分 -->
  <el-form :inline="true">
    <el-form-item class="row-item">
      <el-form-item label="选择项目：">
        <el-select v-model="filterForm.projectId" filterable placeholder="请选择（可检索）" style="width: 240px">
          <WrapOption
            v-for="item in projectOptions"
            :key="item.value"
            :label="item.projectName"
            :value="item.id"
            style="width: 240px"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="客户名称：">
        <el-select v-model="filterForm.customerId" filterable placeholder="请选择（可检索）" style="width: 240px">
          <WrapOption
            v-for="item in customerOptions"
            :key="item.value"
            :label="item.customerName"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="可用余额：">
        <el-select
          v-model="filterForm.surplus"
          filterable
          clearable
          placeholder="请选择"
          style="width: 240px"
          @change="surplusSelectChange"
        >
          <WrapOption
            v-for="(item, index) in surplusOptions"
            :key="index"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
    </el-form-item>
    <el-form-item class="row-item">
      <el-form-item label="入账状态：">
        <el-select v-model="filterForm.stateValue" placeholder="请选择" style="width: 240px">
          <WrapOption
            v-for="item in stateOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="收款账户：">
        <el-select v-model="filterForm.accountId" placeholder="请选择" style="width: 240px">
          <WrapOption
            label="全部"
            value=""
          />
          <WrapOption
            v-for="item in accountOptions"
            :key="item.value"
            :label="item.abbreviation"
            :value="item.id"
          />
        </el-select>
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
import { STATE_OPTIONS, STATE, SURPLUS_OPTIONS } from '@/common/deposit'
export default {
  components: { WrapOption },
  props: {
    projectOptions: {
      type: Array,
      default: () => []
    },
    customerOptions: {
      type: Array,
      default: () => []
    },
    accountOptions: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      filterForm: {
        projectId: '',
        customerId: '',
        stateValue: STATE.ALL,
        accountId: '',
        surplus: null
      },
      surplusOptions: SURPLUS_OPTIONS,
      stateOptions: STATE_OPTIONS
    }
  },
  methods: {
    getFilterForm() {
      const params = { ...this.filterForm, billingStates: this.filterForm.stateValue.split(',') }

      Reflect.deleteProperty(params, 'surplus') // 此参数前端自用，无需传给接口，在此删除
      Reflect.deleteProperty(params, 'stateValue') // 此参数前端自用，无需传给接口，在此删除
      return params
    },
    surplusSelectChange(v) {
      switch (v) {
        case 0:
          this.filterForm.minUsableAmount = null
          this.filterForm.maxUsableAmount = 0
          break
        case 1:
          this.filterForm.minUsableAmount = 0.01
          this.filterForm.maxUsableAmount = null
          break
        default:
          break
      }
    },
    onSubmit() {
      this.$emit('onSubmit')
    },
    onReset() {
      this.filterForm = {
        projectId: '',
        customerId: '',
        stateValue: STATE.ALL,
        accountId: '',
        surplus: null
      }
      this.$emit('onReset', this.filterForm)
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
