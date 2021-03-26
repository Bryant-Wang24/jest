import base from './base'
import axios from '@/utils/http'
// import qs from 'qs'
// import request from '@/utils/request'

const customerMsg = {
  getlist: params => {
    // 剔除商铺客户
    params.excludedCustomerTypes = ['9']
    return axios.post(`${base.hall}api/hall/rest/customer/page`, params)
  },
  deleteCustomer: id => {
    return axios.delete(`${base.hall}api/hall/rest/customer?id=${id}`)
  },
  newSubmit: params => {
    return axios.post(`${base.hall}api/hall/rest/customer/submit`, params)
  },
  getCustomInfoFormId: id => {
    return axios.get(`${base.hall}api/hall/rest/customer?id=${id}`)
  },
  save: (params, keepState) => {
    return axios.post(`${base.hall}api/hall/rest/customer/save?keepState=${keepState}`, params)
  },
  saveDontChangeState: (params, keepState) => {
    return axios.post(`${base.hall}api/hall/rest/customer/save?keepState=${keepState}`, params)
  },
  /**
   * @param {string} id 当前客户表单id
   * @param {string} user 当前审核人id
   * @param {string} reason 拒因
   */
  rejectApplication: params => {
    return axios.post(`${base.hall}api/hall/rest/customer/reject`, params)
  },
  /**
   * @param {string} id 当前客户表单id
   * @param {string} user 当前审核人id
   * @param {string} reason 备注
   */
  passApplication: params => {
    return axios.post(`${base.hall}api/hall/rest/customer/pass`, params)
  },
  checkTaxCode: params => {
    return axios.post(`${base.hall}api/hall/rest/customer/taxCode`, params)
  },
  /**
   * @param {string} id 当前客户表单id
   * @description 获取审核进度
   */
  getApproveInfo: id => {
    return axios.get(`${base.hall}api/hall/rest/customer/approve_progress?id=${id}`)
  },
  /**
   * @param {string} imageId
   */
  deleteImage: id => {
    return axios.delete(`${base.admin}a/api/ossImage/${id}`)
  }
}
export default customerMsg
