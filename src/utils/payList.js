export function get_time(date, sign) {
  var arr = date.split('-')
  var year = arr[0] // 获取当前日期的年份
  var month = arr[1] // 获取当前日期的月份
  // var day = arr[2] // 获取当前日期的日
  // var days = new Date(year, month, 0)
  // days = days.getDate() // 获取当前日期中的月的天数
  var year2 = year
  var month2 = parseInt(month) + 1
  if (month2 === 13) {
    year2 = parseInt(year2) + 1
    month2 = 1
  }
  if (month2 < 10) {
    month2 = '0' + month2
  }

  var newTime = year2 + '-' + month2 + '-' + sign
  return newTime
}
export function payList(amount, abbreviation, templateName) {
  var list = [
    {
      label: '1笔 100%',
      value: '1',
      amountNum: amount,
      payTable: [
        {
          name: '【' + abbreviation + '】 ' + templateName + '第1笔费用',
          amount: Math.floor(amount * 100) / 100,
          payDate: null,
          ratio: 100,
          remarks: ''
        }
      ]
    },
    {
      label: '2笔 50% 50%',
      value: '2',
      amountNum: amount,
      payTable: [
        {
          name: '【' + abbreviation + '】 ' + templateName + '第1笔费用',
          amount: Math.floor(amount * 100 * 0.5) / 100,
          payDate: null,
          ratio: 50,
          remarks: ''
        },
        {
          name: '【' + abbreviation + '】 ' + templateName + '第2笔费用',
          amount: Math.floor(amount * 100 * 0.5) / 100,
          payDate: null,
          ratio: 50,
          remarks: ''
        }
      ]
    },
    {
      label: '2笔 70% 30%',
      amountNum: amount,
      value: '3',
      payTable: [
        {
          name: '【' + abbreviation + '】 ' + templateName + '第1笔费用',
          amount: Math.floor(amount * 100 * 0.7) / 100,
          payDate: null,
          ratio: 70,
          remarks: ''
        },
        {
          name: '【' + abbreviation + '】 ' + templateName + '第2笔费用',
          amount: Math.floor(amount * 100 * 0.3) / 100,
          payDate: null,
          ratio: 30,
          remarks: ''
        }
      ]
    },
    {
      label: '3笔 30% 50% 20%',
      value: '4',
      amountNum: amount,
      payTable: [
        {
          name: '【' + abbreviation + '】 ' + templateName + '第1笔费用',
          amount: Math.floor(amount * 100 * 0.3) / 100,
          payDate: null,
          ratio: 30,
          remarks: ''
        },
        {
          name: '【' + abbreviation + '】 ' + templateName + '第2笔费用',
          amount: Math.floor(amount * 100 * 0.5) / 100,
          payDate: null,
          ratio: 50,
          remarks: ''
        },
        {
          name: '【' + abbreviation + '】 ' + templateName + '第3笔费用',
          amount: Math.floor(amount * 100 * 0.2) / 100,
          payDate: null,
          ratio: 20,
          remarks: ''
        }
      ]
    },
    {
      label: '3笔 20% 30% 50%',
      value: '5',
      amountNum: amount,
      payTable: [
        {
          name: '【' + abbreviation + '】 ' + templateName + '第1笔费用',
          amount: Math.floor(amount * 100 * 0.2) / 100,
          payDate: null,
          ratio: 20,
          remarks: ''
        },
        {
          name: '【' + abbreviation + '】 ' + templateName + '第2笔费用',
          amount: Math.floor(amount * 100 * 0.3) / 100,
          payDate: null,
          ratio: 30,
          remarks: ''
        },
        {
          name: '【' + abbreviation + '】 ' + templateName + '第3笔费用',
          amount: Math.floor(amount * 100 * 0.5) / 100,
          payDate: null,
          ratio: 50,
          remarks: ''
        }
      ]
    },
    {
      label: '3笔 30% 20% 50%',
      value: '6',
      amountNum: amount,
      payTable: [
        {
          name: '【' + abbreviation + '】 ' + templateName + '第1笔费用',
          amount: Math.floor(amount * 100 * 0.3) / 100,
          payDate: null,
          ratio: 30,
          remarks: ''
        },
        {
          name: '【' + abbreviation + '】 ' + templateName + '第2笔费用',
          amount: Math.floor(amount * 100 * 0.2) / 100,
          payDate: null,
          ratio: 20,
          remarks: ''
        },
        {
          name: '【' + abbreviation + '】 ' + templateName + '第3笔费用',
          amount: Math.floor(amount * 100 * 0.5) / 100,
          payDate: null,
          ratio: 50,
          remarks: ''
        }
      ]
    },
    {
      label: '3笔 10% 40% 50%',
      value: '7',
      amountNum: amount,
      payTable: [
        {
          name: '【' + abbreviation + '】 ' + templateName + '第1笔费用',
          amount: Math.floor(amount * 10) / 100,
          payDate: null,
          ratio: 10,
          remarks: ''
        },
        {
          name: '【' + abbreviation + '】 ' + templateName + '第2笔费用',
          amount: (Number(amount) * 0.4).toFixed(2),
          payDate: null,
          ratio: 40,
          remarks: ''
        },
        {
          name: '【' + abbreviation + '】 ' + templateName + '第3笔费用',
          amount: Math.floor(amount * 100 * 0.5) / 100,
          payDate: null,
          ratio: 50,
          remarks: ''
        }
      ]
    },
    {
      label: '4笔 10% 20% 30% 40%',
      value: '8',
      amountNum: amount,
      payTable: [
        {
          name: '【' + abbreviation + '】 ' + templateName + '第1笔费用',
          amount: Math.floor(amount * 10) / 100,
          payDate: null,
          ratio: 10,
          remarks: ''
        },
        {
          name: '【' + abbreviation + '】 ' + templateName + '第2笔费用',
          amount: Math.floor(amount * 100 * 0.2) / 100,
          payDate: null,
          ratio: 20,
          remarks: ''
        },
        {
          name: '【' + abbreviation + '】 ' + templateName + '第3笔费用',
          amount: Math.floor(amount * 100 * 0.3) / 100,
          payDate: null,
          ratio: 30,
          remarks: ''
        },
        {
          name: '【' + abbreviation + '】 ' + templateName + '第4笔费用',
          amount: Math.floor(amount * 100 * 0.4) / 100,
          payDate: null,
          ratio: 40,
          remarks: ''
        }
      ]
    },
    {
      label: '自定义付款计划',
      value: '9',
      amountNum: amount,
      payTable: []
    }
  ]
  return list
}
