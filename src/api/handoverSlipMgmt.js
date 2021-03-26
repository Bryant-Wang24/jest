import base from './base'
import axios from '@/utils/http'
import qs from 'qs'
const handoverSlipMgmt = {
  // 列表
  getDandoverSlipList: params => {
    return axios.post(`${base.hall}api/hall/rest/handover/page`, params)
  },
  // 保存交接单
  save: params => {
    return axios.post(`${base.hall}api/hall/rest/handover`, params)
  },
  // 修改交接单
  edit: params => {
    return axios.put(`${base.hall}api/hall/rest/handover`, params)
  },
  // 根据id获取交接单信息
  getDataFromId: id => {
    return axios.get(`${base.hall}api/hall/rest/handover/${id}`)
  },
  // 根据projectId获取项目信息
  getDataFromProjectId: id => {
    return axios.get(`${base.hall}api/hall/rest/handover/project/${id}`)
  },
  /**
   * 获取场地销售列表，用于新增页面项目名称select
   */
  getMarketList: (params) => {
    return axios.post(`${base.hall}api/hall/rest/sale/page`, params)
  },
  /**
   * 通过
   * id：Number,
   * approvalIdea: String 意见
  */
  pass: params => {
    return axios.post(`${base.hall}api/hall/rest/handover/pass`, qs.stringify(params), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    })
  },
  /**
   * 拒绝
   * id：Number,
   * approvalIdea: String 意见
  */
  reject: params => {
    return axios.post(`${base.hall}api/hall/rest/handover/reject`, qs.stringify(params), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    })
  },
  /**
   * 接收
   * id：Number,
   * coordinator: String 统筹负责人
   * areaChecker: String 面积复核人
  */
  receive: params => {
    return axios.post(`${base.hall}api/hall/rest/handover/receive`, params)
  },
  /**
   * 作废
  */
  cancel: id => {
    return axios.post(`${base.hall}api/hall/rest/handover/cancel/${id}`)
  },
  /**
   * 查询主场用户列表
   */
  getUserList: () => {
    return axios.get(`${base.hall}api/hall/rest/hallUser/userList`)
  }
}

export default handoverSlipMgmt
