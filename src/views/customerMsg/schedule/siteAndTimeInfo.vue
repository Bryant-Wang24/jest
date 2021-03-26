<template>
  <div id="siteAndTimeInfo">
    <el-row>
      <div class="formItem">
        <div class="label">场地与面积：</div>
        <div class="value">
          <div>总面积：{{ siteAreaTotal }}平方米</div>
          <div class="siteInfoWrapper">
            <div v-for="item in form.siteSchedules" :key="item.id" class="siteInfoRow">
              <span class="site">{{ item.siteName }}</span>
              <span class="area">{{ item.siteArea }}</span><span>平方米</span>
            </div>
          </div>
        </div>
      </div>
      <div class="formItem">
        <div class="label">场地时间安排：</div>
        <div class="value">
          <div>时间范围：{{ timeLimit }}</div>
        </div>
      </div>
    </el-row>
    <el-row class="tipRow" type="flex">
      <div class="tip">
        <div v-for="item in LEGENDS" :key="item.label" class="legendItem">
          <span class="colorBlock" :style="{ backgroundColor: item.color }" />
          <span class="label">{{ item.label }}</span>
        </div>
      </div>
      <scheduleExcel :data="data" :row-data="rowData" />
    </el-row>
  </div>
</template>

<script>
import scheduleExcel from './scheduleExcel'
import { LEGENDS } from '@/common/salesManagement/schedule'
import { SITE_TYPE } from '@/common/site'
// import moment from 'moment'
export default {
  components: { scheduleExcel },
  props: {
    form: {
      type: Object,
      default: () => {
        return {}
      }
    },
    rowData: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data() {
    return {
      data: {},
      LEGENDS: LEGENDS,
      SITE_TYPE: SITE_TYPE
    }
  },
  computed: {
    siteAreaTotal() {
      // const { siteSchedules = [] } = this.form
      const siteSchedules = this.form.siteSchedules || []
      let num = 0
      for (let i = 0; i < siteSchedules.length; i++) {
        const siteItem = siteSchedules[i]
        num += siteItem.siteArea
      }
      return num
    },
    timeLimit() {
      const { siteOrder = {}} = this.form
      const { startTime = '', endTime = '' } = siteOrder
      // let start = 0
      // let startText = ''
      // let end = 0
      // let endText = ''
      // for (let i = 0; i < siteSchedules.length; i++) {
      //   const siteItem = siteSchedules[i]
      //   const beginTime = moment(siteItem.beginTime).valueOf()
      //   const endTime = moment(siteItem.endTime).valueOf()
      //   if (start === 0 || beginTime < start) {
      //     start = beginTime
      //     startText = siteItem.beginTime
      //   }
      //   if (endTime === 0 || endTime > end) {
      //     end = endTime
      //     endText = siteItem.endTime
      //   }
      // }
      return `${startTime} ~ ${endTime}`
    }
  },
  watch: {
    form(form) {
      // this.data = [...form]
      this.data = { ...form }
    }
  },
  created() {},
  mounted() {},
  methods: {}
}
</script>
<style lang="scss" scoped>
#siteAndTimeInfo {
  padding: 20px 0;
  font-size: 14px;
  .formItem {
    display: flex;
    margin-bottom: 14px;
    .label {
      width: 160px;
      margin-right: 10px;
      text-align: right;
      color: #666;
    }
    .value {
      flex: 1;
      word-break: break-word;
      color: #000;
      img {
        margin-right: 6px;
      }
      .siteInfoWrapper {
        margin-top: 10px;
        padding: 16px;
        background-color: #fafafa;
        width: 50%;
        .siteInfoRow {
          .site,
          .area {
            display: inline-block;
            min-width: 100px;
            margin-right: 10px;
            padding: 6px 0;
            border-bottom: 1px solid #cccccc;
          }
          // .area {
          //   display: inline-block;
          //   width: 100px;
          //   padding: 6px 0;
          // }
        }
      }
    }
  }
  .tipRow {
    .tip {
      width: 160px;
      margin-right: 10px;
      display: flex;
      font-size: 14px;
      flex-direction: column;
      align-items: flex-end;
      .legendItem {
        width: 100px;
        margin-bottom: 10px;
        display: flex;
        align-items: center;
        // margin-right: 12px;
        .colorBlock {
          width: 14px;
          height: 14px;
          margin-right: 4px;
        }
      }
    }
  }
}
</style>
