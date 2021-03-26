
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

Vue.use(ElementUI)

import Vue from 'vue'

import Cookies from 'js-cookie'

import 'normalize.css/normalize.css' // a modern alternative to CSS resets

import Element from 'element-ui'
import './styles/element-variables.scss'
// import enLang from 'element-ui/lib/locale/lang/en'// 如果使用中文语言包请默认支持，无需额外引入，请删除该依赖

import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'
import { hasRolePermission, hasRoleUserPermission } from '@/utils/permission'
import { Form } from 'element-ui'

import './icons' // icon
import './permission' // permission control
import './utils/error-log' // error log
import '@/assets/custom-theme/share.css'
// 引入样式easytable
import 'vue-easytable/libs/themes-base/index.css'
import { VTable } from 'vue-easytable'
Vue.component(VTable.name, VTable)
// 引入viewerjs
import 'viewerjs/dist/viewer.css'
import { preview } from '@/utils/preview'

import * as filters from './filters' // global filters
import api from '@/api/index' // 导入api接口
import check_all from '@/utils/check'
/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online ! ! !
 */
import components from '@/utils/components'
if (process.env.NODE_ENV === 'production') {
  const { mockXHR } = require('../mock')
  mockXHR()
}
// import echarts from 'echarts' // 引入Echarts，
// Vue.prototype.$echarts = echarts // 定义为全局变量
Vue.use(Form)
Vue.use(components)
Vue.use(check_all)
Vue.use(Element, {
  size: Cookies.get('size') || 'medium' // set element-ui default size
  // locale: enLang // 如果使用中文，无需设置，请删除
})

// register global utility filters
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

Vue.config.productionTip = false
Vue.prototype.$api = api // 将api挂载到vue的原型上
Vue.prototype.$viewer = preview // 挂在全局预览函数
Vue.prototype.hasRolePermission = hasRolePermission
Vue.prototype.hasRoleUserPermission = hasRoleUserPermission

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
