<template>
  <div class="tablePager">
    <el-table
      ref="table"
      :header-cell-style="{
        color: '#333',
        fontWeight: 'normal',
        fontSize: '14px',
        background: '#FAFAFA',
        ...headerCellStyle
      }"
      v-bind="$attrs"
      :cell-style="{ color: '#000', fontSize: '14px', ...cellStyle }"
      tooltip-effect="dark"
      :style="tableStyle"
      v-on="$listeners"
    >
      <slot />
      <slot slot="append" name="append" />
    </el-table>
    <PaginationPage
      v-if="isPagination"
      :total="total"
      :to="pageSize"
      :current-page="currentPage"
      @handleCurrentChange="handleCurrentChange"
    />
  </div>
</template>

<script>
import PaginationPage from '@/components/Pagination/index'
export default {
  components: {
    PaginationPage
  },
  props: {
    // table的margin-top值
    top: {
      type: Number,
      default: 20
    },
    // table的margin-bottom值
    bottom: {
      type: Number,
      default: 20
    },
    headerCellStyle: {
      type: Object,
      default: () => {}
    },
    cellStyle: {
      type: Object,
      default: () => {}
    },
    currentPage: {
      type: Number,
      default: 1
    },
    // 是否使用内置分页器
    isPagination: {
      type: Boolean,
      default: true
    },
    // 分页器的total
    total: {
      type: Number,
      default: 0
    },
    pageSize: {
      type: Number,
      default: 10
    }
  },
  computed: {
    tableStyle() {
      return {
        'width': '100%',
        'margin-top': `${this.top}px`,
        'margin-bottom': `${this.bottom}px`
      }
    }
  },
  methods: {
    toggleRowSelection(row, selected) {
      this.$refs.table.toggleRowSelection(row, selected)
    },
    clearSelection() {
      this.$refs.table.clearSelection()
    },
    handleCurrentChange(val) {
      const page = {
        currentPage: val,
        pageSize: this.pageSize
      }
      this.$emit('page', page)
    }
  }
}
</script>

<style></style>
