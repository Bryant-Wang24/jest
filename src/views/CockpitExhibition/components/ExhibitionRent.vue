<template>
  <el-card class="ExhibitionRent">
    <div slot="header" class="clearfix">
      <span>总出租率</span>
    </div>
    <div id="ExhibitionRentContent" class="content">
      <div id="chart" ref="chart" />
    </div>
  </el-card>
</template>

<script>
import echarts from 'echarts'
import 'echarts-liquidfill/src/liquidFill.js'
export default {
  props: {
    exhibitionRentData: {
      type: Number,
      default: () => 0
    }
  },
  data() {
    return {
      chart: null,
      resizeObserver: null,
      clientWidth: ''
    }
  },
  computed: {
  },
  watch: {
    exhibitionRentData(val) {
      this.initChart()
    }
  },
  mounted() {
    this.initChart()
  },
  methods: {
    initChart() {
      const content = document.getElementById('ExhibitionRentContent')
      // const chart = document.getElementById('chart')
      const chart = this.$refs.chart
      const clientWidth = content.clientWidth
      content.style.height = clientWidth + 'px'
      chart.style.height = clientWidth + 'px'
      this.clientWidth = clientWidth
      this.chart = echarts.init(chart)
      this.chart.setOption({
        series: [{
          type: 'liquidFill',
          data: [{ value: this.exhibitionRentData }].concat(this.decreasing(this.exhibitionRentData)),
          radius: '90%',
          label: {
            fontSize: 24
          },
          outline: {
            borderDistance: 0,
            itemStyle: {
              borderWidth: 2,
              borderColor: '#156ACF'
            }
          }
        }]
      })

      // this.resizeObserver = new ResizeObserver(this.resize)
      // this.resizeObserver.observe(content)
    },
    decreasing(num) {
      if (!num) return []
      return [num / 2, num / 4]
    },
    resize(entries) {
      // const target = entries?.[0]?.contentRect
      // if (!target) return
      // const { clientWidth } = target
      // console.log('clientWidth', clientWidth)
      // console.log('this.clientWidth', this.clientWidth)
      // if (clientWidth !== this.clientWidth) {
      //   this.chart?.dispose()
      //   this.chart = null
      //   this.chart.resize()
      // }
    }
  }
}
</script>

<style lang="scss" scoped>
.ExhibitionRent {
  height: 100%;
  width: 100%;
  .content {
    width: 100%;
    height: 100%;
    #chart {
      width: 100%;
    }
  }
}
</style>
