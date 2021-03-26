import { hasRolePermission, hasRoleUserPermission } from '@/utils/permission'

export const ACTION = {
  INSERT: 'INSERT',
  BILLING_DEPOSIT: 'BILLING_DEPOSIT',
  PAY_ORDER: 'PAY_ORDER',
  TURN_DEPOSIT: 'TURN_DEPOSIT',
  INSERT_BY_TURN: 'INSERT_BY_TURN',
  WITHDRAW_DEPOSIT: 'WITHDRAW_DEPOSIT',
  WITHDRAW_ORDER: 'WITHDRAW_ORDER'
}

export const ACTION_TEXT = {
  [ACTION.INSERT]: '新增',
  [ACTION.BILLING_DEPOSIT]: '押金入账',
  [ACTION.PAY_ORDER]: '订单收款',
  [ACTION.TURN_DEPOSIT]: '押金转款',
  [ACTION.INSERT_BY_TURN]: '转款新增',
  [ACTION.WITHDRAW_DEPOSIT]: '撤回',
  [ACTION.WITHDRAW_ORDER]: '撤回'
}

export const STATE_OPTIONS = [{ // 入账状态
  value: 'NO_BILLING,HAS_BILLING,SOME_BILLING',
  label: '全部'
}, {
  value: 'SOME_BILLING',
  label: '部分入账'
}, {
  value: 'HAS_BILLING',
  label: '已入账'
}, {
  value: 'NO_BILLING',
  label: '未入账'
}]

export const STATE = {
  ALL: 'NO_BILLING,HAS_BILLING,SOME_BILLING',
  SOME_BILLING: 'SOME_BILLING',
  HAS_BILLING: 'HAS_BILLING',
  NO_BILLING: 'NO_BILLING'
}

export const STATE_OBJECT = {
  SOME_BILLING: '部分入账',
  HAS_BILLING: '已入账',
  NO_BILLING: '未入账'
}

export const SURPLUS_OPTIONS = [
  {
    value: 1,
    label: '大于0'
  },
  {
    value: 0,
    label: '等于0'
  }
] // 可用余额

export const TYPE = {
  ADVANCE_PAYMENT: '预付款',
  DEPOSIT: '押金',
  CONSTRUCTION_BOND: '施工保证金',
  STORE_DEPOSIT: '商铺押金'
}

export const TYPE_OPTIONS = [{
  value: 'ADVANCE_PAYMENT',
  label: '预付款'
}, {
  value: 'DEPOSIT',
  label: '押金'
}, {
  value: 'CONSTRUCTION_BOND',
  label: '施工保证金'
}, {
  value: 'STORE_DEPOSIT',
  label: '商铺押金'
}]

export const isShowCredit = (billingState) => {
  return (billingState === 'NO_BILLING' || billingState === 'SOME_BILLING') && hasRolePermission('DepositList_credit')
}

export const isShowTransfer = (billingState) => {
  return (billingState === 'HAS_BILLING' || billingState === 'SOME_BILLING') && hasRolePermission('DepositList_transfer')
}

export const isShowPay = (billingState) => {
  return (billingState === 'HAS_BILLING' || billingState === 'SOME_BILLING') && hasRolePermission('DepositList_pay')
}

export const isShowDelete = (billingState, userid) => {
  return billingState === 'NO_BILLING' && hasRoleUserPermission('DepositList_delete', userid)
}
