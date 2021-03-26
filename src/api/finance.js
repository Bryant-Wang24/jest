import base from './base'
import axios from '@/utils/http'
// import qs from 'qs'

const finance = {
  // 合同 - 获取合同编号前缀列表
  getFinance: params => {
    return axios.get(`${base.hall}api/hall/rest/dataSummary/finance`, { params })
  }
}
export default finance
