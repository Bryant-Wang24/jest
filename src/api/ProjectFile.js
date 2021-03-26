import base from './base'
import axios from '@/utils/http'
import _axios from 'axios'
import { download } from '@/utils/common'
const ProjectFile = {
  // 页面查询
  getProjectFiles: params => {
    return axios.post(`${base.hall}api/hall/rest/project/file/page`, params)
  },
  // 项目上传
  uploadFile: params => {
    return axios.post(`${base.hall}api/hall/rest/project/file/upload`, params)
  },
  // 类别配置
  getTypeMenus: params => {
    return axios.get(`${base.hall}api/hall/rest/project/file/moduleAndTypeInModuleConfigs`, params)
  },
  // 下载
  download: id => {
    _axios.get(`${base.hall}api/hall/rest/project/file/download/${id}`, { responseType: 'blob' }).then(res => {
      download(res)
    })
  },
  // 更新
  update: params => {
    return axios.put(`${base.hall}api/hall/rest/project/file/update`, params)
  },
  // 删除
  deleteFile: params => {
    return axios.put(`${base.hall}api/hall/rest/project/file/delete`, params)
  }

}
export default ProjectFile
