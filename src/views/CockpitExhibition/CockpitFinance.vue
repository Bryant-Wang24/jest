<template>
  <div class="finance">
    <CockpitSearch class="CockpitSearch" @submit="onSubmit" />
    <div class="content">
      <div class="header">
        <div class="left">

          <el-card class="box-card">
            <div slot="header" class="clearfix">
              <span>总销售额（万元）</span>
            </div>
            <div class="text item">
              <CountTo class="title TotalSalesTitle" :start-val="0" :end-val="TotalSales.totalAmount" :duration="1500" :decimals="2" />
              <el-radio-group v-model="TotalSales.radioValue" size="mini" style="text-align:right" @change="TotalSalesRadio">
                <el-radio-button :label="TOTAL_RADIO_TYPE.SEASON">{{ TOTAL_RADIO_TYPE_TEXT.SEASON }}</el-radio-button>
                <el-radio-button :label="TOTAL_RADIO_TYPE.MONTH">{{ TOTAL_RADIO_TYPE_TEXT.MONTH }}</el-radio-button>
              </el-radio-group>
              <div class="echar">
                <Charts ref="echartsTotal" :x-axis="TotalSales.xAxisTotal" :tooltip="TotalSales.tooltip" :series="TotalSales.seriesTotal" title="总销售额（万元）" />
              </div>
            </div>
          </el-card>

        </div>
        <div class="right">
          <div class="rightCard mb-20">

            <el-card v-for="(value,key) in TypeTotalAmounts" :key="key" class="box-card">
              <div slot="header" class="clearfix">
                <span>{{ TYPE_TITLE[key] }}</span>
              </div>
              <div class="text item">
                <CountTo class="title" :start-val="0" :end-val="value" :duration="1800" :decimals="2" />
              </div>
            </el-card>

          </div>
          <div class="broken">

            <el-card class="box-card">
              <div slot="header" class="clearfix">
                <span>月度销售情况</span>
              </div>
              <div class="text item">
                <div class="echar">
                  <Charts ref="MonthSales" :x-axis="MonthSales.xAxisMonth" :tooltip="MonthSales.tooltip" :legend="MonthSales.legendMonth" :series="MonthSales.seriesMonth" title="每月销售额（万元）" />
                </div>
              </div>
            </el-card>

          </div>
        </div>
      </div>

      <el-row :gutter="20" type="flex" class="foot">
        <el-col v-for="(item,index) of SeasonSales" :key="index" :span="8">
          <el-card class="box-card">
            <div slot="header" class="clearfix">
              <span>{{ item.title }}</span>
            </div>
            <div class="text item">
              <div class="echar">
                <Charts ref="SeasonSales" :x-axis="TOTAL_RADIO_TYPE_X.SEASON" :tooltip="item.tooltip" :series="item.seriesModular" title="总收入（万元）" :color="item.color" />
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>

    </div>
  </div>
</template>
<script>
import CountTo from 'vue-count-to'
import CockpitSearch from '@/components/FilterForm/cockpitSearch'
import Charts from './components/echarts'
// import MonthSales from './components/MonthSales'
// import pageMixin from '@/views/mixins/page'
import { TOTAL_RADIO_TYPE_X, TOTAL_RADIO_TYPE, TOTAL_RADIO_TYPE_TEXT, TYPE_TITLE, TYPE, MONTH_TYPE_COLOR, TYPE_OBJECT } from '@/common/finance'
import { isArray } from '@/utils/validate'

