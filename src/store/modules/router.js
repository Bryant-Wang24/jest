
const state = {
  to: {},
  from: {}
}

const mutations = {
  SET_TO: (state, to) => {
    state.to = to
  },
  SET_FROM: (state, from) => {
    state.from = from
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
