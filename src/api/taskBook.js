import base from './base'
import axios from '@/utils/http'
const taskBookList = {
  // 任务书列表
  get_taskBookList: params => {
    return axios.post(`${base.hall}api/hall/rest/taskBook/page`, params)
  },
  // 获取任务环节列表
  get_taskLinkList: params => {
    return axios.post(`${base.hall}api/hall/rest/taskLink/page`, params)
  },
  // 新增任务书
  add_taskBook: params => {
    return axios.post(`${base.hall}api/hall/rest/taskBook`, params)
  },
  // id获取任务详情
  get_taskParticularsID: id => {
    return axios.get(`${base.hall}api/hall/rest/taskBook/${id}`)
  },
  // 添加环节
  addParticulars: params => {
    return axios.post(`${base.hall}api/hall/rest/taskLink`, params)
  },
  // 编辑环节
  compileParticulars: (id, params) => {
    return axios.put(`${base.hall}api/hall/rest/taskLink/${id}`, params)
  },
  // 删除环节
  deleteParticulars: id => {
    return axios.delete(`${base.hall}api/hall/rest/taskLink/${id}`)
  },
  // 获取环节部门列表
  get_departmentList: () => {
    return axios.get(`${base.hall}api/hall/rest/taskLinkDetail/getDepartmentList`)
  },
  // 获取环节明细列表
  ParticularsList: params => {
    return axios.post(`${base.hall}api/hall/rest/taskLinkDetail/page`, params)
  },
  // 添加环节明细
  add_Particulars: params => {
    return axios.post(`${base.hall}api/hall/rest/taskLinkDetail`, params)
  },
  // 编辑环节明细
  compile_Particulars: (id, params) => {
    return axios.put(`${base.hall}api/hall/rest/taskLinkDetail/${id}`, params)
  },
  // 删除环节
  delete_Particulars: id => {
    return axios.delete(`${base.hall}api/hall/rest/taskLinkDetail/${id}`)
  },
  // 批量保存环节
  batch_Particulars: params => {
    return axios.post(`${base.hall}api/hall/rest/taskLinkDetail/save`, params)
  },
  // 获取任务包列表接口
  get_taskBagList: () => {
    return axios.get(`${base.hall}api/hall/rest/taskPackage/getPackageList`)
  },
  // 分页条件查询任务包明细
  pageTaskBag_Particulars: params => {
    return axios.post(`${base.hall}api/hall/rest/taskPackageDetail/page`, params)
  },
  // 获取复制任务环节列表
  get_copyList: params => {
    return axios.post(`${base.hall}api/hall/rest/taskLink/getLinkList`, params)
  },
  // 编辑生成任务书
  compileTaskBook: taskBookId => {
    // return axios.put(`${base.hall}api/hall/rest/taskBook/${id}`, params) // 此接口废除
    return axios.post(`${base.hall}api/hall/rest/taskBook/${taskBookId}/docx`)
  },
  // 获取任务书文件
  getTaskBookFile: taskBookId => {
    // return axios.get(`${base.hall}api/hall/rest/taskBook/getTaskBookPDF/` + params.id, params) // 此接口废除
    return axios.get(`${base.hall}api/hall/rest/taskBook/${taskBookId}/docx`)
  },
  // 下发任务书
  issue_taskBook: params => {
    // return axios.post(`${base.hall}api/hall/rest/taskBook/taskExecution/${id}`)
    return axios.post(`${base.hall}api/hall/rest/taskBook/taskExecution`, params)
  },
  // 任务跟踪
  task_UP: id => {
    return axios.get(`${base.hall}api/hall/rest/taskBook/getTaskTracking/${id}`)
  },
  // 下载任务书接口
  xz_taskBook: id => {
    return axios.get(`${base.hall}a/api/ossfile/downloadByFileId?fileId=${id}`)
  }
}
export default taskBookList
