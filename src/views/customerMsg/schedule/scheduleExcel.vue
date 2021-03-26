<template>
  <div id="scheduleExcel">
    <v-table
      title-bg-color="#f6f8f8"
      :min-width="500"
      :title-rows="titleRows"
      :columns="columns"
      :table-data="tableData"
      :column-cell-class-name="columnCellClass"
    />
  </div>
</template>

<script>
// import { isString, isArray } from '@/utils/validate'
import { STATE_OBJECT } from '@/common/salesManagement/schedule'
import { getDateToArray, getWeek } from '@/utils/date'
import moment from 'moment'
export default {
  components: {},
  props: {
    data: {
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
      propsData: {},
      startTime: '2020-09-28',
      endTime: '2020-10-20',
      columns: [
        // { field: 'site', width: 150, columnAlign: 'center' },
        // {
        //   field: '2020-09-28',
        //   width: 40,
        //   columnAlign: 'center',
        //   formatter: function(rowData, rowIndex, pagingIndex, field) {
        //     // if (rowData[field]) {
        //     //   return
        //     // }
        //     return rowData[field]['text']
        //   }
        // },
        // {
        //   field: '2020-09-29',
        //   width: 40,
        //   columnAlign: 'center',
        //   formatter: function(rowData, rowIndex, pagingIndex, field) {
        //     return rowData[field]['text']
        //   }
        // },
        // {
        //   field: '2020-09-30',
        //   width: 40,
        //   columnAlign: 'center',
        //   formatter: function(rowData, rowIndex, pagingIndex, field) {
        //     return rowData[field]['text']
        //   }
        // },
        // {
        //   field: '2020-10-1',
        //   width: 40,
        //   columnAlign: 'center',
        //   formatter: function(rowData, rowIndex, pagingIndex, field) {
        //     return rowData?.[field]?.['text']
        //   }
        // },
        // {
        //   field: '2020-10-2',
        //   width: 40,
        //   columnAlign: 'center',
        //   formatter: function(rowData, rowIndex, pagingIndex, field) {
        //     return rowData[field]['text']
        //   }
        // },
        // {
        //   field: '2020-10-3',
        //   width: 40,
        //   columnAlign: 'center',
        //   formatter: function(rowData, rowIndex, pagingIndex, field) {
        //     return rowData[field]['text']
        //   }
        // },
        // {
        //   field: '2020-10-4',
        //   width: 40,
        //   columnAlign: 'center',
        //   formatter: function(rowData, rowIndex, pagingIndex, field) {
        //     return rowData[field]['text']
        //   }
        // },
        // {
        //   field: '2020-10-5',
        //   width: 40,
        //   columnAlign: 'center',
        //   formatter: function(rowData, rowIndex, pagingIndex, field) {
        //     return rowData[field]['text']
        //   }
        // }
      ],
      titleRows: [
        // [
        //   { fields: ['site'], title: '场地', titleAlign: 'center', rowspan: 2 },
        //   { fields: ['2020-09-28'], title: '28', titleAlign: 'center' },
        //   { fields: ['2020-09-29'], title: '29', titleAlign: 'center' },
        //   { fields: ['2020-09-30'], title: '30', titleAlign: 'center' },
        //   { fields: ['2020-10-1'], title: '1', titleAlign: 'center' },
        //   { fields: ['2020-10-2'], title: '2', titleAlign: 'center' },
        //   { fields: ['2020-10-3'], title: '3', titleAlign: 'center' },
        //   { fields: ['2020-10-4'], title: '4', titleAlign: 'center' },
        //   { fields: ['2020-10-5'], title: '5', titleAlign: 'center' }
        // ],
        // [
        //   { fields: ['2020-09-28'], title: '一', titleAlign: 'center' },
        //   { fields: ['2020-09-29'], title: '二', titleAlign: 'center' },
        //   { fields: ['2020-09-30'], title: '三', titleAlign: 'center' },
        //   { fields: ['2020-10-1'], title: '四', titleAlign: 'center' },
        //   { fields: ['2020-10-2'], title: '五', titleAlign: 'center' },
        //   { fields: ['2020-10-3'], title: '六', titleAlign: 'center', titleCellClassName: 'FF0000' },
        //   { fields: ['2020-10-4'], title: '日', titleAlign: 'center', titleCellClassName: 'FF0000' },
        //   { fields: ['2020-10-5'], title: '一', titleAlign: 'center' }
        // ]
      ],
      tableData: [
        // {
        //   site: '一号馆',
        //   '2020-09-28': { type: 'exhBeginTime', text: '' },
        //   '2020-09-29': { type: 'launchBeginTime', text: '' },
        //   '2020-09-30': { type: 'launchBeginTime', text: '' },
        //   '2020-10-1': { type: 'launchBeginTime', text: '' },
        //   '2020-10-2': { type: 'launchBeginTime', text: '' },
        //   '2020-10-3': { type: 'launchBeginTime', text: '' },
        //   '2020-10-4': { type: 'launchBeginTime', text: '' },
        //   '2020-10-5': { type: 'moveBeginTime', text: '' }
        // },
        // {
        //   site: '二号馆',
        //   '2020-09-28': { type: 'exhBeginTime', text: '' },
        //   '2020-09-29': { type: 'launchBeginTime', text: '' },
        //   '2020-09-30': { type: 'launchBeginTime', text: '' },
        //   '2020-10-1': { type: 'launchBeginTime', text: '' },
        //   '2020-10-2': { type: 'launchBeginTime', text: '' },
        //   '2020-10-3': { type: 'launchBeginTime', text: '' },
        //   '2020-10-4': { type: 'launchBeginTime', text: '' },
        //   '2020-10-5': { type: 'moveBeginTime', text: '' }
        // }
      ]
    }
  },
  computed: {
    days() {
      const days = []
      // const start = moment(this.startTime).date()
      // const end = moment(this.endTime).date()
      let start = moment(this.startTime).subtract(1, 'd')
      const dayNum = moment(this.endTime).diff(moment(this.startTime), 'days')
      // console.log('start', start)
      // console.log('dayNum', dayNum)
      for (let i = 0; i < dayNum + 1; i++) {
        const momentObj = moment(start).add(1, 'd')
        const day = moment(momentObj).date() // 日
        const weekDay = getWeek(moment(momentObj).format('YYYY-MM-DD')) // 周几
        const date = moment(momentObj).format('YYYY-MM-DD')
        const isWeekend = weekDay === '六' || weekDay === '日' // 是否周六周日
        days.push({
          day,
          weekDay,
          isWeekend,
          date,
          momentObj
          // date:
        })
        start = momentObj
      }
      // console.log(days)
      return days
    }
  },
  watch: {
    data(data) {
      this.propsData = { ...data }
      this.initData()
    }
  },
  mounted() {
    // console.log('rowDatarowData', this.rowData)
  },
  methods: {
    initData() {
      const { startTime, endTime } = this.getStartAndEndTime()
      this.startTime = startTime
      this.endTime = endTime
      const titleRows = this.initTitleRows()
      console.log('titleRows', titleRows)
      this.titleRows = titleRows
      const tableData = this.initTableData()
      console.log('tableData', tableData)
      this.tableData = tableData
      const columns = this.initColumns(startTime, endTime)
      this.columns = columns
    },
    // 获取多个馆之间最早开始时间和最晚结束时间
    getStartAndEndTime() {
      const { siteOrder } = this.propsData
      const { startTime, endTime } = siteOrder
      return {
        startTime: moment(startTime).format('YYYY-MM-DD'),
        endTime: moment(endTime).format('YYYY-MM-DD')
      }
    },
    columnCellClass(rowIndex, columnName, rowData) {
      if (rowData[columnName]?.['type'] === 'reserveStartTime') {
        return 'reserveStartTimeColor'
      }
      if (rowData[columnName]?.['type'] === 'exhBeginTime') {
        return 'exhBeginTimeColor'
      }
      if (rowData[columnName]?.['type'] === 'launchBeginTime') {
        return 'launchBeginTimeColor'
      }
      if (rowData[columnName]?.['type'] === 'moveBeginTime') {
        return 'moveBeginTimeColor'
      }
      if (rowData[columnName]?.['type'] === 'repeatTime') {
        return 'repeatTime'
      }
    },
    initColumns(startTime, endTime) {
      const arr = getDateToArray(startTime, endTime)
      const newArr = []
      for (let i = 0; i < arr.length; i++) {
        const item = arr[i]
        newArr.push({
          field: item,
          width: 40,
          columnAlign: 'center',
          formatter: function(rowData, rowIndex, pagingIndex, field) {
            return rowData?.[field]?.['text']
          }
        })
      }
      newArr.unshift({ field: 'site', width: 150, columnAlign: 'center' })
      return newArr
    },
    initTitleRows() {
      const rowEn = []
      const rowZh = []
      let start = moment(this.startTime).subtract(1, 'd') // 循环前减一天
      const daysDiff = moment(this.endTime).diff(
        moment(this.startTime),
        'days'
      ) // 计算开始结束相差天数
      for (let i = 0; i < daysDiff + 1; i++) {
        // 循环相差天数+1 次
        const momentObj = moment(start).add(1, 'd')
        const day = moment(momentObj).date() // 几日
        const weekDay = getWeek(moment(momentObj).format('YYYY-MM-DD')) // 周几
        const date = moment(momentObj).format('YYYY-MM-DD') // 年月日
        const isWeekend = weekDay === '六' || weekDay === '日' // 是否周六周日
        rowEn.push({
          fields: [`${date}`],
          title: day,
          titleAlign: 'center',
          titleCellClassName: isWeekend ? 'FF0000' : ''
        })
        rowZh.push({
          fields: [`${date}`],
          title: weekDay,
          titleAlign: 'center',
          titleCellClassName: isWeekend ? 'FF0000' : ''
        })
        start = momentObj
      }
      // 循环结束后加上表头第一个标识
      rowEn.unshift({
        fields: ['site'],
        title: '场地',
        titleAlign: 'center',
        rowspan: 2
      })
      // 最后拼接成titleRows格式
      return [rowEn, rowZh]
    },
    initTableData() {
      const { siteSchedules } = this.propsData
      const rowData = this.rowData
      const arr = []
      for (let i = 0; i < siteSchedules.length; i++) {
        const data = siteSchedules[i]
        const { beginTime: siteBeginTime, endTime: siteEndTime, siteId, exhBeginTime, exhEndTime, launchBeginTime, launchEndTime, moveBeginTime, moveEndTime, reserveStartTime, reserveEndTime } = data
        let launchDatesSet = [] // 保存所有开展期日期
        let exhDatesSet = [] // 保存所有布展日期
        let MoveDatesSet = [] // 保存所有撤展日期
        const rows = rowData[siteId]
        for (let i = 0; i < rows.length; i++) {
          const row = rows[i]
          const { siteSchedule } = row // row为当前展
          const { launchBeginTime, launchEndTime, exhBeginTime, exhEndTime, moveBeginTime, moveEndTime } = siteSchedule[0]
          // const date = [beginTime, endTime]
          const launchDates = getDateToArray(launchBeginTime, launchEndTime)
          let exhDates = []
          let MoveDates = []
          if (row.state === STATE_OBJECT.LOCK) {
            exhDates = getDateToArray(exhBeginTime, exhEndTime)
            MoveDates = getDateToArray(moveBeginTime, moveEndTime)
          }
          // launchDatesSet.push(launchDates)
          launchDatesSet = [...launchDatesSet, ...launchDates]
          exhDatesSet = [...exhDatesSet, ...exhDates]
          MoveDatesSet = [...MoveDatesSet, ...MoveDates]
        }

        const obj = {}
        obj['site'] = data.siteName
        const allDates = getDateToArray(siteBeginTime, siteEndTime)
        const exhDates = getDateToArray(exhBeginTime, exhEndTime) // 布展所有日期
        const launchDates = getDateToArray(launchBeginTime, launchEndTime) // 开展所有日期
        const moveDates = getDateToArray(moveBeginTime, moveEndTime) // 撤展所有日期
        const reserveDates = getDateToArray(reserveStartTime, reserveEndTime) // 其他安排所有日期

        const {
          filterReserveDates,
          filterExhDatesAndMoveDates,
          filterRepeatDates
        } = this.initTimeType({ exhDates, launchDates, moveDates, reserveDates, exhDatesSet, MoveDatesSet, allDates })
        launchDates.forEach(item => {
          obj[item] = { type: 'launchBeginTime', text: '' }
        })
        filterExhDatesAndMoveDates.forEach(item => {
          obj[item] = { type: 'moveBeginTime', text: '' }
        })
        filterRepeatDates.forEach(item => {
          obj[item] = { type: 'repeatTime', text: '' }
        })
        filterReserveDates.forEach(item => {
          obj[item] = { type: 'reserveStartTime', text: '' }
        })
        arr.push(obj)
      }
      // debugger
      return arr
    },
    // 格式化展块底部展期标识数组 优先级：开展 > 布撤重叠 > 撤展、布展 > 其他安排
    initTimeType({ exhDates, launchDates, moveDates, reserveDates, exhDatesSet, MoveDatesSet, allDates }) {
      const exhDatesAndMoveDates = [...exhDates, ...moveDates] // 布展和撤展期合并
      const exhRepeats = exhDates.filter(item => {
        return MoveDatesSet.includes(item)
      })
      const moveRepeats = moveDates.filter(item => {
        return exhDatesSet.includes(item)
      })
      const repeatDates = [...exhRepeats, ...moveRepeats] // 布撤重叠

      const filterReserveDates = reserveDates.filter(item => { // 过滤布撤之后的其他安排
        return (!exhDatesAndMoveDates.includes(item)) && (!repeatDates.includes(item)) && (!launchDates.includes(item))
      })
      const filterExhDatesAndMoveDates = exhDatesAndMoveDates.filter(item => { // 过滤'布撤重叠'和'开展'后的'布展、开展'
        return (!repeatDates.includes(item)) && (!launchDates.includes(item))
      })
      const filterRepeatDates = repeatDates.filter(item => { // 过滤之后的布撤退重叠
        return (!launchDates.includes(item))
      })
      return {
        filterReserveDates,
        filterExhDatesAndMoveDates,
        launchDates,
        filterRepeatDates
      }
    },
    // 拼接展块底部数据
    initTimeTypeBLockData(dates, color) {
      return dates.map(item => {
        return {
          color: color,
          date: item
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
#scheduleExcel {
  .tableContent {
    border: 1px solid #eeeeee;
    border-collapse: collapse;
    tr th,
    tr td {
      border: 1px solid #eeeeee;
    }
  }
}
</style>
<style lang="scss">
.reserveStartTimeColor {
  background-color: #ffeb00;
}
.exhBeginTimeColor {
  background-color: #9dcaff;
}
.launchBeginTimeColor {
  background-color: #ff7600;
}
.moveBeginTimeColor {
  background-color: #9dcaff;
}
.repeatTime {
  background-color: #EDBAF4;
}
.FF0000 {
  color: #ff0000;
}
</style>
