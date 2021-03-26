import store from '@/store'
import router from '@/router'
import { ASCII } from '@/common/global'

/**
 * 小数转百分比
 * @param {number} point 小数
 * @return {string}
 */
export const toPercent = (point) => {
  var str = Number(point * 100).toFixed(2)
  str += '%'
  return str
}

/**
 * 字节单位转换
 * @param {number} bytes 字节数
 * @return {string}
 */
export const bytesToSize = (bytes) => {
  if (bytes === 0) return '0 B'
  const k = 1024 // or 1024
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return (bytes / Math.pow(k, i)).toPrecision(3) + ' ' + sizes[i]
}

// 金额限制两位小数 oninput事件调用
export const limitTwoDigit = (e) => {
  const t = e.target.value
  e.target.value = (t.indexOf('.') >= 0) ? (t.substr(0, t.indexOf('.')) + t.substr(t.indexOf('.'), 3)) : t
}
export const toPercentNumber = (point) => {
  var number = Number(point * 100).toFixed(2)
  return number
}

// 金额限制两位小数
/** <el-input
      v-model="scope.row.num"
      :disabled="scope.row.amount === scope.row.paidAmount"
      @keyup.native="scope.row.num = limitNumberInput(scope.row.num)"
    />
**/
export const limitNumberInput = (num, limit) => {
  if (!num) return ''
  let str = num
  const len1 = str.substr(0, 1)
  const len2 = str.substr(1, 1)
  // 如果第一位是0，第二位不是点，就用数字把点替换掉
  if (str.length > 1 && len1 === '0' && len2 !== '.') {
    str = str.substr(1, 1)
  }
  // 第一位不能是.
  if (len1 === '.') {
    str = ''
  }
  // 限制只能输入一个小数点
  if (str.indexOf('.') !== -1) {
    const str_ = str.substr(str.indexOf('.') + 1)
    if (str_.indexOf('.') !== -1) {
      str = str.substr(0, str.indexOf('.') + str_.indexOf('.') + 1)
    }
  }
  // 正则替换
  const re = new RegExp('^\\D*([0-9]\\d*\\.?\\d{0,' + limit + '})?.*$', '')
  str = str.replace(/[^\d^\.]+/g, '') // 保留数字和小数点
  if (limit) {
    str = str.replace(re, '$1')
  }
  return str
}

export const deleteTagsView = (route, cb) => {
  store.dispatch('tagsView/delView', route).then(cb)
}

// 需配合saveRouterFrom.js mixin
export const routerBack = (route, isDelView = true) => {
  const { path: key } = route
  const path = localStorage.getItem(key) || '/dashboard'
  if (isDelView) {
    store.dispatch('tagsView/delView', route).then(() => {
      localStorage.removeItem(key)
    })
  } else {
    localStorage.removeItem(key)
  }
  router.push({ path })
}

export const download = (res) => {
  const string = res.headers['content-disposition']
  const filename = decodeURIComponent(string.substring(string.indexOf('filename') + (string.includes('"') ? 10 : 9), string.length - 1))
  // debugger
  const content = res.data
  const blob = new Blob([content])
  if ('download' in document.createElement('a')) { // 非IE下载
    const elink = document.createElement('a')
    elink.download = filename
    elink.style.display = 'none'
    elink.href = URL.createObjectURL(blob)
    document.body.appendChild(elink)
    elink.click()
    URL.revokeObjectURL(elink.href) // 释放URL 对象
    document.body.removeChild(elink)
  } else { // IE10+下载
    navigator.msSaveBlob(blob, filename)
  }
}

export const getFileName = (address = []) => {
  if (!address) return ''
  const arr = address.split('.')
  return arr.slice(0, arr.length - 1).toString()
}

export const getFileType = (address = []) => {
  if (!address) return ''
  const arr = address.split('.')
  return arr[arr.length - 1]
}

export const EncodeURIFilter = (str) => {
  if (str !== null && str !== '') {
    str = str.replace(/\+/g, '%2B')
    str = str.replace(/\&/g, '%26')
    str = str.replace(/\ /g, '%20')
    str = str.replace(/\（/g, '%28')
    str = str.replace(/\）/g, '%29')
    str = str.replace(/\(/g, '%28')
    str = str.replace(/\)/g, '%29')
  }
  return str
}

export const AsciiTransform = (str, symbols = []) => {
  let _str = str
  for (let i = 0; i < symbols.length; i++) {
    const symbol = symbols[i]
    const re = new RegExp(`\\${symbol}`, 'g')
    _str = _str.replace(re, `%${ASCII[symbol]}`)
  }
  return _str
}

export function randomNDigits(n) {
  if (n > 21) return null
  return parseInt((Math.random() + 1) * Math.pow(10, n - 1))
}
