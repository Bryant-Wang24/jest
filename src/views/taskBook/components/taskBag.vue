<template>
  <div class="taskBag">
    <el-dialog
      title="选择任务包"
      :close-on-click-modal="false"
      :visible.sync="dialogVisible"
      :before-close="handleClose"
      width="50%"
    >
      <el-tabs v-model="activeName">
        <el-tab-pane v-for="(item,index) in tabsHeader" :key="index" :label="item.label" :name="item.name">
          <div class="title">
            <div>任务明细</div>
          </div>
          <div class="table">
            <el-table
              ref="taskBag"
              v-loading="tableLoading"
              style="width: 100%"
              :data="item.tableData"
              :empty-text="emptyText"
              :header-cell-style="{color: '#333',fontWeight:'normal',fontSize: '16px',backgroundColor: '#FAFAFA'}"
              :cell-style="{color: '#000', fontSize: '14px'}"
              border
            >
              <el-table-column prop="department" label="部门" width="150" />
              <el-table-column prop="job" label="工作项" />
            </el-table>
          </div>
          <div class="pages">
            <el-pagination
              background
              layout="prev, pager, next"
              :total="20"
            />
          </div>
        </el-tab-pane>
      </el-tabs>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="confirm">确 定</el-button>
        <el-button @click="call">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  props: {
    dialogVisible: {
      type: Boolean,
      default: () => {
        return false
      }
    }
  },
  data() {
    return {
      emptyText: '暂无数据',
      tableLoading: false,
      activeName: '筹展期任务',
      // tabs数据
      tabsHeader: [
        {
          label: '筹展期任务',
          name: '筹展期任务',
          tableData: [
            { department: '安全保卫部', job: '大前端' }
          ]
        },
        { label: '布展任务', name: '布展任务', tableData: [] },
        { label: '开展任务', name: '开展任务', tableData: [] },
        { label: '撤展任务', name: '撤展任务', tableData: [] }
      ]
    }
  },
  methods: {
    call() {
      this.$emit('call')
    },
    confirm() {
      this.$emit('confirm')
    },
    handleClose() {
      this.$emit('handleClose')
    }
  }

}
</script>

<style lang="scss" scoped>
  ::v-deep .el-dialog__footer {
    text-align: center;
  }
  .title {
    margin-top: 20px;
    font-weight: bold;
    color: #000;
    font-size: 16px;
    margin-bottom: 20px;
  }
  .pages {
    margin-top: 20px;
  }
</style>
