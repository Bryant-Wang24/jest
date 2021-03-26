import base from './base'
import axios from '@/utils/http'
import qs from 'qs'
const siteReserveList = {
  // 获取场地预定列表
  getSiteRes: params => {
    return axios.post(`${base.hall}api/hall/rest/reserve/page`, params)
  },
  // 删除
  deleteSiteRes: id => {
    return axios.delete(`${base.hall}api/hall/rest/reserve?id=${id}`)
  },
  // 查询场地
  querySite: types => {
    return axios.get(`${base.hall}api/hall/rest/SchdulingView/siteMessage?types=${types}`)
  },
  // 获取承办、主办
  getUnit: params => {
    // 剔除商铺客户
    params.excludedCustomerTypes = ['9']
    return axios.post(`${base.hall}api/hall/rest/customer/page`, params)
  },
  // 保存预定
  saveSiteRes: params => {
    return axios.post(`${base.hall}api/hall/rest/reserve/save`, params)
  },
  // 通过审核
  auditPass: params => {
    return axios.post(`${base.hall}api/hall/rest/reserve/pass`, qs.stringify(params), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    })
  },
  // 拒绝审核
  auditReject: params => {
    return axios.post(`${base.hall}api/hall/rest/reserve/reject`, qs.stringify(params), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    })
  },
  // 查看档期冲突
  lookConflict: params => {
    return axios.post(`${base.hall}api/hall/rest/reserve/conflict`, params)
  },
  // 编辑场地预定申请
  compileSitRes: params => {
    return axios.put(`${base.hall}api/hall/rest/reserve`, params)
  },
  // 提交审核
  submit: params => {
    return axios.post(`${base.hall}api/hall/rest/reserve/submit`, params)
  },
  // 编辑提交审核
  BJsubmit: params => {
    return axios.post(`${base.hall}api/hall/rest/reserve/editSubmit`, params)
  },
  // 根据id查询场地预定信息
  getSiteReserveID: id => {
    return axios.get(`${base.hall}api/hall/rest/reserve?id=${id}`)
  },
  // 获取审核进度
  getApproveInfo: id => {
    return axios.get(`${base.hall}api/hall/rest/customer/approve_progress?id=${id}`)
  },
  // 获取审核进度
  batchPass: params => {
    return axios.post(`${base.hall}api/hall/rest/reserve/batchPass?ids=` + params.ids)
  },
  // 撤销档期
  cancel: params => {
    return axios.post(`${base.hall}api/hall/rest/reserve/cancel`, qs.stringify(params), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    })
  },
  // 场地销售列表
  pageNation: params => {
    return axios.post(`${base.hall}api/hall/rest/sale/page`, params)
  },
  // 设置项目是否公开
  isPublicExternal: params => {
    return axios.put(`${base.hall}api/hall/rest/sale/isPublic`, params)
  },
  // 通过id查询场地销售信息
  salesInformation: id => {
    return axios.get(`${base.hall}api/hall/rest/sale?id=${id}`)
  },
  // 更新项目额外信息
  updateProject: params => {
    return axios.put(`${base.hall}api/hall/rest/sale/extraInfo`, params)
  }
}

export default siteReserveList
