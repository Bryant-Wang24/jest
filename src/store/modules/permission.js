import { asyncRoutes, constantRoutes } from '@/router'
import { escape2Html } from '@/utils/validate'
import userApi from '@/api/user'
import store from '@/store'
import Layout from '@/layout'
import router from '@/router'

import systemManagement from '@/router/routerMapPage/systemManagement.js'
import baseConfig from '@/router/routerMapPage/baseConfig.js'

const components = {
  ...systemManagement.components,
  ...baseConfig.components,
  '/views/customerMsg/application': () => import('@/views/customerMsg/application'),
  '/views/customerMsg/AddCustomer': () => import('@/views/customerMsg/AddCustomer'),
  '/views/customerMsg/EditCustomer': () => import('@/views/customerMsg/EditCustomer'),
  '/views/customerMsg/customerInfo': () => import('@/views/customerMsg/customerInfo'),
  '/views/customerMsg/result': () => import('@/views/customerMsg/result'),
  '/views/customerMsg/management': () => import('@/views/customerMsg/management'),
  '/views/customerMsg/ManagementEditCustomer': () => import('@/views/customerMsg/ManagementEditCustomer'),
  '/views/customerMsg/scheduleview': () => import('@/views/customerMsg/scheduleview'),
  '/views/priceList/priceList': () => import('@/views/priceList/priceList'),
  '/views/priceList/detailed': () => import('@/views/priceList/detailed'),
  '/views/site/Site': () => import('@/views/site/Site'),
  '/views/siteMarket/siteMarket': () => import('@/views/siteMarket/siteMarket'),
  '/views/siteMarket/siteMarketTime': () => import('@/views/siteMarket/siteMarketTime'),
  '/views/SiteReserve/SiteReserve': () => import('@/views/SiteReserve/SiteReserve'),
  // '/views/SiteReserve/addSiteRes': () => import('@/views/SiteReserve/addSiteRes'),
  '/views/SiteReserve/AddSiteProjectForm': () => import('@/views/SiteReserve/AddSiteProjectForm'),
  '/views/SiteReserve/EditSiteProjectForm': () => import('@/views/SiteReserve/EditSiteProjectForm'),
  '/views/SiteReserve/ChangeSiteProjectForm': () => import('@/views/SiteReserve/ChangeSiteProjectForm'),
  '/views/siteMarket/projectData': () => import('@/views/siteMarket/projectData'),
  '/views/SiteReserve/siteReserveInfo': () => import('@/views/SiteReserve/siteReserveInfo'),
  '/views/SiteReserve/rankingInforMation': () => import('@/views/SiteReserve/rankingInforMation'),
  '/views/SiteReserve/components/rankingInforMationInfo': () => import('@/views/SiteReserve/components/rankingInforMationInfo'),
  '/views/SiteReserve/submitResult': () => import('@/views/SiteReserve/submitResult'),
  '/views/componentJSP/componentJSP': () => import('@/views/componentJSP/componentJSP'),
  '/views/contract/contract': () => import('@/views/contract/contract'),
  '/views/contract/contractAdd': () => import('@/views/contract/contractAdd'),
  '/views/contract/contractEdit': () => import('@/views/contract/contractEdit'),
  '/views/sale/sale': () => import('@/views/sale/sale'),
  '/views/sale/saleAdd': () => import('@/views/sale/saleAdd'),
  '/views/sale/saleDetails': () => import('@/views/sale/saleDetails'),
  '/views/billManagement/components/applayInvoiceForm': () => import('@/views/billManagement/components/applayInvoiceForm'),
  '/views/billManagement/components/editInvoiceForm': () => import('@/views/billManagement/components/editInvoiceForm'),
  '/views/billManagement/components/applayReceiptForm': () => import('@/views/billManagement/components/applayReceiptForm'),
  '/views/billManagement/components/editReceiptForm': () => import('@/views/billManagement/components/editReceiptForm'),
  '/views/billManagement/components/catInvoice': () => import('@/views/billManagement/components/catInvoice'),
  '/views/billManagement/components/catReceipt': () => import('@/views/billManagement/components/catReceipt'),
  '/views/billManagement/components/applayFeedback': () => import('@/views/billManagement/components/applayFeedback'),
  '/views/billManagement/bill': () => import('@/views/billManagement/bill'),
  '/views/billManagement/billEdit': () => import('@/views/billManagement/billEdit'),
  '/views/billManagement/components/invoiceList': () => import('@/views/billManagement/components/invoiceList'),
  '/views/billManagement/components/receiptList': () => import('@/views/billManagement/components/receiptList'),
  '/views/accountMangement/account': () => import('@/views/accountMangement/account'),
  '/views/accountMangement/collection': () => import('@/views/accountMangement/collection'),
  '/views/depositMsg/depositList': () => import('@/views/depositMsg/depositList'),
  '/views/depositMsg/collectionPro': () => import('@/views/depositMsg/collectionPro'),
  '/views/refund/refund': () => import('@/views/refund/refund'),
  '/views/refund/refundEdit': () => import('@/views/refund/refundEdit'),
  '/views/refund/refundEditNew': () => import('@/views/refund/refundEditNew'),
  '/views/handoverSlipMgmt/index': () => import('@/views/handoverSlipMgmt/index'),
  '/views/shop/shop': () => import('@/views/shop/shop'),
  '/views/shop/shopAdd': () => import('@/views/shop/shopAdd'),
  '/views/shopCustomers/shopList': () => import('@/views/shopCustomers/shopList'),
  '/views/shopCustomers/shopListAdd': () => import('@/views/shopCustomers/shopListAdd'),
  '/views/shopCustomers/result': () => import('@/views/shopCustomers/result'),
  '/views/shop/collection': () => import('@/views/shop/collection'),
  '/views/payment/payment': () => import('@/views/payment/payment'),
  '/views/payment/paymentEdit': () => import('@/views/payment/paymentEdit'),
  '/views/taskBag/taskBag': () => import('@/views/taskBag/taskBag'),
  '/views/taskBag/taskDetail': () => import('@/views/taskBag/taskDetail'),
  '/views/taskBook/taskBookAdmin': () => import('@/views/taskBook/taskBookAdmin'),
  '/views/taskBook/compileBook': () => import('@/views/taskBook/compileBook'),
  '/views/taskBook/lookTaskBook': () => import('@/views/taskBook/lookTaskBook'),
  '/views/taskBook/taskTail': () => import('@/views/taskBook/taskTail'),
  '/views/taskBook/taskParticulars': () => import('@/views/taskBook/taskParticulars'),
  '/views/taskBook/submitResult': () => import('@/views/taskBook/submitResult'),
  '/views/content/material/material': () => import('@/views/content/material/material'),
  '/views/content/download/download': () => import('@/views/content/download/download'),
  '/views/content/download/downloadEdit': () => import('@/views/content/download/downloadEdit'),
  '/views/approve/approve': () => import('@/views/approve/approve'),
  '/views/approve/approveFlow': () => import('@/views/approve/approveFlow'),
  '/views/report/reportProject': () => import('@/views/report/reportProject'),
  '/views/report/reportScheduling': () => import('@/views/report/reportScheduling'),
  '/views/report/reportContract': () => import('@/views/report/reportContract'),
  '/views/report/reportInvoice': () => import('@/views/report/reportInvoice'),
  '/views/CockpitExhibition/CockpitExhibition': () => import('@/views/CockpitExhibition/CockpitExhibition'),
  '/views/CockpitExhibition/ConferenceDataCenter': () => import('@/views/CockpitExhibition/ConferenceDataCenter'),
  '/views/CockpitExhibition/CockpitFinance': () => import('@/views/CockpitExhibition/CockpitFinance'),
  '/views/Token/TokenCreate': () => import('@/views/Token/TokenCreate'),
  '/views/report/reportCredentials': () => import('@/views/report/reportCredentials')
}

