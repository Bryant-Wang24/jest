<template>
  <div id="scheduleExcel" v-loading="loading">
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
      <div v-for="(block,index) in item.viewDatas" :key="index" class="block" :style="calculateStyle(block)" @click="handleShowDetails(block)">
        <div class="wrapper">
          <!-- hover弹出框 -->
          <div v-if="block.isConflict === true" class="conflict">
            <el-popover
              placement="right"
              width="400"
              trigger="hover"
            >
              <div class="popover-schedule" @click="handleShowDetails(block)">
                <div
                  v-for="(exh,key) in block.exhibition"
                  :key="key"
                  class="schedule-block"
                  :style="calculateConflictStyle(exh.state)"
                >
                  <div class="schedule-wrapper">
                    <div class="schedule-title">
                      <span class="schedule-tag" :style="{backgroundColor: BLOCK_BORDER_COLOR[exh.state]}">{{ STATE_OBJECT_TEXT[exh.state] }}</span>
                      <span class="schedule-projectName">{{ exh.projectName }}</span>
                    </div>
                    <div class="schedule-address">
                      <i class="el-icon-location-outline" />
                      {{ `${exh.siteNames.join(',')}` }}
                    </div>
                    <div class="schedule-time">
                      <i class="el-icon-time" />
                      {{ exh.startTime }} ~ {{ exh.endTime }}
                    </div>
                    <div class="schedule-isConflict">存在档期冲突</div>
                  </div>
                </div>
              </div>
              <span slot="reference">存在档期冲突</span>
            </el-popover>
            <!-- <span v-popover:popover>存在档期冲突</span> -->
          </div>
          <div v-else class="title">
            <span class="tag" :style="{backgroundColor: BLOCK_BORDER_COLOR[block.state]}">{{ STATE_OBJECT_TEXT[block.state] }}</span>
            <span class="projectName">{{ block.projectName }}</span>
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
      <detail v-if="dialog.dialogShow" :is-conflict-info="isConflictInfo" :site-infos="dialog.siteInfos" @close="handleClose" />
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getWeek, getDateToArray, getDayLength, intersection, initDatesToAscend } from '@/utils/date'
import { uniqueArr, deepClone } from '@/utils/index'
import { STATE_OBJECT, STATE_OBJECT_TEXT } from '@/common/salesManagement/schedule'
import moment from 'moment'
import detail from './detail'

