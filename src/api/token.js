import base from './base'
import axios from '@/utils/http'
// import qs from 'qs'

const token = {
  createToken: () => {
    return axios.post(`${base.hall}api/hall/rest/taskBook/password`)
  },
  // 获取口令
  getToken: () => {
    return axios.get(`${base.hall}api/hall/rest/taskBook/password`)
  }
}
export default token

