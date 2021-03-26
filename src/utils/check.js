var checkNum = (rule, value, callback) => {
  if (!Number.isInteger(value)) {
    callback(new Error('请输入数字值'))
  } else {
    if (value > 0) {
      callback()
    } else {
      callback(new Error('请输入大于0的数字'))
    }
  }
}
var checkString = (rule, value, callback) => {
  if (!isNaN(value)) {
    callback(new Error('请输入非数字值'))
  } else {
    callback()
    if (value < 0) {
      callback(new Error('请输入大于0的数字'))
    } else {
      callback()
    }
  }
}
var checkPhone = (rule, value, callback) => {
  const phoneReg = /^1(3|4|5|6|7|8|9)\d{9}$/
  if (!value) {
    return callback(new Error('电话号码不能为空'))
  }
  if (!Number.isInteger(+value)) {
    callback(new Error('请输入数字值'))
  } else {
    if (phoneReg.test(value)) {
      callback()
    } else {
      callback(new Error('电话号码格式不正确'))
    }
  }
}
var fileSize = (limit) => {
  var size = ''
  if (limit < 0.1 * 1024) { // 小于0.1KB，则转化成B
    size = limit.toFixed(2) + 'B'
  } else if (limit < 0.1 * 1024 * 1024) { // 小于0.1MB，则转化成KB
    size = (limit / 1024).toFixed(2) + 'KB'
  } else if (limit < 0.1 * 1024 * 1024 * 1024) { // 小于0.1GB，则转化成MB
    size = (limit / (1024 * 1024)).toFixed(2) + 'MB'
  } else { // 其他转化成GB
    size = (limit / (1024 * 1024 * 1024)).toFixed(2) + 'GB'
  }

  var sizeStr = size + '' // 转成字符串
  var index = sizeStr.indexOf('.') // 获取小数点处的索引
  var dou = sizeStr.substr(index + 1, 2) // 获取小数点后两位的值
  if (dou === '00') { // 判断后两位是否为00，如果是则删除00
    return sizeStr.substring(0, index) + sizeStr.substr(index + 3, 2)
  }
  return size
}
// 金额转换为中文繁体
var moneyToChinese = (money) => {
  var cnNums = ['零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖']
  // 基本单位
  var cnIntRadice = ['', '拾', '佰', '仟']
  // 对应整数部分扩展单位
  var cnIntUnits = ['', '万', '亿', '兆']
  // 对应小数部分单位
  var cnDecUnits = ['角', '分', '毫', '厘']
  // 整数金额时后面跟的字符
  var cnInteger = '整'
  // 整型完以后的单位
  var cnIntLast = '元'
  // 最大处理的数字
  var maxNum = 999999999999999.9999
  // 金额整数部分
  var integerNum
  // 金额小数部分
  var decimalNum
  // 输出的中文金额字符串
  var chineseStr = ''
  // 分离金额后用的数组，预定义
  var parts
  if (money === '') { return '' }
  money = parseFloat(money)
  if (money >= maxNum) {
    // 超出最大处理数字
    return ''
  }
  if (money === 0) {
    chineseStr = cnNums[0] + cnIntLast + cnInteger
    return chineseStr
  }
  // 转换为字符串
  money = money.toString()
  if (money.indexOf('.') === -1) {
    integerNum = money
    decimalNum = ''
  } else {
    parts = money.split('.')
    integerNum = parts[0]
    decimalNum = parts[1].substr(0, 4)
  }
  // 获取整型部分转换
  if (parseInt(integerNum, 10) > 0) {
    var zeroCount = 0
    var IntLen = integerNum.length
    for (var i = 0; i < IntLen; i++) {
      var n = integerNum.substr(i, 1)
      var p = IntLen - i - 1
      var q = p / 4
      var m = p % 4
      if (n === '0') {
        zeroCount++
      } else {
        if (zeroCount > 0) {
          chineseStr += cnNums[0]
        }
        // 归零
        zeroCount = 0
        chineseStr += cnNums[parseInt(n)] + cnIntRadice[m]
      }
      if (m === 0 && zeroCount < 4) {
        chineseStr += cnIntUnits[q]
      }
    }
    chineseStr += cnIntLast
  }
  // 小数部分
  if (decimalNum !== '') {
    var decLen = decimalNum.length
    for (let i = 0; i < decLen; i++) {
      const n = decimalNum.substr(i, 1)
      if (n !== '0') {
        chineseStr += cnNums[Number(n)] + cnDecUnits[i]
      }
    }
  }
  if (chineseStr === '') {
    chineseStr += cnNums[0] + cnIntLast + cnInteger
  } else if (decimalNum === '') {
    chineseStr += cnInteger
  }
  return chineseStr
}
var conversion = (time) => {
  var date = new Date(time)
  var YY = date.getFullYear() + '-'
  var MM = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-'
  var DD = (date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate())
  var hh = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':'
  var mm = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + ':'
  var ss = (date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds())
  return YY + MM + DD + ' ' + hh + mm + ss
}

// 注册自定义组件
var MyPlugin = {
  install(Vue) {
    Vue.prototype.fileSize = fileSize
    Vue.prototype.checkNum = checkNum
    Vue.prototype.conversion = conversion
    Vue.prototype.checkString = checkString
    Vue.prototype.checkPhone = checkPhone
    Vue.prototype.moneyToChinese = moneyToChinese
  }
}

export default MyPlugin
