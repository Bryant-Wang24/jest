<template>
  <el-timeline :reverse="false" :style="style()">
    <el-timeline-item
      v-for="(item, index) in list"
      :key="index"
      :timestamp="item.timestamp"
      placement="top"
    >
      <slot :row="item" />
    </el-timeline-item>
  </el-timeline>
</template>

<script>
// list.timestamp为时间日期 必传
const DATE = {
  'YYYY': {
    left: '-46px',
    paddingLeft: '50px'
  },
  'YYYY-MM': {
    left: '-64px',
    paddingLeft: '70px'
  },
  'YYYY-MM-DD': {
    left: '-84px',
    paddingLeft: '90px'
  },
  'YYYY-MM-DD HH': {
    left: '-100px',
    paddingLeft: '110px'
  },
  'YYYY-MM-DD HH:MM': {
    left: '-120px',
    paddingLeft: '130px'
  },
  'YYYY-MM-DD HH:MM:SS': {
    left: '-140px',
    paddingLeft: '150px'
  }
}
export default {
  props: {
    list: {
      type: Array,
      default: () => {
        return []
      }
    },
    date: {
      type: String,
      default: 'YYYY-MM-DD HH:MM:SS'
    }
  },
  data() {
    return {
    }
  },
  computed: {
  },
  mounted() {
  },
  methods: {
    style() {
      const { paddingLeft, left } = DATE[this.date]
      return {
        paddingLeft,
        '--is-top-left': left
      }
    }
  }
}
</script>
<style lang="scss" scoped>
::v-deep .el-timeline-item__timestamp.is-top {
    position: absolute;
    // left: -90px;
    left: var(--is-top-left);
    top: -3px;
    color: #333333;
}
::v-deep .el-timeline {
    padding-left: 150px;
}
</style>
