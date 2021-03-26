<template>
  <el-card class="ExhibitionSchedule">
    <div slot="header" class="clearfix">
      <span class="title">{{ titleList.exhibitionScheduletitle }}</span>
      <!-- {{ exhibitionScheduleData }} -->
    </div>
    <div id="ExhibitionScheduleContent" ref="content" class="content">
      <el-table
        ref="table"
        :data="exhibitionScheduleData"
        border
        class="tablebox"
      >
        <el-table-column prop="meetName" label="起始时间" width="120px">
          <template slot-scope="scope">
            <span>{{ scope.row.from }} 至 {{ scope.row.to }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="meetName" label="展会名称">
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{ scope.row.projectName }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="meetName" label="面积(㎡)" width="80px">
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{ scope.row.area }}</span>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </el-card>
</template>

<script>
export default {
  props: {
    exhibitionScheduleData: {
      type: Array,
      default: () => []
    },
    titleList: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      tableData: [],
      content: null,
      height: 0
    }
  },
  mounted() {
    const content = this.$refs.content
    this.content = content
    this.height = this.content.clientHeight
  },
  methods: {
    init() {
      const content = this.$refs.content
      this.content = content
      this.height = this.content.clientHeight

      const ExhibitionScheduleContent = document.getElementById('ExhibitionScheduleContent')
      this.resizeObserver = new ResizeObserver(this.resize)
      this.resizeObserver.observe(ExhibitionScheduleContent)
    },
    resize() {
      const content = this.$refs.content
      this.content = content
      this.height = this.content.clientHeight
    }
  }
}
</script>

<style lang="scss" scoped>
.ExhibitionSchedule {
  height: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: column;
   ::v-deep {
     .el-card__body {
       overflow: auto;
     }
   }
}
// .ExhibitionSchedule {
//   height: 100%;
//   display: flex;
//   flex-direction: column;
//   ::v-deep {
//     .el-card__body {
//       flex: 1;
//     }
//     .el-card__header {
//       padding: 14px 20px;
//     }
//   }
//   .content {
//     height: 100%;
//     .chart {
//       height: 100%;
//     }
//   }
//   .title {
//     font-weight: 600;
//   }
//   //   .el-table__row {
//   //     padding: 0;
//   //     height: 10px;
//   // }
// }
</style>
