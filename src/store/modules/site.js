
import dictApi from '@/api/dict'

const state = {
  SITE_RESERVATION_PROJECT_TYPE: [], // 场地预定项目类型-字典数据
  RESERVATION_TYPE_VALUE: {}, // 根据SITE_RESERVATION_PROJECT_TYPE转换的 { key: key }
  RESERVATION_TYPE_VALUE_ZH: {}, // 根据SITE_RESERVATION_PROJECT_TYPE转换的 { key: label }
  RESERVATION_TYPE_VALUE_NATURE: {}, // 根据SITE_RESERVATION_PROJECT_TYPE转换 {key: type} 性质
  allTypes: [],
  currentUserCodeTypes: []
}

const mutations = {
  SITE_RESERVATION_PROJECT_TYPE: (state, SITE_RESERVATION_PROJECT_TYPE) => {
    state.SITE_RESERVATION_PROJECT_TYPE = SITE_RESERVATION_PROJECT_TYPE
  },
  SET_RESERVATION_TYPE: (state, SITE_RESERVATION_PROJECT_TYPE) => {
    const RESERVATION_TYPE_VALUE = {}
    const RESERVATION_TYPE_VALUE_ZH = {}
    const RESERVATION_TYPE_VALUE_NATURE = {}
    const allTypes = []

    for (let i = 0; i < SITE_RESERVATION_PROJECT_TYPE.length; i++) {
      const item = SITE_RESERVATION_PROJECT_TYPE[i]
      const { value, label } = item
      const values = value.split('-')
      const key = values[0]
      const nature = values[1]
      RESERVATION_TYPE_VALUE[key] = key
      RESERVATION_TYPE_VALUE_ZH[key] = label
      RESERVATION_TYPE_VALUE_NATURE[key] = nature
      allTypes.push({
        label,
        value: key,
        type: nature
      })
    }

    state.RESERVATION_TYPE_VALUE = RESERVATION_TYPE_VALUE
    state.RESERVATION_TYPE_VALUE_ZH = RESERVATION_TYPE_VALUE_ZH
    state.RESERVATION_TYPE_VALUE_NATURE = RESERVATION_TYPE_VALUE_NATURE
    state.allTypes = allTypes
  },
  setCurrentUserCodeTypes: (state, dicts) => {
    const currentUserCodeTypes = []
    const { value } = dicts[0]
    const types = value.split('-')

    for (let i = 0; i < types.length; i++) {
      const type = types[i]
      currentUserCodeTypes.push({
        label: state.RESERVATION_TYPE_VALUE_ZH[type],
        value: state.RESERVATION_TYPE_VALUE[type],
        type: state.RESERVATION_TYPE_VALUE_NATURE[type]
      })
    }
    state.currentUserCodeTypes = currentUserCodeTypes
  }
}

const actions = {
  async init({ dispatch, commit, rootState }) {
    const { user } = rootState
    const code = user?.user?.office?.code
    await dispatch('getSiteReservationProjectType')
    await dispatch('getUserCodeTypes', code)
  },
  getSiteReservationProjectType({ commit }) {
    return new Promise((resolve, reject) => {
      dictApi.getDictList('SITE_RESERVATION_PROJECT_TYPE').then(res => {
        commit('SITE_RESERVATION_PROJECT_TYPE', res)
        commit('SET_RESERVATION_TYPE', res)

        resolve(res)
      }).catch(e => {
        reject(e)
      })
    })
  },
  getUserCodeTypes({ commit }, code) {
    return new Promise((resolve, reject) => {
      dictApi.getDictList(`${code}_PROJECT_TYPE`).then(res => {
        res.length && commit('setCurrentUserCodeTypes', res)

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
