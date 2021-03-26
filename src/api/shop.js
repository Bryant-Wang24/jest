import base from './base'
import axios from '@/utils/http'

const shop = {
  // 商铺管理列表接口
  shopList: params => {
    return axios.post(`${base.hall}api/hall/rest/site/shop/page`, params)
  },
  // 商铺详情接口
  shopEdit: params => {
    return axios.get(`${base.hall}api/hall/rest/site/shop/` + params.id, params)
  },
  // 商铺编辑提交
  shopId: params => {
    return axios.put(`${base.hall}api/hall/rest/site/shop`, params)
  },
  // 添加商铺接口
  shopAdd: params => {
    return axios.post(`${base.hall}api/hall/rest/site/shop`, params)
  },
  // 订单 - 付款计划详情分页(商铺收款列表)
  paymentPlansList: params => {
    return axios.post(`${base.hall}api/hall/rest/orders/paymentPlans/page`, params)
  },
  // 付款计划 - 获取付款项的收款记录(收款记录)
  paymentPlansListId: params => {
    // return axios.post(`${base.hall}api/hall/rest/orders/paymentPlanItems/` + params.id + '/logs', params)
    return axios.post(`${base.hall}api/hall/rest/orders/paymentPlanItems/` + params.id + '/payments', params)
  }

}
export default shop
