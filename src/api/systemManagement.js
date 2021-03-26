import base from './base'
import axios from '@/utils/http'
// import qs from 'qs'
import store from '@/store/index'

const systemManagement = {
  creatUser: data => {
    return axios.post(`${base.hall}a/api/user/save`, data)
  },
  creatRole: data => {
    return axios.post(`${base.hall}a/api/role/add`, data)
  },
  creatSysConfig: data => {
    return axios.post(`${base.hall}a/api/config/save`, data)
  },
  creatDictionary: data => {
    return axios.post(`${base.hall}a/api/sys/rest/dict`, data)
  },
  creatOffice: data => {
    return axios.post(`${base.hall}a/api/office`, data)
  },
  dictionaryPage: data => {
    return axios.post(`${base.hall}a/api/sys/rest/dict/page`, data)
  },
  dictionaryTypeList: () => {
    return axios.get(`${base.hall}a/api/sys/rest/dict/types`)
  },
  dictionaryInfo: id => {
    return axios.get(`${base.hall}a/api/sys/rest/dict/${id}`)
  },
  deleteRole: id => {
    return axios.delete(`${base.hall}a/api/role/${id}`)
  },
  deleteSysConfig: id => {
    return axios.delete(`${base.hall}a/api/config/${id}`)
  },
  deleteDictionary: id => {
    return axios.delete(`${base.hall}a/api/dict/${id}`)
  },
  deleteOffice: id => {
    return axios.delete(`${base.hall}a/api/office/${id}`)
  },
  deleteUser: id => {
    return axios.delete(`${base.hall}a/api/user/${id}`)
  },
  exhibitionList: (userId = store.state.user.user.id) => {
    return axios.get(`${base.hall}a/api/expo/enable/exhibitions/openTime/sort?userId=${userId}`)
  },
  userTreeData: () => {
    return axios.get(`${base.hall}a/api/office/offices`)
  },
  menuListByUserId: (userId = store.state.user.user.id) => {
    return axios.get(`${base.hall}a/api/menu/${userId}`)
  },
  officeTreeData: () => {
    return axios.get(`${base.hall}a/api/office/offices`)
  },
  officePage: data => {
    return axios.post(`${base.hall}a/api/office/page`, data)
  },
  officeInfo: id => {
    return axios.get(`${base.hall}a/api/office/${id}`)
  },
  roleInfo: id => {
    return axios.get(`${base.hall}a/api/role/${id}`)
  },
  getRoleByUserId: (userId = store.state.user.user.id) => {
    return axios.get(`${base.hall}a/api/role/${userId}/authorization/roles`)
  },
  updateUser: data => {
    return axios.post(`${base.hall}a/api/user/save`, data)
  },
  updateRole: (data, id) => {
    return axios.put(`${base.hall}a/api/role/${id}`, data)
  },
  updateSysConfig: (data, id) => {
    return axios.put(`${base.hall}a/api/config/${id}`, data)
  },
  updateDictionary: (data, id) => {
    return axios.put(`${base.hall}a/api/sys/rest/dict/${id}`, data)
  },
  updateOffice: (data, id) => {
    return axios.put(`${base.hall}a/api/office/${id}`, data)
  },
  userPage: data => {
    return axios.post(`${base.hall}a/api/user/page`, data)
  },
  userInfo: id => {
    return axios.get(`${base.hall}a/api/user/${id}`)
  },
  rolePage: data => {
    return axios.post(`${base.hall}a/api/role/page`, data)
  },
  sysConfigPage: data => {
    return axios.post(`${base.hall}a/api/config/page`, data)
  },
  sysConfigList: () => {
    return axios.get(`${base.hall}a/api/config/listData`)
  },
  sysConfigInfo: id => {
    return axios.get(`${base.hall}a/api/config/${id}`)
  }

}
export default systemManagement
