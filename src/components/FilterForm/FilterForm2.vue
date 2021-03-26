<template>
  <div class="FilterForm">
    <el-form ref="form" :inline="true" :model="form">
      <el-form-item class="item">
        <el-form-item label="搜索项" prop="searchKey">
          <el-select v-model="form.searchKey" placeholder="请选择" @change="searchChange">
            <WrapOption v-for="item in searchKeys" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="" prop="searchValue">
          <el-input v-model="form.searchValue" placeholder="请输入" />
        </el-form-item>
      </el-form-item>
      <el-form-item class="item">
        <el-form-item label="筛选项" prop="filterKey">
          <el-select v-model="form.filterKey" placeholder="请选择" @change="filterChange">
            <WrapOption v-for="item in filterKeys" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="" prop="filterValue">
          <el-select v-model="form.filterValue" placeholder="请选择">
            <WrapOption v-for="item in filterValues" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleSearch">查询</el-button>
        <el-button @click="handleReset">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import WrapOption from '@/components/base/WrapOption'
export default {
  components: { WrapOption },
  props: {
    searchKeys: {
      type: Array,
      default: () => []
    },
    filterKeys: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      form: {
        searchKey: null,
        searchValue: null,
        filterKey: null,
        filterValue: null
      }
    }
  },
  computed: {
    filterValues() {
      if (!this.form.filterKey) return []
      const filterKeysItem = this.filterKeys.filter(t => t.value === this.form.filterKey)
      return filterKeysItem[0].children || []
    }
  },
  methods: {
    handleSearch() {
      this.$emit('search', this.form)
    },
    handleReset() {
      this.$refs['form'].resetFields()
      this.$emit('reset')
    },
    searchChange() {
      this.form.searchValue = null
    },
    filterChange() {
      this.form.filterValue = null
    }
  }
}
</script>

<style lang="scss" scoped>
.FilterForm {
  ::v-deep .el-input__inner{
    width: 200px;
  }
}
</style>
