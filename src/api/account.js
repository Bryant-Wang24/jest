import base from './base'
import axios from '@/utils/http'
const accountApi = {
  // 分页查取台账
  getAccountList: params => {
    return axios.post(`${base.hall}api/hall/rest/standingBook/page`, params)
  },
  // 修改台账
  editAccount: (id, params) => {
    return axios.put(`${base.hall}api/hall/rest/standingBook/${id}`, params)
  },
  // 删除台账
  deleteAccount: (id) => {
    return axios.delete(`${base.hall}api/hall/rest/standingBook/${id}`)
  },
  // 通过id查找台账
  findAccountById: (id) => {
    return axios.get(`${base.hall}api/hall/rest/standingBook/${id}`)
  },
  // 查看客户公司
  findCustomerAccount: params => {
    return axios.get(`${base.hall}api/hall/rest/shopCustomer/list`, params)
  },
  // 通过公司名取对应的收款账号
  getReceAccount: params => {
    return axios({
      method: 'post',
      url: `${base.hall}api/hall/rest/account/numberList`,
      params: {
        name: params
      }
    })
  },
  // 下载倒入模板
  downloadTemplate: () => {
    return axios.get(`${base.hall}api/hall/rest/standingBook/template`)
  },
  // 批量导入
  importAccountList: (file) => {
    return axios.post(`${base.hall}api/hall/rest/standingBook/import`, file)
  },
  // 录入台账
  enterAccount: (params) => {
    return axios.post(`${base.hall}api/hall/rest/standingBook`, params)
  },
  // 获取项目名称(包括商铺和销售)
  getProjectList: params => {
    // return axios.post(`${base.hall}api/hall/rest/sale/page`, params)
    // return axios.get(`${base.hall}api/hall/rest/sale/list`, params)
    return axios.get(`${base.hall}api/hall/rest/orders/projects`, { params })
  },
  // 获取客户名称
  getCustomerList: params => {
    // return axios.post(`${base.hall}api/hall/rest/customer/page`, params)
    return axios.get(`${base.hall}api/hall/rest/shopCustomer/list`, params)
  },
  // 分页获取订单
  getOrderList: params => {
    return axios.post(`${base.hall}api/hall/rest/orders/paymentPlans/page`, params)
  },
  getPayments: params => {
    return axios.post(`${base.hall}api/hall/rest/orders/payments?paymentMethod=STANDING_BOOK`, params)
  },
  // 获取操作日志
  getOperationLog: id => {
    return axios.get(`${base.hall}api/hall/rest/standingBook/${id}/operationLog`)
  },
  // 获取台账收款记录
  getPaymentLog: (standingBookId, params) => {
    // return axios.get(`${base.hall}api/hall/rest/standingBook/${standingBookId}/receiptRecords`)
    return axios.get(`${base.hall}api/hall/rest/standingBook/${standingBookId}/payments`, { params })
  },
  // 订单收款撤回
  recallPayment: (paymentId) => {
    // return axios.post(`${base.hall}api/hall/rest/payments/${paymentId}/revocation`, {})
    return axios.post(`${base.hall}api/hall/rest/orders/payments/${paymentId}/revocation`, {})
  }
}
export default accountApi
