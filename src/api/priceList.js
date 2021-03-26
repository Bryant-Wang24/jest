import base from './base'
import axios from '@/utils/http'
import qs from 'qs'

// vue文件中用this.$api.example.getExample调用

const priceList = {
  // 价目表 - 分页查询
  dictList: params => {
    return axios.get(`${base.hall}api/sys/rest/dict/dictList/` + params.type, params)
    // return axios.post(`${base}api/hall/rest/priceList/page`, params)
  },
  // 价目表 - 分页查询
  priceData: params => {
    return axios.post(`${base.hall}api/hall/rest/priceList/page`, params)
    // return axios.post(`${base}api/hall/rest/priceList/page`, params)
  },
  // 价目表 - 添加
  priceAdd: params => {
    return axios.post(`${base.hall}api/hall/rest/priceList`, params)
  },
  // 价目表 - 修改
  // priceEdit: params => {
  //   return axios.put(`${base}api/hall/rest/priceList/` + params.id, qs.stringify(params),{
  //     headers: {
  //       'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
  //     }
  //   })
  // },
  priceEdit: params => {
    return axios.put(`${base.hall}api/hall/rest/priceList/` + params.id, params)
  },
  // 价目表 - 通过ID获取
  priceId: params => {
    return axios.get(`${base.hall}api/hall/rest/priceList/` + params.id, params)
  },
  // 价目表 - 通过编号获取
  priceCode: params => {
    return axios.get(`${base.hall}api/hall/rest/priceList`, params)
  },
  // 价目表 - 删除
  priceDelete: params => {
    return axios.delete(`${base.hall}api/hall/rest/priceList/` + params.id)
  },
  // 价目项 - 添加
  priceListItemAdd: params => {
    return axios.post(`${base.hall}api/hall/rest/priceListItem`, params)
  },
  // 价目项 - 修改
  priceListItemEdit: params => {
    return axios.put(`${base.hall}api/hall/rest/priceListItem/` + params.id, params)
  },
  // 价目项 - 通过ID获取
  priceListItemId: params => {
    return axios.get(`${base.hall}api/hall/rest/priceListItem/` + params.id, params)
  },
  // 价目项 - 分页查询
  priceListItem: params => {
    return axios.post(`${base.hall}api/hall/rest/priceListItem/page`, params)
  },
  // 价目项 - 删除
  priceListItemDelete: params => {
    return axios.delete(`${base.hall}api/hall/rest/priceListItem/` + params.id, params)
  },
  // 价目项 - 批量删除
  priceListItemsDelete: params => {
    return axios.delete(`${base.hall}api/hall/rest/priceListItem?` + params.id, params)
  },
  // 根据编号查询账户信息
  accountList: params => {
    return axios.post(`${base.hall}api/hall/rest/account/numberList`, qs.stringify(params), { headers: {
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
    }})
  }
}
export default priceList
