
const state = {
  filterForm: {} // 存排期视图筛选条件
}

const mutations = {
  SET_FILTER_FORM: (state, form) => {
    state.filterForm = form
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
