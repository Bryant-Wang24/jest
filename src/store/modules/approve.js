import approveApi from '@/api/approve'
const state = {
  conditionOption: [],
  userlist: [], // 用户列表
  branchIds: {},
  fields: {}, // 字段,包括逻辑关系，可选值
  offices: {}, // 用户树数据
  userTree: {
    organization: [],
    role: []
  }, // 用户树数据
  prioritys: 1 // 优先级options
}

const mutations = {
  SET_CONDITION_OPTION: (state, option) => {
    state.conditionOption = option
  },
  SET_BRANCH_IDS: (state, branchIds) => {
    state.branchIds = branchIds
  },
  SET_APPROVE: (state, { key, value }) => {
    state[key] = value
  },
  SET_ORGANIZATION: (state, organization) => {
    state.userTree.organization = organization
  },
  SET_ROLE: (state, role) => {
    state.userTree.role = role
  }
}

const actions = {
  getUserList({ commit }) {
    approveApi.getUserList().then(res => {
      commit('SET_APPROVE', { key: 'userlist', value: res })
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
