import base from './base'
import axios from '@/utils/http'
// import qs from 'qs'
// import request from '@/utils/request'

const dict = {
  /**
   * @param {string} value 字典value（必选）
   * @param {string} type 字典type（必选）
   * @param {string} defaultContent 如果未找到的默认返回值
   * @description 获取label
   */
  getLabel: params => {
    return axios.post(`${base.hall}a/api/sys/rest/dict/label`, params)
  },
  /**
   * @param {string} label 字典label（必选）
   * @param {string} type 字典type（必选）
   * @param {string} defaultContent 如果未找到的默认返回值
   * @description 获取value
   */
  getValue: params => {
    return axios.post(`${base.hall}a/api/sys/rest/dict/value`, params)
  },
  /**
   * @param {string} value 字典value（必选）
   * @param {string} type 字典type（必选）
   * @param {string} defaultContent 如果未找到的默认返回值
   * @description 批量获取label
   */
  getLabels: params => {
    return axios.post(`${base.hall}a/api/sys/rest/dict/value`, params)
  },
  /**
   * @param {string} type 字典type（必选）
   * @description 字典 - 根据type获取字典列表
   */
  getDictList: type => {
    return axios.get(`${base.hall}a/api/sys/rest/dict/dictList/${type}`)
  }
}
export default dict
