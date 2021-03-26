import base from './base'
import axios from '@/utils/http'
// import qs from 'qs'

// base.hall = '/dev-api/vue-element-admin/'

const schedule = {
  /**
     * @param {string} type 场地类型，0:展馆/1:会议室/2:广告位 {type: 0}
     */
  getSiteList: params => {
    return axios.get(`${base.hall}api/hall/rest/SchdulingView/siteMessage`, {
      params: params
    })
  },
  /**
   * @param {string} type 场地类型，0:展馆/1:会议室/2:广告位 {type: 0}
   * @param {string} siteId 场地id
   */
  getYearsFromType: params => {
    return axios.get(`${base.hall}api/hall/rest/SchdulingView/getYear`, {
      params: params
    })
  },
  /**
   * @description 获取排期视图数据
   */
  getScheduleView: params => {
    return axios.post(`${base.hall}api/hall/rest/SchdulingView/list`, params)
  },
  /**
   * @param {string} id 场地id
   * @desciption 获取场地详情
   */
  getSiteInfoFormId: id => {
    return axios.get(`${base.hall}api/hall/rest/SchdulingView/${id}`)
    // return axios.get(`${base.hall}api/hall/rest/SchdulingView`, {
    //   params: { id }
    // })
  },
  /**
   * @description 新增场地
   */
  addSite: params => {
    return axios.post(`${base.hall}api/hall/rest/reserve/save`, params)
  }
}
export default schedule
