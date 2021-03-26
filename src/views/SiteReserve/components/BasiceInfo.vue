<template>
  <div class="info">
    <el-row>
      <el-col :span="8">
        <div v-for="(item, index) in leftColList" :key="index" class="formItem">
          <div class="label">{{ item.label }}</div>
          <div class="value">{{ item.value }}</div>
        </div>
      </el-col>
      <el-col :span="8">
        <div v-for="(item, index) in rightColList" :key="index" class="formItem">
          <div class="label">{{ item.label }}</div>
          <div :class="item.click ? 'blue value' : 'value'" @click="item.click(item.value) || null">{{ item.value }}</div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { mapState } from 'vuex'
// import { RESERVATION_TYPE_VALUE_ZH } from '@/common/site'

const WEBSITE_ALLOWS = ['EXHIBITION']
const NUMBER_PEOPLE_ALLOWS = ['MEETING', 'CONFERENCR', 'FEAST', 'BANQUET']
const MEAL_TIME_ALLOWS = ['FEAST', 'BANQUET']
const TABLE_SIZE_ALLOWS = ['FEAST', 'BANQUET']

export default {
  props: {
    siteOrder: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      // RESERVATION_TYPE_VALUE_ZH
    }
  },
  computed: {
    ...mapState({
      RESERVATION_TYPE_VALUE_ZH: state => state.site.RESERVATION_TYPE_VALUE_ZH
    }),
    leftColList() {
      const { code, projectName, hostCompany, undertakeCompany, content } = this.siteOrder
      const leftColList = [
        { label: '申请编号：', value: code || '-' },
        { label: '展会中文名：', value: projectName || '-' },
        { label: '主办单位：', value: hostCompany || '-' },
        { label: '承办单位：', value: undertakeCompany || '-' },
        { label: '展出内容：', value: content || '-' }
      ]
      return leftColList
    },
    rightColList() {
      const { type, projectAs, website, numberPeople, mealTime, tableSize, remarks } = this.siteOrder
      const leftColList = [
        { label: '类型：', value: this.RESERVATION_TYPE_VALUE_ZH[type] || '-', show: true },
        { label: '展会简称：', value: projectAs || '-', show: true },
        { label: '官方网址：', value: website || '', show: WEBSITE_ALLOWS.includes(type), click: (url) => { this.handleOpen(url) } },
        { label: '参会人数：', value: numberPeople || '-', show: NUMBER_PEOPLE_ALLOWS.includes(type) },
        { label: '用餐时间：', value: mealTime || '-', show: MEAL_TIME_ALLOWS.includes(type) },
        { label: '餐桌围数：', value: tableSize || '-', show: TABLE_SIZE_ALLOWS.includes(type) },
        { label: '备注：', value: remarks || '-' }
      ]
      return leftColList.filter(t => t.show)
    }
  },
  methods: {
    handleOpen(website) {
      const str = new RegExp('http')
      if (str.test(website)) {
        window.open(website)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.info {
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
      img {
        margin-right: 6px;
      }
    }
    .blue {
      cursor: pointer;
      color: blue;
    }
  }
}
</style>
