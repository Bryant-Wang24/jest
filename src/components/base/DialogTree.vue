<template>
  <el-dialog
    :title="title"
    :visible.sync="dialogVisible"
    :width="width"
    :close-on-click-modal="closeOnClickModal"
    @close="emitVisible"
  >
    <div class="dialog-box">
      <div class="dialog-box-container">
        <el-input v-model="filterText" placeholder="输入关键字进行过滤" />
        <el-tree
          ref="tree"
          v-bind="$attrs"
          highlight-current
          :show-checkbox="showCheckbox"
          :check-on-click-node="showCheckbox"
          node-key="id"
          :filter-node-method="filterNode"
          :props="props"
          v-on="$listeners"
        />
      </div>
      <div class="dialog-box-footer">
        <el-button @click="toggleTreeDialog">{{ cancelButtonText }}</el-button>
        <el-button type="primary" @click="getChecked">{{
          confirmButtonText
        }}</el-button>
      </div>
    </div>
  </el-dialog>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: ''
    },
    width: {
      type: String,
      default: '30%'
    },
    closeOnClickModal: {
      type: Boolean,
      default: false
    },
    visible: {
      type: Boolean,
      default: false
    },
    props: {
      type: Object,
      default: () => {
        return { children: 'childItems', label: 'name' }
      }
    },
    confirmButtonText: {
      type: String,
      default: '确定'
    },
    cancelButtonText: {
      type: String,
      default: '取消'
    },
    showCheckbox: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      filterText: '',
      dialogVisible: this.visible
    }
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val)
    },
    visible() {
      this.dialogVisible = this.visible
    }
  },
  methods: {
    toggleTreeDialog() {
      this.dialogVisible = !this.dialogVisible
      this.emitVisible()
    },
    emitVisible() {
      this.$emit('update:visible', this.dialogVisible)
    },
    filterNode(value, data) {
      if (!value) return true
      return data[this.props.label].indexOf(value) !== -1
    },
    getChecked() {
      // 多选使用getCheckedNodes和getCheckedKeys获取checkBox
      this.$emit('getCheckedNodes', this.$refs.tree.getCheckedNodes() || {})
      this.$emit('getCheckedKeys', this.$refs.tree.getCheckedKeys() || {})
      // 单选使用getCurrentNode和getCurrentKey获取当前选中的data
      this.$emit('getCurrentNode', this.$refs.tree.getCurrentNode() || {})
      this.$emit('getCurrentKey', this.$refs.tree.getCurrentKey() || {})
    }
  }
}
</script>

<style lang="scss" scoped>
$boxHeight: 500px;
$footHeight: 50px;
.dialog-box {
  width: 100%;
  height: $boxHeight;
  &-container {
    width: 100%;
    height: $boxHeight - $footHeight;
    overflow-y: auto;
  }
  &-footer {
    width: 100%;
    height: $footHeight;
    text-align: right;
    line-height: $footHeight;
  }
}
</style>