const tableGirdWidth = 40 // 每个日期的宽度
const tableGirdHeight = 40 // 每一行的高度
const defaultBlockTop = 97 // 表格头部高度
const defaultBlockLeft = 150 // 表格第一列宽度
const BLOCK_BG_COLOR = {
  [STATE_OBJECT.RESERVE]: '#D5FDD8',
  [STATE_OBJECT.LOCK]: '#FFFDEF',
  'CONFLICT': '#FFDDDD'
}
const BLOCK_BORDER_COLOR = {
  [STATE_OBJECT.LOCK]: '#FF7600',
  [STATE_OBJECT.RESERVE]: '#52C15E',
  'CONFLICT': '#F53939'
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
      loading: false,
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
        siteInfos: []
      },
      isConflictInfo: false
    }
  },
  computed: {
    ...mapGetters(['filterForm'])
  },
  watch: {
    viewData: {
      handler(prop) {
        console.log('监听data1', prop)
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
      this.loading = true
      // 第一步处理表格数据及渲染
      const list = []
      const originalMonths = Object.keys(this.propsData)
      // 过滤空格数组
      let months = originalMonths.filter((item, index) => {
        return this.propsData[item].length > 0
      })
      months = months.sort((a, b) => { return Number(a) - Number(b) })// 将原始月份转Number并升序排列
      for (let i = 0; i < months.length; i++) {
        const month = months[i]
        const { startTime, endTime } = this.getMonthStartAndEndDate(month)
        const titleRows = this.initTitleRows(startTime, endTime)
        const { arr: tableData, DateMatrix } = this.initTableData(startTime, endTime)
        const columns = this.initColumns(startTime, endTime)
        // 格式化单月所有展块数据
        const viewDatas = this.initViewData(month, DateMatrix)
        list.push({
          id: month,
          startTime,
          endTime,
          titleRows,
          tableData,
          columns,
          //   rowHeight,
          viewDatas
        //   DateMatrix: this.DateMatrix
        })
      }
      this.list = list
      this.loading = false
      console.log('list----------------------------', list)
    },
    // 获取月份第一天个最后一天
    getMonthStartAndEndDate(month) {
      // const { year = `${new Date().getFullYear()}` } = this.$store.state.schedule.filterForm
      const { year = `${new Date().getFullYear()}` } = this.filterData
      const endTime = moment(`${year}-${month}`).endOf('month').format('YYYY-MM-DD')
      const startTime = moment(`${year}-${month}`).startOf('month').format('YYYY-MM-DD')
      return { startTime, endTime }
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
      // this.DateMatrix = DateMatrix
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
    initTableData(startTime, endTime) {
      const daysDiff = moment(endTime).diff(moment(startTime), 'days') + 1 // 月份天数
      // 单馆只需渲染一行表格数据
      const arr = []
      const { sites } = this.filterData
      const DateMatrix = {}
      for (let i = 0; i < sites.length; i++) {
        const obj = {}
        const site = sites[i]
        DateMatrix[`${site.id}`] = []
        for (let j = 1; j <= daysDiff; j++) {
          // DateMatrix[`${site.id}`][`${j}`] = []
          DateMatrix[`${site.id}`].push([])
        }
        obj['site'] = site.siteName
        arr.push(obj)
      }
      console.log('DateMatrix', DateMatrix)
      return { arr, DateMatrix }
    },
    // 格式化展渲染列表
    initViewData(month, DateMatrix) {
      const { year } = this.filterData
      const exhibitions = this.propsData[month] // 展数组
      // const launchDatesSet = [] // 保存所有开展期日期
      // const exhDatesSet = [] // 保存所有布展日期
      // const MoveDatesSet = [] // 保存所有撤展日期
      const blocks = []
      // this.mapDateMatrix(month, exhibitions, DateMatrix) // 将所有开展匹配写入DateMatrix
      this.mapDateMatrix(month, exhibitions, DateMatrix) // 将所有展日期写入DateMatrix
      // 单独处理冲突
      const conflicts = this.getConflictBlock(DateMatrix)
      console.log('conflicts', conflicts)
      // 过滤掉冲突的场地
      const _exhibitions = this.filterConflict(exhibitions, conflicts)
      // const conflictsArr = Object.keys(conflicts)
      // const _exhibitions = this.filterConflict_bk(exhibitions, conflictsArr)
      // 将冲突块写入blocks
      for (const key in conflicts) {
        if (Object.prototype.hasOwnProperty.call(conflicts, key)) {
          const conflictBlock = conflicts[key]
          blocks.push(conflictBlock)
        }
      }
      // 处理剩下的状态
      for (let i = 0; i < _exhibitions.length; i++) {
        const exhibition = _exhibitions[i]
        const { siteSchedule, projectName, state, id } = exhibition
        // if (state === STATE_OBJECT.RESERVE) continue
        // 遍历siteSchedule，根据场地时间段先区分，之后再根据同时间段是否相邻场地再区分一次
        const siteScheduleFormatData = this.mapSiteScheduleData(siteSchedule) // 区分之后的场地数组
        const siteScheduleFormatDataLength = siteScheduleFormatData.length
        for (let j = 0; j < siteScheduleFormatDataLength; j++) {
          const { siteSchedule, startTime, endTime, siteIndex } = siteScheduleFormatData[j]
          const siteLength = siteSchedule.length
          const { length: girdLength, currentMonthStartTime } = getDayLength({ isSubMonth: true, year, month, startTime, endTime })
          if (!girdLength || girdLength <= 0) { // 如果当前月份长度为0，说明有跨月，过滤掉此数据
            continue
          }
          const top = siteIndex
          const left = moment(currentMonthStartTime).date() - 1
          const block = { id, siteLength, girdLength, projectName, state, siteSchedule, top, left }
          blocks.push(block)
        }
      }
      console.log('blocks', blocks)
      return blocks
    },
    // 遍历siteSchedule，根据场地时间段先区分，之后再根据同时间段是否相邻场地再区分一次
    mapSiteScheduleData(siteSchedule = []) {
      const startTimeAndEndTimeStrings = siteSchedule.map(siteObject => { // 获得所有场地开始结束时间string数组
        const { beginTime, endTime } = siteObject
        const string = moment(beginTime).format('YYYY-MM-DD') + '@' + moment(endTime).format('YYYY-MM-DD')
        return string
      })
      const siteFormTime = {} // 存储根据时间归类的场地
      for (let i = 0; i < startTimeAndEndTimeStrings.length; i++) {
        const siteObject = siteSchedule[i]
        const time = startTimeAndEndTimeStrings[i]
        if (Object.prototype.hasOwnProperty.call(siteFormTime, time)) {
          siteFormTime[time].push(siteObject)
        } else {
          siteFormTime[time] = []
          siteFormTime[time].push(siteObject)
        }
      }

      let finallyArr = []
      for (const key in siteFormTime) {
        if (Object.prototype.hasOwnProperty.call(siteFormTime, key)) {
          const times = key.split('@')
          const item = siteFormTime[key]
          const startTime = times[0]
          const endTime = times[1]
          // 根据是否相邻再次归类
          const siteFormIsSiblings = this.mapSiteFromIsSiblings(item, siteSchedule, startTime, endTime)
          finallyArr = [...finallyArr, ...siteFormIsSiblings]
        }
      }
      return finallyArr
    },
    // 遍历，根据site是否相邻归类
    mapSiteFromIsSiblings(siteFormTimeItem, siteSchedule, startTime, endTime) {
      const { sites } = this.filterData
      const arrA = sites.map(item => { return item.id })
      const arrB = siteFormTimeItem.map(item => { return item.siteId })
      const filterArr = arrA.map((item, index) => {
        const arrBIndex = arrB.indexOf(item)
        const isInclude = arrB.includes(item)
        return isInclude ? siteFormTimeItem[arrBIndex] : null
      })
      const newArr = []
      const filterArrLength = filterArr.length
      for (let i = 0; i < filterArrLength; i++) {
        const item = filterArr[i]
        if (item === null) continue
        const l = i === 0 ? null : filterArr[i - 1]
        // const r = i === filterArrLength - 1 ? null : filterArr[i + 1]
        if (l === null) {
          newArr.push({
            startTime,
            endTime,
            siteIndex: i,
            siteSchedule: [item]
          })
        } else {
          newArr[newArr.length - 1]['siteSchedule'].push(item)
        }
      }
      return newArr
      // var arrA, arrB, lenA, lenB
      // for (var j = 0; j < lenB; ++j) {
      //   var i = 0; var l = -1; var r = -1
      //   while (i < lenA) {
      //     if (arrA[i] == arrB[j]) {
      //       if (l == -1) {
      //         l = i
      //         ++j
      //       } else {
      //         ++j
      //       }
      //     } else {
      //       if (l != -1) {
      //         r = i - 1
      //         --j
      //         break
      //       }
      //     }
      //     ++i
      //   }
      //   if (l != -1) {
      //     if (r == -1) {
      //       r = lenA - 1
      //     }
      //     list.addNewList(arrA, l, r)
      //   }
      // }
    },
    // mapDateMatrix(month, exhibitions, DateMatrix) {
    //   const { year } = this.filterData
    //   for (let i = 0; i < exhibitions.length; i++) {
    //     const exhibition = exhibitions[i]
    //   }
    // },
    mapDateMatrix(month, exhibitions, DateMatrix) {
      const { year } = this.filterData
      for (let i = 0; i < exhibitions.length; i++) {
        const exhibition = exhibitions[i]
        const { siteSchedule } = exhibition
        for (let j = 0; j < siteSchedule.length; j++) {
          const site = siteSchedule[j]
          // const { siteId, launchBeginTime, launchEndTime } = site
          const { siteId, beginTime, endTime } = site
          // const { currentMonthStartTime, currentMonthEndTime } = getDayLength({ isSubMonth: true, year, month, startTime: launchBeginTime, endTime: launchEndTime })
          const { currentMonthStartTime, currentMonthEndTime } = getDayLength({ isSubMonth: true, year, month, startTime: beginTime, endTime: endTime })
          const dates = getDateToArray(currentMonthStartTime, currentMonthEndTime)
          console.log('dates', dates)
          // console.log('dates', dates)
          for (let k = 0; k < dates.length; k++) {
            const date = dates[k]
            const day = moment(date).format('DD')
            DateMatrix[`${siteId}`] && DateMatrix[`${siteId}`][Number(day) - 1 ].push(exhibition)
          }
        }
      }
      return DateMatrix
    },
    getConflictBlock(DateMatrix) {
      const { sites } = this.filterData
      const obj = {}
      for (const key in DateMatrix) {
        if (Object.prototype.hasOwnProperty.call(DateMatrix, key)) {
          const DateMatrixRow = DateMatrix[key]
          obj[key] = []
          for (let i = 0; i < DateMatrixRow.length; i++) {
            const currentDate = DateMatrixRow[i]
            if (currentDate.length <= 1) continue
            for (let j = 0; j < currentDate.length; j++) {
              const exhibition = currentDate[j]
              const { id } = exhibition
              const isExist = obj[key].some(item => {
                return item.id === id
              })
              if (!isExist) {
                obj[key].push(exhibition)
              }
            }
          }
        }
      }
      console.log('obj', obj)
      // 得到各个展的时间数数组
      const objB = {}
      for (const key in obj) {
        const siteId = key
        const row = obj[key]
        if (row.length === 0) continue
        const exhDates = {}
        for (let i = 0; i < row.length; i++) {
          const exhibition = row[i]
          const { id, startTime, endTime } = exhibition
          const dates = getDateToArray(startTime, endTime)
          exhDates[id] = dates
        }
        //
        objB[siteId] = exhDates
      }
      console.log('objB-----', objB)
      // 两两遍历取交集
      const commonElementsArray = []
      for (const key in objB) {
        const siteId = key
        const row = objB[key]
        const exhIdKeys = Object.keys(row)
        const commonElementsSet = {}
        for (let i = 0; i < exhIdKeys.length; i++) {
          const exhidPrev = exhIdKeys[i]
          const datesPrev = row[exhidPrev]
          for (let j = i + 1; j < exhIdKeys.length; j++) {
            const exhidNext = exhIdKeys[j]
            const datesNext = row[exhidNext]
            const commonElements = intersection([datesPrev, datesNext])
            if (commonElements.length === 1) { // 交集为1时，需要手动判断这一天是否冲突
              // 判断这个交集日期是否是两个展的开始天或者结束天
              const indexPrev = datesPrev.indexOf(commonElements[0])
              const indexNext = datesNext.indexOf(commonElements[0])
              if ((indexPrev === 0 || indexPrev === datesPrev.length - 1) && (indexNext === 0 || indexNext === datesNext.length - 1)) { // 满足都是开始天或者结束天的条件下，手动判断当天冲突
                // 获取两个展的开始结束时间（包括时分）
                const { beginTime: sPrev, endTime: ePrev } = this.getStartAndEndTimeFromSiteIdAndExhId(siteId, exhidPrev, obj)
                const { beginTime: sNext, endTime: ePNext } = this.getStartAndEndTimeFromSiteIdAndExhId(siteId, exhidNext, obj)
                // const sPrev = indexPrev[0]
                // const ePrev = indexPrev[indexPrev.length - 1]
                // const sNext = indexNext[0]
                // const ePNext = indexNext[indexNext.length - 1]
                const isConflict = this.isConflict([[sPrev, ePrev], [sNext, ePNext]])
                console.log('isConflict', isConflict)
                const commonKey = `${siteId}-${exhidPrev}-${exhidNext}`
                commonElementsSet[commonKey] = isConflict ? commonElements : []
              }
            } else {
              const commonKey = `${siteId}-${exhidPrev}-${exhidNext}`
              commonElementsSet[commonKey] = commonElements
            }
          }
        }
        commonElementsArray.push(commonElementsSet)
      }
      console.log('commonElementsSet1', commonElementsArray)
      const _commonElementsArray = deepClone(commonElementsArray)
      const conflictBlock = []
      for (let i = 0; i < _commonElementsArray.length; i++) {
        const element = _commonElementsArray[i]
        for (const idkey in element) {
          let _dates = element[idkey]
          if (_dates.length === 0) continue
          const commonArr = {
            'idkeys': [idkey],
            'dates': []
          }
          for (let j = 0; j < _dates.length; j++) { // ['2020-10-01','2020-10-02']
            const date = _dates[j]
            for (const idkey2 in element) {
              const dates2 = element[idkey2]
              if (dates2.includes(date)) {
                _dates = Array.from(new Set(_dates.concat(dates2)))
                const commonKey = Array.from(new Set(commonArr['idkeys'].concat(idkey2)))
                // debugger
                commonArr['idkeys'] = [...commonKey]
                commonArr['dates'] = [..._dates]
                Reflect.deleteProperty(element, idkey2)
              }
            }
          }
          conflictBlock.push(commonArr)
        }
        console.log('block', conflictBlock)
      }
      // 格式化冲突块数据
      const conflictBlockObj = {}
      for (let i = 0; i < conflictBlock.length; i++) {
        const conflictObj = conflictBlock[i]
        const { dates, idkeys } = conflictObj
        const girdLength = dates.length
        const siteLength = 1
        const ids = idkeys[0]?.split('-')
        const siteId = ids[0]
        const top = this.getIndexFormSites(siteId, sites)
        const left = moment(initDatesToAscend(dates)[0]).date() - 1
        const key = this.initConflictBlockId(idkeys, siteId)
        const exhibitions = this.getExhibitionsFromIds(key, siteId, obj)
        conflictBlockObj[key] = {
          siteId: [siteId],
          dates, // 冲突日期数组
          girdLength,
          siteLength,
          top,
          left,
          exhibition: exhibitions,
          isConflict: true,
          state: 'CONFLICT'
        }
      }
      console.log('conflictBlockObj', conflictBlockObj)
      return conflictBlockObj
    },
    // 处理冲突块id,同时获取对应冲突展数据
    initConflictBlockId(idkeys, siteId) {
      const ids = idkeys.join('-').split('-')
      const idsSet = Array.from(new Set(ids))
      const filterIds = idsSet.filter(id => {
        return Number(id) !== Number(siteId)
      })
      return `${siteId}-${filterIds.join('-')}`
    },
    // 根据id数组获取展数据
    getExhibitionsFromIds(idsString, siteId, exhArray) {
      const ids = idsString.split('-')
      const exhSet = exhArray[`${siteId}`]
      const arr = []
      for (let i = 1; i < ids.length; i++) {
        const exhid = ids[i]
        for (let j = 0; j < exhSet.length; j++) {
          const exh = exhSet[j]
          const { id } = exh
          if (Number(id) === Number(exhid)) {
            arr.push(exh)
          }
        }
      }
      return arr
    },
    // 根据siteId和ExhId获取开始结束时间
    getStartAndEndTimeFromSiteIdAndExhId(siteId, exhid, exhArray) {
      let result = {}
      const arr = exhArray[siteId]
      for (let i = 0; i < arr.length; i++) {
        const exh = arr[i]
        const { id, siteSchedule } = exh
        if (id === Number(exhid)) {
          for (let j = 0; j < siteSchedule.length; j++) {
            const site = siteSchedule[j]
            const { siteId: _siteId, beginTime, endTime } = site

            if (_siteId === Number(siteId)) {
              result = { beginTime, endTime }
              break
            }
          }
        }
      }
      return result
    },
    // 是否冲突(按时间戳)
    isConflict(times) {
      let result = false
      const ta = times[0]
      const tb = times[1]
      const sa = moment(ta[0]).valueOf() // startTimeA
      const ea = moment(ta[1]).valueOf() // endTimeA
      const sb = moment(tb[0]).valueOf() // startTimeB
      const eb = moment(tb[1]).valueOf() // endTimeB
      const arr = [{ value: sa, type: 'sa', type2: 'a' }, { value: ea, type: 'ea', type2: 'a' }, { value: sb, type: 'sb', type2: 'b' }, { value: eb, type: 'eb', type2: 'b' }]
      arr.sort((a, b) => {
        return a.value - b.value
      })
      const stack = []
      for (let i = 0; i < arr.length; i++) {
        const time = arr[i]
        const { type, type2 } = time
        if (type.includes('s')) { // s表示是startTime
          if (stack.length > 0) { // 判断是否已经有startTime在栈里面，有表示两个时间肯定有交集
            result = true
            break
          }
          stack.push(time)
        } else if (type.includes('e')) { // e表示是endTime,遍历到endtime的时候，表示栈中已经有startTime
          if (stack[0].type2 === type2) { // type相等表示为所属同一时间对象，无交集
            result = false
            break
          }
        }
      }
      return result
    },
    // 是否冲突块(按天)
    isConflict_bk(siteId, exhibitions) {
      // 获取重叠展会占用的日期数组(二维数组)
      const allDates = []
      const launchDates = []
      for (let i = 0; i < exhibitions.length; i++) {
        const exhibition = exhibitions[i]
        const { startTime, endTime, siteSchedule } = exhibition
        let allArr = []
        let launchArr = []
        for (let j = 0; j < siteSchedule.length; j++) {
          const item = siteSchedule[j]
          if (item.siteId === Number(siteId)) {
            const { launchBeginTime, launchEndTime } = item
            launchArr = getDateToArray(launchBeginTime, launchEndTime)
          }
        }
        allArr = getDateToArray(startTime, endTime)
        launchDates.push(launchArr)
        allDates.push(allArr)
      }
      console.log('launchDates', launchDates)
      const filterAllDates = intersection(allDates) || [] // 展之间开始结束时间的交集日期
      const filterLaunchDates = uniqueArr(launchDates.flat(Infinity)) || [] // 展之间开展日期拍平去重
      console.log('filterAllDates', filterAllDates)
      console.log('filterLaunchDates', filterLaunchDates)
      const isConflict = intersection([filterAllDates, filterLaunchDates])?.length > 0
      return isConflict
    },
    filterConflict(exhibitions, conflicts) {
      const _exhibitions = deepClone(exhibitions)
      const exhibitionObj = {}
      for (const idsKey in conflicts) {
        const conflictObj = conflicts[idsKey]
        const { dates } = conflictObj // 冲突占用date数据
        const idArray = idsKey.split('-')
        const siteId = idArray[0]
        const exIds = idArray.slice(1)
        for (let j = 0; j < exIds.length; j++) {
          const exId = exIds[j]
          if (Object.prototype.hasOwnProperty.call(exhibitionObj, exId)) {
            exhibitionObj[exId].push({ siteId, dates })
          } else {
            exhibitionObj[exId] = [{ siteId, dates }]
          }
        }
      }
      console.log('exhibitionObj-----', exhibitionObj)
      for (const exId in exhibitionObj) {
        const siteDates = exhibitionObj[exId]
        for (let i = 0; i < siteDates.length; i++) {
          const siteDate = siteDates[i]
          const { siteId: conflictSiteId, dates } = siteDate
          for (let j = 0; j < _exhibitions.length; j++) {
            const exhibition = _exhibitions[j]
            const { id, siteSchedule } = exhibition
            if (Number(exId) !== id) continue // 根据id匹配展
            for (let k = 0; k < siteSchedule.length; k++) {
              const site = siteSchedule[k]
              const { siteId } = site
              if (Number(siteId) === Number(conflictSiteId)) { // 根据siteid匹配场地
                const { beginTime, endTime } = _exhibitions[j]['siteSchedule'][k]
                const arr = getDateToArray(beginTime, endTime)
                const filterArr = arr.filter(item => {
                  return !dates.includes(item)
                })
                const length = filterArr.length
                if (length === 0) { // 代表当前场地日期全部被冲突覆盖，直接删除该场地数据，避免重复渲染
                  _exhibitions[j]['siteSchedule'].splice(k, 1)
                } else {
                  const filterStartTime = filterArr[0]
                  const filterEndTime = filterArr[length - 1]
                  _exhibitions[j]['siteSchedule'][k]['beginTime'] = filterStartTime
                  _exhibitions[j]['siteSchedule'][k]['endTime'] = filterEndTime
                }
              }
            }
          }
        }
      }
      console.log('_exhibitions----------', _exhibitions)
      return _exhibitions
    },
    // 过滤掉冲突的数据
    filterConflict_bk(exhibitions, conflicts) {
      const _exhibitions = deepClone(exhibitions)
      const exhibitionObj = {}
      for (let i = 0; i < conflicts.length; i++) {
        const idString = conflicts[i]
        const idArray = idString.split('-')
        const siteId = idArray[0]
        const exIds = idArray.slice(1)
        for (let j = 0; j < exIds.length; j++) {
          const exId = exIds[j]
          if (Object.prototype.hasOwnProperty.call(exhibitionObj, exId)) {
            exhibitionObj[exId].push(siteId)
          } else {
            exhibitionObj[exId] = [siteId]
          }
        }
      }
      console.log('exhibitionObj', exhibitionObj)
      for (const exId in exhibitionObj) {
        const siteIds = exhibitionObj[exId]
        for (let j = 0; j < _exhibitions.length; j++) {
          const exhibition = _exhibitions[j]
          const { id, siteSchedule } = exhibition
          if (Number(exId) !== id) continue
          for (let k = 0; k < siteSchedule.length; k++) {
            const site = siteSchedule[k]
            const { siteId } = site
            if (siteIds.includes(String(siteId))) {
              _exhibitions[j]['siteSchedule'].splice(k, 1) // 砍掉冲突的场地对象
            }
          }
        }
      }
      console.log('exhibitions', exhibitions)
      console.log('_exhibitions', _exhibitions)
      return _exhibitions
    },
    // 根据siteId获取index
    getIndexFormSites(siteId, sites) {
      for (let i = 0; i < sites.length; i++) {
        const site = sites[i]
        const { id } = site
        if (siteId === `${id}`) {
          return i
        }
      }
    },
    // 根据index获取siteName
    getSiteNameFormIndex(block) {
      const { sites } = this.filterData
      const { top } = block
      return sites[top]['siteName']
    },
    // 统计展块style
    calculateStyle(block) {
      const width = `${block.girdLength * tableGirdWidth}px`
      const height = `${block.siteLength * tableGirdHeight - 1}px`
      const top = `${block.top * (tableGirdHeight) + defaultBlockTop}px`
      const left = `${block.left * tableGirdWidth + defaultBlockLeft - 1}px`
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
    calculateConflictStyle(state) {
      const backgroundColor = BLOCK_BG_COLOR[state]
      const borderColor = BLOCK_BORDER_COLOR[state]
      return {
        backgroundColor,
        borderColor
      }
    },
    handleShowDetails(block) {
      console.log('handleShowDetails', block)
      const { id, projectName, isConflict, exhibition } = block
      let siteInfos = []
      if (isConflict) {
        this.isConflictInfo = true
        siteInfos = exhibition.map(item => {
          const { id: exhId, projectName: name } = item
          return { id: exhId, projectName: name }
        })
      } else {
        siteInfos = [{ id, projectName }]
        this.isConflictInfo = false
      }
      this.dialog.dialogShow = true
      this.dialog.siteInfos = siteInfos
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
      padding: 10px 10px;
      font-size: 14px;
      border-right: 1px solid #d3d3d3 !important;
      .wrapper {
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        position: relative;
        border: none;
        .conflict {
          line-height: 20px;
          color: #FF0000;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
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
            height: 20px;
            min-width: 18px;
            line-height: 20px;
            margin-right: 4px;
            text-align: center;
            border-radius: 2px;
            color: #fff;
            overflow: hidden;
            // flex-grow:0;
            // flex-shrink:0;
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
.popover-schedule{
  max-height: 460px;
  overflow: auto;
  cursor: pointer;
  .schedule-block {
    box-sizing: border-box;
    border-left: 2px solid transparent;
    padding: 12px 8px;
    font-size: 14px;
    border-right: 1px solid #d3d3d3 !important;
    margin-bottom: 20px;
    &:last-child{
      margin-bottom: 0px;
    }
    .schedule-wrapper{
      display: flex;
      flex-direction: column;
      justify-content: space-around;
      position: relative;
      height: 76px;
      .schedule-title{
        display: flex;
        .schedule-tag {
          display: inline-block;
          width: 36px;
          height: 20px;
          line-height: 20px;
          margin-right: 4px;
          text-align: center;
          border-radius: 2px;
          color: #fff;
        }
        .schedule-projectName {
          line-height: 20px;
        }
      }
      .schedule-address {
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
      }
      .schedule-isConflict {
        color: #FF0000;
      }
    }
  }
  .schedule-block:last-child {
    margin-bottom: 0px;
  }
}
</style>
