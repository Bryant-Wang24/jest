
const state = {
  list: [], // 预览图片list
  options: {}
}

const mutations = {
  SET_LIST: (state, { urls, options }) => {
    state.list = urls
    state.options = options
  }
}

const actions = {
  setlist({ commit }, { urls, options }) {
    commit('SET_LIST', { urls, options })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

