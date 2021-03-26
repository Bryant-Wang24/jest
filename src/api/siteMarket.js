import base from './base'
import axios from '@/utils/http'
const siteMarketList = {
  // 获取场地销售列表
  getSiteMarket: params => {
    return axios.post(`${base.hall}api/hall/rest/sale/page`, params)
  },
  // 通过id查询产地销售信息
  getSiteMarketID: id => {
    return axios.get(`${base.hall}api/hall/rest/sale?id=${id}`)
  },
  // 通过id编辑场地销售信息
  editSiteMarketID: params => {
    return axios.put(`${base.hall}api/hall/rest/sale`, params)
  },
  // 查询场地
  querySite: types => {
    return axios.get(`${base.hall}api/hall/rest/SchdulingView/siteMessage?types=${types}`)
  },
  // 项目同步 - 获取同步信息
  getSyncList: (projectId) => {
    return axios.get(`${base.hall}api/hall/rest/projectsync/info/${projectId}`)
  },
  // 项目同步 - 同步
  syncProject: (params) => {
    return axios.post(`${base.hall}api/hall/rest/projectsync/sync`, {}, { params })
  }

}
export default siteMarketList
