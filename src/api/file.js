import base from './base'
import axios from '@/utils/http'
// import qs from 'qs'

const file = {
  uploadFileApi: `a/api/ossfile/upload`,
  deleteFileApi: `a/api/ossfile/`,
  deleteFile: fileId => {
    return axios.delete(`${base.hall}a/api/ossfile/${fileId}`)
  },
  // 文件预览
  filePreview: url => {
    return `${base.hall}preview/onlinePreview?url=${url}`
  }
}
export default file
