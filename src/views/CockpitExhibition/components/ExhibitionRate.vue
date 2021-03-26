<template>
  <el-card class="ExhibitionRate">
    <div slot="header" class="clearfix">
      <span class="title">{{ titleList.exhibitionRatetitle }}</span>
    </div>
    <div id="ExhibitionRateContent" class="content">
      <div ref="chart" class="chart" />
    </div>
  </el-card>
  <!--
  ref="myechart"定义该div也就是画布的名字，在this.$echarts.init(this.$refs.myechart) 图表初始化的时候使用
  this.$refs.myechart 也可以替换为 document.getElementById('main') 或者 document.getElementByClassName('echart-box')
  -->
</template>
<script>
import echarts from 'echarts'
export default {
  name: 'ExhibitionRate',
  props: {
    exhibitionRateData: {
      type: Object,
      default: () => {}
    },
    titleList: {
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
      // 定义图表
      option: {
        tooltip: {
          // show: true,
          trigger: 'axis',
          formatter: '{b0}<br/>{a0}: {c0}<br />{a1}: {c1}%<br />'
        },
        legend: {
          data: ['展会数量', '月度出租率']
        },
        xAxis: [
          {
            type: 'category',
            boundaryGap: true,
            data: this.xAxis,
            axisTick: {
              show: false
            }
          },
          {
            type: 'category',
            boundaryGap: true
          }
        ],
        yAxis: [
          {
            type: 'value',
            name: '每月展会数',
            max: 8,
            min: 0,
            // interval: 1,
            splitLine: {
              show: true,
              lineStyle: {
                type: 'dashed'
              }
            }
          },
          {
            type: 'value',
            name: '月度出租率',
            min: 0,
            max: 100,
            interval: 8,
            splitLine: {
              show: false
            },
            axisLabel: {
              formatter: '{value} %'
            },
            axisTick: {
              show: false
            }
          }
        ],
        series: [
          {
            name: '展会数量',
            type: 'bar',
            // xAxisIndex: 1,
            yAxisIndex: 0,
            data: [],
            itemStyle: { normal: { color: '#1979b5' }}
          },
          {
            name: '月度出租率',
            type: 'line',
            yAxisIndex: 1,
            lineStyle: {
              normal: {
                color: '#db9737'
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
    exhibitionRateData: {
      handler: function(v) {
        const { exhibitionSumValues, exhibitionRentValues } = v
        if (exhibitionSumValues && exhibitionRentValues) {
          this.option.series[0].data = exhibitionSumValues
          this.option.series[1].data = exhibitionRentValues
          this.init()
        }
      },
      immediate: true,
      deep: true
    }
  },
  mounted() {
    // console.log(this.$echarts)
    // this.chart = echarts.init(this.$refs.chart) // 初始化一个echarts
    // this.chart.setOption(this.option) // setOption 用this.option中的数据开始作图
    // const content = document.getElementById('ExhibitionRateContent')
    // this.resizeObserver = new ResizeObserver(this.resize)
    // this.resizeObserver.observe(content)
  },
  methods: {
    resize() {
      this.chart.resize()
    },
    init() {
      this.chart = echarts.init(this.$refs.chart) // 初始化一个echarts
      this.chart.setOption(this.option) // setOption 用this.option中的数据开始作图
      // debugger
      const content = document.getElementById('ExhibitionRateContent')
      this.resizeObserver = new ResizeObserver(this.resize)
      this.resizeObserver.observe(content)
    }
  }

}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.ExhibitionRate {
  height: 100%;
  display: flex;
  flex-direction: column;
  ::v-deep {
    .el-card__body {
      flex: 1;
      height: 0;
    }
  }
  .content {
    height: 100%;
    .chart {
      height: 100%;
    }
  }
  .title{
    font-weight: 600;
  }
}
</style>
