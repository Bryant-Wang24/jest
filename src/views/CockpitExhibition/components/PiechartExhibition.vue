<template>
  <el-card class="PiechartExhibition">
    <div slot="header" class="clearfix">
      <span class="title">{{ titleList.piechartExhibitiontitle }}</span>
    </div>
    <div id="PiechartExhibitionContent" class="content">
      <!-- {{ piechartExhibitionData }} -->
      <div ref="chart" class="chart" />
    </div>
  </el-card>
</template>
<script>
import echarts from 'echarts'
export default {
  props: {
    piechartExhibitionData: {
      type: Object,
      default: () => {}
    },
    titleList: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      // seriesDate: [],
      // legendDate: [],
      option: {
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        color: ['#c3332d', '#2b4353', '#61a1aa', '#a1dbc0', '#75a084'],
        legend: {
          left: 'right',
          data: [],
          orient: 'vertical',
          align: 'left',
          itemWidth: 20,
          itemHeight: 12,
          itemGap: 4
        },
        // radar: {
        //   radius: 20
        // },
        series: [
          {
            name: '展会数量',
            // radius: '70%', // 设置饼图大小
            type: 'pie',
            radius: [10, 65],
            center: ['30%', '52%'],
            roseType: 'radius',
            // radius: '30%',
            label: {
              show: false
            },
            emphasis: {
              label: {
                show: true
              }
            },
            data: []
          }
        ]
      },
      chart: null
    }
  },
  watch: {
    piechartExhibitionData: {
      handler: function(v) {
        const { legendDate, seriesDate } = v
        if (legendDate && seriesDate) {
          this.option.legend.data = legendDate
          this.option.series[0].data = seriesDate
          this.init()
        }
      },
      immediate: true,
      deep: true
    }
  },
  mounted() {
    // const chart = echarts.init(this.$refs.chart) // 初始化一个echarts
    // chart.setOption(this.option) // setOption 用this.option中的数据开始作图
  },
  created() {
    // this.areaDistribution()
  },
  methods: {
    init() {
      this.chart = echarts.init(this.$refs.chart) // 初始化一个echarts
      this.chart.setOption(this.option) // setOption 用this.option中的数据开始作图

      const content = document.getElementById('PiechartExhibitionContent')
      this.resizeObserver = new ResizeObserver(this.resize)
      this.resizeObserver.observe(content)
    },
    resize() {
      this.chart.resize()
    }
  }
}
</script>

<style lang="scss" scoped>
.PiechartExhibition {
  height: 100%;
  display: flex;
  flex-direction: column;
  ::v-deep {
    .el-card__body {
      flex: 1;
      height: 0;
    }
    .el-card__header {
      padding: 14px 20px;
    }
  }
  .content {
    height: 100%;
    .chart {
      height: 100%;
    }
  }
  .title {
    font-weight: 600;
  }
}
</style>
