
module.exports = [
  {
    url: '/vue-element-admin/api/hall/rest/SchdulingView/siteMessage',
    type: 'get',
    response: config => {
      const { type } = config.query
      let list = []
      switch (type) {
        case 'EXHIBITION':
          list = [
            {
              'id': 1,
              'siteNumber': 1111,
              'siteName': '1号馆',
              'siteType': 'EXHIBITION',
              'siteSize': '40x20',
              'siteLocation': '啊实打实',
              'siteArea': '36平方',
              'attachImage': '',
              'remarks': '说明',
              'enable': '1'
            },
            {
              'id': 2,
              'siteNumber': 1112,
              'siteName': '2号馆',
              'siteType': 'EXHIBITION',
              'siteSize': '40x20',
              'siteLocation': '高等动物',
              'siteArea': '36平方',
              'attachImage': '',
              'remarks': '说明',
              'enable': '1'
            },
            {
              'id': 3,
              'siteNumber': 1113,
              'siteName': '3号馆',
              'siteType': 'EXHIBITION',
              'siteSize': '40x20',
              'siteLocation': '点击文件',
              'siteArea': '36平方',
              'attachImage': '',
              'remarks': '说明',
              'enable': '1'
            }
          ]
          break
        case 'MEETING':
          list = [
            {
              'id': 4,
              'siteNumber': 1114,
              'siteName': '会议厅1',
              'siteType': 'MEETING',
              'siteSize': '40x20',
              'siteLocation': '点击文件',
              'siteArea': '36平方',
              'attachImage': '',
              'remarks': '说明',
              'enable': '1'
            },
            {
              'id': 5,
              'siteNumber': 1115,
              'siteName': '会议厅2',
              'siteType': 'MEETING',
              'siteSize': '40x20',
              'siteLocation': '点击文件',
              'siteArea': '36平方',
              'attachImage': '',
              'remarks': '说明',
              'enable': '1'
            },
            {
              'id': 6,
              'siteNumber': 1116,
              'siteName': '会议厅3',
              'siteType': 'MEETING',
              'siteSize': '40x20',
              'siteLocation': '点击文件',
              'siteArea': '36平方',
              'attachImage': '',
              'remarks': '说明',
              'enable': '1'
            }
          ]
          break
        case '2':
          list = [
            {
              'id': 7,
              'siteNumber': 1117,
              'siteName': '广告位1',
              'siteType': 2,
              'siteSize': '40x20',
              'siteLocation': '点击文件',
              'siteArea': '36平方',
              'attachImage': '',
              'remarks': '说明',
              'enable': '1'
            },
            {
              'id': 8,
              'siteNumber': 1118,
              'siteName': '广告位2',
              'siteType': 2,
              'siteSize': '40x20',
              'siteLocation': '点击文件',
              'siteArea': '36平方',
              'attachImage': '',
              'remarks': '说明',
              'enable': '1'
            }
          ]
          break
        default:
          break
      }
      return {
        success: true,
        data: {
          list: list
        }
      }
    }
  },
  {
    url: '/vue-element-admin/api/hall/rest/SchdulingView/getYear',
    type: 'get',
    response: config => {
      const { type, siteId } = config.query
      let year = []
      if (type === 'EXHIBITION') {
        year = ['2000', '2001', '2002']
      } else if (type === 'MEETING') {
        year = ['2003', '2004', '2005']
      }
      return {
        success: true,
        data: {
          year: year
        }
      }
    }
  },
  {
    url: '/vue-element-admin/api/hall/rest/SchdulingView',
    type: 'get',
    response: config => {
      const { id } = config.query
      return {
        success: true,
        data: {
          'siteOrder': {
            'id': 1000,
            'code': 'OVEJNC',
            'type': 'EXHIBITION',
            'totalArea': 0.0,
            'startTime': '2020-09-21 08:41',
            'endTime': '2020-09-30 08:41',
            'createBy': 'chenyujian',
            'createDate': '2020-09-21 07:49:14',
            'updateBy': null,
            'updateDate': '2020-09-21 07:49:14',
            'state': 'RESERVE',
            'approvalStatus': 'SAVED',
            'approvalReason': null,
            'projectName': '社交1111111',
            'projectAs': '社交',
            'hostCompany': '九象科技',
            'website': 'www.jiuxianag,com',
            'undertakeCompany': '家里',
            'remarks': 'hhh',
            'content': '吃饭',
            'eatTime': null,
            'numberPeople': null
          },
          'siteSchedules': [
            {
              'id': 1000,
              'orderId': 1000,
              'siteId': 1392,
              'siteName': '一号馆',
              'siteArea': 800.0,
              'beginTime': '2020-05-01 09:00',
              'endTime': '2020-05-08 09:00',
              'exhBeginTime': '2020-05-01 09:00',
              'exhEndTime': '2020-05-01 18:00',
              'launchBeginTime': '2020-05-02 09:00',
              'launchEndTime': '2020-05-07 09:00',
              'moveBeginTime': '2020-05-08 09:00',
              'moveEndTime': '2020-05-08 18:00',
              'pitchNumber': null,
              'isReserve': 0,
              'reserveStartTime': null,
              'reserveEndTime': null,
              'timeRemark': null
            },
            {
              'id': 1002,
              'orderId': 1000,
              'siteId': 1393,
              'siteName': '二号馆',
              'siteArea': 700.0,
              'beginTime': '2020-05-01 09:00',
              'endTime': '2020-05-09 09:00',
              'exhBeginTime': '2020-05-01 09:00',
              'exhEndTime': '2020-05-01 18:00',
              'launchBeginTime': '2020-05-02 09:00',
              'launchEndTime': '2020-05-08 09:00',
              'moveBeginTime': '2020-05-09 09:00',
              'moveEndTime': '2020-05-09 18:00',
              'pitchNumber': null,
              'isReserve': 1,
              'reserveStartTime': null,
              'reserveEndTime': null,
              'timeRemark': null
            }
          ],
          'linkMessage': [
            {
              'id': 1000,
              'orderId': 1000,
              'contact': '码数',
              'address': '家里',
              'phone': '18879654857',
              'job': 'web',
              'email': 'ass@qq.com',
              'fax': 'fax'
            },
            {
              'id': 1001,
              'orderId': 1000,
              'contact': '哦怕',
              'address': '刷卡积分',
              'phone': '13333333333',
              'job': 'web',
              'email': 'shjekha@qq.com',
              'fax': 'fax'
            }
          ]
        }
      }
    }
  }
]
