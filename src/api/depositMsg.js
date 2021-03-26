import base from './base'
import axios from '@/utils/http'
// import qs from 'qs'
// import request from '@/utils/request'

const depositMsg = {
  // 获取所有项目名称
  getProjectList: params => {
    return axios.get(`${base.hall}api/hall/rest/sale/list`, params)
  },
  // 获取所有客户名称
  getCustomerList: params => {
    return axios.get(`${base.hall}api/hall/rest/shopCustomer/list`, params)
  },
  // 获取收款账户信息
  getAccountList: params => {
    return axios.post(`${base.hall}api/hall/rest/account/numberList`, params)
  },
  // 获取押金列表
  getDepositList: params => {
    return axios.post(`${base.hall}api/hall/rest/deposit/page`, params)
  },
  // 获取押金使用记录 / 操作日志
  getDepositRecord: id => {
    return axios.get(`${base.hall}api/hall/rest/deposit/operationHistory/${id}`)
  },
  // 通过押金id获取押金
  getDepositById: id => {
    return axios.get(`${base.hall}api/hall/rest/deposit/${id}`)
  },
  // 通过编号押金获取押金
  // getDepositByCode: id => {
  //     return axios.get(`${base.hall}api/hall/rest/deposit`)
  // },
  // 押金转款
  transferDeposit: params => {
    return axios.post(`${base.hall}api/hall/rest/deposit/turn`, params)
  },
  // 删除
  deleteDeposit: id => {
    return axios.delete(`${base.hall}api/hall/rest/deposit/${id}`)
  },
  // 添加押金
  addDeposit: params => {
    return axios.post(`${base.hall}api/hall/rest/deposit`, params)
  },
  // 分页查询台账
  getBookList: params => {
    return axios.post(`${base.hall}api/hall/rest/standingBook/page`, params)
  },
  // 押金入账
  doDepositEntry: params => {
    // return axios.post(`${base.hall}api/hall/rest/deposit/billing`, params)
    // return axios.post(`${base.hall}api/hall/rest/standingBooks/pay/deposit`, params)
    return axios.post(`${base.hall}api/hall/rest/deposits/receipts`, params)
  },
  // 订单分页
  getOrderList: params => {
    return axios.post(`${base.hall}api/hall/rest/orders/paymentPlans/page`, params)
  },
  // 订单收款
  orderCollection: (query, params) => {
    return axios.post(`${base.hall}api/hall/rest/orders/payments?${query}`, params)
  },
  // 押金入账撤回
  recall: paymentId => {
    // return axios.post(`${base.hall}api/hall/rest/deposit/depositWithDraw`, params)
    // return axios.post(`${base.hall}api/hall/rest/deposits/payments/${paymentId}/revocation`)
    return axios.post(`${base.hall}api/hall/rest/deposits/receipts/${paymentId}/revocation`)
  },
  // 获取押金收款记录
  getDepostitPayment: (depositId) => {
    // return axios.post(`${base.hall}api/hall/rest/deposit/${depositId}/receiptRecords`)
    return axios.post(`${base.hall}api/hall/rest/deposits/${depositId}/payments`)
  },
  getOrderDetail: orderid => {
    return axios.post(`${base.hall}api/hall/rest/orders/${orderid}`, {})
  },
  // 押金入账记录
  getDepositEntryRecord: depositId => {
    // return axios.post(`${base.hall}api/hall/rest/deposits/${depositId}/payments`)
    return axios.post(`${base.hall}api/hall/rest/deposits/${depositId}/receipts`)
  }

}
export default depositMsg
