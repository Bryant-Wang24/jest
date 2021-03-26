import { DEPARTMENT_KEY } from '@/common/user'
const getters = {
  sidebar: state => state.app.sidebar,
  size: state => state.app.size,
  device: state => state.app.device,
  visitedViews: state => state.tagsView.visitedViews,
  cachedViews: state => state.tagsView.cachedViews,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  introduction: state => state.user.introduction,
  roles: state => state.user.roles,
  permission_routes: state => state.permission.routes,
  jspRoutes: state => state.permission.jspRoutes,
  errorLogs: state => state.errorLog.logs,
  userInfo: state => state.user.user,
  filterForm: state => state.schedule.filterForm,
  taxCode: state => state.customerMsg.taxcode,
  office: state => state.user?.user?.office || { code: DEPARTMENT_KEY.SALES_DEPARTMENT },
  siteList: state => state.handoverSlipMgmt.siteList,
  buttons: state => state.user.buttonList,
  // 客户相关
  CUSTOMER_INDUSTRY: state => state.customerMsg.industry,
  CUSTOMER_TYPE_ARRAY: state => state.customerMsg.CUSTOMER_TYPE_ARRAY,
  CUSTOMER_TYPE_OBJECT: state => {
    const obj = {}
    state.customerMsg.CUSTOMER_TYPE_ARRAY.forEach(t => {
      const { value, label } = t
      obj[value] = label
    })
    return obj
  },
  CUSTOMER_TYPE: state => {
    const CUSTOMER_TYPE_ARRAY = state.customerMsg.CUSTOMER_TYPE_ARRAY
    const CUSTOMER_TYPE = state.customerMsg.CUSTOMER_TYPE
    const arr = []
    for (let i = 0; i < CUSTOMER_TYPE_ARRAY.length; i++) {
      const t = CUSTOMER_TYPE_ARRAY[i]
      const { value, label } = t
      if (CUSTOMER_TYPE.includes(value)) {
        arr.push({ value, label })
      }
    }
    return arr
  },
  CUSTOMER_STAR: state => state.customerMsg.CUSTOMER_STAR,
  CUSTOMER_STAR_OBJECT: state => {
    const obj = {}
    state.customerMsg.CUSTOMER_STAR.forEach(t => {
      const { value, label } = t
      obj[value] = label
    })
    return obj
  },
  COMPANY_SCALE: state => state.customerMsg.COMPANY_SCALE,
  CUSTOMER_ACTIVE_STATE: state => state.customerMsg.CUSTOMER_ACTIVE_STATE,
  CUSTOMER_ACTIVE_STATE_OBJECT: state => {
    const obj = {}
    state.customerMsg.CUSTOMER_ACTIVE_STATE.forEach(t => {
      const { value, label } = t
      obj[value] = label
    })
    return obj
  },
  previewList: state => state.preview.list,
  previewOptions: state => state.preview.options
}
export default getters
