import base from './base'
import axios from '@/utils/http'
const siteList = {
  // 获取场地列表
  getSite: params => {
    return axios.post(`${base.hall}api/hall/rest/site/page`, params)
  },
  // 添加场地
  addSite: params => {
    return axios.post(`${base.hall}api/hall/rest/site`, params)
  },
  // 编辑场地
  editSite: params => {
    return axios.put(`${base.hall}api/hall/rest/site?id=` + params.id, params)
  },
  // 删除场地
  deleteSite: id => {
    return axios.delete(`${base.hall}api/hall/rest/site?id=${id}`)
  },
  // 查看场地
  ckSite: id => {
    return axios.get(`${base.hall}api/hall/rest/site?id=${id}`)
  },
  // 导入场地数据
  toSite: params => {
    return axios.post(`${base.hall}api/hall/rest/site/import`, params)
  },
  // 下载导入模板
  templateSite: params => {
    return axios.get(`${base.hall}api/hall/rest/site/template`, params)
  },
  // 获取图片ID
  tupianID: imageId => {
    return axios.get(`${base.hall}a/api/ossImage/getImageInfo?imageId=${imageId}`)
  }
}
export default siteList
