
import dictApi from '@/api/dict'
const state = {
  taxcode: '',
  industry: [], // 客户行业
  CUSTOMER_TYPE_ARRAY: [],
  CUSTOMER_TYPE: [], // 当前用户可用的客户类型
  CUSTOMER_STAR: [], // 客户星级
  COMPANY_SCALE: [], // 客户公司规模
  CUSTOMER_ACTIVE_STATE: [] // 客户活跃状态
}

const mutations = {
  SET_TAXCODE: (state, taxcode) => {
    state.taxcode = taxcode
  },
  SET_INDUSTRY: (state, industry) => {
    state.industry = industry
  },
  CUSTOMER_TYPE_ARRAY: (state, CUSTOMER_TYPE_ARRAY) => {
    state.CUSTOMER_TYPE_ARRAY = CUSTOMER_TYPE_ARRAY
  },
  CUSTOMER_TYPE: (state, CUSTOMER_TYPE) => {
    state.CUSTOMER_TYPE = CUSTOMER_TYPE
  },
  CUSTOMER_STAR: (state, CUSTOMER_STAR) => {
    state.CUSTOMER_STAR = CUSTOMER_STAR
  },
  COMPANY_SCALE: (state, COMPANY_SCALE) => {
    state.COMPANY_SCALE = COMPANY_SCALE
  },
  CUSTOMER_ACTIVE_STATE: (state, CUSTOMER_ACTIVE_STATE) => {
    state.CUSTOMER_ACTIVE_STATE = CUSTOMER_ACTIVE_STATE
  }
}

const actions = {
  getIndustry({ commit }) {
    return new Promise((resolve, reject) => {
      dictApi.getDictList('HALL_CUSTOMER_INDUSTRY').then(res => {
        commit('SET_INDUSTRY', res ? res.reverse() : [])
        resolve(res)
      }).catch(e => {
        reject(e)
      })
    })
  },
  getCustomerTypeArray({ commit }) {
    return new Promise((resolve, reject) => {
      dictApi.getDictList('HALL_CUSTOMER_TYPE').then(res => {
        commit('CUSTOMER_TYPE_ARRAY', res ? res.reverse() : [])
        resolve(res)
      }).catch(e => {
        reject(e)
      })
    })
  },
  getCustomerTypeByCode({ commit, rootState }) {
    const { user } = rootState
    const code = user?.user?.office?.code
    return new Promise((resolve, reject) => {
      dictApi.getDictList(code).then(res => {
        commit('CUSTOMER_TYPE', res[0]?.value?.split('-') || [])
        resolve(res)
      }).catch(e => {
        reject(e)
      })
    })
  },
  getCustomerStar({ commit }) {
    return new Promise((resolve, reject) => {
      dictApi.getDictList('HALL_CUSTOMER_STAR').then(res => {
        commit('CUSTOMER_STAR', res)
        resolve(res)
      }).catch(e => {
        reject(e)
      })
    })
  },
  getCustomerScale({ commit }) {
    return new Promise((resolve, reject) => {
      dictApi.getDictList('HALL_COMPANY_SCALE').then(res => {
        commit('COMPANY_SCALE', res)
        resolve(res)
      }).catch(e => {
        reject(e)
      })
    })
  },
  getCustomerActiveState({ commit }) {
    return new Promise((resolve, reject) => {
      dictApi.getDictList('HALL_CUSTOMER_ACTIVE_STATE').then(res => {
        commit('CUSTOMER_ACTIVE_STATE', res)
        resolve(res)
      }).catch(e => {
        reject(e)
      })
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
