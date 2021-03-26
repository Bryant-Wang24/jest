import base from './base'
import axios from '@/utils/http'
const flihtdeckApi = {
  // 总展会数
  // http://192.168.1.23:8080/api/hall/rest/cockpit/project/annualChainRatio?year=2020&typesIncluded=MEETING,FEAST,BANQUET,CONFERENCR
  chainRatio: params => {
    return axios.get(`${base.hall}api/hall/rest/dataSummary/project/annualChainRatio?year=${params.year}&typesIncluded=${params.typesIncluded}`)
  },
  // 展会面积占比
  areaDistribution: params => {
    return axios.get(`${base.hall}api/hall/rest/dataSummary/project/areaDistribution?year=${params.year}&typesIncluded=${params.typesIncluded}`)
  },
  // 展会数与月度出租率
  projectNumAndOccupancy: params => {
    return axios.get(`${base.hall}api/hall/rest/dataSummary/project/projectNumAndOccupancy?year=${params.year}&timeUnit=${params.timeUnit}&typesIncluded=${params.typesIncluded}`)
  },
  // 展会排期表
  schedule: params => {
    return axios.get(`${base.hall}api/hall/rest/dataSummary/project/schedule?year=${params.year}&typesIncluded=${params.typesIncluded}`)
  },
  //  各展馆出租率
  siteOccupancy: params => {
    return axios.get(`${base.hall}api/hall/rest/dataSummary/project/siteOccupancy`, {
      params: {
        ...params,
        typesIncluded: params.typesIncluded?.join(',')
      }
    })
  }
  // //   各会议厅出租率
  // meeting: params => {
  //   return axios.post('http://rap2api.taobao.org/app/mock/data/1851711', params)
  // }
}
export default flihtdeckApi
