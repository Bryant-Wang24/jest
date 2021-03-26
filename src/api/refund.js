import base from './base'
import axios from '@/utils/http'

// vue文件中用this.$api.example.getExample调用

const refund = {
  // 退款申请-收款金额校验接口
  orderState: params => {
    return axios.post(`${base.hall}api/hall/rest/fund/refund/refundapply/orderState`, params)
  },
  // 申请退款
  refundapplyAdd: params => {
    return axios.post(`${base.hall}api/hall/rest/fund/refund/refundapply`, params)
  },
  // /退款修改
  refundapplyEdit: params => {
    return axios.put(`${base.hall}api/hall/rest/fund/refund/refundapply`, params)
  },
  // 查看退款详情
  refundapplyNew: params => {
    return axios.get(`${base.hall}api/hall/rest/fund/refund/refundapply/` + params.id, params)
  },
  // 带参分页查询
  refundapplyPage: params => {
    return axios.post(`${base.hall}api/hall/rest/fund/refund/refundapply/page`, params)
  },
  // 国贸分页查询
  refundapplyPageGM: params => {
    return axios.post(`${base.hall}api/hall/rest/fund/refund/refundapply/gmpage`, params)
  },
  // 物业分页查询
  refundapplyPageWY: params => {
    return axios.post(`${base.hall}api/hall/rest/fund/refund/refundapply/wypage`, params)
  },
  // 退款申请作废
  refundapplyVoid: params => {
    return axios.put(`${base.hall}api/hall/rest/fund/refund/refundapply/cancel/` + params.id, params)
  },
  // 处理退款
  refundapplyRetreat: params => {
    return axios.put(`${base.hall}api/hall/rest/fund/refund/refundapply/refund`, params)
  },

  getlist: params => {
    // 剔除商铺客户
    params.excludedCustomerTypes = ['9']
    return axios.post(`${base.hall}api/hall/rest/customer/page`, params)
  },
  // 通过项目和客户查询押金列表
  depositList: params => {
    return axios.post(`${base.hall}api/hall/rest/deposit/depositList`, params)
  },
  // 呈批件pdf,docx附件下载
  getRefundDocx: params => {
    return axios.get(`${base.hall}api/hall/rest/fund/refund/refundapply/approvalDocument`, { params })
  },
  // downloadInAttachmentWay: params => {
  //   return axios.get(
  //     `${base.hall}api/hall/rest/fund/refund/refundapply/downloadInAttachmentWay?id=` + params.id + '&type=' + params.type + '&account=' + params.account,
  //     params
  //   )
  // },
  projectData: params => {
    return axios.get(`${base.hall}api/hall/rest/sale/list`, params)
  }

}
export default refund
