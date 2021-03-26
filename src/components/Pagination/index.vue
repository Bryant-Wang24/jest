<template>
  <div class="pagination">
    <div class="tatal_new">显示第{{ currentPage }}页中{{ to }}条数据，总共{{ total }}条数据</div>
    <el-pagination
      background
      :page-sizes="[15,30,45]"
      :page-size="to||10"
      :current-page="currentPage||1"
      :layout="layout"
      :total="total||0"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
</template>
<script>
export default {
  name: 'PagePagination',
  props: {
    total: {
      type: Number,
      default: 0
    },
    to: {
      type: Number,
      default: 10
    },
    currentPage: {
      type: Number,
      default: 1
    },
    layout: {
      type: String,
      default: 'prev, pager, next'
    }
  },
  // props: ['total', 'to', 'current_page'],
  data() {
    return {
    }
  },
  methods: {
    handleSizeChange(val) {
      this.$emit('handleSizeChange', val)
    },
    handleCurrentChange(val) {
      this.$emit('handleCurrentChange', val)
    }
  }
}
</script>

<style lang="scss" scoped>
.pagination{
  width: 100%;
  display: flex;
  justify-content: space-between;
  .tatal_new{
    line-height: 32px;
    font-size: 14px;
    color: #000000;
    font-weight: 400;
  }
}
</style>
