import base from './base'
import axios from '@/utils/http'
const billApi = {
  // 1获取项目名称(包括销售和商铺项目)
  getProjectName: params => {
    // return axios.post(`${base.hall}api/hall/rest/sale/page`, params)
    return axios.get(`${base.hall}api/hall/rest/sale/list`, params)
  },
  // 2获取分页获取客户列表
  getCustomerList: params => {
    return axios.get(`${base.hall}api/hall/rest/shopCustomer/list`, params)
  },
  // 3获取发票列表
  getInvoiceList: params => {
    return axios.post(`${base.hall}api/hall/rest/invoice/page`, params)
  },
  // 4导出发票列表
  exportInvoice: params => {
    return axios.get(
      `${base.hall}api/hall/rest/invoice/export?ids=${params}`
    )
  },
  // 5批量通过
  batchPass: params => {
    return axios.post(`${base.hall}api/hall/rest/invoice/batchPass?${params}`)
  },
  // 6 保存发票信息
  saveInvoiceInfo: params => {
    return axios.post(
      `${base.hall}api/hall/rest/invoice`, params
    )
  },
  // 7编辑发票信息
  editInvoiceInfo: params => {
    return axios.put(
      `${base.hall}api/hall/rest/invoice`, params
    )
  },
  // 8通过id查找发票信息
  findInvoiceById: id => {
    return axios.get(
      `${base.hall}api/hall/rest/invoice/${id}`
    )
  },
  // 9审核发票通过
  trailInvoicePass: params => {
    return axios.post(
      `${base.hall}api/hall/rest/invoice/pass?${params}`
    )
  },
  // 10审核发票拒绝
  trailInvoiceReject: params => {
    return axios.post(
      `${base.hall}api/hall/rest/invoice/reject?${params}`
    )
  },
  // 11审核发票作废
  trailInvoiceCancel: id => {
    return axios.post(
      `${base.hall}api/hall/rest/invoice/cancel/${id}`
    )
  },
  // 12 审核发票确认已开票
  trailInvoiced: params => {
    return axios.post(
      `${base.hall}api/hall/rest/invoice/invoiced`, params
    )
  },
  // 13 通过项目id和客户id查询订单列表
  getOrderList: params => {
    return axios.post(
      `${base.hall}api/hall/rest/orders/page`, params
    )
  },
  // 14查看金额明细
  getInvoiceDetail: params => {
    return axios.post(
      `${base.hall}api/hall/rest/invoice/detail`, params
    )
  },
  // 15获取指定id的客户/api/hall/rest/customer
  getCustomerInfo: id => {
    return axios.get(
      `${base.hall}api/hall/rest/customer?id=${id}`
    )
  },
  // 15查询所有的公司信息
  getCompanyList: () => {
    return axios.post(
      `${base.hall}api/hall/rest/account/getCompanyList`
    )
  },
  // 6通过项目和客户查询押金列表
  getDepositList: params => {
    return axios.post(`${base.hall}api/hall/rest/deposit/depositList`, params)
  },
  // 7保存收据管理信息
  saveReceiptInfo: params => {
    return axios.post(`${base.hall}api/hall/rest/receipt`, params)
  },
  // 8获取收据列表
  getReceiptList: params => {
    return axios.post(`${base.hall}api/hall/rest/receipt/page`, params)
  },
  // 9编辑收据信息
  editReceiptInfo: params => {
    return axios.put(`${base.hall}api/hall/rest/receipt`, params)
  },
  // 10根据id查找收据信息
  getReceiptById: id => {
    return axios.get(`${base.hall}api/hall/rest/receipt/${id}`)
  },
  // 11审核时通过请求
  trailReceiptPass: params => {
    return axios.post(`${base.hall}api/hall/rest/receipt/pass?${params}`)
  },
  // 12审核时拒绝请求
  trailReceiptReject: params => {
    return axios.post(`${base.hall}api/hall/rest/receipt/reject?${params}`)
  },
  // 13审核时作废请求
  trailReceiptCancel: id => {
    return axios.post(`${base.hall}api/hall/rest/receipt/cancel/${id}`)
  },
  // 14审核时已收据
  trailReceiptInvoiced: id => {
    return axios.post(`${base.hall}api/hall/rest/receipt/invoiced/${id}`)
  },
  // 15审核时回收收据
  trailReceiptRecovery: id => {
    return axios.post(`${base.hall}api/hall/rest/receipt/recovery/${id}`)
  },
  // 取消发票申请
  cancelInvoice: id => {
    return axios.post(`${base.hall}api/hall/rest/invoice/canceled/${id}`)
  },
  // 取消票据申请
  cancelReceipt: id => {
    return axios.post(`${base.hall}api/hall/rest/receipt/canceled/${id}`)
  },
  // 获取项目订单合同信息
  getProjectFiles: (params) => {
    return axios.get(`${base.hall}api/hall/rest/invoice/projectOrderContractInfo`, { params })
  },
  // 实收款记录
  payments: (params) => {
    return axios.get(`${base.hall}api/hall/rest/payments`, { params })
  },
  // 获取发票申请表附件
  getApplicationFile: (invoiceId) => {
    return axios.get(`${base.hall}api/hall/rest/invoice/${invoiceId}/applications`)
  },
  // 批量下载申请表
  downloadApplications: (invoiceIds) => {
    let query = ''
    for (let i = 0; i < invoiceIds.length; i++) {
      const invoiceId = invoiceIds[i]
      query += `invoiceIds=${invoiceId}&`
    }
    query = query.substring(0, query.length - 1)
    window.location.href = `http://${window.location.host}${base.hall}api/hall/rest/invoice/applications?${query}`
  }
}

export default billApi
