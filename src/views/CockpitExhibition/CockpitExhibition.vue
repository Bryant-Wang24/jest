<template>
  <div class="CockpitExhibition">
    <CockpitSearch class="CockpitSearch" @submit="CockpitSearch" />
    <div class="wrap">
      <el-row :gutter="20" class="row top" type="flex">
        <el-col :span="4">
          <el-row type="flex" class="flex-colunm">
            <el-col class="mb-20">
              <ExhibitionSum
                :exhibition-sum-data="exhibitionSumData"
                :title-list="titleList"
              />
            </el-col>
            <el-col class="ExhibitionRentWrap">
              <ExhibitionRent :exhibition-rent-data="exhibitionRentData" />
            </el-col>
          </el-row>
        </el-col>

        <el-col :span="12">
          <ExhibitionRate
            :exhibition-rate-data="exhibitionRateData"
            :title-list="titleList"
            :x-axis="TOTAL_RADIO_TYPE_X.MONTH"
          />
        </el-col>

        <el-col :span="8">
          <SingleExhibitionRent
            ref="SingleExhibitionRent"
            :single-exhibition-rent-data="singleExhibitionRentData"
            :title-list="titleList"
            @siteOccupancy="siteOccupancy"
          />
        </el-col>
      </el-row>

      <el-row :gutter="20" class="row bottom" type="flex">
        <el-col :span="8">
          <Quarterlyrental :quarterlyrental-data="quarterlyrentalData" :x-axis="TOTAL_RADIO_TYPE_X.SEASON" />
        </el-col>

        <el-col :span="8">
          <PiechartExhibition
            :piechart-exhibition-data="piechartExhibitionData"
            :title-list="titleList"
          />
        </el-col>

        <el-col :span="8">
          <ExhibitionSchedule
            :exhibition-schedule-data="exhibitionScheduleData"
            :title-list="titleList"
          />
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import CockpitSearch from '@/components/FilterForm/cockpitSearch'
import ExhibitionSum from './components/ExhibitionSum'
import ExhibitionRent from './components/ExhibitionRent'
import SingleExhibitionRent from './components/SingleExhibitionRent'
import ExhibitionRate from './components/ExhibitionRate'
import Quarterlyrental from './components/Quarterlyrental'
import PiechartExhibition from './components/PiechartExhibition'
import ExhibitionSchedule from './components/ExhibitionSchedule'
import moment from 'moment'
import { toPercentNumber } from '@/utils/common'
import { TOTAL_RADIO_TYPE_X } from '@/common/finance'

