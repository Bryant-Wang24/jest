
import billApi from '@/api/bill'
const state = {
  projectOptions: [],
  customerOptions: [],
  companyList: []
}

const mutations = {
  SET_PROJECT_OPTIONS: (state, projectOptions) => {
    state.projectOptions = projectOptions
  },
  SET_CUSTOMER_OPTIONS: (state, customerOptions) => {
    state.customerOptions = customerOptions
  },
  SET_COMPANY_LIST: (state, companyList) => {
    state.companyList = companyList
  }
}

const actions = {
  getProjectOptions({ commit, state }) {
    return new Promise((resolve, reject) => {
      const { projectOptions } = state
      if (projectOptions.length) {
        resolve(projectOptions)
        return
      }

      const params = {}
      billApi.getProjectName(JSON.stringify(params)).then((res) => {
        commit('SET_PROJECT_OPTIONS', res || [])
        resolve(res)
      }).catch(e => { reject(e) })
    })
  },
  getCustomerOptions({ commit, state }, _state = 'APPROVED') {
    return new Promise((resolve, reject) => {
      const { customerOptions } = state
      if (customerOptions.length) {
        resolve(customerOptions)
        return
      }

      const params = {
        customerSimple: { customerRequest: { state: _state }}
      }
      billApi.getCustomerList(JSON.stringify(params)).then((res) => {
        commit('SET_CUSTOMER_OPTIONS', res || [])
        resolve(res)
      }).catch(e => { reject(e) })
    })
  },
  getCompanyList({ commit, state }) {
    return new Promise((resolve, reject) => {
      const { companyList } = state
      if (companyList.length) {
        resolve(companyList)
        return
      }

      billApi.getCompanyList().then((res) => {
        commit('SET_COMPANY_LIST', res || [])
        resolve(res)
      }).catch(e => { reject(e) })
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