export default {
  // mixins: [pageMixin],
  name: 'CockpitFinance',
  components: { CockpitSearch, Charts, CountTo },
  data() {
    return {
      TOTAL_RADIO_TYPE,
      TOTAL_RADIO_TYPE_TEXT,
      TYPE,
      TYPE_TITLE,
      TYPE_OBJECT,
      TOTAL_RADIO_TYPE_X,
      year: `${new Date().getFullYear()}`,

      TotalSales: {
        totalAmount: 0,
        radioValue: TOTAL_RADIO_TYPE.SEASON,
        totalAmountQuarterGroup: [],
        totalAmountMonthGroup: [],
        xAxisTotal: TOTAL_RADIO_TYPE_X.SEASON,
        tooltip: {},
        seriesTotal: [
          {
            name: '销售额',
            type: 'bar',
            data: [],
            animationDuration: 2000,
            color: ['#5bc2e7']
          }
        ]
      },
      TypeTotalAmounts: {
        SHOP: 0,
        EXHIBITION: 0,
        MEETING: 0,
        ADVERTISEMENT: 0
      },
      MonthSales: {
        xAxisMonth: TOTAL_RADIO_TYPE_X.MONTH,
        legendMonth: [],
        seriesMonth: [],
        tooltip: {},
        typeTotalAmountMonthGroup: null
      },
      SeasonSales: [],

      contentHeight: {
        height: document.documentElement.clientHeight - 181 + 'px'
      },
      headerHeight: {
        height: (document.documentElement.clientHeight - 181) * 0.6 + 'px'
      }

    }
  },
  watch: {
  },
  mounted() {
    this.initPage()
  },
  methods: {
    initPage() {
      const params = { year: this.year }
      this.$api.finance.getFinance(params).then(res => {
        this.initTotalSales(res)
        this.initTypeTotalAmounts(res)
        this.initMonthSales(res)
        this.initSeasonSales(res)
      })
    },
    refresh(chart) {
      this.$nextTick(() => {
        if (isArray(this.$refs[`${chart}`])) {
          for (let i = 0; i < this.$refs[`${chart}`].length; i++) {
            const ref = this.$refs[`${chart}`][i]
            ref.initChart()
          }
        } else {
          this.$refs[`${chart}`].initChart()
        }
      })
    },
    initTotalSales(res) {
      const { totalAmount, totalAmountQuarterGroup, totalAmountMonthGroup } = res
      this.TotalSales.totalAmount = totalAmount
      this.TotalSales.totalAmountQuarterGroup = totalAmountQuarterGroup
      this.TotalSales.totalAmountMonthGroup = totalAmountMonthGroup
      // 默认赋值为季度
      this.TotalSales.seriesTotal[0].data = this.sortArrayFormObjectKey(totalAmountQuarterGroup)
      this.TotalSales.tooltip = {
        formatter: function(param) {
          const { name, marker, value, seriesName } = param[0]
          return `${name}<br/>${marker} ${seriesName}: ${value} 万元`
        }
      }
      this.refresh('echartsTotal')
    },
    TotalSalesRadio(val) {
      const { totalAmountQuarterGroup, totalAmountMonthGroup } = this.TotalSales
      switch (val) {
        case TOTAL_RADIO_TYPE.SEASON:
          this.TotalSales.seriesTotal[0].data = this.sortArrayFormObjectKey(totalAmountQuarterGroup)
          this.TotalSales.xAxisTotal = TOTAL_RADIO_TYPE_X.SEASON
          this.refresh('echartsTotal')
          break

        case TOTAL_RADIO_TYPE.MONTH:
          this.TotalSales.seriesTotal[0].data = this.sortArrayFormObjectKey(totalAmountMonthGroup)
          this.TotalSales.xAxisTotal = TOTAL_RADIO_TYPE_X.MONTH
          this.refresh('echartsTotal')
          break

        default:
          break
      }
    },
    initTypeTotalAmounts(res) {
      const { typeTotalAmount } = res
      if (!typeTotalAmount) return
      const { SHOP, EXHIBITION, MEETING, ADVERTISEMENT } = typeTotalAmount

      this.TypeTotalAmounts.SHOP = SHOP || 0
      this.TypeTotalAmounts.EXHIBITION = EXHIBITION || 0
      this.TypeTotalAmounts.MEETING = MEETING || 0
      this.TypeTotalAmounts.ADVERTISEMENT = ADVERTISEMENT || 0
    },
    initMonthSales(res) {
      const { typeTotalAmountMonthGroup } = res
      const keys = Object.keys(typeTotalAmountMonthGroup)

      this.MonthSales.typeTotalAmountMonthGroup = typeTotalAmountMonthGroup
      this.MonthSales.legendMonth = keys.map(key => TYPE[key])
      this.MonthSales.seriesMonth = keys.map(key => {
        const data = this.sortArrayFormObjectKey(typeTotalAmountMonthGroup[key])
        return {
          name: TYPE[key],
          type: 'line',
          smooth: false,
          data,
          color: MONTH_TYPE_COLOR[key]
        }
      })
      this.MonthSales.tooltip = {
        formatter: function(params) {
          const name = params[0].name
          let html = ''
          for (let i = 0; i < params.length; i++) {
            const param = params[i]
            const { marker, value, seriesName } = param
            html += `${marker} ${seriesName}: ${value} 万元<br/>`
          }
          return `${name}<br/>${html}`
        }
      }
      // debugger
      this.refresh('MonthSales')
    },
    initSeasonSales(res) {
      const { typeTotalAmountQuarterGroup } = res
      const array = [TYPE_OBJECT.EXHIBITION, TYPE_OBJECT.MEETING, TYPE_OBJECT.ADVERTISEMENT]
      const sales = []
      for (let i = 0; i < array.length; i++) {
        const item = array[i]
        const Quarter = typeTotalAmountQuarterGroup[array[i]] || {}
        sales.push({
          title: `季度${TYPE[item]}收入`,
          color: [MONTH_TYPE_COLOR[item]],
          seriesModular: [{
            name: '总收入',
            type: 'bar',
            stack: 'vistors',
            barWidth: '60%',
            animationDuration: 2000,
            data: this.sortArrayFormObjectKey(Quarter)
          }],
          tooltip: {
            formatter: function(params) {
              const { name, marker, value, seriesName } = params[0]
              return `${name}<br/>${marker} ${seriesName}: ${value} 万元`
            }
          }
        })
      }
      this.SeasonSales = sales

      this.refresh('SeasonSales')
    },
    onSubmit(val) {
      this.year = val
      this.initPage()
    },
    sortArrayFormObjectKey(obj) {
      const keys = Object.keys(obj).sort((a, b) => Number(a) - Number(b))
      const array = []
      for (let i = 0; i < keys.length; i++) {
        const key = keys[i]
        array.push(obj[key])
      }
      return array
    }
  }
}
</script>
<style scoped lang="scss">
.el-card{
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction:column;
  ::v-deep .el-card__header{
    padding: 15px 20px;
    box-sizing: border-box;
  }
  ::v-deep .el-card__body{
    flex: 1;
    height: 0;
    .text{
      height: 100%;
      display: flex;
      flex-direction:column;
    }
    .title{
      font-size: 26px;
    }
    .TotalSalesTitle {
      font-size: 32px;
    }
    .echar{
      flex: 1;
    }
  }
}
.finance{
  display: flex;
  flex-direction: column;
  padding: 20px;
  height: calc(100vh - 84px);
  // padding: 20px;
  // box-sizing: border-box;
  .CockpitSearch {
    // padding: 20px 0;
    margin-bottom: 20px;
  }
  .content{
    flex: 1;
    width: 100%;
    display: flex;
    flex-direction:column;
    .header{
      height: 60%;
      width: 100%;
      display: flex;
      .left{
        width: 23%;
        margin-right: 20px;
      }
      .right{
        flex: 1;
        display: flex;
        flex-direction:column;
        .rightCard{
          width: 100%;
          height: 120px;
          display: flex;
          justify-content: space-between;
          .el-card{
            width: 24%;
          }
        }
        .broken{
          flex: 1;
        }
      }
    }
    .foot{
      height: calc(40% - 20px);
      margin-top: 20px;
      flex: 1;
      display: flex;
      justify-content: space-between;
      // .el-card{
      //   width: 33%;
      // }
      ::v-deep .el-card__body{
        .title{
          font-size: 26px;
        }
      }
    }
  }
}
</style>
