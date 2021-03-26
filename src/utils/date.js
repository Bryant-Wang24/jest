import moment from 'moment'
import { isString, isArray } from '@/utils/validate'
/**
 * @param {string} date 日期
 * @description 获取星期几
 */
export const getWeek = (date) => {
  const week = moment(date).day()
  switch (week) {
    case 1:
      return '一'
    case 2:
      return '二'
    case 3:
      return '三'
    case 4:
      return '四'
    case 5:
      return '五'
    case 6:
      return '六'
    case 0:
      return '日'
  }
}

/**
 * @param {string | Array} startTime 日期开始时间
 * @param {string | Array} endTime 日期结束时间
 * @returns {Array} 返回日期数组
 * @description 支持String和Array格式,Array格式注意两个数组长度必须一致
 */
export const getDateToArray = (startTime, endTime) => {
  const arr = []
  if (isString(startTime)) {
    const s = moment(startTime).format('YYYY-MM-DD')
    const e = moment(endTime).format('YYYY-MM-DD')
    let start = moment(s).subtract(1, 'd')
    const daysDiff = moment(e).diff(moment(s), 'days')
    for (let i = 0; i < daysDiff + 1; i++) {
      const momentObj = moment(start).add(1, 'd')
      const date = moment(momentObj).format('YYYY-MM-DD')
      arr.push(date)
      start = momentObj
    }
  }
  if (isArray(startTime)) {
    // let dateArr = []
    for (let i = 0; i < startTime.length; i++) {
      const startTimeItem = startTime[i]
      const endTimeItem = endTime[i]
      // const s = moment(startTimeItem).format('YYYY-MM-DD')
      // const e = moment(endTimeItem).format('YYYY-MM-DD')
      let start = moment(startTimeItem).subtract(1, 'd')
      const daysDiff = moment(endTimeItem).diff(
        moment(startTimeItem),
        'days'
      )
      for (let i = 0; i < daysDiff + 1; i++) {
        const momentObj = moment(start).add(1, 'd')
        const date = moment(momentObj).format('YYYY-MM-DD')
        arr.push(date)
        start = momentObj
      }
    }
  }
  return arr
}

export const getMinDate = (array) => {
  return array.reduce((prev, cur) => {
    return Math.min(moment(prev).valueOf(), moment(cur).valueOf())
  })
}

export const getMaxDate = (array) => {
  return array.reduce((prev, cur) => {
    return Math.max(moment(prev).valueOf(), moment(cur).valueOf())
  })
}

/**
 * params: {
 *    isSubMonth: false    如果为true，会自动边界处理，只返回单前月份内的天数
 *    month                isSubMonth为true时必传，表示当前月份
 *    year                 isSubMonth为true时必传，表示当前年份
 *    startTime            开始时间  支持数组
 *    endTime              结束时间  支持数组
 * }
 * return {                 isSubMonth为true的情况下          isSubMonth为false的情况下
 *    currentMonthStartTime 当前展 在当前月份的开始时间        当前展 在当前月份的开始时间
 *    currentMonthEndTime   当前展 在当前月份的结束时间        当前展 在当前月份的结束时间
 *    length                当前展 在当前月份的天数（占用数）   当前展 的天数
 * }
 */
export const getDayLength = ({ isSubMonth = false, year, month, startTime, endTime }) => {
  let length = null
  const isArrayArgs = isArray(startTime)
  let currentMonthStartTime = isArrayArgs ? getMinDate(startTime) : startTime
  let currentMonthEndTime = isArrayArgs ? getMaxDate(endTime) : endTime
  if (isSubMonth) {
    const sYear = moment(currentMonthStartTime).year()
    const eYear = moment(currentMonthEndTime).year()
    if (sYear < Number(year) && eYear < Number(year)) {
      length = 0
    } else {
      currentMonthStartTime = sYear === Number(year) ? currentMonthStartTime : sYear < Number(year) ? moment(year).startOf('year').format('YYYY-MM-DD') : null
      currentMonthEndTime = eYear === Number(year) ? currentMonthEndTime : eYear < Number(year) ? null : moment(year).endOf('year').format('YYYY-MM-DD')
      const startMonth = moment(currentMonthStartTime).format('MM')
      const endMonth = moment(currentMonthEndTime).format('MM')
      const _startTime = startMonth < month ? moment(`${year}-${month}`).startOf('month').format('YYYY-MM-DD') : moment(currentMonthStartTime).format('YYYY-MM-DD') // 临时2020
      const _endTime = endMonth > month ? moment(`${year}-${month}`).endOf('month').format('YYYY-MM-DD') : moment(currentMonthEndTime).format('YYYY-MM-DD')
      currentMonthStartTime = _startTime
      currentMonthEndTime = _endTime
      length = moment(_endTime).diff(moment(_startTime), 'days') + 1
    }
  } else {
    length = moment(currentMonthEndTime).diff(moment(currentMonthStartTime), 'days') + 1
  }
  return {
    currentMonthStartTime,
    currentMonthEndTime,
    length
  }
}

/**
 * @param {Array} arrs 二维数组
 * @returns {Array} 返回交集数组
 */
export const intersection = (arrs) => {
  if (arrs.length === 0) return []
  let arr = arrs.shift()
  for (let i = arrs.length; i--;) {
    const p = { 'boolean': {}, 'number': {}, 'string': {}}; const obj = []
    arr = arr.concat(arrs[i]).filter(function(x) {
      const t = typeof x
      return !((t in p) ? !p[t][x] && (p[t][x] = 1) : obj.indexOf(x) < 0 && obj.push(x))
    })
    if (!arr.length) return []
  }
  return arr
}

/**
 * @param {Array} arrs date数组
 * @description 升序排序date
 */
export const initDatesToAscend = (arrs) => {
  const dates = arrs.map(item => {
    return moment(item).valueOf()
  })
  dates.sort()
  const newArr = dates.map(item => {
    return moment(item).format('YYYY-MM-DD')
  })
  return newArr
}
