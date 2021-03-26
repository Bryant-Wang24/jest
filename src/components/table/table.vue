<template>
  <div class="table_new">
    <el-table
      ref="Page_Table"
      v-loading="tableLoading"
      :max-height="height"
      :data="tableData"
      :empty-text="emptyText"
      :row-key="rowKey"
      :show-summary="summary"
      :summary-method="summaryMethod"
      style="width: 100%"
      @row-click="handleRowClick"
      @selection-change="handleSelectionChange"
      @row-dblclick="rowDblclick"
    >
      <el-table-column
        v-for="item in tableHeader"
        :key="item.key"
        :align="item.align || 'left'"
        show-overflow-tooltip
        :sortable="item.sortable"
        :type="item.type"
        :prop="item.key"
        :label="item.text"
        :min-width="item.minWidth"
        :width="item.width"
        reserve-selection
        :selectable="selectable_fun"
        :formatter="item.formatter"
      />
      <slot />
    </el-table>
  </div>
</template>
<script>
export default {
  props: {
    // 表格数据
    tableData: {
      type: Array,
      default: () => {
        return []
      }
    },
    // 表头数组
    tableHeader: {
      type: Array,
      default: () => {
        return []
      }
    },
    // table宽
    width: {
      type: String,
      default: ''
    },
    // 是否显示合计
    summary: {
      type: Boolean,
      default: false
    },
    // 表格loading
    tableLoading: {
      type: Boolean,
      default: false
    },
    // 合计方法
    summaryMethod: {
      type: Function,
      default: () => {
        return () => {}
      }
    },
    // 自动选中(传空数组则刷新曾选中的数据)
    multipleSelection: {
      type: Array,
      default: () => {
        return []
      }
    },
    // 当某一行被双击时会触发该事件
    rowDblclick: {
      type: Function,
      default: () => {
        return () => {}
      }
    },
    // 表格高度
    height: {
      type: Number,
      default: null
    },
    // 表格列选中记录的key
    rowKey: {
      type: String,
      default: 'id'
    },
    // 表格列是否可以点击选中
    rowClick: {
      type: Boolean,
      default: true
    },
    // 表格空数据时 提示
    emptyText: {
      type: String,
      default: '暂无数据'
    },
    // 返回一个Boolean，决定列是否可以选择
    selectable: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      isRouterAlive: false
    }
  },
  computed: {
    selectable_fun() {
      return () => {
        return this.selectable
      }
    }
  },
  // 监听
  watch: {
    multipleSelection(arr) {
      if (arr.length > 0) {
        this.$nextTick(() => {
          arr.forEach(item => {
            this.$refs.Page_Table.toggleRowSelection(item, true)
          })
        })
      } else {
        this.$refs.Page_Table.clearSelection()
      }
    },
    // 表格数据变化
    tableData(val) {
      if (val) {
        this.$nextTick(() => {
          this.isRouterAlive = true
        })
      }
    }
  },
  methods: {
    handleRowClick(row, column, event) {
      if (column !== undefined) {
        if (column.label !== '操作') {
          this.$refs.Page_Table.toggleRowSelection(row)
        } else {
          return
        }
      }
    },
    handleSelectionChange(val) {
      this.$emit('selection-change', val)
    }
  }
}
</script>
<style lang="scss" scoped>
.table_new {
  width: 100%;
  // padding: 0 10px;
  box-sizing: border-box;
  // margin-top: 10px;
}
</style>
