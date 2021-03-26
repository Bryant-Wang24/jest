import base from './base'
import axios from '@/utils/http'
// import qs from 'qs'
// import store from '@/store/index'

const baseConfig = {
  hallPage: data => {
    return axios.post(`${base.hall}a/api/gallery/page`, data)
  },
  getHallList: () => {
    return axios.get(`${base.hall}a/api/gallery/gallerys`)
  },
  hallConfigList: data => {
    return axios.post(`${base.hall}a/api/gallery/hall/page`, data)
  },
  getHallExampleImg: () => {
    return axios.get(`${base.hall}a/api/gallery/attachment/example/picture`)
  },
  getHallImg: imageId => {
    return axios.get(`${base.hall}a/image/local/download/image?imageId=${imageId}`)
  },
  hallInfo: id => {
    return axios.get(`${base.hall}a/api/gallery/${id}`)
  },
  // 展厅
  addHallInConfig: data => {
    return axios.post(`${base.hall}a/api/gallery/hall`, data)
  },
  // 展厅
  deleteHallInConfig: id => {
    return axios.delete(`${base.hall}a/api/gallery/hall/${id}`)
  },
  // 展馆
  creatHall: data => {
    return axios.post(`${base.hall}a/api/gallery`, data)
  },
  updateHall: (data, id) => {
    return axios.put(`${base.hall}a/api/gallery/${id}`, data)
  },
  deleteHall: id => {
    return axios.delete(`${base.hall}a/api/gallery/${id}`)
  },
  getHallImgs: id => {
    return axios.get(`${base.hall}a/api/image/list?dataId=${id}&type=EXHALL_PIC`)
  }

}
export default baseConfig
