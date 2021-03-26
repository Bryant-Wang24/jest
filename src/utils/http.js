/* eslint-disable no-debugger */
/**
 * axios封装
 * 请求拦截、响应拦截、错误统一处理
 */
import axios from 'axios'
import router from '@/router'
import { Message } from 'element-ui'
import { removeLoginInfo } from '@/utils/auth'
// import store from '@/store'
// 声明一个数组用于存储每个ajax请求的取消函数和ajax标识
const pending = []
const CancelToken = axios.CancelToken
const unblockAPIS = []
// TODO 临时增加重复调用白名单
unblockAPIS.push(/\/rest\/customer\/taxCode/)
unblockAPIS.push(/\/rest\/SchdulingView\/list/)
unblockAPIS.push(/\/rest\/handover\/page/)
unblockAPIS.push(/office/)
unblockAPIS.push(/\/api\/approval/)
unblockAPIS.push(/\/rest\/taskLinkDetail\/save/)
unblockAPIS.push(/\/datalib\/node\/page/)
unblockAPIS.push(/\/rest\/datalib\/node\/batch\/upload/)
const removePending = (ajaxRequest) => {
  for (let i = 0; i < unblockAPIS.length; i++) {
    const pattern = unblockAPIS[i]
    if (pattern.test(ajaxRequest.url)) {
      return
    }
  }
  for (const p in pending) {
    // 当前请求在数组中存在时执行函数体
    if (pending[p].u === ajaxRequest.url + '&' + ajaxRequest.method) {
      // 执行取消操作
      pending[p].f('重复发送请求:' + ajaxRequest.url)
      // 把这条记录从数组中移除
      pending.splice(p, 1)
    }
  }
}

/**
 * 跳转登录页
 * 携带当前页面路由，以期在登录页面完成登录后返回当前页面
 */
const toLogin = () => {
  router.replace({
    path: '/login',
    query: { redirect: router.currentRoute.fullPath }
  })
}

/**
 * 请求失败后的错误统一处理
 * @param {Number} status 请求失败的状态码
 */
const errorHandle = (status, other) => {
  // 状态码判断
  switch (status) {
    // 401: 未登录状态，跳转登录页;token过期,清除token并跳转登录页
    case 400:
      Message({
        message: other || '请求出错，请重试',
        type: 'error'
      })
      break
    case 401:
      Message({
        message: '登录过期，请重新登录',
        type: 'error'
      })
      removeLoginInfo()
      setTimeout(() => {
        toLogin()
      }, 1000)
      break
    case 403:
      Message({
        message: other || '权限不足',
        type: 'error'
      })
      break
    case 404:
      Message({
        message: other || '请求的资源不存在',
        type: 'error'
      })
      break
    // case 413:
    //   Message({
    //     message: '上传文件过大',
    //     type: 'error'
    //   })
    //   break
    case 500:
      Message({
        message: other || '请求异常，请重试',
        type: 'error'
      })
      break
    case 502:
      Message({
        message: other || '服务器出错，请重试',
        type: 'error'
      })
      break
    default:
      Message({
        message: other,
        type: 'error'
      })
  }
}

// 创建axios实例
var instance = axios.create({ timeout: 1000 * 12 })
// 设置post请求头
instance.defaults.withCredentials = true
instance.defaults.headers.post['Content-Type'] = 'application/json'
/**
 * 请求拦截器
 * 每次请求前，如果存在token则在请求头中携带token
 */
instance.interceptors.request.use(
  config => {
    // 在一个ajax发送前执行一下取消操作
    removePending(config)
    config.cancelToken = new CancelToken((c) => {
      // 这里的ajax标识是用请求地址&请求方式拼接的字符串
      pending.push({ u: config.url + '&' + config.method, f: c })
    })
    // debugger
    // 登录流程控制中，根据本地是否存在token判断用户的登录情况
    // 但是即使token存在，也有可能token是过期的，所以在每次的请求头中携带token
    // 后台根据携带的token判断用户的登录情况，并返回给我们对应的状态码
    // 而后我们可以在响应拦截器中，根据状态码进行一些统一的操作。
    // const token = localStorage.getItem('token')
    // const lang = localStorage.getItem('lang')
    // lang && (config.headers['Accept-Language'] = lang)
    // token && (config.headers['x-auth-token'] = token)
    return config
  },
  error => Promise.error(error))

// 响应拦截器
instance.interceptors.response.use(
  // 请求成功
  res => {
    // 在一个ajax响应后再执行一下取消操作，把已经完成的请求从pending中移除
    removePending(res.config)
    if (res.status === 200) {
      // 登陆成功,保存token
      // if (res.headers['x-auth-token']) {
      //   localStorage.setItem('token', res.headers['x-auth-token'])
      // }
      // if ((!res.data.success) && res.data.errorMsg) {
      //     message.error(res.data.errorMsg)
      // }
      // 自定义错误列表中的错误不进行默认错误提示弹出
      // const customErrList = ['liveRounds/role']
      // if (!res.data.success && !(res.config.url && customErrList.find(apiPath => res.config.url.includes(apiPath)))) {
      //   Message({
      //     message: res.data.errorMsg || '数据错误，请稍后重试。',
      //     type: 'error'
      //   })
      // }
      return Promise.resolve(res.data)
    } else {
      return Promise.reject(res)
    }
  },
  // 请求失败
  error => {
    const { response } = error
    if (response) {
      // 请求已发出，但是不在2xx的范围
      errorHandle(response.status, response.data.message)
      return Promise.reject(response)
    } else {
      // 处理断网的情况
      // eg:请求超时或断网时，更新state的network状态
      // network状态在app.vue中控制着一个全局的断网提示组件的显示隐藏
      // 关于断网组件中的刷新重新获取数据，会在断网组件中说明
      // if (!window.navigator.onLine) {
      //   store.commit('changeNetwork', false)
      // } else {
      return Promise.reject(error)
      // }
    }
  })

export default instance
