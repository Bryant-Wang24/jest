import base from './base'
import axios from '@/utils/http'
// import qs from 'qs'

const sale = {
  // 订单 - 创建
  ordersAdd: params => {
    return axios.post(`${base.hall}api/hall/rest/orders`, params)
  },
  // 订单 - 通过ID获取（明细）
  orderItem: params => {
    return axios.post(`${base.hall}api/hall/rest/orders/` + params.id)
  },
  // 订单 - 分页查询
  orderList: params => {
    return axios.post(`${base.hall}api/hall/rest/orders/page`, params)
  },
  // 订单-更新
  ordersEdit: params => {
    return axios.put(`${base.hall}api/hall/rest/orders/` + params.id, params.json)
  },
  // 订单-删除
  ordersDelete: params => {
    return axios.delete(`${base.hall}api/hall/rest/orders/` + params.id, params)
  }

}
export default sale