const names = {
  ...systemManagement.name,
  ...baseConfig.name,
  // 客户管理
  '/CustomerMsg': 'CustomerMsg',
  'Application': 'Application',
  'Application/AddCustomer': 'AddCustomer',
  'Application/EditCustomer': 'EditCustomer',
  'Application/CustomerInfo': 'ApplicationCustomerInfo',
  // 'Application/Result': 'ApplicationResult',
  'Management': 'Management',
  'Management/CustomerInfo': 'ManagementCustomerInfo',
  'Management/EditCustomer': 'ManagementEditCustomer',
  // 业务管理
  '/agreement': 'Agreement',
  // 业务管理 - 合同
  'contract': 'contract',
  'contractAdd/:id/:type': 'contractAdd',
  'contractEdit/:id': 'contractEdit',
  'contractAudit/:id': 'contractAudit',
  // 资料交接
  'handoverSlipMgmt': 'handoverSlipMgmt',
  // 业务管理 - 台账管理
  'AccountManage': 'AccountManage',
  'collection': 'collection',
  'depositList': 'DepositList',
  'collectionPro': 'CollectionPro',
  // 业务管理 - 退款管理
  'refund': 'refund',
  'refundEdit/:id': 'refundEdit',
  'refundAudit/:id': 'refundAudit',
  'refundEditNew/:id': 'refundEditNew',
  // 业务管理 - 票据管理
  'BillManagement': 'BillManagement',
  'billEdit/:id': 'billEdit',
  'applayForm': 'ApplayInvoiceForm',
  'editInvoiceForm': 'EditInvoiceForm',
  'applayReceipt': 'ApplayReceiptForm',
  'catInvoice': 'catInvoice',
  'catReceipt': 'catReceipt',
  'applayFeedback': 'applayFeedback',
  // 销售管理
  '/market': 'Market',
  'sale/:id/:type': 'sale',
  'saleAdd/:id/:type': 'SaleAdd',
  'saleEdit/:id/:type': 'saleEdit',
  'saleDetails/:id': 'saleDetails',
  'siteMarket': 'siteMarket',
  'siteMarket/siteMarketTime': 'siteMarketTime',
  'SiteReserve': 'SiteReserve',
  'RankingInforMation': 'RankingInforMation',
  'RankingInforMationInfo/:id': 'RankingInforMationInfo',
  // 'SiteReserve/AddSiteRes': 'AddSiteRes',
  'SiteReserve/AddSiteProjectForm': 'AddSiteProjectForm',
  'SiteReserve/EditSiteProjectForm': 'EditSiteProjectForm',
  'SiteReserve/ChangeSiteProjectForm': 'ChangeSiteProjectForm',
  'siteMarket/projectData': 'projectData',
  'SiteReserve/SiteReserveInfo': 'SiteReserveInfo',
  'SiteReserve/ResSubmitResult': 'ResSubmitResult',
  'ScheduleView': 'ScheduleView',
  // 销售管理 - 商铺
  'shop': 'Shop',
  'shopAdd': 'shopAdd',
  'shopEdit/:id': 'shopEdit',
  // 销售管理 - 商铺客户
  'shopList': 'shopList',
  'shopListAdd': 'ShopListAdd',
  'shopListEdit/:id/:type': 'shopListEdit',
  'result/:id': 'ShopResult',
  // 销售管理 - 商铺-收款列表
  'collection/:id': 'ShopCollection',
  // 销售管理 - 付款通知书
  'payment': 'payment',
  'paymentEdit/:id': 'paymentEdit',
  // 基础配置
  '/example': 'Example',
  'priceList': 'priceList',
  'detailed/:id?': 'detailed',
  'site': 'Site',
  // 基础配置 - 任务包配置
  'taskBag': 'taskBag',
  'taskBag/taskDetail': 'taskDetail',
  // 基础配置 - 审批流
  'approve': 'Approve',
  'approveFlow/:eventKey': 'ApproveFlow',
  // 任务书
  '/TaskBook': 'TaskBook',
  'TaskBookAdmin': 'TaskBookAdmin',
  'TaskBookAdmin/CompileBook': 'CompileBook',
  'TaskBookAdmin/lookbook': 'LookBook',
  'TaskBookAdmin/TaskTail': 'TaskTail',
  'TaskBookAdmin/CompileBook/taskParticulars': 'TaskParticulars',
  'TaskBookAdmin/submitResult': 'submitResult',
  // 素材库
  '/content': 'content',
  'material': 'material',
  // 下载中心
  'download': 'download',
  'downloadEdit/:id/:type': 'downloadEdit',
  // 报表中心
  '/report': 'report',
  'reportProject': 'reportProject',
  'reportScheduling': 'reportScheduling',
  'reportContract': 'reportContract',
  'reportInvoice': 'reportInvoice',
  'reportCredentials': 'reportCredentials',
  // 驾驶舱
  'CockpitExhibition': 'CockpitExhibition',
  'ConferenceDataCenter': 'ConferenceDataCenter',
  'CockpitFinance': 'CockpitFinance',
  // 口令
  'TokenCreate': 'TokenCreate'
}

