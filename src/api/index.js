/**
 * api接口的统一出口
 */

import example from './example.js'
import customerMsg from './customerMsg'
import user from './user.js'
import priceList from './priceList.js'
import siteList from './site.js'
import billApi from './bill.js'
import depositMsg from './depositMsg.js'
import refund from './refund.js'
import sale from './sale.js'
import contract from './contract.js'
import siteMarketList from './siteMarket.js'
import schedule from './schedule.js'
import siteReserveList from './siteReserve'
import account from './account'
import taskBookList from './taskBook'
import taskBagList from './taskBag.js'
import shop from './shop'
import handoverSlipMgmt from './handoverSlipMgmt'
import shopCustomer from './shopCustomer'
import dict from './dict'
import payment from './payment'
import content from './content'
import approve from './approve'
import file from './file'
import report from './report'
import token from './token'
import flihtdeckApi from './FlightDeck'
import finance from './finance'
import systemManagement from './systemManagement'
import baseConfig from './baseConfig'
import ProjectFile from './ProjectFile'

export default {
  example,
  user,
  priceList, // 价目表
  customerMsg,
  siteList,
  billApi,
  depositMsg,
  refund, // 押金退款
  sale, // 订单管理
  contract, // 合同管理
  siteMarketList,
  schedule,
  siteReserveList,
  account,
  taskBookList,
  taskBagList, // 任务包
  shop, // 商铺店铺管理
  handoverSlipMgmt,
  shopCustomer, // 商铺客户管理
  dict, // 字典
  payment, // 付款通知书
  content, // 资料库
  approve, // 审批流
  file, // 文件系统
  report, // 报表中心
  token, // 口令
  flihtdeckApi,
  finance, // 财务数据中心
  systemManagement,
  baseConfig,
  ProjectFile // 项目相关文件
}
