<template>
  <div ref="handoverWrap" class="handoverWrap">
    <basicInfo :basic-info="currentData" />
    <plannerInfo :plan-info="currentData" />
    <exhInfo :exh-info="currentData" />
    <logsInfo :logs-info="currentData" />
  </div>
</template>

<script>
import { Loading } from 'element-ui'
import basicInfo from '@/views/handoverSlipMgmt/components/basicInfo'
import plannerInfo from '@/views/handoverSlipMgmt/components/plannerInfo'
import exhInfo from '@/views/handoverSlipMgmt/components/exhInfo'
import logsInfo from '@/views/handoverSlipMgmt/components/logsInfo'
import { STATE, TIMETYPE, getSiteName, TIMETYPE_OBJECT } from '@/common/handoverSlipMgmt'
import { deepClone } from '@/utils'
export default {
  components: { basicInfo, plannerInfo, exhInfo, logsInfo },
  props: {
    propid: {
      type: Number,
      default: null
    }
  },
  data() {
    return {
      currentData: {
        handoverSlip: {}
      },
      siteList: [] // 场地列表
    }
  },
  watch: {
    propid: {
      async handler(value) {
        const loadingInstance = Loading.service({
          target: this.$refs.handoverWrap
        })
        await this._getSiteType()
        await this._getDataFromId(value)
        this.$nextTick(() => {
          loadingInstance.close()
        })
      },
      immediate: true
    }
  },
  async mounted() {
  },
  methods: {
    initTableRow(row) {
      const item = deepClone(row)
      // 处理场地数据
      const { state } = item.handoverSlip
      const { siteSchedules, siteSale, information } = item.saleMessageQuery
      const { startDate, endDate } = siteSale
      const siteAndArea = siteSchedules.map(site => {
        const { siteName, siteArea } = site
        return {
          siteName,
          siteArea
        }
      })
      const flagObj = {}
      for (let i = 0; i < information.length; i++) {
        const timeInfo = information[i]
        const { isFlag, type, siteId } = timeInfo
        const siteName = getSiteName(siteId, this.siteList)
        if (type === TIMETYPE_OBJECT.RESERVED) continue // 过滤掉预留时间
        if (Object.prototype.hasOwnProperty.call(flagObj, isFlag)) {
          flagObj[isFlag]['siteNames'].includes(siteName) ? null : flagObj[isFlag]['siteNames'].push(siteName)
          // 相同的时间只取一次
          if (flagObj[isFlag][TIMETYPE[type]].length > 0 && !flagObj[isFlag][TIMETYPE[type]].every(t => t.siteId === siteId)) continue
          flagObj[isFlag][TIMETYPE[type]].push(timeInfo)
        } else {
          flagObj[isFlag] = {
            siteNames: [siteName],
            [TIMETYPE['DEPLOY']]: [],
            [TIMETYPE['OPEN']]: [],
            [TIMETYPE['CLOSE']]: []
          }
          flagObj[isFlag][TIMETYPE[type]].push(timeInfo)
        }
      }
      const siteTimeArrange = {
        startDate,
        endDate,
        flagObj
      }
      item.saleMessageQuery['siteAndArea'] = siteAndArea
      item.saleMessageQuery['siteTimeArrange'] = siteTimeArrange
      item.handoverSlip['stateText'] = STATE[state]
      return item
    },
    // 获取场地list
    async _getSiteType() {
      const types = 'PAVILION,AUDITORIUM'
      const res = await this.$api.siteReserveList.querySite(types)
      this.siteList = res
    },
    _getDataFromId(id) {
      return new Promise((resolve, reject) => {
        this.$api.handoverSlipMgmt.getDataFromId(id).then(res => {
          this.currentData = this.initTableRow(res)
          resolve()
        })
      })
    }
  }
}
</script>
<style lang="scss" scoped>

</style>