/**
 * Use meta.role to determine if the current user has permission
 * @param roles
 * @param route
 */
function hasPermission(roles, route) {
  if (route.meta && route.meta.roles) {
    return roles.some(role => route.meta.roles.includes(role))
  } else {
    return true
  }
}

/**
 * Filter asynchronous routing tables by recursion
 * @param routes asyncRoutes
 * @param roles
 */
export function filterAsyncRoutes(routes, roles) {
  const res = []

  routes.forEach(route => {
    const tmp = { ...route }
    if (hasPermission(roles, tmp)) {
      if (tmp.children) {
        tmp.children = filterAsyncRoutes(tmp.children, roles)
      }
      res.push(tmp)
    }
  })

  return res
}

// export const initButtons = (routes, buttonList) => {
//   routes.forEach(item => {
//     const { buttons, name } = item
//     if (buttons) {
//       for (const key in buttons) {
//         const value = buttons[key]
//         buttonList[`${name}-${key}`] = value
//       }
//     }
//     if (item.children && item.children.length > 0) {
//       initButtons(item.children, buttonList)
//     }
//   })
// }

/**
 * 后台查询的菜单数据拼装成路由格式的数据
 */
export const initTreeData = (routes, list, buttonList) => {
  // const { dispatch } = store
  // const buttonList = {}
  list.forEach(item => {
    const { isJsp, component, meta, children, permission, id, href, parentId, name, isShow } = item
    if (!isJsp && !component) { // component为空为前端页面的按钮权限数组
      buttonList.push(permission)
    } else if (isJsp && !component) { // jsp页面的权限不做处理
      //
    } else { // 处理jsp和普通前端路由
      const metaJson = !meta ? {} : JSON.parse(escape2Html(meta))
      const path = (isJsp && component) ? href ? `/${parentId}` + href : `/${id}` : href
      metaJson['title'] = name
      metaJson['href'] = href
      const menu = {
        path,
        component: (component === '#' && parentId === 'root') ? Layout : components[component],
        redirect: metaJson.redirect || null,
        meta: metaJson,
        name: names[path] || '',
        children: [],
        hidden: isShow === '0',
        alwaysShow: metaJson.alwaysShow || false
      }
      if (children && children.length > 0) {
        initTreeData(menu.children, children, buttonList)
      }
      routes.push(menu)
    }
  })
}

