import base from './base'
import axios from '@/utils/http'
import _axios from 'axios'
// import qs from 'qs'
// 下载导出excel
function download(res) {
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

const report = {
  // 项目排期表 - 分页
  reportProject: params => {
    return axios.post(`${base.hall}api/hall/rest/report/project/page`, params)
  },
  // // 项目排期表 - 导出
  // reportExport: params => {
  //   return axios.post(`${base.hall}api/hall/rest/report/project/export`, params,{ responseType: 'blob' })
  // },
  // 项目排期表 - 导出
  reportExport: params => {
    _axios.post(`${base.hall}api/hall/rest/report/project/export`, params, { responseType: 'blob' }).then(res => {
      download(res)
    })
  },
  // 合同/服务单收款记录 - 分页
  reportContract: params => {
    return axios.post(`${base.hall}api/hall/rest/report/contract/page`, params)
  },
  // 合同/服务单收款记录 - 导出
  reportContractExport: params => {
    _axios.post(`${base.hall}api/hall/rest/report/contract/export`, params, { responseType: 'blob' }).then(res => {
      download(res)
    })
    // return axios.post(`${base.hall}api/hall/rest/report/contract/export`, params)
  },
  // 开票记录 - 分页
  reportInvoice: params => {
    return axios.post(`${base.hall}api/hall/rest/report/invoice/page`, params)
  },
  // 开票记录 - 导出
  reportInvoiceExport: params => {
    _axios.post(`${base.hall}api/hall/rest/report/invoice/export`, params, { responseType: 'blob' }).then(res => {
      download(res)
    })
    // return axios.post(`${base.hall}api/hall/rest/report/invoice/export`, params)
  },
  // 订单应收&实收统计表
  reportOrder: params => {
    _axios.post(`${base.hall}api/hall/rest/report/orders/export`, params, { responseType: 'blob' }).then(res => {
      download(res)
    })
  },
  // 预付款/押金应收&实收统计表
  depositsOrder: params => {
    _axios.post(`${base.hall}api/hall/rest/report/deposits/export`, params, { responseType: 'blob' }).then(res => {
      download(res)
    })
  },
  // 场租金额汇总
  siteRentOrder: ({ projectTypes, year }) => {
    _axios.post(`${base.hall}api/hall/rest/report/project/siteRent?${projectTypes}&year=${year}`, null, { responseType: 'blob' }).then(res => {
      download(res)
    })
  },
  // 项目款项统计报表
  paymentSummaryOrder: ({ projectTypes, year }) => {
    _axios.post(`${base.hall}api/hall/rest/report/project/paymentSummary?projectTypes=${projectTypes}&year=${year}`, null, { responseType: 'blob' }).then(res => {
      download(res)
    })
  },
  // 项目各类别费用统计
  priceItemTypeOrder: ({ projectTypes, year }) => {
    _axios.post(`${base.hall}api/hall/rest/report/project/priceItemType?projectTypes=${projectTypes}&year=${year}`, null, { responseType: 'blob' }).then(res => {
      download(res)
    })
  },
  // 项目合同金额统计
  contractAmountOrder: ({ year }) => {
    _axios.post(`${base.hall}api/hall/rest/report/project/contractAmount?year=${year}`, null, { responseType: 'blob' }).then(res => {
      download(res)
    })
  },
  // 场地数据汇总
  exportOrder: params => {
    _axios.post(`${base.hall}api/hall/rest/report/project/site/export`, params, { responseType: 'blob' }).then(res => {
      download(res)
    })
  },
  // 证件销售 - 分页
  salesDocuments: params => {
    return axios.post(`${base.elc}portal/rest/exports/certificateSale/page`, params)
  },
  // 证件销售 - 导出报表
  exportReport: params => {
    _axios.post(`${base.elc}portal/rest/exports/certificateSale/export`, params, { responseType: 'blob' }).then(res => {
      download(res)
    })
  },
  // 证件销售 - 项目列表
  certificateSaleReport: params => {
    return _axios.get(`${base.elc}portal/rest/exports/certificateSale/project/list`, { params })
  }

}
export default report
