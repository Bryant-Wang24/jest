
import dictApi from '@/api/dict'
const state = {
  receType: [] // 台账收款方式
}

const mutations = {
  SET_RECE_TYPE: (state, receType) => {
    state.receType = receType
  }
}

const actions = {
  getReceType({ commit, state }) {
    return new Promise((resolve, reject) => {
      dictApi.getDictList('ACCOUNT_PAYMENT_METHOD').then(res => {
        const { receType } = state
        if (receType.length) {
          resolve(receType)
          return
        }
        commit('SET_RECE_TYPE', res || [])
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
