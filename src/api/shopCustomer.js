import base from './base'
import axios from '@/utils/http'

const shopCustomer = {
  // 查询商铺客户列表
  shopCustomer: params => {
    return axios.post(`${base.hall}api/hall/rest/shopCustomer/page`, params)
  },
  // 编辑商铺客户信息
  shopCustomerEdit: params => {
    return axios.put(`${base.hall}api/hall/rest/shopCustomer`, params)
  },
  // 保存商铺客户信息(新增)
  shopCustomerAdd: params => {
    return axios.post(`${base.hall}api/hall/rest/shopCustomer`, params)
  },
  // 根据id查询商铺客户信息
  shopCustomerId: params => {
    return axios.get(`${base.hall}api/hall/rest/shopCustomer/` + params.id, params)
  }

}
export default shopCustomer