export default {
  name: 'CockpitExhibition',
  components: {
    CockpitSearch,
    ExhibitionSum,
    ExhibitionRent,
    SingleExhibitionRent,
    ExhibitionRate,
    Quarterlyrental,
    PiechartExhibition,
    ExhibitionSchedule
  },
  data() {
    return {
      TOTAL_RADIO_TYPE_X,
      exhibitionSumData: {},
      exhibitionRateData: {},
      singleExhibitionRentData: [],
      quarterlyrentalData: {},
      piechartExhibitionData: {},
      exhibitionScheduleData: [],
      exhibitionRentData: 0,
      titleList: {
        exhibitionSumtitle: '总展会数',
        exhibitionRatetitle: '展会数与月度出租率',
        exhibitionScheduletitle: '展会排期表',
        singleExhibitionRenttitle: '各展馆出租率',
        piechartExhibitiontitle: '展会面积占比'
      },
      year: 2021
    }
  },
  mounted() {
    this.inintPage()
  },
  created() {
  },
  methods: {
    inintPage() {
      // 请求数据
      this.siteOccupancy()
      this.chainRatio()
      this.schedule()
      this.projectNumAnd()
      this.areaDistribution()
      this.projectNumAndOccupancy()
      this.quarterlyrentalrate()
      // 部分子组件初始化
      this.$refs.SingleExhibitionRent.initData()
    },
    // 子组件点击下拉框传值
    siteOccupancynum(params) {
      const obj = {
        year: this.year,
        typesIncluded: ['EXHIBITION'],
        timeUnit: params.timeUnit,
        timeValue: params.timeValue
      }
      // console.log(obj)
      if (obj.timeUnit && obj.timeValue) {
        this.$api.flihtdeckApi.siteOccupancy(obj).then(res => {
          this.singleExhibitionRentData = []
          for (const i in res) {
            this.singleExhibitionRentData.push({
              name: res[i].name,
              occupancy: 'occupancy' in res[i] ? Number(toPercentNumber(res[i].occupancy)) : 0,
              id: res[i].id
            })
          }
        })
      } else {
        this.siteOccupancy()
      }
    },
    CockpitSearch(val) {
      this.year = val
      this.inintPage()
    },
    // 总展会数
    chainRatio() {
      const obj = { year: this.year, typesIncluded: ['EXHIBITION'] }
      this.$api.flihtdeckApi.chainRatio(obj).then(res => {
        // console.log(res)
        this.exhibitionSumData = { ...this.exhibitionSumData, ...res }
      })
    },
    // 各展馆出租率
    siteOccupancy(params) {
      const obj = {
        year: this.year,
        typesIncluded: ['EXHIBITION'],
        timeUnit: (params?.timeValue && params?.timeUnit) ? params.timeUnit : '',
        timeValue: (params?.timeValue && params?.timeUnit) ? params.timeValue : ''
      }
      this.$api.flihtdeckApi.siteOccupancy(obj).then(res => {
        this.singleExhibitionRentData = []
        for (const i in res) {
          this.singleExhibitionRentData.push({
            name: res[i].name,
            occupancy: 'occupancy' in res[i] ? Number(toPercentNumber(res[i].occupancy)) : 0
          })
        }
      })
    },
    // 展会面积占比
    areaDistribution() {
      const obj = {
        year: this.year,
        typesIncluded: ['EXHIBITION']
      }
      this.$api.flihtdeckApi.areaDistribution(obj).then(res => {
        const legendDate = []
        const seriesDate = []
        for (let i = 0; i < res.length; i++) {
          const { leftEnd, rightEnd, projectNum: value } = res[i]
          const leftEndLabel = leftEnd ? `${leftEnd}㎡ < ` : ''
          const rightEndLabel = rightEnd ? ` < ${rightEnd}㎡` : ''
          const name = leftEndLabel + 'x' + rightEndLabel

          legendDate.push(name)
          seriesDate.push({ value, name })
          // legendDate.push(leftEnd + '< x <' + rightEnd + '㎡')
          // seriesDate.push({
          //   value: res[i].projectNum,
          //   name: leftEnd + '< x <' + rightEnd + '㎡'
          // })
        }
        this.piechartExhibitionData = { legendDate, seriesDate }
      })
    },
    // 展会排期表
    schedule() {
      const obj = {
        year: this.year,
        typesIncluded: ['EXHIBITION']
      }
      this.$api.flihtdeckApi.schedule(obj).then(res => {
        res.reverse(function(a, b) {
          return a.from - b.from
        })

        res.map(item => {
          item.from = moment(item.from).format('MM-DD')
          return item.from
        })
        res.map(item => {
          item.to = moment(item.to).format('MM-DD')
          return item.to
        })
        this.exhibitionScheduleData = res
      })
    },
    // 展会数与月度出租率
    projectNumAndOccupancy() {
      const obj = {
        year: this.year,
        typesIncluded: ['EXHIBITION'],
        timeUnit: 'MONTH'
      }
      this.$api.flihtdeckApi.projectNumAndOccupancy(obj).then(res => {
        // console.log(res)
        this.TOTAL_RADIO_TYPE_X = TOTAL_RADIO_TYPE_X.MONTH
        const resObj = {}
        for (let i = 0; i < res.length; i++) {
          const item = res[i]
          resObj[item.timeValue] = item
        }

        const exhibitionSumValues = []
        const exhibitionRentValues = []
        for (let i = 1; i <= 12; i++) {
          if (Reflect.has(resObj, String(i))) {
            exhibitionSumValues.push(resObj[i].projectNum)
            exhibitionRentValues.push(toPercentNumber([resObj[i].occupancy]))
            continue
          }
          exhibitionSumValues.push(0)
          exhibitionRentValues.push(0)
        }
        this.exhibitionRateData = { exhibitionSumValues, exhibitionRentValues }
      })
    },
    // 季度出租率
    quarterlyrentalrate() {
      const obj = {
        year: this.year,
        typesIncluded: ['EXHIBITION'],
        timeUnit: 'QUARTER'
      }
      this.$api.flihtdeckApi.projectNumAndOccupancy(obj).then(res => {
        this.TOTAL_RADIO_TYPE_X = TOTAL_RADIO_TYPE_X.SEASON
        // console.log(res)
        const resObj = {}
        for (let i = 0; i < res.length; i++) {
          const item = res[i]
          resObj[item.timeValue] = item
        }
        const cockpitExhibitionSumValues = []
        for (let i = 1; i <= 4; i++) {
          if (Reflect.has(resObj, String(i))) {
            cockpitExhibitionSumValues.push(toPercentNumber(resObj[i].occupancy))
            continue
          }
          cockpitExhibitionSumValues.push(0)
        }
        this.quarterlyrentalData = { cockpitExhibitionSumValues }
      })
    },
    // 总出租率
    projectNumAnd() {
      const obj = {
        year: this.year,
        typesIncluded: ['EXHIBITION'],
        timeUnit: 'YEAR'
      }
      this.$api.flihtdeckApi.projectNumAndOccupancy(obj).then(res => {
        this.exhibitionRentData = Number(
          toPercentNumber(!(res[0].occupancy) ? 0 : ((res[0].occupancy) / 100))
        )
      })
    }
  }
}
</script>

<style lang="scss" scoped>
#iframe {
  width: 100%;
  height: 100%;
}
.CockpitExhibition {
  display: flex;
  flex-direction: column;
  padding: 20px;
  height: calc(100vh - 84px);
  .CockpitSearch {
    margin-bottom: 20px;
  }
  .wrap {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    .top {
      height: 60%;
    }
    .bottom {
      // flex: 1;
      height: calc(40% - 20px);
      margin-top: 20px;
    }
    // .row.bottom {
    //   flex: 1;
    //   margin-top: 20px;
    // }
  }
  .flex-colunm {
    flex-direction: column;
    height: 100%;
    .ExhibitionRentWrap {
      flex: 1;
    }
  }
  .el-card__header{
    padding: 14px 20px;
  }
}
</style>