const state = {
  routes: [],
  addRoutes: [],
  jspRoutes: []
}

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes
    state.routes = constantRoutes.concat(routes)
    // state.routes = [...constantRoutes, ...asyncRoutes, ...state.jspRoutes]
  },
  SET_NEWROUTES: (state, routes) => {
    state.routes = [...state.routes, ...routes]
  },
  SET_JSPROUTES: (state, routes) => {
    state.jspRoutes = routes
  }
}

const actions = {
  generateRoutes({ commit }, roles) {
    const { dispatch, commit: globalCommit } = store
    return new Promise(resolve => {
      // 进行展馆登录
      dispatch('user/ssoLogin').then(async loginRes => {
        if (loginRes.resultCode === -3) {
          await dispatch('user/logout')
          router.push(`/login`)
          return
        }
        const res = loginRes.data
        const userid = res?.body?.user?.id
        // 查询后台菜单列表
        const loadMenuData = []
        userApi.getUserInfoAndMenuList(userid).then(menuRes => {
          const { menu } = menuRes
          globalCommit('systemManagement/menu/setMenuList', menu, { root: true })
          Object.assign(loadMenuData, menu)
          const tempAsyncRoutes = Object.assign([], asyncRoutes)
          const buttonList = []
          localStorage.setItem('ROUTES', JSON.stringify(tempAsyncRoutes))
          initTreeData(tempAsyncRoutes, loadMenuData, buttonList)
          commit('SET_ROUTES', tempAsyncRoutes)
          // initButtons(tempAsyncRoutes, buttonList)
          dispatch('user/buttonList', buttonList)
          resolve(tempAsyncRoutes)
        })
      }).catch(e => {
      })
    })
  },
  setRoutes({ commit }, routes) {
    return new Promise(resolve => {
      const loadMenuData = []
      Object.assign(loadMenuData, routes)
      const tempAsyncRoutes = Object.assign([], asyncRoutes)
      initTreeData(tempAsyncRoutes, loadMenuData)
      commit('SET_ROUTES', tempAsyncRoutes)
      resolve(tempAsyncRoutes)
    })
  },
  addJspMenu({ commit }, menuList) {
    return new Promise(resolve => {
      // let accessedRoutes
      // if (roles.includes('admin')) {
      //   accessedRoutes = asyncRoutes || []
      // } else {
      //   accessedRoutes = filterAsyncRoutes(asyncRoutes, roles)
      // }
      commit('SET_JSPROUTES', menuList)
      // commit('SET_NEWROUTES', menuList)
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
