import base from './base'
import axios from '@/utils/http'

// vue文件中用this.$api.example.getExample调用

const example = {
  getExample: params => {
    return axios.post(`${base}xxx/xxx/xxx`, params)
  }
}
export default example
