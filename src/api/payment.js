import base from './base'
import axios from '@/utils/http'

// vue文件中用this.$api.example.getExample调用

const payment = {
  // 商铺付款通知书-展示账期接口
  paymentnotice: params => {
    return axios.get(`${base.hall}api/hall/rest/payment/paymentnotice/paymentPeriod`, params)
  },
  // 商铺付款计划项列表接口
  paymentPeriod: params => {
    return axios.get(`${base.hall}api/hall/rest/payment/paymentnotice/` + params.id, params)
  },
  // 新增商铺付款通知书接口
  paymentAdd: params => {
    return axios.post(`${base.hall}api/hall/rest/payment/paymentnotice`, params)
  },
  // 商铺付款通知书查询接口
  paymentList: params => {
    return axios.post(`${base.hall}api/hall/rest/payment/paymentnotice/page`, params)
  },
  // 商铺付款通知书删除接口
  paymentDelete: params => {
    return axios.delete(`${base.hall}api/hall/rest/payment/paymentnotice/delete/` + params.id, params)
  },
  // 商铺付款通知书查看详情接口
  paymentId: params => {
    return axios.get(`${base.hall}api/hall/rest/payment/paymentnotice/get/` + params.id, params)
  },
  // 付款通知书pdf预览接口/DOCX下载接口
  downloadInAttachmentWay: params => {
    return axios.get(
      `${base.hall}api/hall/rest/payment/paymentnotice/downloadInAttachmentWay?id=` + params.id + '&type=' + params.type,
      params
    )
  },
  // 付款通知书批量导出
  downloadInStreamWay: params => {
    return axios.get(`${base.hall}api/hall/rest/payment/paymentnotice/downloadInStreamWay?ids=` + params.ids, params)
  }

}
export default payment
