<template>
  <el-card class="Quarterlyrental">
    <div slot="header" class="clearfix">
      <span class="title">季度出租率</span>
    </div>
    <div id="QuarterlyrentalContent" class="content">
      <div ref="chart" class="chart" />
    </div>
  </el-card>
</template>

<script>
import echarts from 'echarts'
export default {
  props: {
    quarterlyrentalData: {
      type: Object,
      default: () => {}
    },
    xAxis: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  data() {
    return {
      option: {
        color: ['#1979b5'],
        tooltip: {
          trigger: 'axis'
        },
        grid: {
          top: 28,
          x: 50,
          x2: 30,
          y2: 18,
          containLabel: false
        },
        xAxis: [
          {
            type: 'category',
            data: this.xAxis,
            // data: ['一季度', '二季度', '三季度', '四季度'],
            axisTick: {
              alignWithLabel: true
            }
          }
        ],
        yAxis: [
          {
            name: '月度出租率',
            type: 'value',
            splitLine: {
              show: true,
              lineStyle: {
                type: 'dashed'
              }
            },
            min: 0,
            max: 100,
            interval: 20,
            axisLabel: {
              formatter: '{value} %'
            }
          }
        ],
        series: [
          {
            name: '出租率',
            type: 'bar',
            barWidth: '30%',
            // data: [58, 78, 84, 58]
            data: []
          }
        ]
      },
      chart: null,
      resizeObserver: null
    }
  },
  watch: {
    quarterlyrentalData: {
      handler: function(v) {
        // console.log(v)
        const { cockpitExhibitionSumValues } = v
        if (cockpitExhibitionSumValues) {
          this.option.series[0].data = cockpitExhibitionSumValues
          // this.option.xAxis[0].data = xAxis
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
  methods: {
    resize() {
      this.chart.resize()
    },
    init() {
      this.chart = echarts.init(this.$refs.chart) // 初始化一个echarts
      this.chart.setOption(this.option) // setOption 用this.option中的数据开始作图
      const content = document.getElementById('QuarterlyrentalContent')
      this.resizeObserver = new ResizeObserver(this.resize)
      this.resizeObserver.observe(content)
    }

  }
}
</script>

<style lang="scss" scoped>
.Quarterlyrental {
  height: 100%;
  display: flex;
  flex-direction: column;
  ::v-deep {
    .el-card__body {
      flex: 1;
      height: 0;
    }
    // .el-card__header{
    //   padding: 14px 20px;
    // }
  }
  .content {
    height: 100%;
    .chart {
      height: 100%;
    }
  }
  .clearfix {
    .title {
      font-weight: 600;
    }
  }
}
</style>
