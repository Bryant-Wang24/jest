import base from './base'
import axios from '@/utils/http'
const taskBagList = {
  // 获取任务包列表
  getTaskBag: params => {
    return axios.post(`${base.hall}api/hall/rest/taskPackage/page`, params)
  },
  // 获取部门
  getDepartment() {
    return axios.get(`${base.hall}api/hall/rest/taskPackageDetail/getDepartmentList`)
  },
  // 添加任务包
  addTaskBag: params => {
    return axios.post(`${base.hall}api/hall/rest/taskPackage`, params)
  },
  // 编辑任务包
  compileTaskBag: (id, params) => {
    return axios.put(`${base.hall}api/hall/rest/taskPackage/${id}`, params)
  },
  // 删除任务包
  deletetaskBag: id => {
    return axios.delete(`${base.hall}api/hall/rest/taskPackage/${id}`)
  },
  // 查询任务明细
  queryTaskDetail: params => {
    return axios.post(`${base.hall}api/hall/rest/taskPackageDetail/page`, params)
  },
  // 添加任务包明细
  addTaskBagDetail: params => {
    return axios.post(`${base.hall}api/hall/rest/taskPackageDetail`, params)
  },
  // 编辑任务包明细
  compileDetail: (id, params) => {
    return axios.put(`${base.hall}api/hall/rest/taskPackageDetail/${id}`, params)
  },
  // 删除任务包明细
  deleteTaskBagDetail: id => {
    return axios.delete(`${base.hall}api/hall/rest/taskPackageDetail/${id}`)
  },
  // 批量保存接口
  batchDeleteAPI: parmas => {
    return axios.post(`${base.hall}api/hall/rest/taskPackageDetail/batchOperation`, parmas)
  }
}
export default taskBagList
