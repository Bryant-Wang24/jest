<template>
  <div id="scheduleExcel">
    <div v-if="list.length === 0">
      暂无数据
    </div>
    <div v-for="item in list" :key="item.id" class="tableWrapper">
      <span class="monthTitle">{{ `${item.id}月份` }}</span>
      <v-table
        title-bg-color="#f6f8f8"
        :min-width="500"
        :title-rows="item.titleRows"
        :columns="item.columns"
        :table-data="item.tableData"
        :row-height="item.rowHeight"
      />
      <div v-for="block in item.viewDatas" :key="block.id" class="block" :style="calculateStyle(block)" @click="handleShowDetails(block, item)">
        <div class="wrapper">
          <div class="title">
            <span class="tag" :style="{backgroundColor: BLOCK_BORDER_COLOR[block.state]}">{{ STATE_OBJECT_TEXT[block.state] }}</span>
            <span class="projectName">{{ block.projectName }}</span>
          </div>
          <div class="address">
            <i class="el-icon-location-outline" />
            {{ block.siteNames.join('、') }}
          </div>
          <div v-if="block.isConflict" class="isConflict">存在档期冲突</div>
          <div v-if="block.state === STATE_OBJECT.LOCK" class="timeTypeWrapper">
            <div v-for="bottom in block.type" :key="bottom.date" class="timeType" :style="timeTypeStyle(bottom)" />
            <!-- <div v-for="bottom in (block.timeType.slice(0, block.girdLength))" :key="bottom.date" class="timeType" :style="timeTypeStyle(bottom)" /> -->
          </div>
        </div>
      </div>
    </div>
    <el-dialog
      :visible.sync="dialog.dialogShow"
      :title="dialog.dialogTitle"
      :width="'65%'"
      :destroy-on-close="true"
      :close-on-click-modal="false"
      @close="handleClose"
    >
      <detail v-if="dialog.dialogShow" :site-infos="dialog.siteInfos" :row-data="dialog.rowData" @close="handleClose" />
    </el-dialog>
  </div>
</template>

<script>
import detail from './detail'
import { mapGetters } from 'vuex'
import { getWeek, getDateToArray, getDayLength } from '@/utils/date'
import { STATE_OBJECT, STATE_OBJECT_TEXT, LEGENDS_OBJECT } from '@/common/salesManagement/schedule'
import moment from 'moment'
import { deepClone } from '@/utils'

const tableGirdWidth = 40 // 每个日期的宽度
const tableGirdHeight = 100
const defaultBlockTop = 97 // 表格头部高度
const defaultBlockLeft = 150 // 表格第一列宽度
const BLOCK_BG_COLOR = {
  [STATE_OBJECT.RESERVE]: '#D5FDD8',
  [STATE_OBJECT.LOCK]: '#FFFDEF'
}
const BLOCK_BORDER_COLOR = {
  [STATE_OBJECT.LOCK]: '#FF7600',
  [STATE_OBJECT.RESERVE]: '#52C15E'
}

