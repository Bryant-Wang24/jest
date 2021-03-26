import dictApi from '@/api/dict'
const state = {
  refundTokenRoles: []
}

const mutations = {
  SEET_REFUND_TOKEN: (state, refundTokenRoles) => {
    state.refundTokenRoles = refundTokenRoles
  }
}

const actions = {
  getRefundToken({ commit }) {
    return new Promise((resolve, reject) => {
      dictApi.getDictList('REFUND_TOKEN_ROLES').then(res => {
        commit('SEET_REFUND_TOKEN', res)
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
