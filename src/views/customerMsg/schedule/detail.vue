<template>
  <div id="detail">
    <div v-if="isConflictInfo" class="conflictTop">
      <div class="row">
        <span class="title">冲突项目：</span>
        <span>{{ sonflictNames }}</span>
      </div>
      <div class="row">
        <span class="title">查看详情：</span>
        <div>
          <el-radio-group v-model="id" @change="handleChangeCurrentSite">
            <el-radio
              v-for="item in siteInfos"
              :key="item.id"
              :label="item.id"
            >{{ item.projectName }}</el-radio>
          </el-radio-group>
        </div>
      </div>
    </div>
    <rowText :text="'基础信息'" />
    <baseInfo :form="baseInfoData" />
    <rowText :text="'场地&时间安排'" />
    <siteAndTimeInfo :form="siteAndTimeInfoData" :row-data="rowData" />
    <rowText :text="'联系人信息'" />
    <contactInfo :form="contactInfoData" />
    <div class="footer">
      <el-button @click="handleOk">确定</el-button>
    </div>
  </div>
</template>

<script>
import rowText from '@/components/rowText'
import baseInfo from './baseInfo'
import siteAndTimeInfo from './siteAndTimeInfo'
import contactInfo from './contactInfo'
import moment from 'moment'
export default {
  components: { rowText, baseInfo, siteAndTimeInfo, contactInfo },
  props: {
    // rowData: {
    //   type: Object,
    //   default: () => {
    //     return {}
    //   }
    // },
    siteInfos: {
      type: Array,
      default: () => {
        return []
      }
    },
    isConflictInfo: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      infos: [],
      id: null,
      baseInfoData: {},
      siteAndTimeInfoData: {},
      contactInfoData: [],
      rowData: {}
    }
  },
  computed: {
    sonflictNames() {
      const arr = this.infos.map(item => {
        return item?.projectName
      })
      console.log('sonflictNames', arr)
      return arr.join('，')
    }
  },
  created() {
    this.infos = this.siteInfos
    this.id = this.siteInfos[0]?.id
  },
  mounted() {
    this._getSiteInfoFormId(this.id)
    console.log('dialog mounted')
  },
  methods: {
    handleOk() {
      this.$emit('close')
    },
    handleChangeCurrentSite(value) {
      // 请求当前场地信息
      this.id = value
      this._getSiteInfoFormId(this.id)
    },
    // 获取当前展的所有siteId
    getSiteIds(siteSchedules) {
      const siteIds = siteSchedules.map(item => {
        return item.siteId
      })
      return siteIds
    },
    async getRowData(siteOrder, siteSchedules) {
      const { startTime, endTime } = siteOrder
      // const sm = Number(moment(startTime).format('month'))
      // const em = Number(moment(endTime).format('month'))
      // const monthDiff = moment(em).diff(moment(sm), 'months')
      const yearObj = this.getYearsAndMonths(startTime, endTime)
      // for (const year in yearObj) {
      //     const month = yearObj[year];

      // }
      // const siteIds = this.getSiteIds(siteSchedules)
      // for (let i = 0; i < siteIds.length; i++) {
      //   const siteId = siteIds[i];
      //   const state = ["RESERVE", "LOCK"]
      //   number: 'single',
      //   type:
      // }
      const siteIds = []
      const promises = []
      for (let i = 0; i < siteSchedules.length; i++) {
        const siteSchedule = siteSchedules[i]
        const { siteId, siteType } = siteSchedule
        const state = ['RESERVE', 'LOCK']
        const number = 'single'
        const type = siteType
        for (const year in yearObj) {
          const month = yearObj[year]
          siteIds.push(siteId)
          promises.push(this.$api.schedule.getScheduleView({
            month,
            number,
            siteId,
            state,
            type,
            year
          }))
        }
      }
      const res = await Promise.all(promises)
      console.log('await', res)
      const siteData = {}
      for (let i = 0; i < siteIds.length; i++) {
        const siteId = siteIds[i]
        const data = res[i]
        let exhSet = []
        for (const month in data) {
          const exhs = data[month]
          exhSet = [...exhSet, ...exhs]
        }
        const obj = {}
        exhSet.reduce((item, next) => {
          obj[next.siteId] ? '' : obj[next.siteId] = true && item.push(next)
        }, [])
        siteData[`${siteId}`] = exhSet
      }
      console.log('data----', siteData)
      return siteData
      // Promise.resolve(siteData)
    },
    // 根据年份获取当年月份
    getYearsAndMonths(start, end) {
      const yearDiff = moment(end).diff(moment(start), 'years')
      let sy = moment(start)
      const years = []
      for (let i = 0; i < yearDiff + 1; i++) {
        years.push(sy.format('YYYY'))
        sy = sy.add(1, 'Y')
      }

      // const years = Array.from(new Set([moment(start).year(), moment(end).year()]))
      const obj = {}
      for (let i = 0; i < years.length; i++) {
        const year = years[i]
        if (years.length === 1) { // 等于1说明开始时间和结束时间都在同一年
          obj[`${year}`] = this.getMonthToArray(start, end)
        } else { // 跨年的情况
          if (i === 0) { // 开始年
            const s = start
            const e = moment(year).endOf('year').format('YYYY-MM-DD')
            obj[`${year}`] = this.getMonthToArray(s, e)
          } else if (i === (years.length - 1)) { // 结束年
            const s = moment(year).startOf('year').format('YYYY-MM-DD')
            const e = end
            obj[`${year}`] = this.getMonthToArray(s, e)
          } else { // 中间年
            const s = moment(year).startOf('year').format('YYYY-MM-DD')
            const e = moment(year).endOf('year').format('YYYY-MM-DD')
            obj[`${year}`] = this.getMonthToArray(s, e)
          }
        }
      }
      return obj
    },
    getMonthToArray(start, end) {
      const monthDiff = moment(end).diff(moment(start), 'months')
      let sm = moment(start).format('MM')
      const arr = [sm]
      for (let i = 0; i < monthDiff; i++) {
        const m = moment(sm).add(1, 'M')
        arr.push(m)
        sm = m
      }
      return arr
    },
    _getSiteInfoFormId(id) {
      this.$api.schedule.getSiteInfoFormId(id).then(async res => {
        console.log('getSiteInfoFormId', res)
        const { siteOrder, linkMessages, siteSchedules } = res
        const rowDatas = await this.getRowData(siteOrder, siteSchedules)
        console.log('Promise.all', rowDatas)
        console.log('异步结束')
        this.baseInfoData = siteOrder || {}
        this.siteAndTimeInfoData = res
        this.contactInfoData = linkMessages || []
        this.rowData = rowDatas
      })
    }
  }
}
</script>
<style lang="scss" scoped>
#detail {
  .conflictTop {
    padding: 16px;
    margin-bottom: 20px;
    border-left: 2px solid #f53939;
    background-color: #fddbdb;
    color: #000;
    .row {
      display: flex;
      padding: 4px 0;
      .title {
        margin-right: 8px;
      }
    }
  }
  .footer {
    text-align: right;
  }
}
</style>
