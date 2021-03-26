const state = {
  // 是否需要刷新数据
  isNeedRefresh: false
}

const mutations = {
  toggleRefreshStatus(state, status = false) {
    state.isNeedRefresh = status
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