export default {
  components: { detail },
  props: {
    viewData: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data() {
    return {
      propsData: {},
      filterData: {},
      list: [],
      DateMatrix: {}, // 用于存储日期使用记录
      viewDatas: [],
      STATE_OBJECT: STATE_OBJECT,
      STATE_OBJECT_TEXT: STATE_OBJECT_TEXT,
      BLOCK_BORDER_COLOR: BLOCK_BORDER_COLOR,
      dialog: {
        dialogShow: false,
        dialogTitle: '查看详情',
        siteInfos: [],
        rowData: {}
      }
    }
  },
  computed: {
    ...mapGetters(['filterForm'])
  },
  watch: {
    viewData: {
      handler(prop) {
        // console.log('监听data1', prop)
        const { filterData, data } = prop
        this.filterData = filterData
        this.propsData = data
        this.initData()
      },
      deep: true,
      immediate: true
    }
  },
  mounted() {
  },
  methods: {
    initData() {
      // 第一步处理表格数据及渲染
      const list = []
      const originalMonths = Object.keys(this.propsData)
      // 过滤空格数组
      let months = originalMonths.filter((item, index) => {
        const length = this.propsData[item].length
        let bM = ''
        let eM = ''
        if (length > 0) {
          const siteSchedules = this.propsData[item][0].siteSchedule
          const { beginTime, endTime } = siteSchedules[0]
          bM = moment(beginTime).format('MM')
          eM = moment(endTime).format('MM')
        }
        return length > 0 && (bM === item || eM === item)
      })
      months = months.sort((a, b) => { return Number(a) - Number(b) })// 将原始月份转Number并升序排列
      for (let i = 0; i < months.length; i++) {
        const month = months[i]
        const { startTime, endTime } = this.getMonthStartAndEndDate(month)
        const titleRows = this.initTitleRows(startTime, endTime)
        const tableData = this.initTableData()
        const columns = this.initColumns(startTime, endTime)
        // 格式化单月所有展块数据
        const viewDatas = this.initViewData(month)
        // console.log('DateMatrix', this.DateMatrix)
        const rowHeight = this.initRowHeight(this.DateMatrix)
        list.push({
          id: month,
          startTime,
          endTime,
          titleRows,
          tableData,
          columns,
          rowHeight,
          viewDatas,
          DateMatrix: this.DateMatrix
        })
        this.DateMatrix = {}
        this.DateMatrixRow = []
      }
      this.list = list
    },
    // 获取月份第一天个最后一天
    getMonthStartAndEndDate(month) {
      // const { year = `${new Date().getFullYear()}` } = this.$store.state.schedule.filterForm
      const { year = `${new Date().getFullYear()}` } = this.filterData
      const endTime = moment(`${year}-${month}`).endOf('month').format('YYYY-MM-DD')
      const startTime = moment(`${year}-${month}`).startOf('month').format('YYYY-MM-DD')
      return { startTime, endTime }
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
    },
    initColumns(startTime, endTime) {
      const arr = getDateToArray(startTime, endTime)
      const newArr = []
      for (let i = 0; i < arr.length; i++) {
        const item = arr[i]
        newArr.push({
          field: item,
          width: tableGirdWidth
        })
      }
      newArr.unshift({ field: 'site', width: 150, columnAlign: 'center' })
      return newArr
    },
    initTitleRows(startTime, endTime) {
      // const DateMatrix = {}
      const DateMatrix = [[]]
      const rowEn = []
      const rowZh = []
      let start = moment(startTime).subtract(1, 'd') // 循环前减一天
      const daysDiff = moment(endTime).diff(moment(startTime), 'days') // 计算开始结束相差天数
      for (let i = 0; i < daysDiff + 1; i++) {
        // 循环相差天数+1 次
        const momentObj = moment(start).add(1, 'd')
        const day = moment(momentObj).date() // 几日
        const weekDay = getWeek(moment(momentObj).format('YYYY-MM-DD')) // 周几
        const date = moment(momentObj).format('YYYY-MM-DD') // 年月日
        const isWeekend = weekDay === '六' || weekDay === '日' // 是否周六周日
        // DateMatrix[`${date}`] = []
        DateMatrix[0].push([])
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
      this.DateMatrix = DateMatrix
      this.DateMatrixRow = DateMatrix[0]
      // 循环结束后加上表头第一个标识
      rowEn.unshift({
        fields: ['site'],
        title: '日期/星期',
        titleAlign: 'center',
        rowspan: 2
      })
      // 最后拼接成titleRows格式
      return [rowEn, rowZh]
    },
    initTableData() {
      // 单馆只需渲染一行表格数据
      const arr = []
      const obj = {}
      obj['site'] = this.filterData.sites[0]?.siteName || '测试'
      arr.push(obj)
      return arr
    },
    // 格式化展渲染列表
    initViewData(month) {
      const { year } = this.filterData
      const rows = this.propsData[month]
      const dateSet = [] // 保存所有beginTime和endTime的数组
      let launchDatesSet = [] // 保存所有开展期日期
      let exhDatesSet = [] // 保存所有布展日期
      let MoveDatesSet = [] // 保存所有撤展日期
      const blocks = []
      for (let i = 0; i < rows.length; i++) {
        const row = rows[i]
        const { siteSchedule } = row // row为当前展
        const { beginTime, endTime, launchBeginTime, launchEndTime, exhBeginTime, exhEndTime, moveBeginTime, moveEndTime } = siteSchedule[0]
        const date = [beginTime, endTime]
        const launchDates = getDateToArray(launchBeginTime, launchEndTime)
        let exhDates = []
        let MoveDates = []
        if (row.state === STATE_OBJECT.LOCK) {
          exhDates = getDateToArray(exhBeginTime, exhEndTime)
          MoveDates = getDateToArray(moveBeginTime, moveEndTime)
        }
        // launchDatesSet.push(launchDates)
        dateSet.push(date)
        launchDatesSet = [...launchDatesSet, ...launchDates]
        exhDatesSet = [...exhDatesSet, ...exhDates]
        MoveDatesSet = [...MoveDatesSet, ...MoveDates]
      }
      for (let j = 0; j < rows.length; j++) { // 循环预定对象
        let block = []
        const row = rows[j]
        const { startTime, endTime, projectName, siteNames, siteSchedule, state, id } = row // row为当前展
        const { beginTime: siteBeginTime, endTime: siteEndTime, exhBeginTime, exhEndTime, launchBeginTime, launchEndTime, moveBeginTime, moveEndTime, reserveStartTime, reserveEndTime } = siteSchedule[0]
        const { length: dayLength } = getDayLength({ startTime, endTime }) // 占用总天数
        const { length: girdLength, currentMonthStartTime, currentMonthEndTime } = getDayLength({ isSubMonth: true, year, month, startTime: siteBeginTime, endTime: siteEndTime }) // 占用格子数（必须过滤掉非本月和非本年）
        const dates = getDateToArray(currentMonthStartTime, currentMonthEndTime) // 本月占用日期
        // debugger
        const allDates = getDateToArray(siteBeginTime, siteEndTime)
        const exhDates = getDateToArray(exhBeginTime, exhEndTime)
        const launchDates = getDateToArray(launchBeginTime, launchEndTime)
        const moveDates = getDateToArray(moveBeginTime, moveEndTime)
        const reserveDates = getDateToArray(reserveStartTime, reserveEndTime)
        // const isConflict = this.isConflict(launchDates, launchDatesSet)
        const isConflict = this.isConflict([siteBeginTime, siteEndTime], dateSet, j)
        const type = row.state === STATE_OBJECT.LOCK ? this.initTimeType({ dates, exhDates, launchDates, moveDates, reserveDates, exhDatesSet, MoveDatesSet, allDates }) : []// 初始化展块底部渲染数据
        // 将dates和整个月的对象数组匹配存储，同时计算高度
        const dateMatrix = deepClone(this.DateMatrix)
        const top = this.matchDatesAndDMatrix(dates, dateMatrix, row)
        const left = moment(currentMonthStartTime).date() - 1
        block = { id, dayLength, girdLength, dates, projectName, siteNames, siteSchedule, state, left, top, isConflict, type }
        if (girdLength <= 0) {
          continue
        }
        blocks.push(block)
      }
      console.log('blocks', blocks)
      return blocks
    },
    // 判断是否冲突
    isConflict(currentArr, allArr, index) {
      let result = false
      const t = currentArr
      const s = moment(t[0]).valueOf()
      const e = moment(t[1]).valueOf()
      const arrB = deepClone(allArr)
      arrB.splice(index, 1)
      for (let i = 0; i < arrB.length; i++) {
        const tb = arrB[i]
        const sb = moment(tb[0]).valueOf()
        const eb = moment(tb[1]).valueOf()
        if ((sb <= s && s <= eb) || (sb <= e && e <= eb)) {
          result = true
          break
        }
      }
      return result
    },
    isConflict_bk(currentArr, allArr) {
      for (let i = 0; i < currentArr.length; i++) {
        const current = currentArr[i]
        const matchArr = allArr.filter((item) => { return current === item })
        if (matchArr.length > 1) {
          return true
        }
      }
      return false
    },
    // 格式化展块底部展期标识数组 优先级：开展 > 布撤重叠 > 撤展、布展 > 其他安排
    initTimeType({ dates, exhDates, launchDates, moveDates, reserveDates, exhDatesSet, MoveDatesSet, allDates }) {
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
      // debugger
      const initReserveDates = this.initTimeTypeBLockData(filterReserveDates, LEGENDS_OBJECT.RESERVE)
      const initExhAndMoveDates = this.initTimeTypeBLockData(filterExhDatesAndMoveDates, LEGENDS_OBJECT.EXH_MOVE)
      const initRepeatDates = this.initTimeTypeBLockData(filterRepeatDates, LEGENDS_OBJECT.REPEAT)
      const initLaunchDates = this.initTimeTypeBLockData(launchDates, LEGENDS_OBJECT.LAUNCH)
      const set = [...initReserveDates, ...initExhAndMoveDates, ...initRepeatDates, ...initLaunchDates]
      let result = []
      // 排序并补充为空的天数
      for (let i = 0; i < allDates.length; i++) {
        const dateItem = allDates[i]
        let arr = set.filter(timeTypeData => {
          // debugger
          return timeTypeData.date === dateItem
        })
        if (arr.length === 0) {
          arr = [{
            color: 'transparent',
            date: dateItem
          }]
        }
        result = [...result, ...arr]
      }
      // 过滤非本月份的
      result = result.filter(t => {
        return dates.includes(t.date)
      })
      return result
    },
    // 拼接展块底部数据
    initTimeTypeBLockData(dates, color) {
      return dates.map(item => {
        return {
          color: color,
          date: item
        }
      })
    },
    // 计算单馆表格行高
    initRowHeight(DateMatrix) {
      // const lengths = []
      // for (const key in DateMatrix) {
      //   if (Object.prototype.hasOwnProperty.call(DateMatrix, key)) {
      //     const element = DateMatrix[key]
      //     lengths.push(element.length)
      //   }
      // }
      // // console.log('initRowHeight', lengths)
      // const length = Math.max.apply(null, lengths)
      const length = DateMatrix.length
      return length > 1 ? length * (tableGirdHeight + 12) : tableGirdHeight
    },
    /**
     * @param {object} row 当前正在遍历的展的数据
     * @returns {number} top 需定位的高度量
     */
    matchDatesAndDMatrix(sourceArray, dateMatrix, row) {
      // const dateArray = Object.keys(dateMatrix)
      console.log('dateMatrix', dateMatrix)
      let top = null
      const _dateMatrix = dateMatrix
      const dateMatrixRow = deepClone(this.DateMatrixRow)
      const initSourceArray = sourceArray.map(item => {
        return moment(item).date()
      })

      for (let i = 0; i < _dateMatrix.length; i++) {
        const monthRow = _dateMatrix[i]
        const isEmpty = initSourceArray.every(item => {
          return monthRow[item - 1].length === 0
        })
        if (isEmpty) {
          for (let j = 0; j < initSourceArray.length; j++) {
            const date = initSourceArray[j]
            monthRow[date - 1].push(row)
          }
          top = i
          break
        } else if (i === _dateMatrix.length - 1) {
          _dateMatrix.push(dateMatrixRow)
        }
      }
      this.DateMatrix = _dateMatrix
      console.log('top', top)
      return top === -Infinity ? 0 : top
      // debugger
      // const tops = []
      // for (let i = 0; i < sourceArray.length; i++) {
      //   const sourceDate = sourceArray[i]
      //   if (Object.prototype.hasOwnProperty.call(dateMatrix, sourceDate)) {
      //     tops.push(Number(dateMatrix[sourceDate].length))
      //     dateMatrix[sourceDate].push(row)
      //   }
      // }
      // const top = Math.max.apply(null, tops)
      // return top === -Infinity ? 0 : top
    },
    // 统计展块style
    calculateStyle(block) {
      const width = `${block.girdLength * tableGirdWidth}px`
      const top = `${block.top * (tableGirdHeight + 12) + defaultBlockTop}px`
      const left = `${block.left * tableGirdWidth + defaultBlockLeft - 1}px`
      const height = `${tableGirdHeight}px`
      const backgroundColor = BLOCK_BG_COLOR[block.state]
      const borderColor = BLOCK_BORDER_COLOR[block.state]
      const borderColorHover = BLOCK_BORDER_COLOR[block.state]
      return {
        width,
        top,
        left,
        height,
        backgroundColor,
        borderColor,
        '--color-hover': borderColorHover
      }
    },
    timeTypeStyle(bottom) {
      const backgroundColor = bottom.color
      return {
        backgroundColor
      }
    },
    /**
     * @param {object} 当前点击的块信息
     * @param {object} 当前行的所有块数据
     */
    handleShowDetails(block, row) {
      console.log('block', block)
      const { id, projectName } = block
      this.dialog.dialogShow = true
      this.dialog.siteInfos = [{ id, projectName }]
      this.dialog.rowData = row
    },
    handleClose() {
      this.dialog.dialogShow = false
    }
  }
}
</script>
<style lang="scss" scoped>
#scheduleExcel {
  overflow-x:auto;
  .tableWrapper {
    position: relative;
    margin-bottom: 20px;
    .monthTitle {
      display: block;
      width: 100%;
      height: 20px;
      line-height: 20px;
    }
    .block {
      cursor: pointer;
      // display: flex;
      // flex-direction: column;
      // justify-content: space-around;
      position: absolute;
      box-sizing: border-box;
      border-left: 2px solid transparent;
      padding: 12px 8px;
      font-size: 14px;
      border-right: 1px solid #d3d3d3 !important;
      .wrapper {
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        position: relative;
        height: 76px;
        .title {
          display: flex;
          .projectName{
            line-height: 20px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }
          .tag {
            display: inline-block;
            width: 36px;
            min-width: 18px;
            height: 20px;
            line-height: 20px;
            margin-right: 4px;
            text-align: center;
            border-radius: 2px;
            color: #fff;
            overflow: hidden;
          }
        }
        .address {
          white-space: nowrap;
          text-overflow: ellipsis;
          overflow: hidden;
        }
        .isConflict {
          color: #FF0000;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .timeTypeWrapper {
          display: flex;
          position: absolute;
          left: -10px;
          bottom: -12px;
          right: -9px;
          background-color: transparent;
          .timeType {
            width: 40px;
            height: 12px;
            border-right: 1px solid #d3d3d3;
            box-sizing: border-box;
          }
        }
      }
    }
    .block:hover {
      box-shadow:0 0 0 1px var(--color-hover);
      z-index: 9;
    }
  }
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
.FF0000 {
  color: #ff0000;
}
</style>
