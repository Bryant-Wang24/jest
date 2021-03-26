<template>
  <div :class="className" :style="{ height: height, width: width }" />
</template>

<script>
import echarts from 'echarts'
require('echarts/theme/macarons') // echarts theme
import resize from '@/components/Charts/mixins/resize'
export default {
  mixins: [resize],
  props: {
    className: {
      type: String,
      default: 'chart'
    },
    title: {
      type: String,
      default: 'chart'
    },
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '100%'
    },
    legend: {
      type: Array,
      default: () => {
        return []
      }
    },
    grid: {
      type: Object,
      default: () => {
        return {}
      }
    },
    xAxis: {
      type: Object,
      default: () => {
        return {}
      }
    },
    yAxis: {
      type: Object,
      default: () => {
        return {}
      }
    },
    color: {
      type: Array,
      default: () => {
        return ['#FFEB00']
      }
    },
    series: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  data() {
    return {
      chart: null
    }
  },
  created() {},
  mounted() {
    this.$nextTick(() => {
      this.initChart()
    })
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null
  },
  methods: {
    initChart() {
      this.chart = echarts.init(this.$el, 'macarons')
      this.chart.setOption({
        title: {
          text: this.title
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: { // 坐标轴指示器，坐标轴触发有效
            type: 'line' // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        legend: {
          data: this.legend
        },
        grid: {
          top: 40,
          left: '2%',
          right: '2%',
          bottom: 0,
          containLabel: true
        },
        xAxis: [{
          type: 'category',
          data: [],
          boundaryGap: false,
          axisTick: {
            alignWithLabel: true
          },
          axisLabel: {
            textStyle: {
              color: '#000000'
            }
          },
          axisLine: {
            lineStyle: {
              color: '#E5E5E5'
            }
          },
          ...this.xAxis
        }],
        yAxis: [{
          type: 'value',
          axisLabel: {
            textStyle: {
              color: '#000000'
            }
          },
          axisLine: {
            lineStyle: {
              color: '#E5E5E5'
            }
          }
          // axisTick: {
          //   show: false
          // }
        }],

        series: this.series
      })
    },
    refresh() {
      this.chart.dispose()
      this.initChart()
    }
  }
}
</script>

<style></style>
