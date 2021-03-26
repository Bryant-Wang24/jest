
const state = {
  siteList: [],
  handoverList: [] // 所有交接单list
}

const mutations = {
  SET_SITE_LIST: (state, list) => {
    state.siteList = list
  },
  SET_HANDOVER_LIST: (state, ids) => {
    state.handoverList = ids
  }
}

const actions = {
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

