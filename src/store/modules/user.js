import base from '@/api/base'
import userApi from '@/api/user'
import { getToken, setToken, removeToken, removeLoginInfo } from '@/utils/auth'
import router, { resetRouter } from '@/router'
import store from '..'

const USER_INFO = window.localStorage.getItem('userInfo')

const commonDictRequest = (dispatch) => {
  // 公共字典数据（客户行业）
  dispatch('customerMsg/getIndustry')
  // 客户类型
  dispatch('customerMsg/getCustomerTypeArray')
  // 获取当前用户对应客户类型
  dispatch('customerMsg/getCustomerTypeByCode')
  // 获取客户星级
  dispatch('customerMsg/getCustomerStar')
  // 获取客户规模
  dispatch('customerMsg/getCustomerScale')
  // 获取客户活跃状态
  dispatch('customerMsg/getCustomerActiveState')

  dispatch('site/init') // 场地预定项目类型相关数据

  dispatch('refund/getRefundToken') //
  // 获取场地类型
  // dispatch('site/getSiteType')
  // 获取场地预定类型
  // dispatch('site/getSiteReservationType')
  // 获取退款查看凭证角色
}

const state = {
  token: getToken(),
  name: '',
  avatar: '',
  introduction: '',
  roles: [],
  menu: [], // jsp菜单
  buttonList: [], // 按钮权限列表
  user: USER_INFO && USER_INFO !== 'undefined' ? JSON.parse(USER_INFO) : {}
}

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_INTRODUCTION: (state, introduction) => {
    state.introduction = introduction
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  },
  SET_USER: (state, user) => {
    state.user = { ...state.user, ...user }
  },
  SET_MENU: (state, menu) => {
    state.menu = menu
  },
  SET_BUTTONLIST: (state, list) => {
    state.buttonList = list
  }
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    // const { username, password } = userInfo
    return new Promise((resolve, reject) => {
      userApi.firstLogin(userInfo)
        .then(response => {
          // if (response.status === 200) {
          const { token, jwtUser } = response.returnData
          setToken(token)
          window.localStorage.setItem('token', token)
          commit('SET_TOKEN', token)
          commit('SET_USER', { userId: jwtUser.id })
          resolve()
          // }
        })
        .catch(error => {
          reject(error)
        })
    })
  },

  // sso
  ssoLogin({ commit }) {
    const { dispatch } = store
    return new Promise((resolve, reject) => {
      userApi.ssoLogin()
        .then(response => {
          // 展馆登录后获取user信息
          const user = response.data.body?.user
          commit('SET_USER', user)
          window.localStorage.setItem('userInfo', JSON.stringify(user))
          resolve(response)
          // 登陆后在此调用字典相关数据
          commonDictRequest(dispatch)
        }).catch(error => {
          reject(error)
        })
    })
  },

  // getUserInfoAndMenuList({ commit }, userid) {
  //   return new Promise((resolve, reject) => {
  //     userApi.getUserInfoAndMenuList(userid).then(response => {
  //       const { User, menu } = response
  //       commit('SET_USER', User)
  //       commit('SET_MENU', menu)
  //       window.localStorage.setItem('userInfo', JSON.stringify(User))
  //       window.localStorage.setItem('menu', JSON.stringify(menu))
  //       resolve(response)
  //     }).catch(error => {
  //       reject(error)
  //     })
  //   })
  // },

  buttonList({ commit }, buttonList) {
    commit('SET_BUTTONLIST', buttonList)
  },

  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      // getInfo(state.token).then(response => {
      //   const { data } = response

      //   if (!data) {
      //     reject('Verification failed, please Login again.')
      //   }

      //   const { roles, name, avatar, introduction } = data

      //   // roles must be a non-empty array
      //   if (!roles || roles.length <= 0) {
      //     reject('getInfo: roles must be a non-null array!')
      //   }

      //   commit('SET_ROLES', roles)
      //   commit('SET_NAME', name)
      //   commit('SET_AVATAR', avatar)
      //   commit('SET_INTRODUCTION', introduction)
      //   resolve(data)
      // }).catch(error => {
      //   reject(error)
      // })
    })
  },

  // user logout
  // logout({ commit, state, dispatch }) {
  //   return new Promise((resolve, reject) => {
  //     logout(state.token)
  //       .then(() => {
  //         commit('SET_TOKEN', '')
  //         commit('SET_ROLES', [])
  //         removeToken()
  //         resetRouter()

  //         // reset visited views and cached views
  //         // to fixed https://github.com/PanJiaChen/vue-element-admin/issues/2485
  //         dispatch('tagsView/delAllViews', null, { root: true })

  //         resolve()
  //       })
  //       .catch(error => {
  //         reject(error)
  //       })
  //   })
  // },
  logout({ commit, state, dispatch }) {
    return new Promise((resolve, reject) => {
      commit('SET_TOKEN', '')
      commit('SET_MENU', [])
      // removeToken() // 清除token
      // removeCookie('JSESSIONID') // 清除JSESSIONID
      // localStorage.removeItem('menu')
      removeLoginInfo()

      // reset visited views and cached views
      // to fixed https://github.com/PanJiaChen/vue-element-admin/issues/2485
      dispatch('tagsView/delAllViews', null, { root: true })

      dispatch('ssoLogout')
      resolve()
    })
  },
  ssoLogout() {
    console.log(getToken())
    // debugger
    // setTimeout(() => {
    window.location.href = `${base.sso}auth/destroyToken?tokenUrl=${window.location.href.split('/#/')[0]}/%23/login`
    // }, 200)
  },
  redirectSSOLogin() {
    window.location.href = `${base.sso}auth/getVerificationToken?tokenUrl=${window.location.href.split('/#/')[0]}/%23/&platformName=${base.title}展览智慧化系统`
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      commit('SET_TOKEN', '')
      commit('SET_ROLES', [])
      removeToken()
      resolve()
    })
  },

  // dynamically modify permissions
  async changeRoles({ commit, dispatch }, role) {
    const token = role + '-token'

    commit('SET_TOKEN', token)
    setToken(token)

    const { roles } = await dispatch('getInfo')

    resetRouter()

    // generate accessible routes map based on roles
    const accessRoutes = await dispatch('permission/generateRoutes', roles, {
      root: true
    })
    // dynamically add accessible routes
    router.addRoutes(accessRoutes)

    // reset visited views and cached views
    dispatch('tagsView/delAllViews', null, { root: true })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
