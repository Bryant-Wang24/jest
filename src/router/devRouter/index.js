import CustomerMsg from '../modules/CustomerMsg'
import Agreement from '../modules/Agreement'
import Market from '../modules/Market'
import Example from '../modules/Example'
import TaskBook from '../modules/TaskBook'
import content from '../modules/content'
import siteMarket from '../modules/siteMarket'
import Cockpit from '../modules/Cockpit'
import report from '../modules/report'
import systemManagement from '../modules/systemManagement'
import BaseConfig from '../modules/BaseConfig'
import token from '../modules/token'
import xxxx from '../modules/xxxx'

const env = process.env.NODE_ENV
const devRouter = [
  ...CustomerMsg, // 客户管理
  ...Agreement, // 业务管理 - 财务管理
  ...Market, // 销售管理
  ...Example, // 基础配置
  ...TaskBook, // 任务书 - 项目统筹
  ...content, // 资料库
  ...siteMarket, // 场地销售
  ...Cockpit, // 驾驶舱
  ...report, // 报表中心
  ...systemManagement, // 菜单管理
  ...BaseConfig, // 基础信息
  ...token, // 口令工具
  ...xxxx
]
let router = []
if (env === 'development') {
  router = devRouter
} else if (env === 'production') {
  router = []
}

export default router
