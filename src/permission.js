import router from './router'
import store from './store'
// import { Message } from 'element-ui'
// import NProgress from 'nprogress' // progress bar
// import 'nprogress/nprogress.css' // progress bar style
import { setToken, getToken } from '@/utils/auth' // get token from cookie
import getPageTitle from '@/utils/get-page-title'
// import { initMenu } from '@/common/menu'

// NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = ['/login', '/auth-redirect'] // 不用重定向的名单

router.beforeEach(async(to, from, next) => {
  console.log('检测死循环')
  store.commit('router/SET_TO', to)
  store.commit('router/SET_FROM', from)
  // start progress bar
  // NProgress.start()

  if (to.query.Authorization) {
    setToken(to.query.Authorization)
  }
  // set page title
  document.title = getPageTitle(to.meta.title)
  const hasToken = getToken()
  // const hasRoutes = localStorage.getItem('ROUTES')
  // console.log('hasToken', hasToken)
  if (hasToken) {
    if (to.path === '/login') {
      next({ path: '/' })
      // NProgress.done()
    } else {
      next()
    }
  } else {
    /* has no token */
    /* 没有登录的情况 */

    if (whiteList.indexOf(to.path) !== -1) {
      // in the free login whitelist, go directly
      // 在白名单中，直接下一步
      next()
    } else {
      // other pages that do not have permission to access are redirected to the login page.
      // 其他没权限直接重定向到登录页面.
      next(`/login?redirect=${to.path}`)
      // NProgress.done()
    }
  }
})
// router.afterEach(() => {
//   // finish progress bar
//   NProgress.done()
// })
