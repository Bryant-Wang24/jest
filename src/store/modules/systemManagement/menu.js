const state = {
  menuList: []
}

const mutations = {
  setMenuList(state, list) {
    if (list && list.length > 0) {
      state.menuList = list
    }
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

